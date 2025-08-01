import type { Config } from '../../types/config'

/**
 * Converts an absolute file path to a relative path for use in theme schema.
 *
 * @param absolutePath - Absolute path to the file.
 * @param basePath - Base path to convert from (extension root path).
 * @returns Relative path starting with './' for use in theme schema.
 */
export function toRelativePath(
  absolutePath: string,
  { outputPath }: Config,
): string {
  let normalizedAbsolutePath = absolutePath.replaceAll('\\', '/')
  let normalizedBasePath = outputPath.replaceAll('\\', '/')

  let relativePath = normalizedAbsolutePath
  if (normalizedAbsolutePath.startsWith(normalizedBasePath)) {
    relativePath = normalizedAbsolutePath.slice(normalizedBasePath.length)
  }

  if (relativePath.startsWith('/')) {
    relativePath = relativePath.slice(1)
  }

  if (!relativePath.startsWith('./')) {
    relativePath = `./${relativePath}`
  }

  return relativePath
}
