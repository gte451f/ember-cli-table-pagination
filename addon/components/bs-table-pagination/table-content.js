import Ember from 'ember';
import layout from '../../templates/components/bs-table-pagination/table-content';
import ResizeAware from 'ember-resize/mixins/resize-aware';

const { Component, computed, observer, on, run} = Ember;
const { reads } = computed;

export default Component.extend(ResizeAware, {
  layout,
  resizeHeightSensitive: true,
  resizeWidthSensitive: true,

  classNames: ['ember-cli-table-content'],
  // tagName: '',

  showFilter: false,
  scrollMode: reads('contentParams.scrollMode'),
  mainScroll: reads('contentParams.mainScroll'),
  bodyHeight: reads('contentParams.bodyHeight'),
  actionWidth: undefined,

  onInit: on('didInsertElement', function () {
    if (this.get('scrollMode')) {
      this.adjustTableDimensions();
    }
  }),
  showFilterObserver: observer('showFilter', function () {
    if (this.get('scrollMode')) {
      this.adjustTableDimensions();
    }
  }),
  currentContentSizeObserver: observer('currentContentSize', function () {
    // let size = this.get('currentContentSize');
    if (this.get('scrollMode')) {
      this.adjustTableDimensions();
    }
  }),

  //eslint-disable-next-line
  didResize(width, height) {
    if (this.get('scrollMode')) {
      this.adjustTableDimensions();
    }
  },

  adjustTableDimensions() {
    //if we need to resize the table's height
    if (this.get('mainScroll')) {
      this.adjustBodyHeight();
    }
    let columns = this.get('columns');
    run.later(() => {
      this.set('actionWidth', 0);
      columns.forEach((col) => {
        col.set('width', 0);
      });

      let self = this;
      run.later(() => {
        //in anycase, we need to check the width of each cell in the table's body
        let showFilter = self.get('showFilter');
        let firstRow = self.$('tbody > tr:nth-of-type(2) > td');
        let headerRow = self.$('thead > tr:first-of-type > th');
        let footerRow = self.$('tfoot > tr:first-of-type > th');
        let columnWidths = [];
        let contentWidths = [];
        let headerWidths = [];
        let footerWidths = [];
        let actionWidth;
        firstRow.each((idx, cell) => {
          contentWidths[idx] = self.$(cell).innerWidth();
          if (idx === columns.length) {
            actionWidth = self.$(cell).innerWidth();
          }
        });
        headerRow.each((idx, cell) => {
          headerWidths[idx] = self.$(cell).innerWidth();
        });
        footerRow.each((idx, cell) => {
          footerWidths[idx] = self.$(cell).innerWidth();
        });

        let maxWidth;
        let sum = 0;
        let delta = 0;
        for (let i = 0; i < columns.length; i ++) {
          maxWidth = Math.max(headerWidths[i], contentWidths[i] - 0, footerWidths[i]);
          // console.log(`headerWidth[${i}] vs contentWidth[${i}] -> `, headerWidths[i], contentWidths[i]);
          // console.log(`footerWidths[${i}] -> `, footerWidths[i]);
          // console.log(`contentWidth[${i}] - delta -> `, contentWidths[i] - delta);
          // console.log(`maxWidth[${i}] -> `, maxWidth);
          if (showFilter) {
            // the delta business is only for when we show the filters
            if (maxWidth === contentWidths[i] - delta) {
              // if we applied the delta we need to reset it.
              delta = 0;
            } else if (maxWidth === headerWidths[i]) {
              // if we didn't we need to add him
              delta += headerWidths[i] - contentWidths[i];
              // console.log('delta -> ', delta);
            }
          }
          columnWidths[i] = maxWidth;
          sum += maxWidth;
        }
        maxWidth = Math.max(headerWidths[columns.length], contentWidths[columns.length], footerWidths[columns.length]);
        self.set('actionWidth', maxWidth);
        sum += maxWidth;

        // now check if there is some extra space
        let tableWidth = self.$().innerWidth();
        let extra = tableWidth - sum;
        extra = (extra > 0) ? extra: 0;
        extra = extra / columns.length;
        // console.log('we have ', extra, ' extra px / col');
        for (let i = 0; i < columns.length; i ++) {
          columns[i].set('width', columnWidths[i] + extra);
          // columns[i].set('width', tableWidth / columns.length);
        }
        run.later(() => {
          // console.log('second pass');
          actionWidth =
            self.$('thead').outerWidth() +
            self.$('thead').offset().left -
            self.$('tbody > tr:nth-of-type(2) > td:last-of-type').offset().left;
          self.set('actionWidth', actionWidth);
        });
      });
    });
  },
  adjustBodyHeight() {
    // let documentHeight = document.body.clientHeight;
    let above = this.$('tbody').offset().top;
    let height = this.$('tbody').outerHeight();
    let mainContent = this.$().parents('section.content');
    let under = (mainContent.offset().top + mainContent.outerHeight()) -  (above + height);
    // let under = documentHeight - (above + height);

    let bodyHeight = `${window.innerHeight - above - under}px`;
    this.set('bodyHeight', bodyHeight);
  }
});
