import Ember from 'ember';
import layout from '../../templates/components/bs-table-pagination/table-row';

export default Ember.Component.extend({
  layout,
  tagName: 'tr',
  attributeBindings: ['style'],
  style: 'width: 100%;'
});
