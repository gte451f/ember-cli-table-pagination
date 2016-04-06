import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('old', { restNamespace: true });
  this.route('item', { path: '/item/:item_id' });
});

export default Router;
