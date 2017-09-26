import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bs-table-pagination/table-tools', 'Integration | Component | bs table pagination/table tools', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{bs-table-pagination/table-tools}}`);

  assert.equal(this.$().text().trim().replace(/\s+/g, ' '), '.filter-operator .ember-power-select-dropdown, .filter-operator .ember-power-select, .filter-operator .ember-power-select-trigger { width: 180px; } Per Page:');
});
