import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('table-pagination/table-toolbar', 'Integration | Component | table pagination/table toolbar', {
  integration: true
})

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{table-pagination/table-toolbar}}`)

  assert.equal(this.$().text().trim().replace(/\s+/g, ' '), '<Toolbar> </Toolbar>')

  // Template block usage:"
  this.render(hbs`
    {{#table-pagination/table-toolbar}}
      template block text
    {{/table-pagination/table-toolbar}}
  `)

  assert.equal(this.$().text().trim().replace(/\s+/g, ' '), '<Toolbar> template block text </Toolbar>')
})
