import getContainerInfo from './getInfo'

/**
 * Get the exposed port number of a Container
 */
export default async function getPort(container: Concierge.Container) {
  const containerInfo = await getContainerInfo(container)
  let ports = containerInfo.NetworkSettings.Ports
  let dockerPort = Object.keys(ports)[0]
  let hostPort = ports[dockerPort][0].HostPort

  return Number(hostPort)
}
