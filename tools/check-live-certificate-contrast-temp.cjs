'use strict';
// Read-only first-party deployment check. Not whole-site WCAG or PDF/UA certification.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PW_MODULE);
const origin = 'https://veritaschain.org';
const prefix = '/explorer/app/';
const sourceCommit = '66f763083122218a7af17faa210e5a6352b24074';
const out = path.resolve('live-contrast-evidence');
fs.mkdirSync(out, {recursive:true});
const report = {
  status:'INCOMPLETE', sourceCommit, target:origin+prefix,
  observedUtc:new Date().toISOString(), http:[], checks:[], contrast:[], pageErrors:[],
  limits:'First-party public synthetic demo, one headless Chromium session, external fonts blocked. Scoped certificate contrast only. Not native PDF, assistive-technology, full WCAG, cryptographic conformance or independent reproduction.'
};
let browser, context;
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
async function check(name, fn) {
  try { const details = await fn(); report.checks.push({name,status:'passed',details:details ?? null}); }
  catch (e) { report.checks.push({name,status:'failed',error:String(e)}); throw e; }
}
(async () => {
  const localIndex = fs.readFileSync('subject/explorer/app/index.html');
  const html = localIndex.toString('utf8');
  const js = html.match(/src="(\/explorer\/app\/assets\/index-[\w-]+\.js)"/g) || [];
  const css = html.match(/href="(\/explorer\/app\/assets\/index-[\w-]+\.css)"/g) || [];
  assert.equal(js.length,1); assert.equal(css.length,1);
  const jsPath = js[0].split('"')[1], cssPath = css[0].split('"')[1];
  assert.equal(jsPath,prefix+'assets/index-BBO5MNv0.js');
  assert.equal(cssPath,prefix+'assets/index-DWGHzG2n.css');
  const files = [prefix,jsPath,cssPath];
  await check('public HTML and linked JS/CSS match the pinned site release', async () => {
    for (const p of files) {
      const localPath = 'subject' + p + (p===prefix?'index.html':'');
      const expected = fs.readFileSync(localPath);
      const response = await fetch(origin+p,{
        method:'GET',redirect:'error',signal:AbortSignal.timeout(20000),
        headers:{'Accept-Encoding':'identity','Cache-Control':'no-cache','User-Agent':'VSO-ReadOnly-Contrast-Check/1.0'}
      });
      const raw = Buffer.from(await response.arrayBuffer());
      assert.ok(raw.length<=12000000);
      const item={url:origin+p,status:response.status,bytes:raw.length,sha256:sha(raw),expectedSha256:sha(expected),matches:raw.equals(expected)};
      report.http.push(item);
      assert.equal(response.status,200,JSON.stringify(item));
      assert.ok(item.matches,JSON.stringify(item));
    }
  });
  browser = await chromium.launch({headless:true});
  report.browserVersion = browser.version();
  context = await browser.newContext({viewport:{width:1440,height:900}});
  await context.route('**/*', route => {
    const req=route.request(), u=new URL(req.url());
    if(req.method()==='GET' && u.origin===origin && u.pathname.startsWith(prefix))return route.continue();
    return route.abort();
  });
  const page=await context.newPage();
  page.setDefaultTimeout(20000);
  page.on('pageerror',e=>report.pageErrors.push(String(e)));
  await page.goto(origin+prefix,{waitUntil:'domcontentloaded',timeout:30000});
  await check('retained integrity notice exists in the public document',async()=>{
    await page.locator('#integrity-review-2026-10-24').waitFor();
  });
  const event=page.locator('a[href*="#/events/"]').first();
  await event.waitFor();
  const route=await event.getAttribute('href');
  const eventId=route.match(/#\/events\/([0-9a-f-]+)/i)?.[1];
  assert.match(eventId,/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i);
  await event.click();
  await page.getByRole('heading',{name:'Event Details',exact:true}).waitFor();
  await page.getByRole('link',{name:'Certificate',exact:true}).click();
  await page.getByRole('heading',{name:'Event Certificate',exact:true}).waitFor();
  const certUrl=page.url(); report.certificateUrl=certUrl;
  assert.equal(new URL(certUrl).pathname,prefix);
  await check('public certificate preserves route, full ID and demo/print labels',async()=>{
    await page.reload();
    await page.getByText('Demo data — not verified',{exact:true}).waitFor();
    assert.equal((await page.locator('[data-certificate-field="Event ID"] dd p').innerText()).trim(),eventId);
    assert.equal(await page.getByRole('button',{name:'Print / Save as PDF',exact:true}).count(),1);
    assert.equal(await page.getByRole('button',{name:'Download PDF',exact:true}).count(),0);
  });
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:900});
    await page.goto(certUrl,{waitUntil:'domcontentloaded'});
    await page.getByText('Demo data — not verified',{exact:true}).waitFor();
    await page.addScriptTag({path:process.env.AXE_SCRIPT});
    await check('public certificate measurable contrast and width '+width,async()=>{
      const value=await page.evaluate(async()=>{
        const surface=document.querySelector('.certificate-print-surface');
        if(!surface)throw new Error('Missing certificate');
        const scan=await window.axe.run(surface,{runOnly:{type:'rule',values:['color-contrast']},resultTypes:['violations','incomplete','passes','inapplicable']});
        const label=surface.querySelector('dt');
        return {
          viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
          background:getComputedStyle(surface).backgroundColor,labelColor:getComputedStyle(label).color,
          fieldLabels:surface.querySelectorAll('[data-certificate-field] dt').length,
          passingTextNodes:scan.passes.flatMap(x=>x.nodes).length,
          axeVersion:window.axe.version,violations:scan.violations,incomplete:scan.incomplete,passes:scan.passes
        };
      });
      report.contrast.push({width,...value});
      assert.equal(value.background,'rgb(19, 50, 82)');
      assert.equal(value.labelColor,'rgb(124, 197, 251)');
      assert.ok(value.scroll<=value.viewport+1);
      assert.ok(value.fieldLabels>=10 && value.passingTextNodes>=20);
      assert.equal(value.violations.length,0);assert.equal(value.incomplete.length,0);
      await page.screenshot({path:path.join(out,'public-certificate-'+width+'.png'),fullPage:true});
      return {passingTextNodes:value.passingTextNodes,fieldLabels:value.fieldLabels,background:value.background,labelColor:value.labelColor};
    });
  }
  await check('public mobile navigation still works',async()=>{
    await page.getByRole('button',{name:'Open navigation menu',exact:true}).click();
    const nav=page.getByRole('navigation',{name:'Mobile navigation',exact:true});
    await nav.getByRole('link',{name:'Search Events',exact:true}).click();
    await page.getByRole('heading',{name:'Search Events',exact:true}).waitFor();
    assert.equal(new URL(page.url()).pathname,prefix);
    assert.ok(!(await nav.isVisible()));
  });
  await check('no uncaught page exceptions',async()=>assert.deepEqual(report.pageErrors,[]));
  report.status='PUBLIC_RELEASE_AND_SCOPED_CONTRAST_VERIFIED';
})().catch(e=>{report.status='FAILED';report.error=String(e);console.error(e);process.exitCode=1;})
.finally(async()=>{
  report.completedUtc=new Date().toISOString();
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({status:report.status,sourceCommit,http:report.http,checks:report.checks,error:report.error},null,2));
  if(context)await context.close();if(browser)await browser.close();
});
