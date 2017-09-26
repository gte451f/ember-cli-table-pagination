import Ember from 'ember';
import Paginate from '../mixins/table-pager/route';

const {
  Route
} = Ember;

export default Route.extend(Paginate, {
  modelName: 'item',
  // the name of the current controller since I don't know how to auto detect
  controllerName: 'bs-remote',
  queryParams: {
    quickSearchField: {
      refreshModel: true
    },
    q: {
      refreshModel: true
    }
  },
  actions: {
    save() {
      // Do whatever
      this._super(...arguments);
    }
  }
});
