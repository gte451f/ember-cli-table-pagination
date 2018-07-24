import { A } from '@ember/array'
import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('table-pagination', 'Integration | Component | table pagination', {
  integration: true
})

test('it renders', function (assert) {
  this.doNothing = function () {}
  this.set('columns', A())

  this.render(hbs`{{table-pagination columns=columns changePage=(action this.doNothing)}}`)

  assert.equal(this.$().text().trim().replace(/\s+/g, ' '),
    'Pager --> You are on the page # of pages Change page: ' +
    '<Toolbar> tools -> Pager --> You are on the page #1 of 0 pages Change page: </Toolbar> ' +
    'Content: No records found Total Records: 0 | Showing 5 per page « »')
})
