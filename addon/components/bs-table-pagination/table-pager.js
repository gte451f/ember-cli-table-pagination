import Ember from 'ember';
import layout from '../../templates/components/bs-table-pagination/table-pager';

export default Ember.Component.extend({
  layout,
  classNames: ['col-xs-5', 'col-md-5'],
  actions: {
    changePage(newPage) {
      Ember.Logger.debug('changePage within table-pager passing it up');
      this.attrs.changePage(newPage);
    }
  }
});
