import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model() {
    let items = [
      { name: 'item 0', idNum: '0', description: 'I\'m the item #0' },
      { name: 'item 1', idNum: '1', description: 'I\'m the item #1' },
      { name: 'item 2', idNum: '2', description: 'I\'m the item #2' },
      { name: 'item 3', idNum: '3', description: 'I\'m the item #3' },
      { name: 'item 4', idNum: '4', description: 'I\'m the item #4' },
      { name: 'item 5', idNum: '5', description: 'I\'m the item #5' },
      { name: 'item 6', idNum: '6', description: 'I\'m the item #6' },
      { name: 'item 7', idNum: '7', description: 'I\'m the item #7' },
      { name: 'item 8', idNum: '8', description: 'I\'m the item #8' },
      { name: 'item 9', idNum: '9', description: 'I\'m the item #9' },
      { name: 'item 10', idNum: '10', description: 'I\'m the item #10' },
      { name: 'item 11', idNum: '11', description: 'I\'m the item #11' },
      { name: 'item 12', idNum: '12', description: 'I\'m the item #12' },
      { name: 'item 13', idNum: '13', description: 'I\'m the item #13' },
      { name: 'item 14', idNum: '14', description: 'I\'m the item #14' },
      { name: 'item 15', idNum: '15', description: 'I\'m the item #15' },
      { name: 'item 16', idNum: '16', description: 'I\'m the item #16' },
      { name: 'item 17', idNum: '17', description: 'I\'m the item #17' },
      { name: 'item 18', idNum: '18', description: 'I\'m the item #18' },
      { name: 'item 19', idNum: '19', description: 'I\'m the item #19' },
      { name: 'item 20', idNum: '20', description: 'I\'m the item #20' },
      { name: 'item 21', idNum: '21', description: 'I\'m the item #21' },
      { name: 'item 22', idNum: '22', description: 'I\'m the item #22' },
      { name: 'item 23', idNum: '23', description: 'I\'m the item #23' },
      { name: 'item 24', idNum: '24', description: 'I\'m the item #24' },
      { name: 'item 25', idNum: '25', description: 'I\'m the item #25' },
      { name: 'item 26', idNum: '26', description: 'I\'m the item #26' },
      { name: 'item 27', idNum: '27', description: 'I\'m the item #27' },
      { name: 'item 28', idNum: '28', description: 'I\'m the item #28' },
      { name: 'item 29', idNum: '29', description: 'I\'m the item #29' },
      { name: 'item 30', idNum: '30', description: 'I\'m the item #30' }
    ];

    return items.map((item) => {
      return this.store.createRecord('item', item);
    });
  }
});
