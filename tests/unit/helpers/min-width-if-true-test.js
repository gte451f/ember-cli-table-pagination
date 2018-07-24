import { minWidthIfTrue } from 'ember-cli-table-pagination/helpers/min-width-if-true'
import { module, test } from 'qunit'

module('Unit | Helper | min width if true')

test('it works', function (assert) {
  let resultTrue = minWidthIfTrue([true, 42])
  assert.equal(resultTrue, 'min-width: 42%')

  let resultFalse = minWidthIfTrue([false, 42])
  assert.equal(resultFalse, '')
})
