import { AbilityBuilder } from 'casl'

function subjectName (item) {
  if (!item || typeof item === 'string') return item
  if (item.__typename && item.__typename.endsWith('Node')) return item.__typename.slice(0, -4).toLowerCase()
  if (item.type) return item.type
  return item
}

export default function defineAbilitiesFor (user) {
  return AbilityBuilder.define(
    { subjectName },
    can => {
      if (user && user.username) {
        can(['route'], ['module', 'sandbox', 'sync-queue'])
        can(['logout'], 'auth')
        can(['create', 'read'], ['module', 'stage'])
        can(['read'], ['module', 'stage'])
        can(['edit'], ['module', 'stage'], {
          id: null
        })
        can(['edit', 'create-child'], 'module', {
          ownedBy: {
            username: user.username
          }
        })
        can('edit', 'stage', {
          module:
            {
              ownedBy: {
                username: user.username
              }
            }
        })
        can(['update', 'delete'], 'Post', { username: user.username })
      } else {
        can(['login'], 'auth')
      }
      can(['route'], 'home')
    }
  )
}
