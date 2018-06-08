import { A } from '@ember/array'
import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('bs-table-pagination', 'Integration | Component | bs table pagination', {
  integration: true
})

test('it renders', function (assert) {
  this.doNothing = function () {}
  this.set('columns', A())

  this.render(hbs`{{bs-table-pagination columns=columns changePage=(action this.doNothing)}}`)

  assert.equal(this.$('h3').text().trim(), 'title')
  assert.equal(this.$('table').text().trim().replace(/\s+/g, ' '), 'No records found Actions')
})
