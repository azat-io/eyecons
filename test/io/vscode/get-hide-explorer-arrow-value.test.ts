import { beforeEach, describe, expect, it, vi } from 'vitest'
import { workspace } from 'vscode'

import { getHideExplorerArrowValue } from '../../../extension/io/vscode/get-hide-explorer-arrow-value'

vi.mock('vscode')

describe('getHideExplorerArrowValue', () => {
  let mockGet = vi.fn()
  let mockHas = vi.fn()
  let mockInspect = vi.fn()
  let mockUpdate = vi.fn()

  let mockConfiguration = {
    inspect: mockInspect,
    update: mockUpdate,
    get: mockGet,
    has: mockHas,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(workspace, 'getConfiguration').mockReturnValue(mockConfiguration)
  })

  it('should return true when hidesExplorerArrows is set to true', () => {
    mockGet.mockReturnValueOnce(true)

    let result = getHideExplorerArrowValue()

    expect(workspace.getConfiguration).toHaveBeenCalledWith('eyecons')
    expect(mockGet).toHaveBeenCalledWith('hidesExplorerArrows')
    expect(result).toBeTruthy()
  })

  it('should return false when hidesExplorerArrows is set to false', () => {
    mockGet.mockReturnValueOnce(false)

    let result = getHideExplorerArrowValue()

    expect(workspace.getConfiguration).toHaveBeenCalledWith('eyecons')
    expect(mockGet).toHaveBeenCalledWith('hidesExplorerArrows')

    expect(result).toBeFalsy()
  })

  it('should return true by default when hidesExplorerArrows is null', () => {
    mockGet.mockReturnValueOnce(null)

    let result = getHideExplorerArrowValue()

    expect(workspace.getConfiguration).toHaveBeenCalledWith('eyecons')
    expect(mockGet).toHaveBeenCalledWith('hidesExplorerArrows')

    expect(result).toBeTruthy()
  })

  it('should return true by default when hidesExplorerArrows is undefined', () => {
    mockGet.mockReturnValue(undefined)

    let result = getHideExplorerArrowValue()

    expect(workspace.getConfiguration).toHaveBeenCalledWith('eyecons')
    expect(mockGet).toHaveBeenCalledWith('hidesExplorerArrows')

    expect(result).toBeTruthy()
  })
})
