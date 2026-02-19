import crypto from 'node:crypto'

/**
 * Generates a unique hash based on provided strings.
 *
 * @example
 *
 * ```ts
 * const hash = generateHash('icon.svg', 'Dark Theme', 'blue')
 *
 * // Generate hash for another context
 * const configHash = generateHash(
 *   'settings',
 *   'version-1.2.3',
 *   'user-profile',
 * )
 * ```
 *
 * @param parts - Array of strings to include in hash generation.
 * @returns A unique hash string based on input values.
 */
export function generateHash(...parts: string[]): string {
  let stringToHash = parts.join('--')
  let hash = crypto.createHash('md5').update(stringToHash).digest('hex')
  return hash.slice(0, 8)
}
