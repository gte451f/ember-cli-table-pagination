import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('light-table-pagination', 'Integration | Component | light table pagination', {
  integration: true
});

test('it renders', function(assert) {
  this.doNothing = function() {};
  this.set('columns', Ember.A([
    Ember.Object.create({
      displayName: 'Product Name',
      fieldName: 'name',
      order: 0
    }), Ember.Object.create({
      displayName: 'Price',
      fieldName: 'price',
      order: 1
    })
  ]));
  this.set('items', Ember.A([
    {
      id: 1,
      name: 'Watch 1',
      price: 50
    }, {
      id: 2,
      name: 'Bike 1',
      price: 500
    }
  ]));

  this.render(hbs`{{light-table-pagination content=items columns=columns noFiltering=true changePage=(action this.doNothing)}}`);

  assert.equal(this.$('h3').text().trim(), 'title');
  assert.equal(this.$('.tse-content table').text().trim().replace(/\s+/g, ' '), 'Watch 1 50 Bike 1 500');
});
