import { widthInPixels } from 'ember-cli-table-pagination/helpers/width-in-pixels';
import { module, test } from 'qunit';

module('Unit | Helper | width in pixels');

test('it works', function(assert) {
  let result = widthInPixels([42]);
  assert.equal(result, 'width: 42px;');
});
