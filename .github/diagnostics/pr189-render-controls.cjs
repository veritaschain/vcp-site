'use strict';
// Diagnostic only: fixed-count trials, original threshold, no production changes.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const dir = path.resolve('tools/site-css');
const filename = path.join(dir, 'render-check.cjs');
const helper = new Module(filename, module);
helper.filename = filename;
helper.paths = Module._nodeModulePaths(dir);
helper._compile(fs.readFileSync(filename, 'utf8') + '\nmodule.exports = {...module.exports, stableScreenshot};\n', filename);
const {openPage, settle, snapshot, stableScreenshot, comparePixels, languageCornerGeometry, withinRasterNoiseBudget} = helper.exports;
const {manifest, compileTheme, compact, sha256} = require(path.join(dir, 'lib.cjs'));
const {chromium} = require(path.join(dir, 'node_modules/playwright'));
const output = process.env.CSS_EVIDENCE_DIR;
if (!output) throw new Error('CSS_EVIDENCE_DIR required');
fs.mkdirSync(output, {recursive:true});
const target = 'blog/posts/2026-01-17-vcp-v1-1-regulatory-compliance-solutions/index.html';
async function describe(page) {
  return page.evaluate(() => {
    const nodes = new Set([...document.elementsFromPoint(965,30), ...document.querySelectorAll('vcp-header .language-switcher, vcp-header .lang-link')]);
    return [...nodes].map(el => ({tag:el.tagName, cls:el.getAttribute('class'), text:el.textContent.slice(0,100), rect:el.getBoundingClientRect().toJSON(), style:Object.fromEntries([...getComputedStyle(el)].map(p=>[p,getComputedStyle(el).getPropertyValue(p)])), before:{content:getComputedStyle(el,'::before').content,style:Object.fromEntries([...getComputedStyle(el,'::before')].map(p=>[p,getComputedStyle(el,'::before').getPropertyValue(p)]))}}));
  });
}
async function main() {
  const man=manifest();
  const id=Object.keys(man.themes).find(key=>man.themes[key].pages.includes(target));
  if (!id) throw new Error('target theme missing');
  const baseline=compact(await compileTheme({...man.themes[id],pages:[target]}));
  const browserArgs=['--no-sandbox','--hide-scrollbars','--disable-lcd-text','--force-color-profile=srgb'];
  const browser=await chromium.launch({headless:true,executablePath:process.env.CSS_BROWSER_PATH,args:browserArgs});
  const rows=[];
  try {
    const plans=[['reference-reference',true,true],['compiled-compiled',false,false],['reference-compiled',true,false]];
    for (const [label,left,right] of plans) for(let trial=1;trial<=3;trial++) {
      const instances=[];
      try {
        for(const ref of [left,right]) {
          const inst=await openPage(browser,target,id,ref,{width:1440,height:900},baseline);
          instances.push(inst);
          await settle(inst.page);
          inst.png=await stableScreenshot(inst.page);
          await settle(inst.page);
          inst.snap=await snapshot(inst.page);
          inst.corners=await languageCornerGeometry(inst.page);
          inst.details=await describe(inst.page);
        }
        const [a,b]=instances;
        const pc=comparePixels(a.png,b.png);
        let differences=0;
        for(let i=0;i<Math.max(a.snap.length,b.snap.length);i++) if(JSON.stringify(a.snap[i])!==JSON.stringify(b.snap[i])) differences++;
        const allowance=withinRasterNoiseBudget(pc,differences,a.errors,b.errors,a.corners.regions,JSON.stringify(a.corners)===JSON.stringify(b.corners));
        const prefix=`${label}-${trial}`;
        for(let k=0;k<2;k++) fs.writeFileSync(path.join(output,`${prefix}-${k}.png`),instances[k].png);
        fs.writeFileSync(path.join(output,`${prefix}-details.json`),JSON.stringify(instances.map(i=>i.details),null,2));
        const row={label,trial,differences,pixelComparison:pc,allowance,referenceErrors:a.errors,compiledErrors:b.errors,fullTargetStylesEqual:JSON.stringify(a.details)===JSON.stringify(b.details),screenshotSha256:[sha256(a.png),sha256(b.png)]};
        rows.push(row);
        console.log('CONTROL_RESULT='+JSON.stringify(row));
        if(label==='reference-reference'&&trial===1) console.log('TARGET_GEOMETRY='+JSON.stringify(a.details.map(d=>({tag:d.tag,cls:d.cls,text:d.text,rect:d.rect,backdrop:d.style['backdrop-filter'],filter:d.style.filter,opacity:d.style.opacity,bg:d.style['background-color']}))));
      } finally {for(const instance of instances) await instance.context.close();}
    }
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(output,'diagnostic.json'),JSON.stringify({browserArgs,baselineSha256:sha256(baseline),rows},null,2));
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
