import Ember from 'ember';
import layout from '../templates/components/table-pagination';

const {
  Component,
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
  numberOfRecords: reads('currentContent.length'),
  filteredContent: computed('content', 'searchString', 'fields.@each.filterValue', function() {
    let content = this.get('content');
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
  pagedContent: computed('filteredContent', 'sortedContent', 'page', 'perPage', function() {
    let page = this.get('page');
    let perPage = this.get('perPage');
    let content = this.get('sortedContent');

    // we are handling the data ourself so:
    // we should display only the items on the current page:
    // a.k.a. perPage items starting at perPageItems*page
    return content.slice(perPage * (page - 1), perPage * (page - 1) + perPage);
  }),
  currentContent: computed('pagedContent', 'content', 'isRemoteHandled', function() {
    let isRemoteHandled = this.get('isRemoteHandled');
    if (isRemoteHandled) {
      Ember.Logger.debug('content processing is handled remotely -> ', this.get('content.length'));
      return this.get('content');
    } else {
      let content = this.get('pagedContent');
      Ember.Logger.debug('content processing is done manually -> ', this.get('pagedContent.length'));
      return content;
    }
  }),
  totalPages: computed('filteredContent.length', 'perPage', function() {
    let contentLength = this.get('filteredContent.length');
    let perPage = this.get('perPage');
    return Math.ceil(contentLength / perPage);
  }),
  // overwritable components
  bodyComponent: 'table-pagination.table-body',
  contentComponent: 'table-pagination.table-content',
  footerComponent: 'table-pagination.table-footer',
  pagerComponent: 'table-pagination.table-pager',
  titleComponent: 'table-pagination.table-title',
  toolbarComponent: 'table-pagination.table-toolbar',
  toolsComponent: 'table-pagination.table-tools',

  actions: {
    changeSort(property, direction) {
      Ember.Logger.debug('changeSort -> property %s, direction %s', property, direction);
      let isRemoteHandled = this.get('isRemoteHandled');
      if (isRemoteHandled) {
        this.attrs.changeSort(property, direction);
      } else {
        this.set('sorting', property);
        if (direction) {
          this.set('sortDirection', direction);
        } else {
          this.set('sortDirection', null);
        }
      }
    },
    doNothing() {}
  }
});
