import Ember from 'ember';
import layout from '../templates/components/bs-table-pagination';

const {
  computed,
  Object,
  observer
} = Ember;
const { alias } = computed;

export default TablePagination.extend({
  // ui customization
  classNames: ['box', 'box-top', 'ember-cli-table-pagination'],
  classNameBindings: ['boxSizeClass'],

  // properties
  boxSize: 12,
  contentParams: computed('fields', 'sorting', 'sortDirection', 'loading', function() {
    return {
      columns: this.get('fields'),
      sorting: this.get('sorting'),
      sortDirection: this.get('sortDirection'),
      loading: this.get('loading')
    };
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
