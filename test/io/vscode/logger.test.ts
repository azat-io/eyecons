import type { OutputChannel } from 'vscode'
import type * as VSCode from 'vscode'

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import type * as LoggerModule from '../../../extension/io/vscode/logger'

describe('logger', () => {
  let date = '1/2/2023, 15:04:05'
  let logger: typeof LoggerModule.logger
  let vscode: typeof VSCode

  /**
   * Lines the logger appended to its output channel.
   *
   * @returns Lines in the order they were written.
   */
  function loggedLines(): string[] {
    let [result] = vi.mocked(vscode.window.createOutputChannel).mock.results
    let channel = result!.value as OutputChannel
    return vi.mocked(channel.appendLine).mock.calls.map(([line]) => line)
  }

  beforeEach(async () => {
    vi.resetModules()
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2023, 0, 2, 15, 4, 5))
    vscode = await import('vscode')
    ;({ logger } = await import('../../../extension/io/vscode/logger'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should write to a single output channel named Eyecons', () => {
    logger.info('First message')
    logger.info('Second message')

    expect(vscode.window.createOutputChannel).toHaveBeenCalledExactlyOnceWith(
      'Eyecons',
    )
  })

  it('should write nothing until the first message', () => {
    expect(vscode.window.createOutputChannel).not.toHaveBeenCalled()
  })

  it('should announce its initialization', () => {
    logger.init()

    expect(loggedLines()).toEqual([`${date}: Eyecons initialized`])
  })

  it.each([
    ['info', 'INFO'],
    ['warn', 'WARN'],
    ['error', 'ERROR'],
    ['debug', 'DEBUG'],
  ] as const)(
    'should write a %s message with its level and time',
    (method, level) => {
      logger[method]('Icons are ready')

      expect(loggedLines()).toEqual([`${date}: [${level}] Icons are ready`])
    },
  )

  it('should write a general message from all its parts', () => {
    logger.log('Built', 42, 'icons')

    expect(loggedLines()).toEqual([`${date}: Built 42 icons`])
  })

  it.each([
    ['info', 'INFO'],
    ['warn', 'WARN'],
    ['error', 'ERROR'],
    ['debug', 'DEBUG'],
  ] as const)(
    'should prefix a %s message of a context logger with the context',
    (method, level) => {
      logger.withContext('Build')[method]('Icons are ready')

      expect(loggedLines()).toEqual([
        `${date}: [${level}] [Build] Icons are ready`,
      ])
    },
  )

  it('should prefix a general message of a context logger with the context', () => {
    logger.withContext('Build').log('Built', 42, 'icons')

    expect(loggedLines()).toEqual([`${date}: [Build] Built 42 icons`])
  })

  it.each([
    ['info', 'showInformationMessage'],
    ['warn', 'showWarningMessage'],
    ['error', 'showErrorMessage'],
  ] as const)(
    'should show a %s message to the user when asked to',
    (method, notification) => {
      logger[method]('Icons are ready', true)

      expect(vscode.window[notification]).toHaveBeenCalledWith(
        'Icons are ready',
      )
    },
  )

  it.each([
    ['info', 'showInformationMessage'],
    ['warn', 'showWarningMessage'],
    ['error', 'showErrorMessage'],
  ] as const)(
    'should show a %s message of a context logger with the context when asked to',
    (method, notification) => {
      logger.withContext('Build')[method]('Icons are ready', true)

      expect(vscode.window[notification]).toHaveBeenCalledWith(
        '[Build] Icons are ready',
      )
    },
  )

  it.each(['info', 'warn', 'error'] as const)(
    'should not show a %s message to the user by default',
    method => {
      logger[method]('Icons are ready')
      logger.withContext('Build')[method]('Icons are ready')

      expect(vscode.window.showInformationMessage).not.toHaveBeenCalled()
      expect(vscode.window.showWarningMessage).not.toHaveBeenCalled()
      expect(vscode.window.showErrorMessage).not.toHaveBeenCalled()
    },
  )
})
