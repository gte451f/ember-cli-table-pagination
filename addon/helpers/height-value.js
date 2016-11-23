import Ember from 'ember';

export function heightValue(params/*, hash*/) {
  let height = params[0];
  return Ember.String.htmlSafe('height: ' + height);
}

export default Ember.Helper.helper(heightValue);
