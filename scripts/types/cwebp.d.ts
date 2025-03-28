interface CWebpEncoder {
  /**
   * Encode the image with the given options
   *
   * @param output - Output file path
   */
  write(output: string): Promise<void>

  _args: Record<string, unknown[]>
}

declare module 'cwebp' {
  /**
   * Create a new WebP encoder
   *
   * @param {string} source - Source file path.
   * @returns {CWebpEncoder} A new CWebpEncoder instance.
   */
  function cwebp(source: string): CWebpEncoder

  export default cwebp
}
