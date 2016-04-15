import Ember from 'ember';
import TablePagination from 'ember-cli-table-pagination/components/table-pagination/component';

const { computed } = Ember;

export default TablePagination.extend({
  // ui customization
  classNames: ['box', 'box-top'],
  classNameBindings: ['boxSizeClass'],

  // properties
  boxSize: 12,
  columns: [],
  contentParams: computed('columns', function() {
    return { columns: this.get('columns') };
  }),

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
  pagerComponent: 'bs-table-pagination.table-pager',
  titleComponent: 'bs-table-pagination.table-title',
  toolbarComponent: 'bs-table-pagination.table-toolbar',
  toolsComponent: 'bs-table-pagination.table-tools'
});
