import Component from '@ember/component'
import layout from '../../templates/components/light-table/filter-box'
import $ from 'jquery'

export default Component.extend({
  layout,

  click (e) {
    e.preventDefault()
    e.stopPropagation()
  },

  actions: {
    openModal () {
      $('.adv-filter-modal').click()
    }
  }
})
