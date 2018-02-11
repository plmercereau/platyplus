import { createPerimeter } from 'vue-kindergarten'

export default createPerimeter({
  purpose: 'module',
  govern: {
    'can route': function () {
      return this.isAuthenticated()
    }
    // 'can viewParagraph': function () {
    //   return this.isAdmin();
    // },
  },
  isAuthenticated () {
    return this.child.id
  }
})
