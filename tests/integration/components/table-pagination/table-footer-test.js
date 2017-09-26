import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('table-pagination/table-footer', 'Integration | Component | table pagination/table footer', {
  integration: true
});

test('it renders', function(assert) {
  this.doNothing = function () {}

  this.render(hbs`{{table-pagination/table-footer changePage=(action this.doNothing)}}`);

  assert.equal(this.$().text().trim().replace(/\s+/g, ' '), 'Total Records: | Showing per page « »');
});
