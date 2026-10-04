import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getFolderColor } from '../../../extension/io/vscode/get-folder-color'
import { mockSettings } from '../../helpers/mock-settings'

describe('getFolderColor', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it.each(['red', 'orange', 'yellow', 'green', 'blue', 'purple'])(
    'should use the %s folder color the user selected',
    folderColor => {
      mockSettings({ eyecons: { folderColor } })

      expect(getFolderColor()).toBe(folderColor)
    },
  )

  it('should use blue when the user selected no folder color', () => {
    expect(getFolderColor()).toBe('blue')
  })

  it('should use blue when the selected folder color is unknown', () => {
    mockSettings({ eyecons: { folderColor: 'pink' } })

    expect(getFolderColor()).toBe('blue')
  })

  it('should ignore a folder color set for another extension', () => {
    mockSettings({ otherExtension: { folderColor: 'red' } })

    expect(getFolderColor()).toBe('blue')
  })
})
