import cmd from './cmd'
import appPath from './path'

export default async function getRemoteTags(application: Concierge.Application) {
  const workDir = appPath(application)
  const command = `git ls-remote --tags --heads`
  const result = await cmd(application, workDir, command)

  const tags = result
    .split('\n')
    .filter(line => !!line.trim())
    .map(raw => {
      const rawRef = raw.split('refs/')[1]
      const ref = rawRef.replace('heads/', '').replace('tags/', '')
      const type = rawRef.startsWith('heads/') ? 'branch' : 'tag'
      return { type, ref }
    })
    .filter(ref => !!ref.ref)
    .filter(ref => !ref.ref.endsWith('^{}'))

  return tags
}