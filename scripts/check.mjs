import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../dist');
async function walk(dir){const paths=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=resolve(dir,e.name);paths.push(...e.isDirectory()?await walk(p):[p]);}return paths;}
const files=await walk(root), errors=[];
for(const path of files.filter(p=>p.endsWith('.html'))){
 const html=await readFile(path,'utf8');const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)errors.push(`${path}: duplicate IDs`);
 for(const [,attr,ref]of html.matchAll(/\b(href|src)="([^"]+)"/g)){
  if(/^(https?:|mailto:|data:)/.test(ref))continue;
  if(ref.startsWith('/')){errors.push(`${path}: root-absolute ${ref} will break project Pages`);continue;}
  const [relative,hash]=ref.split('#');let target=resolve(dirname(path),relative||'.');
  if(!relative)target=path;
  if(target!==root&&!target.startsWith(root+sep)){errors.push(`${path}: reference leaves dist: ${ref}`);continue;}
  try{if((await stat(target)).isDirectory())target=resolve(target,'index.html');await stat(target);if(hash&&target.endsWith('.html')&&!new RegExp(`\\bid="${hash.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`).test(await readFile(target,'utf8')))errors.push(`${path}: missing anchor ${ref}`);}
  catch{errors.push(`${path}: missing ${attr} ${ref}`);}
 }
 if(!html.includes('lang="en"')||!html.includes('name="viewport"')||!html.includes('<title>'))errors.push(`${path}: document metadata missing`);
}
for(const path of files){if(/\.(sqlite|ogg|wav|mkv|mp4)$/.test(path)||/\/\.env/.test(path))errors.push(`Private runtime file in dist: ${path}`);}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Checked ${files.length} built files: local links, fragments, project subpaths, metadata, and runtime-data exclusions pass.`);
