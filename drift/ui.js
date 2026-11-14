// =====================================================================
// 漂流30日 画面（昼：島マップ／夜：焚き火とカード）
// =====================================================================
const IMG='img/';
const ICONS=['page','meat','banana','herb','dog','smoked','obsidian','diary','bed','coconut','bamboo','wood','branch','leaf','vine','stone','fiber','fish','crab','crabbig','clam','shell','fruit','egg','canteen','fire','map','moon','pot','bandage','tool','eye'];
const ALIAS={oknife:'obsidian',knife:'tool',multitool:'tool',spear:'tool',rod:'tool',bow:'tool',bottle:'canteen',bamboocup:'canteen',can:'pot',seaweed:'leaf',mushroom:'fruit',rope:'vine',line:'vine',tarp:'leaf',bag:'pot',snack:'fruit',lighter:'fire',phone:'eye'};
const icon=(k,sz=32)=>(k=ICONS.includes(k)?k:ALIAS[k]||k,ICONS.includes(k))?`<img class="px" src="${IMG}i_${k}.png" width="${sz}" height="${sz}" alt="">`:`<span class="dot" style="width:${sz}px;height:${sz}px"></span>`;
const pct=(v,t)=>(v/t*100).toFixed(2)+'%';
function toast(t){const d=document.createElement('div');d.className='toast';d.innerHTML=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200);}
function sheet(title,html,btns,onOpen,noClose,cls){
  const ov=document.createElement('div');ov.className='ov '+(cls||'');
  ov.innerHTML=`<div class="sh"><div class="hd"><span>${title}</span>${noClose?'':'<button data-x aria-label="閉じる">閉じる</button>'}</div><div class="bd">${html}<div class="mb"></div></div></div>`;
  const mb=ov.querySelector('.mb');(btns||[]).forEach(b=>{const e=document.createElement('button');e.className='op '+(b.cls||'');e.innerHTML=b.t;e.disabled=!!b.dis;e.onclick=()=>b.f(ov);mb.appendChild(e);});
  if(!noClose){ov.querySelector('[data-x]').onclick=()=>ov.remove();ov.onclick=e=>{if(e.target===ov)ov.remove();};}
  document.body.appendChild(ov);if(onOpen)onOpen(ov);return ov;
}
const closeAll=()=>document.querySelectorAll('.ov').forEach(o=>o.remove());
function infoSheet(k){const I=INFO[k];if(!I)return;sheet(I.t,`<p>${I.b}</p><p class="src">出典：${I.s}</p>`);}
function show(id){['title','day','night'].forEach(x=>$('#'+x).classList.toggle('hidden',x!==id));}

// ---------------- 共通パーツ ----------------
const mcol=v=>v<20?'#FF7A6B':v<45?'#FFD866':'#7FD08A';
function metersHTML(){
  const m=[['水分',S.water],['満腹',S.food],['体力',S.hp/S.hpMax*100],['気力',S.morale]];
  return m.map(([n,v])=>`<div class="mt"><div class="mn"><span>${n}</span><b style="color:${mcol(v)}">${Math.round(v)}</b></div><div class="mb5">${[0,1,2,3,4].map(j=>`<i style="${j<Math.round(v/20)?`background:${mcol(v)}`:''}"></i>`).join('')}</div></div>`).join('');
}
function chipsHTML(){
  const c=[];if(S.sick)c.push({diarrhea:'下痢',fever:'発熱',cig:'シガテラ中毒'}[S.sick.type]);if(S.wound)c.push(S.wound.inf?'傷が化膿':'ケガ');if(S.wet)c.push('濡れている');if(S.water<20)c.push('ひどい渇き');if(S.food<15)c.push('空腹');
  return `<span class="wt">安全な水 <b>${S.stock.toFixed(1)}L</b>${S.raw>0?`・生水 ${S.raw.toFixed(1)}L`:''}</span>`+c.map(x=>`<span class="chip">${x}</span>`).join('');
}
const BAR=`<nav class="bar"><button data-b="drink">飲む</button><button data-b="eat">食べる</button><button data-b="inv">持ち物</button><button data-b="goal">目標</button></nav>`;
function bindBar(root){root.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{const k=b.dataset.b;if(k==='drink')drinkSheet();else if(k==='eat')eatSheet();else if(k==='inv')invSheet();else goalSheet();});}

// ---------------- 描画の入口 ----------------
function render(){
  if(!S)return;
  if(S.ended)return;
  if(S.phase==='night')renderNight();else renderDay();
  if(S.lvUp&&S.lvUp.length&&!S.queue.length){const t=S.lvUp.splice(0);setTimeout(()=>toastBig('<b>レベルアップ！</b><br>'+t.join('<br>')),400);}
  // 出来事
  if(S.queue.length&&!document.querySelector('.ov.evov'))showEvent();
  else if(!S.queue.length&&S.morning&&S.phase==='day'&&!document.querySelector('.ov'))showMorning();
}
function showEvent(){
  const e=S.queue[0];
  sheet(e.tag,`<div class="evtx">${e.tx}</div>`,e.ops.map((o,i)=>({t:o.t,f:ov=>{
    S.queue.shift();const r=o.f();ov.remove();
    if(S.pendingEnd){const k=S.pendingEnd;S.pendingEnd=null;if(r)S.lastRes=r;endGame(k);return;}
    if(S.hp<=0&&!S.ended){die();return;}
    if(r){S.lastRes=r;}
    save();render();if(r&&!S.queue.length)toastBig(r);
  }})),null,true,'evov');
}
function toastBig(t){const d=document.createElement('div');d.className='toast big';d.innerHTML=t;document.body.appendChild(d);setTimeout(()=>d.remove(),3200);}
function showMorning(){
  const m=S.morning;S.morning=null;
  sheet(`${S.day}日目の朝`,`<div class="wxline">${wxIcon()} 今日の天気：<b>${WEATHER[S.weather].n}</b>${S.weather==='hot'?'　昼は動くと汗で水分が大きく減る':WEATHER[S.weather].rain?'　雨水をためるチャンス。でも夜が冷える':''}</div>${m.map(x=>`<div class="nl">${x}</div>`).join('')}`,[{t:S.sel!=='camp'?`「${LOC(S.sel).n.replace('？ ','')}」へ出発する`:'島を歩く',cls:'yl',f:ov=>ov.remove()}]);
}
const wxIcon=()=>'';

// ---------------- 昼：島マップ ----------------
function renderDay(){
  show('day');
  const el=$('#day');
  const pl=places();
  const sel=pl.includes(S.sel)?S.sel:'camp';S.sel=sel;
  const L=LOC(sel);
  // 時間
  const track=['朝','昼','夕'].map((t,i)=>`<div class="tk ${i<S.slot?'done':i===S.slot?'now':''}">${t}${i<S.slot?' 済':''}</div>`).join('')+`<span class="arr">▸</span><div class="tk nt">夜 焚き火</div>`;
  // 地図の上のもの
  const spr=(src,x,y,w,h,cls='')=>`<img class="px spr ${cls}" src="${IMG}${src}.png" alt="" style="left:${pct(x,130)};top:${pct(y,110)};width:${pct(w,130)};height:${pct(h,110)}">`;
  let ov='';
  const T=S.isl.type||'coral';
  if(!S.found.ne)ov+=`<img class="px layer" src="${IMG}fog_ne_${T}.png" alt="">`;
  if(!S.found.w)ov+=`<img class="px layer" src="${IMG}fog_w_${T}.png" alt="">`;
  if(S.found.wreck)ov+=spr('wreck',43,6,12,7);
  [0,1,2].forEach(i=>{if(S.foundF[i])ov+=spr('f_'+S.feat[i],FSLOT[i].x-4,FSLOT[i].y-4,9,9);});
  const sh=S.b.shelter;if(sh)ov+=spr('sh'+sh,36,96-[0,7,9,12][sh],[0,10,12,14][sh],[0,7,9,12][sh]);
  ov+=spr(S.fire>0?'pit1':'pit0',49,90,5,5,S.fire>0?'flick':'');
  if(S.b.sos)ov+=spr('sos'+S.b.sos,55,93,12,6);
  if(S.b.beacon)ov+=spr('beacon',62,86,5,5);
  if(S.b.catcher||S.b.catcherLeaf)ov+=spr('catcher',29,89,6,4);
  if(S.b.raft)ov+=spr('raft',44,99,10,4);
  const P=LOC(S.loc);ov+=spr('player',P.x-3,P.y-9,7,10,'me');if(S.dog)ov+=spr('dog',P.x+3,P.y-3,6,4,'me');
  const labels=pl.map(p=>{const l=LOC(p);const below=p==='camp'||p==='wreck';const tx=l.x>108?'-88%':l.x<26?'-12%':'-50%';
    return `<button class="lab ${p===sel?'sel':''} ${l.fog?'fog':''}" data-p="${p}" style="left:${pct(l.x,130)};top:${pct(l.y+(below?7:-6),110)};transform:translate(${tx},${below?'0':'-100%'})">${l.n.replace('（キャンプ）','')}${p===S.loc?'<i>●</i>':''}</button>`;}).join('');
  const tint=S.slot===2?'dusk':S.slot===0?'dawn':'';
  const rain=WEATHER[S.weather].rain?`<div class="rain ${S.weather==='storm'?'hard':''}"></div>`:'';
  // 場所のカード
  const far=['キャンプのすぐそば','少し歩く','遠い'][L.far];
  const late=L.far>=2&&S.slot===2?'<div class="warn">夕方に遠くへ行くと、帰りは暗い道になる</div>':L.far>=2&&S.slot===1&&WEATHER[S.weather].heat?'<div class="warn">暑い昼に遠くまで歩くと、汗で水分が大きく減る</div>':'';
  const acts=L.acts.filter(a=>!ACTS[a].c||ACTS[a].c());
  const planned=S.plan&&S.plan===sel&&S.slot===0?'<div class="plan">計画どおり、夜明けに出発。朝の収穫が増える</div>':'';
  const res=S.lastRes?`<div class="res">${S.lastRes}</div>`:'';
  const harvest=Object.entries(S.today);
  const tip=S.day<=2&&sel==='camp'&&!S.firstFire?'<div class="tip"><b>まずは</b>：水（ヤシの実・雨水・湧き水）と火（火口になるヤシの繊維＋燃料になる枯れ枝か流木）。夜は焚き火のそばで、拾ったものから道具を作れる。</div>':'';
  el.innerHTML=`
  <header class="dh"><div class="dn">DAY <b>${String(S.day).padStart(2,'0')}</b><small>/30</small></div><div class="wx">${WEATHER[S.weather].n}</div></header>
  ${S.goal?`<div class="goal ${S.goal.done||goalOK(S.goal.id)?'ok':''}">今日の目標：${S.goal.t}${S.goal.done||goalOK(S.goal.id)?' ✔':''}</div>`:''}
  <div class="track">${track}</div>
  <div class="map">
    <img class="px layer" src="${IMG}map_${S.isl.type||'coral'}.png" alt="${ISLANDS[S.isl.type||'coral'].n}の地図">${ov}<div class="tint ${tint}"></div>${rain}${labels}
  </div>
  <section class="place">
    <div class="ph"><b>${L.n}</b><span>${far}</span></div>
    ${res}
    <p class="pd">${L.d}</p>${late}${planned}
    <div class="gets">ここで取れる：${L.g}</div>${tip}
    ${L.acts.some(a=>ACTS[a].e>0&&!['fire','raft','hut'].includes(a))?`<label class="push"><input type="checkbox" id="pushT" ${S.push?'checked':''}> 無理をする<small>収穫が増えるが、疲れてケガもしやすい</small></label>`:''}
    <div class="acts">${acts.map(a=>`<button class="act ${ACTS[a].e===0?'sub':''} ${a==='fire'?'fire':''}" data-a="${a}">${ACTS[a].n}<small>${a==='fire'?fireDesc():ACTS[a].d}</small></button>`).join('')}</div>
  </section>
  <section class="harv"><div class="hh"><span>今日の収穫 → 夜のカードになる</span></div><div class="chips">${harvest.length?harvest.map(([k,n])=>`<div class="hc">${icon(k,32)}<span>${ITEMS[k].n}×${n}</span></div>`).join(''):'<span class="none">まだ何もない</span>'}</div></section>
  <section class="stat"><div class="meters">${metersHTML()}</div><div class="chips2">${fireHTML()}${chipsHTML()}</div><div class="sks">${skillsHTML()}</div></section>
  ${BAR}`;
  el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{S.sel=b.dataset.p;S.lastRes='';render();});
  const pt=el.querySelector('#pushT');if(pt)pt.onchange=()=>{S.push=pt.checked;render();};
  el.querySelectorAll('[data-feed]').forEach(b=>b.onclick=()=>{const r=feedFire();toast(r||'くべる薪がない');render();});
  el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='craft')return craftSheet();doAct(a);});
  bindBar(el);
}

function fireHTML(){
  if(S.fire<=0)return '<span class="fm off">火：消えている</span>';
  const can=has('wood')||has('branch');
  return `<span class="fm">火 ${'■'.repeat(Math.min(10,S.fire))}<i>${'□'.repeat(Math.max(0,10-S.fire))}</i></span>${can?'<button class="feed" data-feed>薪をくべる</button>':''}`;
}
const skillsHTML=()=>Object.keys(SKILLS).map(k=>`<span class="sk">${SKILLS[k].n}<b>Lv${lv(k)}</b></span>`).join('')+(S.dog?`<span class="sk dg">${icon('dog',16)}${S.dog.n}</span>`:'');
function nightDangers(){
  const d=[],w=WEATHER[S.weather],burn=2+(w.rain&&shelterLv()<2?1:0);
  if(w.rain&&shelterLv()<2)d.push(`雨で体が冷える（体力−${w.rain===2?'11〜22':'4〜10'}、熱が出ることも）→ 寝床・雨よけ・朝まで燃える火で軽くなる`);
  if(S.fire>0&&S.fire<burn)d.push(`火が夜中に消える（朝まであと薪${burn-S.fire}）→ 薪をくべる`);
  if(S.fire<=0&&!w.rain&&shelterLv()===0)d.push('火も寝床もない。夜は思ったより冷える');
  if(S.wound&&!S.wound.clean)d.push('傷を洗っていない。化膿するかも（30％）→ 持ち物から傷を洗う');
  if(S.wound&&S.wound.inf)d.push('傷が化膿している。手当てしないと体力が減り続ける');
  if(S.water<30)d.push('のどが渇いたまま。明日の朝、さらに渇く');
  if(S.food<25)d.push('お腹がすいている。食べてから眠ろう');
  if(['fish','crab','crabbig','clam','meat'].some(k=>has(k)))d.push('生の魚介や肉は一晩で傷むかも → 焼いて食べるか燻製に');
  if(S.isl.type==='mangrove'&&S.fire<=0)d.push('火がないと、蚊に刺されやすい');
  if(S.sick)d.push('体調が悪い。よく休んで、水を飲もう');
  return d;
}
function fireDesc(){
  const need=!hasTinder()||!hasFuel();
  const m=fireMethod();
  if(WEATHER[S.weather].rain&&!(S.found.cave||S.b.shelter>=2))return '雨で火口が湿っている。壁つきの寝床か洞窟が必要';
  if(need)return `足りない：${!hasTinder()?'火口（ヤシの繊維）':''}${!hasTinder()&&!hasFuel()?'・':''}${!hasFuel()?'燃料（枯れ枝2か流木1）':''}`;
  return `${m.n}・成功率${Math.round(Math.min(.95,m.p)*100)}％${m.gain?`・火種${S.ember||0}％`:''}`;
}
// ---------------- 夜：焚き火 ----------------
function renderNight(){
  show('night');
  const el=$('#night');
  let ticks='';for(let i=0;i<30;i++)ticks+=`<rect x="${1+i*2}" y="1" width="1" height="9" fill="${i<S.day?'#F6E7C8':'#4A321E'}"/>`;
  const today=S.dayRes||[];
  const notes=S.eveNotes||[];
  const cards=(S.cards||[]).map(findCard).filter(Boolean);
  const fireTxt=S.fire>0?`${'■'.repeat(Math.min(10,S.fire))}`:'消えている';
  const dz=nightDangers();
  const shTxt=['寝床なし','ヤシの葉の屋根','壁つきの寝床','高床の小屋'][S.b.shelter]+(S.found.cave&&S.isl.cave?'（洞窟あり）':'');
  const pc=S.pickCard;const pcard=cards.find(c=>c.id===pc);
  el.innerHTML=`
  <div class="tally"><span>${S.day}日目の夜</span><svg viewBox="0 0 61 11" preserveAspectRatio="xMinYMid meet" shape-rendering="crispEdges" role="img" aria-label="${S.day}日経過">${ticks}</svg><span>/30</span></div>
  <div class="nscene ${WEATHER[S.weather].rain?'rainy':''}"><img class="px" src="${IMG}${S.fire>0?'night1':'night0'}.png" alt="${S.fire>0?'焚き火のそばに座る':'火のない暗い浜辺'}">${WEATHER[S.weather].rain?`<div class="rain ${S.weather==='storm'?'hard':''}"></div>`:''}${S.fire>0?'<div class="glow"></div>':''}${S.dog?`<img class="px ndog" src="${IMG}dog_night.png" alt="${S.dog.n}">`:''}</div>
  <div class="ngrid">
    <div>安全な水 <b>${S.stock.toFixed(1)}L</b></div><div>火 <b style="color:#F2A33A">${fireTxt}</b>${S.fire>0&&(has('wood')||has('branch'))?'<button class="feed n" data-feed>くべる</button>':''}</div><div>${WEATHER[S.weather].n}・${shTxt}${S.knowNext?`<br>明日の天気：<b style="color:#FFD866">${WEATHER[S.nextW].n}</b>`:''}</div>
  </div>
  <div class="meters n">${metersHTML()}</div>
  <div class="ntext">${today.length?today.map(t=>`<div>・${t}</div>`).join(''):''}${notes.map(t=>`<div class="nn">${t}</div>`).join('')}${WEATHER[S.weather].rain&&shelterLv()<2?'<div class="nw">雨の夜に濡れたまま眠ると、南の島でも低体温症になる。</div>':''}${nearRecipes().slice(0,2).map(h=>`<div class="nh">あと${ITEMS[h.miss[0][0]].n}${h.miss[0][1]}で<b>${h.r.n.replace(/（.*?）/,'')}</b>が作れる（${WHERE[h.miss[0][0]]||'島のどこか'}）</div>`).join('')}</div>
  ${dz.length?`<div class="danger"><b>このまま眠ると…</b>${dz.map(x=>`<div>・${x}</div>`).join('')}</div>`:'<div class="safe">今夜は、心配なことはなさそうだ。</div>'}
  <div class="ch"><b>今夜、なにをする？</b><span>${cards.length}枚から1枚</span></div>
  <div class="cards">${cards.map(c=>`<button class="card ${c.id===pc?'on':''}" data-c="${c.id}"><span class="from">${c.from}から</span>${icon(c.ic,48)}<span class="cn">${c.n}</span><span class="cd">${c.d}</span>${c.tag?`<span class="ctag">${c.tag}</span>`:''}</button>`).join('')}</div>
  ${pcard&&pcard.plan?`<div class="planpick"><span>どこへ向かう？</span>${places().filter(p=>p!=='camp').map(p=>`<button data-pl="${p}" class="${S.planPick===p?'on':''}">${LOC(p).n.replace('？ ','')}</button>`).join('')}</div>`:''}
  <button class="sleep" id="sleepBtn">${pcard?(pcard.plan&&!S.planPick?'行き先を選んでね':`「${pcard.n}」をして眠る`):'何もせずに眠る'}</button>
  ${BAR}`;
  el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{S.pickCard=S.pickCard===b.dataset.c?null:b.dataset.c;S.planPick=null;render();});
  el.querySelectorAll('[data-pl]').forEach(b=>b.onclick=()=>{S.planPick=b.dataset.pl;render();});
  el.querySelectorAll('[data-feed]').forEach(b=>b.onclick=()=>{const r=feedFire();toast(r||'くべる薪がない');render();});
  $('#sleepBtn').onclick=()=>{
    if(pcard&&pcard.plan&&!S.planPick)return;
    const id=S.pickCard,pp=S.planPick;S.planPick=null;
    if(id)playCard(id,pp);else{S.cards=null;night();}
    if(!S.ended&&S.phase==='day')window.scrollTo(0,0);
  };
  bindBar(el);
}

// ---------------- シート ----------------
function drinkSheet(){
  sheet('飲む',`<p class="note">のどの渇き：${Math.round(S.water)}／100。安全な水 ${S.stock.toFixed(1)}L${S.raw>0?`、生水 ${S.raw.toFixed(1)}L`:''}</p>`,[
    {t:`安全な水を0.5L飲む<small>雨水・煮沸した水</small>`,dis:S.stock<=0,cls:'yl',f:ov=>{ov.remove();drink();}},
    {t:`生水を0.5L飲む<small>煮沸していない。お腹をこわすことがある</small>`,dis:S.stock>0||S.raw<=0,f:ov=>{ov.remove();drink();}},
    {t:`生水を煮沸する<small>${!S.fire?'火が必要':!has('can')&&!has('bamboocup')?'空き缶か竹筒が必要':S.raw>0?'1分間沸騰させて、安全な水にする':'生水がない'}</small>`,dis:!(canBoil()&&S.raw>0),f:ov=>{ov.remove();const v=boilAll();toast(`生水${v.toFixed(1)}Lを煮沸した`);render();}},
    {t:'海水を飲む<small>目の前に、いくらでもある……</small>',f:ov=>{ov.remove();seaDrink();}}]);
  const n=document.querySelector('.ov .note');if(n)n.insertAdjacentHTML('afterend',`<p class="note"><a href="#" class="ilink" data-i="sea">海水を飲んではいけない理由</a></p>`);
  document.querySelectorAll('.ov [data-i]').forEach(a=>a.onclick=e=>{e.preventDefault();infoSheet(a.dataset.i);});
}
function eatSheet(){
  const foods=Object.keys(FOOD).filter(k=>has(k));
  sheet('食べる',`<p class="note">満腹：${Math.round(S.food)}／100。${S.fire>0?'火があるので焼いて食べられる。':'火がないので生で食べるしかない。魚・カニ・貝は生だとお腹をこわしやすい。'}</p>${foods.length?'':'<p>食べ物がない。</p>'}`,
   foods.flatMap(k=>{const F=FOOD[k];const o=[{t:`${icon(k,24)} ${ITEMS[k].n}を${F.cook?'生で':''}食べる<small>×${S.inv[k]}　${ITEMS[k].d}</small>`,f:ov=>{ov.remove();eat(k,false);}}];if(F.cook&&S.fire>0)o.unshift({t:`${icon(k,24)} ${ITEMS[k].n}を焼いて食べる<small>×${S.inv[k]}</small>`,cls:'yl',f:ov=>{ov.remove();eat(k,true);}});return o;}));
}
function invSheet(){
  const ks=Object.keys(S.inv).filter(k=>S.inv[k]>0);
  const bl=[['shelter',['なし','ヤシの葉の屋根','壁つきの寝床','高床の小屋']],['catcher',['','雨水タンク']],['catcherLeaf',['','葉っぱの雨受け']],['still',['','太陽熱蒸留器']],['sos',['','SOS（石）','SOS（流木・大）']],['beacon',['','のろし台']],['raft',['','いかだ']]];
  sheet('持ち物',`${S.wound?`<button class="op yl" id="washW">傷を洗う<small>${S.stock>=.2?'きれいな水0.2Lで洗う':'水がないので海水で洗う'}。洗わないと化膿しやすい</small></button>`:''}<div class="inv">${ks.length?ks.map(k=>`<div class="iv">${icon(k,32)}<div><b>${ITEMS[k].n} ×${S.inv[k]}</b><small>${ITEMS[k].d}${k==='lighter'?`（あと${S.lighter}回）`:k==='phone'?`（電池${S.battery}%）`:''}</small></div></div>`).join(''):'<p class="note">何も持っていない。</p>'}</div>
   <h4>キャンプ</h4>${bl.filter(([k])=>S.b[k]).map(([k,n])=>`<div class="nl">■ ${n[S.b[k]]}</div>`).join('')||'<p class="note">まだ何もない。</p>'}
   <h4>水</h4><p class="note">安全な水 ${S.stock.toFixed(1)}L／生水 ${S.raw.toFixed(1)}L／入れ物 ${cap().toFixed(1)}L</p>
   <h4>これまでの記録</h4><div class="lg">${S.log.slice().reverse().slice(0,40).map(l=>`<div><span>${l.d}日目</span>${l.t}</div>`).join('')}</div>`,[],ov=>{const w=ov.querySelector('#washW');if(w)w.onclick=()=>{treat();ov.remove();toast('傷を洗った');render();};});
}
function goalSheet(){
  const rs=routes();
  sheet('目標と記録',`${S.goal?`<div class="wxline">今日の目標：<b>${S.goal.t}</b>${S.goal.done||goalOK(S.goal.id)?'（達成！）':''}</div>`:''}
   <h4>島から帰る3つの道</h4>${rs.map(r=>`<div class="route"><b>${r.n}</b><small>${r.d}</small>${r.items.map(([t,ok])=>`<div class="${ok?'ok':''}">${ok?'■':'□'} ${t}</div>`).join('')}</div>`).join('')}
   <p class="note">救助の準備がすべてそろうと、飛行機や船に気づいてもらいやすくなる。</p>
   <h4>技能</h4>${Object.keys(SKILLS).map(k=>{const l=lv(k),x=S.sk[k]||0,nx=LV[l]||null;return `<div class="skl"><span>${SKILLS[k].n}</span><b>Lv${l}</b><i style="width:${nx?Math.round((x-LV[l-1])/(nx-LV[l-1])*100):100}%"></i><small>${nx?`次まで${nx-x}`:'最大'}</small></div>`;}).join('')}
   <p class="note">採集Lv3・5で収穫が増える／漁は魚がとれやすく／火はつきやすく／工作は材料が余りやすく／探検は新しい場所を見つけやすくなる。</p>
   <h4>南雲の手記 ${S.pages.length}/${PAGES.length}</h4>${S.pages.map(i=>`<button class="op" data-pg="${i}">${PAGES[i].t}</button>`).join('')||'<p class="note">まだ見つけていない。島のどこかにあるらしい。</p>'}`,
   [{t:'サバイバルの知識を読む',f:()=>knowSheet()}],ov=>ov.querySelectorAll('[data-pg]').forEach(b=>b.onclick=()=>sheet(PAGES[b.dataset.pg].t,`<div class="page">${PAGES[b.dataset.pg].b}</div>`)));
}
function dexSheet(){
  const ik=Object.keys(ITEMS),fk=Object.keys(FEATS);
  sheet('図鑑',`<h4>アイテム ${ik.filter(k=>META.dex[k]).length}/${ik.length}</h4><div class="dex">${ik.map(k=>META.dex[k]?`<div>${icon(k,24)}<span>${ITEMS[k].n}</span></div>`:'<div class="no"><span>？？？</span></div>').join('')}</div>
   <h4>島の名所 ${fk.filter(k=>META.feats[k]).length}/${fk.length}</h4><div class="dex">${fk.map(k=>META.feats[k]?`<div><img class="px" src="${IMG}f_${k}.png" width="24" height="24" alt=""><span>${FEATS[k].n}</span></div>`:'<div class="no"><span>？？？</span></div>').join('')}</div>
   <h4>南雲の手記 ${Object.keys(META.pages).length}/${PAGES.length}</h4>${PAGES.map((p,i)=>META.pages[i]?`<button class="op" data-pg="${i}">${p.t}</button>`:'<div class="nl">□ ？？？</div>').join('')}
   <h4>称号</h4>${TITLES.map(t=>`<div class="nl">${META.titles[t.id]?'■ '+t.n+'<small class="note">　'+t.d+'</small>':'□ ？？？'}</div>`).join('')}`,
   [],ov=>ov.querySelectorAll('[data-pg]').forEach(b=>b.onclick=()=>sheet(PAGES[b.dataset.pg].t,`<div class="page">${PAGES[b.dataset.pg].b}</div>`)));
}
function knowSheet(){
  const ks=Object.keys(INFO);
  sheet(`サバイバルの知識 ${ks.filter(k=>S.seen[k]).length}/${ks.length}`,`<p class="note">島で経験すると、本当の話が読めるようになる。</p>`,
   ks.map(k=>S.seen[k]?{t:INFO[k].t,f:()=>infoSheet(k)}:{t:'？？？<small>まだ読めない</small>',dis:true,f:()=>{}}));
}
function craftSheet(){
  sheet('作業する',`<p class="note">作ると時間が1つ進む。夜の焚き火のカードでも作れることがある。${hasCutter()?'':'刃物がないと作れないものがある。'}</p>`,
   RECIPES.filter(r=>!(r.b&&S.b[r.b]>=r.lv)&&!(r.req!=null&&S.b[r.b]<r.req)&&!(r.id==='oknife'&&S.isl.type!=='volcano')&&!(r.give&&r.give!=='bamboocup'&&has(r.give)))
    .map(r=>({r,ok:canCraft(r),miss:Object.entries(r.need).filter(([k,n])=>!has(k,n)).length+(r.tool&&!hasCutter()?1:0)}))
    .sort((a,b)=>(b.ok-a.ok)||(a.miss-b.miss))
    .map(({r,ok})=>{
    const need=Object.entries(r.need).map(([k,n])=>{const h=S.inv[k]||0;return has(k,n)?`<span class="ok">${ITEMS[k].n} ${n}/${n}</span>`:`<span class="ng">${ITEMS[k].n} ${h}/${n}（${WHERE[k]||'?'}）</span>`;}).join(' ');
    return {t:`${ok?'<span class="cok">作れる</span> ':''}${r.n}<small>${r.d}<br>${need}${r.tool?(hasCutter()?' <span class="ok">刃物あり</span>':' <span class="ng">刃物が必要（石のナイフ）</span>'):''}${r.keep?'（容器は残る）':''}</small>`,dis:!ok,f:()=>craft(r.id)};}));
}

// ---------------- 終わり ----------------
function showEnd(){
  closeAll();const kind=S.ended,main=S.endTitle,got=S.endGot;
  const head=kind==='rescue'?(S.rescueBy==='raft'?'脱出成功':'救助された'):kind==='survive'?'30日を生き延びた':'GAME OVER';
  const body=kind==='rescue'?`${S.day}日目、${S.rescueBy==='air'?'上空の捜索機があなたを見つけた。':S.rescueBy==='ship'?'通りかかった船があなたを見つけた。':'いかだは、ついに人の世界にたどり着いた。'}`
   :kind==='survive'?'31日目の朝、漁に来た地元の小舟が、浜にいるあなたを見つけた。30日間、あなたは一人で生き抜いた。'
   :`${S.day}日目の${SLOTS[S.slot]||'夜'}、${DEATH[S.deathCause]||'力尽きて'}${S.deathCause==='sea'?'。':'で、息を引き取った。'}`;
  sheet(head,`<div class="endc"><img class="px" src="${IMG}${kind==='dead'?'night0':'night1'}.png" alt=""><div class="et ${kind==='dead'?'dead':''}">${main.n}</div><div class="note">${main.d}</div></div>
   <p>${body}</p>
   <div class="kv"><div>生きた日数<b>${S.day}日</b></div><div>飲んだ水<b>${S.stats.drank.toFixed(1)}L</b></div><div>とった魚<b>${S.stats.fish}匹</b></div><div>作ったもの<b>${S.stats.crafted}個</b></div></div>
   ${got.length>1?`<p class="note">手に入れた称号：${got.map(t=>t.n).join('、')}</p>`:''}
   <p class="note">これまでの最長生存：${META.best}日／挑戦${META.runs}回</p>`,
   [{t:'この結果をシェアする',cls:'yl',f:()=>shareSheet()},{t:'もう一度、漂流する',f:()=>{closeAll();newGame();render();}},{t:'タイトルへ',f:()=>{closeAll();title();}}],null,true,'endov');
}

// ---------------- タイトル ----------------
const dailyLabel=()=>{const k=todayKey();return `${Math.floor(k/100)%100}/${k%100}`;};
function title(){
  show('title');
  let hasSave=false;try{hasSave=!!localStorage.getItem(SAVE);}catch(e){}
  $('#title').innerHTML=`
   <div class="timg"><img class="px" src="${IMG}title.png" alt="夕暮れの無人島と浜辺の焚き火"></div>
   <div class="ttx"><h1>漂流30日</h1><p>昼は島を歩け。夜は火を守れ。</p></div>
   <div class="tbtns">
    <button class="tb main" id="tNew">島に上陸する<small>毎回ちがう島</small></button>
    <button class="tb day" id="tDaily">今日の島に挑む<small>${dailyLabel()}　みんな同じ島${META.daily[todayKey()]?`／今日の記録 ${META.daily[todayKey()]>30?'生還':META.daily[todayKey()]+'日'}`:''}</small></button>
    ${hasSave?'<button class="tb" id="tCont">つづきから</button>':''}
    <button class="tb" id="tRec">図鑑と称号<small>最長 ${META.best}日／挑戦 ${META.runs}回</small></button>
   </div>
   <p class="tinfo">水・体温・食料の減り方、生水や生魚のリスク、救助のされ方は、CDCなどの公的機関の資料や実際の遭難事例をもとにしている（ゲーム用に簡略化）。</p>`;
  $('#tNew').onclick=()=>{try{localStorage.removeItem(SAVE);}catch(e){}newGame();render();};
  $('#tDaily').onclick=()=>{try{localStorage.removeItem(SAVE);}catch(e){}newGame(todayKey());render();};
  if($('#tCont'))$('#tCont').onclick=()=>{try{S=JSON.parse(localStorage.getItem(SAVE));RNG=S.seed&&S.rs!=null?mulberry(S.rs):Math.random;render();}catch(e){newGame();render();}};
  $('#tRec').onclick=()=>dexSheet();
}

// ---------------- シェア ----------------
const GAME_URL=(()=>{try{const h=location.hostname;if(/^https?:$/.test(location.protocol)&&h&&!/claude|anthropic|usercontent/.test(h))return location.origin+location.pathname.replace(/index\.html$/,'');}catch(e){}return 'https://onelife-game.github.io/drift/';})();
function shareText(){const k=S.ended;return `${S.seed?`【今日の島 ${Math.floor(S.seed/100)%100}/${S.seed%100}】`:''}無人島に漂流して、${k==='dead'?`${S.day}日目に力尽きた。死因：${DEATH[S.deathCause]||'不明'}`:k==='survive'?'30日間を生き延びた！':`${S.day}日目に救助された！`}\n称号「${S.endTitle.n}」\n#漂流30日\n${GAME_URL}`;}
const loadImg=src=>new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>res(null);im.src=src;});
async function makeCard(){
  const W=1080,H=1080,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
  try{await document.fonts.load('40px "DotGothic16"');}catch(e){}
  const DG='"DotGothic16",monospace',FG='#F6E7C8',OR='#F2A33A',BG='#0E1420';
  c.fillStyle=BG;c.fillRect(0,0,W,H);
  c.fillStyle=FG;c.font=`72px ${DG}`;c.fillText('漂流30日',60,120);
  c.fillStyle=OR;c.font=`28px ${DG}`;c.fillText('昼は島を歩け。夜は火を守れ。',64,170);
  // 流木の線
  c.fillStyle='#6B4A2E';c.fillRect(60,205,960,70);
  for(let i=0;i<30;i++){c.fillStyle=i<S.day?(S.ended==='dead'&&i===S.day-1?'#FF7A6B':FG):'#4A321E';c.fillRect(84+i*31,218,10,44);}
  const im=await loadImg(IMG+(S.ended==='dead'?'night0':'night1')+'.png');
  if(im)c.drawImage(im,60-(1040-960)/2,300,1040,512);
  c.textAlign='center';c.fillStyle=S.ended==='dead'?'#FF7A6B':OR;c.font=`64px ${DG}`;c.fillText(S.endTitle.n,W/2,890);
  c.fillStyle=FG;c.font=`32px ${DG}`;c.fillText(S.ended==='dead'?`${S.day}日目に力尽きた（${DEATH[S.deathCause]||''}）`:S.ended==='survive'?'30日間を生き延びた':`${S.day}日目に救助された`,W/2,946);
  c.fillStyle='#B4C0D6';c.font=`24px ${DG}`;c.fillText(`${B().n}／飲んだ水 ${S.stats.drank.toFixed(1)}L／魚 ${S.stats.fish}匹`,W/2,990);
  c.fillStyle=OR;c.fillRect(0,H-64,W,64);c.fillStyle='#1B1410';c.font=`28px ${DG}`;c.textAlign='left';c.fillText('#漂流30日',60,H-22);c.textAlign='right';c.fillText('あなたは何日生き延びる？',W-60,H-22);c.textAlign='left';
  return cv;
}
async function shareSheet(){
  const cv=await makeCard();const url=cv.toDataURL('image/png');const txt=shareText();const enc=encodeURIComponent(txt);
  sheet('結果をシェアする',`<p class="note">画像を長押し（パソコンは右クリック）で保存できる。</p><img src="${url}" style="width:100%;display:block;margin:8px 0" alt="結果カード">
   <textarea id="shTx" readonly>${txt}</textarea>
   <div class="shg">
    <button class="op yl" id="shN">共有する</button><a class="op" href="${url}" download="drift30.png">画像を保存</a>
    <a class="op" href="https://x.com/intent/post?text=${enc}" target="_blank" rel="noopener">Xに投稿</a>
    <a class="op" href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(GAME_URL)}&text=${enc}" target="_blank" rel="noopener">LINEで送る</a>
   </div>`,[],ov=>{ov.querySelector('#shN').onclick=async()=>{try{const blob=await new Promise(r=>cv.toBlob(r,'image/png'));const f=new File([blob],'drift30.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],text:txt});return;}if(navigator.share){await navigator.share({text:txt,url:GAME_URL});return;}}catch(e){if(e&&e.name==='AbortError')return;}toast('画像を保存して投稿してね');};});
}
window.addEventListener('DOMContentLoaded',title);
