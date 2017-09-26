import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bs-table-pagination/table-pager', 'Integration | Component | bs table pagination/table pager', {
  integration: true
});

test('it renders', function(assert) {
  this.doNothing = function () {}

  this.render(hbs`{{bs-table-pagination/table-pager changePage=(action this.doNothing)}}`);

  assert.equal(this.$().text().trim().replace(/\s+/g, ' '), '« »');
});
