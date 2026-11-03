import { scenarios, formatTime, alignedEvidence, timelineBounds, exportMarkdown } from './data.js';

document.documentElement.classList.add('js');

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
function closeMenu() { menu?.setAttribute('aria-expanded','false'); nav?.removeAttribute('data-open'); }
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded',String(open));
  nav.toggleAttribute('data-open',open);
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {closeMenu();menu.focus();} });

// Empty configuration means a useful documentation destination, never a fabricated repo.
fetch(new URL('site-config.json', import.meta.url)).then(r => r.ok ? r.json() : {}).then(config => {
  if (typeof config.repositoryUrl === 'string' && /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(config.repositoryUrl)) {
    document.querySelectorAll('[data-repository-link]').forEach(a => {a.href=config.repositoryUrl;a.textContent='View the website source ↗';});
  }
}).catch(() => {});

const lab = document.querySelector('[data-lab]');
if (lab) {
  const $ = id => document.getElementById(id);
  const tabs = [...document.querySelectorAll('[data-scenario]')];
  const reviews = Object.fromEntries(scenarios.map(s => [s.id,{verdict:'unreviewed',note:''}]));
  const offsets = Object.fromEntries(scenarios.map(s => [s.id,0]));
  let scene = scenarios[0], filter = 'all', cursor = scene.cursor;
  function announce(message) { $('demo-status').textContent=message; }
  function renderTimeline() {
    const offset=offsets[scene.id];
    const bounds=timelineBounds(scene,offset),span=bounds.max-bounds.min;
    cursor=Math.max(bounds.min,Math.min(bounds.max,cursor));
    $('timeline-cursor').min=bounds.min;$('timeline-cursor').max=bounds.max;$('timeline-cursor').value=cursor;
    $('axis-start').textContent=formatTime(scene.start+bounds.min);$('axis-end').textContent=formatTime(scene.start+bounds.max);
    const evidence=alignedEvidence(scene,offset,filter);
    const nearest=evidence.reduce((best,e) => !best || Math.abs(e.alignedAt-cursor)<Math.abs(best.alignedAt-cursor) ? e : best,null);
    $('cursor-time').textContent=formatTime(scene.start+cursor);
    $('timeline-cursor').setAttribute('aria-valuetext',`${formatTime(scene.start+cursor)}${nearest ? `. ${nearest.role}: ${nearest.text}` : ''}`);
    $('playhead').style.left=`${(cursor-bounds.min)/span*100}%`;
    $('tracks').querySelectorAll('.speech-block,.event-dot').forEach(n=>n.remove());
    for (const e of alignedEvidence(scene,offset)) {
      const marker=document.createElement('div');
      marker.setAttribute('aria-hidden','true');
      marker.style.setProperty('--left',`${Math.max(0,Math.min(99,(e.alignedAt-bounds.min)/span*100))}%`);
      if (e.type === 'call') {
        marker.className=`speech-block row${e.row}`;
        marker.style.setProperty('--width',`${e.duration/span*100}%`);
        marker.style.setProperty('--row',String(e.row));
      } else {marker.className='event-dot';}
      $('tracks').append(marker);
    }
    $('evidence-list').replaceChildren();
    for (const e of evidence) {
      const row=document.createElement('button');row.type='button';
      row.dataset.evidenceId=e.id;
      row.className=`evidence-item${e.id===nearest?.id?' selected':''}`;
      row.setAttribute('aria-pressed',String(e.id===nearest?.id));
      const time=document.createElement('time');time.textContent=formatTime(scene.start+e.alignedAt);
      const role=document.createElement('span');role.className=`evidence-speaker${e.type==='event'?' game':''}`;role.textContent=e.role;
      const text=document.createElement('span');text.textContent=e.text;
      row.append(time,role,text);
      row.addEventListener('click',()=>{cursor=e.alignedAt;$('timeline-cursor').value=cursor;renderTimeline();document.querySelector(`[data-evidence-id="${e.id}"]`)?.focus({preventScroll:true});announce(`${time.textContent}. ${e.role}: ${e.text}`);});
      $('evidence-list').append(row);
    }
    $('offset-label').textContent=`${offset>=0?'+':''}${offset} s`;
    $('offset-explanation').textContent=offset===0 ? 'Game event times are unchanged. Real sessions need a verified sync point.' : `Game events moved ${Math.abs(offset)} seconds ${offset>0?'later':'earlier'}; comms stay fixed. This changes apparent sequence, not what happened.`;
  }
  function selectScene(id) {
    scene=scenarios.find(s=>s.id===id)||scenarios[0];cursor=scene.cursor;
    tabs.forEach(tab=>{const active=tab.dataset.scenario===scene.id;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
    $('review-panel').setAttribute('aria-labelledby',`tab-${scene.id}`);
    for (const [id,value] of Object.entries({'example-label':scene.label,'moment-title':scene.title,'card-id':scene.card,'review-question':scene.question,'observation':scene.observation,'hypothesis':scene.hypothesis,'axis-start':formatTime(scene.start),'axis-end':formatTime(scene.start+scene.duration)})) $(id).textContent=value;
    $('evidence-refs').replaceChildren(...scene.refs.map(ref=>{const el=document.createElement('span');el.textContent=ref;return el;}));
    $('timeline-cursor').max=scene.duration;$('timeline-cursor').value=cursor;
    $('sync-offset').value=offsets[scene.id];$('verdict').value=reviews[scene.id].verdict;$('coach-note').value=reviews[scene.id].note;
    renderTimeline();
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>selectScene(tab.dataset.scenario));
    tab.addEventListener('keydown',e=>{
      let index;
      if(e.key==='ArrowRight')index=(i+1)%tabs.length;
      if(e.key==='ArrowLeft')index=(i-1+tabs.length)%tabs.length;
      if(e.key==='Home')index=0;
      if(e.key==='End')index=tabs.length-1;
      if(index!==undefined){e.preventDefault();tabs[index].focus();selectScene(tabs[index].dataset.scenario);}
    });
  });
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    filter=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    renderTimeline();announce(`Showing ${filter==='all'?'all':filter==='call'?'communications':'game event'} evidence.`);
  }));
  $('timeline-cursor').addEventListener('input',e=>{cursor=Number(e.target.value);renderTimeline();});
  $('sync-offset').addEventListener('input',e=>{offsets[scene.id]=Number(e.target.value);renderTimeline();});
  $('verdict').addEventListener('change',e=>{reviews[scene.id].verdict=e.target.value;announce('Interpretation kept in this tab.');});
  $('coach-note').addEventListener('input',e=>{reviews[scene.id].note=e.target.value;});
  $('export-review').addEventListener('click',()=>{
    const blob=new Blob([exportMarkdown(reviews,offsets)],{type:'text/markdown;charset=utf-8'});
    const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download='voice-stat-ow-synthetic-review.md';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    announce('Synthetic review exported. All three examples and your notes are included.');
  });
  $('clear-review').addEventListener('click',()=>{
    for(const s of scenarios){reviews[s.id]={verdict:'unreviewed',note:''};offsets[s.id]=0;}
    selectScene(scene.id);announce('All demo notes, interpretations, and clock offsets cleared.');
  });
  selectScene(scene.id);lab.hidden=false;
}
