import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('table-pagination/table-no-data', 'Integration | Component | table pagination/table no data', {
  integration: true
})

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{table-pagination/table-no-data}}`)

  assert.equal(this.$().text().trim(), 'No records found')
})
