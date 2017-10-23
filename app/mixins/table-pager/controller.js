import Ember from 'ember';
import Column from './column';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

const { computed, isEmpty, isPresent } = Ember;
const { alias } = computed;

/**
 * store shared logic to run pager logic
 */
export default Ember.Mixin.create({

  /**
   * This needs to be dynamic meta programming
   * for adding observers on each filter per column
   */
  configureFilterObservers: Ember.on('init', function () {
    var self = this;
    var observerDefinitions = {};
    var filterParams = {};
    this.get('columns').forEach(function (column, index) {
      var name = 'observer_' + column.get('apiInteractionName');
      observerDefinitions[name] = function () {
        var that = this;
        clearTimeout(this.get('keyTimer' + name));
        this.set('keyTimer' + name, setTimeout(function () {
          if (Ember.typeOf(column.get('filterValue')) !== 'undefined' && Ember.typeOf(column.get('filterValue')) !== 'null') {
            that.send('applyFilter', column.get('apiInteractionName'), column.get('filterValue'));
          }
        }, 600));
      }.observes('columns.' + index + '.filterValue');
      filterParams[column.get('apiInteractionName')] = null;
    });
    self.reopen(observerDefinitions);
    self.set('filterParams', filterParams);
  }),

  // setup our query params including custom sortField value
  queryParams: ["page", "perPage", "sortField", "with"],

  pageList: [
    50, 100, 250
  ],

  // binding the property on the paged array
  // to the query params on the controller
  //pageBinding: "content.page",
  //perPageBinding: "content.perPage",
  totalPages: alias("content.totalPages"),

  observingPerPage: function () {
    this.set('page', 1);
  }.observes('perPage'),

  // //logic to handle sorting a list
  // sortField: computed('sortProperty', 'sortDirection', function() {
  //   let sortProperty = this.get('sortProperty');
  //   let sortDirection = this.get('sortDirection');
  //   Ember.Logger.debug('sortField being updated');
  //   if (sortDirection) {
  //     return `${sortDirection}${sortProperty}`;
  //   } else {
  //     return sortProperty;
  //   }
  // }),
  sortOrder: computed('sortDirection', function () {
    let sortDirection = this.get('sortDirection');
    if (sortDirection === 'desc') {
      return '-';
    } else {
      return '';
    }
  }),
  with: '',

  // disabled by default
  // set these in the controller to enable and bind to a specific field
  quickSearchField: null,
  quickSearch: null,

  page: 1,
  perPage: 50,
  totalRecords: null,

  infiniteContent: pagedArray('content', {infinite: true}),

  column: Ember.Object.extend({
    display: null,
    field: null
  }),

  quickSearchChanged: function () {
    var self = this;
    clearTimeout(this.get('keyTimer'));
    this.set('keyTimer', setTimeout(function () {
      try {
        self.send('runQuickSearch');
      } catch (e) {
        // ignore errors
      }
    }, 600));
  }.observes('quickSearch'),

  //load pager specific variables
  columns: [
    Column.create({'displayName': '#', 'fieldName': 'id'})
  ],

  additionalColumnsForFilter: [],

  // bootstrap or adminlte specific classes
  // color default|success|primary|warning|danger|info
  box: 'default',
  button: 'default',

  // display the table title if there is one
  tableTitle: 'set tableTitle in controller to NULL to hide otherwise set this to your table title',

  // where should the default open action link-to?
  linkPath: false,
  editPath: false,

  // not sure what this is
  createPath: "set createPath in the controller",

  canLoadMore: false,

  selectedRows: [],

  /**
   * @method
   * @public
   *
   * allows serialize the controller state to be able to send it to storage
   */
  toTableSettingsState () {
    // We need to return a json object
    // that can be used to re-hydrate the controller
    // after a cold refresh to use saved filters
    // sorting, page, perPage etc that are not part of
    // the queryParams

    const mapColumn = (col) => {
        return {
          fieldName: col.get('fieldName'),
          filterValue: col.get('filterValue'),
          showFilter: col.get('showFilter'),
          advFilterValue: col.get('advFilterValue'),
          advFilterValue2: col.get('advFilterValue2'),
          advFilterOperator: col.get('advFilterOperator')
        }
    }

    return {
      page: this.get('page'),
      perPage: this.get('perPage'),
      sortField: this.get('sortField'),
      quickSearch: this.get('quickSearch'),
      extraParams: this.get('extraParams'),
      columns: this.get('columns').map(mapColumn),
      additionalColumnsForFilter: this.get('additionalColumnsForFilter').map(mapColumn)
    }
  },

  /**
   * @method
   * @public
   *
   * allows deserialize the controller state from a storage
   */
  fromTableSettingsState (state) {
    if (isEmpty(state)) return
    this.set('page', state.page)
    this.set('perPage', state.perPage)
    this.set('sortField', state.sortField)
    this.set('quickSearch', state.quickSearch)
    this.set('extraParams', state.extraParams)

    const updateColumn = function (list) {
      return (col) => {
        const tableColumn = list.findBy('fieldName', col.fieldName)
        if (isPresent(tableColumn)) {
          tableColumn.set('filterValue', col.filterValue)
          tableColumn.set('showFilter', col.showFilter)
          tableColumn.set('advFilterValue', col.advFilterValue)
          tableColumn.set('advFilterValue2', col.advFilterValue2)
          if (isPresent(col.advFilterOperator)) {
            tableColumn.set('advFilterOperator', Ember.Object.create(col.advFilterOperator))
          }
        }
      }
    }

    state.columns.forEach(updateColumn(this.get('columns')))
    state.additionalColumnsForFilter.forEach(updateColumn(this.get('additionalColumnsForFilter')))
  },

  actions: {
    loadNext () {
      if (this.get('infiniteContent.length') > 0 && this.get('canLoadMore')) {
        this.get('infiniteContent').loadNextPage();
        this.set('page', this.get('infiniteContent.page'));
      }
    },

    editFlag (row) {
      this.set('isEditingFlagNote', true);
      this.set('flaggingRecord', row.content);
    },

    saveFlag(){
      let row = this.get('flaggingRecord');

      let subject = this.store.peekRecord('subject', row.id);

      subject.set('flagNote', row.flagNote);

      if (Ember.isEmpty(row.get('flagNote'))) {
        subject.set('flagStatus', 'unflagged');
      } else {
        subject.set('flagStatus', 'flagged');
      }
      subject.save().then(() => {
        this.get('notify').success('Saved successfully');
      }).then(() => {
        if (Ember.isEmpty(row.get('flagNote'))) {
          row.set('flagStatus', 'unflagged');
        } else {
          row.set('flagStatus', 'flagged');
        }

        this.set('isEditingFlagNote', false);
        this.set('flaggingRecord', null);
      });
    },

    cancelFlag () {
      this.set('isEditingFlagNote', false);
      this.set('flaggingRecord', null);
    },
  }
});
