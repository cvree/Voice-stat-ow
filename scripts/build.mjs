import { mkdir, rm, cp, readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, basename } from 'node:path';
import { renderMarkdown, escapeHtml } from './markdown.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');const dist=resolve(root,'dist');
const config=JSON.parse(await readFile(resolve(root,'site.config.json'),'utf8'));
for(const key of ['repositoryUrl','applicationUrl']) if(config[key]&&!/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(config[key]))throw new Error(`${key} must be empty or a GitHub repository URL`);
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
await cp(resolve(root,'site'),dist,{recursive:true});
await writeFile(resolve(dist,'site-config.json'),JSON.stringify(config,null,2)+'\n');
await writeFile(resolve(dist,'.nojekyll'),'');
const docList=[['index','Overview'],['getting-started','Getting started'],['architecture','Architecture'],['feature-status','Feature status'],['hardware','Hardware & costs'],['privacy','Privacy & retention'],['pilot','Pilot protocol'],['roadmap','Roadmap'],['demo','Demo & data contract'],['contributing','Contributing'],['deployment','Deploy the website'],['provenance','Sources & provenance']];
await mkdir(resolve(dist,'docs'),{recursive:true});
const home=await readFile(resolve(root,'site/index.html'),'utf8');
const header=home.match(/<header[\s\S]*?<\/header>/)[0].replaceAll('href="./"','href="../"').replaceAll('src="assets/','src="../assets/').replaceAll('href="#','href="../index.html#').replaceAll('href="docs/','href="');
const footer=home.match(/<footer[\s\S]*?<\/footer>/)[0].replaceAll('href="./"','href="../"').replaceAll('src="assets/','src="../assets/').replaceAll('href="docs/','href="');
for(const [key,title]of docList){
 const markdown=await readFile(resolve(root,`docs/${key}.md`),'utf8');
 const navigation=docList.map(([k,t])=>`<a href="${k==='index'?'./':k+'.html'}"${key===k?' aria-current="page"':''}>${escapeHtml(t)}</a>`).join('\n');
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#101411"><meta name="description" content="${escapeHtml(title)} — Voice Stat - OW project documentation."><title>${escapeHtml(title)} — Voice Stat - OW docs</title><link rel="icon" href="../assets/mark.svg" type="image/svg+xml"><link rel="stylesheet" href="../styles.css"><script type="module" src="../app.js"></script></head><body><a class="skip" href="#main">Skip to content</a>${header}<main id="main" class="docs-shell wrap"><nav class="docs-nav" aria-label="Documentation"><p class="eyebrow">Voice Stat - OW / FIELD MANUAL</p>${navigation}</nav><article class="doc-content"><a class="doc-breadcrumb" href="../">← PROJECT HOME</a><p class="eyebrow">DOCUMENTATION / ${escapeHtml(title.toUpperCase())}</p>${renderMarkdown(markdown)}<div class="doc-links"><a href="./">Documentation index</a><a href="../#review">Try the review lab ↗</a></div></article></main>${footer}</body></html>`;
 await writeFile(resolve(dist,`docs/${key}.html`),html);
}
// Public downloads contain only intentionally selected, synthetic material.
await mkdir(resolve(dist,'downloads'),{recursive:true});
for(const file of await readdir(resolve(root,'examples')))await cp(resolve(root,'examples',file),resolve(dist,'downloads',basename(file)));
await writeFile(resolve(dist,'404.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — Voice Stat - OW</title><style>body{background:#101411;color:#f1f3e9;font:18px/1.7 system-ui;max-width:600px;padding:10vh 24px;margin:auto}h1{font-size:64px;color:#c9f568}a{color:#c9f568}</style></head><body><h1>Lost the moment?</h1><p>This Voice Stat - OW page could not be found.</p><p>Remove everything after the repository name in this URL to return to the project home, or use your browser’s Back button.</p><p><a href="https://github.com/cvree">Project owner on GitHub ↗</a></p></body></html>`);
console.log(`Built website, ${docList.length} documentation pages, and synthetic downloads in dist/.`);
