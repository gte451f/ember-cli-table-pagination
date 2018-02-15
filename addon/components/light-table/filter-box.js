import Component from '@ember/component';
import layout from '../../templates/components/light-table/filter-box';

export default Component.extend({
  layout,

  click (e) {
    e.preventDefault();
    e.stopPropagation();
  }
});
