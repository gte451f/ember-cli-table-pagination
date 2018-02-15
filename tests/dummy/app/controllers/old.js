import Controller from '@ember/controller';
// import { reads } from '@ember/object/computed';

import Paginate from '../mixins/table-pager/controller';
import Column from '../mixins/table-pager/column';

export default Controller.extend(Paginate, {
  queryParams: ['quickSearchField', 'q'],

  // load pager specific variables
  columns: [
    Column.create({ 'displayName': '#', 'fieldName': 'idNum', 'order': 0 }),
    Column.create({ 'displayName': 'Name', 'fieldName': 'name', 'order': 1 }),
    Column.create({ 'displayName': 'Description', 'fieldName': 'description', 'order': 2 })
  ],
  // need to open single matter record
  linkPath: 'item',

  tableTitle: 'title'

  // appController: inject.controller('application'),
  // items: reads('appController.items')
});
