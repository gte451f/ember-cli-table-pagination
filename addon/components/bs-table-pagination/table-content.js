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
    console.log('on Init !');
    if (this.get('scrollMode')) {
      this.adjustTableDimensions();
    }
  }),
  currentContentSizeObserver: observer('currentContentSize', function () {
    let size = this.get('currentContentSize');
    if (this.get('scrollMode')) {
      console.log('adjusting based on the currentContent size');
      this.adjustTableDimensions();
    }
  }),

  didResize(width, height) {
    console.log(`Resized! ${width}x${height}`);
    if (this.get('scrollMode')) {
      this.adjustTableDimensions();
    }
  },

  adjustTableDimensions() {
    //if we need to resize the table's height
    if (this.get('mainScroll')) {
      this.adjustBodyHeight();
    }
    run.later(() => {
      //in anycase, we need to check the width of each cell in the table's body
      let firstRow = this.$('tbody > tr:first-of-type > td');
      let headerRow = this.$('thead > tr:first-of-type > th');
      let contentWidths = [];
      let headerWidths = [];
      let columns = this.get('columns');
      let actionWidth;
      firstRow.each((idx, cell) => {
        contentWidths[idx] = this.$(cell).innerWidth();
        if (idx === columns.length) {
          actionWidth = (this.$('thead').outerWidth() + this.$('thead').offset().left - this.$(cell).offset().left);
        }
      });
      headerRow.each((idx, cell) => {
        headerWidths[idx] = this.$(cell).innerWidth();
      });

      for (let i = 0; i < columns.length; i ++) {
        columns[i].set('width', (headerWidths[i] > contentWidths[i])? headerWidths[i] : contentWidths[i]);
      }
      this.set('actionWidth', Math.max(headerWidths[columns.length], contentWidths[columns.length], actionWidth));
    });
  },
  adjustBodyHeight() {
    let documentHeight = document.body.clientHeight;
    console.log('documentHeight -> ', documentHeight);
    let above = this.$('tbody').offset().top;
    console.log('above -> ', above);
    let height = this.$('tbody').outerHeight();
    let mainContent = this.$().parents('section.content');
    let under = (mainContent.offset().top + mainContent.outerHeight()) -  (above + height);
    // let under = documentHeight - (above + height);

    let bodyHeight = `${window.innerHeight - above - under}px`;
    this.set('bodyHeight', bodyHeight);
  }
});
