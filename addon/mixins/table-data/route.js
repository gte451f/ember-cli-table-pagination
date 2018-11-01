import { merge } from '@ember/polyfills'
import { isPresent, typeOf } from '@ember/utils'
import Mixin from '@ember/object/mixin'
import { underscore } from '@ember/string'
import RouteMixin from 'ember-cli-pagination/remote/route-mixin'
import { task, timeout } from 'ember-concurrency'
import Ember from 'ember'

export default Mixin.create(RouteMixin, {
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

  // store a reference to the route's model
  // i couldn't figure out how to look this up
  modelName: 'set modelName in the route',

  // store a reference to the current route, since I don't know how to look this up
  currentRoute: 'set currentRoute in the route',

  currentParams: null,

  routeRefresh () {
    this.refresh()
  },
  refreshAfterFilters: task(function * () {
    // debounce the filter to 600 ms
    yield timeout(1000)
    if (this.controller.get('page') !== 1) {
      this.controller.set('page', 1)
    }
    this.refresh()
  }).restartable(),

  actions: {
    // action called from the button at the right of the number per page list
    refresh () {
      this.refresh()
    },

    /**
     * take in a sortField and store the new sortField in the controller
     * also infer the correct sort order (ASC or DESC)
     * works with query params
     * follows json:api conventions
     *
     * @param field
     */
    sortField (field) {
      field = underscore(field)
      const sortField = this.controller.get('sortField')
      const sortOrder = this.controller.get('sortOrder')

      // sortField hasn't changed so we toggle sortOrder
      // check for the descending and ascending versions
      if (field === sortField || '-' + field === sortField) {
        if (sortOrder === '-') {
          this.controller.set('sortOrder', '')
        } else {
          this.controller.set('sortOrder', '-')
        }
      }
      // always update the sortField..either the field changes or the order changes
      this.controller.set('sortField', this.controller.get('sortOrder') + field)
    },

    /**
     * sets a new param on the filterParams property
     * of the controller and fetch results with that
     *
     * It always return to page 1, because if the table
     * is in page 3 and set a filter with 1 result,
     * that page is empty
     */
    applyFilter (fieldName, filterValue) {
      let params = this.controller.get('filterParams')
      if (params === undefined) {
        // when useSettings is false, the params should be an empty object
        params = {}
      }
      if ((params[fieldName] == null && filterValue === '') || params[fieldName] === filterValue) {
        return
      }
      params[fieldName] = filterValue
      this.controller.set('filterParams', params)

      // do not trigger a table refresh when the columns filter value is set from table settings
      if (this.controller.get('useTableSettings') && !this.controller.get('loadedFromTableSettings')) {
        return
      }
      this.get('refreshAfterFilters').perform()
    },

    // take the supplied search field and ask the api to filter by it
    runQuickSearch () {
      // do not trigger a table refresh when the columns filter value is set from table settings
      if (this.controller.get('useTableSettings') && !this.controller.get('loadedFromTableSettings')) {
        return
      }
      this.get('refreshAfterFilters').perform()
    },

    // take the extra parameters
    runAdvancedSearch (extraParams) {
      if (this.controller.get('page') !== 1) {
        this.controller.set('page', 1)
      }
      this.controller.set('extraParams', extraParams)
      this.controller.set('filterParams', {})
      this.refresh()
    },

    // general function to open a record from a paginated list
    // will use transitionTo by default
    open (record) {
      const controller = this.controller
      // my save function
      this.controller.transitionToRoute(controller.get('modelName'), record)
    },

    changePage (page) {
      this.controller.set('page', page)
      this.refresh()
    },

    /**
     *
     * @param perPage
     */
    changePerPage (perPage) {
      this.controller.set('perPage', perPage)
      this.refresh()
    },

    /**
     *
     * @param property
     * @param direction
     */
    changeSort (property, direction) {
      let order = (direction === 'desc') ? '-' : ''
      this.controller.set('sortProperty', property)
      this.controller.set('sortDirection', direction)
      this.controller.set('sortField', `${order}${property}`)
    },

    /**
     *
     * @param subject
     */
    selectRow (row, checked) {
      row.get('content').set('isSelected', checked)
      if (checked) {
        this.get('controller.selectedRows').pushObject(row.get('content'))
      } else {
        this.get('controller.selectedRows').removeObject(row.get('content'))
      }
    },
    selectAll (checked) {
      this.get('controller.tableData').setEach('isSelected', checked)
      if (checked) {
        this.set('controller.selectedRows', this.get('controller.tableData').toArray())
      } else {
        this.set('controller.selectedRows', [])
      }
    },

    didTransition () {
      this.controller.set('selectedRows', [])
    }
  },

  // extend to pass route values onto controller for possible use
  setupController (controller, model) {
    this._super(controller, model)

    // pass route properties on to controller
    controller.set('modelName', this.modelName)
    controller.set('controllerName', this.controllerName)
    controller.set('currentRoute', this.get('currentRoute'))
    controller.set('routeKey', this.router.generate(this.get('currentRoute'), ...this.getCurrentRouteParams()))
    controller.get('loadTableData').perform()
  },

  /**
   * @method
   * @public
   *
   *
   * This method needs to be overrided if the current route
   * requires params to be generated
   */
  getCurrentRouteParams () {
    return []
  },

  /**
   * when a user goes to another case to show the same table
   * it should reset the data because controllers are singleton
   * so if the new case doesn't have a table-setting record
   * it will start in a pristine state
   */
  resetController (controller, isExiting, transition) {
    this._super(...arguments)
    if (isExiting) {
      Ember.Logger.info('exiting controller')
      this.controller.set('loadedFromTableSettings', false)

      this.resetControllerFields(controller, '')
    }
  },

  resetControllerFields (controller, sortField) {
    controller.set('page', 1)
    controller.set('perPage', 50)
    controller.set('quickSearch', '')
    controller.set('sortField', sortField)
    controller.set('extraParams', {})
    controller.set('filterParams', {})
    controller.get('columns').forEach((col) => {
      col.setProperties({
        filterValue: null,
        showFilter: false,
        advFilterOperator: undefined,
        advFilterValue: undefined,
        advFilterValue2: undefined
      })
    })
    controller.get('additionalColumnsForFilter').forEach((col) => {
      col.setProperties({
        filterValue: null,
        showFilter: false,
        advFilterOperator: undefined,
        advFilterValue: undefined,
        advFilterValue2: undefined
      })
    })
  },
  /**
   * checks if user is going out of the route to re-init loadedFromTableSettings
   */
  willTransition (transition) {
    const target = transition.targetName
    if (target !== this.get('currentRoute')) {
      Ember.Logger.info('Reset loadedFromTableSettings in willTransition')
      this.controller.set('loadedFromTableSettings', false)
    }
  }
})
