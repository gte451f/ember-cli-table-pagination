import { helper } from '@ember/component/helper';
import { get } from '@ember/object';

/**
 * for a given model and pager object
 * return the matching field value
 * @param model
 * @param field
 * @returns {*}
 */
export function pagerLoop(params, namedArgs) {
  return get(namedArgs.model, namedArgs.field.fieldName);
}
export default helper(pagerLoop);
