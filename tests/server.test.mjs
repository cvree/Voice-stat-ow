import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('preview serves public assets and docs at root and project subpaths, without exposing source or configuration', {timeout:10000}, async()=>{
 const child=spawn(process.execPath,['scripts/serve.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:'0'},stdio:['ignore','pipe','pipe']});
 try{
  const base=await new Promise((resolve,reject)=>{
   let output='';child.stdout.on('data',chunk=>{output+=chunk;const m=output.match(/http:\/\/127\.0\.0\.1:\d+/);if(m)resolve(m[0]);});child.on('error',reject);child.on('exit',code=>reject(new Error(`Preview exited before ready: ${code}`)));
  });
  for(const path of ['/','/docs/','/docs/privacy.html','/styles.css','/app.js','/data.js','/downloads/synthetic-review.json','/voice-stat-ow/','/voice-stat-ow/docs/getting-started.html','/voice-stat-ow/assets/mark.svg']){
   const response=await fetch(base+path);assert.equal(response.status,200,path);assert.ok((await response.text()).length>0,path);assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  }
  for(const path of ['/.env','/README.md','/package.json','/../README.md','/unknown-page'])assert.equal((await fetch(base+path)).status,404,path);
 }finally{child.kill();await once(child,'exit');}
});
