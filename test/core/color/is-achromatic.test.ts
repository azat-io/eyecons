import { describe, expect, it } from 'vitest'

import type { Config } from '../../../extension/types/config'

import { isAchromatic } from '../../../extension/core/color/is-achromatic'

describe('isAchromatic', () => {
  let mockConfig: Config = {
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
      level: 'info',
      toFile: false,
    },
    iconDefinitionsPath: '',
    sourceIconsPath: '',
    outputIconsPath: '',
    extensionPath: '',
    version: '1.0.0',
    outputPath: '',
  }

  it('should identify colors with chroma > 0.1 as chromatic', () => {
    let colorWithHighChroma: [number, number, number] = [0.5, 0.12, 180]
    expect(isAchromatic(colorWithHighChroma, mockConfig)).toBeFalsy()
  })

  it('should identify colors with chroma < lowSaturationThreshold as achromatic', () => {
    let colorWithLowChroma: [number, number, number] = [0.5, 0.04, 180]
    expect(isAchromatic(colorWithLowChroma, mockConfig)).toBeTruthy()

    let colorAtThreshold: [number, number, number] = [0.5, 0.05, 180]
    expect(isAchromatic(colorAtThreshold, mockConfig)).toBeTruthy()
  })

  it('should identify very dark colors with moderate chroma as achromatic', () => {
    let darkColor: [number, number, number] = [0.03, 0.08, 180]
    expect(isAchromatic(darkColor, mockConfig)).toBeTruthy()

    let darkColorHighChroma: [number, number, number] = [0.03, 0.16, 180]
    expect(isAchromatic(darkColorHighChroma, mockConfig)).toBeFalsy()
  })

  it('should identify very light colors with moderate chroma as achromatic', () => {
    let lightColor: [number, number, number] = [0.97, 0.09, 180]
    expect(isAchromatic(lightColor, mockConfig)).toBeTruthy()

    let lightColorHighChroma: [number, number, number] = [0.97, 0.11, 180]
    expect(isAchromatic(lightColorHighChroma, mockConfig)).toBeFalsy()
  })

  it('should identify colors with normal lightness and moderate chroma as chromatic', () => {
    let normalColor: [number, number, number] = [0.5, 0.07, 180]
    expect(isAchromatic(normalColor, mockConfig)).toBeFalsy()
  })

  it('should work with different config thresholds', () => {
    let customConfig: Config = {
      ...mockConfig,
      processing: {
        ...mockConfig.processing,
        extremeLightnessThresholds: {
          light: 0.9,
          dark: 0.1,
        },
        lowSaturationThreshold: 0.1,
      },
    }

    let borderlineColor: [number, number, number] = [0.5, 0.09, 180]
    expect(isAchromatic(borderlineColor, mockConfig)).toBeFalsy()
    expect(isAchromatic(borderlineColor, customConfig)).toBeTruthy()

    let nearLightThreshold: [number, number, number] = [0.92, 0.15, 180]
    expect(isAchromatic(nearLightThreshold, mockConfig)).toBeFalsy()
    expect(isAchromatic(nearLightThreshold, customConfig)).toBeFalsy()
  })

  it('should correctly identify pure white and black', () => {
    let white: [number, number, number] = [1, 0, 0]
    let black: [number, number, number] = [0, 0, 0]

    expect(isAchromatic(white, mockConfig)).toBeTruthy()
    expect(isAchromatic(black, mockConfig)).toBeTruthy()
  })

  it('should correctly identify gray shades', () => {
    let darkGray: [number, number, number] = [0.25, 0.01, 0]
    let midGray: [number, number, number] = [0.5, 0.02, 0]
    let lightGray: [number, number, number] = [0.75, 0.03, 0]

    expect(isAchromatic(darkGray, mockConfig)).toBeTruthy()
    expect(isAchromatic(midGray, mockConfig)).toBeTruthy()
    expect(isAchromatic(lightGray, mockConfig)).toBeTruthy()
  })

  it('should handle extreme cases correctly', () => {
    let impossibleColor: [number, number, number] = [0, 0.2, 180]
    expect(isAchromatic(impossibleColor, mockConfig)).toBeFalsy()

    let veryLowChroma: [number, number, number] = [0.5, 0.001, 180]
    expect(isAchromatic(veryLowChroma, mockConfig)).toBeTruthy()
  })
})
