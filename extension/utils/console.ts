import type { OutputChannel } from 'vscode'

import { window } from 'vscode'

let output: OutputChannel

let getDate = () =>
  new Intl.DateTimeFormat('en-US', {
    minute: 'numeric',
    second: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    day: 'numeric',
    hour12: false,
  }).format(new Date())

export let console = {
  init: () => {
    output = window.createOutputChannel('Eyecons')
    output.appendLine(`${getDate()}: Eyecons initialized`)
  },
  log: (...args: unknown[]) => {
    output.appendLine(`${getDate()}: ${args.join(' ')}`)
  },
}
