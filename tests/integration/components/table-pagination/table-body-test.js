import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('table-pagination/table-body', 'Integration | Component | table pagination/table body', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{table-pagination/table-body}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#table-pagination/table-body}}
      template block text
    {{/table-pagination/table-body}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
