import { widthInPixels } from 'dummy/helpers/width-in-pixels';
import { module, test } from 'qunit';

module('Unit | Helper | width in pixels');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = widthInPixels([42]);
  assert.ok(result);
  assert.equal(result, 'width: 42px;');
});
