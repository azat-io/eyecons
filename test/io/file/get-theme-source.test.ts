import { afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'

import { getThemeSource } from '../../../extension/io/file/get-theme-source'

describe('getThemeSource', () => {
  let color = expect.stringMatching(/^#[\da-f]{3,8}$/iu) as string

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each(['dark', 'nord'])(
    'should load the bundled %s theme',
    async themeId => {
      await expect(getThemeSource(themeId)).resolves.toEqual(
        expect.objectContaining({
          main: {
            orange: color,
            yellow: color,
            purple: color,
            green: color,
            blue: color,
            red: color,
          },
          colors: expect.arrayContaining([color]) as string[],
          overrides: expect.any(Object) as object,
        }),
      )
    },
  )

  it('should reject an unknown theme and keep the reason as the cause', async () => {
    await expect(getThemeSource('unknown')).rejects.toMatchObject({
      cause: expect.objectContaining({ code: 'ENOENT' }) as object,
      message: 'Failed to load theme unknown',
    })
  })

  it('should reject a theme that is not valid JSON', async () => {
    vi.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from('not json'))

    await expect(getThemeSource('dark')).rejects.toMatchObject({
      cause: expect.any(SyntaxError) as SyntaxError,
      message: 'Failed to load theme dark',
    })
  })

  it('should keep a non-Error failure as the cause', async () => {
    vi.spyOn(fs, 'readFile').mockRejectedValue('Permission denied')

    await expect(getThemeSource('dark')).rejects.toMatchObject({
      message: 'Failed to load theme dark',
      cause: 'Permission denied',
    })
  })
})
