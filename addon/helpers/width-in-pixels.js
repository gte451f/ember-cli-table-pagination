import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import { isNone } from '@ember/utils';

export function widthInPixels([width]) {
  if (isNone(width)) {
    return htmlSafe('');
  }

  return htmlSafe(`width: ${width}px;`);
}

export default helper(widthInPixels);
