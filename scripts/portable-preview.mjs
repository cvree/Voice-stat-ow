// Build a shareable offline preview from the exact public sources, with embedded docs.
// This is a convenience artifact, independent of the normal Pages build.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const out=resolve(process.argv[2]||resolve(root,'../deliverables/Voice-Stat-OW-preview.html'));
let html=await readFile(resolve(root,'dist/index.html'),'utf8');
const css=await readFile(resolve(root,'site/styles.css'),'utf8');
const mark=await readFile(resolve(root,'site/assets/mark.svg'),'utf8');
const data=await readFile(resolve(root,'site/data.js'),'utf8');
let app=await readFile(resolve(root,'site/app.js'),'utf8');
app=app.replace(/^import .*?;\n/,'').replace(/fetch\(new URL\('site-config\.json'[\s\S]*?\.catch\(\(\) => \{\}\);/,'');
const docs={};
for(const key of ['index','getting-started','architecture','feature-status','hardware','privacy','pilot','roadmap','demo','contributing','deployment','provenance']){
 const doc=await readFile(resolve(root,`dist/docs/${key}.html`),'utf8');
 docs[key]=doc.match(/<main[\s\S]*?<\/main>/)[0]
   .replace('id="main"','id="portable-doc-main"')
   .replace(/href="(?:\.\/|([^"/]+)\.html)"/g,(_,name)=>`href="#docs/${name||'index'}"`)
   .replaceAll('href="../index.html#','href="#')
   .replaceAll('href="../"','href="#home"');
}
const files={};
for(const name of ['synthetic-review.json','review.schema.json','synthetic-review.md'])files[name]=await readFile(resolve(root,'examples',name),'utf8');
const route=`
const portableDocs=${JSON.stringify(docs).replaceAll('<','\\u003c')};
const portableFiles=${JSON.stringify(files).replaceAll('<','\\u003c')};
const siteMain=document.getElementById('main');
const docView=document.createElement('div');docView.id='portable-docs';docView.hidden=true;siteMain.after(docView);
function rewritePortableLinks(container){
 container.querySelectorAll('a[href]').forEach(a=>{
  const ref=a.getAttribute('href');
  if(ref.startsWith('docs/'))a.setAttribute('href','#docs/'+(ref.slice(5).replace('.html','')||'index'));
  if(ref==='./')a.setAttribute('href','#home');
  if(ref.startsWith('../downloads/')){
   const name=ref.split('/').pop();
   if(portableFiles[name]){a.href=URL.createObjectURL(new Blob([portableFiles[name]],{type:name.endsWith('.json')?'application/json':'text/markdown'}));a.download=name;}
  }
 });
}
function portableRoute(){
 const key=location.hash.startsWith('#docs/')?location.hash.slice(6):'';
 if(key&&portableDocs[key]){
  siteMain.hidden=true;docView.hidden=false;docView.innerHTML=portableDocs[key];rewritePortableLinks(docView);document.title='Voice Stat - OW — '+key.replaceAll('-',' ');window.scrollTo(0,0);const h=docView.querySelector('h1');h.tabIndex=-1;h.focus({preventScroll:true});
 }else{siteMain.hidden=false;docView.hidden=true;document.title='Voice Stat - OW — Make the next review count.';if(location.hash==='#home')window.scrollTo(0,0);else if(location.hash)document.getElementById(location.hash.slice(1))?.scrollIntoView();}
}
rewritePortableLinks(document);window.addEventListener('hashchange',portableRoute);portableRoute();
`;
html=html.replace(/<link rel="stylesheet" href="styles.css">/,`<style>${css}</style>`)
 .replace(/<script type="module" src="app.js"><\/script>/,'')
 .replace(/src="assets\/mark.svg"/g,`src="data:image/svg+xml;base64,${Buffer.from(mark).toString('base64')}"`)
 .replace(/href="assets\/mark.svg"/g,`href="data:image/svg+xml;base64,${Buffer.from(mark).toString('base64')}"`)
 .replace('</body>',`<script type="module">${data.replaceAll('export ','')}\n${app}\n${route}</script></body>`);
await mkdir(dirname(out),{recursive:true});await writeFile(out,html);console.log(`Portable preview: ${out}`);
