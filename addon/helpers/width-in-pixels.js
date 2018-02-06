import Ember from 'ember';

export function widthInPixels([width]) {
  if (Ember.isNone(width)) {
    return Ember.String.htmlSafe('');
  }

  return Ember.String.htmlSafe(`width: ${width}px;`);
}

export default Ember.Helper.helper(widthInPixels);
