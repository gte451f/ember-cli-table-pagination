import { helper } from '@ember/component/helper'
import { htmlSafe } from '@ember/string'

export function minWidthIfTrue ([isTrue, percentage]) {
  if (isTrue) {
    let percentageNumber = parseFloat(percentage)
    return htmlSafe(`min-width: ${percentageNumber}%`)
  }
  return htmlSafe('')
}

export default helper(minWidthIfTrue)
