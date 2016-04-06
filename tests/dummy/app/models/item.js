import DS from 'ember-data';
import Ember from 'ember';

const {
  attr,
  Model
} = DS;

export default Model.extend({
  idNum: attr('number'),
  name: attr('string'),
  description: attr('string')
});
