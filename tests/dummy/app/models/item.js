import { computed } from '@ember/object';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  idNum: attr('number'),
  name: attr('string'),
  description: attr('string'),
  idNumInt: computed('idNum', function() {
    return parseInt(this.get('idNum'));
  })
});
