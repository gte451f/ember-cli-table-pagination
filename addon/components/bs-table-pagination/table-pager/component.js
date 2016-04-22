import Ember from 'ember';
import layout from './template';

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
