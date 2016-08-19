import Ember from 'ember';
import TablePagination from './table-pagination';

const {
  computed
} = Ember;

export default TablePagination.extend({
  // ui customization
  classNames: ['box', 'box-top', 'ember-cli-table-pagination'],
  classNameBindings: ['boxSizeClass'],

  // properties
  boxSize: 12,


  // override inherited properties
  perPage: 50,

  // computed:
  boxSizeClass: computed('boxSize', function() {
    let boxSize = this.get('boxSize');
    return `box-${boxSize}`;
  }),

  // override the components:
  bodyComponent: 'bs-table-pagination.table-body',
  contentComponent: 'bs-table-pagination.table-content',
  footerComponent: 'bs-table-pagination.table-footer',
  pagerComponent: 'bs-table-pagination.table-pager',
  titleComponent: 'bs-table-pagination.table-title',
  toolbarComponent: 'bs-table-pagination.table-toolbar',
  toolsComponent: 'bs-table-pagination.table-tools',
  noDataComponent: 'bs-table-pagination.table-no-data'
});
