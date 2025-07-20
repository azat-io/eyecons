import type { ExtensionContext } from 'vscode'

import puppeteer from 'puppeteer'
import fs from 'node:fs/promises'
import dedent from 'dedent'
import cwebp from 'cwebp'

import type { ThemeSource } from '../extension/types/theme'

import { adaptIconColors } from '../extension/core/color/adapt-icon-colors'
import { getConfig } from '../extension/core/build/get-config'
import { fileIcons } from '../data/file-icons'

let themes = ['gruvbox-dark', 'vitesse-dark', 'monokai-pro', 'nord']

async function createScreenshot(theme: string): Promise<void> {
  try {
    let browser = await puppeteer.launch({
      headless: true,
    })

    let page = await browser.newPage()
    let numberOfItemsPerLine = 10
    let itemSize = 48
    let paddingSize = 16
    let gapSize = 20

    let themeFilePath = `${process.cwd()}/themes/${theme}.json`
    let themeFileContent = await fs.readFile(themeFilePath, 'utf8')
    let themeValueData = JSON.parse(themeFileContent) as ThemeSource

    async function getIconsSources(): Promise<Record<string, string>> {
      let iconPromises = fileIcons.map(async ({ id }) => {
        let iconContent = await fs.readFile(
          `${process.cwd()}/icons/files/${id}.svg`,
          'utf8',
        )
        return { iconContent, id }
      })

      let iconsArray = await Promise.all(iconPromises)

      return iconsArray.reduce<Record<string, string>>(
        (accumulator, { iconContent, id }) => {
          accumulator[id] = iconContent
          return accumulator
        },
        {},
      )
    }

    let iconsSources = await getIconsSources()

    await page.setViewport({
      width:
        paddingSize * 2 +
        itemSize * numberOfItemsPerLine +
        gapSize * (numberOfItemsPerLine - 1),
      deviceScaleFactor: 3,
      height: 10,
    })

    async function colorizeIcons(): Promise<string> {
      return await fileIcons.reduce(
        async (accumulatorPromise, { name, id }) => {
          let themeValue = {
            folderColor: 'blue',
            id: theme,
            ...themeValueData,
          }
          let accumulator = await accumulatorPromise
          let coloredIcon = adaptIconColors(
            {
              svgContent: iconsSources[id]!,
              id,
            },
            themeValue,
            getConfig({} as ExtensionContext),
          )
          return dedent`
            ${accumulator}
            <div class="icon">
              ${coloredIcon}
              <p class="name">${name}</p>
            </div>
          `
        },
        Promise.resolve(''),
      )
    }

    let colorizedIcons = await colorizeIcons()

    let html = dedent`
      <style>
        html,
        body {
          margin: 0;
          background: ${themeValueData.backgroundPrimary};
          color: ${themeValueData.contentPrimary};
          font-family: sans-serif;
        }

        .container {
          display: grid;
          grid-template-columns: repeat(auto-fill, ${itemSize}px);
          gap: ${gapSize}px;
          padding: ${paddingSize}px;
        }

        .icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .name {
          font-size: 9px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }
      </style>
      <div class="container">
        ${colorizedIcons}
      </div>
    `

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    })

    let screenshotPath: `${string}.webp` = `${process.cwd()}/assets/${theme}.webp`

    await page.screenshot({
      path: screenshotPath,
      omitBackground: true,
      fullPage: true,
      type: 'webp',
    })

    await browser.close()

    let encoder = cwebp(screenshotPath)

    encoder._args['q'] = [75]
    encoder._args['m'] = [6]
    encoder._args['alpha_q'] = [100]

    let temporaryPath = `${process.cwd()}/assets/${theme}.temp.webp`

    try {
      await encoder.write(temporaryPath)
      await fs.unlink(screenshotPath)
      await fs.rename(temporaryPath, screenshotPath)
    } catch (error) {
      console.error(`Ошибка при оптимизации ${theme}.webp:`, error)
    }
  } catch (error) {
    console.error('error', error)
  }
}

await Promise.all(themes.map(createScreenshot))
