import Ember from 'ember';

export function minWidthIfTrue([isTrue, percentage]) {
  if (isTrue) {
    let percentageNumber = parseFloat(percentage);
    return Ember.String.htmlSafe(`min-width: ${percentageNumber}%`);
  }
  return Ember.String.htmlSafe('');
}

export default Ember.Helper.helper(minWidthIfTrue);
