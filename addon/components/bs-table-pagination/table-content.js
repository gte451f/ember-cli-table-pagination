import Ember from 'ember';
import layout from '../../templates/components/bs-table-pagination/table-content';
import ResizeAware from 'ember-resize/mixins/resize-aware';

const { Component, computed, on } = Ember;
const { reads } = computed;

export default Component.extend(ResizeAware, {
  layout,
  resizeHeightSensitive: true,
  resizeWidthSensitive: false,

  classNames: ['ember-cli-table-content'],
  // tagName: '',

  showFilter: false,
  scrollMode: reads('contentParams.scrollMode'),
  mainScroll: reads('contentParams.mainScroll'),
  bodyHeight: reads('contentParams.bodyHeight'),

  onInit: on('didInsertElement', function () {
    console.log('on Init !');
    if (this.get('mainScroll')) {
      this.adjustBodyHeight();
    }
  }),

  didResize(width, height) {
    console.log(`Resized! ${width}x${height}`);
    if (this.get('mainScroll')) {
      this.adjustBodyHeight();
    }
  },

  adjustBodyHeight() {
    let documentHeight = document.body.clientHeight;
    console.log('documentHeight -> ', documentHeight);
    let above = this.$('tbody').offset().top;
    console.log('above -> ', above);
    let height = this.$('tbody').outerHeight();
    let under = documentHeight - (above + height);
    console.log('under -> ', under);

    let bodyHeight = `${window.innerHeight - above - under}px`;
    console.log('resizing to -> ', bodyHeight);
    this.set('bodyHeight', bodyHeight);
  }
});
