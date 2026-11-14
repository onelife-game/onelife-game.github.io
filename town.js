// =====================================================================
// 街で生きる ― 住む街で、家賃・出会い・事件・体と心が変わる
// =====================================================================
const TOWNS={
 kabuki:{n:'新宿・歌舞伎町',x:40,y:44,r:1.25,col:'#e8457a',tag:'眠らない街。出会いも事件も多い',ef:{charm:1,mental:-1}},
 shibuya:{n:'渋谷',x:42,y:58,r:1.5,col:'#f2b632',tag:'流行の中心。スカウトもナンパも日常',ef:{charm:2}},
 shimokita:{n:'下北沢',x:30,y:58,r:1.1,col:'#9a6bd1',tag:'古着・バンド・小劇場。夢を追う人の街',ef:{skill:1,mental:1}},
 nakano:{n:'中野',x:30,y:44,r:1.0,col:'#3d8ed6',tag:'サブカルの聖地。ほどよく雑多',ef:{mental:1}},
 kichijoji:{n:'吉祥寺',x:16,y:50,r:1.15,col:'#59b56c',tag:'住みたい街の常連。公園とカフェ',ef:{mental:2}},
 ikebukuro:{n:'池袋',x:40,y:30,r:1.0,col:'#4bb8b8',tag:'アニメとラーメン。何でもある',ef:{}},
 roppongi:{n:'港区・六本木',x:52,y:62,r:2.0,col:'#c0c0c8',tag:'お金持ちと、お金持ちのふりをする人の街',ef:{charm:1,mental:-1}},
 wangan:{n:'湾岸・豊洲',x:66,y:66,r:1.6,col:'#7fb2e5',tag:'タワーマンションが並ぶ新しい街',ef:{mental:1}},
 kitasenju:{n:'北千住・足立',x:66,y:24,r:.8,col:'#ee7b1a',tag:'下町の人情。安くてうまい',ef:{comm:1}},
 kamata:{n:'蒲田',x:48,y:82,r:.85,col:'#d6413a',tag:'町工場と銭湯と羽根つき餃子',ef:{health:1}},
 tama:{n:'郊外・多摩',x:6,y:66,r:.7,col:'#80c241',tag:'緑が多く家賃は安い。通勤は地獄',ef:{health:-1,mental:1}},
};
const RENTALS=['share','suburb','adachi','normal','toshin','fam_sub','fam_23'];
const HOME_DEF_TOWN={share:'nakano',suburb:'tama',adachi:'kitasenju',normal:'ikebukuro',toshin:'roppongi',fam_sub:'tama',fam_23:'nakano'};
const HOME_KIND={share:'シェアハウス',suburb:'ワンルーム',adachi:'安い1K',normal:'1K',toshin:'1LDK',fam_sub:'2LDK',fam_23:'2LDK'};
function townId(){if(!S||!RENTALS.includes(S.home))return null;return S.town||HOME_DEF_TOWN[S.home];}
function town(){const t=townId();return t?TOWNS[t]:null;}
// 住まいの名前を、住んでいる街に合わせる
RENTALS.forEach(k=>{const h=HOMES[k],base=h.n;Object.defineProperty(h,'n',{get(){return S&&S.town&&S.home===k?`${HOME_KIND[k]}（${TOWNS[S.town].n}）`:base;},configurable:true});});
// 家賃は街で変わる
const _rentYearT=rentYear;
rentYear=function(){const v=_rentYearT();const t=S.town&&RENTALS.includes(S.home)&&!S.house?TOWNS[S.town]:null;if(!t)return v;const base=HOMES[S.home].rent,def=TOWNS[HOME_DEF_TOWN[S.home]].r;return Math.round(v*t.r/def*10)/10;};
// 毎年、街の空気が少しずつ体と心に効いてくる
const _startYearT=startYear;
startYear=function(first){_startYearT(first);if(!S||first)return;const t=town();if(t&&S.age>=16)mod(t.ef);};

function townMapSVG(cur,sel){
  let s=`<svg viewBox="0 0 80 92" style="width:100%;max-width:420px;display:block;margin:0 auto;image-rendering:pixelated;background:#14161c;border:2px solid var(--ln)">`;
  // 海と川（ドット風の四角）
  s+=`<rect x="58" y="72" width="22" height="20" fill="#1e3a5c"/><rect x="66" y="56" width="14" height="16" fill="#1e3a5c"/><rect x="0" y="86" width="58" height="6" fill="#1e3a5c"/>`;
  s+=`<rect x="60" y="0" width="3" height="56" fill="#1e3a5c" opacity=".7"/>`;
  // 山手線
  s+=`<rect x="34" y="28" width="22" height="34" fill="none" stroke="#9acd32" stroke-width="1.2" stroke-dasharray="2 1" opacity=".55"/>`;
  for(const k in TOWNS){const t=TOWNS[k],on=k===sel,me=k===cur;
    s+=`<g data-t="${k}" style="cursor:pointer"><rect x="${t.x-4}" y="${t.y-4}" width="8" height="8" fill="${t.col}" stroke="${on?'#fff':'#000'}" stroke-width="${on?1.2:.6}"/>`;
    if(me)s+=`<rect x="${t.x-1.5}" y="${t.y-1.5}" width="3" height="3" fill="#fff"/>`;
    s+=`<text x="${t.x}" y="${t.y+8}" font-size="3.4" fill="#ddd" text-anchor="middle" font-family="DotGothic16,monospace">${t.n.replace(/・.*/,'')}</text></g>`;}
  return s+'</svg>';
}
function openTownMap(){
  let sel=townId();
  const ov=sheet('東京の街',`<div class="note">住む街で、家賃・出会い・起きる出来事が変わる。白い点が今の街。</div><div id="tmap"></div><div id="tinfo" class="note" style="min-height:70px"></div>`,[]);
  const draw=()=>{ov.querySelector('#tmap').innerHTML=townMapSVG(townId(),sel);ov.querySelectorAll('#tmap g[data-t]').forEach(g=>g.onclick=()=>{sel=g.dataset.t;draw();});
    const t=TOWNS[sel],cur=sel===townId();const rentNow=Math.round(rentYear()/12*10)/10;const base=HOMES[S.home].rent,def=TOWNS[HOME_DEF_TOWN[S.home]].r;const rentNew=Math.round(base*t.r/def*10)/10;
    const mb=ov.querySelector('.mb');mb.innerHTML='';
    ov.querySelector('#tinfo').innerHTML=`<b style="color:${t.col}">${t.n}</b><br>${t.tag}<br>家賃のめやす：月${yen(rentNew)}（今は月${yen(rentNow)}）`;
    if(!cur){const b=document.createElement('button');b.className='op yl';b.innerHTML=`この街に引っ越す<small>引っ越し代 ${yen(25)}</small>`;b.disabled=S.cash<25||!!S.used.moveTown;
      b.onclick=()=>{pay(25,'引っ越し');S.town=sel;S.used.moveTown=1;S.townYrs=0;log(t.n+'に引っ越す');const r=`${t.n}に引っ越した。${t.tag}。`;S.notes.push(r);S.lastRes=r;ov.remove();render();};mb.appendChild(b);}
  };
  draw();
}
(window.EXTRA_SECS=window.EXTRA_SECS||[]).push(()=>{
  if(!S||S.age<18||!RENTALS.includes(S.home)||S.house)return null;
  const t=town();const s=document.createElement('div');s.className='sec';
  s.innerHTML=`<h3>住んでいる街<span>街で人生が変わる</span></h3><div class="acts"><button class="act">${t.n}<span class="c">地図を開く</span><small>${t.tag}</small></button></div>`;
  s.querySelector('button').onclick=openTownMap;return s;
});

// ---- 街の出来事 ----
const TW=k=>()=>townId()===k;
D('t_kabuki1',{a:[18,60],w:5,cd:4,c:TW('kabuki'),mk:()=>E('歌舞伎町','終電を逃して歩いていたら、「1杯だけ、1000円ポッキリ」と腕をつかまれた。',[
  O('ついていく',()=>{if(chance(.6)){pay(RI(8,25),'ぼったくりバー');mod({mental:-8});return '会計は「1000円」のはずが、桁が違った。断ると、奥から男が出てきた。';}mod({mental:4});return '本当に1000円だった。店のママの身の上話が、妙に心に残った。';}),
  O('振り払って帰る',()=>'ネオンの下を、早足で抜けた。'),
  O('朝まで漫画喫茶で過ごす',()=>{pay(.3,'漫画喫茶');mod({health:-2});return '狭いブースで、知らない人のいびきを聞きながら朝を待った。';})])});
D('t_kabuki2',{a:[18,45],w:4,cd:6,c:TW('kabuki'),mk:()=>E('歌舞伎町','いつものコンビニの前で、毎晩しゃがんでいる若い子がいる。今日は目が合った。「……おなか空いた」',[
  O('おにぎりを買ってあげる',()=>{mod({moral:4,mental:3});if(chance(.3)){addPerson('friend','歌舞伎町で知り合った子');return '少し話をした。家に帰れない事情があるらしい。連絡先を交換した。';}return '「ありがと」と小さく言った。';}),
  O('支援窓口の案内を渡す',()=>{mod({moral:5});return '翌週、その子の姿はなかった。窓口に行ったのだと思いたい。';}),
  O('見ないふりをする',()=>{mod({mental:-2});return 'この街では、みんなそうしている。';})])});
D('t_shibuya1',{a:[16,30],w:5,cd:5,c:TW('shibuya'),mk:()=>E('渋谷','スクランブル交差点で、名刺を差し出された。「モデルとか興味ない？ 宣材写真代だけ先にもらうけど」',[
  O('写真代（10万円）を払う',()=>{pay(10,'宣材写真');if(chance(.15)){mod({charm:6,mental:8});return '本物の事務所だった。小さな雑誌に写真が載った。';}mod({mental:-6});return '連絡はそれきりだった。よくある手口だと、あとで知った。';}),
  O('事務所の名前を調べてから',()=>{mod({study:1});return '調べたら、被害の口コミがいくつも出てきた。';}),
  O('無視する',()=>'渋谷では、毎日のことだ。')])});
D('t_shibuya2',{a:[18,40],w:4,cd:6,c:TW('shibuya'),mk:()=>E('渋谷','ハロウィンの夜。センター街は仮装した人であふれている。',[
  O('仮装して飛び込む',()=>{pay(1,'仮装');if(chance(.35)){addPerson('friend','ハロウィンで知り合った人');mod({mental:8});return '知らない人とハイタッチしまくった。一人と連絡先を交換した。';}if(chance(.15)){mod({health:-6});return '人混みで転んで、けがをした。';}mod({mental:5});return '朝まで騒いだ。';}),
  O('家にこもる',()=>'窓の外の騒ぎを聞きながら、早めに寝た。')])});
D('t_shimokita1',{a:[18,40],w:5,cd:5,c:TW('shimokita'),mk:()=>E('下北沢','行きつけの古着屋の店長に「うちのバンド、ベースが抜けたんだ。やらない？」と誘われた。',[
  O('やる',()=>{S.flags.band=1;mod({skill:4,mental:6});addPerson('friend','バンド仲間');return '週末はスタジオに入るようになった。下手でも、楽しかった。';}),
  O('小劇場の舞台を観に行く',()=>{pay(.4,'観劇');mod({mental:5});return '客は20人。でも、泣いた。';}),
  O('断る',()=>'夢を追う人を、少しうらやましく思った。')])});
D('t_shimokita2',{a:[18,50],w:3,cd:8,c:TW('shimokita'),mk:()=>E('下北沢','駅前の再開発で、通っていた小さなライブハウスが閉店するらしい。',[
  O('最後のライブに行く',()=>{mod({mental:6});return '最後の曲で、知らない人と肩を組んでいた。';}),
  O('クラウドファンディングで支援する（3万円）',()=>{pay(3,'ライブハウス支援');mod({mental:4,moral:3});return '目標額には届かなかった。でも、名前は壁に残った。';})])});
D('t_kichijoji1',{a:[18,70],w:5,cd:5,c:TW('kichijoji'),mk:()=>E('吉祥寺','井の頭公園のベンチで本を読んでいたら、隣の人が同じ本を読んでいた。',[
  O('話しかける',()=>{if(!S.partner&&!S.spouse&&chance(.5)){S.queue.push(evMeet('井の頭公園'));return '本の話で盛り上がった。';}addPerson('friend','公園で知り合った人');return '本の話で盛り上がった。また会う約束をした。';}),
  O('ボートに乗る',()=>{mod({mental:4});return '「ここでボートに乗ると別れる」という噂を思い出した。';}),
  O('そのまま読書を続ける',()=>{mod({study:2,mental:2});return '静かな午後だった。';})])});
D('t_naka1',{a:[18,60],w:5,cd:5,c:TW('nakano'),mk:()=>E('中野','中野ブロードウェイの奥の店で、子どもの頃に集めていたおもちゃが高値で売られていた。',[
  O('実家のおもちゃを売りに来る',()=>{gain(RI(2,30),'おもちゃの買取');return '思い出に、思わぬ値段がついた。';}),
  O('懐かしくて買う（2万円）',()=>{pay(2,'懐かしいおもちゃ');mod({mental:6});return '部屋に飾った。眺めるだけで落ち着く。';}),
  O('見るだけにする',()=>'マニアの熱気に、少しあてられた。')])});
D('t_ike1',{a:[18,60],w:4,cd:6,c:TW('ikebukuro'),mk:()=>E('池袋','サンシャイン通りで、推しのコラボカフェの行列を見つけた。',[
  O('並ぶ',()=>{pay(.5,'コラボカフェ');mod({mental:7});if(chance(.3))addPerson('friend','オタク仲間');return '隣に並んでいた人と、推しの話で3時間しゃべった。';}),
  O('ラーメンを食べて帰る',()=>{mod({mental:3});return '池袋は、ラーメン屋が多すぎる。';})])});
D('t_roppongi1',{a:[22,60],w:5,cd:5,c:TW('roppongi'),mk:()=>E('港区','バーで隣り合った人が、時計とスーツを見せながら言った。「君、才能あるね。うちの投資コミュニティに入らない？ 入会金は100万だけど」',[
  O('入会する',()=>{pay(100,'投資コミュニティ入会金');if(chance(.15)){gain(RI(150,400),'コミュニティ経由の投資');return '本物の人脈だった。紹介された案件で大きく儲けた。';}mod({mental:-10});return '集まりは、新しい会員の勧誘ばかりだった。';},'',S.cash>=100),
  O('名刺だけもらう',()=>'あとで名前を検索したら、逮捕歴が出てきた。'),
  O('お金持ちの知り合いを作ろうと飲み歩く',()=>{pay(RI(10,30),'港区の飲み代');mod({charm:2});if(chance(.3)&&!S.spouse&&!S.partner){S.queue.push(evMeet('港区のバー',true));return '港区の夜は、財布に厳しい。';}return '港区の夜は、財布に厳しい。';})])});
D('t_wangan1',{a:[25,70],w:5,cd:5,c:TW('wangan'),mk:()=>E('湾岸','マンションのママ友・パパ友の集まりで、「何階にお住まい？」と聞かれた。',[
  O('正直に答える',()=>{mod({mental:-4});return '低層階だと言うと、空気が少しだけ変わった。';}),
  O('上の階だと見栄を張る',()=>{mod({mental:-2,moral:-2});return '話を合わせるのに、ずっと疲れていた。';}),
  O('集まりに行かなくなる',()=>{mod({mental:3});return '気が楽になった。';})])});
D('t_wangan2',{a:[25,90],w:3,cd:10,c:TW('wangan'),mk:()=>E('湾岸','大型台風で停電した。エレベーターが止まり、水も出ない。',[
  O('階段で水を運ぶ',()=>{mod({health:-4});return '何往復もした。高い所に住むということを、身をもって知った。';}),
  O('ホテルに避難する（5万円）',()=>{pay(5,'避難');return '海の向こうで、街の灯りが消えていた。';})])});
D('t_senju1',{a:[18,90],w:5,cd:5,c:TW('kitasenju'),mk:()=>E('下町','行きつけの居酒屋の大将が言った。「最近顔色悪いな。今日はおごりだ、食ってけ」',[
  O('甘える',()=>{mod({mental:8,health:2});addPerson('friend','居酒屋の大将',{age:S.age+20});return '常連のおじさんたちと、なぜか朝まで飲んだ。';}),
  O('お礼を言って帰る',()=>{mod({mental:3});return 'その一言だけで、少し救われた。';})])});
D('t_kamata1',{a:[18,90],w:5,cd:5,c:TW('kamata'),mk:()=>E('蒲田','銭湯で、町工場の社長だというおじいさんと話した。「うちの技術を継いでくれる若いのがいないんだ」',[
  O('工場を見学させてもらう',()=>{mod({skill:3});if(['無職','非正規'].includes(J().cat)&&chance(.5)){setJob('factory',RI(320,400));return '「うちで働け」と言われた。気づけば、旋盤の前に立っていた。';}return '0.01ミリの世界に、圧倒された。';}),
  O('湯船で世間話を続ける',()=>{mod({mental:5,health:2});return 'のぼせるまで話した。';})])});
D('t_tama1',{a:[22,65],w:5,cd:4,c:()=>TW('tama')()&&WORKING(),mk:()=>E('通勤','片道1時間半の満員電車。今日も押しつぶされながら会社に向かう。',[
  O('早起きして始発で座る',()=>{mod({study:2,health:-2});return '座れた1時間で、資格の勉強を始めた。';}),
  O('都心に引っ越すことを考える',()=>{openTownMap();return '地図を広げた。';}),
  O('耐える',()=>{mod({mental:-4,health:-2});return '吊り革につかまったまま、少し眠った。';})])});
D('t_tama2',{a:[25,90],w:4,cd:6,c:TW('tama'),mk:()=>E('郊外','休日、近所の里山を歩いた。畑のおばあさんが、野菜を袋いっぱいくれた。',[
  O('家庭菜園を始める',()=>{mod({health:4,mental:5});return '自分で育てたトマトは、少しいびつで、甘かった。';}),
  O('お礼にお菓子を持っていく',()=>{mod({moral:3});addPerson('friend','近所のおばあさん',{age:S.age+40,sex:'F'});return '縁側で、お茶をいただいた。';})])});
