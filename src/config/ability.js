import { AbilityBuilder } from 'casl'

function subjectName (item) {
  if (!item || typeof item === 'string') return item
  if (item.__typename && item.__typename.endsWith('Node')) return item.__typename.slice(0, -4).toLowerCase()
  if (item.type) return item.type
  return item
}

export default function (user) {
  return AbilityBuilder.define(
    { subjectName },
    can => {
      if (user && user.username) {
        can(['route'], ['module', 'orgUnit', 'sandbox', 'sync-queue'])
        can(['logout'], 'auth')
        can(['create', 'read'], ['module', 'stage', 'orgUnit'])
        can(['read'], ['module', 'stage', 'orgUnit'])
        can(['edit'], ['module', 'stage', 'orgUnit'], {
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
