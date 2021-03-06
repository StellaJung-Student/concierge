import * as events from 'events'
import { socket } from '../../server'

const emitter = new events.EventEmitter()

export function container(subdomain: string, event: any) {
  emitter.emit('container', subdomain, event)
}

export function containerStats(subdomain: string, stats: any) {
  emitter.emit('container-stats', subdomain, stats)
}

export function host(hostname: string, event: any) {
  emitter.emit('host', hostname, event)
}

export function build(name: string, event: any) {
  emitter.emit('build', name, event)
}

export function buildStatus(appId: number, event: BuildStatusEvent) {
  emitter.emit('build-status', appId, event)
}

export type ToastType = 'info' | 'warning' | 'error' | 'success'
export function toast(type: ToastType, message: string) {
  socket.emit('toast', newEvent('toast', type, message))
}

emitter.addListener('container', (subdomain: string, event: any) => {
  socket.emit('event', newEvent(subdomain, 'Container', event))
})

emitter.addListener('host', (hostname: string, event: any) => {
  socket.emit('event', newEvent(hostname, 'Host', event))
})

emitter.addListener('build', (name: string, event: any) => {
  socket.emit('build', newEvent(name, 'Build', event))
})

emitter.addListener('container-stats', (subdomain: string, stats: any) => {
  socket.emit('stats', newEvent(subdomain, 'Container', stats))
})

emitter.addListener('build-status', (appId: number, event: any) => {
  socket.emit('build-status', newEvent(appId.toString(), 'BuildStatus', event))
})

function newEvent(name: string, type: string, event: string) {
  return { name, type, event }
}
