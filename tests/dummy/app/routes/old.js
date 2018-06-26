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
  }
})
