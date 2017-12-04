import Ember from 'ember';
import Column from '../mixins/table-pager/column'

const {
  Controller,
  computed,
  inject
} = Ember;
const { reads } = computed;

export default Controller.extend({
  appController: inject.controller('application'),
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
