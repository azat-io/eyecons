import type { Mock } from 'vitest'

import { vi } from 'vitest'

/**
 * Context logger whose methods are spies.
 */
export interface MockLoggerContext {
  /**
   * Records debug messages.
   */
  debug: Mock

  /**
   * Records error messages.
   */
  error: Mock

  /**
   * Records info messages.
   */
  info: Mock

  /**
   * Records warning messages.
   */
  warn: Mock

  /**
   * Records generic log calls.
   */
  log: Mock
}

/**
 * Builds a context logger whose methods are spies.
 *
 * Every test file needs its own instance, because the spies record the calls
 * made by the function under test.
 *
 * @returns Logger context to return from a mocked `logger.withContext`.
 */
export function createMockLoggerContext(): MockLoggerContext {
  return {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    log: vi.fn(),
  }
}
