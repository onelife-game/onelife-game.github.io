// =====================================================================
// 漂流30日 本体 ― 昼は島を歩き、夜は焚き火で決める
// =====================================================================
const $=s=>document.querySelector(s);
const R=Math.random,chance=p=>R()<p,pick=a=>a[Math.floor(R()*a.length)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ri=(a,b)=>a+Math.floor(R()*(b-a+1));
const SAVE='drift30-save2',METAK='drift30-meta';
let S=null,META={best:0,runs:0,titles:{}};
try{META=Object.assign(META,JSON.parse(localStorage.getItem(METAK)||'{}'));}catch(e){}
const saveMeta=()=>{try{localStorage.setItem(METAK,JSON.stringify(META));}catch(e){}};
const save=()=>{try{if(S&&!S.ended)localStorage.setItem(SAVE,JSON.stringify(S));}catch(e){}};
const L2P=12; // 1リットル＝水分12ポイント

// ---------------- はじまり ----------------
function newGame(){
  const back=pick(BACKS),cause=pick(CAUSES),sex=chance(.5)?'M':'F';
  const isl={spring:chance(.6),cave:chance(.6),coconut:chance(.85),wreck:chance(.35),turtle:chance(.4)};
  const st=START_ITEMS.slice().sort(()=>R()-.5).slice(0,ri(1,3));
  const inv={};st.forEach(([k,n])=>inv[k]=(inv[k]||0)+n);
  S={day:1,slot:0,phase:'day',hp:100+(back.hp||0),hpMax:100+(back.hp||0),water:80,food:80,morale:70,
    sick:null,wound:null,wet:true,inv,lighter:inv.lighter?3:0,battery:inv.phone?34:0,
    stock:0,raw:0,fire:0,b:{shelter:0,catcher:0,catcherLeaf:0,still:0,sos:0,beacon:0,raft:0},
    loc:'camp',sel:'camp',weather:'sun',stormLeft:0,isl,found:{},explore:{jungle:0,beach:0,ne:0,w:0},
    back:back.id,cause:cause.id,sex,today:{},plan:null,cards:null,pickCard:null,nightNotes:[],
    log:[],notes:[],queue:[],ended:null,seen:{},stats:{drank:0,ate:0,fish:0,crafted:0,sick:0},deathCause:null,firstFire:null};
  if(inv.bottle){S.stock=.3;}
  S.queue.push({tag:'漂着',tx:`気がつくと、砂浜にうつ伏せで倒れていた。<br>${cause.n}——そこまでは覚えている。${cause.t}<br><br>あなたは<b>${back.n}</b>。${back.d}。<br>ポケットに残っていたのは、${Object.keys(inv).map(k=>ITEMS[k].n).join('、')}。<br><br>見渡すかぎり、海と、ヤシの木と、森。人の気配はない。`,
    ops:[{t:'まず、生き延びることを考える',f:()=>{info('three');return '昼は島を歩いて、ものを集める。夜は焚き火のそばで、明日に備える。まずは水だ。';}}]});
  log('無人島に漂着した');save();
}
const B=()=>BACKS.find(b=>b.id===S.back),CA=()=>CAUSES.find(c=>c.id===S.cause);
const has=(k,n=1)=>(S.inv[k]||0)>=n;
function add(k,n=1){S.inv[k]=(S.inv[k]||0)+n;if(S.inv[k]<=0)delete S.inv[k];if(n>0&&S.phase==='day')S.today[k]=(S.today[k]||0)+n;}
function log(t){S.log.push({d:S.day,s:S.slot,t});}
function note(t){S.notes.push(t);}
function info(k){S.seen[k]=1;}
function mod(o){for(const k in o){if(k==='hp')S.hp=clamp(S.hp+o[k],0,S.hpMax);else S[k]=clamp(S[k]+o[k],0,100);}}
const cap=()=>(S.inv.bottle||0)*1.5+(S.b.catcher?6:0)+(S.inv.bamboocup||0)*.5+(S.inv.can||0)*.3+(S.inv.bag||0)*.5;
const hasCutter=()=>has('knife')||has('multitool');
const canBoil=()=>S.fire>0&&(has('can')||has('bamboocup'));
const inShelter=()=>S.b.shelter>0||S.found.cave;
const shelterLv=()=>Math.max(S.b.shelter,S.found.cave?2:0);
// 地図に出ている場所
function places(){
  const p=['camp','rocks','jungle','hill'];
  p.push(S.found.ne?(S.isl.spring?'spring':'dry'):'ne');
  p.push(S.found.w?(S.isl.cave?'cave':'cliff'):'w');
  return p;
}

// ---------------- 時間の経過 ----------------
function slotDrain(effort){
  const w=WEATHER[S.weather];let loss=[3,6,3,3][S.slot];
  if(S.slot===1)loss+=w.heat===2?6:w.heat===1?2:0;
  if(S.slot===1&&effort===0&&inShelter())loss-=3;
  loss+=effort===2?3:effort===1?1.5:0;
  if(S.sick&&S.sick.type==='diarrhea')loss*=2;
  if(B().water)loss*=1-B().water;
  S.water=clamp(S.water-loss,0,100);
  S.food=clamp(S.food-(effort===2?5:4),0,100);
  if(S.water<=0)hurt(18,'dehydration');else if(S.water<15)hurt(6,'dehydration');
  if(S.food<=0){hurt(2,'starvation');S.morale=clamp(S.morale-2,0,100);}
  if(S.slot===1&&w.heat===2&&effort===2&&S.water<45){if(chance(.35)){hurt(14,'heat');note('目の前が白くなった。熱中症だ。');}}
  if(S.sick){hurt(S.sick.type==='cig'?5:S.sick.type==='fever'?3:2,'sick');}
  if(S.wound&&S.wound.inf)hurt(4,'infection');
  if(S.water>40&&S.food>25&&!S.sick&&!(S.wound&&S.wound.inf))S.hp=clamp(S.hp+2,0,S.hpMax);
  if(S.fire>0)S.fire--;
}
function hurt(n,cause){S.hp=clamp(S.hp-n,0,S.hpMax);if(S.hp<=0&&!S.deathCause)S.deathCause=cause;}
function rainCollect(){
  const w=WEATHER[S.weather];if(!w.rain)return;
  let got=0;const c=cap();
  if(S.b.catcher)got+=w.rain===2?4:2.5;
  if(S.b.catcherLeaf)got+=w.rain===2?1.2:.8;
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
  if(LOCS[S.loc].far>=2){
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
  if(S.fire>0&&has('wood'))c.push({id:'feed',n:'火を強める',ic:'fire',from:'流木',d:`朝まで火が消えない。${w.rain?'雨の寒さもやわらぐ':'夜の冷えを防ぐ'}`,tag:w.rain?'雨に強い':'',wt:w.rain?7.5:3,f:()=>{add('wood',-1);S.fire=5;S.fedTonight=true;return '流木を足して、火を大きくした。';}});
  if(S.fire<=0&&has('fiber')&&has('branch',2))c.push({id:'light',n:'火をおこす',ic:'fire',from:'繊維・枯れ枝',d:S.lighter>0?`ライター（あと${S.lighter}回）を使う`:has('bow')?'弓ギリ式で火をおこす':'木をこすり合わせる。成功しにくい',tag:'',wt:7,f:()=>lightFire()});
  if(false)c.push({id:'boil',n:'生水を煮沸',ic:'pot',from:'焚き火',d:`生水${S.raw.toFixed(1)}Lを1分間沸騰させて、安全な水にする`,tag:'',wt:5,f:()=>{const v=S.raw;S.raw=0;S.stock+=v;info('boil');return `生水${v.toFixed(1)}Lを煮沸した。`;}});
  const cook=Object.keys(FOOD).filter(k=>FOOD[k].cook&&has(k));
  if(S.fire>0&&cook.length)c.push({id:'cook',n:'焼いて食べる',ic:cook.includes('fish')?'fish':'crab',from:cook.map(k=>ITEMS[k].n).slice(0,2).join('・'),d:'火を通せば、お腹をこわしにくい。満腹まで食べる',tag:'',wt:4,f:()=>{let n=0;for(const k of cook){while(has(k)&&S.food<92){eat(k,true,true);n++;}}return n?`焚き火で${n}つ焼いて食べた。`:'お腹はいっぱいだった。';}});
  if(S.wound)c.push({id:'treat',n:'傷の手当て',ic:'bandage',from:'ケガ',d:S.stock>=.2?'きれいな水で傷を洗う':'水がないので海水で洗う',tag:S.wound.inf?'化膿している':'',wt:S.wound.inf?9:7.2,f:()=>{treat();if(S.wound){S.wound.clean=true;S.wound.days=Math.max(1,S.wound.days-2);if(S.wound.inf&&chance(.5))S.wound.inf=false;}return '傷を洗い、葉で覆ってしっかり手当てした。';}});
  if(w.rain&&shelterLv()<2&&has('leaf',2))c.push({id:'guard',n:'雨よけを張る',ic:'leaf',from:'ヤシの葉',d:'今夜だけ、寝床の上に葉を重ねて雨をしのぐ',tag:'雨に強い',wt:8,f:()=>{add('leaf',-2);S.guardTonight=true;return 'ヤシの葉を重ねて、雨よけを張った。';}});
  RECIPES.filter(r=>canCraft(r)).forEach(r=>{const k0=Object.keys(r.need)[0];
    c.push({id:'craft_'+r.id,n:r.n.replace(/（.*?）/,''),ic:r.b==='sos'||r.id==='knife'?'stone':r.b==='shelter'?'leaf':r.id==='bamboocup'?'canteen':['spear','rod','raft'].includes(r.id)?'bamboo':'tool',from:Object.keys(r.need).map(k=>ITEMS[k].n).slice(0,2).join('・'),d:r.d,tag:fromToday(r.need)?'今日の収穫':'',wt:fromToday(r.need)?6:2.5,f:()=>{craftDo(r);return `焚き火の明かりで、${r.n}を作った。`;}});});
  if(S.fire>0)c.push({id:'watch',n:'夜の海を見張る',ic:'eye',from:'焚き火',d:'船の明かりが見えたら、火で合図する。寝不足になる',tag:'',wt:2,f:()=>{hurt(3,'sick');mod({morale:-2});if(chance(.05+searchP()*.6)){const p=Math.min(.7,.25+(S.b.beacon?.25:0));if(chance(p)){S.rescueBy='ship';S.pendingEnd='rescue';return '水平線に、船の明かりが見えた。火を振って叫んだ——明かりが、こちらに向きを変えた！';}mod({morale:-10});return '船の明かりが見えた。火を振ったが、明かりは遠ざかっていった。';}return '朝まで海を見ていたが、何も見えなかった。';}});
  const pl=places().filter(p=>p!=='camp');
  c.push({id:'plan',n:'明日の計画',ic:'map',from:'地図',d:'夜明けとともに出発し、朝のうちに多く集める',tag:!S.found.ne?'水の音の方へ？':'',wt:3,plan:true});
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
  if(c){if(c.plan){S.plan=planLoc;msg=`明日は夜明けとともに「${LOCS[planLoc].n.replace('？ ','')}」へ向かうことにした。`;}else msg=c.f()||'';}
  S.cards=null;S.pickCard=null;
  if(msg)S.nightNotes.push(msg);
  if(S.pendingEnd){const k=S.pendingEnd;S.pendingEnd=null;return endGame(k);}
  if(S.hp<=0)return die();
  night();
}
function night(){
  const w=WEATHER[S.weather];let msg=S.nightNotes.splice(0);
  const sh=Math.max(shelterLv(),S.guardTonight?Math.min(2,shelterLv()+1):0);
  const fireN=S.fire>0,fed=!!S.fedTonight;
  const ember=fireN&&!fed&&!w.rain&&chance(.5);
  if(fireN&&!fed)msg.push(ember?'火は小さくなったが、熾火（おきび）が残っていた。':'火は夜のうちに消えた。');
  if(w.rain){
    if(sh>=2){msg.push('雨音を聞きながら、乾いた場所で眠れた。');}
    else{let d=w.rain===2?(sh===1?12:22):(sh===1?5:10);if(fed)d=Math.round(d*.5);else if(fireN)d=Math.round(d*.75);hurt(d,'cold');S.wet=true;mod({morale:-10});msg.push(w.rain===2?'嵐の夜。屋根が吹き飛ばされそうになり、全身ずぶ濡れで朝を待った。':'雨に打たれ、濡れたまま震えて眠った。');info('cold');
      if(chance(fed?.12:fireN?.18:.3)&&!S.sick){S.sick={type:'fever',days:3};S.stats.sick++;msg.push('体が熱い。熱が出た。');}}
  }else{
    if(sh===0){hurt(fireN?0:4,'cold');mod({morale:fireN?-2:-6});msg.push(fireN?'焚き火のそばで、砂の上に横になった。':'砂の上で、虫に刺されながら眠った。夜は思ったより冷える。');}
    else{S.hp=clamp(S.hp+(sh>=3?10:6),0,S.hpMax);mod({morale:sh>=3?4:1});msg.push(sh>=3?'高床の小屋でぐっすり眠った。':'寝床で体を休めた。');}
    S.wet=false;
  }
  if(chance(.18)&&(S.inv.fish||S.inv.crab||S.inv.coconut||S.inv.egg)){const k=['fish','crab','egg','coconut'].find(x=>S.inv[x]);add(k,-1);msg.push(`夜中、ヤシガニに${ITEMS[k].n}を持っていかれた。`);}
  else if(chance(.1)){mod({morale:-8});msg.push('家族の夢を見た。目が覚めると、波の音だけがした。');}
  if(S.b.still){const g=Math.min(.4,Math.max(0,cap()-S.stock-S.raw));if(g>0){S.stock+=g;msg.push(`蒸留器に${g.toFixed(2)}Lの真水がたまっていた。`);}}
  S.morale=clamp(S.morale-4,0,100);
  slotDrain(0);
  S.fire=fed?3:ember?1:0;S.fedTonight=false;S.guardTonight=false;
  if(S.hp<=0){S.notes.push(...msg);return die();}
  if(S.sick){S.sick.days--;if(S.sick.days<=0){msg.push('ようやく体調が戻った。');S.sick=null;}}
  if(S.wound){S.wound.days--;if(!S.wound.clean&&!S.wound.inf&&chance(.3)){S.wound.inf=true;S.wound.days=Math.max(S.wound.days,4);msg.push('傷が赤く腫れてきた。化膿している。きれいな水で洗わないと。');}if(S.wound.days<=0){S.wound=null;msg.push('傷がふさがった。');}}
  S.day++;S.slot=0;S.phase='day';S.cocoToday=0;S.today={};S.dayRes=[];S.lastRes='';
  if(S.day>30){S.notes.push(...msg);return endGame('survive');}
  rollWeather();
  S.morning=msg;
  if(S.plan){S.sel=S.plan;}else S.sel='camp';
  morningEvents();
  if(S.hp<=0)return die();
  save();render();
}
function rollWeather(){
  if(S.stormLeft>0){S.stormLeft--;S.weather='storm';return;}
  const r=R();S.weather=r<.3?'sun':r<.42?'hot':r<.62?'cloud':r<.93?'rain':'storm';
  if(S.weather==='storm'){S.stormLeft=chance(.4)?1:0;}
}
// ---------------- 出来事 ----------------
function searchP(){const c=CA();const base=.06;return base+(S.day<=c.search?.16*(1-S.day/(c.search+4)):0);}
function slotEvents(){
  const air=chance(searchP()/2.2),ship=chance(.035);
  if(air)S.queue.push(evCraft('air'));
  else if(ship&&['camp','hill','rocks'].includes(S.loc))S.queue.push(evCraft('ship'));
  else if(chance(.07))S.queue.push(pick(minorEvents()));
}
function morningEvents(){
  if(S.weather==='storm'&&S.b.shelter>0&&S.b.shelter<3&&chance(.5)){S.b.shelter--;S.morning.push('嵐で寝床の屋根が吹き飛んだ。');}
  if(S.weather==='storm'){S.fire=0;}
  if(S.day===2)S.queue.push({tag:'2日目',tx:'のどが渇いて目が覚めた。昨日より日差しが痛い。<br>水がなければ、人は3日ほどしかもたない。',ops:[{t:'水を探すことを最優先にする',f:()=>{info('three');info('water');return '昼の暑い時間に遠くまで歩けば、汗で水分が逃げていく。';}}]});
  if(S.day===5&&S.cause==='fishing')S.queue.push({tag:'捜索',tx:'水平線の向こうに、一瞬だけ船影が見えた気がした。<br>……捜索は、もう打ち切られたのかもしれない。',ops:[{t:'信じて待つ',f:()=>{mod({morale:-6});return '自分で何とかするしかない。';}}]});
  if(S.day===10)S.queue.push({tag:'10日目',tx:'10日が過ぎた。流木に刻んだ線が、10本になった。',ops:[{t:'あと20日。必ず生きて帰る',f:()=>{mod({morale:8});return '線の横に、もう一本、深く刻んだ。';}},{t:'もう誰も来ないのかもしれない',f:()=>{mod({morale:-10});return '波打ち際に座り込んだ。';}}]});
  if(S.day===20)S.queue.push({tag:'20日目',tx:'20日目。438日間、太平洋を漂流して生き延びた漁師の話を思い出した。',ops:[{t:'あの人に比べれば',f:()=>{mod({morale:10});info('alvarenga');return '生の魚とウミガメと雨水で、彼は生き延びた。';}}]});
  if(chance(.2)&&S.weather!=='storm')S.queue.push(pick(minorEvents()));
  if(S.prevStorm&&chance(.7)){S.queue.push({tag:'嵐のあと',tx:'嵐の翌朝、浜にいろいろなものが打ち上げられている。',ops:[{t:'拾いに行く',f:()=>{const g=lootRoll('beach',3);return '拾ったもの：'+g;}}]});}
  S.prevStorm=S.weather==='storm';
}
function minorEvents(){
  const a=[
   {tag:'漂着物',tx:'波打ち際に、何かが光っている。',ops:[{t:'拾う',f:()=>{const k=pick(['can','bottle','bottle','line','rope','bag','tarp']);add(k);return `${ITEMS[k].n}を拾った。`;}},{t:'無視する',f:()=>'気のせいだ、と思うことにした。'}]},
   {tag:'ムカデ',tx:'足元をなにかが這った。大きなムカデだ。',ops:[{t:'払いのける',f:()=>{if(chance(.4)){hurt(8,'wound');mod({morale:-4});return '噛まれた。焼けるように痛い。';}return 'うまく払いのけた。';}},{t:'じっとして動かない',f:()=>'ムカデは去っていった。'}]},
   {tag:'海鳥',tx:'海鳥の群れが、岩場の一角に集まっている。巣があるのかもしれない。',ops:[{t:'卵を探す',f:()=>{if(chance(.5)){add('egg',2);return '卵を2つ見つけた。';}hurt(4,'wound');return '親鳥につつかれた。';}},{t:'見ているだけにする',f:()=>{mod({morale:3});return '鳥の声が、少しだけ寂しさを紛らわせた。';}}]},
   {tag:'声',tx:'森の奥から、人の声のようなものが聞こえた気がした。',ops:[{t:'叫んで返事をする',f:()=>{mod({morale:-6});return '返ってきたのは、鳥の鳴き声だけだった。';}},{t:'疲れているせいだ',f:()=>{mod({morale:-2});return '耳をふさいだ。';}}]},
  ];
  if(S.isl.turtle)a.push({tag:'ウミガメ',tx:'夜明けの浜に、ウミガメの足跡が続いている。',ops:[{t:'跡をたどって卵を掘る',f:()=>{add('egg',ri(2,5));return 'ウミガメの卵を見つけた。';}},{t:'そっとしておく',f:()=>{mod({morale:4});return '命が続いていく浜だ。';}}]});
  return a;
}
function signalPower(kind){
  let p=0,how=[];
  if(kind==='air'){if(S.b.sos){p+=S.b.sos===2?.6:.38;how.push('SOS文字');}}
  if(S.b.beacon&&(S.fire>0||S.lighter>0)&&['camp','hill'].includes(S.loc)){p+=kind==='ship'?.55:.35;how.push('のろし');}
  else if(S.fire>0){p+=.15;how.push('焚き火の煙');}
  if(has('phone')&&S.battery>0){p+=.12;how.push('スマホの画面の反射');}
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
 fire:{n:'火をおこす',d:'繊維1と枯れ枝2が必要',e:1,c:()=>S.fire<=0},
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
};
function doAct(id){
  if(S.queue.length||S.ended||S.phase!=='day')return;
  const loc=S.sel;S.loc=loc;
  const planned=S.plan&&S.plan===loc&&S.slot===0;if(S.slot===0)S.plan=null;
  const bonus=planned?1:0;
  let res='';const a=ACTS[id];
  const tired=S.food<15||S.morale<10;
  switch(id){
   case 'beach':{const n=ri(2,3)-(S.explore.beach>8?1:0)+bonus;res='拾ったもの：'+lootRoll('beach',n);S.explore.beach++;break;}
   case 'rocks':{res='見つけたもの：'+lootRoll('rocks',ri(2,3)+bonus);if(chance(.15)){woundUp();res+='<br>サンゴで足を切った。';}break;}
   case 'fish':{
     const p=(has('rod')?.6:has('spear')?.5:.12)+(B().fish||0)-(tired?.15:0)+bonus*.15;
     if(chance(p)){const n=has('rod')||has('spear')?ri(1,2):1;add('fish',n);S.stats.fish+=n;res=`魚が${n}匹とれた。`;}else res='一匹もとれなかった。'+(has('rod')||has('spear')?'':'素手では難しい。');
     if(has('spear')&&chance(.05)){S.queue.push({tag:'サメ',tx:'浅瀬で魚を突いていると、背びれが近づいてきた。',ops:[{t:'すぐに岸へ上がる',f:()=>{if(chance(.85)){info('shark');return '必死で岩に上がった。心臓が破れそうだ。';}hurt(35,'shark');woundUp();return 'ふくらはぎを噛まれた。';}},{t:'銛で威嚇する',f:()=>{if(chance(.6)){info('shark');return 'サメは興味をなくしたように去った。';}hurt(45,'shark');woundUp();return '銛ごと腕を持っていかれそうになった。';}}]});}
     break;}
   case 'jungle':{
     S.explore.jungle++;res='見つけたもの：'+lootRoll('jungle',ri(2,3)+bonus);
     if(S.isl.wreck&&!S.found.wreck&&S.explore.jungle>=4&&chance(.3)){S.found.wreck=true;log('古い難破船を見つけた');add('tarp');add('can',2);add('rope');res+='<br><b>森を抜けた先に、古い難破船が打ち上げられていた。</b>防水シート・空き缶・ロープを手に入れた。';}
     else if(!S.found.ne&&S.isl.spring&&chance(.3))res+='<br>北東の奥から、水の流れる音がした気がする。';
     if(chance(.1)){woundUp();res+='<br>枝で腕を切った。';}
     break;}
   case 'hill':{mod({morale:4});res=pick(['水平線を見渡した。何も見えない。','島の形がよくわかった。思ったより小さい。','遠くに雲がわいている。雨が来るかもしれない。']);
     if(chance(.12+searchP())){S.queue.push(evCraft(chance(.5)?'air':'ship'));}break;}
   case 'explore_ne':case 'explore_w':{
     const k=id==='explore_ne'?'ne':'w';S.explore[k]++;
     res='見つけたもの：'+lootRoll('jungle',ri(1,2));
     if(chance(.35+S.explore[k]*.2+bonus*.2)){S.found[k]=true;
       if(k==='ne'){if(S.isl.spring){log('湧き水を見つけた');res+='<br><b>岩の割れ目から、水が湧き出している！</b>';}else{log('涸れた沢を見つけた');res+='<br><b>沢を見つけた。……でも、水は涸れていた。</b>';}}
       else{if(S.isl.cave){log('洞窟を見つけた');res+='<br><b>崖のふもとに洞窟を見つけた。雨風をしのげそうだ。</b>';}else{log('西の崖にたどり着いた');res+='<br><b>崖に突き当たった。洞窟はなかった。</b>';}}
       S.sel=k==='ne'?(S.isl.spring?'spring':'dry'):(S.isl.cave?'cave':'cliff');S.loc=S.sel;
     }else res+='<br>道に迷い、引き返した。';
     if(chance(.12)){woundUp();res+='<br>とげで腕を切った。';}
     break;}
   case 'spring':{const room=Math.max(0,cap()-S.stock-S.raw);S.raw+=room;S.water=clamp(S.water+20,0,100);res=`湧き水を飲み、${room>0?room.toFixed(1)+'Lを汲んだ':'容器がないので、その場で飲めるだけ飲んだ'}。`;
     if(chance(.12)){S.sick={type:'diarrhea',days:2};S.stats.sick++;res+='<br>……しばらくして、お腹が痛くなってきた。';info('boil');}break;}
   case 'dry':{if(WEATHER[S.weather].rain||S.prevStorm){const room=Math.max(0,Math.min(1,cap()-S.stock-S.raw));S.raw+=room;S.water=clamp(S.water+10,0,100);res=`雨水が沢にたまっていた。${room>0?room.toFixed(1)+'L汲んだ。':'その場で飲んだ。'}`;}else res='見つけたもの：'+lootRoll('rocks',1)+'<br>沢に水はなかった。';break;}
   case 'cave':{if(!S.found.caveLoot){S.found.caveLoot=true;add('rope');add('can');res='洞窟の奥に、誰かが昔いた跡があった。ロープと空き缶を見つけた。';}else{res='見つけたもの：'+lootRoll('rocks',1);S.hp=clamp(S.hp+4,0,S.hpMax);res+='<br>ひんやりした洞窟で、少し休んだ。';}break;}
   case 'cliff':{add('stone',ri(3,5));if(chance(.4))add('shell');res='石をたくさん集めた。';break;}
   case 'fire':{res=lightFire();break;}
   case 'rest':{S.hp=clamp(S.hp+6,0,S.hpMax);mod({morale:5});res='日陰で体を休めた。';break;}
   case 'raft':{return raftOut();}
  }
  if(planned)res='夜明けとともに出発した。'+res;
  S.lastRes=res;(S.dayRes=S.dayRes||[]).push(`${SLOTS[S.slot]}｜${a.n}　${res.replace(/<br>/g,' ').replace(/<[^>]+>/g,'')}`);
  advance(Math.min(2,a.e+(LOCS[loc].far>=2&&S.slot===1&&WEATHER[S.weather].heat?1:0)));
}
function woundUp(){if(!S.wound){S.wound={days:4,clean:false,inf:false};}hurt(5,'wound');}
const LOOT={
 beach:[['wood',30],['coconut',S=>S.isl.coconut?18:4],['fiber',10],['shell',10],['bottle',6],['can',5],['rope',3],['line',3],['bag',4],['tarp',1.5],['stone',8],['egg',S=>S.isl.turtle?4:0]],
 rocks:[['crab',20],['clam',22],['seaweed',16],['stone',24],['shell',10]],
 jungle:[['leaf',26],['vine',20],['branch',22],['fiber',12],['bamboo',S=>hasCutter()?16:0],['coconut',S=>S.isl.coconut?20:3],['fruit',8],['mushroom',5],['crabbig',3]],
};
function lootRoll(where,n){
  const tab=LOOT[where].map(([k,w])=>[k,typeof w==='function'?w(S):w]).filter(x=>x[1]>0);
  const tot=tab.reduce((a,x)=>a+x[1],0);const got={};
  for(let i=0;i<Math.max(1,n);i++){let r=R()*tot;for(const [k,w] of tab){r-=w;if(r<=0){got[k]=(got[k]||0)+(['wood','leaf','branch','stone','vine'].includes(k)?ri(1,2):k==='coconut'?ri(1,3):1);break;}}}
  for(const k in got)add(k,got[k]);
  return Object.entries(got).map(([k,n])=>`${ITEMS[k].n}×${n}`).join('、')||'なし';
}
function lightFire(){
  if(S.fire>0){if(has('wood')){add('wood',-1);S.fire+=3;return '火に流木をくべた。';}return 'もう火は燃えている。';}
  if(WEATHER[S.weather].rain&&!(S.found.cave||S.b.shelter>=2))return '雨で、火をおこせる乾いた場所がない。';
  if(!has('fiber')||!has('branch',2))return '火口（ヤシの繊維）と枯れ枝が2本必要だ。';
  add('fiber',-1);add('branch',-2);
  let p=0,how='';
  if(S.lighter>0){S.lighter--;p=.9;how='ライター';}
  else if(has('bow')){p=.3+(B().fire||0)+(S.morale>50?.1:0)-(WEATHER[S.weather].rain?.15:0);how='弓ギリ式';}
  else{p=.06+(B().fire||0)*.5;how='木をこすり合わせる';}
  if(chance(p)){S.fire=S.phase==='night'?2:3;mod({morale:12});if(!S.firstFire){S.firstFire=S.day;log('火をおこした');}return `${how}で火がついた！ 炎を見ると、生きている気がした。`;}
  mod({morale:-4});return `${how}で火をおこそうとしたが、煙が出ただけだった。${how==='木をこすり合わせる'?'道具を作ったほうがいい。':''}`;
}
function raftOut(){
  const p=.18+(S.stock>=4?.15:0)+((S.inv.fish||0)+(S.inv.coconut||0)>=4?.07:0)+(S.weather==='sun'||S.weather==='cloud'?.08:-.1)+(B().id==='fisher'?.15:0);
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
  if(k==='fish'&&chance(.06*(1-(B().fishTox||0)))){S.sick={type:'cig',days:4};S.stats.sick++;msg+='しばらくして、唇がしびれ、冷たいものが熱く感じる。シガテラ毒だ。';info('cig');}
  if(F.risk&&chance(F.risk*(1-(B().food||0)))){const bad=k==='mushroom'?28:14;hurt(bad,'poison');S.sick={type:'fever',days:2};msg+='ひどい吐き気。毒があったようだ。';}
  if(k==='seaweed')info('sea');
  mod({morale:cooked?4:1});
  if(quiet){if(msg.length>12)S.nightNotes.push(msg.replace(/^.*?食べた。/,''));return;}
  toast(msg);if(S.hp<=0)return die();render();
}
function boilAll(){if(!canBoil()||S.raw<=0)return false;const v=S.raw;S.raw=0;S.stock+=v;info('boil');return v;}
function treat(){
  if(!S.wound)return;
  if(S.stock>=.2){S.stock-=.2;S.wound.clean=true;if(S.wound.inf&&chance(.4+(B().med||0)))S.wound.inf=false;}
  else{S.wound.clean=chance(.6);}
}
function craftDo(r){
  for(const k in r.need)if(!(r.keep||[]).includes(k))add(k,-r.need[k]);
  if(r.give)add(r.give);else S.b[r.b]=r.lv;
  S.stats.crafted++;log(`${r.n}を作った`);
  if(r.id==='sos')info('sos');if(r.id==='still')info('still');
  if(B().craft&&chance(B().craft)){const k=Object.keys(r.need)[0];add(k,1);}
}
function craft(id){
  const r=RECIPES.find(x=>x.id===id);if(!canCraft(r)||S.phase!=='day')return;
  S.loc='camp';craftDo(r);
  document.querySelectorAll('.ov').forEach(o=>o.remove());
  S.lastRes=`${r.n}を作った。`;(S.dayRes=S.dayRes||[]).push(`${SLOTS[S.slot]}｜${r.n}を作った`);
  advance(1);
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
 {id:'early',n:'3日目の奇跡',d:'5日以内に救助された',c:e=>e==='rescue'&&S.day<=5},
 {id:'explorer',n:'島のすみずみまで',d:'島をすべて探検した',c:()=>S.found.ne&&S.found.w},
 {id:'fisher',n:'海の狩人',d:'魚を15匹以上とった',c:()=>S.stats.fish>=15},
 {id:'builder',n:'島の建築家',d:'高床の小屋を建てた',c:()=>S.b.shelter>=3},
];
function endGame(kind){
  if(S.ended)return;S.ended=kind;
  const got=TITLES.filter(t=>t.c(kind));const main=(kind==='rescue'&&got.find(t=>t.id==='early'))||got.find(t=>t.end)||got[0];
  got.forEach(t=>META.titles[t.id]=1);META.runs++;if(kind!=='dead')META.best=Math.max(META.best,S.day);saveMeta();
  try{localStorage.removeItem(SAVE);}catch(e){}
  S.endTitle=main;S.endGot=got;
  if(typeof showEnd==='function')showEnd();
}
