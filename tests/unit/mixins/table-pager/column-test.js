import Column from 'ember-cli-table-pagination/mixins/table-pager/column'
import { module, test } from 'qunit'

module('Unit | Mixin | table pager column')

test('it works', function (assert) {
  let column = Column.create()
  assert.equal(column.get('displayName'), null)
  assert.equal(column.get('apiInteractionName'), undefined)

  column.set('fieldName', 'lastName')
  assert.equal(column.get('apiInteractionName'), 'last_name')
})
