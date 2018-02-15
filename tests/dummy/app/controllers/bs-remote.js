import Controller, { inject as controller } from '@ember/controller';
import { reads } from '@ember/object/computed';

import Paginate from '../mixins/table-pager/controller';
import Column from '../mixins/table-pager/column';

export default Controller.extend(Paginate, {
  queryParams: ['quickSearchField', 'q'],

  // load pager specific variables
  columns: [
    Column.create({ 'displayName': '#', 'fieldName': 'idNum', apiName: 'idNumInt' }),
    Column.create({ 'displayName': 'Name', 'fieldName': 'name' }),
    Column.create({ 'displayName': 'Description', 'fieldName': 'description' })
  ],
  // need to open single matter record
  linkPath: 'item',

  appController: controller('application'),
  items: reads('appController.items')
});
