/**
 * Get the icon filename to save.
 *
 * @param {string} id - Icon identifier.
 * @param {string} hash - Generated hash for the icon.
 * @returns {string} Icon filename to save.
 */
export function getIconFilename(id: string, hash: string): string {
  return `${id}--${hash}.svg`
}
