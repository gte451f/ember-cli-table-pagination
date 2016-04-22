import Ember from 'ember';
import layout from './template';

const {
  Component,
  Object,
  computed
} = Ember;
const {
  alias,
  reads,
  sort
} = computed;

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
   * @typedef {fieldName: string, displayName: string, disableServerInteractions: boolean, enableSearch: boolean} Field
   */
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
   * @private
   * @type string
   */
  sorting: null,
  /**
   * @private
   * @type string
   */
  sortDirection: null,
  /**
   * @public
   * @type string
   */
  tableTitle: 'title',

  // computed
  filteredContent: computed('content', 'searchString', 'isRemoteHandled', 'fields.@each.filterValue', function() {
    let content = this.get('content');
    let isRemoteHandled = this.get('isRemoteHandled');
    if (isRemoteHandled) {
      return content;
    } else {
      let searchString = this.get('searchString');
      let filteredContent = content.filter(function(item) {
        let pattern = new RegExp(searchString, 'i');
        let found = false;
        item.eachAttribute(function(name, meta) {
          if (['number', 'string', 'date'].contains(meta.type)) {
            found = found || pattern.test(item.get(name));
          }
        });
        return found;
      });
      let fields = this.get('fields');
      fields.forEach(function(field) {
        let {
          fieldName,
          filterValue
        } = field;
        if (filterValue) {
          filteredContent = content.filter(function(item) {
            let pattern = new RegExp(filterValue, 'i');
            let value = item.get(fieldName);
            let test = pattern.test(value);
            return test;
          });
        }
      });

      return filteredContent;
    }
  }),
  /**
   * @public
   * @type Array.<string>
   */
  _sorting: computed('sorting', 'sortDirection', function() {
    let sorting = this.get('sorting');
    let sortDirection = this.get('sortDirection');
    if (sortDirection === 'desc') {
      return [`${sorting}:${sortDirection}`];
    } else {
      return [`${sorting}`];
    }
  }),
  sortedContent: sort('filteredContent', '_sorting'),
  pagedContent: computed('filteredContent', 'sortedContent', 'page', 'perPage', 'isRemoteHandled', function() {
    let isRemoteHandled = this.get('isRemoteHandled');
    if (isRemoteHandled) {
      let content = this.get('filteredContent');
      return content;
    } else {
      let page = this.get('page');
      let perPage = this.get('perPage');
      let content = this.get('sortedContent');

      // we are handling the data ourself so:
      // we should display only the items on the current page:
      // a.k.a. perPage items starting at perPageItems*page
      return content.slice(perPage * (page - 1), perPage * (page - 1) + perPage);
    }
  }),
  currentContent: reads('pagedContent'),
  totalPages: computed('filteredContent.length', 'perPage', function() {
    let contentLength = this.get('filteredContent.length');
    let perPage = this.get('perPage');
    return Math.ceil(contentLength / perPage);
  }),
  // overwritable components
  bodyComponent: 'table-pagination.table-body',
  contentComponent: 'table-pagination.table-content',
  pagerComponent: 'table-pagination.table-pager',
  titleComponent: 'table-pagination.table-title',
  toolbarComponent: 'table-pagination.table-toolbar',
  toolsComponent: 'table-pagination.table-tools'
});
