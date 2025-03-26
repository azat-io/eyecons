import type { Vector } from '@texel/color'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ColorMatchContext } from '../../../extension/types/color'

import { filterPaletteForChromatic } from '../../../extension/core/color/filter-palette-for-chromatic'
import * as isAchromaticModule from '../../../extension/core/color/is-achromatic'
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

describe('filterPaletteForChromatic', () => {
  let mockConfig = {
    processing: {
      extremeLightnessThresholds: {
        light: 0.95,
        dark: 0.05,
      },
      lowSaturationThreshold: 0.05,
      saturationFactor: 1.2,
      adjustContrast: true,
    },
    errorHandling: {
      showNotifications: true,
      continueOnError: true,
    },
    logging: {
      level: 'info' as const,
      toFile: false,
    },
    iconDefinitionsPath: '',
    sourceIconsPath: '',
    outputIconsPath: '',
    extensionPath: '',
    version: '1.0.0',
    outputPath: '',
  }

  let chromatic: Vector = [0.5, 0.3, 180]
  let achromatic: Vector = [0.5, 0.02, 0]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(logger.withContext).mockReturnValue(mockLoggerContext)
  })

  it('should filter out achromatic colors when chromatic colors are available', () => {
    let isAchromaticSpy = vi.spyOn(isAchromaticModule, 'isAchromatic')
    isAchromaticSpy.mockReturnValueOnce(false).mockReturnValueOnce(true)

    let themePalette: Vector[] = [chromatic, achromatic]
    let context: ColorMatchContext = {
      sourceAchromatic: false,
      sourceColor: chromatic,
      config: mockConfig,
      themePalette,
    }

    let result = filterPaletteForChromatic(context)

    expect(result).toHaveLength(1)
    expect(result).toContainEqual(chromatic)
    expect(result).not.toContainEqual(achromatic)

    isAchromaticSpy.mockRestore()
  })

  it('should return full palette when no chromatic colors are available', () => {
    let isAchromaticSpy = vi.spyOn(isAchromaticModule, 'isAchromatic')
    isAchromaticSpy.mockReturnValue(true)

    let themePalette: Vector[] = [achromatic, achromatic]
    let context: ColorMatchContext = {
      sourceAchromatic: false,
      sourceColor: chromatic,
      config: mockConfig,
      themePalette,
    }

    let result = filterPaletteForChromatic(context)

    expect(result).toBe(themePalette)
    expect(result).toHaveLength(2)

    isAchromaticSpy.mockRestore()
  })

  it('should handle empty palette', () => {
    let themePalette: Vector[] = []
    let context: ColorMatchContext = {
      sourceAchromatic: false,
      sourceColor: chromatic,
      config: mockConfig,
      themePalette,
    }

    let result = filterPaletteForChromatic(context)

    expect(result).toBe(themePalette)
    expect(result).toHaveLength(0)
  })

  it('should log appropriate messages', () => {
    let isAchromaticSpy = vi.spyOn(isAchromaticModule, 'isAchromatic')

    isAchromaticSpy.mockReturnValue(false)
    let themePaletteWithChromatic: Vector[] = [chromatic, chromatic]
    let contextWithChromatic: ColorMatchContext = {
      themePalette: themePaletteWithChromatic,
      sourceAchromatic: false,
      sourceColor: chromatic,
      config: mockConfig,
    }

    filterPaletteForChromatic(contextWithChromatic)
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Found 2 chromatic colors for chromatic source',
    )

    isAchromaticSpy.mockReturnValue(true)
    let themePaletteWithoutChromatic: Vector[] = [achromatic, achromatic]
    let contextWithoutChromatic: ColorMatchContext = {
      themePalette: themePaletteWithoutChromatic,
      sourceAchromatic: false,
      sourceColor: chromatic,
      config: mockConfig,
    }

    filterPaletteForChromatic(contextWithoutChromatic)
    expect(mockLoggerContext.warn).toHaveBeenCalledWith(
      'No chromatic colors in palette, using full palette',
    )

    isAchromaticSpy.mockRestore()
  })
})
