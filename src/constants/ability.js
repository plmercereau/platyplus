const casl = require('casl')

module.exports = function defineAbilitiesFor (user) {
  return casl.AbilityBuilder.define(
    { subjectName: item => {
      if (item.__typename && item.__typename.endsWith('Node')) return item.__typename.slice(0, -4).toLowerCase()
      return item.type ? item.type : item
    } },
    can => {
      can(['route'], ['home'])
      if (user.username) {
        can(['route'], ['module', 'sandbox'])
        can(['logout'], 'auth')
        can(['create', 'read'], 'module') // TODO handle the case of save (new) button
        can(['read'], 'stage')
        can(['edit', 'create-child'], ['module', 'stage'], {
          ownedBy: {
            username: user.username
          }
        })
        // can(['update', 'delete'], 'Post', { username: user.username })
      } else {
        can(['login'], 'auth')
      }
    }
  )
}
