// =====================================================================
// 人生が入り交じる仕組み
//  A) 過去の選択が、何年も後に返ってくる（種 → 回収）
//  B) 周りの人にも人生がある
//  C) 出来事が重なり、どれかを犠牲にする
//  D) 時代の出来事と自分の人生がからむ
// =====================================================================
const WORKING=()=>['正社員','専門職','公務員','経営者','個人事業'].includes(J().cat);
const nm1=n=>(n||'').split(' ')[1]||n;

// ---------------------------------------------------------------------
// A) 種（選択の記録）
// ---------------------------------------------------------------------
const SEED_RULES=[
 {ev:'ijime_see',op:/見て見ぬふり/,k:'ignored',d:()=>({name:pname(chance(.5)?'M':'F')})},
 {ev:'ijime_see',op:/からかう/,k:'bully',d:()=>({name:pname(chance(.5)?'M':'F')})},
 {ev:'ijime_see',op:/止めに入る|友達になる|先生にこっそり/,k:'saved',d:()=>({name:pname(chance(.5)?'M':'F')})},
 {ev:'ijime_victim',op:/./,k:'victim',d:()=>({name:pname(chance(.5)?'M':'F')})},
 {ev:'manbiki',op:/見張り|自分もやる/,k:'manbiki',d:()=>({})},
 {ev:'sns_trouble',op:/言い張る|消して逃げる/,k:'tattoo',d:()=>({})},
 {ev:'make_friend',op:/おとなしくて/,k:'quiet',d:(n0)=>({pid:newPid(n0)})},
 {ev:'make_friend',op:/やんちゃ/,k:'yancha',d:(n0)=>({pid:newPid(n0)})},
 {ev:'grandpa',op:/おじいちゃんみたい/,k:'grandpa',d:()=>({})},
 {ev:'hankouki',op:/飛び出す|うるせえ|無視して/,k:'rebel',d:()=>({})},
 {ev:'startup_inv',op:/断る/,k:'startup_no',d:(n0,ev)=>({name:(ev.tx.match(/^([^が<]+)が起業/)||[])[1]})},
 {ev:'startup_inv',op:/仲間になる|出資/,k:'startup_yes',d:(n0,ev)=>({name:(ev.tx.match(/^([^が<]+)が起業/)||[])[1]})},
 {ev:'friend_borrow',op:/^貸す|半分/,k:'lent',d:(n0,ev)=>({name:(ev.tx.match(/^([^か<]+)から連絡/)||[])[1]})},
 {ev:'tenkin',op:/断る/,k:'tenkin_no',d:()=>({})},
 {ev:'affair_temp',op:/一線を越える/,k:'affair',d:()=>({})},
 {ev:'kid_trouble',op:/頭ごなし|お小遣いで釣る|好きにさせる/,k:'kid_cold',d:()=>({})},
 {ev:'kid_trouble',op:/じっくり話を聞く/,k:'kid_warm',d:()=>({})},
 {ev:'seijin',op:/参加|派手/,k:'jimoto',d:()=>({})},
 {ev:'tani',op:/代返/,k:'daihen',d:()=>({})},
];
function newPid(n0){const p=S.people[S.people.length-1];return S.people.length>n0&&p?p.id:null;}
function seed(k){return S.seeds&&S.seeds[k];}
function since(k){const s=seed(k);return s?S.age-s.age:-1;}
function seedHook(ev,o,n0){
  for(const r of SEED_RULES){if(r.ev===ev.id&&r.op.test(o.t)){S.seeds=S.seeds||{};if(!S.seeds[r.k])S.seeds[r.k]=Object.assign({age:S.age,year:S.year},r.d(n0,ev));}}
}
const _evCardS=evCard;
evCard=function(ev){
  if(ev&&!ev._sw){ev._sw=1;(ev.ops||[]).forEach(o=>{const f=o.f;o.f=function(){const n0=S.people.length;const r=f.apply(this,arguments);try{seedHook(ev,o,n0);}catch(e){console.warn(e);}return r;};});}
  return _evCardS(ev);
};

// ---- 回収 ----
D('pay_ignored',{a:[27,58],w:7,c:()=>(seed('ignored')||seed('bully'))&&WORKING()&&!S.flags.payIgn,mk:()=>{S.flags.payIgn=1;const s=seed('ignored')||seed('bully'),bad=!!seed('bully');
  return E('再会',`取引先の新しい部長の名刺に「${s.name}」とあった。<br>${s.age}歳のとき、クラスで毎日からかわれていたあの子だ。${bad?'自分も一緒になって笑っていた。':'自分は見て見ぬふりをした。'}<br>目が合った。向こうは、覚えている。`,[
  O('あのときのことを、正直に謝る',()=>{if(chance(bad?.35:.6)){S.job.salary+=RI(20,50);mod({mental:10,moral:5});addPerson('friend','昔の同級生',{name:s.name,close:55});log(s.name+'と和解');return `長い沈黙のあと、${nm1(s.name)}は「ずっと、誰かにそう言ってほしかった」と言った。大きな契約がまとまった。`;}
    S.job.salary*=.92;mod({mental:-8});return '「今さらですね」。それだけ言って、話は打ち切られた。取引は他社に移った。';}),
  O('知らないふりをする',()=>{S.job.salary*=.93;mod({mental:-6,moral:-3});return '最後まで、目を合わせられなかった。半年後、取引を打ち切られた。理由は書かれていなかった。';}),
  O('担当を外してもらう',()=>{S.job.salary*=.97;mod({mental:-3});return '逃げた。あの頃と同じように。';})]);}});

D('pay_saved',{a:[24,62],w:8,c:()=>seed('saved')&&!S.flags.paySaved&&(S.job.id==='none'||S.debt>80||S.st.mental<40||chance(.25)),mk:()=>{S.flags.paySaved=1;const s=seed('saved');
  const ops=[O('会って話す',()=>{const f=addPerson('friend','恩人',{name:s.name,close:80});mod({mental:12});
    if(S.debt>80){const v=Math.min(S.debt,RI(100,300));S.debt-=v;row(`${nm1(s.name)}の援助で借金を返済`,0);return `事情を話すと、${nm1(s.name)}は黙って${yen(v)}を貸してくれた。「返すのはいつでもいい」。`;}
    if(['無職','非正規'].includes(J().cat)){setJob('sales',RI(380,480));log(s.name+'の会社に入る');return `「うちで働かないか」。${nm1(s.name)}の会社に入ることになった。`;}
    return '朝まで話した。あの日のことを、向こうはずっと覚えていた。';})];
  ops.push(O('照れくさくて断る',()=>{mod({mental:2});return '「元気でね」とだけ返した。';}));
  return E('恩返し',`${s.name}という人から、突然メッセージが届いた。<br>「覚えてる？ ${s.age}歳のとき、クラスでたった一人かばってくれたよね。今、小さな会社をやってる。一度会えないかな」`,ops);}});

D('pay_victim',{a:[25,50],w:5,c:()=>seed('victim')&&!S.flags.payVic,mk:()=>{S.flags.payVic=1;const s=seed('victim');
  return E('同窓会',`同窓会の隅で、${s.name}が近づいてきた。昔、上履きを隠したり、机に落書きしたりしていた一人だ。<br>「あのときは……本当に、ごめん」`,[
  O('許す',()=>{mod({mental:12});return '思っていたより、ずっと軽くなった。帰り道、少しだけ泣いた。';}),
  O('「許さない」と言う',()=>{mod({mental:5,moral:2});return '言えた。それで十分だった。';}),
  O('何も言わずに帰る',()=>{mod({mental:-4});return 'あの頃と同じ気持ちが、一瞬でよみがえった。';})]);}});

D('pay_manbiki',{a:[21,30],w:6,c:()=>seed('manbiki')&&!S.flags.payMan&&(WORKING()||S.partner),mk:()=>{S.flags.payMan=1;
  return E('過去',`中学のときの同級生から連絡が来た。「お前さ、昔一緒に万引きしてたよな。今の会社とか、${S.partner?'恋人とか、':''}知ったらどう思うかな」<br>口止め料に20万円、と言っている。`,[
  O('20万円払う',()=>{pay(20,'口止め料');S.seeds.blackmail={age:S.age};mod({mental:-8});return '払った。これで終わるとは、とても思えなかった。';}),
  O('「好きにしろ」と突っぱねる',()=>{if(chance(.4)){if(S.partner){S.partner.close-=25;}else S.job.salary*=.95;mod({mental:-10});return '本当に言いふらされた。しばらく、周りの目がつらかった。';}mod({mental:4});return 'それきり、連絡は来なかった。';}),
  O('警察に相談する',()=>{mod({moral:3,mental:-2});return '恐喝として相談した。相手は二度と連絡してこなかった。自分の過去とも、向き合うことになった。';})]);}});
D('pay_blackmail2',{a:[23,40],w:8,c:()=>seed('blackmail')&&since('blackmail')>=2&&!S.flags.payBm2,mk:()=>{S.flags.payBm2=1;
  return E('過去','また、あの同級生からだ。「今度は50万。払えないなら、わかってるよな」',[
  O('払う',()=>{pay(50,'口止め料');mod({mental:-12});return 'こうなるとわかっていた。';}),
  O('警察に行く',()=>{mod({mental:6,moral:2});return '全部話した。相手は恐喝で捕まった。やっと、終わった。';})]);}});

D('pay_tattoo',{a:[21,34],w:6,c:()=>seed('tattoo')&&!S.flags.payTat,mk:()=>{S.flags.payTat=1;
  return E('デジタルタトゥー',`昔の裏アカウントの悪口のスクリーンショットが、ネットに出回っていた。名前も特定されている。${S.partner?`${S.partner.name}にも見られた。`:'内定先にも届いたらしい。'}`,[
  O('正直に、昔の自分の過ちだと話す',()=>{if(S.partner)S.partner.close-=8;mod({mental:-6,moral:4});return '恥ずかしかった。でも、逃げなかった。';}),
  O('削除依頼を出しまくる',()=>{pay(15,'削除代行');mod({mental:-8});return '消しても消しても、どこかに残っている。';}),
  O('無視する',()=>{if(S.partner&&chance(.4)){S.partner.close-=25;}if(WORKING()&&chance(.3))S.job.salary*=.9;mod({mental:-5});return 'ネットは、何も忘れてくれない。';})]);}});

D('pay_quiet',{a:[26,50],w:7,c:()=>seed('quiet')&&!S.flags.payQuiet,mk:()=>{S.flags.payQuiet=1;const p=S.people.find(x=>x.id===seed('quiet').pid);const n=p?p.name:pname('M');
  return E('再会',`ニュースで${n}の名前を見た。小学生のとき、いつも一人でいたあの子だ。今はAIの会社の社長らしい。<br>メッセージを送ると、すぐに返事が来た。「一緒にやらないか」`,[
  O('転職する',()=>{setJob('engineer',RI(500,700));S.flags.stockOpt=1;mod({mental:6});log(n+'の会社に転職');return 'ストックオプションももらった。会社はまだ小さい。賭けだ。';}),
  O('出資する（100万円）',()=>{if(S.cash<100)return 'お金が足りなかった。';pay(100,'友人の会社に出資');S.seeds.quietInv={age:S.age};return '100万円を出した。夢を買ったつもりだ。';}),
  O('祝福だけする',()=>{if(p)p.close+=15;return '「すごいね」と送った。昔と同じ、短い返事が来た。';})]);}});
D('pay_quiet2',{a:[30,70],w:8,c:()=>(seed('quietInv')&&since('quietInv')>=5||S.flags.stockOpt&&S.job.id==='engineer')&&!S.flags.payQ2,mk:()=>{S.flags.payQ2=1;const win=chance(.35);
  if(win){const v=seed('quietInv')?RI(800,3000):RI(2000,6000);gain(v,'友人の会社の上場');S.mood='happy';log('友人の会社が上場');return E('上場',`あの会社が上場した。持っていた株が${yen(v)}になった。`,[O('信じられない',()=>'小学生のあの日、隣の席に座ってよかった。')]);}
  if(S.flags.stockOpt)S.job.salary*=.8;return E('倒産','あの会社が、資金が尽きて倒産した。',[O('仕方ない',()=>{mod({mental:-8});return '賭けは外れた。でも、後悔はしていない。';})]);}});

D('pay_yancha',{a:[25,55],w:6,c:()=>seed('yancha')&&!S.flags.payYan,mk:()=>{S.flags.payYan=1;const p=S.people.find(x=>x.id===seed('yancha').pid);const n=p?p.name:pname('M');const good=chance(.5);
  if(good)return E('再会',`小学校で一番やんちゃだった${n}が、地元で建設会社をやっていた。「お前、困ってないか？ 困ってたら言えよ」`,[
    O('仕事を手伝う',()=>{gain(RI(30,80),'友人の会社の仕事');if(p)p.close+=10;return '肉体労働はきつかった。でも、昔みたいに笑った。';}),
    O('飲みに行く',()=>{mod({mental:10});if(p)p.close+=15;return '昔話で朝になった。';})]);
  return E('再会',`小学校で一番やんちゃだった${n}から、久しぶりに電話が来た。「ちょっと荷物を預かってほしいんだ。中身は聞くな。礼は弾む」`,[
    O('預かる',()=>{if(chance(.45)){arrest('薬物の運搬',2);return '中身は違法なものだった。警察が来た。';}gain(50,'謎の謝礼');mod({mental:-6});return '50万円が振り込まれた。中身は、知らないままでいいことにした。';}),
    O('断る',()=>{if(p)p.close-=30;return '「冷てえな」。それきりだった。';}),
    O('「もうやめろ」と説得する',()=>{if(p)p.close+=5;mod({moral:4});return '電話の向こうで、しばらく黙っていた。';})]);}});

D('pay_grandpa',{a:[18,60],w:9,c:()=>seed('grandpa')&&!S.flags.payGp&&S.age-seed('grandpa').age>=10,mk:()=>{S.flags.payGp=1;
  return E('形見','祖父の遺品の整理を手伝った。古い手帳の最後のページに、自分の名前があった。<br>「あの子は、わしみたいな人になりたいと言ってくれた。それだけで、いい人生だった」',[
  O('手帳をもらって帰る',()=>{mod({mental:12,moral:4});gain(RI(10,50),'祖父からの形見分け');return '封筒には、少しのお金と「好きに使え」という走り書きが入っていた。';})]);}});

D('pay_rebel',{a:[25,70],w:9,c:()=>seed('rebel')&&!S.flags.payReb&&livingParents().some(p=>p.age>=70),mk:()=>{S.flags.payReb=1;const p=livingParents().sort((a,b)=>b.age-a.age)[0];const lb=p.sex==='M'?'父':'母';
  return E('和解',`${lb}が小さくなった。実家で二人きりになったとき、ぽつりと言った。<br>「あのとき、家を飛び出していったでしょう。あれからずっと、どう接していいかわからなかった」`,[
  O('「あの頃はごめん」と言う',()=>{p.close+=30;mod({mental:15});log(lb+'と和解');return `${lb}は何も言わず、うなずいた。その夜、一緒にご飯を食べた。`;}),
  O('「もういいよ、昔のことだし」と流す',()=>{p.close+=8;return '少しだけ、空気がやわらいだ。';}),
  O('黙っている',()=>{p.close-=5;mod({mental:-6});return '言葉が、出てこなかった。';})],W(p));}});

D('pay_startup',{a:[30,65],w:8,c:()=>(seed('startup_no')||seed('startup_yes'))&&!S.flags.paySt&&(since('startup_no')>=6||since('startup_yes')>=6),mk:()=>{S.flags.paySt=1;const yes=!!seed('startup_yes'),s=seed('startup_yes')||seed('startup_no'),n=s.name||'あの友人';const ok=chance(.3);
  if(!yes)return E('もしも',ok?`${n}の会社が上場した。創業メンバーは、みんな億万長者になったらしい。<br>あのとき「一緒にやらないか」と誘われていた。`:`${n}の会社が倒産したと聞いた。<br>あのとき誘いを受けていたら、自分も一緒に沈んでいた。`,[O(ok?'……そうか':'断ってよかった',()=>{mod({mental:ok?-10:3});return ok?'その夜は眠れなかった。':'でも、少しだけ寂しかった。';})]);
  if(ok){const v=RI(1500,8000);gain(v,'創業メンバーとしての株の売却');S.mood='happy';log(n+'の会社が上場');return E('上場',`${n}の会社が上場した。あの日の決断が、${yen(v)}になった。`,[O('二人で乾杯する',()=>'苦しかった日々を思い出して、二人で泣いた。')]);}
  return E('倒産',`${n}の会社が、ついに倒産した。`,[O('最後まで見届ける',()=>{mod({mental:-6});return '夢は終わった。でも、${n}とは今も友達だ。'.replace('${n}',n);})]);}});

D('pay_lent',{a:[28,85],w:7,c:()=>seed('lent')&&since('lent')>=4&&!S.flags.payLent,mk:()=>{S.flags.payLent=1;const n=seed('lent').name||'あの友人';const r=R();
  if(r<.35){const v=RI(80,200);gain(v,'友人からの返済');return E('返済',`${n}から現金書留が届いた。手紙には「あのときは本当に助かった。おかげで立ち直れた」。<br>貸した額よりずっと多い${yen(v)}が入っていた。`,[O('電話をかける',()=>{mod({mental:12});return '声を聞いたら、昔のままだった。';})]);}
  if(r<.7)return E('音信不通',`貸したお金のことを${n}に聞こうとしたら、電話番号が変わっていた。`,[O('あきらめる',()=>{mod({mental:-6});return 'お金より、友達を一人なくしたことがこたえた。';})]);
  return E('訃報',`${n}が亡くなったと、共通の友人から聞いた。最後まで、借金に追われていたらしい。`,[O('葬儀に行く',()=>{mod({mental:-12});return 'あのとき貸したお金のことは、誰にも言わなかった。';})]);}});

D('pay_tenkin',{a:[35,60],w:6,c:()=>seed('tenkin_no')&&since('tenkin_no')>=4&&!S.flags.payTk&&WORKING(),mk:()=>{S.flags.payTk=1;
  return E('人事','同期が次々に課長になっていく。自分の名前はない。あの転勤を断ったことを、会社は忘れていなかった。',[
  O('この会社で地道にやる',()=>{const j=JOBS[S.job.id];if(j&&j.cap)S.job.salary=Math.min(S.job.salary,j.cap*.7);mod({mental:-5});return '出世はあきらめた。家族との時間は、守れた。';}),
  O('転職を考える',()=>{S.queue.push(evOffers('転職サイトに登録した。',false));return '転職サイトに登録した。';})]);}});

D('pay_affair',{a:[28,70],w:8,c:()=>seed('affair')&&since('affair')>=3&&!S.flags.payAf,mk:()=>{S.flags.payAf=1;
  return E('過去','知らない番号から電話が来た。何年も前に、一線を越えたあの人だった。<br>「会社の人に、全部話してもいいんだよ」',[
  O(S.spouse?'配偶者に全部打ち明ける':'無視する',()=>{if(S.spouse){if(chance(.5)){divorce(true);return '離婚届を渡された。';}S.spouse.close-=30;return '許されたわけではない。それでも、まだ一緒にいる。';}mod({mental:-6});return '着信拒否にした。眠れない夜が続いた。';}),
  O('お金で解決する（100万円）',()=>{pay(100,'口止め');mod({mental:-10});return '過去は、お金では消えなかった。';})]);}});

D('pay_kid',{a:[55,90],w:9,c:()=>(seed('kid_cold')||seed('kid_warm'))&&!S.flags.payKid&&(S.st.health<50||S.age>=70)&&S.kids.some(k=>k.alive!==false&&k.indep),mk:()=>{S.flags.payKid=1;const k=S.kids.filter(k=>k.alive!==false).sort((a,b)=>b.close-a.close)[0];const warm=!!seed('kid_warm')&&!seed('kid_cold');
  if(warm){k.close+=15;return E('子ども',`体調を崩したと聞いて、${k.name}が飛んできた。<br>「あのとき、ちゃんと話を聞いてくれたよね。あれがなかったら、今の自分はいないよ」`,[O('「当たり前だよ」と笑う',()=>{mod({mental:15});return '照れくさくて、窓の外を見た。';})],W(k));}
  k.close-=10;return E('子ども',`入院したことを${k.name}に伝えた。返事は「忙しいから、行けない」だけだった。<br>あの頃、${k.name}の話をちゃんと聞かなかったことを思い出した。`,[
    O('自分から謝りに行く',()=>{k.close+=25;mod({mental:6});return `${k.name}は黙って聞いていた。帰り際、「また来るよ」と言った。`;}),
    O('仕方ないと思う',()=>{mod({mental:-10});return '病室の窓から、ずっと駐車場を見ていた。';})],W(k));}});

D('pay_jimoto',{a:[30,75],w:6,c:()=>seed('jimoto')&&!S.flags.payJimo&&(S.job.id==='none'||S.debt>50||S.st.mental<35),mk:()=>{S.flags.payJimo=1;
  return E('地元','成人式で再会した地元の仲間から、グループに連絡が来た。「最近どう？ 困ってるって聞いたけど」',[
  O('正直に話す',()=>{mod({mental:12});friends().forEach(f=>f.close+=5);if(S.job.id==='none'){setJob('factory',RI(320,400));return '仲間のつてで、地元の会社の仕事が決まった。';}gain(RI(10,30),'仲間からのカンパ');return 'みんなで少しずつお金を出してくれた。地元は、まだ自分を覚えていた。';}),
  O('「大丈夫」と強がる',()=>{mod({mental:-4});return '本当は、大丈夫じゃなかった。';})]);}});

D('pay_daihen',{a:[22,26],w:5,c:()=>seed('daihen')&&!S.flags.payDh&&WORKING(),mk:()=>{S.flags.payDh=1;
  return E('職場','新人研修で、大学で代返を頼んでいた友達と同じ班になった。「今度は俺の分の仕事、頼むわ」',[
  O('手伝ってやる',()=>{mod({mental:-3});friends().forEach(f=>f.close+=4);return '持ちつ持たれつだ、と言い聞かせた。';}),
  O('断る',()=>{return '「冷たくなったな」と言われた。社会人になったんだ、と思った。';})]);}});

// ---------------------------------------------------------------------
// B) 周りの人にも人生がある
// ---------------------------------------------------------------------
D('b_friend_success',{a:[28,60],w:4,cd:0,c:()=>friends().length>0,mk:()=>{const f=pick(friends());
  return E('友人',`SNSを開いたら、${f.name}がテレビに出ていた。始めた会社がうまくいって、雑誌の表紙にもなったらしい。`,[
  O('「おめでとう」と連絡する',()=>{f.close+=10;if(chance(.3)&&['無職','非正規'].includes(J().cat)){setJob('sales',RI(380,460));return `「ちょうど人を探してたんだ」。${nm1(f.name)}の会社で働くことになった。`;}return '「お前に言われるのが一番うれしい」と返ってきた。';}),
  O('見なかったことにする',()=>{f.close-=8;mod({mental:-5});return 'スマホを伏せた。なぜか、自分がみじめに思えた。';}),
  O('自分も何か始めようと燃える',()=>{mod({skill:4,mental:3});return 'その夜、久しぶりにノートを開いた。';})],W(f));}});

D('b_friend_drift',{a:[25,45],w:4,cd:6,c:()=>friends().some(f=>f.close>=50),mk:()=>{const f=pick(friends().filter(f=>f.close>=50));
  return E('友人',`${f.name}に子どもが生まれてから、会う回数がめっきり減った。誘っても「ごめん、また今度」ばかりだ。`,[
  O('こっちから家に会いに行く',()=>{f.close+=12;mod({mental:4});return '赤ちゃんを抱かせてもらった。話す内容は変わったけど、笑い方は昔のままだった。';}),
  O('自然に任せる',()=>{f.close-=25;return 'そのまま、年賀状だけの関係になった。';}),
  O('新しい友達を作る',()=>{f.close-=10;if(chance(.6))addPerson('friend','新しい友人');return '人間関係は、少しずつ入れ替わっていく。';})],W(f));}});

D('b_friend_ill',{a:[38,85],w:3,cd:8,c:()=>friends().some(f=>f.age>=35),mk:()=>{const f=pick(friends().filter(f=>f.age>=35));
  return E('友人',`${f.name}が入院したと聞いた。重い病気らしい。`,[
  O('仕事を休んでお見舞いに行く',()=>{f.close+=20;mod({mental:-3});if(chance(.35)){S.people=S.people.filter(x=>x!==f);log(f.name+'を亡くす');return `${nm1(f.name)}は、病室で昔話をしながら笑っていた。それが最後になった。会いに行って、本当によかった。`;}return '「来てくれたのか」。痩せた手で、握手をした。';}),
  O('落ち着いたら行こうと思う',()=>{if(chance(.35)){S.people=S.people.filter(x=>x!==f);mod({mental:-14});log(f.name+'を亡くす');return `二か月後、${nm1(f.name)}の訃報が届いた。結局、一度も行けなかった。`;}return '退院したと聞いて、ほっとした。';})],W(f));}});

D('b_guarantor',{a:[25,60],w:3,cd:0,c:()=>friends().length>0&&!seed('hosho'),mk:()=>{const f=pick(friends());
  return E('友人',`${f.name}に頭を下げられた。「事業の借り入れに、連帯保証人がどうしても必要なんだ。名前を書いてくれるだけでいい」`,[
  O('保証人になる',()=>{S.seeds=S.seeds||{};S.seeds.hosho={age:S.age,name:f.name};f.close+=15;return `${nm1(f.name)}は何度も頭を下げた。`;}),
  O('断る',()=>{f.close-=20;return '「わかった」。電話の声は冷たかった。';})],W(f));}});
D('pay_hosho',{a:[27,75],w:9,c:()=>seed('hosho')&&since('hosho')>=2&&!S.flags.payHs,mk:()=>{S.flags.payHs=1;const n=seed('hosho').name;
  if(chance(.65)){S.debt+=RI(300,800);mod({mental:-20});S.mood='shock';log('保証人として借金を背負う');return E('連帯保証',`${n}と連絡がつかなくなった。銀行から通知が届いた。「保証人として、残りの借入金を返済してください」`,[O('払うしかない',()=>'名前を書いただけ。それが、こういうことだった。')]);}
  return E('連帯保証',`${n}の事業が軌道に乗り、借入を完済したと連絡が来た。「保証人、外れたよ。本当にありがとう」`,[O('ほっとする',()=>{mod({mental:8});return 'あの日の判子は、間違いじゃなかった。';})]);}});

D('b_sib_return',{a:[30,70],w:3,cd:0,c:()=>S.fam.sibs.some(s=>s.alive&&S.age+s.age>=25)&&livingParents().length>0,mk:()=>{const s=pick(S.fam.sibs.filter(s=>s.alive&&S.age+s.age>=25));const lb=s.older?(s.sex==='M'?'兄':'姉'):(s.sex==='M'?'弟':'妹');
  return E('きょうだい',`${lb}の${s.name}が離婚して、実家に戻ってきた。親の介護も、これからは自分がやると言っている。`,[
  O('任せる',()=>{s.close+=5;S.flags.sibCare=1;return 'そのかわり、親の財産の話になったら揉めそうな気がした。';}),
  O('自分も手伝う',()=>{s.close+=15;mod({mental:-3});return '週末は実家に通うようになった。';}),
  O('「家に居座るつもりか」と言う',()=>{s.close-=25;return 'きょうだいの仲に、ひびが入った。';})]);}});

D('b_ex_news',{a:[26,60],w:3,cd:0,c:()=>S.exes&&S.exes.length>0,mk:()=>{const ex=pick(S.exes);
  return E('風のうわさ',`${ex}が結婚したと、人づてに聞いた。相手は、自分とは正反対のタイプらしい。`,[
  O('心から祝う',()=>{mod({mental:3,moral:2});return 'よかった、と思えた自分に少し驚いた。';}),
  O('SNSをのぞいてしまう',()=>{mod({mental:-6});return '幸せそうな写真が並んでいた。見なければよかった。';}),
  O('今の自分を大事にしようと思う',()=>{if(S.spouse)S.spouse.close+=6;mod({mental:4});return 'となりにいる人を、ちゃんと見ようと思った。';})]);}});

// ---------------------------------------------------------------------
// C) 出来事が重なる
// ---------------------------------------------------------------------
function pressures(){
  const P=[];
  const old=livingParents().filter(p=>p.age>=76);if(old.length)P.push({k:'care',n:`${old[0].sex==='M'?'父':'母'}の介護`});
  const ex=S.kids.find(k=>k.alive!==false&&[14,17].includes(k.age)&&!k.indep);if(ex)P.push({k:'exam',n:`${ex.name}の受験`,kid:ex});
  if(WORKING()&&(S.effort===2||S.job.years<=1))P.push({k:'job',n:'仕事の正念場'});
  if(S.spouse&&S.spouse.close<45)P.push({k:'marry',n:`${S.spouse.name}との関係`});
  if(S.st.health<45)P.push({k:'health',n:'自分の体'});
  if(S.debt>100||(S.cash<20&&S.age>25))P.push({k:'money',n:'お金'});
  return P;
}
function payPressure(p,good,half){const m=half?.5:1;
  switch(p.k){
   case 'care':{const lp=livingParents().filter(x=>x.age>=76);lp.forEach(x=>x.close+=good?15*m:-20);if(good)pay(20*m,'介護費');else if(chance(.3)){lp.forEach(x=>{x.care=true;});return `${p.n}を後回しにした。気づいたときには、${lp[0]&&lp[0].sex==='M'?'父':'母'}はひとりで転んで動けなくなっていた。`;}break;}
   case 'exam':{const k=p.kid;if(good){kidMod(k,{study:8*m});k.close+=8*m;pay(30*m,'塾代');}else{kidMod(k,{study:-6,mental:-6});k.close-=12;}break;}
   case 'job':{if(good){S.job.salary*=1+.08*m;mod({skill:3*m});}else{S.job.salary*=.93;if(chance(.12)){setJob('none');return '仕事をおろそかにした結果、会社に居場所がなくなった。辞めることになった。';}}break;}
   case 'marry':{if(good)S.spouse.close+=20*m;else{S.spouse.close-=15;if(S.spouse.close<15&&chance(.4)){divorce(false);return 'とうとう、離婚届を渡された。';}}break;}
   case 'health':{mod({health:good?12*m:-12});break;}
   case 'money':{if(good){gain(30*m,'副業');mod({health:-4});}else{if(S.debt>0)S.debt*=1.08;}break;}
  }
  return '';
}
D('c_crunch',{a:[28,72],w:7,cd:5,c:()=>pressures().length>=2,mk:()=>{const P=pressures().slice(0,4);
  const ops=P.map(p=>O(`${p.n}を優先する`,()=>{const t=[];P.forEach(q=>{const r=payPressure(q,q===p);if(r)t.push(r);});mod({mental:-4});return `${p.n}に全力を注いだ。そのかわり、${P.filter(q=>q!==p).map(q=>q.n).join('と')}は後回しになった。`+(t.length?'<br>'+t.join('<br>'):'');}));
  ops.push(O('全部、なんとかしようとする',()=>{P.forEach(q=>payPressure(q,true,true));mod({mental:-15,health:-10});if(chance(.3)){S.st.health=Math.max(5,S.st.health-15);return '全部を抱え込んで、ある朝、駅のホームで倒れた。';}return 'どれも中途半端だった。それでも、なんとか一年をやり過ごした。';}));
  return E('重なる年',`今年は、全部が一度に来た。<br>${P.map(p=>'・'+p.n).join('<br>')}<br>体はひとつしかない。`,ops);}});

D('c_workaholic',{a:[25,65],w:6,cd:6,c:()=>(S.hardYrs||0)>=3&&(S.spouse||S.kids.some(k=>k.alive!==false&&!k.indep&&k.age<15)),mk:()=>{const k=S.kids.find(k=>k.alive!==false&&!k.indep&&k.age<15);
  return E('家族',k?`${k.name}の運動会の日も、会社にいた。夜、帰ると${k.name}はもう寝ていた。机の上に「おしごと がんばってね」と書いた紙があった。`:`${S.spouse.name}の誕生日を、忘れていた。気づいたのは、日付が変わってからだった。`,[
  O('働き方を変える',()=>{S.effort=1;S.hardYrs=0;if(k)k.close+=15;if(S.spouse)S.spouse.close+=10;S.job.salary*=.95;return '「がむしゃら」をやめた。出世は少し遠のいた。';}),
  O('家族のためだと言い聞かせる',()=>{if(k)k.close-=15;if(S.spouse)S.spouse.close-=12;mod({mental:-6});return '家族のため。そのはずだった。';})],k?W(k):'');}});

// 「がむしゃら」が何年続いているかを数える
const _startYearS=startYear;
startYear=function(first){_startYearS(first);if(!S)return;if(!first)S.hardYrs=S.effort===2&&S.age>=22?(S.hardYrs||0)+1:0;};

// ---------------------------------------------------------------------
// D) 時代 × 自分の人生
// ---------------------------------------------------------------------
function riskAssets(){let v=S.nisa.v||0;for(const k in S.port)if(!['teiki','kokusai'].includes(k))v+=S.port[k].v||0;return v;}
function sellAllRisk(hair){let tot=0;for(const k of Object.keys(S.port)){if(['teiki','kokusai'].includes(k))continue;const a=S.port[k];const v=a.v*(1-hair);a.v=v;tot+=v;sellAsset(k,v);}if(S.nisa.v>0){const v=S.nisa.v*(1-hair);gain(v,'NISAを売却');tot+=v;S.nisa.v=0;S.nisa.basis=0;S.nisa.plan=0;}return tot;}
function buyIdx(v){if(v<=0)return;pay(v,'インデックス投資');const a=S.port.jpidx||(S.port.jpidx={v:0,basis:0});a.v+=v;a.basis+=v;}

D('d_bubble_house',{a:[25,70],y:[1991,1994],m:true,c:()=>S.house&&!S.flags.dBub&&S.house.loan>S.house.value*.9,mk:()=>{S.flags.dBub=1;const h=S.house;
  return E('バブル崩壊',`${S.year}年。土地の値段が下がり続けている。<br>${h.n}の価値は約${yen(h.value)}。ローンの残りは${yen(h.loan)}。売っても、借金だけが残る。`,[
  O('持ち続けて、ローンを払い続ける',()=>{mod({mental:-8});return '「いつか戻る」。その「いつか」は、何十年も来なかった。';}),
  O('売って損切りする',()=>{const d=Math.max(0,h.loan-h.value);S.debt+=d;S.house=null;S.home='normal';mod({mental:-12});log('家を売り、借金が残る');return `家を売った。手元には${yen(d)}の借金だけが残った。`;})]);}});

D('d_lehman_stock',{a:[20,90],y:[2009,2009],m:true,c:()=>riskAssets()>=30&&!S.flags.dLeh,mk:()=>{S.flags.dLeh=1;
  return E('リーマン・ショック',`2009年。前の年のリーマン・ショックで、持っていた株や投資信託は約${yen(riskAssets())}まで減った。<br>テレビは「100年に1度の危機」と言っている。`,[
  O('怖くなって全部売る',()=>{const v=sellAllRisk(0);mod({mental:3});return `${yen(v)}を現金に戻した。ほっとした。……その後の株価の回復を、あなたは外から眺めることになる。`;}),
  O('じっと持ち続ける',()=>{mod({mental:-6});return '毎朝、株価を見るのをやめた。';}),
  O('逆に買い増す',()=>{const v=Math.min(Math.max(0,S.cash-30),RI(50,200));buyIdx(v);mod({mental:-3});return v>0?`${yen(v)}を買い増した。周りには正気を疑われた。`:'買い増すお金がなかった。';},'',S.cash>40)]);}});

D('d_corona_stock',{a:[20,95],y:[2020,2020],m:true,c:()=>riskAssets()>=30&&!S.flags.dCov,mk:()=>{S.flags.dCov=1;
  return E('コロナ・ショック','2020年3月。株価が1か月で3割下がった。「この先どうなるか誰にもわからない」とニュースが繰り返している。',[
  O('底値で売ってしまう',()=>{const v=sellAllRisk(.3);mod({mental:2});return `売った。手元に残ったのは${yen(v)}。半年後、株価は元に戻っていた。`;}),
  O('持ち続ける',()=>{mod({mental:-4});return '見ないことにした。';}),
  O('今こそ買う',()=>{const v=Math.min(Math.max(0,S.cash-30),RI(30,150));if(v>0){pay(v,'暴落時に買い増し');const q=S.port.jpidx||(S.port.jpidx={v:0,basis:0});q.v+=v*1.3;q.basis+=v;}return v>0?`暴落の真っ最中に${yen(v)}を投じた。手が震えた。`:'買うお金がなかった。';},'',S.cash>40)]);}});

D('d_corona_shop',{a:[20,80],y:[2020,2021],m:true,c:()=>(S.shop||['night','chef'].includes(S.job.id))&&!S.flags.dCovShop,mk:()=>{S.flags.dCovShop=1;
  return E('コロナ',S.shop?`緊急事態宣言で、${S.shop.kind||'店'}に客が来ない。家賃だけが出ていく。`:'店が休業になった。シフトはゼロだ。',[
  O('給付金と融資でしのぐ',()=>{S.debt+=200;gain(100,'持続化給付金');return '借金は増えた。それでも、店の灯りは消さなかった。';},'',!!S.shop),
  O('テイクアウトに切り替える',()=>{if(chance(.5)){gain(RI(30,120),'テイクアウトの売上');return '常連が毎日のように買いに来てくれた。';}mod({mental:-6});return '慣れないことばかりで、うまくいかなかった。';},'',!!S.shop),
  O(S.shop?'店をたたむ':'別の仕事を探す',()=>{if(S.shop){S.shop=null;setJob('none');log('コロナで店を閉める');mod({mental:-15});return '「長い間ありがとうございました」の貼り紙を書いた。';}setJob('freeter');return 'コンビニの夜勤を始めた。';})]);}});

D('d_abenomics',{a:[22,80],y:[2013,2013],m:true,c:()=>S.cash>=200&&riskAssets()<50&&!S.flags.dAbe,mk:()=>{S.flags.dAbe=1;
  return E('アベノミクス',`2013年。日経平均が毎日のように上がっている。会社の先輩は「今買わないやつはバカだ」と言う。<br>預金は約${yen(S.cash)}。`,[
  O('預金の半分で株を買う',()=>{buyIdx(Math.round(S.cash/2));return '人生で初めて、株を買った。';}),
  O('100万円だけ買ってみる',()=>{buyIdx(100);return '少しだけ、乗ってみた。';}),
  O('株は怖いので買わない',()=>'預金は安全だ。金利は、ほぼゼロだったけれど。')]);}});

D('d_nisa2024',{a:[20,75],y:[2024,2025],m:true,c:()=>!(S.nisa.plan>0)&&!S.flags.dNisa&&S.cash>=30,mk:()=>{S.flags.dNisa=1;
  return E('新NISA',`${S.year}年。新NISAが始まり、職場でもその話ばかりだ。${infoLink('nisa')}`,[
  O('月3万円の積立を始める',()=>{S.nisa.plan=36;return '毎月3万円、自動で積み立てることにした。';}),
  O('月10万円の積立を始める',()=>{S.nisa.plan=120;return '生活は少しきつくなるけど、未来に賭けた。';}),
  O('まだ様子を見る',()=>'みんながやっていると、逆に不安になる。')]);}});

D('d_inflation',{a:[60,100],y:[2022,2026],w:6,cd:3,c:()=>['年金','無職'].includes(J().cat),mk:()=>E('物価高',`${S.year}年。電気代も食費も、どんどん上がっていく。年金は、ほとんど増えない。`,[
  O('節約生活に切り替える',()=>{S.life=0;mod({mental:-4});return 'スーパーの値引きシールの時間を覚えた。';}),
  O('シルバー人材で働く',()=>{setJob('silver');mod({health:-2,mental:3});return '週3日、公園の清掃をすることにした。';}),
  O('貯金を取り崩す',()=>{pay(RI(20,40),'物価高');return '通帳の残高を見るのが、怖くなった。';})])});

D('d_crypto17',{a:[18,90],y:[2017,2017],m:true,c:()=>S.port.crypto&&S.port.crypto.v>=5&&!S.flags.dBtc,mk:()=>{S.flags.dBtc=1;
  return E('仮想通貨バブル',`2017年。持っていたビットコインが、とんでもない値段になっている。約${yen(S.port.crypto.v)}。<br>「億り人」という言葉がテレビで流れている。`,[
  O('半分を利益確定する',()=>{sellAsset('crypto',S.port.crypto.v/2);return '半分を売った。税金の額を見て、目を疑った。';}),
  O('まだまだ上がると信じて持つ',()=>'翌年、価格は8割下がった。でも、さらにその先がある。'),
  O('全部売って家を買う頭金にする',()=>{sellAsset('crypto',S.port.crypto.v);mod({mental:6});return '全部売った。夢みたいな一年だった。';})]);}});

// ---- 史実のない年（未来など）でも、相場の荒れと人生がからむ ----
D('d_crash_any',{a:[22,90],w:6,cd:8,c:()=>S.regime==='crash'&&riskAssets()>=30&&![2008,2009,2020].includes(S.year),mk:()=>E('暴落',`${S.year}年。株価が急落し始めた。ニュースは「この下げはまだ続く」と言っている。<br>持っている株や投資信託は約${yen(riskAssets())}。`,[
  O('傷が浅いうちに全部売る',()=>{const v=sellAllRisk(.15);return `${yen(v)}を現金に戻した。この判断が正しかったかは、何年もたってからわかる。`;}),
  O('持ち続ける',()=>{mod({mental:-5});return '証券アプリを消した。';}),
  O('買い増す',()=>{const v=Math.min(Math.max(0,S.cash-30),RI(30,150));buyIdx(v);return v>0?`${yen(v)}を追加で投じた。`:'お金がなかった。';},'',S.cash>40)])});
D('d_boom_any',{a:[22,80],w:5,cd:8,c:()=>S.regime==='boom'&&S.cash>=200&&riskAssets()<50&&![2013].includes(S.year),mk:()=>E('好景気',`${S.year}年。株価が連日、最高値を更新している。周りはみんな「投資で増えた」と話している。<br>預金は約${yen(S.cash)}。`,[
  O('預金の半分で買う',()=>{buyIdx(Math.round(S.cash/2));return '乗り遅れたくなかった。';}),
  O('少しだけ買う（50万円）',()=>{buyIdx(50);return '少しだけ乗ってみた。';}),
  O('見送る',()=>'高いところで買うのは怖い。')])});
D('d_house_crash',{a:[25,80],w:4,cd:10,c:()=>S.house&&S.regime==='crash'&&S.house.loan>S.house.value,mk:()=>{const h=S.house;return E('家',`不景気で、${h.n}の価値が約${yen(h.value)}まで下がった。ローンの残りは${yen(h.loan)}。`,[
  O('住み続ける',()=>{mod({mental:-5});return '家は、売らなければただの住まいだ。そう言い聞かせた。';}),
  O('繰り上げ返済する（100万円）',()=>{if(S.cash<100)return 'お金が足りなかった。';pay(100,'繰り上げ返済');h.loan=Math.max(0,h.loan-100);return '少しだけ、肩の荷が下りた。';})]);}});
