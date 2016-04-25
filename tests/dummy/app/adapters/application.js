import ENV from '../config/environment';
import ActiveModelAdapter from 'active-model-adapter';

const ApplicationAdapter = ActiveModelAdapter.extend({
  // authorizer: 'authorizer:application',
  namespace: ENV.APP.restNameSpace// ,
  // host: ENV.APP.restDestination,
  // // In ember-data 2.0 we can remove this, just to remove a deprecation message
  // shouldBackgroundReloadRecord() {
  //   return true;
  // },
  // shouldReloadAll() {
  //   return true;
  // }
});

export default ApplicationAdapter;
