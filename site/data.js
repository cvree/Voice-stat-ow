// Hand-authored fiction. These examples are interface fixtures, never research results.
export const scenarios = [
  {
    id: 'reset', label: 'EXAMPLE 01 / RESET TIMING', title: 'A reset call. A second push.',
    start: 248, duration: 18, cursor: 4, card: 'DEMO-R01', question: 'Did everyone hear the reset?',
    observation: 'In this fictional sequence, a reset call is followed by a forward target call and another elimination event. The timing is visible; the reason is not.',
    hypothesis: 'Was there a safe exit? Did the target call come from a player already committed? Check the VOD before calling this a failed reset.',
    refs: ['CALL-R1', 'CALL-R2', 'EVENT-R2'],
    evidence: [
      {id:'EVENT-R1', at:1, type:'event', role:'GAME', text:'A teammate is eliminated.'},
      {id:'CALL-R1', at:4, duration:3, type:'call', role:'TANK', row:0, text:'We’re down two. Back out, reset.'},
      {id:'CALL-R2', at:7, duration:3, type:'call', role:'DAMAGE', row:1, text:'Their support is one. I can finish.'},
      {id:'EVENT-R2', at:10, type:'event', role:'GAME', text:'A second teammate is eliminated.'},
      {id:'CALL-R3', at:12, duration:3, type:'call', role:'SUPPORT', row:2, text:'Wait for five. Next fight together.'}
    ]
  },
  {
    id: 'plan', label: 'EXAMPLE 02 / ULTIMATE PLAN', title: 'A plan before the engage.',
    start:398, duration:18, cursor:3, card:'DEMO-P01', question:'Was the plan understood?',
    observation:'This example puts an ultimate plan before an acknowledgement, an activation event, and a target call. Sequence alone does not prove execution quality.',
    hypothesis:'Did the team engage on the intended timing and target? Compare the acknowledgement and activation with positioning and cooldowns in the VOD.',
    refs:['CALL-P1','CALL-P2','EVENT-P1'],
    evidence:[
      {id:'CALL-P1',at:3,duration:4,type:'call',role:'SUPPORT',row:2,text:'I have Nano. Go when you’re ready.'},
      {id:'CALL-P2',at:7,duration:2,type:'call',role:'TANK',row:0,text:'Ready. Going in three.'},
      {id:'EVENT-P1',at:10,type:'event',role:'GAME',text:'Nano Boost activation logged.'},
      {id:'CALL-P3',at:11,duration:3,type:'call',role:'DAMAGE',row:1,text:'Same target. Support on the stairs.'},
      {id:'EVENT-P2',at:15,type:'event',role:'GAME',text:'An opposing player is eliminated.'}
    ]
  },
  {
    id:'overlap',label:'EXAMPLE 03 / OVERLAPPING CALLS',title:'Three voices. One short window.',
    start:542,duration:18,cursor:4,card:'DEMO-O01',question:'What needed to be heard first?',
    observation:'Three hand-authored speech turns overlap in this example. The visual marks simultaneous speech; it cannot measure whether a player understood the call.',
    hypothesis:'Were these calls competing or complementary? Listen to the original audio in a real review. Decide together which information should take priority.',
    refs:['CALL-O1','CALL-O2','CALL-O3'],
    evidence:[
      {id:'CALL-O1',at:3,duration:5,type:'call',role:'TANK',row:0,text:'Hold the corner. Don’t use ults yet.'},
      {id:'CALL-O2',at:4,duration:4,type:'call',role:'DAMAGE',row:1,text:'Tracer behind us. Looking at supports.'},
      {id:'CALL-O3',at:4,duration:3,type:'call',role:'SUPPORT',row:2,text:'No lamp. Need help on the backline.'},
      {id:'EVENT-O1',at:8,type:'event',role:'GAME',text:'An ultimate activation is logged.'},
      {id:'CALL-O4',at:12,duration:3,type:'call',role:'TANK',row:0,text:'Turn together. Help our backline.'}
    ]
  }
];

export function formatTime(seconds) {
  const n = Math.max(0, Math.round(seconds));
  return `${Math.floor(n / 60).toString().padStart(2,'0')}:${(n % 60).toString().padStart(2,'0')}`;
}

export function alignedEvidence(scenario, offset = 0, filter = 'all') {
  return scenario.evidence.map(item => ({...item, alignedAt:item.at + (item.type === 'event' ? offset : 0)}))
    .filter(item => filter === 'all' || item.type === filter)
    .sort((a,b) => a.alignedAt - b.alignedAt || a.id.localeCompare(b.id));
}

export function timelineBounds(scenario, offset = 0) {
  const items=alignedEvidence(scenario,offset);
  return {min:Math.min(0,...items.map(e=>e.alignedAt)),max:Math.max(scenario.duration,...items.map(e=>e.alignedAt+(e.duration||0)))};
}

export const verdictLabels = {unreviewed:'Unreviewed',useful:'Useful review moment',context:'Needs more context',dismissed:'Dismiss candidate'};

export function exportMarkdown(reviews, offsets = {}) {
  const sections = ['# Voice Stat - OW — synthetic review\n\nFictional interface examples. No real recordings, AI analysis, or measured results.\n\nCoach notes below are user-entered interpretation, not verified findings.'];
  for (const scene of scenarios) {
    const review = reviews[scene.id] || {};
    const offset = offsets[scene.id] || 0;
    sections.push(`## ${scene.card}: ${scene.question}\n\nObservation: ${scene.observation}\n\nVOD question: ${scene.hypothesis}\n\nGame-clock exploration offset: ${offset >= 0 ? '+' : ''}${offset} s (illustrative only).\n\nCoach interpretation: ${verdictLabels[review.verdict] || verdictLabels.unreviewed}\n\nCoach note:\n${review.note?.trim() || '(No note)'}\n\n### Fictional evidence\n\n${alignedEvidence(scene,offset).map(e => `- ${formatTime(scene.start+e.alignedAt)} [${e.id}] ${e.role}: ${e.text}`).join('\n')}`);
  }
  sections.push('## Limits\n\nVerify transcript accuracy, clock alignment, and original context in any real review. Timing is not proof of intent or causation. This file contains synthetic data only; do not present it as a team assessment.');
  return sections.join('\n\n')+'\n';
}
