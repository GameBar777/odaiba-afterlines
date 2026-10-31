import { play } from '../tests/play';
import { DB } from '../src/data';
import * as E from '../src/engine/engine';
const seen=new Set<string>(); const ends:Record<string,number>={}; let dead=0; const kn=new Set<string>();
const orig=(E as any);
for (const p of ['worker','student','parent'] as const) for (let i=1;i<=4000;i++){ const {s,ending}=play(p,i*7919);
 ends[ending.id]=(ends[ending.id]||0)+1; for(const x of (s as any).history.map((h:any)=>h.scene)) seen.add(x); for(const k of (s as any).know) kn.add(k); if((s as any).dead) dead++;}
console.log(ends,'dead',dead);
console.log('unvisited', Object.keys(DB.scenes).map((x:any)=>x).filter((x:string)=>!seen.has(x)));
console.log('unknown', DB.knowledge.map((x:any)=>x.id).filter((x:string)=>!kn.has(x)));
