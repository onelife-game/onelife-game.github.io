// =====================================================================
// 死の演出 ― 突然の暗転 → 最期の瞬間 → 走馬灯 → 看取った人 → 名前
// 画面タップで次へ。右上の「スキップ」で結果画面へ。
// =====================================================================
(function(){
const css=`
#dth{position:fixed;inset:0;z-index:100;background:#000;color:#F4F1E6;display:flex;align-items:center;justify-content:center;flex-direction:column;overflow:hidden;font-family:"DotGothic16",monospace;cursor:pointer;user-select:none;-webkit-user-select:none}
#dth .skip{position:absolute;top:14px;right:14px;font-size:12px;color:#777;border:1px solid #444;padding:4px 10px;background:transparent;font-family:inherit;z-index:3}
#dth .stage{width:min(92vw,520px);text-align:center;position:relative}
#dth .ln{opacity:0;font-size:18px;line-height:1.9;margin:4px 0;animation:dIn 1.1s forwards}
#dth .big{font-size:26px;letter-spacing:.08em}
#dth .sm{font-size:13px;color:#9a978a}
#dth .ekg{width:100%;height:90px;display:block}
#dth .ekg path{fill:none;stroke:#C7F94B;stroke-width:2.5;stroke-dasharray:900;stroke-dashoffset:900;animation:dDraw 2.4s linear forwards}
#dth .flat{animation:dFade 1.2s 2.2s forwards}
#dth .chr{width:150px;height:150px;margin:0 auto 10px;image-rendering:pixelated;opacity:0;animation:dIn .5s forwards}
#dth .mem{animation:dIn .35s forwards,dOut .5s 1.55s forwards;opacity:0}
#dth .age{font-family:"Press Start 2P",monospace;font-size:13px;color:#C7F94B;margin-bottom:8px}
#dth .flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;animation:dFlash .45s}
#dth .who{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:14px 0}
#dth .who div{width:70px;font-size:11px;color:#bbb;opacity:0;animation:dIn .8s forwards}
#dth .who svg{width:70px!important;height:70px!important}
#dth .hint{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:12px;color:#666;animation:dBlink 1.6s infinite}
@keyframes dIn{to{opacity:1}}
@keyframes dOut{to{opacity:0}}
@keyframes dDraw{to{stroke-dashoffset:0}}
@keyframes dFade{to{opacity:.15}}
@keyframes dFlash{0%{opacity:.85}100%{opacity:0}}
@keyframes dBlink{50%{opacity:.3}}
@keyframes dShake{0%,100%{transform:none}20%{transform:translate(-6px,3px)}40%{transform:translate(5px,-4px)}60%{transform:translate(-3px,2px)}80%{transform:translate(2px,-1px)}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

const SUDDEN=['交通事故','急性心不全','くも膜下出血','心筋梗塞','脳卒中','薬物による中毒'];
const PLACE={'23ku':'東京23区','tama':'東京の郊外','local':'地方の町'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

function charAt(age,mood){
  try{return chibi({look:S.look,age,outfit:outfitFor(age,age<23?'student':S.job.id,S.sex),mood:mood||'normal'});}catch(e){return '';}
}
// 人生の名場面を選ぶ（年齢がばらけるように）
function memories(){
  const imp=/結婚|離婚|生まれる|逮捕|破産|起業|社長|プロ|デビュー|当選|金メダル|入院|がん|亡くす|生活保護|相続|上京|入学|就職|になる$|合格|別れ|再起|家を買う|宝くじ/;
  const L=(S.log||[]).filter(l=>l.age>0&&!/亡くなる（/.test(l.t));
  const pick1=[];const used=new Set();
  L.filter(l=>imp.test(l.t)).forEach(l=>{if(!used.has(l.age)&&pick1.length<9){pick1.push(l);used.add(l.age);}});
  L.forEach(l=>{if(pick1.length<6&&!used.has(l.age)){pick1.push(l);used.add(l.age);}});
  pick1.sort((a,b)=>a.age-b.age);
  const first={age:0,t:`${S.birthY}年、${PLACE[S.fam.place]||''}に生まれる`};
  return [first].concat(pick1.slice(-8));
}
function watchers(){
  const W=[];
  if(S.spouse&&S.spouse.close>=35)W.push({p:S.spouse,lb:S.spouse.name});
  S.kids.filter(k=>k.alive!==false&&k.close>=35).slice(0,3).forEach(k=>W.push({p:Object.assign({},k,{age:k.age}),lb:k.name}));
  if(S.age<30)livingParents().slice(0,2).forEach(p=>W.push({p,lb:p.sex==='M'?'父':'母'}));
  (S.people||[]).filter(p=>p.kind==='friend'&&p.close>=60).slice(0,2).forEach(p=>W.push({p,lb:p.name}));
  if(S.pet&&W.length<5)W.push({pet:1,lb:S.pet.name});
  return W.slice(0,5);
}
function lastWords(){
  const W=watchers().filter(w=>!w.pet);
  if(S.age<12)return famText('……おかあさん、どこ？').replace('おかあさん',livingParents().some(p=>p.sex==='F')?'おかあさん':livingParents().length?'おとうさん':'だれか');
  if(!W.length)return pick(['……だれか、いないのか。','……まあ、悪くなかったか。','……もう少し、誰かと話せばよかった。']);
  if(S.kids.some(k=>k.alive!==false&&k.close>=50))return pick(['……ありがとう。楽しかったよ。','……みんな、仲良くな。','……生まれてきてくれて、ありがとう。']);
  if(S.spouse)return `……${S.spouse.name}、先に行くね。`;
  if(S.gamble&&S.gamble.net<-500)return '……あと一回だけ、回したかったな。';
  if(S.crime)return '……やり直せるなら、どこからだろう。';
  return pick(['……いい人生だった、と思う。','……もう少しだけ、生きたかった。','……ありがとう。']);
}

async function playDeath(cause){
  const ov=document.createElement('div');ov.id='dth';
  ov.innerHTML=`<button class="skip">スキップ</button><div class="stage"></div>`;
  document.body.appendChild(ov);
  const stage=ov.querySelector('.stage');
  let skipAll=false,next=null;
  const wait=ms=>new Promise(r=>{next=r;setTimeout(r,ms);});
  ov.onclick=e=>{if(e.target.classList.contains('skip')){skipAll=true;}if(next)next();};
  const line=(t,cls,delay)=>{const d=document.createElement('div');d.className='ln '+(cls||'');d.style.animationDelay=(delay||0)+'ms';d.innerHTML=t;stage.appendChild(d);return d;};
  const clear=()=>{stage.innerHTML='';};
  const sudden=SUDDEN.includes(cause);
  try{
    // ① 暗転と心電図
    if(sudden){ov.style.animation='dShake .5s';}
    stage.innerHTML=`<svg class="ekg" viewBox="0 0 400 90"><path d="M0 45 H70 L80 20 L90 70 L100 45 H150 L160 15 L172 78 L182 45 H230 L238 32 L246 56 L254 45 H400"/></svg><div class="ln sm" style="animation-delay:2600ms">${S.year}年　${S.age}歳</div>`;
    await wait(4200);if(skipAll)throw 0;
    // ② 最期の瞬間
    clear();
    if(sudden){line('その日は、いつもと同じ朝だった。','',0);line(`${cause}。`,'big',1600);line('あまりにも、突然だった。','',3000);}
    else if(['老衰','肺炎','心不全'].includes(cause)){line('窓の外で、鳥が鳴いていた。','',0);line(`${cause}。`,'big',1600);line('眠るように、静かに息を引き取った。','',3000);}
    else{line('長い闘いだった。','',0);line(`${cause}。`,'big',1600);line('最後まで、生きようとした。','',3000);}
    await wait(5600);if(skipAll)throw 0;
    // ③ 走馬灯
    clear();line('――そのとき、人生が一瞬で駆けめぐった。','sm',0);await wait(2000);if(skipAll)throw 0;
    for(const m of memories()){
      clear();const f=document.createElement('div');f.className='flash';ov.appendChild(f);setTimeout(()=>f.remove(),500);
      stage.innerHTML=`<div class="mem"><div class="chr" style="opacity:1;animation:none">${charAt(m.age,'happy')}</div><div class="age">${m.age}歳</div><div style="font-size:16px">${m.t}</div></div>`;
      await wait(1900);if(skipAll)throw 0;
    }
    // ③' 自分が書き残した言葉
    const DY=(S.diary||[]).filter(d=>d.kind!=='最期の言葉');
    if(DY.length){clear();line('あなたが書き残した言葉','sm',0);
      const pickD=DY.length<=3?DY:[DY[0],DY[Math.floor(DY.length/2)],DY[DY.length-1]];
      pickD.forEach((d,i)=>line(`<span style="color:#C7F94B;font-size:12px">${d.age}歳　${d.kind}</span><br>「${esc(d.t)}」`,'',800+i*1600));
      await wait(1800+pickD.length*1700);if(skipAll)throw 0;}
    // ④ 看取った人と最期の言葉
    clear();const W=watchers();
    if(W.length){line('最期にそばにいたのは','sm',0);
      const box=document.createElement('div');box.className='who';
      box.innerHTML=W.map((w,i)=>`<div style="animation-delay:${600+i*350}ms">${w.pet?'<div style="height:70px;line-height:70px;font-size:22px;color:#ddd">ねこ</div>':(()=>{try{return personSVG(w.p,Math.max(0,w.p.age||0),'sad',w.p.of);}catch(e){return '';}})()}${w.lb}</div>`).join('');
      stage.appendChild(box);}
    else line('最期は、ひとりだった。','',0);
    line(`「${S.lastWords?esc(S.lastWords):lastWords()}」`,'',W.length?600+W.length*350+900:1600);
    await wait(6200);if(skipAll)throw 0;
    // ⑤ 名前
    clear();
    stage.innerHTML=`<div class="chr" style="width:110px;height:110px">${charAt(S.age,'happy')}</div>`;
    line(fullName(),'big',300);line(`${S.birthY} ― ${S.year}`,'sm',1000);line(`${S.age}年の人生`,'',1800);
    const h=document.createElement('div');h.className='hint';h.textContent='タップして、人生をふりかえる';h.style.opacity=0;setTimeout(()=>h.style.opacity='',3000);ov.appendChild(h);
    await new Promise(r=>{next=r;});
  }catch(e){}
  ov.style.transition='opacity .8s';ov.style.opacity=0;setTimeout(()=>ov.remove(),800);
}
window.playDeath=playDeath;

const _endLife5=endLife;
endLife=function(cause){_endLife5(cause);try{playDeath(cause);}catch(e){console.warn(e);}};
})();
