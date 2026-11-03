import test from 'node:test';
import assert from 'node:assert/strict';
import { scenarios, alignedEvidence, timelineBounds, exportMarkdown, formatTime } from '../site/data.js';
import { renderMarkdown, inline } from '../scripts/markdown.mjs';
import { readFile } from 'node:fs/promises';
test('all synthetic evidence has unique IDs, valid windows, and resolvable card references',()=>{
 const seen=new Set();
 for(const scene of scenarios){assert.ok(scene.duration>0);for(const e of scene.evidence){assert.ok(!seen.has(e.id));seen.add(e.id);assert.ok(e.at>=0&&e.at+(e.duration||0)<=scene.duration);assert.ok(['event','call'].includes(e.type));}for(const ref of scene.refs)assert.ok(scene.evidence.some(e=>e.id===ref));}
});
test('clock exploration changes only game events, does not mutate data, and sorts chronologically',()=>{
 const original=structuredClone(scenarios[0]);const shifted=alignedEvidence(scenarios[0],-5);
 for(const e of shifted)assert.equal(e.alignedAt,e.at+(e.type==='event'?-5:0));
 assert.deepEqual(scenarios[0],original);assert.ok(shifted.every((e,i)=>i===0||shifted[i-1].alignedAt<=e.alignedAt));
 assert.ok(alignedEvidence(scenarios[0],3,'call').every(e=>e.type==='call'));
});
test('export preserves per-scenario interpretation, notes, alignment, and synthetic labeling',()=>{
 const md=exportMarkdown({reset:{verdict:'context',note:'Check the escape route.\nA second note.'}},{reset:2});
 assert.match(md,/Fictional interface examples/);assert.match(md,/Needs more context/);assert.match(md,/Check the escape route\.\nA second note\./);assert.match(md,/\+2 s/);assert.match(md,/04:11 \[EVENT-R1\]/);assert.match(md,/DEMO-O01/);assert.equal(formatTime(398),'06:38');
});
test('timeline bounds keep shifted events visible and selectable at both offset extremes',()=>{
 for(const s of scenarios)for(const offset of [-5,0,5]){const bounds=timelineBounds(s,offset);for(const e of alignedEvidence(s,offset)){assert.ok(e.alignedAt>=bounds.min);assert.ok(e.alignedAt+(e.duration||0)<=bounds.max);}}
 assert.equal(timelineBounds(scenarios[0],-5).min,-4);
 assert.equal(timelineBounds(scenarios[1],5).max,20);
});
test('documentation renderer escapes raw HTML and code, blocks active links, and rewrites Markdown links',()=>{
 assert.equal(inline('<script>alert(1)</script>'),'&lt;script&gt;alert(1)&lt;/script&gt;');
 assert.match(inline('[docs](architecture.md#storage)'),/architecture.html#storage/);
  assert.match(inline('[download](../downloads/synthetic-review.md)'),/synthetic-review.md/);
 assert.match(inline('[bad](javascript:alert)'),/href="#"/);
 assert.ok(!renderMarkdown('```html\n<script>x</script>\n```').includes('<script>'));
 assert.match(renderMarkdown('# Heading\n\n# Heading'),/id="heading-1"/);
});
test('proposed public review fixture stays synthetic and has valid evidence references',async()=>{
 const fixture=JSON.parse(await readFile(new URL('../examples/synthetic-review.json',import.meta.url),'utf8'));
 const schema=JSON.parse(await readFile(new URL('../examples/review.schema.json',import.meta.url),'utf8'));
 assert.equal(fixture.schemaVersion,schema.properties.schemaVersion.const);assert.equal(fixture.synthetic,true);assert.equal(fixture.clock.basis,'relative-seconds');
 const ids=new Set(fixture.evidence.map(e=>e.id));assert.equal(ids.size,fixture.evidence.length);
 for(const e of fixture.evidence){assert.ok(Number.isFinite(e.atSeconds)&&e.atSeconds>=0);if(e.endSeconds!==undefined)assert.ok(e.endSeconds>=e.atSeconds);}
 for(const c of fixture.cards)for(const id of c.evidenceIds)assert.ok(ids.has(id));
 assert.ok(fixture.limitations.length>0);
});
