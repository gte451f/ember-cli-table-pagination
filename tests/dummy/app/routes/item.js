import Route from '@ember/routing/route'
import Paginate from '../mixins/table-pager/route'

export default Route.extend(Paginate, {
  modelName: 'item',
  // the name of the current controller since I don't know how to auto detect
  controllerName: 'old',
  queryParams: {
    quickSearchField: {
      refreshModel: true
    },
    q: {
      refreshModel: true
    }
  },

  model (params) {
    // remove the query params b/c are sent to the backend and return error
    delete params.q
    delete params.quickSearchField
    return this._super(params)
  },

  setupController (controller, resolved) {
    this._super(controller, resolved)
    controller.set('q', controller.get('quickSearch'))
  }
})
