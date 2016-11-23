import Ember from 'ember';

export function widthInPixels(params/*, hash*/) {
  let width = params[0];
  if (Ember.isNone(width)) {
    return Ember.String.htmlSafe('');
  }

  return Ember.String.htmlSafe('width: ' + width + 'px;');
}

export default Ember.Helper.helper(widthInPixels);
