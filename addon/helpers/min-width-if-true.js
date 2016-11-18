import Ember from 'ember';

export function minWidthIfTrue(params/*, hash*/) {
  let isTrue = params[0];
  let percentage = parseFloat(params[1]);
  if (isTrue) {
    return Ember.String.htmlSafe('min-width: ' + percentage + '%');
  }
  return Ember.String.htmlSafe('');
}

export default Ember.Helper.helper(minWidthIfTrue);
