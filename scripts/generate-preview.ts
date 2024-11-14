import { dedent } from 'ts-dedent'
import puppeteer from 'puppeteer'
import fs from 'node:fs/promises'
import path from 'node:path'

import type { ThemeData, Theme } from '../docs/typings'

import { colorize } from '../extension/colorize'
import { fileIcons } from '../data/file-icons'

let themes = ['atom-one-dark', 'nord', 'monokai-pro', 'gruvbox-dark']

let createScreenshot = async (theme: string): Promise<void> => {
  try {
    let browser = await puppeteer.launch({
      headless: true,
    })

    let page = await browser.newPage()
    let numberOfItemsPerLine = 10
    let itemSize = 48
    let paddingSize = 16
    let gapSize = 20

    let themeData = (await import(
      path.join(__dirname, '../docs/themes', `${theme}.json`)
    )) as Theme
    let themeValueData = (await import(
      path.join(__dirname, '../themes', `${theme}.json`)
    )) as ThemeData

    let getIconsSources = async (): Promise<Record<string, string>> => {
      let iconPromises = fileIcons.map(async ({ id }) => {
        let iconContent = await fs.readFile(
          path.join(__dirname, `../icons/files/${id}.svg`),
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

    let colorizeIcons = async (): Promise<string> =>
      await fileIcons.reduce(async (accumulatorPromise, { name, id }) => {
        let accumulator = await accumulatorPromise
        let coloredIcon = await colorize(id, themeValueData, iconsSources[id])
        return dedent`
          ${accumulator}
          <div class="icon">
            ${coloredIcon}
            <p class="name">${name}</p>
          </div>
        `
      }, Promise.resolve(''))

    let colorizedIcons = await colorizeIcons()

    let html = dedent`
      <style>
        html,
        body {
          margin: 0;
          background: ${themeData.colors['editor.background']};
          color: ${themeData.colors['editor.foreground']};
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

    await page.screenshot({
      path: path.join(__dirname, '../assets', `${theme}.webp`),
      omitBackground: true,
      fullPage: true,
      type: 'webp',
    })

    await browser.close()
  } catch (error) {
    console.error('error', error)
  }
}

;(async () => {
  await Promise.all(themes.map(createScreenshot))
})()
