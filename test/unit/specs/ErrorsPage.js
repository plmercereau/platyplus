import Vue from 'vue'
import ErrorsPage from '@/components/ErrorsPage'

describe('ErrorsPage.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(ErrorsPage)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.serverErrors-page h1').textContent)
      .to.equal('Some serverErrors occurred in loading the page.')
  })
})
