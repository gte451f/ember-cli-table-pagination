import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';
const {underscore} = Ember.String;

export default Ember.Mixin.create(RouteMixin, {
    /**
     * set the sortField property as a query param so it will show up in the url
     * refreshModel affects route behavior when the value changes
     */
    queryParams: {
        sortField: {
            refreshModel: true
        },
        page: {
            refreshModel: false
        },
        perPage: {
            refreshModel: false
        }
    },

    //store a reference to the route's model
    //i couldn't figure out how to look this up
    modelName: 'set modelName in the route',

    //store a reference to the current route, since I don't know how to look this up
    currentRoute: 'set currentRoute in the route',

    currentParams: null,

    actions: {
        // action called from the button at the right of the number per page list
        refresh: function () {
            this.refresh();
        },

        /**
         * take in a sortField and store the new sortField in the controller
         * also infer the correct sort order (ASC or DESC)
         * works with query params
         * follows json:api conventions
         *
         * @param field
         */
        sortField: function (field) {
            field = field.underscore();
            var sortField = this.controller.get('sortField');
            var newSortOrder, sortOrder = this.controller.get('sortOrder');

            //sortField hasn't changed so we toggle sortOrder
            //check for the descending and ascending versions
            if (field === sortField || '-' + field === sortField) {
                if (sortOrder === '-') {
                    newSortOrder = '';
                    this.controller.set('sortOrder', '');
                } else {
                    newSortOrder = '-';
                    this.controller.set('sortOrder', '-');
                }
            }
            //always update the sortField..either the field changes or the order changes
            this.controller.set('sortField', this.controller.get('sortOrder') + field);
        },

        /**
         * sets a new param on the filterParams property
         * of the controller and fetch results with that
         *
         * It always return to page 1, because if the table
         * is in page 3 and set a filter with 1 result,
         * that page is empty
         */
        applyFilter: function(fieldName, filterValue) {
          var params = this.controller.get('filterParams');
          params[fieldName] = filterValue;
          this.controller.set('filterParams', params);
          if (this.controller.get('page') !== 1) {
            this.controller.set('page', 1);
          }
          this.refresh();
        },


        // take the supplied search field and ask the api to filter by it
        runQuickSearch: function () {
          if (this.controller.get('page') !== 1) {
            this.controller.set('page', 1);
          }
          this.refresh();
        },

        //general function to open a record from a paginated list
        //will use transitionTo by default
        open: function (record) {
            var controller = this.controller;
            //console.log(controller.get('modelName'));
            //my save function
            this.controller.transitionToRoute(controller.get('modelName'), record);

        },

        changePage: function(page) {
          this.controller.set('page', page);
          this.refresh();
        },

        changePerPage: function(perPage) {
          Ember.Logger.debug('changePerPage -> %s', perPage);
          this.controller.set('perPage', perPage);
          this.refresh();
        },

        changeSort: function(property, direction) {
          Ember.Logger.debug('property -> direction => %s -> %s', property, direction);
          let order = (direction === 'desc')? '-': '';
          this.controller.set('sortProperty', property);
          this.controller.set('sortDirection', direction);
          this.controller.set('sortField', `${order}${property}`);
        },

        loading: function(transition, originRoute) {
          let routeName = this.get('routeName');
          let controller = this.controllerFor(routeName);
          // check if the transition is to the same route but with a different "params" value.
          if (originRoute.routeName === transition.targetName || `${originRoute.routeName}.index` === transition.targetName) {
            // if so then do not bubble and set the showSpinner property on the controller
            controller.set('currentlyLoading', true);
            transition.promise.finally(() => {
              controller.set('currentlyLoading', false);
            });
            // do not bubble is triggered by not returning true
            return false;
          }
          return true;
        }

    },

  /**
   *  gather params from URL or from existing controller
   * @param params
   * @returns {{}}
   */
    getAllParams: function(params) {
        var controller = this.get('controller');
        var allParams = {};
        if (Ember.isPresent(controller)) {
          var name = controller.get('quickSearchField');
          var value = controller.get('quickSearch');
          var queryWith = controller.get('with');
          allParams = Ember.merge(params, {
            page: controller.get('page'),
            perPage: controller.get('perPage'),
            sortField: controller.get('sortField'),
            with: queryWith
          });

          if (Ember.isPresent(name) && Ember.isPresent(value)) {
            params[name] = '*' + value + '*';
          }

          let filterParams = this.controller.get('filterParams');
          for(let fieldName in filterParams) {
            let filterValue = filterParams[fieldName];
            if (Ember.typeOf(filterValue) !== 'null' && Ember.isPresent(filterValue)) {
              params[underscore(fieldName)] = '*' + filterValue + '*';
            }
          }

          // To pass already formatted params to the query
          let extraParams = this.controller.get('extraParams');
          for (let fieldName in extraParams) {
            params[underscore(fieldName)] = extraParams[fieldName];
          }
        } else {
          allParams = params;
        }
        return allParams;
    },

    /**
     * check the params passed in the route to introduce
     * new params to the findPaged method
     */
    model: function (params) {
      let allParams = this.getAllParams(params);
      this.currentParams = allParams;
      return this.findPaged(this.modelName, allParams);
    },

    //extend to pass route values onto controller for possible use
    setupController: function (controller, model) {
        this._super(controller, model);

        //pass route properties on to controller
        controller.set('currentParams', this.currentParams);
        controller.set('modelName', this.modelName);
        controller.set('controllerName', this.controllerName);
        controller.set('totalRecords', model.meta.total_record_count);
        let { sortField } = this.getAllParams({});
        if (sortField) {
          if (sortField.substring(0,1) === '-') {
            controller.set('sortDirection', 'desc');
            controller.set('sortProperty', sortField.substring(1));
          } else {
            controller.set('sortDirection', 'asc');
            controller.set('sortProperty', sortField);
          }
          controller.set('sortField', sortField);
        }
    }
});
