import { isPresent } from '@ember/utils';
import { A } from '@ember/array';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, sort } from '@ember/object/computed';
import layout from '../templates/components/table-pagination';

export default Component.extend({
  // HTML
  layout,

  // properties

  /**
   * @public
   * @type boolean
   */
  allowQuickSearch: true,
  /**
   * @public
   * @type Array
   */
  content: [],

  /**
   * @public
   * @type Field
   */
  fields: [],

  /**
   * @public
   * @type boolean
   */
  isRemoteHandled: false,
  /**
   * @public
   * @type boolean
   */
  loading: false,
  /**
   * @public
   * @type number
   */
  page: 1,
  /**
   * @public
   * @type number
   */
  perPage: 5,
  /**
   * @public
   * @type string
   */

  searchString: '',
  /**
   * what is this?
   *
   * @private
   * @type string
   */
  sortProperty: null,

  /**
   * asc || desc
   *
   * @private
   * @type string
   */
  sortDirection: null,

  /**
   * @public
   * @type string
   */
  tableTitle: 'title',

  noFiltering: false,

  // computed
  numberOfRecords: reads('filteredContent.length'),
  filteredContent: computed('content', 'searchString', 'fields.@each.filterValue', 'noFiltering', function () {
    let content = this.get('content');
    if (this.get('noFiltering')) {
      return content;
    }
    let searchString = this.get('searchString');
    let filteredContent = content.filter(function (item) {
      let pattern = new RegExp(searchString, 'i');
      let found = false;
      item.eachAttribute(function (name, meta) {
        if (['number', 'string', 'date'].includes(meta.type)) {
          found = found || pattern.test(item.get(name));
        }
      });
      return found;
    });
    let fields = this.get('fields');
    fields.forEach(function (field) {
      let {
        fieldName,
        filterValue
      } = field;
      if (filterValue) {
        filteredContent = content.filter(function (item) {
          let pattern = new RegExp(filterValue, 'i');
          let value = item.get(fieldName);
          let test = pattern.test(value);
          return test;
        });
      }
    });

    return filteredContent;
  }),
  /**
   * @public
   * @type Array.<string>
   */
  _sorting: computed('sortProperty', 'sortDirection', function () {
    let sorting = this.get('sortProperty');
    let sortDirection = this.get('sortDirection');
    if (sortDirection === 'desc') {
      return [`${sorting}:${sortDirection}`];
    } else {
      return [`${sorting}`];
    }
  }),
  sortedContent: sort('filteredContent', '_sorting'),
  pagedContent: computed('filteredContent', 'sortedContent', 'page', 'perPage', function () {
    let page = this.get('page');
    let perPage = this.get('perPage');
    let content = this.get('sortedContent');

    // we are handling the data ourself so:
    // we should display only the items on the current page:
    // a.k.a. perPage items starting at perPageItems*page
    return content.slice(perPage * (page - 1), perPage * (page - 1) + perPage);
  }),
  currentContent: computed('pagedContent', 'content', 'isRemoteHandled', function () {
    let isRemoteHandled = this.get('isRemoteHandled');
    if (isRemoteHandled) {
      return this.get('content');
    } else {
      return this.get('pagedContent');
    }
  }),
  currentContentSize: reads('currentContent.length'),
  totalPages: computed('filteredContent.length', 'perPage', function () {
    let contentLength = this.get('filteredContent.length');
    let perPage = this.get('perPage');
    return Math.ceil(contentLength / perPage);
  }),

  allColumns: computed('columns', 'additionalColumnsForFilter', function() {
    let tableColumns = A(this.get('columns')).filterBy('enableSearch', true);
    let additionalColumnsForFilter = this.get('additionalColumnsForFilter');
    let additionalColumns = [];
    if (isPresent(additionalColumnsForFilter)) {
      additionalColumns = additionalColumnsForFilter.filterBy('enableSearch', true);
    }

    return tableColumns.concat(additionalColumns);
  }),
  // overwritable components
  bodyComponent: 'table-pagination.table-body',
  contentComponent: 'table-pagination.table-content',
  footerComponent: 'table-pagination.table-footer',
  pagerComponent: 'table-pagination.table-pager',
  titleComponent: 'table-pagination.table-title',
  toolbarComponent: 'table-pagination.table-toolbar',
  toolsComponent: 'table-pagination.table-tools',
  noDataComponent: 'table-pagination.table-no-data',

  /**
   * pass in various custom properties, notice the pre-defined and expected properties below
   */
  contentParams: {},

  actions: {
    changeSort(property, direction) {
      let isRemoteHandled = this.get('isRemoteHandled');
      if (isRemoteHandled) {
        this.attrs.changeSort(property, direction);
      } else {
        this.set('sortProperty', property);
        if (direction) {
          this.set('sortDirection', direction);
        } else {
          this.set('sortDirection', null);
        }
      }
    },
    doNothing() {
    },
    runAdvancedSearch () {
      if (typeof this.attrs.runAdvancedSearch === 'function') {
        this.attrs.runAdvancedSearch();
      }
    }
  }
});
