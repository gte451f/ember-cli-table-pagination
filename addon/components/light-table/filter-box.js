import Ember from 'ember';
import layout from '../../templates/components/light-table/filter-box';

export default Ember.Component.extend({
  layout,

  click (e) {
    e.preventDefault();
    e.stopPropagation();
  }
});
