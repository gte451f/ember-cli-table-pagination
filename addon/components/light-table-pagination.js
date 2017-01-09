import Ember from 'ember';
import layout from '../templates/components/light-table-pagination';
import TablePagination from './table-pagination';
import Table from 'ember-light-table';

const {
  computed
} = Ember;

export default TablePagination.extend({
  layout: layout,

  // override inherited properties
  perPage: 50,

  /** light table columns derived from the columns property*/
  ltColumns: computed('columns', function() {
    return this.get('columns').map((column) => {
      return {
        label: column.get('displayName'),
        valuePath: column.get('fieldName'),
        sortable: true
      };
    });
  }),
  table: computed('content', 'ltColumns', function() {
    return new Table(this.get('ltColumns'), this.get('content'));
  }),

  actions: {
    onColumnClick() {
    }
    ,
    rowClicked(){
    }
  }
});
