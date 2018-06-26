import { heightValue } from 'ember-cli-table-pagination/helpers/height-value'
import { module, test } from 'qunit'

module('Unit | Helper | height value')

test('it works', function (assert) {
  let result = heightValue(['42px'])
  assert.equal(result, 'height: 42px')
})
