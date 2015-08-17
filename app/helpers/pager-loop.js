import Ember from 'ember';

/**
 * for a given model and pager object
 * return the matching field value
 * @param model
 * @param field
 * @returns {*}
 */
export function pagerLoop(params, namedArgs) {
  return namedArgs.model.get(namedArgs.field.fieldName);
}
export default Ember.Helper.helper(pagerLoop);