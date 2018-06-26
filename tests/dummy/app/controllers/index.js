import Controller, { inject as controller } from '@ember/controller'
import { reads } from '@ember/object/computed'

export default Controller.extend({
  appController: controller('application'),
  items: reads('appController.items'),

  actions: {
    changePage () {
    }
  }
})
