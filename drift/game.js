// =====================================================================
// 漂流30日 本体 ― 昼は島を歩き、夜は焚き火で決める
// =====================================================================
const $=s=>document.querySelector(s);
let RNG=Math.random;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;if(S)S.rs=a;return((t^t>>>14)>>>0)/4294967296;};}
function todayKey(){const d=new Date(Date.now()+9*3600e3);return d.getUTCFullYear()*10000+(d.getUTCMonth()+1)*100+d.getUTCDate();}
const R=()=>RNG(),chance=p=>R()<p,pick=a=>a[Math.floor(R()*a.length)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ri=(a,b)=>a+Math.floor(R()*(b-a+1));
const SAVE='drift30-save2',METAK='drift30-meta';
let S=null,META={best:0,runs:0,titles:{},dex:{},pages:{},feats:{},daily:{}};
try{META=Object.assign(META,JSON.parse(localStorage.getItem(METAK)||'{}'));['dex','pages','feats','daily','titles'].forEach(k=>META[k]=META[k]||{});}catch(e){}
const saveMeta=()=>{try{localStorage.setItem(METAK,JSON.stringify(META));}catch(e){}};
const save=()=>{try{if(S&&!S.ended)localStorage.setItem(SAVE,JSON.stringify(S));}catch(e){}};
const L2P=12; // 1リットル＝水分12ポイント

// ---------------- はじまり ----------------
function newGame(seed){
  S=null;RNG=seed?mulberry(seed):Math.random;
  const back=pick(BACKS),cause=pick(CAUSES),sex=chance(.5)?'M':'F';
  const type=pick(Object.keys(ISLANDS)),IT=ISLANDS[type];
  const isl={type,spring:chance(IT.spring),cave:chance(IT.cave),coconut:chance(type==='mangrove'?.6:.85),wreck:chance(.45),turtle:chance(type==='mangrove'?.15:.4)};
  const st=START_ITEMS.slice().sort(()=>R()-.5).slice(0,ri(1,3));
  const inv={};st.forEach(([k,n])=>inv[k]=(inv[k]||0)+n);if(back.start)inv[back.start]=(inv[back.start]||0)+1;
  S={day:1,slot:0,phase:'day',hp:100+(back.hp||0),hpMax:100+(back.hp||0),water:80,food:80,morale:70,
    sick:null,wound:null,wet:true,inv,lighter:inv.lighter?3:0,battery:inv.phone?34:0,
    stock:0,raw:0,fire:0,b:{shelter:0,catcher:0,catcherLeaf:0,still:0,sos:0,beacon:0,raft:0},
    loc:'camp',sel:'camp',weather:'sun',stormLeft:0,isl,found:{},explore:{jungle:0,beach:0,ne:0,w:0},
    back:back.id,cause:cause.id,ember:0,wreckLeft:3,seed:seed||0,sk:{gather:0,fish:0,fire:0,craft:0,explore:0},pages:[],feat:Object.keys(FEATS).sort(()=>R()-.5).slice(0,3),foundF:{},dog:null,push:false,watch:0,lvUp:[],sex,today:{},plan:null,cards:null,pickCard:null,nightNotes:[],
    log:[],notes:[],queue:[],ended:null,seen:{},stats:{drank:0,ate:0,fish:0,crafted:0,sick:0},deathCause:null,firstFire:null};
  if(inv.bottle){S.stock=.3;}
  S.queue.push({tag:'漂着',tx:`気がつくと、砂浜にうつ伏せで倒れていた。<br>${cause.n}——そこまでは覚えている。${cause.t}<br><br>あなたは<b>${back.n}</b>。${back.d}。<br>ポケットに残っていたのは、${Object.keys(inv).map(k=>ITEMS[k].n).join('、')}。<br><br>見渡すかぎり、海と、ヤシの木と、森。人の気配はない。<br><br>どうやらここは<b>${IT.n}</b>らしい。${IT.d}。`,
    ops:[{t:'まず、生き延びることを考える',f:()=>{info('three');return '昼は島を歩いて、ものを集める。夜は焚き火のそばで、明日に備える。まずは水だ。';}}]});
  S.nextW=rollW();S.goal=pickGoal();
  log('無人島に漂着した');save();
}
const B=()=>BACKS.find(b=>b.id===S.back),CA=()=>CAUSES.find(c=>c.id===S.cause);
const has=(k,n=1)=>(S.inv[k]||0)>=n;
function add(k,n=1){if(n>0&&!META.dex[k]){META.dex[k]=1;saveMeta();}S.inv[k]=(S.inv[k]||0)+n;if(S.inv[k]<=0)delete S.inv[k];if(n>0&&S.phase==='day')S.today[k]=(S.today[k]||0)+n;}
function lv(k){let l=1;for(let i=1;i<LV.length;i++)if((S.sk[k]||0)>=LV[i])l=i+1;return l;}
function xp(k,n=1){const b=lv(k);S.sk[k]=(S.sk[k]||0)+n;const a=lv(k);if(a>b)S.lvUp.push(`${SKILLS[k].n}のレベルが${a}に上がった！`);}
function log(t){S.log.push({d:S.day,s:S.slot,t});}
function note(t){S.notes.push(t);}
function info(k){S.seen[k]=1;}
function mod(o){for(const k in o){if(k==='hp')S.hp=clamp(S.hp+o[k],0,S.hpMax);else S[k]=clamp(S[k]+o[k],0,100);}}
const cap=()=>(S.inv.bottle||0)*1.5+(S.b.catcher?6:0)+(S.inv.bamboocup||0)*.5+(S.inv.can||0)*.3+(S.inv.bag||0)*.5;
const hasCutter=()=>has('knife')||has('multitool');
const canBoil=()=>S.fire>0&&(has('can')||has('bamboocup'));
const inShelter=()=>S.b.shelter>0||S.found.cave;
const shelterLv=()=>Math.max(S.b.shelter,S.found.cave?2:0);
function LOC(p){
  if(p&&p[0]==='f'&&p.length===2){const i=+p[1],F=FEATS[S.feat[i]];return {n:F.n,g:F.g,d:F.d,acts:F.acts,x:FSLOT[i].x,y:FSLOT[i].y,far:[2,1,1][i],feat:S.feat[i]};}
  return LOCS[p];
}
// 地図に出ている場所
function places(){
  const p=['camp','rocks','jungle','hill'];
  p.push(S.found.ne?(S.isl.spring?'spring':'dry'):'ne');
  p.push(S.found.w?(S.isl.cave?'cave':'cliff'):'w');
  p.push('reef');if(S.found.wreck)p.push('wreck');
  [0,1,2].forEach(i=>{if(S.foundF[i])p.push('f'+i);});
  return p;
}

// ---------------- 時間の経過 ----------------
function slotDrain(effort){
  const w=WEATHER[S.weather];let loss=[3,5,3,3][S.slot];
  if(S.slot===1)loss+=w.heat===2?6:w.heat===1?2:0;
  if(S.slot===1&&effort===0&&inShelter())loss-=3;
  loss+=effort===2?3:effort===1?1.5:0;
  if(S.sick&&S.sick.type==='diarrhea')loss*=2;
  if(B().water)loss*=1-B().water;
  S.water=clamp(S.water-loss,0,100);
  S.food=clamp(S.food-(effort===2?4.5:3.5),0,100);
  if(S.water<=0)hurt(18,'dehydration');else if(S.water<15)hurt(6,'dehydration');
  if(S.food<=0){hurt(2,'starvation');S.morale=clamp(S.morale-2,0,100);}
  if(S.slot===1&&w.heat===2&&effort===2&&S.water<45){if(chance(.35)){hurt(14,'heat');note('目の前が白くなった。熱中症だ。');}}
  if(S.sick){hurt(S.sick.type==='cig'?5:S.sick.type==='fever'?3:2,'sick');}
  if(S.wound&&S.wound.inf)hurt(4,'infection');
  if(S.water>40&&S.food>25&&!S.sick&&!(S.wound&&S.wound.inf))S.hp=clamp(S.hp+2,0,S.hpMax);
  if(S.fire>0){S.fire--;if(WEATHER[S.weather].rain&&shelterLv()<2&&S.fire>0)S.fire--;}
}
function hurt(n,cause){S.hp=clamp(S.hp-n,0,S.hpMax);if(S.hp<=0&&!S.deathCause)S.deathCause=cause;}
function rainCollect(){
  const w=WEATHER[S.weather];if(!w.rain)return;
  let got=0;const c=cap();
  if(S.b.catcher)got+=w.rain===2?4:2.5;
  if(S.b.catcherLeaf)got+=w.rain===2?1.2:.8;
  if(S.b.gutter)got+=w.rain===2?2.5:1.5;
  if(has('bottle')&&!S.b.catcher&&!S.b.catcherLeaf)got+=.4;
  if(has('tarp')&&!S.b.catcher)got+=.6;
  got=Math.min(got,Math.max(0,c-S.stock-S.raw));
  if(got>0){S.stock+=got;note(`雨水を${got.toFixed(1)}Lためた。雨水は、ほぼそのまま飲める。`);}
  if(got<=0||!has('bottle')){S.water=clamp(S.water+8,0,100);note('雨を手のひらで受けて飲んだ。');}
}
function advance(effort){
  slotDrain(effort);
  rainCollect();
  const nt=S.notes.splice(0);if(nt.length)S.lastRes=(S.lastRes||'')+nt.map(n=>'<br>'+n).join('');
  if(S.hp<=0)return die();
  S.slot++;
  if(S.slot>=3){toNight();return;}
  slotEvents();
  if(S.hp<=0)return die();
  save();render();
}
// ---------------- 夜 ----------------
function toNight(){
  S.phase='night';S.slot=3;
  // 遠くにいたら、暗い道を戻る
  if(LOC(S.loc).far>=2){
    if(chance(.25)){woundUp();note('暗くなった森の道で、足をくじいた。');}
    else note('日が沈む前に、急いでキャンプへ戻った。');
    if(S.fire>0)S.fire=Math.max(0,S.fire-1);
  }
  S.loc='camp';S.sel='camp';S.eveNotes=S.notes.splice(0);
  S.cards=drawCards();S.pickCard=null;
  save();render();
}
function cardPool(){
  const c=[],w=WEATHER[S.weather],tod=S.today;
  const fromToday=need=>Object.keys(need).some(k=>tod[k]);
  if(S.fire<=0&&hasTinder()&&hasFuel())c.push({id:'light',n:'火をおこす',ic:'fire',from:'火口・燃料',d:S.lighter>0?`ライター（あと${S.lighter}回）を使う`:has('bow')?'弓ギリ式で火をおこす':'木をこすり合わせる。成功しにくい',tag:'',wt:7,f:()=>lightFire()});
  if(false)c.push({id:'boil',n:'生水を煮沸',ic:'pot',from:'焚き火',d:`生水${S.raw.toFixed(1)}Lを1分間沸騰させて、安全な水にする`,tag:'',wt:5,f:()=>{const v=S.raw;S.raw=0;S.stock+=v;info('boil');return `生水${v.toFixed(1)}Lを煮沸した。`;}});
  const cook=Object.keys(FOOD).filter(k=>FOOD[k].cook&&has(k));
  if(S.fire>0&&cook.length)c.push({id:'cook',n:'焼いて食べる',ic:cook.includes('fish')?'fish':'crab',from:cook.map(k=>ITEMS[k].n).slice(0,2).join('・'),d:'火を通せば、お腹をこわしにくい。満腹まで食べる',tag:'',wt:4,f:()=>{let n=0;for(const k of cook){while(has(k)&&S.food<92){eat(k,true,true);n++;}}return n?`焚き火で${n}つ焼いて食べた。`:'お腹はいっぱいだった。';}});
  if(S.wound)c.push({id:'treat',n:'傷の手当て',ic:'bandage',from:'ケガ',d:S.stock>=.2?'きれいな水で傷を洗う':'水がないので海水で洗う',tag:S.wound.inf?'化膿している':'',wt:S.wound.inf?9:7.2,f:()=>{treat();if(S.wound){S.wound.clean=true;S.wound.days=Math.max(1,S.wound.days-2);if(S.wound.inf&&chance(.5))S.wound.inf=false;}return '傷を洗い、葉で覆ってしっかり手当てした。';}});
  if(w.rain&&shelterLv()<2&&has('leaf',2))c.push({id:'guard',n:'雨よけを張る',ic:'leaf',from:'ヤシの葉',d:'今夜だけ、寝床の上に葉を重ねて雨をしのぐ',tag:'雨に強い',wt:8,f:()=>{add('leaf',-2);S.guardTonight=true;return 'ヤシの葉を重ねて、雨よけを張った。';}});
  RECIPES.filter(r=>canCraft(r)).forEach(r=>{
    c.push({id:'craft_'+r.id,n:r.n.replace(/（.*?）/,''),ic:r.b==='sos'||r.id==='knife'?'stone':r.id==='oknife'?'obsidian':r.b==='shelter'?'leaf':r.id==='bamboocup'?'canteen':['spear','rod','raft','gutter'].includes(r.id)?'bamboo':r.id==='bow'?'fire':'tool',from:Object.keys(r.need).map(k=>ITEMS[k].n).slice(0,2).join('・'),d:r.d,tag:fromToday(r.need)?'今日の収穫':'',wt:fromToday(r.need)?6:2.5,f:()=>{craftDo(r);return `焚き火の明かりで、${r.n}を作った。`;}});});
  if(S.fire>0)c.push({id:'watch',n:'夜の海を見張る',ic:'eye',from:'焚き火',d:'船の明かりが見えたら、火で合図する。寝不足になる',tag:'',wt:2,f:()=>{hurt(3,'sick');mod({morale:-2});if(chance(.05+searchP()*.6)){const p=Math.min(.7,.25+(S.b.beacon?.25:0));if(chance(p)){S.rescueBy='ship';S.pendingEnd='rescue';return '水平線に、船の明かりが見えた。火を振って叫んだ——明かりが、こちらに向きを変えた！';}mod({morale:-10});return '船の明かりが見えた。火を振ったが、明かりは遠ざかっていった。';}return '朝まで海を見ていたが、何も見えなかった。';}});
  const pl=places().filter(p=>p!=='camp');
  c.push({id:'plan',n:'明日の計画',ic:'map',from:'地図',d:'夜明けとともに出発し、朝のうちに多く集める',tag:!S.found.ne?'水の音の方へ？':'',wt:3,plan:true});
  const raw=['fish','crab','crabbig','clam'].filter(k=>has(k));
  if(S.fire>0&&raw.length)c.push({id:'smoke',n:'燻製にする',ic:'smoked',from:raw.map(k=>ITEMS[k].n).slice(0,2).join('・'),d:'煙でいぶして、腐りにくくする。生ものは一晩で傷むことがある',tag:'日持ち',wt:5,f:()=>{let n=0;for(const k of raw){n+=S.inv[k];delete S.inv[k];}add('smoked',n);info('smoke');return `${n}つを燻製にした。何日かもちそうだ。`;}});
  if(S.b.shelter>=1&&has('leaf',3))c.push({id:'bed',n:'寝床を整える',ic:'bed',from:'ヤシの葉',d:'葉を厚く敷いて、今夜はぐっすり眠る',tag:'体力回復',wt:3,f:()=>{add('leaf',-3);S.hp=clamp(S.hp+14,0,S.hpMax);mod({morale:4});return '葉を敷きつめた寝床は、思ったよりやわらかかった。';}});
  c.push({id:'diary',n:'今日を刻む',ic:'diary',from:'流木',d:'流木に今日のことを刻む。明日やることも見えてくる',tag:'気力回復',wt:S.morale<50?3:1.5,f:()=>{mod({morale:10});const h=nearRecipes()[0];return '流木に、今日のことを刻んだ。'+(h?`<br>明日は${WHERE[h.miss[0][0]]||'島'}で${ITEMS[h.miss[0][0]].n}を探そう。そうすれば${h.r.n}が作れる。`:'');}});
  if(S.b.raft)c.push({id:'nav',n:'星で方角を読む',ic:'moon',from:'夜空',d:'星の動きから方角をつかむ。いかだの成功率が上がる',tag:'いかだ',wt:4,f:()=>{S.raftBonus=Math.min(.2,(S.raftBonus||0)+.07);return '南十字星の位置を、目に焼きつけた。';}});
  if(!w.rain&&S.morale<45)c.push({id:'stars',n:'星を見る',ic:'moon',from:'夜空',d:'満天の星を眺めて、気持ちを立て直す',tag:'気力回復',wt:4,f:()=>{mod({morale:14});return '満天の星。こんな星空は、見たことがない。';}});
  c.push({id:'sleep',n:'ぐっすり眠る',ic:'moon',from:'寝床',d:'何もせず、体を休める',tag:'体力回復',wt:1.5,f:()=>{S.hp=clamp(S.hp+8,0,S.hpMax);mod({morale:4});return '早めに横になった。';}});
  return c;
}
function drawCards(){
  const pool=cardPool(),out=[];
  pool.sort((a,b)=>b.wt-a.wt);if(pool[0]&&pool[0].wt>=7)out.push(pool.shift());
  while(out.length<3&&pool.length){
    const tot=pool.reduce((a,c)=>a+c.wt,0);let r=R()*tot,i=0;
    for(;i<pool.length;i++){r-=pool[i].wt;if(r<=0)break;}
    out.push(pool.splice(Math.min(i,pool.length-1),1)[0]);
  }
  return out.map(c=>c.id);
}
function findCard(id){return cardPool().find(c=>c.id===id);}
function playCard(id,planLoc){
  const c=findCard(id);let msg='';
  if(c){if(c.plan){S.plan=planLoc;msg=`明日は夜明けとともに「${LOC(planLoc).n.replace('？ ','')}」へ向かうことにした。`;}else msg=c.f()||'';}
  S.cards=null;S.pickCard=null;
  if(msg)S.nightNotes.push(msg);
  if(S.pendingEnd){const k=S.pendingEnd;S.pendingEnd=null;return endGame(k);}
  if(S.hp<=0)return die();
  night();
}
function night(){
  const w=WEATHER[S.weather];let msg=S.nightNotes.splice(0);
  const sh=Math.max(shelterLv(),S.guardTonight?Math.min(2,shelterLv()+1):0);
  const burn=2+(w.rain&&sh<2?1:0);
  const fireN=S.fire>0,fed=S.fire>=burn;
  const left=Math.max(0,S.fire-burn),ember=fireN&&!left&&!w.rain&&chance(.4);
  if(fed)msg.push('焚き火は朝まで燃えつづけた。');
  else if(fireN)msg.push(ember?'火は夜中に小さくなったが、熾火（おきび）が残っていた。':'薪が足りず、火は夜中に消えた。');
  if(w.rain){
    if(sh>=2){msg.push('雨音を聞きながら、乾いた場所で眠れた。');}
    else{let d=w.rain===2?(sh===1?12:22):(sh===1?5:10);if(fed)d=Math.round(d*.5);else if(fireN)d=Math.round(d*.75);hurt(d,'cold');S.wet=true;mod({morale:-10});msg.push(w.rain===2?'嵐の夜。屋根が吹き飛ばされそうになり、全身ずぶ濡れで朝を待った。':'雨に打たれ、濡れたまま震えて眠った。');info('cold');
      if(chance(fed?.1:fireN?.15:.24)&&!S.sick){S.sick={type:'fever',days:3};S.stats.sick++;msg.push('体が熱い。熱が出た。');}}
  }else{
    if(sh===0){hurt(fireN?0:4,'cold');mod({morale:fireN?-2:-6});msg.push(fireN?'焚き火のそばで、砂の上に横になった。':'砂の上で、虫に刺されながら眠った。夜は思ったより冷える。');}
    else{S.hp=clamp(S.hp+(sh>=3?10:6),0,S.hpMax);mod({morale:sh>=3?4:1});msg.push(sh>=3?'高床の小屋でぐっすり眠った。':'寝床で体を休めた。');}
    S.wet=false;
  }
  if(S.isl.type==='mangrove'&&!S.sick&&chance(fireN?.03:.1)){S.sick={type:'fever',days:3};S.stats.sick++;info('mosquito');msg.push('蚊に何か所も刺された。翌朝、体がだるく熱っぽい。');}
  let rot=0;for(const k of ['fish','crab','crabbig','clam']){const n=S.inv[k]||0;let r=0;for(let i=0;i<n;i++)if(chance(.3))r++;if(r){add(k,-r);rot+=r;}}
  if(rot){msg.push(`暑さで、生の魚介が${rot}つ傷んでしまった。`);info('smoke');}
  if(chance(.18)&&(S.inv.fish||S.inv.crab||S.inv.coconut||S.inv.egg)){const k=['fish','crab','egg','coconut'].find(x=>S.inv[x]);add(k,-1);msg.push(`夜中、ヤシガニに${ITEMS[k].n}を持っていかれた。`);}
  else if(chance(.1)){mod({morale:-8});msg.push('家族の夢を見た。目が覚めると、波の音だけがした。');}
  if(S.b.still){const g=Math.min(.4,Math.max(0,cap()-S.stock-S.raw));if(g>0){S.stock+=g;msg.push(`蒸留器に${g.toFixed(2)}Lの真水がたまっていた。`);}}
  if(S.dog){mod({morale:4});if(S.food>30){S.food=clamp(S.food-4,0,100);msg.push(`${S.dog.n}と食べ物を分け合い、寄りそって眠った。`);}else{mod({morale:-3});msg.push(`${S.dog.n}も、お腹をすかせている。`);}}
  const G=S.goal;if(G&&!G.done&&goalOK(G.id)){G.done=true;mod({morale:8});msg.push(`今日の目標「${G.t}」を達成した！`);}
  S.morale=clamp(S.morale-4,0,100);
  slotDrain(0);
  S.fire=left||(ember?1:0);S.guardTonight=false;
  if(S.hp<=0){S.notes.push(...msg);return die();}
  if(S.sick){S.sick.days--;if(S.sick.days<=0){msg.push('ようやく体調が戻った。');S.sick=null;}}
  if(S.wound){S.wound.days--;if(!S.wound.clean&&!S.wound.inf&&chance(.3)){S.wound.inf=true;S.wound.days=Math.max(S.wound.days,4);msg.push('傷が赤く腫れてきた。化膿している。きれいな水で洗わないと。');}if(S.wound.days<=0){S.wound=null;msg.push('傷がふさがった。');}}
  S.day++;S.slot=0;S.phase='day';S.cocoToday=0;S.today={};S.dayRes=[];S.lastRes='';
  if(S.day>30){S.notes.push(...msg);return endGame('survive');}
  rollWeather();
  S.morning=msg;S.goal=pickGoal();
  if(S.plan){S.sel=S.plan;}else S.sel='camp';
  morningEvents();
  if(S.hp<=0)return die();
  save();render();
}
const GOALS=[
 {id:'fire',t:'火をおこす',c:()=>S.fire>0},
 {id:'water',t:'安全な水を1L以上ためる',c:()=>S.stock>=1},
 {id:'shelter',t:'寝床をつくる',c:()=>S.b.shelter>=1},
 {id:'knife',t:'刃物をつくる',c:()=>hasCutter()},
 {id:'ne',t:'北東の森を探索する',c:()=>S.found.ne},
 {id:'sos',t:'SOS文字をつくる',c:()=>S.b.sos>=1},
 {id:'deep',t:'森の奥地で新しい場所を見つける',c:()=>Object.keys(S.foundF).length>=Math.min(3,(S.goalDeep||0)+1)},
 {id:'w',t:'西の崖を探索する',c:()=>S.found.w},
 {id:'shelter2',t:'壁つきの寝床にする',c:()=>S.b.shelter>=2},
 {id:'food',t:'保存できる食べ物を3つためる',c:()=>(S.inv.smoked||0)+(S.inv.coconut||0)+(S.inv.banana||0)>=3},
 {id:'beacon',t:'のろし台をつくる',c:()=>S.b.beacon>=1},
 {id:'sos2',t:'SOS文字を大きくする',c:()=>S.b.sos>=2},
 {id:'water4',t:'安全な水を4L以上ためる',c:()=>S.stock>=4},
 {id:'raft',t:'いかだをつくる',c:()=>S.b.raft>=1},
];
function goalOK(id){const g=GOALS.find(x=>x.id===id);return g&&g.c();}
function pickGoal(){if(S.goal&&S.goal.id==='deep'&&S.goal.done)S.goalDeep=Object.keys(S.foundF).length;const g=GOALS.find(x=>!x.c());return g?{id:g.id,t:g.t,done:false}:null;}
function routes(){
  const food=(S.inv.smoked||0)+(S.inv.coconut||0)+(S.inv.banana||0);
  return [
   {id:'rescue',n:'救助を待つ',d:'空と海から見つけてもらう',items:[['SOS文字',S.b.sos>=1],['SOS文字（大）',S.b.sos>=2],['のろし台',S.b.beacon>=1],[`丘で見張る（${Math.min(3,S.watch)}/3）`,S.watch>=3]]},
   {id:'raft',n:'いかだで脱出',d:'海鳥の帰る方角へ',items:[['いかだ',S.b.raft>=1],[`安全な水4L（${S.stock.toFixed(1)}）`,S.stock>=4],[`保存できる食べ物3つ（${food}）`,food>=3],['方角の手がかり',(S.raftBonus||0)>=.07]]},
   {id:'survive',n:'30日を生き抜く',d:'島で、ただ生きる',items:[[`${S.day}日目 / 30日`,S.day>30]]},
  ];
}
const rescueReady=()=>routes()[0].items.every(x=>x[1]);
function rollW(){const r=R();return r<.3?'sun':r<.42?'hot':r<.62?'cloud':r<.93?'rain':'storm';}
function rollWeather(){
  S.weather=S.nextW||rollW();
  if(S.weather==='storm'&&!S.stormLeft&&chance(.35)){S.stormLeft=1;S.nextW='storm';}
  else{S.stormLeft=0;S.nextW=rollW();}
  S.knowNext=false;
}
// ---------------- 出来事 ----------------
function searchP(){const c=CA();const base=rescueReady()?.1:.06;return base+(S.day<=c.search?.16*(1-S.day/(c.search+4)):0);}
function slotEvents(){
  const air=chance(searchP()/2.2),ship=chance(.035);
  if(air)S.queue.push(evCraft('air'));
  else if(ship&&['camp','hill','rocks'].includes(S.loc))S.queue.push(evCraft('ship'));
  else if(chance(.07))S.queue.push(pick(minorEvents()));
}
function morningEvents(){
  if(S.weather==='storm'&&S.b.shelter>0&&S.b.shelter<3&&chance(S.braced?.15:.5)){S.b.shelter--;S.morning.push('嵐で寝床の屋根が吹き飛んだ。');}
  if(S.weather==='storm'&&shelterLv()<3&&!S.found.cave){if(S.fire>0)S.morning.push('嵐の雨で、焚き火が消えてしまった。');S.fire=0;}
  if(S.nextW==='storm'&&chance(S.pages.length>=4?1:.5))S.queue.push({tag:'台風の前ぶれ',tx:'夕焼けのような赤い朝焼け。生ぬるい風が吹き、うねりが大きくなってきた。'+(S.pages.length>=4?'<br><small>手記に書いてあった。こういう日の翌日は、海が荒れる。</small>':''),ops:[{t:'寝床をツルでしばっておく',f:()=>{if(has('vine')){add('vine',-1);S.braced=true;return 'ツルで屋根をしばりつけた。明日は荒れそうだ。';}return '補強する材料（ツル）がない。明日は荒れそうだ。';}},{t:'気のせいだと思う',f:()=>'……風が、だんだん強くなってきた。'}]});
  if(!S.dog&&!S.dogGone&&S.day>=3&&S.day<=14&&chance(.13))S.queue.push({tag:'流れ着いた犬',tx:'波打ち際で、やせた犬が流木にしがみついて震えていた。どこかの船から落ちたのだろうか。<br>じっと、こちらを見ている。',ops:[...['ポチ','ハチ','シロ','マル'].map(n=>({t:`「${n}」と呼ぶ`,f:()=>{S.dog={n};log(`犬の${n}が仲間になった`);mod({morale:15});return `${n}が、しっぽを振って駆け寄ってきた。もう、ひとりじゃない。`;}})),{t:'そっとしておく',f:()=>{S.dogGone=true;return '犬は、森のほうへ歩いていった。';}}]});
  if(S.day===2)S.queue.push({tag:'2日目',tx:'のどが渇いて目が覚めた。昨日より日差しが痛い。<br>水がなければ、人は3日ほどしかもたない。',ops:[{t:'水を探すことを最優先にする',f:()=>{info('three');info('water');return '昼の暑い時間に遠くまで歩けば、汗で水分が逃げていく。';}}]});
  if(S.day===5&&S.cause==='fishing')S.queue.push({tag:'捜索',tx:'水平線の向こうに、一瞬だけ船影が見えた気がした。<br>……捜索は、もう打ち切られたのかもしれない。',ops:[{t:'信じて待つ',f:()=>{mod({morale:-6});return '自分で何とかするしかない。';}}]});
  if(S.day===10)S.queue.push({tag:'10日目',tx:'10日が過ぎた。流木に刻んだ線が、10本になった。',ops:[{t:'あと20日。必ず生きて帰る',f:()=>{mod({morale:8});return '線の横に、もう一本、深く刻んだ。';}},{t:'もう誰も来ないのかもしれない',f:()=>{mod({morale:-10});return '波打ち際に座り込んだ。';}}]});
  if(S.day===20)S.queue.push({tag:'20日目',tx:'20日目。438日間、太平洋を漂流して生き延びた漁師の話を思い出した。',ops:[{t:'あの人に比べれば',f:()=>{mod({morale:10});info('alvarenga');return '生の魚とウミガメと雨水で、彼は生き延びた。';}}]});
  if(chance(.2)&&S.weather!=='storm')S.queue.push(pick(minorEvents()));
  if(S.prevStorm&&chance(.3)){S.queue.push({tag:'漂着コンテナ',tx:'嵐が去った浜に、大きなコンテナが打ち上げられている。扉が少し開いている。',ops:[{t:'中を調べる',f:()=>{const g=lootRoll('wreck',4);mod({morale:8});return '中に入っていたもの：'+g;}},{t:'危ないのでやめておく',f:()=>'近づかないことにした。'}]});}
  else if(S.prevStorm&&chance(.7)){S.queue.push({tag:'嵐のあと',tx:'嵐の翌朝、浜にいろいろなものが打ち上げられている。',ops:[{t:'拾いに行く',f:()=>{const g=lootRoll('beach',3);return '拾ったもの：'+g;}}]});}
  S.prevStorm=S.weather==='storm';if(S.weather!=='storm')S.braced=false;
}
function minorEvents(){
  const a=[
   {tag:'漂着物',tx:'波打ち際に、何かが光っている。',ops:[{t:'拾う',f:()=>{const k=pick(['can','bottle','bottle','line','rope','bag','tarp']);add(k);return `${ITEMS[k].n}を拾った。`;}},{t:'無視する',f:()=>'気のせいだ、と思うことにした。'}]},
   {tag:'ムカデ',tx:'足元をなにかが這った。大きなムカデだ。',ops:[{t:'払いのける',f:()=>{if(chance(.4)){hurt(8,'wound');mod({morale:-4});return '噛まれた。焼けるように痛い。';}return 'うまく払いのけた。';}},{t:'じっとして動かない',f:()=>'ムカデは去っていった。'}]},
   {tag:'海鳥',tx:'海鳥の群れが、岩場の一角に集まっている。巣があるのかもしれない。',ops:[{t:'卵を探す',f:()=>{if(chance(.5)){add('egg',2);return '卵を2つ見つけた。';}hurt(4,'wound');return '親鳥につつかれた。';}},{t:'見ているだけにする',f:()=>{mod({morale:3});return '鳥の声が、少しだけ寂しさを紛らわせた。';}}]},
   {tag:'声',tx:'森の奥から、人の声のようなものが聞こえた気がした。',ops:[{t:'叫んで返事をする',f:()=>{mod({morale:-6});return '返ってきたのは、鳥の鳴き声だけだった。';}},{t:'疲れているせいだ',f:()=>{mod({morale:-2});return '耳をふさいだ。';}}]},
  ];
  a.push({tag:'ボトルメール',tx:'波打ち際に、栓をした瓶が転がっている。中に紙が入っている。',ops:[{t:'開けて読む',f:()=>{if(!S.found.ne&&chance(.6)){S.hintNE=true;return '古い手描きの地図だった。島の北東に、水のしるしが描いてある。';}mod({morale:6});return pick(['「この手紙を拾った人へ。今日も海はきれいです」——知らない誰かの字に、少し救われた。','かすれて読めない。でも、誰かが海の向こうにいる。']);}},{t:'そのまま海に返す',f:()=>{mod({morale:2});return '瓶は波に乗って、ゆっくり離れていった。';}}]});
  a.push({tag:'海鳥',tx:'夕暮れ、海鳥の群れがいっせいに同じ方角へ飛んでいく。',ops:[{t:'方角を覚えておく',f:()=>{S.raftBonus=Math.min(.2,(S.raftBonus||0)+.05);return '海鳥は夜、陸で休む。あの方角に島があるのかもしれない。';}},{t:'ただ見送る',f:()=>{mod({morale:3});return 'きれいな空だった。';}}]});
  a.push({tag:'ヤシの実',tx:'ドスン、とすぐ横にヤシの実が落ちてきた。',ops:[{t:'拾う',f:()=>{add('coconut',2);return 'ヤシの実を2つ手に入れた。頭に当たらなくてよかった。';}}]});
  if(S.isl.type==='volcano')a.push({tag:'地鳴り',tx:'足元がぐらりと揺れた。火口から、うっすら煙が上がっている。',ops:[{t:'しばらく様子を見る',f:()=>{mod({morale:-5});return '揺れはすぐにおさまった。この島は、まだ生きている。';}}]});
  if(S.isl.type==='mangrove')a.push({tag:'蚊の群れ',tx:'夕方、マングローブのほうから蚊の群れがわいてきた。',ops:[{t:'焚き火の煙で追い払う',f:()=>{if(S.fire>0){info('mosquito');return '煙が流れると、蚊は寄ってこなくなった。';}hurt(3,'sick');return '火がない。腕じゅう刺された。';}},{t:'泥を肌に塗る',f:()=>{mod({morale:-3});return 'においはひどいが、少しはましになった。';}}]});
  if(S.isl.turtle)a.push({tag:'ウミガメ',tx:'夜明けの浜に、ウミガメの足跡が続いている。',ops:[{t:'跡をたどって卵を掘る',f:()=>{add('egg',ri(2,5));return 'ウミガメの卵を見つけた。';}},{t:'そっとしておく',f:()=>{mod({morale:4});return '命が続いていく浜だ。';}}]});
  return a;
}
function signalPower(kind){
  let p=0,how=[];
  if(kind==='air'){if(S.b.sos){p+=S.b.sos===2?.6:.38;how.push('SOS文字');}}
  if(S.b.beacon&&(S.fire>0||S.lighter>0)&&['camp','hill'].includes(S.loc)){p+=kind==='ship'?.55:.35;how.push('のろし');}
  else if(S.fire>0){p+=.15;how.push('焚き火の煙');}
  if(has('phone')&&S.battery>0){p+=.12;how.push('スマホの画面の反射');}
  if(rescueReady()){p+=.1;how.push('準備は万全');}
  return {p:Math.min(.92,p),how};
}
function evCraft(kind){
  const sp=signalPower(kind);
  const tx=kind==='air'?`空から低い音がする。${S.slot===0?'朝の':''}空に、小さな機影が見えた。${S.b.sos?'浜のSOS文字が、見えるだろうか。':''}`
    :'水平線に、船影が見えた。こちらに向かってはいない。';
  const ops=[];
  if(S.b.beacon&&(S.fire>0||S.lighter>0)&&['camp','hill'].includes(S.loc))ops.push({t:'のろし台に火をつける',f:()=>{S.b.beacon=0;if(S.fire<=0)S.lighter--;return tryRescue(kind,sp.p+.1);}});
  ops.push({t:'大声で叫び、手を振る',f:()=>tryRescue(kind,sp.p*.8+.02)});
  if(has('phone')&&S.battery>0)ops.push({t:'スマホの画面で太陽の光を反射させる',f:()=>{S.battery=Math.max(0,S.battery-8);return tryRescue(kind,sp.p+.08);}});
  return {tag:kind==='air'?'飛行機':'船',tx:tx+(sp.how.length?`<br><small>使える合図：${sp.how.join('・')}</small>`:'<br><small>合図になるものが、何もない。</small>'),ops};
}
function tryRescue(kind,p){
  if(chance(p)){S.rescueBy=kind;S.queue=[];S.pendingEnd='rescue';return kind==='air'?'機体が旋回した。翼を振っている——気づいてくれた！':'船が向きを変えた。汽笛が鳴った——気づいてくれた！';}
  mod({morale:-12});return kind==='air'?'機影は、そのまま雲の向こうに消えた。':'船影は、ゆっくりと水平線に消えていった。';
}

// ---------------- 昼の行動 ----------------
const ACTS={
 beach:{n:'浜辺を探す',d:'流木・漂着物・ココナッツ',e:1},
 craft:{n:'作業する',d:'道具や寝床、SOSを作る',e:1},
 fire:{n:'火をおこす',d:'火口と燃料が必要',e:1,c:()=>S.fire<=0},
 rest:{n:'休む',d:'体力と気力が戻る。昼の汗も減る',e:0},
 raft:{n:'いかだで海に出る',d:'最後の賭け',e:2,c:()=>S.b.raft},
 rocks:{n:'岩場で探す',d:'カニ・貝・海藻・石',e:1},
 fish:{n:'魚をとる',d:'釣り竿や銛があるとよくとれる',e:1},
 jungle:{n:'森を探る',d:'葉・ツル・竹・枝・果実',e:2},
 hill:{n:'見張る',d:'船や飛行機を見つけやすい',e:1},
 explore_ne:{n:'奥へ分け入る',d:'森の奥を探る。疲れる',e:2},
 explore_w:{n:'崖のほうへ行く',d:'崖沿いを探る。疲れる',e:2},
 spring:{n:'水を汲む',d:'生水。煮沸しないとお腹をこわすことも',e:1},
 dry:{n:'沢を探す',d:'雨のあとなら水があるかも',e:1},
 cave:{n:'洞窟を調べる',d:'奥に何かあるかもしれない',e:1},
 cliff:{n:'石を集める',d:'石・貝殻',e:1},
 deep:{n:'奥地へ進む',d:'めずらしいもの・新しい場所。ヘビに注意',e:2},
 falls:{n:'滝の水を汲む',d:'流れる水。生水だが比較的安全',e:1},
 nest:{n:'卵をとる',d:'親鳥に注意',e:1},
 hut:{n:'小屋を調べる',d:'何か残っているかも',e:1},
 herb:{n:'薬草を摘む',d:'熱に効く。ヒルと蚊に注意',e:1},
 hunt:{n:'野ブタを狩る',d:'銛が必要。牙に注意',e:2},
 banana:{n:'バナナをとる',d:'たくさん実っている',e:1},
 reef_fish:{n:'素潜りで魚をとる',d:'銛があるとよくとれる。クラゲに注意',e:2},
 reef:{n:'浅瀬で貝を拾う',d:'貝・貝殻・海藻',e:1},
 wreck:{n:'難破船をあさる',d:'使えるものが残っているかも',e:1},
};
function doAct(id){
  if(S.queue.length||S.ended||S.phase!=='day')return;
  const loc=S.sel;S.loc=loc;
  const planned=S.plan&&S.plan===loc&&S.slot===0;if(S.slot===0)S.plan=null;
  const a=ACTS[id];
  const push=S.push&&a.e>0&&!['fire','rest','raft','craft','hut'].includes(id);
  const GA=['beach','rocks','jungle','reef','wreck','cliff','nest','banana','herb'];
  const bonus=(planned?1:0)+(push?ri(1,2):0)+(GA.includes(id)?(lv('gather')>=3?1:0)+(lv('gather')>=5?1:0):0);
  let res='';
  const tired=S.food<15||S.morale<10;
  switch(id){
   case 'beach':{const n=ri(2,3)-(S.explore.beach>8?1:0)+bonus;res='拾ったもの：'+lootRoll('beach',n);S.explore.beach++;if(chance(.04))findPage();break;}
   case 'rocks':{res='見つけたもの：'+lootRoll('rocks',ri(2,3)+bonus);if(chance(.15)){woundUp();res+='<br>サンゴで足を切った。';}break;}
   case 'fish':{
     const p=(has('rod')?.6:has('spear')?.5:.12)+(B().fish||0)-(tired?.15:0)+(planned?.15:0)+(push?.12:0)+(lv('fish')-1)*.05;
     if(chance(p)){const n=has('rod')||has('spear')?ri(1,2):1;add('fish',n);S.stats.fish+=n;res=`魚が${n}匹とれた。`;}else res='一匹もとれなかった。'+(has('rod')||has('spear')?'':'素手では難しい。');
     if(has('spear')&&chance(.05)){S.queue.push({tag:'サメ',tx:'浅瀬で魚を突いていると、背びれが近づいてきた。',ops:[{t:'すぐに岸へ上がる',f:()=>{if(chance(.85)){info('shark');return '必死で岩に上がった。心臓が破れそうだ。';}hurt(35,'shark');woundUp();return 'ふくらはぎを噛まれた。';}},{t:'銛で威嚇する',f:()=>{if(chance(.6)){info('shark');return 'サメは興味をなくしたように去った。';}hurt(45,'shark');woundUp();return '銛ごと腕を持っていかれそうになった。';}}]});}
     break;}
   case 'jungle':{
     S.explore.jungle++;res='見つけたもの：'+lootRoll('jungle',ri(2,3)+bonus);
     if(S.isl.wreck&&!S.found.wreck&&S.explore.jungle>=4&&chance(.3)){S.found.wreck=true;log('古い難破船を見つけた');add('tarp');add('can',2);add('rope');res+='<br><b>森を抜けた北の浜に、古い難破船が打ち上げられていた！</b>防水シート・空き缶・ロープを手に入れた。地図に難破船が増えた。';}
     else if(!S.found.ne&&S.isl.spring&&chance(.3))res+='<br>北東の奥から、水の流れる音がした気がする。';
     if(chance(.1)){woundUp();res+='<br>枝で腕を切った。';}
     break;}
   case 'hill':{mod({morale:4});res=pick(['水平線を見渡した。何も見えない。','島の形がよくわかった。思ったより小さい。','遠くに雲がわいている。雨が来るかもしれない。']);
     if(S.isl.type==='volcano'&&chance(.6)){add('obsidian');info('obsidian');res+='<br>火口のふちで、黒くて光る石——<b>黒曜石</b>を見つけた。';}
     S.knowNext=true;S.watch++;xp('explore');res+=`<br>空と雲の様子から、明日の天気は「<b>${WEATHER[S.nextW].n}</b>」になりそうだ。`;
     if(S.pages.length>=5&&S.day%7===0&&chance(.6))S.queue.push(evCraft('air'));
     if(chance(.12+searchP())){S.queue.push(evCraft(chance(.5)?'air':'ship'));}break;}
   case 'explore_ne':case 'explore_w':{
     const k=id==='explore_ne'?'ne':'w';S.explore[k]++;
     res='見つけたもの：'+lootRoll('jungle',ri(1,2));
     if(chance(.35+S.explore[k]*.2+(planned?.2:0)+(lv('explore')-1)*.06+(k==='ne'&&S.hintNE?.35:0))){S.found[k]=true;
       if(k==='ne'){if(S.isl.spring){log('湧き水を見つけた');res+='<br><b>岩の割れ目から、水が湧き出している！</b>';}else{log('涸れた沢を見つけた');res+='<br><b>沢を見つけた。……でも、水は涸れていた。</b>';}}
       else{if(S.isl.cave){log('洞窟を見つけた');res+='<br><b>崖のふもとに洞窟を見つけた。雨風をしのげそうだ。</b>';}else{log('西の崖にたどり着いた');res+='<br><b>崖に突き当たった。洞窟はなかった。</b>';}}
       S.sel=k==='ne'?(S.isl.spring?'spring':'dry'):(S.isl.cave?'cave':'cliff');S.loc=S.sel;
     }else res+='<br>道に迷い、引き返した。';
     if(chance(.12)){woundUp();res+='<br>とげで腕を切った。';}
     break;}
   case 'spring':{const room=Math.max(0,cap()-S.stock-S.raw);S.raw+=room;S.water=clamp(S.water+20,0,100);res=`湧き水を飲み、${room>0?room.toFixed(1)+'Lを汲んだ':'容器がないので、その場で飲めるだけ飲んだ'}。`;
     if(chance(.12)){S.sick={type:'diarrhea',days:2};S.stats.sick++;res+='<br>……しばらくして、お腹が痛くなってきた。';info('boil');}break;}
   case 'dry':{if(WEATHER[S.weather].rain||S.prevStorm){const room=Math.max(0,Math.min(1,cap()-S.stock-S.raw));S.raw+=room;S.water=clamp(S.water+10,0,100);res=`雨水が沢にたまっていた。${room>0?room.toFixed(1)+'L汲んだ。':'その場で飲んだ。'}`;}else res='見つけたもの：'+lootRoll('rocks',1)+'<br>沢に水はなかった。';break;}
   case 'cave':{if(!S.found.caveLoot){S.found.caveLoot=true;add('rope');add('can');res='洞窟の奥に、誰かが昔いた跡があった。ロープと空き缶を見つけた。';findPage();}else{res='見つけたもの：'+lootRoll('rocks',1);S.hp=clamp(S.hp+4,0,S.hpMax);res+='<br>ひんやりした洞窟で、少し休んだ。';}break;}
   case 'cliff':{add('stone',ri(3,5));if(chance(.4))add('shell');res='石をたくさん集めた。';break;}
   case 'reef_fish':{
     const p=(has('spear')?.55:has('rod')?.35:.18)+(S.isl.type==='coral'?.12:0)+(B().fish||0)-(tired?.15:0)+(planned?.15:0)+(push?.12:0)+(lv('fish')-1)*.05;
     if(chance(p)){const n=has('spear')?ri(1,3):1;add('fish',n);S.stats.fish+=n;res=`魚が${n}匹とれた。`;}else res='魚は素早く、逃げられてしまった。';
     if(chance(.08)){hurt(6,'wound');mod({morale:-4});res+='<br>クラゲに刺された。焼けるように痛い。真水ではなく海水で洗い流した。';}
     if(has('spear')&&chance((S.slot===2?.08:.03)*(S.dog?.5:1))){S.queue.push({tag:'サメ',tx:'浅瀬で魚を突いていると、背びれが近づいてきた。',ops:[{t:'すぐに岸へ上がる',f:()=>{if(chance(S.dog?.96:.85)){info('shark');return S.dog?`${S.dog.n}が吠えて知らせてくれた。すぐに砂浜へ上がった。`:'必死で砂浜に上がった。心臓が破れそうだ。';}hurt(35,'shark');woundUp();return 'ふくらはぎを噛まれた。';}},{t:'銛で威嚇する',f:()=>{if(chance(.6)){info('shark');return 'サメは興味をなくしたように去った。';}hurt(45,'shark');woundUp();return '銛ごと腕を持っていかれそうになった。';}}]});}
     break;}
   case 'reef':{res='見つけたもの：'+lootRoll('reef',ri(2,3)+bonus);break;}
   case 'wreck':{if(S.wreckLeft>0){S.wreckLeft--;res='見つけたもの：'+lootRoll('wreck',ri(2,3)+(push?1:0));if(S.wreckLeft===2&&chance(.6))findPage();if(!S.wreckLeft)res+='<br>もう、めぼしいものは残っていない。';}else{add('wood',2);res='使えるものは残っていない。板を2枚はがして持ち帰った。';}break;}
   case 'deep':{
     S.explore.deep=(S.explore.deep||0)+1;res='見つけたもの：'+lootRoll('jungle',ri(1,2)+(push?1:0));
     if(chance(.35)){const k=pick(hasCutter()?['bamboo','bamboo','crabbig','fruit']:['crabbig','fruit','vine']);add(k);res+=`、${ITEMS[k].n}×1`;}
     const fi=[0,1,2].find(i=>!S.foundF[i]);
     if(fi!=null&&chance(.4+S.explore.deep*.08+(lv('explore')-1)*.06+(planned?.2:0))){S.foundF[fi]=1;const F=FEATS[S.feat[fi]];META.feats[S.feat[fi]]=1;saveMeta();log(`${F.n}を見つけた`);res+=`<br><b>森の奥で「${F.n}」を見つけた！</b>地図に増えた。`;S.sel='f'+fi;}
     else if(chance(.18))findPage();
     if(chance((push?.16:.1)*(S.dog?.5:1))){hurt(10,'wound');woundUp();res+='<br>ヘビに噛まれた！毒はなさそうだが、ひどく痛む。';}
     break;}
   case 'falls':{const room=Math.max(0,cap()-S.stock-S.raw);S.raw+=room;S.water=clamp(S.water+22,0,100);res=`冷たい滝の水を飲み、${room>0?room.toFixed(1)+'L汲んだ':'容器がないので、その場で飲めるだけ飲んだ'}。`;if(chance(.04)){S.sick={type:'diarrhea',days:1};res+='<br>少しお腹がゆるくなった。';}if(!S.found.fallsPage){S.found.fallsPage=1;if(chance(.5))findPage();}break;}
   case 'nest':{const n=ri(2,4)+(push?1:0);add('egg',n);res=`海鳥の卵を${n}つとった。`;if(chance(push?.35:.22)){hurt(5,'wound');res+='<br>親鳥に激しくつつかれた。';}break;}
   case 'hut':{if(!S.found.hutLoot){S.found.hutLoot=1;add('can');add('rope');if(!hasCutter())add('knife');res='小屋の中に、錆びたナイフ、空き缶、ロープが残っていた。<br>壁ぎわに、紙の束が落ちている……。';findPage();findPage();}else{S.hp=clamp(S.hp+8,0,S.hpMax);mod({morale:4});res='小屋の日陰で、ひと休みした。誰かがここで生きていた、という事実に、少し励まされる。';}break;}
   case 'herb':{const n=ri(1,2)+(push?1:0);add('herb',n);res=`薬草を${n}つ摘んだ。`;if(chance(.22)){hurt(3,'sick');res+='<br>足にヒルが吸いついていた。';}break;}
   case 'hunt':{const p=(has('spear')?.42:.08)+(lv('fish')-1)*.04+(S.dog?.15:0)+(push?.1:0);if(chance(p)){const n=ri(1,2);add('meat',n);res=`${S.dog?S.dog.n+'が追い込んだ野ブタを、':''}銛で仕留めた！肉を${n}つ手に入れた。`;xp('fish',2);}else res=has('spear')?'気配に気づかれ、逃げられた。':'素手では、とても近づけない。銛が必要だ。';if(chance(.15)){hurt(12,'wound');woundUp();res+='<br>牙で足をえぐられた。';}break;}
   case 'banana':{const n=ri(2,4)+(push?1:0);add('banana',n);res=`バナナを${n}本とった。`;break;}
   case 'fire':{res=lightFire();break;}
   case 'rest':{S.hp=clamp(S.hp+6,0,S.hpMax);mod({morale:5});res='日陰で体を休めた。';break;}
   case 'raft':{return raftOut();}
  }
  if(push&&id!=='deep'&&id!=='hunt'&&chance(.12)){woundUp();res+='<br>無理をして、足を切ってしまった。';}
  if(S.dog&&GA.concat(['deep','fish','reef_fish']).includes(id)&&chance(.25)){const k=pick(['coconut','crab','branch','fiber','egg','shell']);add(k);res+=`<br>${S.dog.n}が${ITEMS[k].n}をくわえてきた！`;}
  const XP={beach:'gather',rocks:'gather',jungle:'gather',reef:'gather',wreck:'gather',cliff:'gather',nest:'gather',banana:'gather',herb:'gather',fish:'fish',reef_fish:'fish',hunt:'fish',deep:'explore',explore_ne:'explore',explore_w:'explore'};
  if(XP[id])xp(XP[id]);
  if(push)res='【無理をした】'+res;
  if(planned)res='夜明けとともに出発した。'+res;
  S.lastRes=res;(S.dayRes=S.dayRes||[]).push(`${SLOTS[S.slot]}｜${a.n}　${res.replace(/<br>/g,' ').replace(/<[^>]+>/g,'')}`);
  advance(Math.min(2,a.e+(push?1:0)+(LOC(loc).far>=2&&S.slot===1&&WEATHER[S.weather].heat?1:0)));
}
function findPage(){
  const i=S.pages.length;if(i>=PAGES.length)return;
  if(i===PAGES.length-1&&S.pages.length<7)return;
  S.pages.push(i);META.pages[i]=1;saveMeta();log(`手記の${PAGES[i].t}を見つけた`);
  const P=PAGES[i],h=P.hint;
  if(h==='ne')S.hintNE=true;if(h==='raft')S.raftBonus=Math.min(.25,(S.raftBonus||0)+.08);
  S.queue.push({tag:'手記・'+P.t,tx:`<div class="page">${P.b}</div>`+(h&&h!=='last'?'<small>（このページの知識が、これから役に立ちそうだ）</small>':''),ops:[{t:'しまっておく',f:()=>{mod({morale:h==='last'?10:4});return '';}}]});
}
function woundUp(){if(!S.wound){S.wound={days:4,clean:false,inf:false};}hurt(5,'wound');}
const LOOT={
 beach:[['wood',30],['coconut',S=>S.isl.coconut?13:4],['fiber',14],['shell',10],['bottle',6],['can',5],['rope',3],['line',3],['bag',4],['tarp',1.5],['stone',8],['egg',S=>S.isl.turtle?4:0]],
 rocks:[['crab',20],['clam',22],['seaweed',16],['stone',24],['shell',10]],
 reef:[['clam',24],['shell',18],['seaweed',12],['crab',8],['fish',6]],
 wreck:[['tarp',10],['can',18],['rope',14],['line',12],['bottle',16],['wood',18],['bag',8]],
 jungle:[['leaf',26],['vine',20],['branch',22],['fiber',16],['bamboo',S=>hasCutter()?16:0],['coconut',S=>S.isl.coconut?13:3],['fruit',8],['mushroom',5],['crabbig',3]],
};
const ISL_MOD={volcano:{rocks:{stone:20},jungle:{fruit:6,bamboo:-4}},mangrove:{rocks:{crab:22,clam:10},beach:{coconut:-8,wood:6},jungle:{crabbig:6,fiber:-4}},coral:{beach:{shell:8},rocks:{clam:6}}};
function lootRoll(where,n){
  const md=(ISL_MOD[S.isl.type]||{})[where]||{};
  const tab=LOOT[where].map(([k,w])=>[k,Math.max(0,(typeof w==='function'?w(S):w)+(md[k]||0))]).filter(x=>x[1]>0);
  const tot=tab.reduce((a,x)=>a+x[1],0);const got={};
  for(let i=0;i<Math.max(1,n);i++){let r=R()*tot;for(const [k,w] of tab){r-=w;if(r<=0){got[k]=(got[k]||0)+(['wood','leaf','branch','stone','vine','coconut'].includes(k)?ri(1,2):1);break;}}}
  for(const k in got)add(k,got[k]);
  return Object.entries(got).map(([k,n])=>`${ITEMS[k].n}×${n}`).join('、')||'なし';
}
function lightFire(){
  if(S.fire>0)return feedFire()||'もう火は燃えている。';
  if(WEATHER[S.weather].rain&&!(S.found.cave||S.b.shelter>=2))return '雨で、火をおこせる乾いた場所がない。';
  if(!hasTinder()||!hasFuel())return '火口（ヤシの繊維）と燃料（枯れ枝2か流木1）が必要だ。';
  useTinder();
  const m=fireMethod();info('fire');xp('fire');
  if(m.id==='lighter')S.lighter--;
  if(m.id==='friction'||m.id==='bow')S.ember=Math.min(100,(S.ember||0)+m.gain);
  if(chance(m.p)||S.ember>=100){useFuel();xp('fire');S.ember=0;S.fire=4;mod({morale:12});if(!S.firstFire){S.firstFire=S.day;log('火をおこした');}return `${m.n}で火がついた！ 炎を見ると、生きている気がした。`;}
  mod({morale:-2});
  return `${m.n}で火をおこそうとしたが、煙が出ただけだった（火口だけ使った）。<br>でも、コツはつかめてきた（火種 ${S.ember}％）。${m.id==='friction'?'<br><b>ヒント：</b>弓ギリ式（枯れ枝2・ツル1）を作れば、ずっとつきやすい。晴れた昼なら、水を入れたペットボトルをレンズにする手もある。':''}`;
}
const hasTinder=()=>has('fiber');
const hasFuel=()=>has('branch',2)||has('wood');
function useTinder(){add('fiber',-1);}
function useFuel(){if(has('branch',2))add('branch',-2);else add('wood',-1);}
function feedFire(){
  if(S.fire<=0)return '';
  if(S.fire>=10)return '火はもう十分に大きい。';
  if(has('wood')){add('wood',-1);S.fire=Math.min(10,S.fire+3);return '流木をくべた。火が大きくなった。';}
  if(has('branch')){add('branch',-1);S.fire=Math.min(10,S.fire+1);return '枯れ枝をくべた。';}
  return '';
}
function fireMethod(){
  const sunny=['sun','hot'].includes(S.weather)&&S.phase==='day'&&S.slot===1;
  const wet=WEATHER[S.weather].rain?.15:0;
  if(S.lighter>0)return {id:'lighter',n:'ライター',p:.9};
  if(sunny&&has('bottle')&&S.stock+S.raw>=.3)return {id:'lens',n:'ペットボトルのレンズ',p:.75};
  const L=(lv('fire')-1);
  if(has('bow'))return {id:'bow',n:'弓ギリ式',p:.35+L*.06+(B().fire||0)+(S.morale>50?.1:0)-wet,gain:50+L*5};
  return {id:'friction',n:'木をこすり合わせる',p:.1+L*.06+(B().fire||0)*.5,gain:34+L*5};
}
function raftOut(){
  const p=.18+(S.raftBonus||0)+(S.stock>=4?.15:0)+((S.inv.smoked||0)+(S.inv.coconut||0)+(S.inv.banana||0)>=3?.1:0)+(S.weather==='sun'||S.weather==='cloud'?.08:-.1)+(B().id==='fisher'?.15:0);
  S.queue.push({tag:'出航',tx:`いかだを波打ち際に押し出す。持っている水は${S.stock.toFixed(1)}L。<br>近くの島や航路にたどり着ける保証はない。`,ops:[
   {t:'出航する',f:()=>{if(chance(p)){S.rescueBy='raft';S.queue=[];S.pendingEnd='rescue';return '3日目の朝、漁船の網が見えた——助かった！';}if(chance(.4)){S.b.raft=0;hurt(40,'sea');S.stock=0;return '高波でいかだが砕け、なんとか島に泳ぎ戻った。';}S.deathCause='sea';S.hp=0;S.pendingEnd='dead';return 'いかだは、潮に流されていった。';}},
   {t:'やめておく',f:()=>'まだ、そのときではない。'}]});
  render();
}

// ---------------- その場でできること（時間を使わない） ----------------
function drink(){
  if(S.stock>0){const v=Math.min(S.stock,.5);S.stock-=v;S.water=clamp(S.water+v*L2P*2,0,100);S.stats.drank+=v;toast(`水を${v.toFixed(1)}L飲んだ`);}
  else if(S.raw>0){const v=Math.min(S.raw,.5);S.raw-=v;S.water=clamp(S.water+v*L2P*2,0,100);S.stats.drank+=v;if(chance(.25)&&!S.sick){S.sick={type:'diarrhea',days:2};S.stats.sick++;toast('生水を飲んだあと、お腹をこわした');info('boil');render();return;}toast(`生水を${v.toFixed(1)}L飲んだ`);}
  else{toast('飲める水がない');}
  render();
}
function seaDrink(){S.water=clamp(S.water-10,0,100);hurt(4,'dehydration');info('sea');toast('海水を飲んだ。のどの渇きは、むしろひどくなった');if(S.hp<=0)return die();render();}
function eat(k,cooked,quiet){
  const F=FOOD[k];if(!F||!has(k))return;
  if(k==='coconut'&&!hasCutter()&&chance(.5)){toast('殻が固くて割れなかった');return;}
  add(k,-1);S.stats.ate++;
  let msg=`${ITEMS[k].n}を${cooked?'焼いて':''}食べた。`;
  S.food=clamp(S.food+F.f*(cooked?1.2:1),0,100);if(F.w)S.water=clamp(S.water+F.w,0,100);
  if(k==='coconut'){info('coco');if((S.cocoToday=(S.cocoToday||0)+1)>4&&chance(.4)){S.sick={type:'diarrhea',days:1};msg+='食べすぎて、お腹がゆるくなった。';}}
  if(F.cook&&!cooked&&chance(F.raw*(1-(B().food||0)))){S.sick={type:'diarrhea',days:2};S.stats.sick++;msg+='生で食べたせいか、お腹をこわした。';}
  if(k==='fish'&&chance((S.isl.type==='coral'?.1:.06)*(1-(B().fishTox||0)))){S.sick={type:'cig',days:4};S.stats.sick++;msg+='しばらくして、唇がしびれ、冷たいものが熱く感じる。シガテラ毒だ。';info('cig');}
  if(F.risk&&chance(F.risk*(1-(B().food||0))*(k==='fruit'&&S.pages.length>=3?.3:1))){const bad=k==='mushroom'?28:14;hurt(bad,'poison');S.sick={type:'fever',days:2};msg+='ひどい吐き気。毒があったようだ。';}
  if(k==='seaweed')info('sea');
  if(k==='herb'){if(S.sick&&S.sick.type==='fever'&&chance(.7)){S.sick=null;msg='薬草を煎じて飲んだ。熱が引いていく。';}else msg='薬草をかじった。苦い。';}
  mod({morale:cooked?4:1});
  if(quiet){if(msg.length>12)S.nightNotes.push(msg.replace(/^.*?食べた。/,''));return;}
  toast(msg);if(S.hp<=0)return die();render();
}
function boilAll(){if(!canBoil()||S.raw<=0)return false;const v=S.raw;S.raw=0;S.stock+=v;info('boil');return v;}
function treat(){
  if(!S.wound)return;
  if(has('bandage')){add('bandage',-1);S.wound.clean=true;if(S.wound.inf&&chance(.8))S.wound.inf=false;S.wound.days=Math.max(1,S.wound.days-1);return;}
  if(S.stock>=.2){S.stock-=.2;S.wound.clean=true;if(S.wound.inf&&chance(.4+(B().med||0)))S.wound.inf=false;}
  else{S.wound.clean=chance(.6);}
}
function craftDo(r){
  for(const k in r.need)if(!(r.keep||[]).includes(k))add(k,-r.need[k]);
  if(r.give)add(r.give);else S.b[r.b]=r.lv;
  S.stats.crafted++;log(`${r.n}を作った`);
  if(r.id==='sos')info('sos');if(r.id==='still')info('still');
  xp('craft');
  if(chance((B().craft||0)+(lv('craft')-1)*.08)){const k=Object.keys(r.need)[0];add(k,1);S.nightNotes.push('手際よく作れて、材料が少し余った。');}
}
function craft(id){
  const r=RECIPES.find(x=>x.id===id);if(!canCraft(r)||S.phase!=='day')return;
  S.loc='camp';craftDo(r);
  document.querySelectorAll('.ov').forEach(o=>o.remove());
  S.lastRes=`${r.n}を作った。`;(S.dayRes=S.dayRes||[]).push(`${SLOTS[S.slot]}｜${r.n}を作った`);
  advance(1);
}
function nearRecipes(){
  return RECIPES.filter(r=>!canCraft(r)&&!(r.b&&S.b[r.b]>=r.lv)&&!(r.req!=null&&S.b[r.b]!==r.req)&&!(r.give&&has(r.give))&&!(r.id==='oknife'&&!has('obsidian')))
   .map(r=>({r,miss:Object.entries(r.need).filter(([k,n])=>!has(k,n)).map(([k,n])=>[k,n-(S.inv[k]||0)]),tool:r.tool&&!hasCutter()}))
   .filter(x=>!x.tool&&x.miss.length===1&&x.miss[0][1]<=2).sort((a,b)=>a.miss[0][1]-b.miss[0][1]);
}
function canCraft(r){
  if(r.tool&&!hasCutter())return false;
  if(r.req!=null&&S.b[r.b]!==r.req)return false;
  if(r.b&&S.b[r.b]>=r.lv)return false;
  for(const k in r.need)if(!has(k,r.need[k]))return false;
  return true;
}

// ---------------- 終わり ----------------
const DEATH={dehydration:'脱水症',starvation:'飢え',cold:'低体温症',heat:'熱中症',sick:'病気',infection:'傷の感染症',shark:'サメに襲われて',poison:'毒にあたって',sea:'海で消息を絶った',wound:'大けが'};
function die(){if(S.ended)return;endGame('dead');}
const TITLES=[
 {id:'rescue_air',n:'空からの救助',d:'飛行機に見つけてもらった',end:1,c:e=>e==='rescue'&&S.rescueBy==='air'},
 {id:'rescue_ship',n:'海からの救助',d:'船に見つけてもらった',end:1,c:e=>e==='rescue'&&S.rescueBy==='ship'},
 {id:'raft',n:'自力で脱出',d:'いかだで海を渡りきった',end:1,c:e=>e==='rescue'&&S.rescueBy==='raft'},
 {id:'survive',n:'30日の生還者',d:'30日間を生き抜いた',end:1,c:e=>e==='survive'},
 {id:'dry',n:'渇き',d:'脱水で力尽きた',end:1,c:e=>e==='dead'&&S.deathCause==='dehydration'},
 {id:'cold',n:'南の島の凍え',d:'低体温症で力尽きた',end:1,c:e=>e==='dead'&&S.deathCause==='cold'},
 {id:'poison',n:'食べてはいけなかった',d:'毒にあたって力尽きた',end:1,c:e=>e==='dead'&&S.deathCause==='poison'},
 {id:'shark',n:'海の底へ',d:'サメに襲われた',end:1,c:e=>e==='dead'&&S.deathCause==='shark'},
 {id:'sea',n:'潮の彼方',d:'いかだで海に消えた',end:1,c:e=>e==='dead'&&S.deathCause==='sea'},
 {id:'day1',n:'最初の夜を越えられず',d:'2日目を迎えられなかった',end:1,c:e=>e==='dead'&&S.day<=1},
 {id:'any',n:'島の記憶',d:'無人島で最期を迎えた',end:1,c:e=>e==='dead'},
 {id:'nagumo',n:'南雲の航路',d:'手記をすべて読み、いかだで海を渡った',c:e=>e==='rescue'&&S.rescueBy==='raft'&&S.pages.length>=8},
 {id:'reader',n:'手記を読み解いた',d:'南雲の手記をすべて見つけた',c:()=>S.pages.length>=8},
 {id:'dog',n:'相棒',d:'犬といっしょに生きた',c:()=>!!S.dog},
 {id:'master',n:'島の達人',d:'どれかの技能がレベル5になった',c:()=>Object.keys(SKILLS).some(k=>lv(k)>=5)},
 {id:'early',n:'3日目の奇跡',d:'5日以内に救助された',c:e=>e==='rescue'&&S.day<=5},
 {id:'explorer',n:'島のすみずみまで',d:'島をすべて探検した',c:()=>S.found.ne&&S.found.w},
 {id:'fisher',n:'海の狩人',d:'魚を15匹以上とった',c:()=>S.stats.fish>=15},
 {id:'builder',n:'島の建築家',d:'高床の小屋を建てた',c:()=>S.b.shelter>=3},
];
function endGame(kind){
  if(S.ended)return;S.ended=kind;
  const got=TITLES.filter(t=>t.c(kind));const main=got.find(t=>t.id==='nagumo')||(kind==='rescue'&&got.find(t=>t.id==='early'))||got.find(t=>t.end)||got[0];
  got.forEach(t=>META.titles[t.id]=1);META.runs++;if(S.seed){const k=String(S.seed);META.daily[k]=Math.max(META.daily[k]||0,kind==='dead'?S.day:31);}if(kind!=='dead')META.best=Math.max(META.best,S.day);saveMeta();
  try{localStorage.removeItem(SAVE);}catch(e){}
  S.endTitle=main;S.endGot=got;
  if(typeof showEnd==='function')showEnd();
}
