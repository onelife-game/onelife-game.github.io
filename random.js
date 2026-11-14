// =====================================================================
// ランダム性の強化
//  1) 子どものお金（お小遣い・お年玉）を家ごと・年ごとにバラバラに
//  2) 「お金を使う」の選択肢を毎年入れ替え、値段も変動
//  3) 選択肢ごとの“運”を人生ごとに隠しで決める（ついてない選択肢／ツイてる選択肢）
//  4) 人生の時期ごとの追い風・向かい風
//  5) 「今年だけの話」― 毎年ランダムに出てくる一回きりのチャンス
// =====================================================================
const RI=(a,b)=>a+Math.floor(R()*(b-a+1));
const RF=(a,b)=>a+R()*(b-a);
const r1=v=>Math.round(v*10)/10;
function wpk(o){let t=0;for(const k in o)t+=o[k];let r=R()*t;for(const k in o){r-=o[k];if(r<0)return k;}return Object.keys(o)[0];}
// 子どもは借金できないので、持っている分までしか減らない
function lose(v,label){v=S.age<18?Math.min(Math.max(0,S.cash),v):v;if(v>0)pay(r1(v),label);return v;}

// ---------------------------------------------------------------------
// 1) 子どものお金
// ---------------------------------------------------------------------
const ALLOW_T={
  fixed:{n:'毎月決まった額をもらえる'},
  chore:{n:'家の手伝いをした月だけもらえる'},
  reward:{n:'テストの点しだいでもらえる'},
  none:{n:'お小遣いはなし。必要なときにお願いする'}};
const OTOSHI_T={
  keep:{n:'お年玉は全部自分のもの'},
  half:{n:'お年玉は半分、親が「預かる」'},
  taken:{n:'お年玉は親に回収される'},
  saved:{n:'お年玉は親が貯金してくれている（らしい）'}};
function kidRules(){
  if(S.kidm)return S.kidm;
  const r=S.fam.rank;
  S.kidm={
    allow:wpk(r<=1?{fixed:2,chore:3,reward:1,none:4}:r===2?{fixed:4,chore:3,reward:2,none:1}:{fixed:5,chore:1,reward:2,none:1}),
    otoshi:wpk(r<=1?{keep:2,half:2,taken:5,saved:1}:r===2?{keep:3,half:3,taken:2,saved:3}:{keep:4,half:2,taken:1,saved:4}),
    rel:RI(0,3)+(r>=3?RI(1,3):RI(0,2)),   // お年玉をくれる親戚の数
    base:RF(.6,1.4),                       // その家のお小遣いの相場
    bank:0,told:{}};
  return S.kidm;
}
function kidIncome(){
  const K=kidRules(),a=S.age,N=S.notes,rk=[.5,.75,1,1.3,1.9][S.fam.rank];
  // ---- お小遣い（6歳から） ----
  if(a>=6){
    if(!K.told.allow){K.told.allow=1;N.push(`うちのルール：${ALLOW_T[K.allow].n}。`);}
    const month=(a<9?.05:a<12?.1:.25)*K.base*rk; // 万円／月
    let allow=0,why='';
    if(K.allow==='fixed'){allow=month*12;
      if(chance(.12)){allow*=.5;why=pick(['成績が下がって、お小遣いを半分にされた。','家計が苦しいらしく、お小遣いが減った。']);}
      else if(chance(.12)){allow*=1.5;why='学年が上がって、お小遣いが少し増えた。';}}
    else if(K.allow==='chore'){
      if(S.used.otetsudai){allow=month*RI(6,12);why='手伝いを続けて、お小遣いをもらえた。';}
      else if(chance(.5))why='手伝いをさぼったので、今年はお小遣いがほとんどなかった。';}
    else if(K.allow==='reward'){const s=S.st.study;allow=month*12*(s<35?.2:s<55?.6:s<75?1:1.6);
      why=s<35?'テストの点が悪く、お小遣いはほとんどもらえなかった。':s>=75?'テストで高得点を取り続け、ごほうびが多かった。':'';}
    else{allow=chance(.5)?RF(.1,.6)*rk:0;if(allow)why='どうしても欲しいものがあると言ったら、少しだけお金をくれた。';}
    allow=r1(allow*RF(.85,1.15));
    if(allow>0)gain(allow,'お小遣い');
    if(why&&chance(.7))N.push(why);
  }
  // ---- お年玉（3歳から） ----
  if(a>=3){
    if(!K.told.otoshi){K.told.otoshi=1;N.push(`うちのルール：${OTOSHI_T[K.otoshi].n}。`);}
    let rel=K.rel+(chance(.15)?-RI(1,2):0)+(chance(.1)?RI(1,2):0);
    let per=(a<6?.2:a<12?.4:.7)*rk;
    if(chance(.1)){rel=0;N.push(pick(['今年の正月は親戚の集まりがなく、お年玉はなかった。','親戚とけんか中で、今年は誰の家にも行かなかった。']));}
    let tot=r1(Math.max(0,rel)*per*RF(.6,1.4));
    if(tot>0&&chance(.05)){tot=r1(tot+RF(1,3));N.push('羽振りのいい親戚のおじさんが、ポンと1万円札を何枚もくれた。');}
    if(tot>0){
      if(K.otoshi==='keep')gain(tot,'お年玉');
      else if(K.otoshi==='half'){gain(r1(tot/2),'お年玉（半分）');if(chance(.3))N.push('「半分は預かっておくね」と言われたお年玉は、二度と戻ってこなかった。');}
      else if(K.otoshi==='taken'){const k=r1(tot*(chance(.3)?.2:0));if(k>0)gain(k,'お年玉（残った分）');if(chance(.4))N.push(pick(['お年玉は全部、母に回収された。','お年玉の袋だけが手元に残った。','「お返しにお金がかかるの」と、お年玉は取り上げられた。']));}
      else{K.bank+=tot;if(chance(.25))N.push('お年玉は、親が通帳に入れてくれた。');}
    }
  }
  // ---- 中学卒業時：預けていたお年玉は戻ってくるか ----
  if(a===14&&K.otoshi==='saved'&&K.bank>0){
    if(chance(.6)){gain(r1(K.bank),'お年玉貯金（親から）');N.push(`親が「あなたのお年玉、全部貯めておいたよ」と通帳を渡してくれた。${yen(r1(K.bank))}あった。`);}
    else N.push('貯めてくれていたはずのお年玉の通帳を見せてと言ったら、親は目をそらした。家計の足しに消えていた。');
    K.bank=0;
  }
}

// ---------------------------------------------------------------------
// 2) 毎年の選択肢を入れ替える
// ---------------------------------------------------------------------
// 人生の大事な選択に関わるものは、毎年必ず出す
const ACT_ALWAYS=['otetsudai','baby','juku','quitSmoke','quitDrink','dock','counsel','konkatsu','soudanjo','date','oyakoko'];
function yearOffer(av){
  if(S.offerAge!==S.age){S.offerAge=S.age;S.offerOut={};S.offerPrice={};}
  const free=av.filter(x=>!ACT_ALWAYS.includes(x.id));
  free.forEach(x=>{if(S.offerOut[x.id]==null)S.offerOut[x.id]=chance(.4)?1:0;});
  let show=av.filter(x=>ACT_ALWAYS.includes(x.id)||!S.offerOut[x.id]);
  // 少なすぎるときは足す
  const need=Math.min(3,free.length)-free.filter(x=>!S.offerOut[x.id]).length;
  for(let i=0;i<need;i++){const c=free.find(x=>S.offerOut[x.id]);if(!c)break;S.offerOut[c.id]=0;show=av.filter(x=>ACT_ALWAYS.includes(x.id)||!S.offerOut[x.id]);}
  return show;
}
// 値段は毎年すこし変わる（セール・値上がり）
function priceOf(a,c){
  if(!c||c<=0)return c;
  if(S.offerAge!==S.age){S.offerAge=S.age;S.offerOut={};S.offerPrice={};}
  if(S.offerPrice[a.id]==null)S.offerPrice[a.id]=chance(.15)?RF(.5,.75):chance(.15)?RF(1.25,1.6):RF(.9,1.1);
  return Math.max(.1,r1(c*S.offerPrice[a.id]));
}
function priceTag(a){const m=S.offerPrice&&S.offerPrice[a.id];if(!m)return '';return m<.8?'<span class="rt" style="color:var(--lime)">セール</span>':m>1.2?'<span class="rt" style="color:var(--red)">値上がり</span>':'';}

// ---------------------------------------------------------------------
// 3) 選択肢ごとの隠れた運（人生ごとに変わる）
// ---------------------------------------------------------------------
function fateOf(id){S.fate=S.fate||{};if(!S.fate[id])S.fate[id]=wpk({curse:15,bless:15,normal:70});return S.fate[id];}
function lifeStage(a){return a<13?0:a<23?1:a<40?2:a<60?3:4;}
function tide(){S.tides=S.tides||[0,1,2,3,4].map(()=>wpk({'-1':3,'0':4,'1':3})|0);return +S.tides[lifeStage(S.age)];}
function luckRoll(id){
  const f=fateOf(id),t=tide()*.06;
  let bad=f==='curse'?.5:f==='bless'?.03:.1,good=f==='bless'?.45:f==='curse'?.03:.08;
  bad=Math.max(0,bad-t);good=Math.max(0,good+t);
  const r=R();return r<bad?'bad':r<bad+good?'good':'';
}
// ハプニング（時期ごと）
const HAP={
 bad:[
  [0,12,()=>{mod({health:-4});return 'でも帰り道、転んでひざをすりむいた。';}],
  [0,12,()=>{const v=lose(.3,'落とし物');return v?'でも、ポケットに入れていた小銭をどこかで落とした。':'でも、帰りに大事なキーホルダーをなくした。';}],
  [5,14,()=>{friends().forEach(f=>f.close-=6);mod({mental:-4});return 'でも、そのことで友達とけんかになった。';}],
  [6,14,()=>{mod({mental:-3});parents().forEach(p=>p.close-=4);return 'でも、親にバレて怒られた。';}],
  [13,22,()=>{mod({mental:-5});return 'でも、それを見ていたクラスの子に陰口を言われた。';}],
  [13,22,()=>{lose(1.5,'スマホの修理');return 'でも、浮かれていたらスマホを落として画面を割った。';}],
  [15,90,()=>{lose(RF(2,6),'思わぬ出費');return pick(['でも、帰りにタクシー代がかさんだ。','でも、ついでに余計なものまで買ってしまった。','でも、財布をすられた。']);}],
  [18,90,()=>{mod({health:-6});return pick(['でも、そのあと風邪をひいて一週間寝込んだ。','でも、疲れがたまってぎっくり腰になった。']);}],
  [18,90,()=>{mod({mental:-6});return pick(['でも、思っていたのと全然違って、がっかりした。','でも、SNSに書いた感想が炎上しかけた。','でも、知り合いに見られて気まずい思いをした。']);}],
  [23,70,()=>{mod({skill:-2,mental:-3});return 'でも、そのせいで仕事のミスが増え、上司に呼び出された。';}],
  [60,110,()=>{mod({health:-5});return 'でも、帰り道の段差でつまずいて、手首をひねった。';}],
  [60,110,()=>{lose(RF(5,20),'詐欺の被害');mod({mental:-6});return 'でも、その帰りに声をかけてきた男に、うまくお金をだまし取られた。';}]],
 good:[
  [0,12,()=>{mod({mental:5});friends().forEach(f=>f.close+=4);return 'しかも、そこで仲のいい友達ができた。';}],
  [3,14,()=>{gain(r1(RF(.1,.5)),'ラッキー');return pick(['しかも、道で拾った財布を届けたら、お礼をもらえた。','しかも、商店街のくじ引きで当たりが出た。']);}],
  [6,14,()=>{mod({study:3});parents().forEach(p=>p.close+=5);return 'しかも、それを親がすごくほめてくれた。';}],
  [13,22,()=>{mod({charm:3,mental:4});return 'しかも、気になっていた子に「いいね」と言われた。';}],
  [15,90,()=>{gain(r1(RF(1,5)),'ラッキー');return pick(['しかも、キャンペーンで全額キャッシュバックされた。','しかも、ポイントが10倍の日だった。','しかも、福引で商品券が当たった。']);}],
  [18,90,()=>{if(chance(.6))addPerson('friend','偶然知り合った人');mod({mental:5,comm:2});return 'しかも、そこで気の合う人と知り合った。';}],
  [18,90,()=>{mod({mental:8});return pick(['しかも、思っていた何倍も楽しかった。','しかも、それがきっかけで毎日が少し明るくなった。']);}],
  [23,70,()=>{mod({skill:3});if(S.job&&S.job.salary)S.job.salary+=RI(3,10);return 'しかも、そこで聞いた話が仕事のヒントになり、給料が少し上がった。';}],
  [60,110,()=>{mod({health:4,mental:5});return 'しかも、なんだか体の調子がよくなった。';}]]};
function happening(kind){const L=HAP[kind].filter(h=>S.age>=h[0]&&S.age<=h[1]);return L.length?pick(L)[2]():'';}
function fateTwist(x,r){
  const k=luckRoll(x.id);if(!k)return r;
  S.fateSeen=S.fateSeen||{};const fs=S.fateSeen[x.id]=S.fateSeen[x.id]||{bad:0,good:0};fs[k]++;
  const t=happening(k);return t?(r?r+t:t):r;
}
function fateTag(x){const fs=S.fateSeen&&S.fateSeen[x.id];if(!fs)return '';
  if(fs.bad>=2&&fs.bad>fs.good)return '<small style="color:var(--red)">なぜか、これをすると毎回ついてない…</small>';
  if(fs.good>=2&&fs.good>fs.bad)return '<small style="color:var(--gold)">これをすると、なぜかツイてる</small>';return '';}

// ---------------------------------------------------------------------
// 4) 時期の変わり目に、流れが変わる
// ---------------------------------------------------------------------
const TIDE_TX={
  '-1':['最近、なにをやってもうまくいかない気がする。','どうも運に見放されている気がする。','歯車が少しずつ狂い始めた気がした。'],
  '1':['最近、なんだかツイている気がする。','風向きが変わった。そんな予感がした。','不思議と、いいことが続いている。']};
const _startYearR=startYear;
startYear=function(first){
  _startYearR(first);
  if(!S)return;
  if([6,13,23,40,60].includes(S.age)&&S.lastTideAge!==S.age){S.lastTideAge=S.age;const t=tide();if(t)S.notes.push(pick(TIDE_TX[t]));}
};

// ---------------------------------------------------------------------
// 1') 家の手伝い（お小遣いのルールしだいで意味が変わる）
// ---------------------------------------------------------------------
ACTS.unshift({id:'otetsudai',n:'家の手伝いをする',c:0,a:[5,14],
  get d(){const K=S&&S.kidm;return K&&K.allow==='chore'?'今年のお小遣いがもらえる':'親との仲が深まる・素行+2';},
  f:()=>{const K=kidRules();mod({moral:2});livingParents().forEach(p=>p.close+=4);
    if(K.allow==='chore')return pick(['お風呂掃除を毎日やった。','洗濯物をたたむのが自分の係になった。','妹弟の面倒を見た。']);
    if(K.allow==='none'&&chance(.35)){gain(r1(RF(.1,.3)),'お駄賃');return '手伝ったら、母がこっそりお駄賃をくれた。';}
    return pick(['夕飯の買い物についていった。','玄関の掃き掃除をした。','父の洗車を手伝った。']);}});

// ---------------------------------------------------------------------
// 5) 今年だけの話（毎年ランダムに1〜2個）
//  結果は「その人生でのこの話の運」で決まる。何度も出てくるうちに傾向が見えてくる
// ---------------------------------------------------------------------
const CH=[
 {id:'ennichi',n:'縁日のくじ引きを引く',a:[5,12],c:.03,d:'1等はゲーム機',
  good:()=>{mod({mental:10});return '1等が当たった！ 屋台のおじさんが悔しそうな顔をした。';},
  bad:()=>{mod({mental:-2});return 'ハズレだった。あとで、当たりは最初から入っていないと噂で聞いた。';}},
 {id:'kenshou',n:'雑誌の懸賞にはがきを出す',a:[7,14],c:.01,d:'当たれば図書カード',
  good:()=>{gain(.3,'懸賞');mod({mental:5});return '当選のはがきが届いた！';},
  bad:()=>'何も届かなかった。'},
 {id:'cardTrade',n:'友達とカードを交換する',a:[7,14],c:0,d:'レアカードが手に入るかも',
  good:()=>{mod({mental:6});friends().forEach(f=>f.close+=4);return 'とんでもないレアカードを手に入れた。クラスの英雄になった。';},
  bad:()=>{friends().forEach(f=>f.close-=6);mod({mental:-4});return 'あとで価値を知って揉めた。友達とぎくしゃくした。';}},
 {id:'gacha',n:'こづかいを全部ガチャに使う',a:[9,17],c:S=>Math.max(.1,r1(S.cash*.8)),d:'持っているお金の8割',
  good:()=>{mod({mental:12});return '一発で最高レアを引いた。';},
  bad:()=>{mod({mental:-6});return '何も出なかった。画面を見つめたまま動けなかった。';}},
 {id:'fukubukuro',n:'初売りで福袋を買う',a:[14,90],c:3,d:'中身は開けてのお楽しみ',
  good:()=>{gain(r1(RF(3,10)),'福袋の中身を売った');mod({mental:6});return '大当たり。中身を売ったら倍になった。';},
  bad:()=>{mod({mental:-3});return '売れ残りを詰め込んだだけの中身だった。';}},
 {id:'furima',n:'フリマで掘り出し物を探す',a:[16,85],c:2,d:'転売できるかも',
  good:()=>{gain(r1(RF(8,25)),'転売');return '古いゲームソフトがプレミア品だった。ネットで高く売れた。';},
  bad:()=>{mod({mental:-3});return '買ったブランド品は、よくできた偽物だった。';}},
 {id:'mouke',n:'友達の儲け話に乗る',a:[20,70],c:30,d:'「絶対に儲かる」らしい',c2:()=>friends().length>0,
  good:()=>{gain(r1(RF(45,90)),'儲け話の配当');return '本当に儲かった。友達に焼肉をおごった。';},
  bad:()=>{const f=friends()[0];if(f)f.close-=25;mod({mental:-10});return 'お金は戻ってこなかった。友達とも連絡がつかなくなった。';}},
 {id:'cf',n:'気になるクラファンに出資する',a:[20,75],c:5,d:'リターンが届くかも',
  good:()=>{mod({mental:8,skill:2});return '届いた商品が想像以上に良かった。作った人とも仲良くなった。';},
  bad:()=>{mod({mental:-4});return 'プロジェクトは途中で音信不通になった。';}},
 {id:'yatai',n:'地元の祭りで屋台を出す',a:[18,65],c:5,d:'うまくいけば一儲け',
  good:()=>{gain(r1(RF(10,25)),'屋台の売上');mod({comm:4});return '行列ができた。焼きそばが飛ぶように売れた。';},
  bad:()=>{mod({health:-3,mental:-4});return '夕方から大雨。材料がほとんど残った。';}},
 {id:'dousou',n:'同窓会に顔を出す',a:[23,85],c:1,d:'昔の仲間に会える',
  good:()=>{addPerson('friend','同級生');mod({mental:8});return '昔の親友と再会した。また会う約束をした。';},
  bad:()=>{mod({mental:-6});return '自慢話ばかり聞かされて、帰り道がやけに寒かった。';}},
 {id:'seminar',n:'無料の投資セミナーに行く',a:[25,80],c:0,d:'お金の勉強になるかも',
  good:()=>{mod({study:4});gain(r1(RF(5,20)),'教わった方法で利益');return '講師が意外とまともだった。教わったやり方で小さく儲けた。';},
  bad:()=>{lose(r1(RF(30,80)),'高額な情報商材');mod({mental:-8});return '帰る頃には、高額な情報商材を契約させられていた。';}},
 {id:'kenkou',n:'すすめられた健康食品を試す',a:[50,100],c:6,d:'体にいいらしい',
  good:()=>{mod({health:6});return '飲み始めてから、不思議と体が軽い。';},
  bad:()=>{lose(r1(RF(10,30)),'定期購入の解約金');mod({mental:-5});return '気づいたら高額な定期購入になっていた。';}},
 {id:'chounai',n:'町内会のくじ引き',a:[60,110],c:.1,d:'1等は温泉旅行',
  good:()=>{mod({mental:12,health:3});return '1等の温泉旅行が当たった。久しぶりにゆっくりした。';},
  bad:()=>'ポケットティッシュだった。'},
 {id:'oldgame',n:'押し入れの古いものを売る',a:[25,90],c:0,d:'値打ちものがあるかも',
  good:()=>{gain(r1(RF(5,40)),'古いものが売れた');return '子どもの頃のおもちゃに、驚くほどの値がついた。';},
  bad:()=>{mod({mental:-3});return 'ほとんど値がつかなかった。思い出まで安く見積もられた気がした。';}},
];
function chCost(x){return typeof x.c==='function'?x.c(S):x.c;}
function chanceOffers(){
  if(S.chAge!==S.age){S.chAge=S.age;const el=CH.filter(x=>S.age>=x.a[0]&&S.age<=x.a[1]&&(!x.c2||x.c2()));
    const n=chance(.25)?0:chance(.35)?2:1;S.chList=[];
    for(let i=0;i<n&&el.length;i++){const j=Math.floor(R()*el.length);S.chList.push(el.splice(j,1)[0].id);}}
  return (S.chList||[]).map(id=>CH.find(x=>x.id===id)).filter(Boolean);
}
function chanceSection(){
  const L=chanceOffers();if(!L.length)return null;
  const s=document.createElement('div');s.className='sec';s.innerHTML=`<h3>今年だけの話<span>来年はもうない</span></h3><div class="acts"></div>`;
  const g=s.querySelector('.acts');
  L.forEach(x=>{const c=chCost(x),k='ch_'+x.id;const b=document.createElement('button');b.className='act'+(S.used[k]?' done':'');b.disabled=!!S.used[k]||S.cash<c;
    b.innerHTML=`${x.n}<span class="c">${c?yen(c):'無料'}</span><small>${x.d}</small>${fateTag({id:k})}`;
    b.onclick=()=>{if(S.used[k])return;if(S.cash<c){toast('お金が足りない');return;}S.used[k]=1;if(c)pay(c,x.n);
      const f=fateOf(k),t=tide()*.08;const p=f==='bless'?.92:f==='curse'?.06:.45+t;const ok=chance(p);
      S.fateSeen=S.fateSeen||{};const fs=S.fateSeen[k]=S.fateSeen[k]||{bad:0,good:0};fs[ok?'good':'bad']++;
      const r=(ok?x.good:x.bad)();if(r){S.notes.push(r);S.lastRes=r;}render();$('#main').scrollTop=0;};
    g.appendChild(b);});
  return s;
}
