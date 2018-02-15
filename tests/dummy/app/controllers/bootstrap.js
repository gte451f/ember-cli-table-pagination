import Controller, { inject as controller } from '@ember/controller';
import { reads } from '@ember/object/computed';

export default Controller.extend({
  appController: controller('application'),
  items: reads('appController.items'),
  columns: [
    { fieldName: 'idNum', apiName: 'idNumInt', displayName: 'id', disableServerInteractions: false, enableSearch: false },
    { fieldName: 'name',  apiName: 'name', displayName: 'name', disableServerInteractions: false, enableSearch: true },
    { fieldName: 'description', apiName: 'description', displayName: 'description', disableServerInteractions: true, enableSearch: true }
  ],

  actions: {
    changePage() {
    }
  }
});
