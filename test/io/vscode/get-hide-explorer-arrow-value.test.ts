import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getHideExplorerArrowValue } from '../../../extension/io/vscode/get-hide-explorer-arrow-value'
import { mockSettings } from '../../helpers/mock-settings'

describe('getHideExplorerArrowValue', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should hide the explorer arrows when the user enabled it', () => {
    mockSettings({ eyecons: { hidesExplorerArrows: true } })

    expect(getHideExplorerArrowValue()).toBeTruthy()
  })

  it('should show the explorer arrows when the user disabled hiding them', () => {
    mockSettings({ eyecons: { hidesExplorerArrows: false } })

    expect(getHideExplorerArrowValue()).toBeFalsy()
  })

  it('should hide the explorer arrows when the user has not configured it', () => {
    expect(getHideExplorerArrowValue()).toBeTruthy()
  })

  it('should ignore the setting of another extension', () => {
    mockSettings({ otherExtension: { hidesExplorerArrows: false } })

    expect(getHideExplorerArrowValue()).toBeTruthy()
  })
})
