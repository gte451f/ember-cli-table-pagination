import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('table-pagination/table-content', 'Integration | Component | table pagination/table content', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{table-pagination/table-content}}`);

  assert.equal(this.$().text().trim(), 'Content:');

  // Template block usage:"
  this.render(hbs`
    {{#table-pagination/table-content}}
      template block text
    {{/table-pagination/table-content}}
  `);

  assert.equal(this.$().text().trim().replace(/\s+/g, ' '), 'Content: template block text');
});
