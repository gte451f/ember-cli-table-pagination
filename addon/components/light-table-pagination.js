import Ember from 'ember';
import layout from '../templates/components/light-table-pagination';
import TablePagination from './table-pagination';
import Table from 'ember-light-table';

const {
  computed,
  isEmpty
} = Ember;

export default TablePagination.extend({
  layout: layout,

  // override inherited properties
  perPage: 50,

  // override the components:
  bodyComponent: 'bs-table-pagination.table-body',
  contentComponent: 'bs-table-pagination.table-content', // NOT USED anymore
  footerComponent: 'bs-table-pagination.table-footer',
  pagerComponent: 'bs-table-pagination.table-pager',
  titleComponent: 'bs-table-pagination.table-title',
  toolbarComponent: 'bs-table-pagination.table-toolbar',
  toolsComponent: 'bs-table-pagination.table-tools',
  noDataComponent: 'bs-table-pagination.table-no-data',

  /** light table columns derived from the columns property*/
  ltColumns: computed('columns', function() {
    return [ {
        label: 'Actions',
        sortable: false,
        width: '50px',
        cellComponent: 'light-table-pagination.table-actions'
      } ].pushObjects(
      this.get('columns').map((column) => {
      return {
        label: column.get('displayName'),
        valuePath: column.get('fieldName'),
        sortable: true
      };
    }));
  }),
  table: computed('ltColumns', 'content', function() {
    let t = new Table(this.get('ltColumns'), this.get('content'));

    let tpColumn = this.get('columns').findBy('apiInteractionName', this.get('sortProperty'));
    let sortColumn = t.get('allColumns').findBy('valuePath', tpColumn.get('fieldName'));

    if (sortColumn) {
      sortColumn.set('sorted', true);
      sortColumn.set('ascending', this.get('sortDirection') === 'asc');
    }
    return t;
  }),

  actions: {
    onColumnClick(column) {
      if (column.sorted) {
        /** get the table pagination column */
        let tpColumn = this.get('columns').findBy('fieldName', column.get('valuePath'));
        this.sendAction('changeSort', tpColumn.get('apiInteractionName'), column.get('ascending') ? 'asc' : 'desc');
      }
    },
    onColumnDoubleClick(column) {
      if (column.sorted) {
        alert('Here we can put a modal to filter');
      }
    }
  }
});
