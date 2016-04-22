import DS from 'ember-data';
import Ember from 'ember';

const {
  attr,
  Model
} = DS;

const { computed } = Ember;

export default Model.extend({
  idNum: attr('number'),
  name: attr('string'),
  description: attr('string'),
  idNumInt: computed('idNum', function() {
    return parseInt(this.get('idNum'));
  })
});
