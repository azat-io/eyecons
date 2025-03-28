import { describe, expect, it } from 'vitest'

import { getIconFilename } from '../../../extension/core/icon/get-icon-filename'

describe('getIconFilename', () => {
  it('should return the correct icon filename', () => {
    let id = 'file'
    let hash = 'abc123'

    let result = getIconFilename(id, hash)

    expect(result).toBe('file--abc123.svg')
  })
})
