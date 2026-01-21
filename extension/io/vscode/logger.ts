import * as vscode from 'vscode'

/** Interface for the context-specific logger. */
interface LoggerWithContext {
  /**
   * Log an error message with context.
   *
   * @param message - Message to log.
   * @param [notify] - Whether to show notification.
   */
  error(message: string, notify?: boolean): void

  /**
   * Log an info message with context.
   *
   * @param message - Message to log.
   * @param [notify] - Whether to show notification.
   */
  info(message: string, notify?: boolean): void

  /**
   * Log a warning message with context.
   *
   * @param message - Message to log.
   * @param [notify] - Whether to show notification.
   */
  warn(message: string, notify?: boolean): void

  /**
   * General log method with context.
   *
   * @param arguments_ - Messages to log.
   */
  log(...arguments_: unknown[]): void

  /**
   * Log a debug message with context.
   *
   * @param message - Message to log.
   */
  debug(message: string): void
}

/** Interface for the main logger. */
interface Logger extends LoggerWithContext {
  /**
   * Creates a logger with predefined context prefix.
   *
   * @param context - Context name to prepend to messages.
   * @returns Context-specific logger with the same methods as the main logger.
   */
  withContext(context: string): LoggerWithContext

  /** Initialize the logger and create output channel. */
  init(): void
}

let outputChannel: vscode.OutputChannel | undefined

/**
 * Formats current date and time in a readable format.
 *
 * @returns Formatted date string.
 */
function getFormattedDate(): string {
  return new Intl.DateTimeFormat('en-US', {
    minute: 'numeric',
    second: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    day: 'numeric',
    hour12: false,
  }).format(new Date())
}

/**
 * Gets or creates VS Code output channel.
 *
 * @returns VS Code output channel instance.
 */
function getOutputChannel(): vscode.OutputChannel {
  outputChannel ??= vscode.window.createOutputChannel('Eyecons')
  return outputChannel
}

/**
 * Shows a VS Code information message and explicitly handles the promise.
 *
 * @param message - Message to show.
 */
function showInformationMessage(message: string): void {
  void vscode.window.showInformationMessage(message)
}

/**
 * Shows a VS Code warning message and explicitly handles the promise.
 *
 * @param message - Message to show.
 */
function showWarningMessage(message: string): void {
  void vscode.window.showWarningMessage(message)
}

/**
 * Shows a VS Code error message and explicitly handles the promise.
 *
 * @param message - Message to show.
 */
function showErrorMessage(message: string): void {
  void vscode.window.showErrorMessage(message)
}

/**
 * Logger for the Eyecons extension.
 *
 * @example
 *   logger.init()
 *
 *   // Log messages
 *   logger.info('Processing started')
 *   logger.error('Failed to load file')
 *
 *   // With context
 *   let iconLogger = logger.withContext('IconProcessor')
 *   iconLogger.debug('Processing icon.svg')
 */
export let logger: Logger = {
  /**
   * Creates a logger with predefined context prefix.
   *
   * @param context - Context name to prepend to messages.
   * @returns Context-specific logger with the same methods as the main logger.
   */
  withContext: (context: string): LoggerWithContext => ({
    /**
     * Log an error message with context.
     *
     * @param message - Message to log.
     * @param [notify] - Whether to show notification.
     * @returns Nothing.
     */
    error: (message: string, notify = false): void =>
      logger.error(`[${context}] ${message}`, notify),

    /**
     * Log an info message with context.
     *
     * @param message - Message to log.
     * @param [notify] - Whether to show notification.
     * @returns Nothing.
     */
    info: (message: string, notify = false): void =>
      logger.info(`[${context}] ${message}`, notify),

    /**
     * Log a warning message with context.
     *
     * @param message - Message to log.
     * @param [notify] - Whether to show notification.
     * @returns Nothing.
     */
    warn: (message: string, notify = false): void =>
      logger.warn(`[${context}] ${message}`, notify),

    /**
     * General log method with context.
     *
     * @param arguments_ - Messages to log.
     * @returns Nothing.
     */
    log: (...arguments_: unknown[]): void =>
      logger.log(`[${context}]`, ...arguments_),

    /**
     * Log a debug message with context.
     *
     * @param message - Message to log.
     * @returns Nothing.
     */
    debug: (message: string): void => logger.debug(`[${context}] ${message}`),
  }),

  /**
   * Log an info message.
   *
   * @param message - Message to log.
   * @param [notify] - Whether to show notification.
   */
  info: (message: string, notify = false): void => {
    let channel = getOutputChannel()
    channel.appendLine(`${getFormattedDate()}: [INFO] ${message}`)

    if (notify) {
      showInformationMessage(message)
    }
  },

  /**
   * Log a warning message.
   *
   * @param message - Message to log.
   * @param [notify] - Whether to show notification.
   */
  warn: (message: string, notify = false): void => {
    let channel = getOutputChannel()
    channel.appendLine(`${getFormattedDate()}: [WARN] ${message}`)

    if (notify) {
      showWarningMessage(message)
    }
  },

  /**
   * Log an error message.
   *
   * @param message - Message to log.
   * @param [notify] - Whether to show notification.
   */
  error: (message: string, notify = false): void => {
    let channel = getOutputChannel()
    channel.appendLine(`${getFormattedDate()}: [ERROR] ${message}`)

    if (notify) {
      showErrorMessage(message)
    }
  },

  /**
   * General log method (similar to original console.log).
   *
   * @param arguments_ - Messages to log.
   */
  log: (...arguments_: unknown[]): void => {
    let channel = getOutputChannel()
    channel.appendLine(`${getFormattedDate()}: ${arguments_.join(' ')}`)
  },

  /**
   * Log a debug message.
   *
   * @param message - Message to log.
   */
  debug: (message: string): void => {
    let channel = getOutputChannel()
    channel.appendLine(`${getFormattedDate()}: [DEBUG] ${message}`)
  },

  /** Initialize the logger and create output channel. */
  init: (): void => {
    let channel = getOutputChannel()
    channel.appendLine(`${getFormattedDate()}: Eyecons initialized`)
  },
}
