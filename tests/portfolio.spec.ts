import { test, expect, type Page } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolve, extname } from "node:path";
import { readFile } from "node:fs/promises";

const example = pathToFileURL(
  resolve("skills/portfolio-site-builder/examples/portfolio-study/index.html"),
).href;
const project = example + "#/p/coastal-study";

async function fixture(
  page: Page,
  options: { count?: number; broken?: boolean; grid?: boolean; portrait?: boolean } = {},
) {
  await page.addInitScript((options) => {
    let site: any;
    Object.defineProperty(window, "PORTFOLIO_SITE", {
      configurable: true,
      get: () => site,
      set: (value) => {
        site = value;
        const p = value.projects[0];
        if (options.count !== undefined) {
          const originals = p.images;
          p.images = Array.from({ length: options.count }, (_, index) => ({
            ...originals[index % originals.length],
            alt: "Photograph " + (index + 1),
          }));
        }
        if (options.broken) p.images[0].src = "images/missing.jpg";
        if (options.grid) p.layout = "grid";
        if (options.portrait) p.images[0].src = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="800" height="1000" fill="gray"/></svg>');
      },
    });
  }, options);
  await page.goto(project);
}

test("offline project has a complete contact sheet and keyboard-accessible photographs", async ({
  page,
}) => {
  const remoteRequests: string[] = [];
  page.on("request", (request) => {
    if (/^https?:/.test(request.url())) remoteRequests.push(request.url());
  });
  await fixture(page);
  await page.locator(".pv__index > summary").click();
  await expect(page.locator(".pv__index .photo-thumb")).toHaveCount(3);
  await page.locator(".pv__index .photo-thumb").nth(1).click();
  await expect(page.locator("#project-photo-1 .pv__enlarge")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("#galleryCount")).toHaveText("2 / 3");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#galleryCount")).toHaveText("3 / 3");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#galleryCount")).toHaveText("1 / 3");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#galleryCount")).toHaveText("3 / 3");
  expect(remoteRequests).toEqual([]);
});

test("zoom, pan, Escape, and focus return preserve the selected photograph", async ({
  page,
}) => {
  await fixture(page);
  await page.locator(".pv__next-photo").click();
  const opener = page.locator("#project-photo-1 .pv__enlarge");
  await opener.click();
  await page.locator("#galleryImageButton").click();
  await expect(page.locator("#galleryZoom")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(
    await page
      .locator("#galleryCanvas")
      .evaluate((e) => e.scrollWidth > e.clientWidth),
  ).toBe(true);
  const area = await page.locator("#galleryCanvas").boundingBox();
  if (!area) throw new Error("Gallery canvas is missing");
  await page.mouse.move(area.x + area.width * 0.7, area.y + area.height * 0.7);
  await page.mouse.down();
  await page.mouse.move(area.x + area.width * 0.3, area.y + area.height * 0.3, {
    steps: 8,
  });
  await page.mouse.up();
  expect(
    await page
      .locator("#galleryCanvas")
      .evaluate((e) => e.scrollLeft + e.scrollTop),
  ).toBeGreaterThan(0);
  await expect(page.locator("#galleryZoom")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page
    .locator("#galleryImageButton")
    .click({ position: { x: 20, y: 20 } });
  await expect(page.locator("#galleryZoom")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await page.locator("#galleryZoom").click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#galleryZoom")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page.locator("#projectCount")).toHaveText("2 / 3");
  await expect(page.locator(".pv__single img")).toHaveCount(1);
});

test("gallery index and thumbnails select every photograph; covered controls are inert", async ({
  page,
}) => {
  await fixture(page, { count: 38, grid: true });
  await page.locator(".pv__index > summary").click();
  await expect(page.locator(".pv__index .photo-thumb")).toHaveCount(38);
  await page.getByRole("button", { name: "Gallery mode", exact: true }).click();
  await page.locator("#galleryIndex").click();
  await expect(page.locator("#projectView")).toHaveJSProperty("inert", true);
  await expect(page.locator("#gallerySheetImages .photo-thumb")).toHaveCount(
    38,
  );
  await expect(page.locator(".lightbox__stage")).toHaveJSProperty(
    "inert",
    true,
  );
  await page.locator("#gallerySheetImages .photo-thumb").last().click();
  await expect(page.locator("#gallerySheet")).toBeHidden();
  await expect(page.locator("#galleryCount")).toHaveText("38 / 38");
  await page
    .locator("#lightbox")
    .getByRole("button", { name: "Next photograph", exact: true })
    .click();
  await expect(page.locator("#galleryCount")).toHaveText("1 / 38");
  await page.locator("#galleryThumbs .photo-thumb").nth(12).click();
  await expect(page.locator("#galleryCount")).toHaveText("13 / 38");
});

for (const [locale, gallery, close] of [
  ["en", "Gallery mode", "Close"],
  ["ja", "ギャラリーモード", "閉じる"],
  ["zh-hans", "画廊模式", "关闭"],
] as const) {
  test(`gallery controls use the ${locale} website locale`, async ({
    page,
  }) => {
    await page.goto(example + "?lang=" + locale + "#/p/coastal-study");
    await page.getByRole("button", { name: gallery, exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: close, exact: true }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });
}

test("one photograph hides unnecessary navigation", async ({ page }) => {
  await fixture(page, { count: 1 });
  await page.getByRole("button", { name: "Gallery mode", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Previous photograph", exact: true }),
  ).toBeHidden();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#galleryCount")).toHaveText("1 / 1");
  await page.keyboard.press("Escape");
  await page.close();
});

test("empty projects and malformed hash routes recover without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await fixture(page, { count: 0 });
  await expect(page.locator(".pv__gallery")).toBeHidden();
  await page.evaluate(() => {
    location.hash = "#/p/%E0%A4%A";
  });
  await expect(page.locator("#projectView")).toBeHidden();
  expect(errors).toEqual([]);
});

test("a failed image has a useful message and does not prevent advancing", async ({
  page,
}) => {
  await fixture(page, { broken: true });
  await page.getByRole("button", { name: "Gallery mode", exact: true }).click();
  await expect(page.locator("#galleryError")).toBeVisible();
  await expect(page.locator("#galleryZoom")).toBeDisabled();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#galleryError")).toBeHidden();
  await expect(page.locator("#galleryZoom")).toBeEnabled();
  expect(
    await page
      .locator(".lightbox__img")
      .evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0),
  ).toBe(true);
});

test("mobile gallery fits the viewport, traps focus, and respects reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await fixture(page);
  await page.getByRole("button", { name: "Gallery mode", exact: true }).click();
  await expect(page.locator(".lightbox__close")).toBeFocused();
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => !!document.activeElement?.closest("#lightbox")),
    ).toBe(true);
  }
  expect(
    await page
      .locator("#lightbox")
      .evaluate((e) => e.scrollWidth <= e.clientWidth),
  ).toBe(true);
  expect(
    await page
      .locator("#galleryCanvas")
      .evaluate((e) => e.scrollHeight <= e.clientHeight + 1),
  ).toBe(true);
  expect(
    await page
      .locator(".lightbox__img")
      .evaluate((e) => getComputedStyle(e).objectFit),
  ).toBe("contain");
});

test("a short CJK photographer name stays on one line at desktop size", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(example + "?lang=en");
  await page.evaluate(() => {
    const translations = (window as any).PORTFOLIO_I18N;
    translations["zh-hans"].hero.name = "潘超群";
  });
  await page.getByRole("button", { name: "简体", exact: true }).click();
  await expect(page.locator("#heroName")).toHaveText("潘超群");
  const lines = await page.locator("#heroName").evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return range.getClientRects().length;
  });
  expect(lines).toBe(1);
});

const about = pathToFileURL(
  resolve(
    "skills/portfolio-site-builder/examples/portfolio-study/about/index.html",
  ),
).href;

test("project previews are click-controlled and remain open after pointer exit and language changes", async ({
  page,
}) => {
  await page.goto(example + "?lang=en#work");
  const disclosure = page.locator(".project-disclosure").first();
  const summary = disclosure.locator("summary");
  await expect(disclosure.locator(".project-excerpt")).toBeVisible();
  await summary.hover();
  await expect(disclosure).not.toHaveAttribute("open", "");
  await summary.focus();
  await expect(disclosure).not.toHaveAttribute("open", "");
  await expect(disclosure.locator(".project-preview-strip img")).toHaveCount(0);
  await page.keyboard.press("Enter");
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(disclosure.locator(".project-preview-strip img")).toHaveCount(3);
  await page.mouse.move(0, 0);
  await expect(disclosure).toHaveAttribute("open", "");
  await page.getByRole("button", { name: "日本語", exact: true }).click();
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(disclosure.locator(".project-open")).toHaveText("作品を見る ↗");
  await summary.focus();
  await page.keyboard.press("Space");
  await expect(disclosure).not.toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await disclosure.locator(".project-open").click();
  await expect(page.locator("#projectView")).toBeVisible();
});

test("About is a separate offline page and carries the locale both ways without storage", async ({
  page,
}) => {
  const errors: string[] = [];
  const requests: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (/^https?:/.test(r.url())) requests.push(r.url());
  });
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Blocked storage");
      },
    });
  });
  await page.goto(example + "?lang=ja");
  await expect(page.locator("#about")).toHaveCount(0);
  await page.locator("#nav a").nth(1).click();
  await expect(page).toHaveURL(/about\/index\.html\?lang=ja/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator('#nav [aria-current="page"]')).toHaveCount(1);
  await expect(page.locator("#aboutHeading")).toBeVisible();
  await expect(page.locator(".cv-section")).toHaveCount(0);
  await expect(page.locator("#projectView")).toHaveCount(0);
  await page.getByRole("button", { name: "简体", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");
  await expect(page).toHaveTitle("关于习作 — 作品集习作");
  await page.locator("#nav a").first().click();
  await expect(page).toHaveURL(/index\.html\?lang=zh-hans#work/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");
  expect(errors).toEqual([]);
  expect(requests).toEqual([]);
});

test("About renders supplied CV and biography as text, omits empty sections and an absent portrait", async ({
  page,
}) => {
  await page.goto(about + "?lang=en");
  await page.evaluate(() => {
    const w = window as any;
    w.PORTFOLIO_SITE.portraitImage = "";
    w.PORTFOLIO_I18N.en.about.bio = ["First paragraph.", "Second paragraph."];
    w.PORTFOLIO_I18N.en.about.sections = [
      { title: "Publications", entries: [] },
      {
        title: "Exhibitions",
        entries: [
          {
            year: "2025",
            title: "<img src=x onerror=alert(1)>",
            detail: "A gallery",
          },
          { title: "Undated work" },
          { detail: "No title — omit this incomplete entry" },
        ],
      },
    ];
  });
  await page.getByRole("button", { name: "日本語", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator("#aboutBio p")).toHaveCount(2);
  await expect(page.locator("#aboutPortrait")).toBeHidden();
  await expect(page.locator(".cv-section")).toHaveCount(1);
  await expect(page.locator(".cv-list li")).toHaveCount(2);
  await expect(page.locator(".cv-title").first()).toHaveText(
    "<img src=x onerror=alert(1)>",
  );
  await expect(page.locator(".cv-list img")).toHaveCount(0);
  await expect(page.locator(".cv-list li.-undated")).toHaveCount(1);
});

for (const locale of ["en", "ja", "zh-hans"]) {
  test(`mobile ${locale} project list and About fit without hover controls`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(example + "?lang=" + locale + "#work");
    const disclosure = page.locator(".project-disclosure").first();
    await expect(disclosure).not.toHaveAttribute("open", "");
    await disclosure.locator("summary").click();
    await expect(disclosure).toHaveAttribute("open", "");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.goto(about + "?lang=" + locale);
    await expect(page.locator("#aboutHeading")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test("a long project renders one uncropped photograph with its description and retains gallery selection", async ({
  page,
}) => {
  await fixture(page, { count: 140 });
  await expect(page.locator(".pv__single img")).toHaveCount(1);
  await expect(page.locator(".pv__desc")).toBeVisible();
  await expect(page.locator(".pv__index")).not.toHaveAttribute("open", "");
  await expect(page.locator(".pv__index .photo-thumb")).toHaveCount(0);
  expect(
    await page
      .locator(".pv__single img")
      .evaluate((e) => getComputedStyle(e).objectFit),
  ).toBe("contain");
  const initialHeight = await page
    .locator("#projectView")
    .evaluate((e) => e.scrollHeight);
  await page.locator(".pv__next-photo").click();
  await expect(page.locator("#projectCount")).toHaveText("2 / 140");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#projectCount")).toHaveText("3 / 140");
  await page.locator(".pv__index > summary").click();
  await expect(page.locator(".pv__index .photo-thumb")).toHaveCount(140);
  await page.locator(".pv__index .photo-thumb").nth(73).click();
  await expect(page.locator("#projectCount")).toHaveText("74 / 140");
  await expect(page.locator(".pv__index")).not.toHaveAttribute("open", "");
  await expect(page.locator("#projectEnlarge")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#galleryCount")).toHaveText("74 / 140");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  await expect(page.locator("#projectCount")).toHaveText("75 / 140");
  await expect(page.locator("#projectEnlarge")).toBeFocused();
  await expect(page.locator(".pv__single img")).toHaveCount(1);
  expect(
    await page.locator("#projectView").evaluate((e) => e.scrollHeight),
  ).toBe(initialHeight);
});

test("cross-page navigation works on static hosts without directory index routing", async ({
  page,
}) => {
  const root = resolve("skills/portfolio-site-builder/examples");
  await page.route("https://portfolio.test/**", async (route) => {
    const url = new URL(route.request().url());
    const path = resolve(root, "." + url.pathname.replace(/^\/examples/, ""));
    if (!path.startsWith(root + "/"))
      return route.fulfill({ status: 404, body: "Not found" });
    try {
      const contentType = (
        {
          ".html": "text/html",
          ".js": "text/javascript",
          ".css": "text/css",
          ".svg": "image/svg+xml",
        } as Record<string, string>
      )[extname(path)];
      await route.fulfill({ body: await readFile(path), contentType });
    } catch {
      await route.fulfill({ status: 404, body: "No directory indexes" });
    }
  });
  await page.goto(
    "https://portfolio.test/examples/portfolio-study/index.html?lang=en",
  );
  await page.locator("#nav a").nth(1).click();
  await expect(page).toHaveURL(/about\/index\.html\?lang=en/);
  await expect(page.locator("#aboutHeading")).toHaveText("About this study");
  await page.locator("#nav a").first().click();
  await expect(page).toHaveURL(/portfolio-study\/index\.html\?lang=en#work/);
  await expect(page.locator(".project-disclosure")).toHaveCount(1);
});

for (const locale of ["en", "ja", "zh-hans"]) {
  test(`legacy #about bookmarks open the separate About page in ${locale}`, async ({
    page,
  }) => {
    await page.goto(example + "?lang=" + locale + "#about");
    await expect(page).toHaveURL(
      new RegExp("about/index\\.html\\?lang=" + locale + "$"),
    );
    await expect(page.locator("#aboutHeading")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      locale === "zh-hans" ? "zh-Hans" : locale,
    );
    await page.locator("#nav a").first().click();
    await expect(page.locator(".project-disclosure")).toHaveCount(1);
    await page.evaluate(() => {
      location.hash = "#about";
    });
    await expect(page.locator("#aboutHeading")).toBeVisible();
    await expect(page).toHaveURL(
      new RegExp("about/index\\.html\\?lang=" + locale + "$"),
    );
  });
}

test("click zoom keeps the chosen photograph point under the pointer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await fixture(page);
  await page.locator(".pv__gallery").click();
  await expect(page.locator("#galleryZoomRange")).toBeEnabled();
  for (const [u, v] of [
    [0.65, 0.6],
    [0.35, 0.4],
  ] as const) {
    const before = await page.locator(".lightbox__img").boundingBox();
    if (!before) throw new Error("Missing gallery photograph");
    const x = before.x + before.width * u,
      y = before.y + before.height * v;
    await page.mouse.click(x, y);
    await expect(page.locator("#galleryZoomRange")).toHaveValue("200");
    const after = await page.locator(".lightbox__img").boundingBox();
    if (!after) throw new Error("Missing zoomed photograph");
    expect(Math.abs(after.x + after.width * u - x)).toBeLessThan(2);
    expect(Math.abs(after.y + after.height * v - y)).toBeLessThan(2);
    expect(after.width / before.width).toBeCloseTo(2, 1);
    await page.locator("#galleryZoom").click();
    await expect(page.locator("#galleryZoomRange")).toHaveValue("100");
  }
});

test("zoom slider preserves the visible centre, supports keyboard adjustment and does not navigate photos", async ({
  page,
}) => {
  await fixture(page);
  await page.locator(".pv__gallery").click();
  const range = page.getByRole("slider", { name: "Zoom level", exact: true });
  await expect(range).toBeEnabled();
  await range.fill("250");
  await expect(page.locator("#galleryZoomValue")).toHaveText("250%");
  const centre = await page.locator(".lightbox__img").evaluate((img) => {
    const image = img.getBoundingClientRect(),
      canvas = document.getElementById("galleryCanvas")!,
      frame = canvas.getBoundingClientRect();
    return {
      u: (frame.left + canvas.clientWidth / 2 - image.left) / image.width,
      v: (frame.top + canvas.clientHeight / 2 - image.top) / image.height,
    };
  });
  await range.focus();
  await page.keyboard.press("ArrowRight");
  await expect(range).toHaveValue("260");
  await expect(page.locator("#galleryCount")).toHaveText("1 / 3");
  const next = await page.locator(".lightbox__img").evaluate((img) => {
    const image = img.getBoundingClientRect(),
      canvas = document.getElementById("galleryCanvas")!,
      frame = canvas.getBoundingClientRect();
    return {
      u: (frame.left + canvas.clientWidth / 2 - image.left) / image.width,
      v: (frame.top + canvas.clientHeight / 2 - image.top) / image.height,
    };
  });
  expect(Math.abs(next.u - centre.u)).toBeLessThan(0.005);
  expect(Math.abs(next.v - centre.v)).toBeLessThan(0.005);
  await page.keyboard.press("End");
  await expect(range).toHaveValue("400");
  await page.keyboard.press("Home");
  await expect(range).toHaveValue("100");
  await expect(page.locator("#galleryZoom")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await page.locator("#galleryIndex").click();
  await expect(range).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(range).toBeEnabled();
});

for (const [locale, label] of [
  ["ja", "表示倍率"],
  ["zh-hans", "缩放比例"],
]) {
  test(`mobile ${locale} zoom slider fits and resets between photographs`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(example + "?lang=" + locale + "#/p/coastal-study");
    await page.locator(".pv__gallery").click();
    const range = page.getByRole("slider", { name: label, exact: true });
    await expect(range).toBeEnabled();
    await range.fill("300");
    await expect(page.locator("#galleryZoomValue")).toHaveText("300%");
    expect(
      await page
        .locator("#lightbox")
        .evaluate((e) => e.scrollWidth <= e.clientWidth),
    ).toBe(true);
    await page.locator(".lightbox__nav.-next").click();
    await expect(range).toBeEnabled();
    await expect(range).toHaveValue("100");
    await expect(page.locator("#galleryZoomValue")).toHaveText("100%");
  });
}

test('portrait zoom clamps at the image edge instead of jumping to the top left', async ({page})=>{
  await page.setViewportSize({width:1440,height:1000})
  await fixture(page,{portrait:true})
  await page.locator('.pv__gallery').click()
  await expect(page.locator('#galleryZoomRange')).toBeEnabled()
  const before=await page.locator('.lightbox__img').boundingBox()
  if(!before)throw new Error('Missing portrait')
  await page.mouse.click(before.x+before.width*.65,before.y+before.height*.6)
  await expect(page.locator('#galleryZoomRange')).toHaveValue('200')
  const scroll=await page.locator('#galleryCanvas').evaluate(e=>({x:e.scrollLeft,max:e.scrollWidth-e.clientWidth,y:e.scrollTop}))
  expect(scroll.max).toBeGreaterThan(0)
  expect(Math.abs(scroll.x-scroll.max)).toBeLessThan(1)
  expect(scroll.y).toBeGreaterThan(0)
})
