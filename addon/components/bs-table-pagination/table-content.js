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
      let columns = this.get('columns');
      let self = this;
      firstRow.each((idx, cell) => {
        if (idx < columns.length) {
          let cellWidth = self.$(cell).outerWidth();
          console.log('col ', idx, ' width -> ', cellWidth);
          columns[ idx ].set('width', cellWidth);
        } else {
          // debugger;
          // self.set('actionWidth', cell.offsetWidth);
          let actionWidth = (self.$('thead').outerWidth() + self.$('thead').offset().left - self.$(cell).offset().left);
          self.set('actionWidth', actionWidth);
          console.log('col ', idx, ' width -> ', actionWidth);
        }
      });

      run.later(() => {
        self.$('thead > tr:first-of-type > th').each((idx, cell) => {
          if (idx < columns.length) {
            let cellWidth = self.$(cell).innerWidth();
            console.log('adjusting -> col ', idx, ' width -> ', cellWidth);
            if (columns[ idx ].get('width') < cellWidth) {
              columns[ idx ].set('width', cellWidth);
            }
          } else {
            // debugger;
            // self.set('actionWidth', cell.offsetWidth);
            let actionWidth = self.$(cell).innerWidth();
            if (self.get('actionWidth') < actionWidth) {
              self.set('actionWidth', actionWidth);
            }
            console.log('adjusting -> col ', idx, ' width -> ', actionWidth);
          }
        });
      });
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
