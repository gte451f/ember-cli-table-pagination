import Ember from 'ember';
import layout from '../../templates/components/bs-table-pagination/table-content';

const {computed} = Ember;
const {reads} = computed;

export default Ember.Component.extend({
  layout,
  classNames: ['ember-cli-table-content'],
  // tagName: '',

  showFilter: false,

  // these should be defined on the main pagination component
  // columns: reads('contentParams.columns'),
  // sorting: reads('contentParams.sorting'),
  // sortingDirection: reads('contentParams.sortDirection'),
  // loading: reads('contentParams.loading'),
  // numberOfRecords: reads('contentParams.numberOfRecords')
});
