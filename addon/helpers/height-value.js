import Ember from 'ember';

export function heightValue([height]) {
  return Ember.String.htmlSafe(`height: ${height}`);
}

export default Ember.Helper.helper(heightValue);
