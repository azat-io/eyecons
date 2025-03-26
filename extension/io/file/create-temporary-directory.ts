import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'

import { logger } from '../vscode/logger'

/**
 * Creates a temporary directory for storing icons.
 *
 * @returns {Promise<string>} The path to the created temporary directory.
 */
export let createTemporaryDirectory = async (): Promise<string> => {
  let ioLogger = logger.withContext('TemporaryDirectory')

  try {
    let temporaryDirectoryPrefix = path.join(os.tmpdir(), 'eyecons-')
    let temporaryDirectory = await fs.mkdtemp(temporaryDirectoryPrefix)
    ioLogger.debug(`Created temporary directory: ${temporaryDirectory}`)
    return temporaryDirectory
  } catch (error) {
    ioLogger.error(
      `Failed to create temporary directory: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    throw error
  }
}
