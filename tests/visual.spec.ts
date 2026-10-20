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
    const html=await r.text();expect(html,slug).toContain('id="parliament-2024"');expect(html,slug).toContain('id="representation"');
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

test('representation snapshot filters vacancies and links to sourced local notes',async({page},info)=>{
 const base=process.env.NEXT_PUBLIC_BASE_PATH||'';const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/representation/');
 await expect(page.locator('tbody tr')).toHaveCount(20);
 await page.getByRole('button',{name:'Next records',exact:true}).click();await expect(page.locator('.register-pagination')).toContainText('Page 2 of 3');
 await page.getByLabel('Directory status').selectOption('listed-vacant');await expect(page.locator('tbody tr')).toHaveCount(2);
 await expect(page.locator('tbody')).toContainText('Tadubi');await expect(page.locator('tbody')).toContainText('Thanlon');
 await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:info.outputPath('representation-desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:info.outputPath('representation-mobile.png'),fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.getByLabel('Directory status').selectOption('all');await page.getByLabel('Member or constituency').fill('Khemchand');await expect(page.locator('tbody tr')).toHaveCount(1);
 await page.locator('tbody th a').click();await expect(page.locator('#representation')).toContainText('Matric Passed');await expect(page.locator('#representation')).toContainText('4 February 2026');
 await page.locator('#representation').screenshot({path:info.outputPath('representation-seat-mobile.png')});expect(errors).toEqual([]);
});
test('policy notes preserve scope and show primary source locators on mobile',async({page,request},info)=>{
 const base=process.env.NEXT_PUBLIC_BASE_PATH||'';const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/policy/');await expect(page.locator('.research-index-row')).toHaveCount(7);
 for(const slug of ['housing','food-security','rehabilitation-budget','roads','urban-water','rural-water','livelihoods']){const r=await request.get(base+'/policy/'+slug+'/');expect(r.status(),slug).toBe(200);expect(await r.text(),slug).toContain('Close the record.');}
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/policy/housing/');await page.evaluate(()=>document.fonts.ready);
 await expect(page.locator('.policy-metrics')).toContainText('56,045');await expect(page.locator('.policy-metrics')).toContainText('20,591');await expect(page.locator('.evidence-stamp')).toContainText('not an IDP-only series');
 await page.screenshot({path:info.outputPath('policy-housing-desktop.png'),fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:info.outputPath('policy-housing-mobile.png'),fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.goto(base+'/policy/livelihoods/');await expect(page.locator('.policy-findings')).toContainText('opening SNA balances');await page.screenshot({path:info.outputPath('policy-livelihoods-mobile.png'),fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();expect(errors).toEqual([]);
 const exportData=await request.get(base+'/data/representation-snapshot.json');expect(exportData.status()).toBe(200);expect((await exportData.json()).records).toHaveLength(60);
});

test('primary affidavit audit distinguishes access from manual field review',async({page,request},info)=>{
 const base=process.env.NEXT_PUBLIC_BASE_PATH||'';
 const response=await request.get(base+'/data/affidavit-availability-2022.json');expect(response.status()).toBe(200);const audit=await response.json();expect(audit.records).toHaveLength(265);expect(audit.manualAuditComplete).toBe(false);
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/analysis/disclosures/#primary-affidavits');
 await expect(page.locator('#primary-affidavits')).toContainText('It did not run OCR');
 await expect(page.locator('#primary-affidavits')).toContainText(audit.records.filter((r:{status:string})=>r.status==='pdf-opened').length+'/265');
 await page.evaluate(()=>document.fonts.ready);await page.locator('#primary-affidavits').screenshot({path:info.outputPath('primary-affidavit-coverage-desktop.png')});
 await page.setViewportSize({width:390,height:844});await page.locator('#primary-affidavits').screenshot({path:info.outputPath('primary-affidavit-coverage-mobile.png')});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 const available=audit.records.find((r:{status:string,candidate:string})=>r.status==='pdf-opened'&&!r.candidate.toLowerCase().includes('biren'));expect(available).toBeTruthy();await page.getByLabel('Candidate or constituency').fill(available.candidate);await page.locator('tbody th a').first().click();await expect(page.locator('.primary-affidavit-note')).toContainText('performs no manual field review or OCR');
 await page.locator('.primary-affidavit-note summary').click();await expect(page.locator('.primary-affidavit-note')).toContainText('SHA-256');await page.locator('.primary-affidavit-note').screenshot({path:info.outputPath('primary-affidavit-profile-mobile.png')});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.goto(base+'/candidates/nongthombam-biren-singh/');await expect(page.locator('.primary-affidavit-note')).toContainText('DOCUMENT AVAILABILITY');
});

test('selected primary fields keep N/A and financial-summary differences explicit',async({page,request},info)=>{
 const base=process.env.NEXT_PUBLIC_BASE_PATH||'';await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/analysis/disclosures/#field-reviews');await expect(page.locator('#field-reviews')).toContainText('other 262');await expect(page.locator('#field-reviews')).toContainText('₹1.23');await page.evaluate(()=>document.fonts.ready);await page.locator('#field-reviews').screenshot({path:info.outputPath('field-review-desktop.png')});
 await page.getByLabel('Candidate or constituency').fill('Popilal');await page.locator('tbody th a').click();await expect(page.locator('.disclosure-field-review')).toContainText('N/A');await expect(page.locator('.disclosure-field-review')).toContainText('no primary monetary total assigned');await page.setViewportSize({width:390,height:844});await page.locator('.disclosure-field-review').screenshot({path:info.outputPath('field-review-na-mobile.png')});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.goto(base+'/candidates/nongthombam-biren-singh/');await expect(page.locator('.disclosure-field-review')).toContainText('₹1,47,48,362.23');await expect(page.locator('.disclosure-field-review')).toContainText('₹1.23');await expect(page.locator('.disclosure-field-review')).toContainText('independent human audit');await page.locator('.disclosure-field-review').screenshot({path:info.outputPath('field-review-biren-mobile.png')});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();const d=await request.get(base+'/data/disclosure-field-reviews-2022.json');expect(d.status()).toBe(200);expect((await d.json()).records).toHaveLength(3);
});

test('historical forecast lab preserves cohorts, filters errors and keeps 2027 separate',async({page,request},info)=>{
 const base=process.env.NEXT_PUBLIC_BASE_PATH||'';const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/outlook/validation/');const rows=page.getByRole('region',{name:'Historical benchmark errors',exact:true}).locator('tbody tr');await expect(rows).toHaveCount(60);await expect(page.locator('.validation-active-score')).toContainText('26/59');await page.getByLabel('Historical outcome',{exact:true}).selectOption('excluded');await expect(rows).toHaveCount(1);await expect(rows).toContainText('Jiribam');await expect(page.locator('.validation-active-score')).toContainText('26/59');
 await page.getByLabel('Held-out Assembly election').selectOption('2017');await page.getByLabel('Historical outcome',{exact:true}).selectOption('all');await expect(rows).toHaveCount(60);await expect(page.locator('.validation-active-score')).toContainText('23/60');await page.getByLabel('Benchmark rule').selectOption('statewideParty');await expect(page.locator('.validation-active-score')).toContainText('28/60');await page.getByLabel('Historical outcome',{exact:true}).selectOption('missed');await expect(rows).toHaveCount(32);await page.evaluate(()=>document.fonts.ready);await page.locator('#replay').screenshot({path:info.outputPath('forecast-validation-desktop.png')});
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/outlook/validation/?ac=40');await expect(page.getByLabel('Constituency',{exact:true})).toHaveValue('40');await expect(rows).toHaveCount(1);await expect(rows).toContainText('Excluded from common cohort');await page.locator('.validation-confusion summary').click();await page.locator('#replay').screenshot({path:info.outputPath('forecast-validation-mobile.png')});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await expect(page.locator('#readiness')).toContainText('calibrated 2027 probability model unavailable');
 await page.goto(base+'/constituencies/jiribam/#parliament-2024');await page.getByRole('link',{name:'Test historical prediction errors for this constituency ↗',exact:true}).click();await expect(page.getByLabel('Constituency',{exact:true})).toHaveValue('40');const download=await request.get(base+'/data/forecast-validation.json');expect(download.status()).toBe(200);const data=await download.json();expect(data.windows).toHaveLength(2);expect(data.windows[1].repeat.total).toBe(59);expect(data.kind).toContain('Retrospective');const readiness=await request.get(base+'/data/forecast-readiness.json');expect(readiness.status()).toBe(200);expect(errors).toEqual([]);
});
