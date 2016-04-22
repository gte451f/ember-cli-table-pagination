import Ember from 'ember';
import layout from './template';

const { computed } = Ember;
const { reads } = computed;

export default Ember.Component.extend({
  layout,
  classNames: ['ember-cli-table-content'],
  // tagName: '',

  showFilter: false,

  columns: reads('contentParams.columns'),
  sorting: reads('contentParams.sorting'),
  sortingDirection: reads('contentParams.sortDirection'),
  loading: reads('contentParams.loading')
});
