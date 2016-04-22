import Ember from 'ember';

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
    { fieldName: 'idNum', sortingField: 'idNumInt', displayName: 'id', disableServerInteractions: false, enableSearch: false },
    { fieldName: 'name',  sortingField: 'name', displayName: 'name', disableServerInteractions: false, enableSearch: true },
    { fieldName: 'description', sortingField: 'description', displayName: 'description', disableServerInteractions: true, enableSearch: true }
  ]
});
