import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('bs-table-pagination/table-title', 'Integration | Component | bs table pagination/table title', {
  integration: true
})

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{bs-table-pagination/table-title}}`)

  assert.equal(this.$().text().trim(), '')

  // Template block usage:"
  this.render(hbs`
    {{#bs-table-pagination/table-title}}
      template block text
    {{/bs-table-pagination/table-title}}
  `)

  assert.equal(this.$().text().trim(), 'template block text')
})
