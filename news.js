// =====================================================================
// 情報を読む ― 毎年のニュースと噂。本当のこともあれば、デマもある
// 情報源ごとに当たりやすさが違い、翌年に「答え合わせ」が届く
// =====================================================================
const NSRC=[
 {n:'経済新聞',acc:.8},{n:'テレビのニュース',acc:.68},{n:'会社の先輩',acc:.55},
 {n:'週刊誌',acc:.42},{n:'SNSのインフルエンサー',acc:.28},{n:'友人の噂',acc:.5}];
function mkDir(){ // 今年の株価の本当の動き
  if(hasHist(S.year)){const r=hv(H_NK,S.year)/hv(H_NK,S.year-1)-1;return r>.06?'up':r<-.06?'down':'flat';}
  return {boom:'up',normal:'flat',slump:'down',crash:'down'}[S.regime]||'flat';
}
function secDir(k){
  if(hasHist(S.year)){const R_=histReturns(S.year);const v=k==='gold'?R_.gold:k==='crypto'?R_.crypto:k==='land'?R_.land:R_.nk*1.5;if(v==null)return null;return v>.08?'up':v<-.08?'down':'flat';}
  const m=mkDir();if(k==='gold')return S.regime==='crash'?'up':m==='up'?'flat':'up';if(k==='crypto')return S.year<2010?null:m;return m;
}
const TOPIC={
 market:{n:'株価',up:['年内に日経平均は大きく上がる見通し','景気回復で「株を買うなら今」'],down:['年内に株価の大暴落が来ると専門家が警告','景気後退の足音。株は売り時か'],flat:['株価はしばらく横ばいが続く見込み']},
 ai:{n:'ハイテク株',up:['AI・半導体関連株がさらに急騰すると予想','次の10倍株はハイテクから'],down:['ハイテク株バブルは今年はじける','AI関連株に過熱感、急落の恐れ'],flat:['ハイテク株は一服の見通し']},
 gold:{n:'金',up:['有事の金。金価格は今年も上がる','金の買い時が来た'],down:['金価格はピークを越えた','金は今年下がる'],flat:['金価格は落ち着いた動き']},
 crypto:{n:'仮想通貨',up:['ビットコインが今年中に過去最高値を更新する','仮想通貨で億り人続出の予感'],down:['仮想通貨は今年暴落する','ビットコインはただのバブル'],flat:['仮想通貨は様子見ムード']},
 land:{n:'不動産',up:['都内のマンション価格はまだまだ上がる','家は今が買い時'],down:['不動産価格の下落が始まる','家を買うのは待て'],flat:['住宅価格は横ばい']},
};
const OPP={up:'down',down:'up',flat:null};
function genNews(){
  const items=[];const used=new Set();
  const topics=['market','ai','gold','land'];if(S.year>=2010)topics.push('crypto');
  const n=RI(2,3);
  for(let i=0;i<n;i++){const t=pick(topics.filter(x=>!used.has(x)));if(!t)break;used.add(t);
    const truth=t==='market'?mkDir():secDir(t);if(!truth)continue;
    const src=pick(NSRC);const honest=chance(src.acc);
    let claim=honest?truth:(OPP[truth]||pick(['up','down']));
    items.push({kind:t,src:src.n,claim,truth,txt:pick(TOPIC[t][claim])});}
  // 会社の噂
  if(WORKING()&&S.age<=63&&chance(.35)){const k=chance(.6)?'risutora':'bonus';const truth=chance(.45);const src=pick([{n:'社内の噂',acc:.6},{n:'給湯室の立ち話',acc:.45},{n:'人事部の知り合い',acc:.75}]);
    const claim=chance(src.acc)?truth:!truth;
    items.push({kind:k,src:src.n,claim,truth,txt:k==='risutora'?(claim?'うちの会社、来年リストラがあるらしい':'リストラの話は、ただの噂らしい'):(claim?'今年は業績がいいから、ボーナスが増えるらしい':'今年のボーナスは減るらしい')});
    if(k==='risutora'&&truth){S.flags.layoffY=S.year+1;S.flags.layoffJob=S.job.id;}
    if(k==='bonus'&&truth){S.flags.bonusY=S.year;S.flags.bonusJob=S.job.id;}}
  S.newsNow={y:S.year,items};
}
const CLAIM_JP={up:'上がる',down:'下がる',flat:'横ばい'};
function newsCheck(){ // 去年のニュースの答え合わせ
  const P=S.newsNow;if(!P||P.y!==S.year-1)return;S.srcStat=S.srcStat||{};
  P.items.forEach(it=>{const hit=it.claim===it.truth;const st=S.srcStat[it.src]=S.srcStat[it.src]||{hit:0,n:0};st.n++;if(hit)st.hit++;
    if(['risutora','bonus'].includes(it.kind))return;
    if(chance(.6))S.notes.push(`答え合わせ：去年の「${it.txt}」（${it.src}）は、${hit?'当たった':'外れた'}。`);});
}
const _startYearN=startYear;
startYear=function(first){_startYearN(first);if(!S)return;
  if(!first)newsCheck();
  if(S.age>=16)genNews();
  // 去年のボーナスの噂が本当だった
  if(S.flags.bonusY===S.year-1&&S.flags.bonusJob===S.job.id){S.flags.bonusY=0;const v=Math.round(S.job.salary*.08);if(v>0){gain(v,'業績連動ボーナス');S.notes.push(`噂どおり、ボーナスが増えた（${yen(v)}）。`);}}
};
D('n_layoff',{a:[22,64],m:true,c:()=>S.flags.layoffY===S.year&&S.flags.layoffJob===S.job.id&&WORKING(),mk:()=>{S.flags.layoffY=0;const sev=Math.round(S.job.salary*RF(.8,1.5));
  return E('リストラ',`噂は本当だった。会社が「早期退職者」を募り始めた。<br>応じれば、割増の退職金が約${yen(sev)}出る。残れば、どの部署に回されるかはわからない。`,[
  O('早期退職に応じる',()=>{gain(sev,'割増退職金');setJob('none');log('早期退職');S.queue.push(evOffers('次の仕事を探し始めた。',false));return '会社を去った。退職金の重みは、思ったより軽かった。';}),
  O('しがみつく',()=>{if(chance(.5)){S.job.salary*=.8;mod({mental:-10});return '残れた。ただ、窓際の部署に回され、給料は2割減った。';}mod({mental:-4});return '残れた。周りの席が、いくつも空いていた。';}),
  O('すでに転職先を探している',()=>{S.queue.push(evOffers('転職活動をしていた。',false));return '準備はしていた。';})]);}});

// ---- 「今年のニュースと噂」欄 ----
const NBTN={
 market:{up:{t:'日本株を買う',c:50,f:()=>buyIdx(50)},down:{t:'株を全部売る',c:0,f:()=>{const v=sellAllRisk(0);return `${yen(v)}を現金にした。`;},show:()=>riskAssets()>=5}},
 ai:{up:{t:'ハイテク株を買う',c:30,f:()=>{pay(30,'ハイテク株');const a=S.port.ai||(S.port.ai={v:0,basis:0});a.v+=30;a.basis+=30;}}},
 gold:{up:{t:'金を買う',c:30,f:()=>{pay(30,'金');const a=S.port.gold||(S.port.gold={v:0,basis:0});a.v+=30;a.basis+=30;}}},
 crypto:{up:{t:'ビットコインを買う',c:20,f:()=>{pay(20,'ビットコイン');const a=S.port.crypto||(S.port.crypto={v:0,basis:0});a.v+=20;a.basis+=20;}}},
 risutora:{true:{t:'転職活動を始める',c:0,f:()=>{S.queue.push(evOffers('転職サイトに登録した。',false));}}},
};
(window.EXTRA_SECS=window.EXTRA_SECS||[]).push(()=>{
  if(!S||S.age<16||!S.newsNow||S.newsNow.y!==S.year||!S.newsNow.items.length)return null;
  const s=document.createElement('div');s.className='sec';
  s.innerHTML=`<h3>今年のニュースと噂<span>本当かどうかは、来年わかる</span></h3><div class="acts"></div>`;
  const g=s.querySelector('.acts');const st=S.srcStat||{};
  S.newsNow.items.forEach((it,i)=>{const sc=st[it.src];const b=NBTN[it.kind]&&NBTN[it.kind][String(it.claim)];
    const show=b&&(!b.show||b.show())&&S.age>=18;const k='news'+i;
    const el=document.createElement('button');el.className='act'+(S.used[k]?' done':'');
    el.innerHTML=`【${it.src}】${it.txt}${show?`<span class="c">${b.t}${b.c?'（'+yen(b.c)+'）':''}</span>`:''}<small>${sc?`この情報源のこれまでの的中：${sc.hit}/${sc.n}`:'この情報源の当たりやすさは、まだわからない'}</small>`;
    if(show)el.disabled=!!S.used[k]||S.cash<b.c;else el.style.pointerEvents='none';
    if(show)el.onclick=()=>{if(S.used[k])return;S.used[k]=1;const r=b.f();const t=r||`${b.t}。`;S.notes.push(t);S.lastRes=t;render();};
    g.appendChild(el);});
  return s;
});
