import { isPresent } from '@ember/utils';
import layout from '../../../templates/components/light-table/columns/quick-filter-toggle';
import ColumnsBase from 'ember-light-table/components/columns/base';

export default ColumnsBase.extend({
  layout,

  allChecked: false,

  actions: {
    toggleFilters () {
      this.get('table.visibleColumns').forEach((col) => {
        let tpColumn = col.get('tpColumn');
        if (isPresent(tpColumn)) {
          tpColumn.toggleProperty('showFilter');
        }
      });
    }
  }
});
