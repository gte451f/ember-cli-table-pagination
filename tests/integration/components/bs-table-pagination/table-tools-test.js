import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bs-table-pagination/table-tools', 'Integration | Component | bs table pagination/table tools', {
  integration: true
});

test('it renders', function(assert) {
  this.doNothing = function () {}

  this.render(hbs`{{bs-table-pagination/table-tools changePerPage=(action doNothing)}}`);

  assert.equal(this.$().text().trim().replace(/\s+/g, ' '), '.filter-operator .ember-power-select-dropdown, .filter-operator .ember-power-select, .filter-operator .ember-power-select-trigger { width: 180px; } Per Page: Show all records');
});
