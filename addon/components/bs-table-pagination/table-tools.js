import Ember from 'ember';
import layout from '../../templates/components/bs-table-pagination/table-tools';

const { computed: { reads }, isPresent } = Ember;

const hasFilter = function (c) {
  let hasValues = false
  switch (c.get('advFilterOperator.input')) {
    case 0:
      hasValues = true;
      break;
    case 1:
      hasValues = isPresent(c.get('advFilterValue'));
      break;
    case 2:
      hasValues = isPresent(c.get('advFilterValue')) && isPresent(c.get('advFilterValue2'));
      break;
  }
  return isPresent(c.get('advFilterOperator')) && hasValues;
}

export default Ember.Component.extend({
  layout,
  classNames: ['col-xs-8', 'col-md-8'],

  // properties
  perPageOptions: [50, 100, 250],

  showAll: false,

  onInitComponent: Ember.on('init', function() {
    if(this.get('toolsParams')){
      this.set('perPageFormat', (this.get('toolsParams.perPageFormat')) ? this.get('toolsParams.perPageFormat') : 'select')
      this.set('showAll', this.get('toolsParams.showAll') ? this.get('toolsParams.showAll') : this.get('isInfinite'));
    } else {
      this.set('showAll', this.get('isInfinite'));
    }
  }),

  allowAdvancedFilter: Ember.computed('allowQuickSearch', function() {
    return this.get('allColumns.length') > 0 && this.get('allowQuickSearch');
  }),

  filters: Ember.computed('allColumns.@each.{advFilterOperator,advFilterValue,advFilterValue2}', function () {
    return this.get('allColumns').filter(hasFilter);
  }),

  perPageFormat: 'select',

  operators: [
    Ember.Object.create({display: 'Contains', value: 'contains', input: 1}),
    Ember.Object.create({display: 'Does not contain:', value: 'not_contains', input: 1}),
    Ember.Object.create({display: 'Is equal to:', value: 'equal', input: 1}),
    Ember.Object.create({display: 'Is not equal to:', value: 'not_equal', input: 1}),
    Ember.Object.create({display: 'Is blank:', value: 'blank', input: 0}),
    Ember.Object.create({display: 'Is not blank:', value: 'not_blank', input: 0}),
    Ember.Object.create({display: 'Between:', value: 'between', input: 2})
  ],

  buttonLink: reads('toolsParams.buttonLink'),
  buttonText: reads('toolsParams.buttonText'),

  actions: {
    showAllRecords() {
      this.set('showAll', true);
      this.attrs.changePerPage(100000000); // 100 million records
      this.attrs.refresh();
    },
    showByPageRecords() {
      this.set('showAll', false);
      this.attrs.changePerPage(this.get('perPageOptions.firstObject'));
      this.attrs.refresh();
    },
    applyFilter () {
      let columnsWithFilter = this.get('allColumns').filter(hasFilter);

      let extraParams = {};
      columnsWithFilter.forEach((c) => {
        let filter = '';
        let value = c.get('advFilterValue');
        let value2 = c.get('advFilterValue2');
        switch (c.get('advFilterOperator.value')) {
          case 'contains':
            filter = '*' + value + '*';
            break;
          case 'not_contains':
            filter = '!' + value + '!';
            break;
          case 'equal':
            filter = value;
            break;
          case 'not_equal':
            filter = '!=' + value;
            break;
          case 'blank':
            filter = 'NULL||';
            break;
          case 'not_blank':
            filter = '!NULL||!=';
            break;
          case 'between':
            filter = '~' + value + '~' + value2;
            break;
        }
        extraParams[c.get('apiInteractionName')] = filter;
      });

      Ember.Logger.debug('Parameters for advanced filter', extraParams);
      this.attrs.runAdvancedSearch(extraParams);

      this.set('showFilterDialog', false);
    },

    clearFilter(column) {
      column.setProperties({
        advFilterValue: null,
        advFilterValue2: null,
        advFilterOperator: this.get('operators.firstObject')
      });
    },

    clearAllFilters () {
      let columnsWithFilter = this.get('allColumns').filter(hasFilter);

      columnsWithFilter.setEach('advFilterValue', null);
      columnsWithFilter.setEach('advFilterValue2', null);
      columnsWithFilter.setEach('advFilterOperator', this.get('operators.firstObject'));

      this.send('applyFilter');
    }
  }
});
