import Ember from 'ember';

var Column = Ember.Object.extend({

    //the friendly name
    displayName: null,

    //the model property
    fieldName: null,

    //list this field in the search component?
    enableSearch: true,

    //list this field in the main listing?
    enableDisplay: true,

    //order in which to display the fields
    order: 0
});


/**
 * store shared logic to run pager logic
 */
export default Ember.Mixin.create({
    // setup our query params including custom sortField value
    queryParams: ["page", "perPage", "sortField"],

    pageList: [
        5, 10, 25, 50, 100, 250, 500
    ],

    // binding the property on the paged array
    // to the query params on the controller
    pageBinding: "content.page",
    perPageBinding: "content.perPage",
    totalPagesBinding: "content.totalPages",

    //logic to handle sorting a list
    sortField: 'id',
    sortOrder: '', // a - means desc

    // disabled by default
    // set these in the controller to enable and bind to a specific field
    quickSearchField: null,
    quickSearch: null,

    page: 1,
    perPage: 10,
    totalRecords: null,

    column: Ember.Object.extend({
        display: null,
        field: null
    }),

    //load pager specific variables
    columns: [
        Column.create({'displayName': '#', 'fieldName': 'id'})
    ],

    // bootstrap or adminlte specific classes
    // color default|success|primary|warning|danger|info
    box: 'default',
    button: 'default',

    // display the table title if there is one
    tableTitle: 'set tableTitle in controller to NULL to hide otherwise set this to your table title',

    // where should the default open action link-to?
    linkPath: "set linkPath in the controller",

    // not sure what this is
    createPath: "set createPath in the controller"
});
