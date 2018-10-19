import { on } from '@ember/object/evented'
import Mixin from '@ember/object/mixin'
import EmberObject, { computed, observer } from '@ember/object'
import { isPresent, isEmpty, typeOf } from '@ember/utils'
import { alias } from '@ember/object/computed'
import { merge } from '@ember/polyfills'
import { underscore } from '@ember/string'
import { task, timeout, all } from 'ember-concurrency'
import { promise } from 'rsvp'
import Column from './column'

/**
 * store shared logic to manage table data
 */
export default Mixin.create({
  // used to store the table data (rows, old model)
  tableData: null,
  // object with parameters used for table data loading
  loadDataParams: null,

  useTableSettings: true,
  saveTableSettings: task(function * () {
    this.set('currentControllerState', this.toTableSettingsState())
    if (this.get('currentTableSetting')) {
      if (this.get('currentTableSetting.state') !== JSON.stringify(this.get('currentControllerState'))) {
        this.set('currentTableSetting.state', JSON.stringify(this.get('currentControllerState')))
        yield this.get('currentTableSetting').save()
      }
    } else {
      const tableSetting = this.store.createRecord('table-setting', {
        route: this.get('routeKey'),
        appName: this.get('appName'),
        state: JSON.stringify(this.get('currentControllerState'))
      })
      yield tableSetting.save()
      this.set('currentTableSetting', tableSetting)
    }
  }).restartable(),

  loadTableSettings: task(function * () {
    if (!this.get('loadedFromTableSettings')) {
      // Only load from the api once
      const ts = yield this.store.queryRecord('table-setting', {
        route: this.get('routeKey'),
        app_name: this.get('appName')
      })
      this.set('currentTableSetting', ts)
      this.set('currentControllerState', null)
      // comes from another route, check saved params in db
      if (isPresent(ts)) {
        this.set('currentControllerState', JSON.parse(ts.get('state')))
      }
      this.fromTableSettingsState(this.get('currentControllerState'))
      this.updateColumnsFromTableSettingState(this.get('currentControllerState'))
      this.set('loadedFromTableSettings', true)
    }

  }),

  loadTableData: task(function * () {
    // load table settings if they are active
    const useTableSettings = this.get('useTableSettings')
    if (useTableSettings) {
      yield this.get('loadTableSettings').perform()
    }
    // gather params
    const params = this.get('loadDataParams')
    const allParams = this.getAllParams(params)

    const tableData = []
    const tableDataPromise = this.get('store').query(this.get('modelName'), allParams)
    const extraDataPromise = this.loadExtraData()
    const results = yield all(tableDataPromise, extraDataPromise)
    let records = results[0]
    if (records) {
      tableData.pushObjects(records.toArray())
    }
    // process table data
    const processedTableData = this.processTableData(tableData)
    // store the result in tableData
    this.set('tableData', processedTableData)
    // process extra data
    let extraData = results[1]
    const processedExtraData = this.processExtraData(extraData)
    // store the result in extraData
    this.set('extraData', processedExtraData)

    // store properties on to controller
    this.set('currentParams', allParams)
    this.set('totalRecords', records.get('meta.total_record_count'))
    let {sortField} = allParams
    if (sortField) {
      if (sortField.substring(0, 1) === '-') {
        this.set('sortDirection', 'desc')
        this.set('sortProperty', sortField.substring(1))
      } else {
        this.set('sortDirection', 'asc')
        this.set('sortProperty', sortField)
      }
      this.set('sortField', sortField)
    }
    // save new table settings if they are active
    if (useTableSettings) {
      this.get('saveTableSettings').perform()
    }
  }).restartable(),
  // function should be overwritten if the table data has to be processed before it is used in the table
  processTableData (tableData) {
    return tableData
  },

  // function should be overwritten if you need to load additional data
  // the function should return a promise ( eg hash)
  loadExtraData () {
    return new Promise(function (resolve, reject) {
      resolve(value)
    })
  },
  // function should be overwritten if the extra data has to be processed before it is used in the controller
  processExtraData (extraData) {
    return extraData
  },



  getAllParams: function (params) {

    const name = this.get('quickSearchField')
    const value = this.get('quickSearch')
    const queryWith = this.get('with')
    const allParams = merge(params, {
      page: this.get('page'),
      perPage: this.get('perPage'),
      sortField: this.get('sortField'),
      with: queryWith
    })

    if (isPresent(name) && isPresent(value)) {
      params[name] = '*' + value.trim() + '*'
    }

    // To pass already formatted params to the query
    let extraParams = this.get('extraParams')
    for (let fieldName in extraParams) {
      params[underscore(fieldName)] = extraParams[fieldName]
    }
    // filter params should override the extra params ?

    let filterParams = this.get('filterParams')
    for (let fieldName in filterParams) {
      let filterValue = filterParams[fieldName]
      if (typeOf(filterValue) !== 'null' && isPresent(filterValue)) {
        params[underscore(fieldName)] = '*' + filterValue + '*'
      }
    }
    return allParams
  },

  columnFilterValueChanged (column) {
    if (typeOf(column.get('filterValue')) !== 'undefined' && typeOf(column.get('filterValue')) !== 'null') {
      this.send('applyFilter', column.get('apiInteractionName'), column.get('filterValue'))
    }
  },
  configureFilterObservers () {
    const controller = this
    const filterParams = {}
    const useTableSettings = this.get('useTableSettings')
    this.get('columns').forEach(function (column, index) {
      column.set('filterValueChanged', function (col) {return controller.columnFilterValueChanged(col)})
      if (!useTableSettings) {
        // const key = column.get('apiInteractionName')
        // filterParams[key] = null
      }
    })
    if (!useTableSettings) {
      // this.set('filterParams', filterParams)
    }
    return null
  },

  // setup our query params including custom sortField value
  queryParams: ['page', 'perPage', 'sortField', 'with'],

  pageList: [
    50, 100, 250
  ],

  totalPages: alias('tableData.totalPages'),

  observingPerPage: observer('perPage', function () {
    this.set('page', 1)
  }),

  sortOrder: computed('sortDirection', function () {
    let sortDirection = this.get('sortDirection')
    if (sortDirection === 'desc') {
      return '-'
    } else {
      return ''
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

  column: EmberObject.extend({
    display: null,
    field: null
  }),

  quickSearchChanged: observer('quickSearch', function () {
    this.send('runQuickSearch')
  }),

  // load pager specific variables
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
  createPath: 'set createPath in the controller',

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
      filterParams: this.get('filterParams'),
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
    this.set('filterParams', state.filterParams)
  },

  updateColumnsFromTableSettingState (state) {
    const updateColumn = function (list) {
      return (col) => {
        const tableColumn = list.findBy('fieldName', col.fieldName)
        if (isPresent(tableColumn)) {
          tableColumn.set('filterValue', col.filterValue)
          tableColumn.set('showFilter', col.showFilter)
          tableColumn.set('advFilterValue', col.advFilterValue)
          tableColumn.set('advFilterValue2', col.advFilterValue2)
          if (isPresent(col.advFilterOperator)) {
            tableColumn.set('advFilterOperator', EmberObject.create(col.advFilterOperator))
          }
        }
      }
    }

    if (state) {
      state.columns.forEach(updateColumn(this.get('columns')))
      state.additionalColumnsForFilter.forEach(updateColumn(this.get('additionalColumnsForFilter')))
    }
  },

  actions: {
    editFlag (row) {
      this.set('isEditingFlagNote', true)
      this.set('flaggingRecord', row.content)
    },

    saveFlag () {
      let row = this.get('flaggingRecord')

      let subject = this.store.peekRecord('subject', row.id)

      subject.set('flagNote', row.flagNote)

      if (isEmpty(row.get('flagNote'))) {
        subject.set('flagStatus', 'unflagged')
      } else {
        subject.set('flagStatus', 'flagged')
      }
      subject.save().then(() => {
        this.get('notify').success('Saved successfully')
      }).then(() => {
        if (isEmpty(row.get('flagNote'))) {
          row.set('flagStatus', 'unflagged')
        } else {
          row.set('flagStatus', 'flagged')
        }

        this.set('isEditingFlagNote', false)
        this.set('flaggingRecord', null)
      })
    },

    cancelFlag () {
      this.set('isEditingFlagNote', false)
      this.set('flaggingRecord', null)
    }
  }
})
