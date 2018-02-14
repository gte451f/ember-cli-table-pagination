import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('old', { resetNamespace: true });
  this.route('item', { path: '/item/:item_id' });
  this.route('bootstrap');
  this.route('lighttable');
  this.route('bs-remote');
});

export default Router;
