import Ember from 'ember';
const {computed} = Ember;

/**
 * simple helper to store the columns that will be used to for display & search on a paginate list
 */
export default Ember.Object.extend({

  //the friendly name
  displayName: null,

  //the model property
  fieldName: null,

  //list this field in the search component?
  enableSearch: true,

  //list this field in the main listing?
  enableDisplay: true,

  //order in which to display the fields
  order: 0,

  // show the quick filter or not
  showingFilter: false,

  // value on the filter for this column
  filterValue: null,

  // To make a column not searchable/sortable
  disableServerInteractions: false,

  // developer supplied value that maps to API field
  // this value is used in preference to fieldName when the client needs to interact with this api field
  apiName: null,

  // calculate to pull either the apiName or fieldName
  apiInteractionName: computed('fieldName', 'apiName', function () {
    if (Ember.isPresent(this.get('apiName'))) {
      return this.get('apiName');
    } else {
      // ie lastName >>  last_name
      return this.get('fieldName').underscore();
    }
  })
});
