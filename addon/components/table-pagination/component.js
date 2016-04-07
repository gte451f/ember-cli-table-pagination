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

  // overwritable components
  bodyComponent: 'table-pagination.table-body',
  contentComponent: 'table-pagination.table-content',
  pagerComponent: 'table-pagination.table-pager',
  titleComponent: 'table-pagination.table-title',
  toolbarComponent: 'table-pagination.table-toolbar',
  toolsComponent: 'table-pagination.table-tools'
});
