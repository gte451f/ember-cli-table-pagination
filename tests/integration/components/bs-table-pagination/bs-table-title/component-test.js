import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bs-table-pagination/bs-table-title', 'Integration | Component | bs table pagination/bs table title', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{bs-table-pagination/bs-table-title}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#bs-table-pagination/bs-table-title}}
      template block text
    {{/bs-table-pagination/bs-table-title}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});