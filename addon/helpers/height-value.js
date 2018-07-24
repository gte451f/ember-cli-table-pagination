import { helper } from '@ember/component/helper'
import { htmlSafe } from '@ember/string'

export function heightValue ([height]) {
  return htmlSafe(`height: ${height}`)
}

export default helper(heightValue)
