import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('old', { resetNamespace: true });
  this.route('item', { path: '/item/:item_id' });
  this.route('bootstrap');
  this.route('bs-remote');
});

export default Router;
