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
    { fieldName: 'idNum', displayName: 'id', disableServerInteractions: false, enableSearch: false, showingFilter: false },
    { fieldName: 'name', displayName: 'name', disableServerInteractions: false, enableSearch: true, showingFilter: false },
    { fieldName: 'description', displayName: 'description', disableServerInteractions: true, enableSearch: true, showingFilter: false }
  ]
});
