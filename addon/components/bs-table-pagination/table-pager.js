import Ember from 'ember';
import layout from '../../templates/components/bs-table-pagination/table-pager';

export default Ember.Component.extend({
  layout,
  classNames: ['col-xs-4', 'col-md-4'],
  actions: {
    changePage(newPage) {
      this.attrs.changePage(newPage);
    }
  }
});
