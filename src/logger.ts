import chalk = require('chalk')
/**
* Placeholder for logging
*/

export function info(message: string): void {
  formatOutput(message, 'info', 'cyan')
}

export function warn(message: string): void {
  formatOutput(message, 'warn', 'yellow')
}

export function error(message: string): void {
  formatOutput(message, 'error', 'red')
}

export function debug(message: string): void {
  formatOutput(message, 'debug', 'gray')
}

global.log = {
  info,
  warn,
  error,
  debug
}

function formatOutput(message: string, messageType: string, color: string): void {
  // tslint:disable-next-line:no-console
  const chalkFn = (chalk as any)[color] as Chalk.ChalkChain
  console.log(
    '[%s] %s: %s',
    new Date().toTimeString().slice(0, 8),
    chalkFn(messageType.toLocaleUpperCase()),
    message
  )
}
