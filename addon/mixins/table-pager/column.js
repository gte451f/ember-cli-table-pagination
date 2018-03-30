import { isPresent } from '@ember/utils';
import EmberObject, { computed } from '@ember/object';
import { underscore } from '@ember/string';

/**
 * simple helper to store the columns that will be used to for display & search on a paginate list
 */
export default EmberObject.extend({

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
    if (isPresent(this.get('apiName'))) {
      return this.get('apiName');
    } else if (isPresent(this.get('fieldName'))) {
      return underscore(this.get('fieldName'));
    }
  }),

  width: undefined,


  // Advanced Filter fields
  advFilterOperator: EmberObject.create({display: 'Contains', value: 'contains', input: 1}),
  advFilterValue: undefined,
  advFilterValue2: undefined
});
