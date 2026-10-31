import { test, expect, type Page } from '@playwright/test'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const example = pathToFileURL(
  resolve('skills/portfolio-site-builder/examples/portfolio-study/index.html'),
).href
const project = example + '#/p/coastal-study'

async function fixture(
  page: Page,
  options: { count?: number; broken?: boolean; grid?: boolean } = {},
) {
  await page.addInitScript((options) => {
    let site: any
    Object.defineProperty(window, 'PORTFOLIO_SITE', {
      configurable: true,
      get: () => site,
      set: (value) => {
        site = value
        const p = value.projects[0]
        if (options.count !== undefined) {
          const originals = p.images
          p.images = Array.from({ length: options.count }, (_, index) => ({
            ...originals[index % originals.length],
            alt: 'Photograph ' + (index + 1),
          }))
        }
        if (options.broken) p.images[0].src = 'images/missing.jpg'
        if (options.grid) p.layout = 'grid'
      },
    })
  }, options)
  await page.goto(project)
}

test('offline project has a complete contact sheet and keyboard-accessible photographs', async ({
  page,
}) => {
  const remoteRequests: string[] = []
  page.on('request', (request) => {
    if (/^https?:/.test(request.url())) remoteRequests.push(request.url())
  })
  await fixture(page)
  await expect(page.locator('.pv__index .photo-thumb')).toHaveCount(3)
  await page.locator('.pv__index .photo-thumb').nth(1).click()
  await expect(page.locator('#project-photo-1 .pv__enlarge')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.locator('#galleryCount')).toHaveText('2 / 3')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#galleryCount')).toHaveText('3 / 3')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#galleryCount')).toHaveText('1 / 3')
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('#galleryCount')).toHaveText('3 / 3')
  expect(remoteRequests).toEqual([])
})

test('zoom, pan, Escape, and focus return preserve the reading position', async ({
  page,
}) => {
  await fixture(page)
  const opener = page.locator('#project-photo-1 .pv__enlarge')
  await opener.click()
  await page.locator('#galleryImageButton').click()
  await expect(page.locator('#galleryZoom')).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  expect(
    await page
      .locator('#galleryCanvas')
      .evaluate((e) => e.scrollWidth > e.clientWidth),
  ).toBe(true)
  const area = await page.locator('#galleryCanvas').boundingBox()
  if (!area) throw new Error('Gallery canvas is missing')
  await page.mouse.move(area.x + area.width * 0.7, area.y + area.height * 0.7)
  await page.mouse.down()
  await page.mouse.move(area.x + area.width * 0.3, area.y + area.height * 0.3, {
    steps: 8,
  })
  await page.mouse.up()
  expect(
    await page
      .locator('#galleryCanvas')
      .evaluate((e) => e.scrollLeft + e.scrollTop),
  ).toBeGreaterThan(0)
  await expect(page.locator('#galleryZoom')).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page
    .locator('#galleryImageButton')
    .click({ position: { x: 20, y: 20 } })
  await expect(page.locator('#galleryZoom')).toHaveAttribute(
    'aria-pressed',
    'false',
  )
  await page.locator('#galleryZoom').click()
  await page.keyboard.press('Escape')
  await expect(page.locator('#galleryZoom')).toHaveAttribute(
    'aria-pressed',
    'false',
  )
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(opener).toBeFocused()
  expect(
    await page.locator('#projectView').evaluate((e) => e.scrollTop),
  ).toBeGreaterThan(0)
})

test('gallery index and thumbnails select every photograph; covered controls are inert', async ({
  page,
}) => {
  await fixture(page, { count: 38, grid: true })
  await expect(page.locator('.pv__index .photo-thumb')).toHaveCount(38)
  await page.getByRole('button', { name: 'Gallery mode', exact: true }).click()
  await page.locator('#galleryIndex').click()
  await expect(page.locator('#gallerySheetImages .photo-thumb')).toHaveCount(38)
  await expect(page.locator('.lightbox__stage')).toHaveJSProperty('inert', true)
  await page.locator('#gallerySheetImages .photo-thumb').last().click()
  await expect(page.locator('#gallerySheet')).toBeHidden()
  await expect(page.locator('#galleryCount')).toHaveText('38 / 38')
  await page
    .getByRole('button', { name: 'Next photograph', exact: true })
    .click()
  await expect(page.locator('#galleryCount')).toHaveText('1 / 38')
  await page.locator('#galleryThumbs .photo-thumb').nth(12).click()
  await expect(page.locator('#galleryCount')).toHaveText('13 / 38')
})

for (const [locale, gallery, close] of [
  ['en', 'Gallery mode', 'Close'],
  ['ja', 'ギャラリーモード', '閉じる'],
  ['zh-hans', '画廊模式', '关闭'],
] as const) {
  test(`gallery controls use the ${locale} website locale`, async ({
    page,
  }) => {
    await page.goto(example + '?lang=' + locale + '#/p/coastal-study')
    await page.getByRole('button', { name: gallery, exact: true }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: close, exact: true }).click()
    await expect(page.getByRole('dialog')).toBeHidden()
  })
}

test('one photograph hides unnecessary navigation', async ({ page }) => {
  await fixture(page, { count: 1 })
  await page.getByRole('button', { name: 'Gallery mode', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Previous photograph', exact: true }),
  ).toBeHidden()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#galleryCount')).toHaveText('1 / 1')
  await page.keyboard.press('Escape')
  await page.close()
})

test('empty projects and malformed hash routes recover without runtime errors', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await fixture(page, { count: 0 })
  await expect(page.locator('.pv__gallery')).toBeHidden()
  await page.evaluate(() => {
    location.hash = '#/p/%E0%A4%A'
  })
  await expect(page.locator('#projectView')).toBeHidden()
  expect(errors).toEqual([])
})

test('a failed image has a useful message and does not prevent advancing', async ({
  page,
}) => {
  await fixture(page, { broken: true })
  await page.getByRole('button', { name: 'Gallery mode', exact: true }).click()
  await expect(page.locator('#galleryError')).toBeVisible()
  await expect(page.locator('#galleryZoom')).toBeDisabled()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#galleryError')).toBeHidden()
  await expect(page.locator('#galleryZoom')).toBeEnabled()
  expect(
    await page
      .locator('.lightbox__img')
      .evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0),
  ).toBe(true)
})

test('mobile gallery fits the viewport, traps focus, and respects reduced motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await fixture(page)
  await page.getByRole('button', { name: 'Gallery mode', exact: true }).click()
  await expect(page.locator('.lightbox__close')).toBeFocused()
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab')
    expect(
      await page.evaluate(() => !!document.activeElement?.closest('#lightbox')),
    ).toBe(true)
  }
  expect(
    await page
      .locator('#lightbox')
      .evaluate((e) => e.scrollWidth <= e.clientWidth),
  ).toBe(true)
  expect(
    await page
      .locator('#galleryCanvas')
      .evaluate((e) => e.scrollHeight <= e.clientHeight + 1),
  ).toBe(true)
  expect(
    await page
      .locator('.lightbox__img')
      .evaluate((e) => getComputedStyle(e).objectFit),
  ).toBe('contain')
})


test('a short CJK photographer name stays on one line at desktop size', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(example + '?lang=en')
  await page.evaluate(() => {
    const translations = (window as any).PORTFOLIO_I18N
    translations['zh-hans'].hero.name = '潘超群'
  })
  await page.getByRole('button', { name: '简体', exact: true }).click()
  await expect(page.locator('#heroName')).toHaveText('潘超群')
  const lines = await page.locator('#heroName').evaluate(element => {
    const range = document.createRange()
    range.selectNodeContents(element)
    return range.getClientRects().length
  })
  expect(lines).toBe(1)
})
