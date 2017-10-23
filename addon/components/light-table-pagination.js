import Ember from 'ember';
import layout from '../templates/components/light-table-pagination';
import TablePagination from './table-pagination';
import Table from 'ember-light-table';

const {
  computed
} = Ember;

export default TablePagination.extend({
  layout: layout,

  // boxClasses: 'box box-top',
  box: true,
  boxTop: true,
  classNames: ['ember-cli-table-pagination'],
  classNameBindings: ['boxSizeClass', 'box', 'boxTop'],

  enableExpandedRows: false,

  // properties
  boxSize: 12,

  // override inherited properties
  perPage: 50,

  height: '80vh',

  useNoWrap: true,

  isInfinite: Ember.computed(function() {
    return typeof this.attrs.loadNext === 'function';
  }),

  // override the components:
  bodyComponent: 'bs-table-pagination.table-body',
  contentComponent: 'bs-table-pagination.table-content', // NOT USED anymore
  footerComponent: 'bs-table-pagination.table-footer',
  pagerComponent: 'bs-table-pagination.table-pager',
  titleComponent: 'bs-table-pagination.table-title',
  toolbarComponent: 'bs-table-pagination.table-toolbar',
  toolsComponent: 'bs-table-pagination.table-tools',
  noDataComponent: 'bs-table-pagination.table-no-data',
  tableActionsComponent: 'light-table-pagination.table-actions',

  didInsertElement() {
    this._super(...arguments);

    // Reposition the scrollbar so that it's always in view
    const $lightTable = this.$('.ember-light-table');
    const $container = this.$('.ember-cli-table-content');

    $container.on('mouseenter scroll', () => {
      const diff = $lightTable.width() - $container.width();
      const leftDiff = $container.offset().left - $lightTable.offset().left;
      let right = diff - leftDiff;
      if (right < 0)
        right = 0;
      this.$('.tse-scrollbar.vertical').css('right', right + 'px');
    });

    Ember.run.later(() => {
      const scrollbarHeight = this.$('.tse-scrollbar.vertical .drag-handle').height();
      if (scrollbarHeight > 0) {
        $container.addClass('table-container--with-scrollbar');
      }

      $container.trigger('mouseenter')
    })
  },

  willDestroyElement() {
    this._super(...arguments);

    const $container = this.$('.ember-cli-table-content');
    $container.off('mouseenter scroll');
  },

  /** light table columns derived from the columns property*/
  ltColumns: computed('tableActionsComponent', 'columns', function () {
    return Ember.A([ {
        label: 'Actions',
        sortable: false,
        width: '75px',
        cellComponent: this.get('tableActionsComponent'),
        cellClassNames: 'nowrap',
        type: 'quick-filter-toggle'
      } ]).pushObjects(
      this.get('columns').map((column) => {
      return {
        label: column.get('displayName'),
        valuePath: column.get('fieldName'),
        sortable: column.get('disableServerInteractions') ? false : true,
        width: column.get('width'),
        cellComponent: column.get('cellComponent'),
        cellClassNames: 'nowrap',
        type: 'base-with-filter',
        tpColumn: column
      };
    }));
  }),
  table: computed('ltColumns', 'content.[]', function() {
    let content;
    let options = {};
    if (typeof this.attrs.loadNext === 'function') {
      content = this.get('content.content');
      options.enableSync = true;
    } else {
      content = this.get('content');
    }
    let t = new Table(this.get('ltColumns'), content, options);

    let tpColumn = this.get('columns').findBy('apiInteractionName', this.get('sortProperty'));
    if (tpColumn) {
      let sortColumn = t.get('allColumns').findBy('valuePath', tpColumn.get('fieldName'));

      if (sortColumn) {
        sortColumn.set('sorted', true);
        sortColumn.set('ascending', this.get('sortDirection') === 'asc');
      }
    }
    return t;
  }),

  actions: {
    onScrolledToBottom() {
      if (typeof this.attrs.loadNext === 'function') {
        this.attrs.loadNext();
      }
    },
    onColumnClick(column) {
      if (column.sorted) {
        /** get the table pagination column */
        let tpColumn = this.get('columns').findBy('fieldName', column.get('valuePath'));
        this.sendAction('changeSort', tpColumn.get('apiInteractionName'), column.get('ascending') ? 'asc' : 'desc');
      }
    }
  }
});
