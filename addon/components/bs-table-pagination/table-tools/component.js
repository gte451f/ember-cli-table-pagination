import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['col-md-7'],

  // properties
  perPageOptions: [5, 10, 25, 50, 100, 250, 500]
});
