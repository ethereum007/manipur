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
    expect(await r.text(), slug).toContain('id="parliament-2024"');
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

test("executive walkthrough, PDF and fiscal explorer", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/manipur/briefing/");
  await expect(page.locator(".executive-walkthrough")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.locator(".walkthrough-slide.current h1")).toContainText(
    "Sixty",
  );
  await page.getByRole("button", { name: "Presenter notes off" }).click();
  await expect(
    page.locator(".walkthrough-slide.current .presenter-notes"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next →", exact: true }).click();
  await expect(
    page.locator(".walkthrough-slide.current .seat-chart"),
  ).toHaveCount(3);
  await page.screenshot({
    path: info.outputPath("executive-desktop.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Next →", exact: true }).click();
  await expect(page.locator(".walkthrough-slide.current")).toContainText(
    "24,814",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: info.outputPath("executive-mobile.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.pdf({
    path: "out/data/executive-brief.pdf",
    format: "A4",
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
  });
  await page.goto("/manipur/development/");
  await page.getByLabel("Budget measure").selectOption("revenue-receipts");
  await expect(page.locator(".fiscal-chart")).toContainText("23,102.44");
  await page.screenshot({
    path: info.outputPath("fiscal-mobile.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test('custom-domain root routes, brand and assets',async({page},info)=>{const base=process.env.NEXT_PUBLIC_BASE_PATH||'';await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/');await page.evaluate(()=>document.fonts.ready);await expect(page).toHaveTitle(/Mandate Terrain/);await expect(page.locator('.wordmark')).toContainText('MANIPUR ANALYSIS');await expect(page.locator('.hero-subtitle')).toHaveText('Manipur Analysis');await expect(page.locator('.hero-map svg')).toBeVisible();await page.screenshot({path:info.outputPath('mandate-terrain-preview.png'),fullPage:false});for(const path of ['/fonts/sans.woff2','/fonts/serif.woff2','/data/manipur.json','/robots.txt','/sitemap.xml']){const response=await page.request.get(base+path);expect(response.status(),path).toBe(200);}await page.getByRole('link',{name:'Explore the electoral atlas'}).click();await expect(page.locator('h1')).toContainText('Sixty constituencies');});

test('research desk, election lab, source studies and seat notes',async({page},info)=>{
 const base=process.env.NEXT_PUBLIC_BASE_PATH||'';
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(base+'/analysis/');
 await expect(page.locator('.research-index-row')).toHaveCount(10);
 await page.screenshot({path:info.outputPath('research-desktop.png'),fullPage:true});
 const studies=await page.locator('.research-index-row').evaluateAll(links=>links.map(a=>a.getAttribute('href')!));
 for(const href of studies){await page.goto(href);await expect(page.locator('.dossier-body>section')).toHaveCount(6);await expect(page.locator('.dossier-references li')).not.toHaveCount(0);expect(await page.locator('.dossier-body').innerText()).toContain('Read the sources.');}
 await page.goto(base+'/analysis/public-finances/');await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:info.outputPath('fiscal-study-desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:info.outputPath('fiscal-study-mobile.png'),fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.goto(base+'/analysis/elections/');
 await expect(page.locator('.analysis-stat-grid').first()).toContainText('34');
 await page.getByLabel('Party to examine').selectOption('NPP');
 await expect(page.locator('.analysis-verdict')).toContainText('retained 1, gained 6');
 await page.getByLabel('Election before').selectOption('2012');
 await expect(page.locator('.analysis-stat-grid').first()).toContainText('53');
 const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:/CSV/}).click();expect((await downloaded).suggestedFilename()).toContain('2022');
 await page.screenshot({path:info.outputPath('election-lab-mobile.png'),fullPage:true});await page.locator('#paired .analysis-stat-grid').screenshot({path:info.outputPath('matched-statistics-mobile.png')});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.setViewportSize({width:1440,height:1000});
 await page.screenshot({path:info.outputPath('election-lab-desktop.png'),fullPage:true});
 await page.goto(base+'/constituencies/heingang/');
 await expect(page.locator('.deep-constituency')).toContainText('18,271');
 await expect(page.locator('.party-history-track>div')).toHaveCount(3);
 await page.screenshot({path:info.outputPath('constituency-study-desktop.png'),fullPage:true});
 expect(errors).toEqual([]);
});

test('2024 segment map, local margins, identities and 2027 evidence notes',async({page},info)=>{
 const base=process.env.NEXT_PUBLIC_BASE_PATH||'';
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/analysis/segments/');
 await page.evaluate(()=>document.fonts.ready);
 await expect(page.locator('.geo-map path[role=button]')).toHaveCount(60);
 await expect(page.locator('.party-legend')).toContainText('INC · 36 leads');
 await expect(page.locator('.analysis-verdict')).toContainText('2,162');
 await page.getByLabel('Ordinary Assembly segment').selectOption('60');
 await expect(page.locator('.analysis-verdict')).toContainText('18,794');
 await expect(page.locator('.analysis-verdict')).toContainText('Christian');
 await page.screenshot({path:info.outputPath('segments-desktop.png'),fullPage:true});
 await page.getByLabel('Ordinary Assembly segment').selectOption('50');
 await expect(page.locator('.analysis-verdict')).toContainText('Kachui Timothy Zimik');
 await expect(page.locator('.analysis-verdict')).toContainText('Not verified');
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:info.outputPath('segments-mobile.png'),fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.goto(base+'/constituencies/khundrakpam/#parliament-2024');
 await expect(page.locator('#parliament-2024')).toContainText('2,162');
 await expect(page.locator('#parliament-2024')).toContainText('2027');
 await page.locator('#parliament-2024').screenshot({path:info.outputPath('seat-2024-mobile.png')});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 expect(errors).toEqual([]);
});
test('disclosure pagination, filtering, explicit Nil and profile sources',async({page},info)=>{
 const base=process.env.NEXT_PUBLIC_BASE_PATH||'';
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/analysis/disclosures/');
 await expect(page.locator('tbody tr')).toHaveCount(25);
 await page.getByRole('button',{name:'Next records',exact:true}).click();
 await expect(page.locator('.register-pagination')).toContainText('Page 2 of 11');
 await page.getByLabel('Candidate or constituency').fill('Nongthombam Biren');
 await expect(page.locator('tbody tr')).toHaveCount(1);
 await page.screenshot({path:info.outputPath('disclosures-desktop.png'),fullPage:true});
 await page.getByLabel('Candidate or constituency').fill('Popilal');
 await expect(page.locator('tbody')).toContainText('Declared Nil');
 const profile=page.locator('tbody th a');await profile.click();
 await expect(page.locator('.disclosure-metrics')).toContainText('₹0');
 await expect(page.locator('body')).toContainText('Source explicitly states');
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:info.outputPath('disclosure-profile-mobile.png'),fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 const data=await page.request.get(base+'/data/segment-leaders-2024.csv');
 expect(data.status()).toBe(200);expect((await data.text()).trim().split('\n')).toHaveLength(61);
 await page.goto(base+'/analysis/evidence/');await expect(page.locator('body')).toContainText('179/180');
});
