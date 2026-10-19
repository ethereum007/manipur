import { test, expect } from "@playwright/test";
const pages = [
  ["homepage", "/manipur"],
  ["atlas", "/manipur/atlas"],
  ["candidate", "/manipur/candidates/nongthombam-biren-singh"],
];
for (const [name, path] of pages) {
  test(name + " desktop and mobile", async ({ page }, info) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: info.outputPath(name + "-desktop.png"),
      fullPage: true,
    });
    await expect(page.locator("body")).toHaveJSProperty(
      "scrollWidth",
      await page.evaluate(() => innerWidth),
    );
    expect(errors).toEqual([]);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: info.outputPath(name + "-mobile.png"),
      fullPage: true,
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  });
}
test("atlas selection, years, search and comparison", async ({ page }) => {
  await page.goto("/manipur/atlas");
  await page.getByRole("button", { name: "2017", exact: true }).click();
  await expect(page.locator(".detail-subtitle")).toContainText("2017");
  await page.getByLabel("Find a constituency").fill("Thoubal");
  await page
    .locator(".constituency-list button")
    .filter({ hasText: "Thoubal" })
    .click();
  await expect(page.locator(".detail-panel h2")).toHaveText("Thoubal");
  await page.getByRole("button", { name: /Compare elections/ }).click();
  await expect(page.locator(".comparison-section")).toBeVisible();
  await page.getByLabel("Filter winning party").selectOption("BJP");
});

test("all 60 constituency routes resolve", async ({ request }) => {
  const names =
    "khundrakpam|heingang|khurai|kshetrigao|thongju|keirao|andro|lamlai|thangmeiband|uripok|sagolband|keishamthong|singjamei|yaiskul|wangkhei|sekmai|lamsang|konthoujam|patsoi|langthabal|naoriya-pakhanglakpa|wangoi|mayang-imphal|nambol|oinam|bishnupur|moirang|thanga|kumbi|lilong|thoubal|wangkhem|heirok|wangjing-tentha|khangabok|wabgai|kakching|hiyanglam|sugnu|jiribam|chandel|tengnoupal|phungyar|ukhrul|chingai|saikul|karong|mao|tadubi|kangpokpi|saitu|tamei|tamenglong|nungba|tipaimukh|thanlon|henglep|churachandpur|saikot|singhat".split(
      "|",
    );
  for (const slug of names) {
    const r = await request.get("/manipur/constituencies/" + slug + "/");
    expect(r.status(), slug).toBe(200);
  }
});
test("briefing supports keyboard navigation and screenshots", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/manipur/presentation/");
  await expect(page.locator(".briefing")).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".briefing-slide.current h1")).toContainText(
    "Sixty",
  );
  await page.screenshot({
    path: info.outputPath("presentation-desktop.png"),
    fullPage: true,
  });
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".briefing-slide.current h1")).toContainText(
    "Read the land",
  );
  await page.keyboard.press("End");
  await expect(page.locator(".briefing-slide.current h1")).toContainText(
    "Return to the source",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: info.outputPath("presentation-mobile.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test("historical winner maps, margin and 2024 denominator", async ({
  page,
}, info) => {
  await page.goto("/manipur/atlas/");
  await page.getByRole("button", { name: "2012", exact: true }).click();
  await expect(page.locator(".detail-panel")).toContainText(
    "NONGTHONGBAM BIREN",
  );
  await page.getByRole("button", { name: "2017", exact: true }).click();
  await page.getByLabel("Map metric", { exact: true }).selectOption("margin");
  await expect(page.locator(".party-legend")).toContainText(
    "Margin / candidate votes",
  );
  await page.getByRole("button", { name: /Compare elections/ }).click();
  await expect(page.locator(".comparison-section svg[role=img]")).toHaveCount(
    2,
  );
  await page.screenshot({
    path: info.outputPath("comparison-desktop.png"),
    fullPage: true,
  });
  await page.goto("/manipur/elections/");
  await expect(page.locator("body")).toContainText("3,74,017");
  await expect(page.locator("body")).toContainText("excluding NOTA");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: info.outputPath("elections-mobile.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test('executive walkthrough, PDF and fiscal explorer',async({page},info)=>{await page.setViewportSize({width:1440,height:1000});await page.goto('/manipur/briefing/');await expect(page.locator('.executive-walkthrough')).toHaveAttribute('data-ready','true');await expect(page.locator('.walkthrough-slide.current h1')).toContainText('Sixty');await page.getByRole('button',{name:'Presenter notes off'}).click();await expect(page.locator('.walkthrough-slide.current .presenter-notes')).toBeVisible();await page.getByRole('button',{name:'Next →',exact:true}).click();await expect(page.locator('.walkthrough-slide.current .seat-chart')).toHaveCount(3);await page.screenshot({path:info.outputPath('executive-desktop.png'),fullPage:true});await page.getByRole('button',{name:'Next →',exact:true}).click();await expect(page.locator('.walkthrough-slide.current')).toContainText('24,814');await page.setViewportSize({width:390,height:844});await page.screenshot({path:info.outputPath('executive-mobile.png'),fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await page.pdf({path:'out/data/executive-brief.pdf',format:'A4',landscape:true,printBackground:true,preferCSSPageSize:true});await page.goto('/manipur/development/');await page.getByLabel('Budget measure').selectOption('revenue-receipts');await expect(page.locator('.fiscal-chart')).toContainText('23,102.44');await page.screenshot({path:info.outputPath('fiscal-mobile.png'),fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();});
