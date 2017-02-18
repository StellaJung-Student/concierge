import getDockerClient from '../dockerClient'
import * as getHosts from '../hosts/get'
import updatePorts from '../hosts/updatePorts'
import * as emitter from './emitter'
import * as log from '../../logger'
import watchContainers from './containers'

export default function watch() {
  return getHosts.all()
    .then(listenToHosts)
}

function listenToHosts(hosts: Concierge.Host[]) {
  const getEvents = host => {
    let client = getDockerClient(host)

    client.getEvents({}, (err, data: NodeJS.ReadableStream) => {
      if (err) {
        log.error(`[${host.hostname}] Failed to stream Docker events: ${err}`)
        return
      }
      data.on('data', eventHandler)
      log.info(`[${host.hostname}] Streaming Docker events`)
    })
  }

  hosts.forEach(getEvents)
}

function eventHandler(eventJson: string) {
  let event: DockerEvent = JSON.parse(eventJson)
  let shortDockerId = (event.id || 'Docker').substring(0, 10)
  let status = (event.status || 'N/A').toUpperCase()
  let prefix = `[${shortDockerId}:${status}] `
  log.info(prefix + 'Container event detected. Updating ports...')
  emitter.host('All', `Container ${shortDockerId} state emitted '${status}'`)

  updatePorts()
    .then(() => log.info(prefix + 'Successfully updated ports'))
    .catch(error => log.error(prefix + 'Failed: ' + error))

  if (status === 'START') {
    watchContainers()
  }
}

interface DockerEvent {
  status: string
  id: string
  from: string
  time: number
}