import Ember from 'ember';
import layout from './template';

const { computed } = Ember;
const { alias } = computed;

export default Ember.Component.extend({
  layout,
  tagName: 'table',
  classNames: ['table', 'table-bordered', 'table-striped'],

  columns: alias('contentParams.columns')
});
