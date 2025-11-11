import type { Vector } from '@texel/color'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { refineColorsByProperties } from '../../../extension/core/color/refine-colors-by-properties'
import { logger } from '../../../extension/io/vscode/logger'

let mockLoggerContext = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

vi.mock('../../../extension/io/vscode/logger', () => ({
  logger: {
    withContext: vi.fn(),
  },
}))

describe('refineColorsByProperties', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(logger.withContext).mockReturnValue(mockLoggerContext)
  })

  it('should return palette as is when it has 1 or 0 colors', () => {
    let sourceColor: Vector = [0.5, 0.1, 300]
    let emptyPalette: Vector[] = []
    let singleColorPalette: Vector[] = [[0.6, 0.15, 280]]

    expect(refineColorsByProperties(sourceColor, emptyPalette)).toEqual(
      emptyPalette,
    )
    expect(refineColorsByProperties(sourceColor, singleColorPalette)).toEqual(
      singleColorPalette,
    )
  })

  it('should filter purple-pink colors correctly', () => {
    let purpleColor: Vector = [0.5, 0.08, 300]
    let palette: Vector[] = [
      [0.6, 0.06, 260],
      [0.5, 0.08, 300],
      [0.7, 0.06, 300],
      [0.4, 0.09, 200],
    ]

    let result = refineColorsByProperties(purpleColor, palette)

    expect(result).toHaveLength(1)
    expect(result).toContainEqual([0.5, 0.08, 300])
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Further refined to 1 pure purple/magenta colors',
    )
  })

  it('should filter saturated yellow colors correctly', () => {
    let yellowColor: Vector = [0.7, 0.09, 60]
    let palette: Vector[] = [
      [0.6, 0.09, 50],
      [0.5, 0.07, 70],
      [0.7, 0.09, 180],
    ]

    let result = refineColorsByProperties(yellowColor, palette)

    expect(result).toHaveLength(1)
    expect(result).toContainEqual([0.6, 0.09, 50])
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Further refined to 1 saturated yellow colors',
    )
  })

  it('should filter bright saturated colors correctly', () => {
    let brightColor: Vector = [0.85, 0.15, 180]
    let palette: Vector[] = [
      [0.7, 0.1, 185],
      [0.6, 0.08, 165],
      [0.5, 0.12, 250],
    ]

    let result = refineColorsByProperties(brightColor, palette)

    expect(result).toHaveLength(1)
    expect(result).toContainEqual([0.7, 0.1, 185])
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Further refined to 1 saturated colors with similar hue colors',
    )
  })

  it('should filter high saturation colors correctly', () => {
    let highSatColor: Vector = [0.5, 0.2, 180]
    let palette: Vector[] = [
      [0.6, 0.15, 185],
      [0.5, 0.08, 180],
      [0.7, 0.16, 190],
    ]

    let result = refineColorsByProperties(highSatColor, palette)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual([0.6, 0.15, 185])
    expect(result).toContainEqual([0.7, 0.16, 190])
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Further refined to 2 high-saturation colors',
    )
  })

  it('should filter bright colors with medium saturation correctly', () => {
    let brightMedSatColor: Vector = [0.85, 0.06, 180]
    let palette: Vector[] = [
      [0.75, 0.09, 185],
      [0.65, 0.09, 180],
      [0.8, 0.07, 190],
    ]

    let result = refineColorsByProperties(brightMedSatColor, palette)

    expect(result).toHaveLength(1)
    expect(result).toContainEqual([0.75, 0.09, 185])
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Further refined to 1 bright, saturated colors',
    )
  })

  it('should continue when a refinement condition matches but no colors pass filter', () => {
    let purpleSource: Vector = [0.6, 0.08, 300]
    let palette: Vector[] = [
      [0.5, 0.05, 200],
      [0.55, 0.06, 150],
      [0.52, 0.04, 90],
    ]

    let result = refineColorsByProperties(purpleSource, palette)

    expect(result).toBe(palette)
    expect(mockLoggerContext.info).not.toHaveBeenCalled()
  })

  it('should return original palette when no refinement conditions match', () => {
    let normalColor: Vector = [0.5, 0.04, 180]
    let palette: Vector[] = [
      [0.6, 0.05, 185],
      [0.5, 0.04, 180],
    ]

    let result = refineColorsByProperties(normalColor, palette)

    expect(result).toEqual(palette)
    expect(mockLoggerContext.info).not.toHaveBeenCalled()
  })
})
