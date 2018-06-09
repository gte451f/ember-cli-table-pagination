import { pagerLoop } from 'ember-cli-table-pagination/helpers/pager-loop'
import { module, test } from 'qunit'

module('Unit | Helper | pager loop')

test('it works', function (assert) {
  let result = pagerLoop(null, {
    model: {
      a: 1,
      b: 2
    },
    field: {
      fieldName: 'b'
    }
  })
  assert.equal(result, 2)
})
