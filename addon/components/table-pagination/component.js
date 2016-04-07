import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  // HTML
  layout,

  // properties
  allowQuickSearch: true,
  content: [],
  isRemoteHandled: false,
  page: 1,
  perPage: 5,
  searchString: '',
  tableTitle: 'title',
  totalPages: 5,

  // computed
  filteredContent: computed('content', 'searchString', 'isRemoteHandled', function() {
    let content = this.get('content');
    let isRemoteHandled = this.get('isRemoteHandled');
    if (isRemoteHandled) {
      return content;
    } else {
      let searchString = this.get('searchString');
      return content.filter(function(item) {
        Ember.Logger.debug('item -> ', item);
        Ember.Logger.debug(arguments);
        let pattern = new RegExp(searchString, 'i');
        let found = false;
        item.eachAttribute(function(name, meta) {
          if (['number', 'string', 'date'].contains(meta.type)) {
            found = found || pattern.test(item.get(name));
          }
        });
        Ember.Logger.debug('is item %s matching %s ? -> %s', item.get('idNum'), searchString, found);
        return found;
      });
    }
  }),
  currentContent: computed('filteredContent', 'page', 'perPage', 'isRemoteHandled', function() {
    let content = this.get('filteredContent');
    let isRemoteHandled = this.get('isRemoteHandled');
    if (isRemoteHandled) {
      return content;
    } else {
      let page = this.get('page');
      let perPage = this.get('perPage');

      // we are handling the data ourself so:
      // we should display only the items on the current page:
      // a.k.a. perPage items starting at perPageItems*page
      return content.slice(perPage * (page - 1), perPage * (page - 1) + perPage);
    }
  }),
  // overwritable components
  bodyComponent: 'table-pagination.table-body',
  contentComponent: 'table-pagination.table-content',
  pagerComponent: 'table-pagination.table-pager',
  titleComponent: 'table-pagination.table-title',
  toolbarComponent: 'table-pagination.table-toolbar',
  toolsComponent: 'table-pagination.table-tools'
});
