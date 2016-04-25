import Ember from 'ember';

const {
  Controller,
  computed,
  inject
} = Ember;
const { reads } = computed;

export default Controller.extend({
  appController: inject.controller('application'),
  items: reads('appController.items')
});
