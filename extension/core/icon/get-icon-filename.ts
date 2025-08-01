/**
 * Get the icon filename to save.
 *
 * @param id - Icon identifier.
 * @param hash - Generated hash for the icon.
 * @returns Icon filename to save.
 */
export function getIconFilename(id: string, hash: string): string {
  return `${id}--${hash}.svg`
}
