import Controller, { inject as controller } from '@ember/controller';
import { reads } from '@ember/object/computed';

import Column from '../mixins/table-pager/column'

export default Controller.extend({
  appController: controller('application'),
  items: reads('appController.items'),
  columns: [
    Column.create({ fieldName: 'idNum', apiName: 'idNumInt', displayName: 'id', disableServerInteractions: false, enableSearch: false }),
    Column.create({ fieldName: 'name',  apiName: 'name', displayName: 'name', disableServerInteractions: false, enableSearch: true }),
    Column.create({ fieldName: 'description', apiName: 'description', displayName: 'description', disableServerInteractions: true, enableSearch: true })
  ],

  actions: {
    changePage() {
    }
  }
});
