import Ember from 'ember';
import layout from '../../templates/components/bs-table-pagination/table-tools';

export default Ember.Component.extend({
  layout,
  classNames: ['col-md-7'],

  // properties
  perPageOptions: [50, 100, 250],

  showAll: false,

  actions: {
    showAllRecords() {
      this.set('showAll', true);
      this.attrs.changePerPage(100000000); // 100 million records
      this.attrs.refresh();
    },
    showByPageRecords() {
      this.set('showAll', false);
      this.attrs.changePerPage(this.get('perPageOptions.firstObject'));
      this.attrs.refresh();
    }
  }
});
