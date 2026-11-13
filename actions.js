// =====================================================================
// 毎年の行動（お金で動く）
// =====================================================================
const ACTS=[
 // ---- 子ども（お小遣い） ----
 {id:'manga',n:'漫画や本を買う',c:.3,a:[6,14],d:'学力+2・スキル+1',f:()=>{mod({study:2,skill:1});return '本を読みふけった。';}},
 {id:'game',n:'ゲームに課金する',c:.5,a:[7,14],d:'メンタル+5・学力−1',f:()=>{mod({mental:5,study:-1});return 'ガチャを回した。最高レアは出なかった。';}},
 {id:'dagashi',n:'駄菓子屋で買い食い',c:.1,a:[5,12],d:'メンタル+2・友人と仲良く',f:()=>{mod({mental:2});friends().forEach(f=>f.close+=3);return '友達とうまい棒を分け合った。';}},
 {id:'kodomoOshare',n:'おしゃれをする',c:.5,a:[10,14],d:'魅力+3',f:()=>{mod({charm:3});return '新しい服で学校に行った。';}},
 {id:'kodomoAsobi',n:'友達と遊びに行く',c:.3,a:[8,14],d:'友人との仲が深まる',c2:()=>friends().length>0,f:()=>{friends().forEach(f=>f.close+=6);mod({comm:2,mental:3});return '自転車で隣町まで行った。';}},
 {id:'present',n:'親にプレゼントを贈る',c:.2,a:[6,17],d:'親が喜ぶ',c2:()=>livingParents().length>0,f:()=>{livingParents().forEach(p=>p.close+=10);mod({moral:2});return '母の日にカーネーションを渡した。照れくさそうに笑っていた。';}},
 {id:'sportsClub',n:'地域のスポーツクラブに入る',c:.5,a:[6,14],d:'コミュ+4・体力+3',f:()=>{mod({comm:4,health:3});if(chance(.3))addPerson('friend','チームメイト',{age:S.age});return '週末は少年団の練習に通った。';}},
 {id:'kodomoKai',n:'児童館・子ども会の行事に出る',c:0,a:[5,12],d:'コミュ+3・友人ができるかも',f:()=>{mod({comm:3,mental:1});if(chance(.25))addPerson('friend','近所の友達',{age:S.age});return '学年の違う子とも遊ぶようになった。';}},
 // ---- 10代 ----
 {id:'clothes',n:'服を買う',c:2,a:[15,22],d:'魅力+4',f:()=>{mod({charm:4});return '原宿で服を買った。';}},
 {id:'karaoke',n:'カラオケ・ゲーセンで遊ぶ',c:1,a:[13,22],d:'友人との仲が深まる',c2:()=>friends().length>0,f:()=>{friends().forEach(f=>f.close+=7);mod({mental:4,comm:2});return '友達と朝まで歌った。';}},
 {id:'sankosho',n:'参考書を買って勉強する',c:1,a:[13,19],d:'学力+5',f:()=>{mod({study:5});return '机に向かう時間が増えた。';}},
 {id:'yobiko',n:'塾・予備校に通う',c:S=>S.fam.rank>=2&&S.age<19?0:30,a:[12,19],d:'学力+10（家計が普通以上なら親が払う）',f:()=>{mod({study:10,mental:-2});if(S.fam.rank>=2)famMoneyAdj(-3);return '塾に通い始めた。成績が少しずつ上がっていく。';}},
 {id:'biyou',n:'脱毛・美容に通う',c:8,a:[16,50],d:'魅力+6',f:()=>{mod({charm:6});return '鏡を見るのが少し楽しくなった。';}},
 {id:'volunteer',n:'ボランティア・地域のお祭り',c:1,a:[14,90],d:'コミュ+5・素行+2',f:()=>{mod({comm:5,moral:2});if(chance(.2))addPerson('friend','ボランティア仲間');return pick(['商店街の夏祭りで神輿を担いだ。','フードバンクで仕分けを手伝った。','隅田川の清掃に参加した。']);}},
 {id:'shakaijin',n:'社会人サークル・趣味の集まり',c:6,a:[18,75],d:'コミュ+6・友人ができる',f:()=>{mod({comm:6,mental:4});if(chance(.35))addPerson('friend','サークル仲間');return pick(['フットサルのサークルに入った。','ボードゲーム会に通い始めた。','ランニングクラブで皇居を走った。']);}},
 {id:'speech',n:'話し方・プレゼン講座',c:15,a:[18,65],d:'コミュ+8',f:()=>{mod({comm:8});return '人前で話すのが、少しだけ怖くなくなった。';}},
 {id:'baby',n:'子どもをつくる',c:0,a:[18,70],d:'妊娠を目指す（産むのは母親22〜42歳ごろ）',c2:()=>S.spouse&&!S.flags.tryBaby&&S.kids.length<6&&(S.sex==='F'?S.age:S.spouse.age)>=18&&(S.sex==='F'?S.age:S.spouse.age)<=44,f:()=>{S.flags.tryBaby=1;S.flags.noKids=0;return `${S.spouse.name}と話し合い、子どもを持つことにした。`;}},
 // ---- 大人 ----
 {id:'school',n:'資格・英会話スクール',c:30,a:[18,64],d:'スキル+8・学力+3',f:()=>{mod({skill:8,study:3});if(chance(.2))addPerson('friend','スクール仲間');return '仕事帰りにスクールに通った。';}},
 {id:'gym',n:'ジムに通う',c:10,a:[16,85],d:'体力+8・魅力+3',f:()=>{mod({health:8,charm:3});return '週3回ジムに通い、体が引き締まった。';}},
 {id:'nomikai',n:'友人と飲みに行く',c:5,a:[20,85],d:'友人との仲が深まる',c2:()=>friends().length>0,f:()=>{const f=friends().sort((a,b)=>a.close-b.close)[0];friends().forEach(x=>x.close+=6);f.close+=14;mod({mental:5});if(S.vice.drink>0)S.vice.drink+=3;return `${f.name}たちと飲んだ。久しぶりに腹を抱えて笑った。`;}},
 {id:'konkatsu',n:'婚活パーティー・アプリ',c:5,a:[20,60],d:'恋人ができるかも',c2:()=>!S.partner&&!S.spouse,f:()=>{if(S.st.charm*.6+S.st.comm*.4+R()*45>68){S.queue.push(evMeet('婚活パーティー'));return '気になる人と連絡先を交換した。';}return '何人かと話したが、ピンと来なかった。';}},
 {id:'soudanjo',n:'結婚相談所に入会',c:30,a:[25,60],d:'条件のいい相手と出会いやすい',c2:()=>!S.partner&&!S.spouse,f:()=>{S.queue.push(evMeet('結婚相談所',1));return 'カウンセラーから、ある人を紹介された。';}},
 {id:'date',n:'デート・記念日',c:15,a:[16,90],d:'恋人・配偶者との仲が深まる',c2:()=>S.partner||S.spouse,f:()=>{if(S.partner)S.partner.close+=20;if(S.spouse)S.spouse.close+=18;mod({mental:6});return '特別な一日を過ごした。';}},
 {id:'trip',n:'家族旅行（国内）',c:30,a:[22,90],d:'家族みんなの仲が深まる',c2:()=>S.spouse||S.kids.some(k=>!k.indep),f:()=>{if(S.spouse)S.spouse.close+=12;S.kids.forEach(k=>{if(!k.indep)k.close+=12,kidMod(k,{mental:5});});mod({mental:8});S.mood='happy';return pick(['沖縄の海で、子どもがはしゃいでいた。','北海道でカニを食べた。','箱根の温泉で、のんびりした。']);}},
 {id:'kaigai',n:'海外旅行',c:60,a:[18,85],d:'メンタル+15・視野が広がる',f:()=>{mod({mental:15,study:2});if(S.spouse)S.spouse.close+=10;S.mood='happy';return pick(['ハワイで一週間過ごした。','ヨーロッパを周遊した。','台湾で屋台めぐりをした。']);}},
 {id:'oyakoko',n:'親孝行する',c:10,a:[18,80],d:'親が喜ぶ',c2:()=>livingParents().length>0,f:()=>{livingParents().forEach(p=>p.close+=15);mod({mental:4,moral:2});return '親を食事に連れて行った。昔話をたくさんした。';}},
 {id:'kidPlay',n:'子どもと思い切り遊ぶ',c:5,a:[20,80],d:'子どもとの仲が深まる',c2:()=>S.kids.some(k=>!k.indep&&k.age<18),f:()=>{S.kids.forEach(k=>{if(!k.indep&&k.age<18){k.close+=15;kidMod(k,{mental:6});}});return '休日に子どもとキャッチボールをした。';}},
 {id:'juku',n:'子どもを塾に通わせる',c:0,a:[25,80],d:'子どもの学力が上がる（毎年の費用が増える）',c2:()=>S.kids.some(k=>!k.indep&&k.age>=8&&k.age<18&&!k.juku),f:()=>{S.kids.forEach(k=>{if(!k.indep&&k.age>=8&&k.age<18)k.juku=1;});return '子どもを塾に通わせることにした。';}},
 {id:'dock',n:'人間ドックを受ける',c:5,a:[30,95],d:'病気の早期発見',f:()=>{S.flags.dockYear=S.age;if(S.illness){S.flags.early=1;return '人間ドックで異常が見つかった。早めに治療を始められる。';}return '異常なし。ほっとした。';}},
 {id:'counsel',n:'カウンセリングを受ける',c:10,a:[15,90],d:'メンタル+15',f:()=>{mod({mental:15});return '話を聞いてもらうだけで、少し楽になった。';}},
 {id:'quitSmoke',n:'禁煙外来に通う',c:5,a:[18,90],d:'タバコをやめられるかも',c2:()=>S.vice.smoke>=30,f:()=>{if(chance(.55)){S.vice.smoke=0;mod({health:5});log('禁煙に成功');return '禁煙に成功した。ご飯がおいしい。';}return '3週間でまた吸ってしまった。';}},
 {id:'quitDrink',n:'断酒プログラムに参加',c:10,a:[20,90],d:'お酒をやめられるかも',c2:()=>S.vice.drink>=50,f:()=>{if(chance(.45)){S.vice.drink=10;S.flags.alc=0;mod({health:6,mental:5});log('断酒に成功');return 'お酒をやめた。朝がすっきりしている。';}return '飲み会で一杯だけ、と言ってまた戻ってしまった。';}},
 {id:'kifu',n:'寄付・ボランティア',c:10,a:[18,95],d:'素行+5・メンタル+5',f:()=>{mod({moral:5,mental:5});if(chance(.3))addPerson('friend','ボランティア仲間');return '被災地の支援に参加した。';}},
 {id:'oshi',n:'推し活を始める',c:5,a:[13,80],d:'毎年30万円・メンタルが上がる',c2:()=>!S.oshi,f:()=>{S.oshi=1;mod({mental:12});return '推しができた。遠征、グッズ、配信。生きる理由ができた。';}},
 {id:'pet',n:'猫を飼う',c:10,a:[20,85],d:'毎年12万円・メンタルが上がる',c2:()=>!S.pet&&S.home!=='jikka',f:()=>{S.pet={name:pick(['ミケ','タマ','こむぎ','もち','レオ'])};mod({mental:10});S.mood='happy';log('猫を飼う');return `保護猫を迎えた。名前は「${S.pet.name}」。`;}},
 {id:'mago',n:'孫にお小遣いをあげる',c:5,a:[50,100],d:'子や孫が喜ぶ',c2:()=>S.kids.some(k=>k.grand),f:()=>{S.kids.forEach(k=>{if(k.grand)k.close+=10;});mod({mental:6});return '孫が「ありがとう」と抱きついてきた。';}},
 {id:'hobby',n:'趣味の教室に通う',c:10,a:[55,95],d:'メンタル+8・友人ができる',f:()=>{mod({mental:8});if(chance(.5))addPerson('friend','趣味の仲間');return pick(['陶芸教室に通い始めた。','囲碁会所で友達ができた。','社交ダンスを始めた。']);}},
];
function actCost(a){return typeof a.c==='function'?a.c(S):a.c;}
function actionsPanel(){
  const wrap=document.createElement('div');
  const a=S.age;
  if(a>=18&&!['年金','学生'].includes(J().cat)||a>=15&&S.job.id!=='student'){
    const s=document.createElement('div');s.className='sec';
    s.innerHTML=`<h3>働き方・暮らし方</h3>${['無職','年金'].includes(J().cat)?'':`<div class="lab">仕事への力の入れ方</div><div class="seg" id="sEf">${['控えめ','ふつう','がむしゃら'].map((t,i)=>`<button data-v="${i}" class="${S.effort===i?'on':''}">${t}</button>`).join('')}</div>`}
    <div class="lab">生活レベル（生活費 年${yen(livingBase())}）</div><div class="seg" id="sLf">${['節約','ふつう','ぜいたく'].map((t,i)=>`<button data-v="${i}" class="${S.life===i?'on':''}">${t}</button>`).join('')}</div>
    <div class="note">見込み：年収 約${yen(grossNow()+(S.baito||0))}（額面）${S.spouse&&S.spouse.work?`＋配偶者 約${yen(S.spouse.income)}`:''}／支出 約${yen(yearlyExpense())}${infoLink('tedori')}</div>`;
    s.querySelectorAll('#sEf button').forEach(b=>b.onclick=()=>{S.effort=+b.dataset.v;render();});
    s.querySelectorAll('#sLf button').forEach(b=>b.onclick=()=>{S.life=+b.dataset.v;render();});
    wrap.appendChild(s);
  }
  const av=ACTS.filter(x=>a>=x.a[0]&&a<=x.a[1]&&(!x.c2||x.c2()));
  if(av.length){
    const s=document.createElement('div');s.className='sec';s.innerHTML=`<h3>お金を使う<span>それぞれ年に1回まで</span></h3><div class="acts"></div>`;
    const g=s.querySelector('.acts');
    av.forEach(x=>{const c=actCost(x);const b=document.createElement('button');b.className='act'+(S.used[x.id]?' done':'');b.disabled=!!S.used[x.id]||S.cash<c;b.innerHTML=`${x.n}<span class="c">${c?yen(c):'無料'}</span><small>${x.d}</small>`;
      b.onclick=()=>{if(S.used[x.id])return;if(S.cash<c){toast('お金が足りない');return;}S.used[x.id]=1;if(c)pay(c,x.n);const r=x.f();if(r){S.notes.push(r);S.lastRes=r;}render();$('#main').scrollTop=0;};g.appendChild(b);});
    wrap.appendChild(s);
  }
  const sh=SHEETS.filter(x=>a>=x.a[0]&&a<=x.a[1]&&(!x.c2||x.c2()));
  if(sh.length){const s=document.createElement('div');s.className='sec';s.innerHTML=`<h3>人生を動かす</h3><div class="acts"></div>`;const g=s.querySelector('.acts');
    sh.forEach(x=>{const b=document.createElement('button');b.className='act';b.innerHTML=`${x.n}<small>${x.d}</small>`;b.onclick=x.f;g.appendChild(b);});wrap.appendChild(s);}
  const info=document.createElement('div');info.className='sec';
  info.innerHTML=`<h3>いまの状況</h3><div class="note">${statusText()}</div>`;wrap.appendChild(info);
  return wrap;
}
function statusText(){
  const L=[];
  L.push(`気質：<b>${S.traits.join('・')}</b>${S.flags.talentKnown?`　才能：<b>${TALENTS[S.talent]}</b>`:''}`);
  L.push(`家：<b>${RANKS[S.fam.rank]}</b>（家計の余裕 ${Math.round(S.fam.money)}）`);
  if(S.hs)L.push(`学歴：${S.uni?UNI_N[S.uni]:S.hs.n}${S.edu&&S.edu.left>0?`（${S.edu.n} あと${S.edu.left}年）`:''}`);
  L.push(`職業：<b>${J().n}</b>${S.job.years?`（${S.job.years}年目）`:''}${grossNow()?`　年収 約${yen(grossNow())}`:''}`);
  L.push(`住まい：<b>${S.house?S.house.n:(HOMES[S.home]||{}).n}</b>${S.house?'　ローン残高 '+yen(S.house.loan):S.home!=='jikka'?'　家賃 月'+((HOMES[S.home].rent||0)+(S.rentAdd||0)).toFixed(1)+'万円':''}`);
  const v=[];if(S.vice.smoke>=30)v.push('喫煙');if(S.vice.drink>=40)v.push(S.flags.alc?'酒浸り':'晩酌');if(S.vice.gamble>=40)v.push('ギャンブル癖');if(S.vice.drug)v.push('薬物');if(v.length)L.push(`<span style="color:var(--red)">習慣：${v.join('・')}</span>`);
  if(S.crime)L.push(`<span style="color:var(--red)">前科あり</span>`);
  if(S.illness)L.push(`<span style="color:var(--red)">病気：${S.illness}</span>`);
  if(S.lic)L.push('運転免許あり'+(S.car?'・車あり':''));
  if(S.ins.med||S.ins.life)L.push('保険：'+[S.ins.med?'医療保険':'',S.ins.life?'生命保険':''].filter(Boolean).join('・'));
  if(S.company)L.push(`会社の企業価値 ${yen(S.company.value)}（持ち株${Math.round(S.company.eq*100)}%）`);
  if(S.job.id==='creator')L.push(`フォロワー ${Math.round(S.followers*1000).toLocaleString()}人`);
  if(S.job.id==='dream')L.push(`夢への手応え ${Math.min(100,Math.round(S.dream))}%`);
  return L.join('<br>');
}

// =====================================================================
// シート（大きな決断）
// =====================================================================
const SHEETS=[
 {id:'job',n:'仕事を探す・転職する',d:'求人に応募する',a:[18,74],c2:()=>!['ceo','shop','star'].includes(S.job.id)&&!(S.edu&&S.edu.left>0&&S.age>=18),f:()=>{if(S.used.jobhunt){toast('今年はもう応募した');return;}S.used.jobhunt=1;S.queue.push(evOffers('求人に応募した。結果は……',false));render();}},
 {id:'move',n:'引っ越す',d:'住まいを変える',a:[18,95],f:()=>moveSheet()},
 {id:'invest',n:'投資する',d:'NISA・株・金・仮想通貨・FX',a:[18,100],f:()=>investSheet()},
 {id:'house',n:'家を買う・売る',d:'住宅ローン35年',a:[22,80],f:()=>houseSheet()},
 {id:'ins',n:'保険に入る',d:'病気や万一に備える',a:[18,80],f:()=>insSheet()},
 {id:'lic',n:'運転免許を取る',d:'合宿なら約25万円',a:[18,70],c2:()=>!S.lic,f:()=>licSheet()},
 {id:'car',n:'車を買う',d:'維持費は年50万円',a:[18,80],c2:()=>S.lic&&!S.car,f:()=>carSheet()},
 {id:'biz',n:'起業する・店を開く',d:'すべてを賭ける',a:[18,70],c2:()=>!S.company&&!S.shop,f:()=>bizSheet()},
 {id:'gamble',n:'競輪・パチンコ',d:'還元率は75〜85%',a:[20,100],f:()=>gambleSheet()},
 {id:'lotto',n:'宝くじを買う',d:'1等7億円・年1回',a:[20,100],f:()=>lottoSheet()},
 {id:'ura',n:'裏の仕事・犯罪',d:'捕まれば人生が変わる',a:[14,85],f:()=>uraSheet()},
 {id:'repay',n:'借金を返す',d:'金利は年15%',a:[18,100],c2:()=>S.debt>0,f:()=>repaySheet()},
];
const URA=[
 {id:'manbiki',n:'万引きして転売する',a:14,g:[3,15],p:.15,y:0,m:-8,t:'ドラッグストアで化粧品を盗み、フリマアプリで売った。'},
 {id:'ukeko',n:'闇バイトに応募する（受け子）',a:16,g:[20,80],p:.35,y:2,m:-15,t:'指示役の命令で、高齢者の家にカードを受け取りに行った。',after:()=>{S.flags.yamiTrap=1;}},
 {id:'taima',n:'大麻を売りさばく',a:17,g:[40,200],p:.25,y:2,m:-12,t:'SNSの隠語で客を集め、手渡しで売った。',after:()=>{S.vice.drug=Math.max(S.vice.drug,1);}},
 {id:'oudan',n:'会社の金を横領する',a:22,g:[100,600],p:.3,y:3,m:-15,c:()=>['正社員','公務員'].includes(J().cat),t:'経費の数字を少しずつ書き換えた。'},
 {id:'datsuzei',n:'売上をごまかして脱税する',a:20,g:[50,400],p:.2,y:0,m:-6,c:()=>['個人事業','経営者','芸能'].includes(J().cat),t:'現金の売上を帳簿から外した。',caught:()=>{const v=Math.round(grossNow()*.6);pay(v,'追徴課税・重加算税');return `税務調査が入り、${yen(v)}を追徴された。`;}},
 {id:'hoken',n:'事故を装って保険金をだまし取る',a:20,g:[100,300],p:.3,y:2,m:-12,c:()=>S.car||S.ins.med||S.ins.life,t:'仲間とわざと追突事故を起こした。'},
 {id:'goto',n:'闇バイトで強盗の実行役になる',a:16,g:[0,400],p:.75,y:7,m:-30,t:'指示されるまま、知らない家に押し入った。'},
];
function uraSheet(){
  const av=URA.filter(u=>S.age>=u.a&&(!u.c||u.c()));
  sheet('裏の仕事・犯罪',`<p class="note">お金は手に入るかもしれない。だが捕まれば前科がつき、職も人も失う。${S.flags.yamiTrap?'<br><b style="color:var(--red)">一度関わった指示役から、まだ連絡が来る。</b>':''}</p>`,
   av.map(u=>({t:`${u.n}<br><small>手に入る額 ${yen(u.g[0])}〜${yen(u.g[1])}／捕まる確率 約${Math.round(u.p*100)}%</small>`,dis:S.used.ura,f:()=>{
     if(S.used.ura)return;S.used.ura=1;let r=u.t;
     if(chance(u.p*(S.crime?1.2:1))){
       if(u.caught){r+=u.caught();mod({mental:-10});}
       else{r+='<br>……警察が来た。';arrest(u.n.replace(/する$|になる$/,''),u.y);}
     }else{const v=Math.round(u.g[0]+R()*(u.g[1]-u.g[0]));gain(v,'出どころの言えない金');mod({moral:u.m,mental:-3});r+=`<br>${yen(v)}が手に入った。誰にも言えない。`;if(u.after)u.after();}
     S.notes.push(r);S.lastRes=r;render();}})));
}
function moveSheet(){
  if(S.house){toast('持ち家を売ってから引っ越そう');return;}
  const opts=Object.entries(HOMES).filter(([id,h])=>h.req(S)&&id!==S.home);
  sheet('引っ越す',`<p class="note">初期費用（敷金・礼金・仲介手数料など）は家賃の約4.5か月分。</p>`+opts.map(([id,h])=>`<button class="op" data-h="${id}">${h.n}<span class="rt">${h.rent?'月'+h.rent+'万円':'家賃なし'}</span><small>初期費用 約${yen(Math.round(h.rent*4.5))}${h.info?infoLink(h.info):''}</small></button>`).join(''),[],ov=>{
    ov.querySelectorAll('[data-h]').forEach(b=>b.onclick=e=>{if(e.target.dataset.i)return;const id=b.dataset.h,h=HOMES[id],c=Math.round(h.rent*4.5);if(S.cash<c){toast('初期費用が足りない');return;}if(c)pay(c,'引っ越し初期費用');S.home=id;S.rentAdd=0;log(h.n+'に引っ越す');ov.remove();S.lastRes=`${h.n}に引っ越した。`;render();});});
}
function investSheet(){
  const room=Math.min(360-(S.nisa.yr||0),1800-S.nisa.used);
  const rows=Object.entries(ASSETS).map(([k,A])=>{const a=S.port[k];return `<div class="inv"><div class="ih"><b>${A.n}</b><span>${a?yen(a.v):'—'}</span></div><div class="note">${A.d}${a&&a.basis?`　（買値 ${yen(a.basis)}）`:''}</div><div class="seg sm">${[1,10,50,100,500].map(v=>`<button data-buy="${k}" data-v="${v}">+${v>=1?v+'万':''}</button>`).join('')}<button data-sell="${k}">売る</button></div></div>`;}).join('');
  sheet('投資',`<div class="note">預金 <b>${yen(S.cash)}</b>　／　景気：<b>${REGIMES[S.regime].n}</b>（${newsNow()}）</div>
  <div class="inv"><div class="ih"><b>新NISA（全世界株）</b><span>${yen(S.nisa.v)}</span></div><div class="note">非課税。今年あと${yen(Math.max(0,room))}まで、生涯枠の残り${yen(1800-S.nisa.used)}${infoLink('nisa')}</div>
  <div class="lab">毎年の自動積立</div><div class="seg sm" id="nP">${[0,12,36,60,120,240,360].map(v=>`<button data-v="${v}" class="${S.nisa.plan===v?'on':''}">${v?v+'万':'なし'}</button>`).join('')}</div>
  <div class="seg sm">${[10,50,100,240].map(v=>`<button data-nb="${v}">今すぐ+${v}万</button>`).join('')}<button data-ns="1">売る</button></div></div>
  ${rows}
  ${S.reInv?'':`<div class="inv"><div class="ih"><b>投資用ワンルームマンション</b><span>—</span></div><div class="note">価格2500万円・頭金100万円・家賃収入あり。営業マンは「節税になる」と言う。</div><div class="seg sm"><button data-re="1">買う</button></div></div>`}
  <p class="src">株・金・仮想通貨の利益には、売るときに20.315%の税金がかかる（NISAを除く）。相場は「好景気・平常・景気後退・暴落」をくり返す。</p>`,[],ov=>{
    ov.querySelectorAll('#nP button').forEach(b=>b.onclick=()=>{S.nisa.plan=+b.dataset.v;ov.querySelectorAll('#nP button').forEach(x=>x.classList.toggle('on',x===b));});
    ov.querySelectorAll('[data-nb]').forEach(b=>b.onclick=()=>{let v=+b.dataset.nb;const rm=Math.min(360-(S.nisa.yr||0),1800-S.nisa.used);v=Math.min(v,rm);if(v<=0){toast('NISAの枠がもうない');return;}if(S.cash<v){toast('預金が足りない');return;}pay(v,'新NISAで購入');S.nisa.v+=v;S.nisa.basis+=v;S.nisa.used+=v;S.nisa.yr=(S.nisa.yr||0)+v;ov.remove();investSheet();render();});
    ov.querySelectorAll('[data-ns]').forEach(b=>b.onclick=()=>{if(S.nisa.v<=0)return;gain(S.nisa.v,'新NISAを売却（非課税）');S.nisa.used=Math.max(0,S.nisa.used-S.nisa.basis);S.nisa.v=0;S.nisa.basis=0;ov.remove();investSheet();render();});
    ov.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const k=b.dataset.buy,v=+b.dataset.v;if(S.cash<v){toast('預金が足りない');return;}pay(v,ASSETS[k].n+'を購入');S.port[k]=S.port[k]||{v:0,basis:0};S.port[k].v+=v;S.port[k].basis+=v;ov.remove();investSheet();render();});
    ov.querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>{const k=b.dataset.sell;if(!S.port[k])return;sellAsset(k,S.port[k].v);ov.remove();investSheet();render();});
    ov.querySelectorAll('[data-re]').forEach(b=>b.onclick=()=>{if(S.cash<100){toast('頭金が足りない');return;}if(!['正社員','公務員','専門職'].includes(J().cat)){toast('ローン審査に通らなかった');return;}pay(100,'ワンルーム頭金');S.reInv={value:2200,loan:2400,pay:105,rent:96};log('投資用ワンルームを購入');ov.remove();S.lastRes='投資用のワンルームマンションを買った。毎月の家賃収入より、ローンと管理費の支払いのほうが多い……。';render();});
  });
}
function loanPay(P,n,r){return P*r/(1-Math.pow(1+r,-n));}
function houseSheet(){
  if(S.house){const h=S.house,net=h.value*.96-h.loan;
    sheet('持ち家',`<p>${h.n}<br>評価額 ${yen(h.value)}／ローン残高 ${yen(h.loan)}／年間返済 ${yen(h.pay)}</p>`,[{t:`売却する（手取り ${yen(net)}）`,f:()=>{gain(net,'家を売却');S.house=null;S.home=S.spouse?'fam_sub':'normal';log('家を売る');S.lastRes='家を売った。';render();}}]);return;}
  const g=grossNow()+(S.spouse&&S.spouse.work?S.spouse.income:0),ok=['正社員','公務員','専門職'].includes(J().cat)||S.spouse&&S.spouse.work,max=ok?g*7:g*3,bk=S.flags.bkAge&&S.age-S.flags.bkAge<7;
  sheet('家を買う',`<p class="note">頭金と諸費用で価格の約2割が必要。ローンは35年・金利1.2%（目安）。借りられる上限は世帯年収の約7倍（安定した収入がある場合）。いまの借入可能額：<b>${yen(max)}</b>${bk?'<br><span style="color:var(--red)">自己破産から7年たっていないので、ローンは組めない。</span>':''}</p>`+HOUSES.map(h=>{const down=h.price*.2,loan=h.price*.85,okk=!bk&&S.cash>=down&&loan<=max;return `<button class="op" data-b="${h.id}" ${okk?'':'disabled'}>${h.n}<span class="rt">${yen(h.price)}</span><small>自己資金 ${yen(down)}／年間返済 約${yen(loanPay(loan,35,.012))}</small></button>`;}).join(''),[],ov=>{
    ov.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{const h=HOUSES.find(x=>x.id===b.dataset.b),down=h.price*.2,loan=h.price*.85;pay(down,'頭金・諸費用');S.house={n:h.n,value:h.price,loan,rate:.012,pay:loanPay(loan,35,.012),dr:h.dr,vol:h.vol,bg:h.bg,ln:h.ln,col:h.col,yrs:0};S.home='own';log(h.n+'を購入');ov.remove();S.lastRes=`${h.n}を買った。35年ローンの始まりだ。`;S.mood='happy';render();});});
}
function insSheet(){
  sheet('保険',`<p class="note">日本には高額療養費制度があり、医療費の自己負担には上限がある。民間の保険はその上乗せ。${infoLink('hoken')}</p>`,[
    {t:S.ins.med?'医療保険を解約する':'医療保険に入る（年5万円）',f:()=>{S.ins.med=!S.ins.med;S.lastRes=S.ins.med?'医療保険に入った。病気の治療費が軽くなる。':'医療保険を解約した。';render();}},
    {t:S.ins.life?'生命保険を解約する':'生命保険に入る（年15万円）',f:()=>{S.ins.life=!S.ins.life;S.lastRes=S.ins.life?'生命保険に入った。万一のとき、家族にお金が残る。':'生命保険を解約した。';render();}}]);
}
function licSheet(){
  sheet('運転免許',`<p>免許があると、運転の仕事に就けたり、車を持てたりする。${infoLink('menkyo')}</p>`,[
    {t:'合宿免許で取る（25万円・2週間）',dis:S.cash<25,f:()=>{pay(25,'合宿免許');S.lic=true;log('運転免許を取る');if(chance(.3))addPerson('friend','合宿で知り合った友人');S.lastRes='合宿で免許を取った。';render();}},
    {t:'教習所に通って取る（32万円）',dis:S.cash<32,f:()=>{pay(32,'教習所');S.lic=true;log('運転免許を取る');S.lastRes='教習所に通って免許を取った。';render();}}]);
}
function carSheet(){
  sheet('車を買う',`<p>東京では車がなくても暮らせる。駐車場代だけで月3万円以上かかることも。</p>`,[
    {t:'中古の軽自動車（60万円）',dis:S.cash<60,f:()=>{pay(60,'車の購入');S.car='軽自動車';log('車を買う');S.lastRes='中古の軽自動車を買った。';render();}},
    {t:'新車のミニバン（350万円）',dis:S.cash<350,f:()=>{pay(350,'車の購入');S.car='ミニバン';mod({mental:5});log('新車を買う');S.lastRes='家族みんなが乗れるミニバンを買った。';render();}},
    {t:'外車（900万円）',dis:S.cash<900,f:()=>{pay(900,'車の購入');S.car='外車';mod({charm:8,mental:8});log('外車を買う');S.lastRes='憧れの外車を手に入れた。';render();}}]);
}
function bizSheet(){
  const opts=[
   {n:'IT・Webサービスの会社を起業',d:'資本金300万円。当たれば企業価値は数十億円',need:300,f:()=>{pay(300,'資本金');S.company={value:1000,eq:.7,yrs:0};setJob('ceo',240);log('会社を起業');return '会社を立ち上げた。社長は自分、社員も自分。'+infoLink('kigyo');}},
   {n:S.lics.biyo?'美容室を開く':'飲食店を開く',d:'自己資金300万円＋融資300万円',need:300,f:()=>{pay(300,'開業資金');S.debt+=300;S.shop={yrs:0,kind:S.lics.biyo?'美容室':'飲食店',loss:0};setJob('shop',0);log(S.shop.kind+'を開業');return `自分の${S.shop.kind}を開いた。`+infoLink('kigyo');}},
   {n:'動画クリエイターとして独立',d:'元手ゼロ。収入もゼロから',need:0,f:()=>{setJob('creator');S.followers=S.followers||3;return '会社を辞め、動画一本で生きていくと決めた。';}},
   {n:'フランチャイズのコンビニ経営',d:'加盟金300万円。24時間営業',need:300,f:()=>{pay(300,'加盟金');S.shop={yrs:0,kind:'コンビニ',loss:0};setJob('shop',0);mod({health:-8});log('コンビニオーナーになる');return 'コンビニのオーナーになった。夜勤のバイトが足りない日は、自分が入る。';}}];
  sheet('起業する・店を開く','<p class="note">今の仕事は辞めることになる。</p>'+opts.map((o,i)=>`<button class="op" data-z="${i}" ${S.cash>=o.need?'':'disabled'}>${o.n}<small>${o.d}</small></button>`).join(''),[],ov=>{
    ov.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{ov.remove();S.lastRes=opts[+b.dataset.z].f();render();});});
}
function gambleRun(stake,type){
  stake=Math.min(stake,Math.max(0,S.cash));if(stake<=0)return 'お金がない。';
  const T={本命:[2,.375],中穴:[10,.075],大穴:[90,1/120]}[type];
  S.cash-=stake;S.gamble.n++;S.vice.gamble=Math.min(100,S.vice.gamble+4);
  const sh=()=>[1,2,3,4,5,6,7,8,9].sort(()=>R()-.5).slice(0,3).join('-');let t;
  if(chance(T[1])){const w=stake*T[0];S.cash+=w;S.gamble.net+=w-stake;row('競輪 払戻',w-stake);mod({mental:6});t=`${type}の車券が的中！（${sh()}）${yen(w)}の払い戻し。`;}
  else{S.gamble.net-=stake;row('競輪 車券',-stake);t=`外れた。ゴール前で差された（${sh()}）。${yen(stake)}が消えた。`;}
  if(S.vice.gamble>=60&&S.gamble.net<-100&&!S.flags.gamAddict){S.flags.gamAddict=1;S.notes.push('気がつくと、毎週のように競輪場に通っていた。');}
  return t;
}
function pachinko(stake){
  stake=Math.min(stake,Math.max(0,S.cash));if(stake<=0)return 'お金がない。';
  S.cash-=stake;S.gamble.n++;S.vice.gamble=Math.min(100,S.vice.gamble+4);const r=R();const m=r<.6?0:r<.85?1.4:r<.97?2.5:6.75;
  const w=stake*m;S.cash+=w;S.gamble.net+=w-stake;row('パチンコ',w-stake);
  return m===0?`${yen(stake)}が、あっという間に飲まれた。`:m<2?`少しだけ勝った（${yen(w)}）。`:`確変が止まらない！ ${yen(w)}になった。`;
}
function gambleSheet(){
  sheet('競輪・パチンコ',`<p class="note">競輪の還元率は75%、パチンコは約85%。続けるほど、平均では負ける。${infoLink('keirin')}</p>
  <div class="lab">競輪：賭け方</div><div class="seg" id="gT"><button data-v="本命" class="on">本命（約2倍）</button><button data-v="中穴">中穴（約10倍）</button><button data-v="大穴">大穴（約90倍）</button></div>
  <div class="lab">賭け金</div><div class="seg" id="gS">${[.5,1,5,10,50].map((v,i)=>`<button data-v="${v}" class="${i===1?'on':''}">${yen(v)}</button>`).join('')}</div>
  <div id="gRes" class="res" style="margin:8px 0">通算 ${S.gamble.n}回／収支 ${yen(S.gamble.net)}</div>`,[
    {t:'車券を買う',keep:true,f:ov=>{const t=ov.querySelector('#gT .on').dataset.v,s=+ov.querySelector('#gS .on').dataset.v;if(S.cash<s){toast('お金が足りない');return;}ov.querySelector('#gRes').innerHTML=gambleRun(s,t)+`<br><span class="note">通算 ${S.gamble.n}回／収支 ${yen(S.gamble.net)}</span>`;render();}},
    {t:'パチンコを打つ（3万円）',keep:true,f:ov=>{if(S.cash<3){toast('お金が足りない');return;}ov.querySelector('#gRes').innerHTML=pachinko(3)+`<br><span class="note">通算 ${S.gamble.n}回／収支 ${yen(S.gamble.net)}</span>`;render();}}],
    ov=>ov.querySelectorAll('.seg').forEach(sg=>sg.querySelectorAll('button').forEach(b=>b.onclick=()=>{sg.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');})));
}
function lotto(n){
  const cost=n*.03;if(S.cash<cost)return 'お金が足りない。';S.cash-=cost;let win=0,big=null;
  for(let i=0;i<n;i++){const r=R();if(r<1/2e7){win+=70000;big='1等 7億円';}else if(r<3/2e7){win+=15000;big=big||'1等前後賞 1億5000万円';}else if(r<3/2e7+1/5e6){win+=1000;big=big||'2等 1000万円';}else if(r<1/1e5){win+=100;big=big||'3等 100万円';}else if(r<1.1e-4){win+=5;}else if(r<1/80+1.1e-4){win+=.3;}else if(r<.1+1/80+1.1e-4){win+=.03;}}
  S.lottoSpent=(S.lottoSpent||0)+cost;row('宝くじ購入',-cost);if(win>0)row('宝くじ当せん金',win);S.cash+=win;
  if(win>=10000){S.flags.lottoBig=1;log('宝くじ '+big+' 当せん');mod({mental:30});S.mood='shock';return `……目を疑った。${big}が当たっている！！ ${yen(win)}が振り込まれた。`;}
  return big?`${big}が当たった！ 当せん金は合計${yen(win)}。`:`当せん金は${yen(win)}。${yen(cost)}が${yen(win)}になった。`;
}
function lottoSheet(){
  if(S.used.lotto){toast('宝くじは年に1回まで');return;}
  sheet('年末ジャンボ宝くじ',`<p>1枚300円。1等7億円の当せん確率は2000万分の1。${infoLink('takarakuji')}</p><p class="note">これまでに宝くじに使った額：${yen(S.lottoSpent||0)}</p>`,
   [10,100,1000].map(n=>({t:`${n}枚買う（${yen(n*.03)}）`,dis:S.cash<n*.03,f:()=>{S.used.lotto=1;S.lastRes=lotto(n);S.notes.push(S.lastRes);render();}})));
}
function repaySheet(){const v=Math.min(S.debt,S.cash);sheet('借金を返す',`<p>借金 ${yen(S.debt)}（金利 年15%）／預金 ${yen(S.cash)}${infoLink('kinri')}</p>`,[{t:`${yen(v)}を返済する`,dis:v<=0,f:()=>{pay(v,'借金返済');S.debt-=v;S.lastRes='借金を返した。';render();}}]);}

// =====================================================================
// 求人
// =====================================================================
function jobChance(j){const s=S.st;const score=s.study*.3+s.skill*.35+s.comm*.35+S.uni*6;return clamp(.35+(score-j.diff)/40-(S.age>35&&j.diff>30?(S.age-35)*.025:0)-(S.crime?.35:0),.03,.96);}
const GW={nurse:{M:.5,F:1.2},hoiku:{M:.45,F:1.2},biyoshi:{M:.8,F:1.15},apparel:{M:.7,F:1.2},kaigo:{M:.8,F:1.1},tobi:{M:1.1,F:.2},driver:{M:1.1,F:.35},taxi:{M:1.1,F:.3},keibi:{M:1.1,F:.4},fire:{M:1.1,F:.35},police:{M:1.05,F:.6},factory:{M:1.1,F:.6}};
function evOffers(text,newGrad){
  let offs=Object.entries(JOBS).filter(([id,j])=>j.req&&j.diff<900&&id!==S.job.id&&(!j.sx||j.sx===S.sex)&&j.req(S)).map(([id,j])=>({id,j,p:Math.min(.97,(jobChance(j)+(newGrad?.15:0))*((GW[id]||{})[S.sex]||1))})).filter(o=>chance(o.p));
  offs.sort((a,b)=>(b.j.base||0)-(a.j.base||0));offs=offs.slice(0,6);
  const ops=offs.map(o=>({t:o.j.n,s:`年収 約${o.j.var&&!o.j.base?'？':yen(Math.round((o.j.base||0)*(S.uni>=3?1.05:1)))}〜`,f:()=>{setJob(o.id);S.mood='happy';return `${o.j.n}として働き始めた。`+infoLink(o.j.info||'salary');}}));
  if(!['student','none','neet','welfare'].includes(S.job.id))ops.push({t:'今の仕事を続ける',f:()=>'今の仕事を続けることにした。'});
  else ops.push({t:'どこにも行かない',f:()=>{if(S.age>=18&&S.job.id==='student')setJob('none');return 'どこにも就職しなかった。';}});
  return {id:'offers',tag:'就職',log:true,tx:text+(offs.length?`<br>内定・採用の連絡が${offs.length}件来た。`:'<br>……どこからも採用の連絡は来なかった。'),ops};
}

// =====================================================================
// 人生の終わり
// =====================================================================
const TITLES=[
 {id:'oku',n:'東京の頂点',d:'資産10億円を超えて生涯を終えた',c:a=>a>=100000,p:100},
 {id:'lotto',n:'7億円の、その後',d:'宝くじの大当たりが人生を変えた',c:()=>S.flags.lottoBig,p:95},
 {id:'exit',n:'イグジット',d:'起業し、会社を売った',c:()=>S.flags.exit,p:93},
 {id:'star',n:'夢を叶えた人',d:'芸能の世界で売れっ子になった',c:()=>S.flags.dreamCome,p:92},
 {id:'athlete',n:'アスリート',d:'プロのスポーツ選手として生きた',c:()=>S.flags.pro,p:91},
 {id:'hit',n:'ヒットメーカー',d:'作品が大ヒットした',c:()=>S.flags.hit,p:90},
 {id:'fire',n:'早期リタイア',d:'FIREを達成した',c:()=>S.flags.fired,p:85},
 {id:'kachi',n:'東京の勝ち組',d:'資産1億円以上と家族に恵まれた',c:a=>a>=10000&&(S.spouse||S.widow)&&S.kids.length,p:80},
 {id:'tower',n:'タワマンの孤独',d:'資産1億円。でも、ずっと一人だった',c:a=>a>=10000&&!S.spouse&&!S.widow&&!S.kids.length,p:79},
 {id:'okuri',n:'億り人',d:'資産1億円を超えた',c:a=>a>=10000,p:78},
 {id:'daikazoku',n:'にぎやかな食卓',d:'子と孫に囲まれた',c:()=>S.kids.length>=3&&S.kids.reduce((s,k)=>s+(k.grand||0),0)>=3,p:70},
 {id:'kidstar',n:'自慢の子',d:'子どもが大きく成功した',c:()=>S.flags.kidSuccess,p:68},
 {id:'owner',n:'一国一城の主',d:'自分の店を10年以上守った',c:()=>S.shop&&S.shop.yrs>=10||S.flags.shopLong,p:66},
 {id:'kenjitsu',n:'堅実な一生',d:'家を持ち、蓄えを残した',c:a=>a>=3000&&(S.house||S.flags.ownedHouse),p:60},
 {id:'choju',n:'大往生',d:'100歳まで生きた',c:()=>S.age>=100,p:75},
 {id:'futari',n:'ふたりで歩いた道',d:'最後まで連れ添った',c:()=>S.spouse&&S.spouse.years>=40,p:62},
 {id:'nakama',n:'仲間がいる',d:'最期まで友がそばにいた',c:()=>friends().filter(f=>f.close>=55).length>=3,p:55},
 {id:'restart',n:'どん底からの再起',d:'自己破産から立ち直った',c:a=>S.flags.bk&&a>0,p:58},
 {id:'debt',n:'借金を抱えたまま',d:'借金を残して亡くなった',c:a=>a<0,p:50},
 {id:'homeless',n:'東京の片隅で',d:'住む家を失った時期があった',c:()=>S.flags.homeless,p:45},
 {id:'gamble',n:'ギャンブルに溺れた',d:'ギャンブルで人生を狂わせた',c:()=>S.flags.gamAddict&&S.gamble.net<-500,p:52},
 {id:'crime',n:'塀の中も見た',d:'逮捕されたことがある',c:()=>S.crime,p:48},
 {id:'young',n:'早すぎた別れ',d:'40歳を待たずに亡くなった',c:()=>S.age<40,p:99},
 {id:'kaigo',n:'親を看取った',d:'親の介護をやり遂げた',c:()=>S.flags.caredParent,p:40},
 {id:'kokyo',n:'ふるさとへ',d:'東京を離れて暮らした',c:()=>S.flags.leftTokyo,p:42},
 {id:'rougo',n:'老後2000万円問題',d:'老後の蓄えに苦しんだ',c:a=>a<500&&S.age>=70,p:44},
 {id:'shokunin',n:'天職を全うした',d:'同じ仕事を30年以上続けた',c:()=>S.flags.longJob,p:57},
 {id:'futsu',n:'ふつうの人生',d:'特別なことはなかった。でも、確かな一生',c:()=>true,p:1},
];
function endLife(cause){
  S.ended=true;S.cause=cause;const a=assetsTotal();
  const got=TITLES.filter(t=>t.c(a)).sort((x,y)=>y.p-x.p);const main=got[0];
  got.forEach(t=>META.titles[t.id]=1);saveMeta();try{localStorage.removeItem(SAVE_KEY);}catch(e){}
  log(`${cause}で亡くなる（${S.age}歳）`);
  const kidsAlive=S.kids.filter(k=>k.alive!==false);const grand=S.kids.reduce((s,k)=>s+(k.grand||0),0);
  const score=(v)=>'★'.repeat(clamp(Math.round(v),1,5))+'☆'.repeat(5-clamp(Math.round(v),1,5));
  const sc={money:a<0?1:a<500?2:a<3000?3:a<10000?4:5,fam:(S.spouse||S.widow?2:0)+Math.min(2,kidsAlive.length)+(grand?1:0),friend:Math.min(5,1+friends().filter(f=>f.close>=50).length),health:S.age>=90?5:S.age>=80?4:S.age>=65?3:S.age>=45?2:1,ach:1+(S.flags.exit||S.flags.dreamCome||S.flags.hit||S.flags.pro?3:0)+(S.uni>=3?1:0)+(S.flags.manager?1:0)};
  const epi=`${S.birthY}年、${{'23ku':'東京23区','tama':'東京の郊外','local':'地方の町'}[S.fam.place]}の${RANK_ADJ[S.birthRank!=null?S.birthRank:S.fam.rank]}家に生まれる。${S.uni?UNI_N[S.uni]+'を出て、':''}${(S.jobs||[]).concat(J().n).filter((x,i,arr)=>arr.indexOf(x)===i).slice(0,4).join('、')}として生きた。${S.spouse||S.widow?((S.spouse||{}).name||S.widow)+'と結婚し、':''}${S.kids.length?`子ども${S.kids.length}人${grand?'、孫'+grand+'人':''}に恵まれた。`:''}${S.year}年、${cause}のため${S.age}歳で死去。`;
  render();
  sheet('THE END',`<div class="endc"><div class="echar">${chibi({look:S.look,age:S.age,outfit:S.age>=65?'elder':outfitFor(S.age,S.job.id,S.sex),mood:'happy'})}</div><div class="note">${S.age}歳　${S.year}年</div><div class="nm">${main.n}</div><p>${main.d}</p></div>
  <p class="epi">${epi}</p>
  <div class="kv"><div>お金<b>${score(sc.money)}</b></div><div>家族<b>${score(sc.fam)}</b></div><div>友情<b>${score(sc.friend)}</b></div><div>健康・長寿<b>${score(sc.health)}</b></div><div>達成<b>${score(sc.ach)}</b></div><div>最終資産<b>${yen(a)}</b></div><div>生涯年収（額面）<b>${yen(S.totalGross)}</b></div><div>ギャンブル収支<b>${yen(S.gamble.net)}</b></div></div>
  <p class="note">この人生で得た称号：${got.map(t=>t.n).join('、')}</p>`,
  [{t:'もう一度、0歳から生きる',f:()=>start()},{t:'人生年表を見る',f:()=>{TAB='life';render();}},{t:'タイトルへ',f:()=>title()}]);
}
function dexHTML(){
  return `<div class="sec"><h3>人生の称号<span>${Object.keys(META.titles).length} / ${TITLES.length}</span></h3>${TITLES.map(t=>`<div class="pp"><div class="pav sm ${META.titles[t.id]?'got':''}">${META.titles[t.id]?'済':'？'}</div><div class="in"><b>${META.titles[t.id]?t.n:'？？？'}</b><span>${META.titles[t.id]?t.d:'まだ手に入れていない'}</span></div></div>`).join('')}</div>
  <div class="sec"><h3>解説<span>${Object.keys(META.info).length} / ${Object.keys(INFO).length}</span></h3>${Object.entries(INFO).map(([k,i])=>META.info[k]?`<div class="pp"><div class="in"><a href="#" data-i="${k}" class="klink">${i.t}</a></div></div>`:`<div class="pp"><div class="in" style="color:#aaa">？？？</div></div>`).join('')}</div>
  `;
}
