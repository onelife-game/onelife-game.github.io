// =====================================================================
// 漂流30日 画面
// =====================================================================
let TAB='act';
function toast(t){const d=document.createElement('div');d.className='toast';d.innerHTML=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1800);}
function sheet(title,html,btns,onOpen,noClose){
  const ov=document.createElement('div');ov.className='ov';
  ov.innerHTML=`<div class="sh"><div class="hd"><span>${title}</span>${noClose?'':'<button data-x>閉じる ×</button>'}</div><div class="bd">${html}<div class="mb"></div></div></div>`;
  const mb=ov.querySelector('.mb');(btns||[]).forEach(b=>{const e=document.createElement('button');e.className='op '+(b.cls||'');e.innerHTML=b.t;e.disabled=!!b.dis;e.onclick=()=>b.f(ov);mb.appendChild(e);});
  if(!noClose){ov.querySelector('[data-x]').onclick=()=>ov.remove();ov.onclick=e=>{if(e.target===ov)ov.remove();};}
  document.body.appendChild(ov);if(onOpen)onOpen(ov);return ov;
}
function infoSheet(k){const I=INFO[k];if(!I)return;sheet(I.t,`<p>${I.b}</p><p class="src">出典：${I.s}</p>`);}
const ilink=k=>`<a class="ilink" href="#" data-info="${k}">［解説］</a>`;

// ---------------- 背景（ドット絵） ----------------
function scene(){
  const W=120,H=50;let r='';const Rc=(x,y,w,h,c)=>{r+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;};
  const sl=S.slot,wt=S.weather;
  const sky=wt==='storm'?'#4A5068':wt==='rain'?'#7C8AA0':['#F6B78C','#7EC8F0','#F08A5D','#1B2350'][sl];
  Rc(0,0,W,H,sky);
  if(sl===3)for(let i=0;i<20;i++)Rc((i*37)%W,(i*11)%22,1,1,'#FFFEF2');
  if(sl===1&&!WEATHER[wt].rain&&wt!=='cloud')Rc(96,4,6,6,'#FFF3B0');
  const clear=!WEATHER[wt].rain&&wt!=='cloud';if(sl===0&&clear)Rc(10,14,6,6,'#FFD9A0');if(sl===2&&clear)Rc(98,16,7,7,'#FFB070');
  if(wt==='cloud'||WEATHER[wt].rain){Rc(8,5,18,4,'#D7DCE4');Rc(12,3,10,2,'#D7DCE4');Rc(60,8,22,4,'#C8CED8');Rc(66,6,12,2,'#C8CED8');}
  const sea=sl===3?'#16285A':wt==='storm'?'#2E4A68':'#2F86C8',sand=sl===3?'#8A7A5A':'#EBD9A6';
  const loc=S.loc;
  if(loc==='jungle'){Rc(0,18,W,32,'#2F6B3A');for(let x=0;x<W;x+=10){Rc(x+2,10+(x%3)*2,8,14,'#3F8A48');Rc(x+5,24,2,26,'#5A3E28');}Rc(0,42,W,8,'#4A3A28');}
  else if(loc==='hill'){Rc(0,26,W,24,sea);Rc(0,30,W,1,'#5FA8E0');Rc(20,30,80,20,'#5A9A4A');Rc(36,24,48,8,'#6AAA56');Rc(46,20,28,6,'#7ABA62');}
  else if(loc==='rocks'){Rc(0,20,W,30,sea);for(let i=0;i<8;i++){const x=i*15+3,h=8+(i*7)%9;Rc(x,50-h-4,12,h,'#6E6E7A');Rc(x+2,50-h-6,8,2,'#8A8A96');}Rc(0,46,W,4,'#55555F');}
  else if(loc==='cave'){Rc(0,0,W,H,'#2A2420');Rc(30,8,60,42,'#14110F');Rc(0,44,W,6,'#3A322C');}
  else{ // beach（キャンプ）
    Rc(0,22,W,12,sea);for(let x=0;x<W;x+=12)Rc(x+(S.day%3)*3,33,6,1,'#CFE9FF');Rc(0,34,W,16,sand);
    // ヤシの木
    Rc(6,12,2,24,'#7A5230');Rc(1,10,12,3,'#3F8A48');Rc(4,8,6,2,'#3F8A48');Rc(108,14,2,22,'#7A5230');Rc(103,12,12,3,'#3F8A48');
    // 建てたもの
    const sh=S.b.shelter;
    if(sh===1){Rc(14,34,18,1,'#7A5230');Rc(12,30,22,4,'#4E9A40');}
    if(sh===2){Rc(14,30,18,8,'#9A7A4A');Rc(12,27,22,4,'#4E9A40');}
    if(sh>=3){Rc(14,26,20,8,'#C8A86A');Rc(12,23,24,4,'#4E9A40');Rc(15,34,2,6,'#7A5230');Rc(31,34,2,6,'#7A5230');}
    if(S.fire>0){Rc(70,40,6,2,'#5A3E28');Rc(71,37,4,3,'#F2B632');Rc(72,35,2,2,'#E85D4A');if(S.slot===3)Rc(66,34,14,8,'rgba(242,182,50,.15)');}
    if(S.b.sos){const c=S.b.sos===2?'#5A3E28':'#7A7A86';[[82,40],[89,40],[96,40]].forEach(([x,y],i)=>{if(i===1){Rc(x,y,5,1,c);Rc(x,y,1,6,c);Rc(x+4,y,1,6,c);Rc(x,y+5,5,1,c);}else{Rc(x,y,5,1,c);Rc(x,y,1,3,c);Rc(x,y+2,5,1,c);Rc(x+4,y+2,1,4,c);Rc(x,y+5,5,1,c);}});}
    if(S.b.beacon)Rc(56,36,6,6,'#7A5230'),Rc(55,34,8,2,'#4E9A40');
    if(S.b.raft)Rc(36,44,16,3,'#C8A86A');
    if(S.b.catcher)Rc(42,36,8,4,'#3D8ED6');
  }
  if(WEATHER[wt].rain)for(let i=0;i<(wt==='storm'?40:22);i++)Rc((i*29+S.slot*7)%W,(i*17)%H,1,3,'rgba(220,235,255,.6)');
  if(sl===3)Rc(0,0,W,H,'rgba(10,10,40,.35)');
  const me=pixelChar({look:S.look,age:28,outfit:'casual',mood:S.hp<30||S.water<20?'sad':'normal'}).replace(/width="\d+" height="\d+"/,'style="width:100%;height:100%;display:block"');
  return `<svg class="bg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges">${r}</svg><div class="me">${me}</div>`;
}

// ---------------- 描画 ----------------
const bar=(v,col)=>`<i class="bar">${[0,1,2,3,4,5,6,7,8,9].map(j=>`<u class="${j<Math.round(v/10)?'f':''}" style="${j<Math.round(v/10)?`background:${col}`:''}"></u>`).join('')}</i>`;
function render(){
  if(!S)return;
  $('#title').classList.add('hidden');
  $('#hDay').innerHTML=`<span class="big">${Math.min(S.day,30)}</span><small>日目 / 30</small>`;
  $('#hSub').innerHTML=`${SLOTS[S.slot]}・${WEATHER[S.weather].n}<br>${LOCS[S.loc].n}`;
  let d='';for(let i=1;i<=30;i++)d+=`<i class="${i<S.day?'on':i===S.day?'now':''}"></i>`;$('#days').innerHTML=d;
  $('#scene').innerHTML=scene();
  const col=v=>v<20?'var(--pink)':v<45?'var(--gold)':'var(--lime)';
  $('#meters').innerHTML=[['体力',Math.round(S.hp/S.hpMax*100),Math.round(S.hp)],['水分',S.water,Math.round(S.water)],['満腹',S.food,Math.round(S.food)],['気力',S.morale,Math.round(S.morale)]].map(([n,v,vv])=>`<div class="mt"><span>${n}</span>${bar(v,col(v))}<b style="color:${col(v)}">${vv}</b></div>`).join('');
  const chips=[];if(S.sick)chips.push({diarrhea:'下痢',fever:'発熱',cig:'シガテラ中毒'}[S.sick.type]);if(S.wound)chips.push(S.wound.inf?'傷が化膿':'ケガ');if(S.wet)chips.push('濡れている');if(S.fire>0)chips.push('焚き火');if(S.water<20)chips.push('ひどい渇き');if(S.food<15)chips.push('空腹');
  $('#status').innerHTML=`<span class="wt">安全な水 <b>${S.stock.toFixed(1)}L</b>${S.raw>0?`／生水 ${S.raw.toFixed(1)}L`:''}／容器 ${cap().toFixed(1)}L</span>`+chips.map(c=>`<span class="chip">${c}</span>`).join('');
  document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===TAB));
  const m=$('#main');
  if(S.queue.length){m.innerHTML=evHTML(S.queue[0]);m.querySelectorAll('.ev .op').forEach((b,i)=>b.onclick=()=>{const e=S.queue.shift();const r=e.ops[i].f();if(r){S.lastRes=r;S.notes.push(r);}if(S.pendingEnd){const k=S.pendingEnd;S.pendingEnd=null;endGame(k);return;}if(S.hp<=0&&!S.ended){die();return;}save();render();});}
  else if(TAB==='act')m.innerHTML=actHTML();
  else if(TAB==='inv')m.innerHTML=invHTML();
  else if(TAB==='log')m.innerHTML=logHTML();
  else m.innerHTML=infoHTML();
  bindMain();
  // 下のボタン
  const nb=$('#nextBtn');
  if(S.ended){nb.textContent='おわり';nb.disabled=true;}
  else if(S.queue.length){nb.textContent='出来事に答える';nb.disabled=true;}
  else if(S.slot===3){nb.innerHTML='眠る ▶';nb.disabled=false;}
  else{nb.innerHTML='何もせず時間を過ごす';nb.disabled=false;}
  $('#fInfo').innerHTML=S.slot===3?'夜になった。体を休めよう':'行動すると時間が進む';
  m.scrollTop=0;
}
function evHTML(e){return `${S.lastRes&&S.notes.length?`<div class="res">${S.lastRes}</div>`:''}<div class="ev"><div class="evh"><span class="tag">${e.tag}</span><span class="evn">${S.day}日目・${SLOTS[S.slot]}</span></div><div class="evb"><div class="tx">${e.tx}</div></div><div class="ops">${e.ops.map(o=>`<button class="op">${o.t}</button>`).join('')}</div></div>`;}
function actHTML(){
  const notes=S.notes.slice(-4);S.notes=[];
  let h='';
  if(notes.length)h+=`<div class="sec"><h3>${S.slot===0?'夜のあいだに':'さっきのこと'}</h3>${notes.map(n=>`<div class="nl">■ ${n}</div>`).join('')}</div>`;
  if(S.slot===3){h+=`<div class="sec"><h3>夜</h3><p class="note">暗くなった。夜は何もできない。${S.b.shelter||S.found.cave?'寝床で眠ろう。':'寝床がない。砂の上で眠るしかない。'}${S.fire>0?'焚き火があるので、流木があれば朝まで燃やせる。':''}${WEATHER[S.weather].rain&&shelterLv()<2?'<br><b style="color:var(--pink)">雨の夜に濡れたまま眠ると、南の島でも低体温症になる。</b>'+ilink('cold'):''}</p></div>`;h+=quickHTML();return h;}
  h+=quickHTML();
  h+=`<div class="sec"><h3>行動する<span>1回で「${SLOTS[S.slot]}」が過ぎる</span></h3><div class="acts">`;
  for(const a of ACTS){if(a.c&&!a.c())continue;
    let warn='';if(S.slot===1&&a.e===2&&WEATHER[S.weather].heat)warn='<span class="c">暑い</span>';
    h+=`<button class="act" data-a="${a.id}">${a.n}${warn}<small>${a.d}</small></button>`;}
  h+=`</div>${S.slot===1&&WEATHER[S.weather].heat?`<p class="note" style="margin-top:8px">昼の暑い時間に体を動かすと、汗で水分が大きく減る。${ilink('water')}</p>`:''}</div>`;
  return h;
}
function quickHTML(){
  const foods=Object.keys(FOOD).filter(k=>has(k));
  return `<div class="sec"><h3>すぐできること<span>時間は進まない</span></h3><div class="qk">
   <button class="qb" data-q="drink" ${S.stock+S.raw<=0?'disabled':''}>水を飲む<small>${S.stock>0?'安全な水0.5L':S.raw>0?'生水0.5L':'水がない'}</small></button>
   <button class="qb" data-q="eat" ${foods.length?'':'disabled'}>食べる<small>${foods.length?foods.map(k=>ITEMS[k].n).slice(0,3).join('・'):'食べ物がない'}</small></button>
   <button class="qb" data-q="boil" ${canBoil()&&S.raw>0?'':'disabled'}>煮沸する<small>${!S.fire?'火が必要':!has('can')&&!has('bamboocup')?'空き缶か竹筒が必要':S.raw>0?'生水を安全に':'生水がない'}</small></button>
   <button class="qb" data-q="feed" ${S.fire>0&&has('wood')?'':'disabled'}>薪をくべる<small>${S.fire>0?`火：あと${S.fire}`:'火がない'}</small></button>
   ${S.wound?`<button class="qb" data-q="treat">傷を洗う<small>${S.stock>=.2?'きれいな水で':'海水で'}</small></button>`:''}
   <button class="qb" data-q="sea">海水を飲む<small>最後の手段…？</small></button>
  </div></div>`;
}
function invHTML(){
  const ks=Object.keys(S.inv).filter(k=>S.inv[k]>0);
  const bl=[['shelter',['なし','ヤシの葉の屋根','壁つきの寝床','高床の小屋']],['catcher',['','雨水タンク']],['catcherLeaf',['','葉っぱの雨受け']],['still',['','太陽熱蒸留器']],['sos',['','SOS（石）','SOS（流木・大）']],['beacon',['','のろし台']],['raft',['','いかだ']]];
  return `<div class="sec"><h3>持ち物</h3>${ks.length?ks.map(k=>`<div class="iv"><b>${ITEMS[k].n}</b><span>×${S.inv[k]}</span><small>${ITEMS[k].d}${k==='lighter'?`（あと${S.lighter}回）`:k==='phone'?`（電池${S.battery}%）`:''}</small></div>`).join(''):'<p class="note">何も持っていない。</p>'}</div>
  <div class="sec"><h3>キャンプ</h3>${bl.filter(([k])=>S.b[k]).map(([k,n])=>`<div class="nl">■ ${n[S.b[k]]}</div>`).join('')||'<p class="note">まだ何もない。</p>'}${S.found.spring?'<div class="nl">■ 湧き水（ジャングル）</div>':''}${S.found.cave?'<div class="nl">■ 洞窟（雨の夜も濡れずに眠れる）</div>':''}${S.found.wreck?'<div class="nl">■ 難破船の残骸</div>':''}</div>`;
}
function logHTML(){return `<div class="tl">${S.log.slice().reverse().map(l=>`<div class="st"><div class="a">${l.d}日目・${SLOTS[l.s]}</div><div class="t">${l.t}</div></div>`).join('')}</div>`;}
function infoHTML(){const ks=Object.keys(INFO);return `<div class="sec"><h3>サバイバルの知識<span>${ks.filter(k=>S.seen[k]).length} / ${ks.length}</span></h3>${ks.map(k=>S.seen[k]?`<button class="act wide" data-info="${k}">${INFO[k].t}</button>`:`<div class="act wide locked">？？？<small>島で経験すると読める</small></div>`).join('')}</div>`;}
function bindMain(){
  const m=$('#main');
  m.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const id=b.dataset.a;if(id==='craft')return craftSheet();doAct(id);});
  m.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const q=b.dataset.q;if(q==='drink')drink();else if(q==='eat')eatSheet();else if(q==='boil')boil();else if(q==='feed'){add('wood',-1);S.fire+=3;toast('流木をくべた');render();}else if(q==='treat')treat();else if(q==='sea'){sheet('海水を飲む？','<p>のどが焼けるように渇いている。目の前には、いくらでも水がある。</p>',[{t:'飲む',f:ov=>{ov.remove();seaDrink();}},{t:'やめておく',f:ov=>ov.remove()}]);}});
  document.querySelectorAll('[data-info]').forEach(a=>a.onclick=e=>{e.preventDefault();infoSheet(a.dataset.info);});
}
function eatSheet(){
  const foods=Object.keys(FOOD).filter(k=>has(k));
  sheet('食べる',`<p class="note">${S.fire>0?'火があるので焼いて食べられる。':'火がないので生で食べるしかない。魚・カニ・貝は生だとお腹をこわしやすい。'}</p>`,
   foods.flatMap(k=>{const F=FOOD[k];const o=[{t:`${ITEMS[k].n}を${F.cook?'生で':''}食べる<small>×${S.inv[k]}　${ITEMS[k].d}</small>`,f:ov=>{ov.remove();eat(k,false);}}];if(F.cook&&S.fire>0)o.unshift({t:`${ITEMS[k].n}を焼いて食べる<small>×${S.inv[k]}</small>`,cls:'yl',f:ov=>{ov.remove();eat(k,true);}});return o;}));
}
function craftSheet(){
  if(S.slot===3)return;
  sheet('作る',`<p class="note">作ると「${SLOTS[S.slot]}」が過ぎる。${hasCutter()?'':'刃物がないと作れないものがある。'}</p>`,
   RECIPES.filter(r=>!(r.b&&S.b[r.b]>=r.lv)&&!(r.req!=null&&S.b[r.b]<r.req)).map(r=>{const ok=canCraft(r);
    const need=Object.entries(r.need).map(([k,n])=>`<span style="color:${has(k,n)?'var(--lime)':'var(--pink)'}">${ITEMS[k].n}${n}</span>`).join(' ');
    return {t:`${r.n}<small>${r.d}<br>${need}${r.tool?` <span style="color:${hasCutter()?'var(--lime)':'var(--pink)'}">刃物</span>`:''}${r.keep?'（容器は残る）':''}</small>`,dis:!ok,f:()=>craft(r.id)};}));
}
function nextBtn(){
  if(!S||S.queue.length||S.ended)return;
  if(S.slot===3)night();else{S.notes.push('何もせずに時間が過ぎた。');S.lastRes='';advance(0);}
}

// ---------------- タイトル ----------------
function title(){
  const t=$('#title');t.classList.remove('hidden');
  let hasSave=false;try{hasSave=!!localStorage.getItem(SAVE);}catch(e){}
  const lk={sex:'M',hs:'spiky',hc:0,sk:1,shirt:'#E85D4A'};
  const me=pixelChar({look:lk,age:28,outfit:'casual',mood:'normal'}).replace(/width="\d+" height="\d+"/,'style="width:100%;height:100%;display:block"');
  let d='';for(let i=0;i<30;i++)d+=`<i style="display:block;aspect-ratio:1;background:${i===0?'var(--lime)':'var(--ln)'}"></i>`;
  t.innerHTML=`<div class="tw">
   <div class="tsm"><span>SURVIVAL SIMULATION</span><span>&copy;2026</span></div>
   <h1 class="ttl">漂流<br>30日</h1>
   <div class="tsub">無人島で、30日間生き延びろ。</div>
   <div class="tscene"><svg viewBox="0 0 120 50" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges"><rect width="120" height="50" fill="#F08A5D"/><rect x="96" y="14" width="8" height="8" fill="#FFB070"/><rect y="24" width="120" height="12" fill="#2F86C8"/><rect y="36" width="120" height="14" fill="#EBD9A6"/><rect x="14" y="14" width="2" height="24" fill="#7A5230"/><rect x="9" y="12" width="12" height="3" fill="#3F8A48"/><rect x="12" y="10" width="6" height="2" fill="#3F8A48"/></svg><div class="tme">${me}</div></div>
   <div class="tdays">${d}</div>
   <div class="tbtns">
    <button class="tbtn" id="tNew">▶ 漂流する<small>漂着の理由・職業・島の地形は毎回ランダム</small></button>
    ${hasSave?'<button class="tbtn s" id="tCont">続きから</button>':''}
    <button class="tbtn s" id="tRec">記録と称号<small>最長生存 ${META.best}日／挑戦 ${META.runs}回</small></button>
   </div>
   <div class="tinfo">水・体温・食料の減り方、生水や生魚のリスク、救助のされ方などは、CDCなどの公的機関の資料や実際の遭難事例をもとにしている（ゲーム用に簡略化）。</div>
  </div>`;
  $('#tNew').onclick=()=>{try{localStorage.removeItem(SAVE);}catch(e){}newGame();TAB='act';render();};
  if($('#tCont'))$('#tCont').onclick=()=>{try{S=JSON.parse(localStorage.getItem(SAVE));render();}catch(e){newGame();render();}};
  $('#tRec').onclick=()=>sheet('記録と称号',`<p>最長生存：<b>${META.best}日</b>／挑戦：${META.runs}回</p>${TITLES.map(t=>`<div class="nl">${META.titles[t.id]?'■ '+t.n+'<small class="note">　'+t.d+'</small>':'□ ？？？'}</div>`).join('')}`);
}

// ---------------- シェア ----------------
const GAME_URL=(()=>{try{const h=location.hostname;if(/^https?:$/.test(location.protocol)&&h&&!/claude|anthropic|usercontent/.test(h))return location.origin+location.pathname.replace(/index\.html$/,'');}catch(e){}return 'https://onelife-game.github.io/drift/';})();
function shareText(){const k=S.ended;return `無人島に漂流して、${k==='dead'?`${S.day}日目に力尽きた。死因：${DEATH[S.deathCause]||'不明'}`:k==='survive'?'30日間を生き延びた！':`${S.day}日目に救助された！`}\n称号「${S.endTitle.n}」\n#漂流30日\n${GAME_URL}`;}
async function makeCard(){
  const W=1080,H=1080,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
  try{await Promise.all([document.fonts.load('40px "Press Start 2P"'),document.fonts.load('40px "DotGothic16"')]);}catch(e){}
  const DG='"DotGothic16",monospace',PS='"Press Start 2P",monospace';
  const BG='#0F0E17',WIN='#1B1A2B',FG='#FFFEF2',LIME='#C7F94B',PINK='#FF6B8B',GR='#A9A7C4',LN='#2F2D46',GOLD='#FFC94A';
  c.fillStyle=BG;c.fillRect(0,0,W,H);
  c.fillStyle=LIME;c.font=`64px ${DG}`;c.fillText('漂流30日',64,120);
  c.fillStyle=GR;c.font=`26px ${DG}`;c.fillText('無人島で、30日間生き延びろ。',68,170);
  for(let i=0;i<30;i++){const x=64+(i%15)*64,y=210+Math.floor(i/15)*64;c.fillStyle=i<S.day-(S.ended==='dead'?1:0)?LIME:(i===S.day-1&&S.ended==='dead'?PINK:LN);c.fillRect(x,y,52,52);}
  // 絵
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50" width="960" height="400" shape-rendering="crispEdges">${scene().match(/<svg[^>]*>([\s\S]*?)<\/svg>/)[1]}</svg>`;
  await new Promise(res=>{const im=new Image();im.onload=()=>{c.drawImage(im,60,350,960,400);res();};im.onerror=res;im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);});
  const ps=pixelChar({look:S.look,age:28,outfit:'casual',mood:S.ended==='dead'?'sad':'happy'});
  await new Promise(res=>{const im=new Image();im.onload=()=>{c.drawImage(im,476,470,128,192);res();};im.onerror=res;im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(ps);});
  c.strokeStyle=FG;c.lineWidth=6;c.strokeRect(60,350,960,400);
  c.textAlign='center';c.fillStyle=S.ended==='dead'?PINK:LIME;c.font=`64px ${DG}`;c.fillText(S.endTitle.n,W/2,840);
  c.fillStyle=FG;c.font=`32px ${DG}`;c.fillText(S.ended==='dead'?`${S.day}日目に力尽きた（${DEATH[S.deathCause]||''}）`:S.ended==='survive'?'30日間を生き延びた':`${S.day}日目に救助された`,W/2,900);
  c.fillStyle=GR;c.font=`24px ${DG}`;c.fillText(`${BACKS.find(b=>b.id===S.back).n}／飲んだ水 ${S.stats.drank.toFixed(1)}L／魚 ${S.stats.fish}匹`,W/2,950);
  c.fillStyle=LIME;c.fillRect(0,H-80,W,80);c.fillStyle=BG;c.font=`28px ${DG}`;c.textAlign='left';c.fillText('#漂流30日',64,H-30);c.textAlign='right';c.fillText('あなたは何日生き延びる？',W-64,H-30);c.textAlign='left';
  return cv;
}
async function shareSheet(){
  const cv=await makeCard();const url=cv.toDataURL('image/png');const txt=shareText();const enc=encodeURIComponent(txt);
  sheet('結果をシェアする',`<p class="note">画像を長押し（パソコンは右クリック）で保存できる。</p><img src="${url}" style="width:100%;border:3px solid var(--fg);display:block;margin:8px 0" alt="結果カード">
   <textarea id="shTx" readonly style="width:100%;height:96px;padding:8px;font-size:13px">${txt}</textarea>
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
    <button class="op yl" id="shN">共有する</button><a class="op" href="${url}" download="drift30.png" style="text-align:center;text-decoration:none">画像を保存</a>
    <a class="op" href="https://x.com/intent/post?text=${enc}" target="_blank" rel="noopener" style="text-align:center;text-decoration:none">Xに投稿</a>
    <a class="op" href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(GAME_URL)}&text=${enc}" target="_blank" rel="noopener" style="text-align:center;text-decoration:none">LINEで送る</a>
   </div>`,[],ov=>{ov.querySelector('#shN').onclick=async()=>{try{const blob=await new Promise(r=>cv.toBlob(r,'image/png'));const f=new File([blob],'drift30.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],text:txt});return;}if(navigator.share){await navigator.share({text:txt,url:GAME_URL});return;}}catch(e){if(e&&e.name==='AbortError')return;}toast('画像を保存して投稿してね');};});
}
window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{TAB=b.dataset.t;render();});
  $('#nextBtn').onclick=nextBtn;
  title();
});
