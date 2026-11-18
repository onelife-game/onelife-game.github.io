(function(){
'use strict';
var app = document.getElementById('app');

/* =========================================================
   画像・キャラ
   ========================================================= */
var IMG = {
  maou:'img/maou.webp', maouMini:'img/maou_mini.webp', gii:'img/gii.webp', hako:'img/hako.webp',
  hakoClosed:'img/hako_closed.webp', kata:'img/katakoto.webp', aldo:'img/aldo.webp',
  mirei:'img/mirei.webp', rou:'img/rou.webp', seres:'img/seres.webp', sendai:'img/sendai.webp',
  noel:'img/mirei.webp', knight:'img/aldo.webp'
};
// 新勇者は画像ができるまで既存絵の色変えで仮表示
var FILTER = { noel:'hue-rotate(250deg) saturate(1.3)', knight:'hue-rotate(190deg) saturate(.6) brightness(1.1)' };
function pic(id, extra){ return '<img src="'+IMG[id]+'" alt="" style="'+(FILTER[id]?'filter:'+FILTER[id]+';':'')+(extra||'')+'">'; }

var WHO = {
  maou:{name:'魔王様', img:'maou'}, gii:{name:'ギィ', img:'gii'}, hako:{name:'ハコ', img:'hako'},
  kata:{name:'カタコト', img:'kata'}, aldo:{name:'アルド', img:'aldo'}, mirei:{name:'ミレイ', img:'mirei'},
  rou:{name:'ロウ', img:'rou'}, seres:{name:'セレス', img:'seres'}, noel:{name:'ノエル', img:'noel'},
  knight:{name:'ガウェイン', img:'knight'}, sendai:{name:'先代魔王', img:'sendai'}, sys:{name:'', img:''}
};

/* =========================================================
   罠
   ========================================================= */
var ITEMS = {
  ana: {name:'落とし穴', label:'穴', cost:30, bg:'#3a2410', fg:'#ffe14a', base:40, desc:'40ダメージ。剣士は2倍、騎士は1.5倍。盗賊が先頭だと見破られる。', talk:'あの剣士、絶対前を見ずに走ってくるぞ。ここに掘れ！'},
  kiri:{name:'毒霧',    label:'霧', cost:40, bg:'#0e3a1e', fg:'#6bff8a', base:20, desc:'20ダメージ＋毒（部屋ごとに削る）。魔法使いは2倍。僧侶がいると浄化される。', talk:'じわじわ効くのだ。……僧侶に消されなければな'},
  hono:{name:'炎の床',  label:'炎', cost:50, bg:'#3a0a10', fg:'#ff6b4a', base:60, desc:'60ダメージ。盗賊が先頭だと見破られる。魔法使いには効かない。', talk:'熱いぞ〜！ ただし盗賊と魔法使いには注意なのだ'},
  gi:  {name:'偽宝箱',  label:'',   cost:60, bg:'#141428', fg:'#fff', img:'hakoClosed', base:100, desc:'開けた者にかみつく＋盗賊は捕獲。ハコが育つと他の勇者も捕まえる。', talk:'ハコの出番なのだ！ 強欲な盗賊は開けずにはいられまい'},
  hone:{name:'骸骨兵',  label:'',   cost:80, bg:'#141428', fg:'#fff', img:'kata', base:35, desc:'通る全員に35ダメージ。剣士と魔法使いには砕かれる（カタコトLv3から耐える）。', talk:'カタコト、足止めを頼むのだ。……迷子になるなよ？'},
  me:  {name:'魔眼',    label:'眼', cost:100,bg:'#2a0a3a', fg:'#d68aff', base:20, desc:'20ダメージ＋混乱で自傷。僧侶は逃げ出す。光の勇者にも半減されない。', talk:'臆病な僧侶はこれで逃げ出すはず。高いけど'}
};
var ITEM_ORDER = ['ana','kiri','hono','gi','hone','me'];
var ICON = {
  ana:'<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="38" rx="28" ry="18" fill="#6b5a7a" stroke="#120818" stroke-width="3"/><ellipse cx="32" cy="38" rx="22" ry="13" fill="#0a0612" stroke="#3a2a48" stroke-width="2"/><g fill="#d8d4e8" stroke="#120818" stroke-width="1.5" stroke-linejoin="round"><path d="M18 44 L21 30 L24 44 Z"/><path d="M26 47 L30 28 L34 47 Z"/><path d="M36 46 L40 31 L43 46 Z"/><path d="M44 42 L46 33 L48 42 Z"/></g><path d="M8 34 Q10 26 18 24" fill="none" stroke="#9a8aaa" stroke-width="2"/></svg>',
  kiri:'<svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="#0a2a14" stroke-width="3"><circle cx="20" cy="38" r="13" fill="#2f8a55"/><circle cx="44" cy="38" r="13" fill="#2f8a55"/><circle cx="32" cy="27" r="16" fill="#3fae6a"/></g><circle cx="24" cy="22" r="4" fill="#9cffb8" opacity=".7"/><g fill="#f4f0e0" stroke="#0a2a14" stroke-width="2"><path d="M24 26 a8 8 0 0 1 16 0 v6 h-3 v3 h-10 v-3 h-3 Z"/></g><g fill="#0a2a14"><circle cx="28.5" cy="28" r="2.2"/><circle cx="35.5" cy="28" r="2.2"/></g><g fill="#6bff8a"><circle cx="10" cy="20" r="2.5"/><circle cx="54" cy="18" r="3"/><circle cx="50" cy="54" r="2"/></g></svg>',
  hono:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6 C38 18 50 22 48 38 C47 50 40 58 32 58 C24 58 16 51 16 40 C16 30 22 26 24 18 C28 24 28 28 30 30 C32 22 30 14 32 6 Z" fill="#e0283f" stroke="#3a0a10" stroke-width="3" stroke-linejoin="round"/><path d="M32 22 C36 30 42 34 40 44 C39 51 36 54 32 54 C27 54 23 50 23 44 C23 38 27 36 28 31 C30 34 31 36 32 37 C33 32 31 27 32 22 Z" fill="#ff8a2a"/><path d="M32 36 C35 41 37 44 36 48 C35 51 34 52 32 52 C29 52 28 50 28 48 C28 45 30 43 32 36 Z" fill="#ffe14a"/><rect x="10" y="56" width="44" height="5" rx="2" fill="#3a2418" stroke="#120818" stroke-width="2"/></svg>',
  me:'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="#5b1f86" opacity=".45"/><path d="M4 32 Q32 6 60 32 Q32 58 4 32 Z" fill="#f4eef8" stroke="#1a0828" stroke-width="3.5" stroke-linejoin="round"/><g stroke="#e0384f" stroke-width="1.2" fill="none" opacity=".7"><path d="M10 32 Q16 28 20 30"/><path d="M54 32 Q48 36 44 34"/></g><circle cx="32" cy="32" r="13" fill="#b04ad8" stroke="#1a0828" stroke-width="2.5"/><circle cx="32" cy="32" r="8" fill="#e8b6ff" opacity=".5"/><ellipse cx="32" cy="32" rx="3" ry="11" fill="#1a0828"/><circle cx="27" cy="27" r="3" fill="#fff"/></svg>'
};
var GATE_SVG = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 60 V26 A22 22 0 0 1 54 26 V60 Z" fill="#2a1a12" stroke="#120818" stroke-width="3"/><path d="M16 60 V28 A16 16 0 0 1 48 28 V60 Z" fill="#5a3a22" stroke="#120818" stroke-width="2"/><path d="M32 12 V60 M16 36 H48 M16 48 H48" stroke="#3a2418" stroke-width="2"/><circle cx="40" cy="44" r="2.5" fill="#ffe14a"/></svg>';
function corridor(mode, e, flash){
  var pos = e ? PATH[e.pos] : -1, out = '', n = 0;
  function tokens(i){
    if (!e || i !== pos) return '';
    var here = e.party.filter(function(p){ return !p.out || p.out === 'reached'; });
    return here.length ? '<span class="tk">' + here.map(function(p){ return pic(p.id); }).join('') + '</span>' : '';
  }
  PATH.forEach(function(i){
    if (i === ENTRANCE){ out += '<div class="tile gate" id="t'+i+'"><span class="ico">'+GATE_SVG+'</span><span>入口</span>'+tokens(i)+'</div>'; return; }
    if (i === THRONE){ out += '<div class="tile throne'+(i===flash?' flash':'')+'" id="t'+i+'">'+pic('maouMini','height:52px')+'<span class="gold">玉座</span>'+tokens(i)+'</div>'; return; }
    n++;
    var c = S.grid[i], tag = mode === 'build' ? 'button' : 'div', inner;
    if (c){
      var it = ITEMS[c.k], brk = c.dur <= 0;
      inner = icon(c.k, (brk?'opacity:.3;':'') + 'width:44px;height:44px;flex-shrink:0') + '<span class="tt"><b style="color:'+it.fg+'">'+it.name+'</b><small>'+(brk?'<span class="red">壊れている</span>':'Lv'+c.lv+'　<span class="green">'+'●'.repeat(c.dur)+'</span>')+'</small></span>';
    } else inner = '<span class="mute" style="font-size:12px">空き部屋</span>';
    out += '<'+tag+' class="tile'+(c?'':' empty')+(i===flash?' flash':'')+'" id="t'+i+'"'+(mode==='build'?' data-i="'+i+'"':'')+(c?' style="border-color:'+(c.dur<=0?'#ff6b6b':ITEMS[c.k].fg)+'99"':'')+'><span class="no">'+n+'</span>'+inner+tokens(i)+'</'+tag+'>';
  });
  return out;
}
function corrStyle(){ return 'background:linear-gradient(' + STAGE.tint + ',' + STAGE.tint + '),url(img/bg_dungeon.webp) center top/100% auto repeat-y #120818;background-attachment:local'; }
function icon(k, style){
  var it = ITEMS[k];
  if (it.img) return pic(it.img, style);
  return '<span class="ico" style="'+(style||'')+'">'+ICON[k]+'</span>';
}
var LVM = [0, 1, 1.5, 2, 2.6];
var MAXDUR = 3;

/* =========================================================
   勇者
   ========================================================= */
var HEROES = {
  aldo:  {name:'剣士アルド', short:'アルド', hp:150, reward:50, trait:'猪突猛進。仲間を待たずに走る', weak:'落とし穴（2倍）', note:'骸骨兵を砕く',
          enter:'魔王、覚悟しろーっ！', down:'くそっ……また来るからな！'},
  mirei: {name:'僧侶ミレイ', short:'ミレイ', hp:100, reward:40, trait:'臆病。仲間が倒れると逃げる', weak:'魔眼（即逃走）', note:'毒霧を浄化。いつも最後尾',
          enter:'ひぃ……こ、怖くないです……！', down:'も、もう無理ですぅ〜！'},
  rou:   {name:'盗賊ロウ', short:'ロウ', hp:110, reward:45, trait:'強欲。宝箱は必ず開ける', weak:'偽宝箱（捕獲）', note:'先頭だと穴と炎を見破る。穴と炎が多いと先頭に出る',
          enter:'お宝はどこかな〜っと', down:'ちっ……チビたちに、なんて言えば……'},
  noel:  {name:'魔法使いノエル', short:'ノエル', hp:95, reward:55, trait:'冷静。炎を魔法で消す', weak:'毒霧（2倍）', note:'炎が効かない。骸骨兵を砕く。炎が多いと先頭に出る',
          enter:'……解析開始。罠の位置、把握', down:'計算違い……撤退する'},
  knight:{name:'騎士ガウェイン', short:'ガウェイン', hp:230, reward:80, trait:'忠義。仲間をかばう', weak:'落とし穴（1.5倍）', note:'仲間の受けるダメージを肩代わり。魔眼で混乱しない',
          enter:'我が盾にかけて、仲間は守る！', down:'無念……！'},
  seres: {name:'光の勇者セレス', short:'セレス', hp:420, reward:300, trait:'すべての罠のダメージ半減', weak:'魔眼（半減しない）', note:'毒霧と骸骨兵を浄化。宝箱は開けない',
          enter:'……行こう', down:'……強くなったね'}
};
var HERO_STORY = {
  aldo:['故郷の村は、魔物に畑を荒らされて借金まみれになった。','魔王を倒せば、王国から借金を帳消しにしてもらえる約束だ。','……だが最近、畑を荒らしたのは王国の兵だという噂を聞いた。'],
  mirei:['孤児だったミレイは、教会に拾われて育った。','「役に立たない子は外に出す」と言われ、勇者に志願させられた。','本当は、魔物の怪我も治してあげたいと思っている。'],
  rou:['ロウは、下町の孤児院で育った。','稼ぎはすべて、孤児院のチビたちに送っている。','「魔王軍の方が給料いいんじゃね？」と最近つぶやいた。'],
  noel:['王立魔法院の首席。魔王城は「研究対象」だと言う。','実は、魔物の言葉を独学で研究している。','「魔物と人間は話し合える」という論文は、王国に焼かれた。'],
  knight:['光の王国、近衛騎士団の団長。','かつて、骸骨の騎士と同じ紋章を背負っていた。','「あの方」——カタコトの生前を知る、最後の騎士。'],
  seres:['光の王国、辺境の村の出身。','幼いころ、迷い込んだ魔王城で、角の生えた女の子と遊んだ。','村を人質に取られ、勇者にされた。']
};

/* =========================================================
   ストーリーの夜
   ========================================================= */
var NIGHTS = [null,
  ['aldo'], ['aldo','mirei'], ['rou','aldo','mirei'], ['noel','aldo'], ['rou','mirei','noel'],
  ['knight','aldo','mirei'], ['rou','aldo','noel'], ['knight','rou','mirei'], ['noel','knight','aldo','mirei'],
  ['rou','aldo','mirei','noel'], ['knight','noel','rou','aldo'], ['seres','knight']
];
var LAST = 12;
var BOSS = {6:'knight', 12:'seres'};
var POOL = ['aldo','mirei','rou','noel','knight'];

var STAGES = [
  {name:'地下牢',     sub:'はじまりの迷宮',   path:[0,1,2,3,4,9,14,13,12,11,10,15,20,21,22,23,24,29,28,27], tint:'rgba(0,0,0,0)',        bonus:null,   desc:'標準的な一本道。'},
  {name:'骨の回廊',   sub:'眠れる骸の道',     path:[0,5,10,15,20,25,26,21,16,11,6,1,2,7,12,17,22,27],      tint:'rgba(40,90,140,.38)',  bonus:'hone', desc:'道が短い。骸骨兵のダメージ+30%。'},
  {name:'禁書の書庫', sub:'渦を巻く書架',     path:[0,1,2,3,4,9,14,19,24,29,28,27,26,25,20,15,10,11,12,13,18,17,16], tint:'rgba(20,110,80,.38)', bonus:'me', desc:'渦巻きの長い道。魔眼のダメージ+30%。'},
  {name:'王の大階段', sub:'玉座への最後の道', path:[2,7,6,5,10,15,16,17,12,13,14,19,24,23,22,27],         tint:'rgba(150,20,40,.38)',  bonus:'hono', desc:'とても短い最後の道。炎の床のダメージ+30%。'}
];
var STAGE = STAGES[0], PATH, ENTRANCE, THRONE, ONPATH, ROOMS;
function setStage(i){
  STAGE = STAGES[i]; PATH = STAGE.path; ENTRANCE = PATH[0]; THRONE = PATH[PATH.length-1];
  ONPATH = {}; PATH.forEach(function(k){ ONPATH[k] = true; });
  ROOMS = PATH.filter(function(k){ return k !== ENTRANCE && k !== THRONE; });
}
setStage(0);
function stageIndex(){ return S.mode === 'story' ? (S.night <= 3 ? 0 : S.night <= 6 ? 1 : S.night <= 9 ? 2 : 3) : Math.floor((S.night-1)/3) % 4; }

/* =========================================================
   イベントカード・昼の行動
   ========================================================= */
var EVENTS = {
  calm:   {name:'静かな夜', desc:'特に何も起きない。'},
  moon:   {name:'満月', desc:'魔物の力が高まる。罠のダメージ1.25倍。'},
  rain:   {name:'大雨', desc:'勇者はずぶ濡れ。勇者のHP15%減。'},
  newmoon:{name:'新月', desc:'闇が深い。魔眼のダメージ1.5倍。'},
  rein:   {name:'王国の増援', desc:'勇者に支援が届いた。勇者のHP15%増。'},
  fest:   {name:'祭りの夜', desc:'勇者が浮かれている。撃退の報酬1.5倍。'},
  strike: {name:'ハコのストライキ', desc:'ハコがすねてお休み。偽宝箱が動かない。'},
  merchant:{name:'行商人ゴブ', desc:'罠が3割引きで買える。'},
  quake:  {name:'地震', desc:'城が揺れた。ランダムな罠が2つ壊れた。'}
};
var EVENT_KEYS = Object.keys(EVENTS);

/* =========================================================
   v3：章・勇者の特性・遺物・契約・魔物の進化・罠コンボ
   ========================================================= */
var CHAPTERS = [null,
  ['第一夜','はじまりの夜'],['第二夜','祈る者'],['第三夜','盗賊の影'],['第四夜','魔法院の使者'],['第五夜','父の夢'],
  ['第六夜','盾の騎士'],['第七夜','密書'],['第八夜','骨の記憶'],['第九夜','総力戦'],['第十夜','地下の声'],
  ['第十一夜','最後の前夜'],['終夜','光の勇者']];
var AFFIX = {
  swift: {name:'俊足',   desc:'最初に踏んだ罠を一度だけかわす'},
  holy:  {name:'聖水',   desc:'毒と混乱を一度だけ打ち消す'},
  armor: {name:'鋼の鎧', desc:'罠のダメージ2割減'},
  disarm:{name:'罠解除', desc:'先頭のとき、最初の罠を壊してしまう'},
  greedy:{name:'金目当て', desc:'宝箱を必ず開ける。撃退報酬1.5倍'},
  brave: {name:'不屈',   desc:'一度だけHP1で踏みとどまる'}
};
var AFFIX_KEYS = Object.keys(AFFIX);
var RELICS = {
  stake: {name:'黒曜の杭',   desc:'落とし穴のダメージ+30%'},
  oil:   {name:'竜の油',     desc:'炎の床+30%、引火コンボがさらに強力に'},
  jar:   {name:'腐毒の壺',   desc:'毒の継続ダメージ2倍'},
  gem:   {name:'ハコの宝石', desc:'偽宝箱が開けられやすくなる'},
  crest: {name:'古き紋章',   desc:'骸骨兵のダメージ+30%'},
  eye:   {name:'夜の瞳',     desc:'魔眼のダメージ+30%'},
  hammer:{name:'修繕の槌',   desc:'罠の耐久+1'},
  crown: {name:'魔王の冠',   desc:'玉座の一撃のダメージ1.5倍'},
  pot:   {name:'黄金の壺',   desc:'毎晩の収入+25'},
  bell:  {name:'恐怖の鐘',   desc:'勇者が倒れるたび、残りの勇者のHPが1割減る'},
  tome:  {name:'古文書',     desc:'魔物の経験値2倍'},
  candle:{name:'吸魂の燭台', desc:'撃退報酬+30%'}
};
var RELIC_KEYS = Object.keys(RELICS);
var CURSES = {
  steel: {name:'鋼の勇者',     desc:'勇者のHP+25%', w:2},
  learn: {name:'学習する勇者', desc:'慣れた罠のダメージが半分ではなく3割5分に', w:2},
  poor:  {name:'貧しい魔王城', desc:'毎晩の収入-20', w:1},
  brittle:{name:'脆い罠',      desc:'罠の耐久が2回に', w:2},
  fast:  {name:'韋駄天',       desc:'すべての勇者が「俊足」を持つ', w:3},
  wrath: {name:'王国の怒り',   desc:'夜のイベントが悪いものばかりになる', w:1}
};
var CURSE_KEYS = Object.keys(CURSES);
var BRANCH = {
  hako:[['glutton','大食い','捕獲できるHPの条件がゆるくなる（6割以下）'],['mimic','擬態の達人','開けられやすくなり、魔法使いもだまされる']],
  kata:[['pride','騎士の誇り','光の勇者にも砕かれない'],['legion','骨の軍勢','骸骨兵のダメージ1.4倍']],
  gii: [['spy','密偵の耳','勇者の特性と隊列がすべてわかる'],['merchant','商才','罠が1割引き']]
};
var COMBOS = {
  ignite:{name:'引火', desc:'毒を受けた勇者が炎の床を踏むと大爆発（1.5倍）'},
  chase: {name:'追い打ち', desc:'落とし穴の直後の骸骨兵はダメージ1.5倍'},
  panic: {name:'錯乱', desc:'魔眼で混乱した勇者は次の罠に気づけず、ダメージ1.5倍'},
  feast: {name:'ごちそう', desc:'毒で弱った勇者は偽宝箱に必ず捕まる'}
};
function hasR(k){ return S.relics.indexOf(k) >= 0; }
function hasC(k){ return S.curses.indexOf(k) >= 0; }
function curseW(){ return S.curses.reduce(function(a,k){ return a + CURSES[k].w; }, 0); }
function maxDur(){ return (hasC('brittle') ? 2 : 3) + (hasR('hammer') ? 1 : 0); }
function br(m){ return S.branch[m]; }

/* ---------- 効果音（ファミコン風） ---------- */
var AC = null;
function sfx(type){
  if (!META || !META.sound) return;
  try{
    if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
    var seq = {sel:[[660,.05]], hit:[[180,.06],[120,.08]], trap:[[440,.05],[330,.05],[220,.08]], down:[[523,.08],[659,.08],[784,.14]],
      win:[[523,.1],[659,.1],[784,.1],[1047,.25]], lose:[[392,.18],[330,.18],[262,.35]], hurt:[[110,.12],[90,.2]], combo:[[880,.05],[1175,.05],[1568,.12]], relic:[[784,.08],[988,.08],[1319,.2]]}[type];
    if (!seq) return;
    var t = AC.currentTime;
    seq.forEach(function(n){ var o = AC.createOscillator(), g = AC.createGain(); o.type = 'square'; o.frequency.value = n[0]; g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + n[1]); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + n[1]); t += n[1]; });
  }catch(e){}
}
function shake(){ app.classList.remove('shake'); void app.offsetWidth; app.classList.add('shake'); }

/* =========================================================
   会話
   ========================================================= */
var STORY = {
  prologue: [
    ['sys','魔王城。\n十三代目の魔王が城を継いで、三日目の夜。'],
    ['maou','ふはは！ 今日からわたしが魔王なのだ！\n勇者など、ひねり潰してくれる！'],
    ['gii','魔王様、威勢はいいですが……\n城の魔物、ほとんど逃げちまってますぜ。'],
    ['maou','ぐぬぬ……。\nい、いいのだ！ 罠を張れば怖くないのだ！'],
    ['hako','（パカパカ）'],
    ['kata','……ワタシ、ナニヲ スレバ……？'],
    ['gii','勇者どもは入口から玉座まで一本道を進んできます。\n部屋に罠や魔物を置いて、追い返すんでさ。'],
    ['gii','玉座まで来られたら城の耐久が減ります。\n魔王様の一撃は一晩に一回だけ。過信は禁物ですぜ。'],
    ['maou','よし！ 勇者を泣かせてやるのだ！']
  ],
  n1: [['gii','偵察の結果、今夜は剣士が一人。\n前しか見てない奴ですぜ。'],['maou','落とし穴なのだ！ 落とし穴を掘るのだ！']],
  n2: [['gii','今夜は僧侶付きです。\n毒霧は浄化されちまいます。'],['gii','それと、罠は使うと傷みます。\n3回動いたら壊れるんで、修理を忘れずに。'],['maou','ふん、わかっているのだ。']],
  n3: [['gii','……魔王様、盗賊が混じってます。\n穴と炎が多いと、あいつは先頭に出てきますぜ。'],['maou','ぐぬぬ……。'],['hako','（ぴょこぴょこ）'],['maou','ハコ……？ そうか、お前の出番なのだ！']],
  n4: [['gii','新顔です。王立魔法院の魔法使い。\n炎は消されるし、骸骨兵も砕かれます。'],['noel','……ここが魔王城。興味深い'],['maou','な、なんか怖いのだ……。']],
  n5: [['maou','……。'],['gii','魔王様？ 眠れないんで？'],['maou','父上の夢を見たのだ。'],
       ['sendai','ヴェルミナ。魔王とは、恐れられる者ではない。'],['sendai','行き場のない者を、守る者だ。'],
       ['maou','……父上。わたしには、まだよくわからないのだ。']],
  n6: [['gii','今夜の相手は近衛騎士団長、ガウェイン。\n仲間を盾でかばいます。厄介ですぜ。'],['kata','……ガウェイン……？\nソノ名……シッテイル……'],['maou','カタコト！？']],
  gii_reveal: [['sys','その夜、玉座の間に一通の手紙が落ちていた。'],['maou','「ギィは元勇者パーティの斥候。王国の密偵である」……？'],['gii','……隠しても、しょうがないですね。\n昔の話です。今は魔王様の部下ですよ。'],['maou','……ギィ。']],
  n8: [['kata','オモイダシタ。ワタシ、光ノ王国ノ騎士ダッタ。\nガウェインハ、ワタシノ弟子。'],['kata','命令デ魔王城ヲ攻メテ……倒レタ。\nソシテ先代サマガ、ワタシヲ拾ッタ。'],['maou','父上が……。']],
  n9: [['gii','勇者が4人。今夜は総力戦ですぜ。'],['maou','望むところなのだ！']],
  n10:[['sendai','（……ヴェルミナ……）'],['maou','父上の声……？ 地下から……？'],['gii','魔王様。先代は……亡くなったんじゃない。\n光の王国に封印されてるんです。'],['gii','あっしは、それを知ってて黙ってました。\n……すみません。'],['maou','……全部終わったら、話を聞くのだ。']],
  n11:[['gii','明日、光の勇者が来ます。\n今夜を越えれば、最後の夜です。'],['maou','この城は、わたしが守るのだ。']],
  n12:[['sys','夜。城の門が、静かに開いた。'],['seres','……久しぶりだね、ヴェルミナ。'],['maou','セレス……？\nなんで、お前が……。'],['seres','ごめんね。これが、わたしの役目だから。'],['knight','光の勇者を守れ！ 総員、突撃！']],
  again:[['maou','ぐぬぬ……今度こそなのだ！']],
  gii_q:[['maou','（ギィを、信じるか……？）']],
  gii_trust:[['maou','……ギィは、ギィなのだ。\n今さら疑ったりしないのだ。'],['gii','……魔王様。\n（あっしは、この人に仕えてよかった）']],
  gii_exile:[['maou','……出ていくのだ。'],['gii','……わかりました。\nどうか、お元気で。'],['sys','ギィは城を去った。\n偵察の情報が入らなくなった。']],
  rou_offer:[['rou','……なあ魔王。\nオレ、もう三回も箱に食われてんだけど。'],['rou','あんたんとこ、給料出る？\nチビたちに仕送りしなきゃなんねえんだ。']],
  rou_yes:[['maou','……仕方ないのだ。働くのだ！'],['rou','へへっ、毎度あり。\n盗んだ……じゃなくて、稼いだ魂は渡すぜ。'],['sys','ロウが仲間になった！ 毎晩の収入が増える。']],
  rou_no:[['maou','魔王軍は泥棒お断りなのだ！'],['rou','ちぇっ。']],
  mirei_offer:[['sys','城の門の前で、僧侶が座り込んでいた。'],['mirei','あの……教会に、戻れないんです。\n逃げてばかりで、役立たずだって……。']],
  mirei_yes:[['maou','……じゃあ、ここにいればいいのだ。\nケガした魔物を治してほしいのだ。'],['mirei','……！ はいっ！'],['sys','ミレイが仲間になった！ 城の耐久の上限が1増えた。']],
  mirei_no:[['maou','ここは魔王城なのだ。帰るのだ。'],['mirei','……はい。']],
  final:[
    ['seres','……強くなったね、ヴェルミナ。'],
    ['maou','セレス。どうして勇者なんかに……。'],
    ['seres','光の王国はね……\n魔王を倒さないと、わたしの村を焼くって。'],
    ['seres','ヴェルミナ。とどめを、刺して。\nそうすれば、村は見逃してもらえるから。']
  ],
  over:[['maou','ぐぬぬ……城が……。'],['gii','魔王様、逃げますぜ！ 早く！'],['sys','魔王城は、勇者たちに攻め落とされた……。']]
};
var ENDINGS = {
  lonely:{name:'孤独な玉座', lines:[['maou','……ごめんなのだ。'],['sys','魔王は、勇者を倒した。\n城に平和が戻った。'],['sys','けれど、その日から\n魔王様が笑うことは、なかった。']]},
  betray:{name:'裏切りの夜明け', lines:[['maou','……ごめんなのだ。'],['sys','勇者が倒れた夜。\n城を去ったギィは、王国にすべてを報告していた。'],['sys','翌朝、魔王城は光の王国の大軍に囲まれた。\n魔王様の隣には、もう誰もいなかった。']]},
  friend:{name:'勇者お断り、友だち歓迎', lines:[['maou','帰るのだ、セレス。\n王国には「魔王は強すぎた」と言えばいいのだ。'],['seres','……ヴェルミナ。'],['maou','そして、また遊びに来るのだ。\n勇者じゃなくて、友だちとして。'],['seres','……うん。'],['sys','その夜から、魔王城には\nときどき銀髪の客が来るようになった。']]},
  family:{name:'新しい魔王軍', lines:[['maou','帰らなくていいのだ、セレス。\n村の人も、みんなここに呼ぶのだ。'],['rou','部屋なら空いてるぜ。罠だらけだけど。'],['mirei','ケガ人の手当てはまかせてください！'],['sys','魔王城は、勇者も魔物も一緒に暮らす\nちょっと変わった城になった。']]},
  father:{name:'父との再会', lines:[['seres','ヴェルミナ。お父さんは……\n王都の地下に封印されてる。わたし、場所を知ってる。'],['gii','あっしが道を案内します。\n今度こそ、本当のことをするために。'],['kata','ワタシモ行ク。ガウェインモ、連レテ。'],['maou','行くのだ、みんな。\n……父上を、迎えに。'],['sys','数日後。\n魔王城の玉座の横に、もうひとつ椅子が増えた。'],['sendai','……大きくなったな、ヴェルミナ。'],['maou','……おかえりなさい、なのだ。']]}
};
var WIN_LINES = ['ふはははは！ 見たか、魔王軍の力を！','今夜も城は守られたのだ！ えっへん！','勇者ども、泣いて帰ったのだ！','ふふん、作戦通りなのだ！'];
var HURT_LINES = ['ぐぬぬ……玉座まで来られたのだ……','い、痛くないのだ！ 全然平気なのだ！'];

/* =========================================================
   永続データ（改築・実績・記録）
   ========================================================= */
var META;
function metaDefault(){ return { stones:0, up:{souls:0, castle:0, trap:0, hako:0, kata:0, scout:0, strike:0}, ach:{}, endings:{}, cleared:[false,false,false], bestEndless:0,
  stats:{def:{aldo:0,mirei:0,rou:0,noel:0,knight:0,seres:0}, hakoCatch:0, anaKill:0, meFlee:0, nights:0}, combos:{}, sound:true }; }
function loadMeta(){ try{ var t = localStorage.getItem('maou_meta_v2'); META = t ? JSON.parse(t) : metaDefault(); }catch(e){ META = metaDefault(); }
  var d = metaDefault(); for (var k in d) if (META[k] === undefined) META[k] = d[k]; for (var u in d.up) if (META.up[u] === undefined) META.up[u] = 0; }
function saveMeta(){ try{ localStorage.setItem('maou_meta_v2', JSON.stringify(META)); }catch(e){} }

var UPGRADES = [
  {id:'souls',  name:'宝物庫の拡張', desc:'はじめの魂 +60', max:5, cost:[10,20,30,45,60]},
  {id:'castle', name:'城壁の補強',   desc:'城の耐久 +1',    max:2, cost:[30,70]},
  {id:'trap',   name:'禁断の罠術',   desc:'罠をLv4まで強化できる', max:1, cost:[60]},
  {id:'hako',   name:'ハコのおやつ', desc:'ハコが Lv+1 で始まる', max:2, cost:[15,35]},
  {id:'kata',   name:'カタコトの剣', desc:'カタコトが Lv+1 で始まる', max:2, cost:[15,35]},
  {id:'scout',  name:'コウモリ偵察網', desc:'勇者が隊列を変えるか事前にわかる', max:1, cost:[25]},
  {id:'strike', name:'魔王様の特訓', desc:'玉座の一撃が一晩2回になる', max:1, cost:[80]}
];

var ACH = [
  {id:'first', name:'はじめての勝利', desc:'1夜目を守りきる'},
  {id:'hako10', name:'ハコの大好物', desc:'偽宝箱で合計10人を捕まえる'},
  {id:'ana20', name:'穴掘り職人', desc:'落とし穴で合計20人を撃退'},
  {id:'me10', name:'にらめっこ最強', desc:'魔眼で合計10回勇者を逃がす'},
  {id:'clear0', name:'魔王様、デビュー', desc:'ストーリーをクリア（ノーマル）'},
  {id:'clear1', name:'本物の魔王', desc:'難易度「魔王」でクリア'},
  {id:'clear2', name:'大魔王降臨', desc:'難易度「大魔王」でクリア'},
  {id:'nohurt', name:'鉄壁の城', desc:'城の耐久を一度も減らさずクリア'},
  {id:'nostrike', name:'見ているだけ', desc:'魔王様が一度も殴らずにクリア'},
  {id:'rou', name:'給料はちゃんと出す', desc:'ロウを仲間にする'},
  {id:'mirei', name:'城の保健室', desc:'ミレイを仲間にする'},
  {id:'trust', name:'疑わない心', desc:'ギィを信じる'},
  {id:'mon5', name:'魔物ブリーダー', desc:'3体の魔物をすべてLv5にする'},
  {id:'rich', name:'倹約家', desc:'魂を1000以上ためる'},
  {id:'end10', name:'眠れない夜', desc:'エンドレスで10夜を越える'},
  {id:'end20', name:'終わらない夜', desc:'エンドレスで20夜を越える'},
  {id:'end30', name:'永遠の魔王', desc:'エンドレスで30夜を越える'},
  {id:'combo4', name:'罠の芸術家', desc:'罠コンボを4種類すべて見つける'},
  {id:'relic6', name:'収集家', desc:'1回のプレイで遺物を6個集める'},
  {id:'curse6', name:'血の契約', desc:'契約の重さ6以上でストーリーをクリア'},
  {id:'curse10', name:'狂気の契約', desc:'契約の重さ10以上でストーリーをクリア'},
  {id:'e_lonely', name:'END：孤独な玉座', desc:'エンディングを見る'},
  {id:'e_betray', name:'END：裏切りの夜明け', desc:'エンディングを見る'},
  {id:'e_friend', name:'END：友だち歓迎', desc:'エンディングを見る'},
  {id:'e_family', name:'END：新しい魔王軍', desc:'エンディングを見る'},
  {id:'e_father', name:'END：父との再会', desc:'エンディングを見る'}
];
var newAch = [];
function unlock(id){ if (META.ach[id]) return; META.ach[id] = true; META.stones += 10; newAch.push(id); saveMeta(); }
function achName(id){ for (var i=0;i<ACH.length;i++) if (ACH[i].id===id) return ACH[i].name; return id; }

/* =========================================================
   ラン状態
   ========================================================= */
var DIFF = [{name:'ノーマル', hp:1, inc:65, castle:0}, {name:'魔王', hp:1.3, inc:50, castle:0}, {name:'大魔王', hp:1.6, inc:40, castle:-1}];
var S, SNAP;
function newRun(mode, diff, curses){
  var cmax = 3 + META.up.castle + DIFF[diff].castle;
  S = { mode:mode, diff:diff, night:1, souls:200 + 60*META.up.souls, castle:cmax, castleMax:cmax, grid:new Array(30).fill(null),
        mem:{}, mon:{hako:{lv:1+META.up.hako, exp:0}, kata:{lv:1+META.up.kata, exp:0}, gii:{lv:1, exp:0}},
        kind:0, giiTrust:null, recruited:{rou:false, mirei:false}, offered:{rou:false, mirei:false}, metSeres:false,
        hurtEver:false, strikeEver:false, event:'calm', lastCaught:false, dayDone:false, price:1, partyIds:null,
        relics:[], curses:(curses||[]).slice(), affix:{}, branch:{hako:null, kata:null, gii:null}, journal:[], relicOffer:false };
  Object.keys(HEROES).forEach(function(k){ S.mem[k] = {def:0, resist:[], caught:0, fled:0}; });
  S.stage = 0; setStage(0);
}
function save(){ try{ localStorage.setItem('maou_run_v2', JSON.stringify(S)); }catch(e){} }
function loadRun(){ try{ var t = localStorage.getItem('maou_run_v2'); return t ? JSON.parse(t) : null; }catch(e){ return null; } }
function clearRun(){ try{ localStorage.removeItem('maou_run_v2'); }catch(e){} }
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function rnd(n){ return Math.floor(Math.random()*n); }
function maxLv(){ return 3 + META.up.trap; }
var EXP_T = [0, 3, 7, 12, 18];
function addExp(m, n){ var M = S.mon[m]; if (M.lv >= 5) return; M.exp += n; while (M.lv < 5 && M.exp >= EXP_T[M.lv]){ M.lv++; } }
function giiOn(){ return S.giiTrust !== false; }

/* =========================================================
   共通UI
   ========================================================= */
function h(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
var BG_OVER = {title:'rgba(0,0,0,.05),rgba(0,0,0,.35)', throne:'rgba(0,0,0,.25),rgba(0,0,0,.55)', room:'rgba(0,0,0,.45),rgba(0,0,0,.7)', dungeon:'rgba(0,0,0,.2),rgba(0,0,0,.45)', dawn:'rgba(0,0,0,.25),rgba(0,0,0,.6)', ruins:'rgba(0,0,0,.2),rgba(0,0,0,.6)', ending:'rgba(0,0,0,.1),rgba(0,0,0,.5)'};
function bgStyle(bg){
  if (!bg) return '';
  var tint = bg === 'dungeon' ? 'linear-gradient(' + STAGE.tint + ',' + STAGE.tint + '),' : '';
  return 'background:' + tint + 'linear-gradient(' + BG_OVER[bg] + '),url(img/bg_' + bg + '.webp) center/cover no-repeat #000;';
}
var CURBG = 'room';
function screen(html, bg){ app.innerHTML = '<div class="screen" style="' + bgStyle(bg || CURBG) + '">' + html + '</div>'; return app.firstChild; }
function on(root, sel, fn){ var el = root.querySelector(sel); if (el) el.addEventListener('click', fn); return el; }
function hearts(){ var s=''; for (var i=0;i<S.castleMax;i++) s += i < S.castle ? '<span class="red">♥</span>' : '<span class="mute">♡</span>'; return s; }
function nightLabel(){ return (S.mode==='endless'?'無限 ':'') + '第'+S.night+'夜'; }
function topBar(mid){ return '<div class="win bar"><span>'+nightLabel()+'</span><span>'+(mid||'')+'</span><span>'+hearts()+'</span></div>'; }
function achToast(){ if (!newAch.length) return ''; var t = newAch.map(function(id){ return '<p class="gold">★ 実績解除：'+h(achName(id))+'（魔石+10）</p>'; }).join(''); newAch = []; return '<div class="win" style="border-color:#ffe14a">'+t+'</div>'; }

function talk(lines, done, bg){
  var i = 0, timer = null, full = '', shown = 0;
  app.innerHTML = '<div class="dlg" style="' + bgStyle(bg || 'throne') + '"><div class="portrait"></div><div class="win msg"><p class="name"></p><p class="text"></p></div><span class="next blink">▼</span></div>';
  var root = app.firstChild, por = root.querySelector('.portrait'), nm = root.querySelector('.name'), tx = root.querySelector('.text'), nx = root.querySelector('.next');
  function show(){
    var L = lines[i], w = WHO[L[0]];
    por.innerHTML = w.img ? pic(w.img) : '';
    nm.textContent = w.name; full = L[1]; shown = 0; tx.textContent = ''; nx.style.visibility = 'hidden';
    clearInterval(timer);
    timer = setInterval(function(){ shown++; tx.textContent = full.slice(0, shown); if (shown >= full.length){ clearInterval(timer); timer = null; nx.style.visibility = 'visible'; } }, 30);
  }
  root.addEventListener('click', function(){
    if (timer){ clearInterval(timer); timer = null; tx.textContent = full; nx.style.visibility = 'visible'; return; }
    i++; if (i >= lines.length){ done(); return; } show();
  });
  show();
}
function choice(prompt, opts, bg){
  var root = screen('<div style="flex:1"></div><div class="win"><p style="font-size:17px;line-height:1.6">'+h(prompt)+'</p></div><div class="win cmd">'+
    opts.map(function(o,i){ return '<button data-i="'+i+'"'+(i===0?' class="sel"':'')+'>'+h(o[0])+'</button>'; }).join('')+'</div><div class="lift"></div>', bg || 'throne');
  root.querySelector('.cmd').addEventListener('click', function(e){ var b = e.target.closest('[data-i]'); if (b) opts[+b.dataset.i][1](); });
}

/* =========================================================
   タイトル
   ========================================================= */
function titleScreen(){
  CURBG = 'title';
  loadMeta();
  var run = loadRun();
  var endlessOpen = META.cleared[0];
  var root = screen(

    '<div class="title-logo" style="margin-top:18px;position:relative"><p class="sub">勇者を倒したい</p><h1>魔王様</h1><p class="en" style="margin-top:8px">THE LITTLE DEMON LORD</p></div>'+
    '<div style="flex:1;min-height:120px;display:flex;justify-content:center;align-items:flex-end;position:relative">'+pic('maou','max-height:100%;max-width:70%')+'</div>'+
    '<div class="win cmd" style="position:relative;margin:0 10px">'+
      (run ? '<button id="b-cont" class="sel">つづきから（'+(run.mode==='endless'?'無限 ':'')+'第'+run.night+'夜）</button>' : '')+
      '<button id="b-new"'+(run?'':' class="sel"')+'>ストーリー</button>'+
      '<button id="b-end"'+(endlessOpen?'':' disabled')+'>無限の夜'+(endlessOpen?'（最高 '+META.bestEndless+'夜）':'（クリアで解放）')+'</button>'+
      '<button id="b-up">魔王城の改築　<span class="gold">魔石 '+META.stones+'</span></button>'+
      '<button id="b-ach">実績　'+Object.keys(META.ach).length+'/'+ACH.length+'</button>'+
      '<button id="b-zk">なかま図鑑</button>'+
      '<button id="b-snd">効果音：'+(META.sound?'ON':'OFF')+'</button>'+
    '</div>'
  );
  on(root,'#b-cont',function(){ S = run; setStage(S.stage || 0); SNAP = clone(S); nightFlow(true); });
  on(root,'#b-new',pickDiff);
  on(root,'#b-end',function(){ contracts(function(c){ newRun('endless', 0, c); nightFlow(); }); });
  on(root,'#b-snd',function(e){ META.sound = !META.sound; saveMeta(); e.currentTarget.textContent = '効果音：' + (META.sound?'ON':'OFF'); sfx('sel'); });
  on(root,'#b-up',upgrades);
  on(root,'#b-ach',achievements);
  on(root,'#b-zk',function(){ zukan(titleScreen); });
}
function pickDiff(){
  CURBG = 'throne';
  var opts = DIFF.map(function(d, i){
    var open = i === 0 || META.cleared[i-1];
    return [ (open?'':'🔒 ') + d.name + (i===0?'（はじめて向け）':i===1?'（勇者HP1.3倍・収入減）':'（勇者HP1.6倍・収入激減・城の耐久-1）') + (META.cleared[i]?' ★':''),
      function(){ if (!open) return; contracts(function(c){ newRun('story', i, c); talk(STORY.prologue, function(){ nightFlow(); }); }); } ];
  });
  opts.push(['もどる', titleScreen]);
  choice('難易度を選ぶのだ。上の難易度は、ひとつ下をクリアすると解放されるのだ。', opts);
}

/* =========================================================
   夜の流れ
   ========================================================= */
function nightFlow(resume){
  if (!resume){
    S.dayDone = false; S.partyIds = null; S.price = 1;
    var si = stageIndex(); S.stageMsg = '';
    if (si !== S.stage){ var back = 0; S.grid.forEach(function(c){ if (c) back += c.spent; }); S.grid = new Array(30).fill(null); S.souls += back; S.stage = si; S.stageMsg = back ? '迷宮の形が変わった！ 罠を回収した（魂+' + back + '）' : ''; }
    setStage(S.stage);
    S.event = pickEvent();
    if (S.event === 'quake'){ var g = ROOMS.filter(function(i){ return S.grid[i] && S.grid[i].dur > 0; }); for (var q=0;q<2&&g.length;q++){ var j = g.splice(rnd(g.length),1)[0]; S.grid[j].dur = 0; } }
    if (S.event === 'merchant') S.price = 0.7;
  }
  SNAP = clone(S); save();
  if (resume){ (S.dayDone ? scout : dayAction)(); return; }
  var seq = [];
  if (S.mode === 'story'){
    if (S.night === 7 && S.giiTrust === null) seq.push(giiEvent);
    var key = 'n' + S.night;
    if (S.night === LAST && S.metSeres) key = 'again';
    if (S.night === LAST) S.metSeres = true;
    if (STORY[key]) seq.unshift(function(next){ talk(STORY[key], next); });
    if (!S.offered.rou && S.mem.rou.caught >= 3 && S.night < LAST) seq.push(rouEvent);
    if (!S.offered.mirei && S.mem.mirei.fled >= 3 && S.night < LAST) seq.push(mireiEvent);
  }
  seq.unshift(chapterCard);
  (function run(){ if (!seq.length){ dayAction(); return; } var f = seq.shift(); f(run); })();
}
function pickEvent(){
  if (S.mode === 'story' && (S.night <= 2 || BOSS[S.night])) return 'calm';
  var keys = EVENT_KEYS;
  if (hasC('wrath')) return ['rein','quake','strike'][rnd(3)];
  if (S.mode === 'story' && S.night < 5) keys = keys.filter(function(k){ return k !== 'strike' && k !== 'quake' && k !== 'rein'; });
  return keys[rnd(keys.length)];
}
function giiEvent(next){
  talk(STORY.gii_reveal.concat(STORY.gii_q), function(){
    choice('ギィを信じるか？', [
      ['信じる', function(){ S.giiTrust = true; S.kind++; unlock('trust'); talk(STORY.gii_trust, next); }],
      ['追放する', function(){ S.giiTrust = false; S.kind--; talk(STORY.gii_exile, next); }]
    ]);
  });
}
function rouEvent(next){
  S.offered.rou = true;
  talk(STORY.rou_offer, function(){ choice('ロウを雇うか？', [
    ['雇う', function(){ S.recruited.rou = true; S.kind++; unlock('rou'); talk(STORY.rou_yes, next); }],
    ['追い返す', function(){ S.kind--; talk(STORY.rou_no, next); }]
  ]); });
}
function mireiEvent(next){
  S.offered.mirei = true;
  talk(STORY.mirei_offer, function(){ choice('ミレイを城に置くか？', [
    ['置いてあげる', function(){ S.recruited.mirei = true; S.kind++; S.castleMax++; S.castle++; unlock('mirei'); talk(STORY.mirei_yes, next); }],
    ['帰す', function(){ S.kind--; talk(STORY.mirei_no, next); }]
  ]); });
}

/* =========================================================
   勇者パーティ
   ========================================================= */
function partyIds(){
  if (S.partyIds) return S.partyIds;
  var ids;
  if (S.mode === 'story'){ ids = NIGHTS[S.night].slice(); }
  else {
    var n = Math.min(2 + Math.floor(S.night/4), 5), pool = POOL.slice(); ids = [];
    while (ids.length < n && pool.length) ids.push(pool.splice(rnd(pool.length),1)[0]);
    if (S.night % 10 === 0) ids.unshift('seres');
  }
  ids = ids.filter(function(id){ return !S.recruited[id]; });
  if (!ids.length) ids = ['aldo'];
  S.partyIds = ids;
  S.affix = {};
  var ch = (S.mode === 'story' ? (S.night >= 4 ? 0.2 + 0.06*(S.night-4) : 0) : 0.1 + 0.04*S.night) + 0.12*S.diff;
  ids.forEach(function(id){
    var a = hasC('fast') ? ['swift'] : [];
    if (id === 'seres') a.push('holy');
    for (var t=0; t<2; t++){ if (Math.random() < ch){ var k = AFFIX_KEYS[rnd(AFFIX_KEYS.length)]; if (a.indexOf(k) < 0) a.push(k); } }
    S.affix[id] = a;
  });
  return ids;
}
function makeParty(){
  var D = DIFF[S.diff];
  return partyIds().map(function(id){
    var b = HEROES[id], m = S.mem[id];
    var max = id === 'seres' ? b.hp + 60*m.def + (S.mode==='endless' ? 30*S.night : 0)
      : b.hp * 1.2 * (1 + 0.14*(S.night-1) + (S.mode==='endless' ? 0.04*S.night : 0)) * (1 + Math.min(0.08*m.def, 0.4));
    max *= D.hp;
    if (S.event === 'rain') max *= 0.85;
    if (S.event === 'rein') max *= 1.15;
    if (hasC('steel')) max *= 1.25;
    max = Math.round(max);
    return { id:id, hp:max, max:max, out:null, poison:0, resist:m.resist.slice(), lastHit:null, aff:(S.affix[id]||[]).slice(), used:{}, confused:false };
  });
}
function trapCount(keys){ var n = 0; ROOMS.forEach(function(i){ var c = S.grid[i]; if (c && c.dur > 0 && keys.indexOf(c.k) >= 0) n++; }); return n; }
function arrange(party, lines){
  var order = party.slice(), front = null;
  var has = function(id){ return order.some(function(p){ return p.id === id; }); };
  if (has('knight') && trapCount(['hone']) >= 2) front = 'knight';
  if (has('noel') && trapCount(['hono']) >= 3) front = 'noel';
  if (has('rou') && trapCount(['ana','hono']) >= 3) front = 'rou';
  if (front && order[0].id !== front){
    var p = order.filter(function(x){ return x.id === front; })[0];
    order = [p].concat(order.filter(function(x){ return x !== p; }));
    if (lines) lines.push(HEROES[front].short + 'が罠を警戒して先頭に出た！');
  }
  var mi = order.filter(function(x){ return x.id === 'mirei'; })[0];
  if (mi && order[order.length-1] !== mi){ order = order.filter(function(x){ return x !== mi; }).concat([mi]); }
  return order;
}

/* =========================================================
   昼の行動
   ========================================================= */
function dayAction(){
  CURBG = 'room';
  var need = ['hako','kata','gii'].filter(function(m){ return S.mon[m].lv >= 3 && !S.branch[m] && (m !== 'gii' || giiOn()); })[0];
  if (need){ branchChoice(need, dayAction); return; }
  if (S.night === 1 && S.mode === 'story'){ S.dayDone = true; save(); scout(); return; }
  var broken = ROOMS.some(function(i){ return S.grid[i] && S.grid[i].dur <= 0; });
  var opts = [
    ['訓練：魔物たち全員に経験値+2', function(){ ['hako','kata','gii'].forEach(function(m){ addExp(m, 2); }); done('魔物たちが訓練した！'); }],
    ['宝物庫あさり：魂を少し手に入れる', function(){ var g = 50 + rnd(80); S.souls += g; done('宝物庫から魂'+g+'を見つけた！'); }],
  ];
  if (S.castle < S.castleMax) opts.push(['城の修繕：城の耐久を1回復', function(){ S.castle++; done('城壁を直した！'); }]);
  if (broken) opts.push(['罠の手入れ：壊れた罠をすべて無料で修理', function(){ ROOMS.forEach(function(i){ if (S.grid[i]) S.grid[i].dur = maxDur(); }); done('罠を手入れした！'); }]);
  if (S.lastCaught) opts.push(['捕虜の尋問：今夜の勇者のHPを1割削る', function(){ S.interro = true; done('捕虜から勇者の弱みを聞き出した！'); }]);
  function done(msg){ S.dayDone = true; save(); var r = screen(topBar('昼')+'<div style="flex:1;display:flex;align-items:center;justify-content:center"><p class="gold" style="font-size:20px">'+h(msg)+'</p></div><div class="win cmd"><button id="n" class="sel">夜にそなえる</button></div>'); on(r,'#n',scout); }
  var root = screen(topBar('昼') + '<div style="display:flex;justify-content:center">'+pic('maouMini','height:150px')+'</div>'+
    '<div class="win"><p style="font-size:16px;line-height:1.6">魔王様「昼のうちに、ひとつだけ準備できるのだ。何をするのだ？」</p></div>'+
    monPanel() +
    '<div class="win cmd" style="margin-top:auto">'+opts.map(function(o,i){ return '<button data-i="'+i+'" style="font-size:16px">'+h(o[0])+'</button>'; }).join('')+'</div>');
  root.querySelector('.cmd').addEventListener('click', function(e){ var b = e.target.closest('[data-i]'); if (b) opts[+b.dataset.i][1](); });
}
function monPanel(){
  var mons = [['hako','ハコ','宝箱の噛みつき強化。Lv3で他の勇者も捕獲'],['kata','カタコト','骸骨兵強化。Lv3で砕かれなくなる'],['gii','ギィ','Lv2 隊列予測／Lv3 収入+10%／Lv4 修理半額']];
  return '<div class="win" style="display:flex;flex-direction:column;gap:6px;font-size:14px">'+mons.map(function(m){
    var M = S.mon[m[0]], off = m[0]==='gii' && !giiOn();
    var nx = M.lv >= 5 ? 'MAX' : 'あと'+(EXP_T[M.lv]-M.exp);
    var bn = S.branch[m[0]] ? BRANCH[m[0]].filter(function(b){ return b[0] === S.branch[m[0]]; })[0][1] : '';
    return '<div style="display:flex;gap:8px;align-items:center'+(off?';opacity:.4':'')+'">'+pic(m[0]==='hako'?'hako':m[0],'height:34px;width:40px;object-fit:contain')+'<div style="flex:1"><div class="bar"><span>'+m[1]+' Lv'+M.lv+(bn?' <span class="purple">'+bn+'</span>':'')+'</span><span class="mute">'+(off?'不在':nx)+'</span></div><p class="mute" style="font-size:12px">'+m[2]+'</p></div></div>';
  }).join('')+'</div>';
}

/* =========================================================
   偵察
   ========================================================= */
function scout(){
  CURBG = 'room';
  var party = makeParty(), ev = EVENTS[S.event];
  var cards = party.map(function(p, n){
    var b = HEROES[p.id];
    var learned = p.resist.length ? '<p class="purple" style="font-size:12px">慣れた罠：'+p.resist.map(function(k){return ITEMS[k].name;}).join('・')+'</p>' : '';
    var seeAff = giiOn() && (S.mon.gii.lv >= 2 || br('gii') === 'spy');
    if (p.aff.length) learned += '<p style="font-size:12px;color:#ff9a4a">特性：'+(seeAff ? p.aff.map(function(k){ return AFFIX[k].name+'（'+AFFIX[k].desc+'）'; }).join('／') : '？？？（ギィLv2で判明）')+'</p>';
    return '<div class="win hcard" style="padding:8px 10px"><div class="pic" style="width:72px;height:72px">'+pic(p.id,'max-height:68px;max-width:68px')+'</div><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;font-size:13px">'+
      '<div class="bar"><span style="font-size:16px">'+(n+1)+'. '+h(b.name)+'</span><span>HP '+p.max+'</span></div>'+
      '<p class="mute">'+h(b.trait)+'</p><p class="red">弱点：'+h(b.weak)+'</p><p class="gold" style="font-size:12px">'+h(b.note)+'</p>'+learned+'</div></div>';
  }).join('');
  var advice = giiOn() ? adviceLine(party) : '（ギィはいない……）';
  var root = screen(topBar('偵察') +
    '<div class="win" style="border-color:#d68aff"><p class="gold" style="font-size:14px">舞台：'+h(STAGE.name)+'（'+h(STAGE.desc)+'）</p><p class="purple">今夜：'+h(ev.name)+'</p><p style="font-size:14px">'+h(ev.desc)+'</p></div>'+ cards +
    '<div class="win" style="display:flex;gap:10px">'+(giiOn()?pic('gii','width:48px;height:42px;object-fit:contain;flex-shrink:0'):'')+'<p style="font-size:14px;line-height:1.5">'+(giiOn()?'ギィ「'+h(advice)+'」':h(advice))+'</p></div>'+
    (S.relics.length || S.curses.length ? '<div class="win" style="font-size:13px;line-height:1.6">'+(S.relics.length?'<p class="gold">遺物：'+S.relics.map(function(k){return RELICS[k].name;}).join('・')+'</p>':'')+(S.curses.length?'<p class="red">契約：'+S.curses.map(function(k){return CURSES[k].name;}).join('・')+'</p>':'')+'</div>' : '')+
    '<div class="win cmd" style="margin-top:auto"><button id="go" class="sel">迷宮をつくる</button><button id="jr">魔王軍日誌</button><button id="zk">なかま図鑑</button><button id="tt">セーブしてタイトルへ</button></div>');
  on(root,'#go',build);
  on(root,'#jr',function(){ journal(scout); });
  on(root,'#zk',function(){ zukan(scout); });
  on(root,'#tt',function(){ save(); titleScreen(); });
}
function adviceLine(party){
  var ids = party.map(function(p){ return p.id; });
  if (ids[0] === 'seres') return '光の勇者は罠を半減します。魔眼だけは効きますぜ。騎士にかばわせる前に落とし穴で騎士を潰しましょう';
  var t = [];
  if (ids.indexOf('knight') >= 0) t.push('騎士は仲間をかばいます。まず騎士の苦手な落とし穴で削りましょう');
  if (ids.indexOf('rou') >= 0) t.push('盗賊は穴と炎が3つ以上あると先頭に出てきます。偽宝箱を手前に');
  if (ids.indexOf('noel') >= 0) t.push('魔法使いに炎は無駄です。毒霧が2倍効きます');
  if (ids.indexOf('mirei') >= 0) t.push('僧侶は誰かが倒れると逃げます。毒霧は浄化されますぜ');
  if (ids.indexOf('aldo') >= 0) t.push('剣士には落とし穴が2倍。骸骨兵は砕かれます');
  return t[rnd(t.length)] || '油断は禁物ですぜ';
}

/* =========================================================
   迷宮づくり
   ========================================================= */
var tool = 'ana';
function price(k){ return Math.round(ITEMS[k].cost * S.price * (giiOn() && br('gii') === 'merchant' ? 0.9 : 1)); }
function repairCost(c){ var v = Math.ceil(ITEMS[c.k].cost * c.lv * 0.4); if (giiOn() && S.mon.gii.lv >= 4) v = Math.ceil(v/2); return v; }
function build(){
  CURBG = 'dungeon';
  var party = makeParty();
  var predict = (giiOn() && (S.mon.gii.lv >= 2 || br('gii') === 'spy')) || META.up.scout;
  var root = screen(
    '<div class="win bar"><span>'+nightLabel()+'</span><span class="gold" id="souls"></span><span>'+hearts()+'</span></div>'+
    '<div class="win" style="display:flex;gap:10px;padding:8px 12px">'+pic('maouMini','width:40px;height:48px;object-fit:contain;flex-shrink:0')+'<div style="display:flex;flex-direction:column;gap:3px"><p id="talk" style="font-size:13px;line-height:1.45" class="gold"></p><p id="info" style="font-size:12px;line-height:1.45"></p></div></div>'+
    '<div style="display:flex;align-items:center;gap:4px;font-size:12px;flex-wrap:wrap" id="order"></div>'+
    '<div class="corr" style="'+corrStyle()+'"><div class="lane" id="grid"></div></div>'+
    '<div class="win" style="padding:6px"><div class="pal" id="pal"></div></div>'+
    '<div style="display:flex;gap:6px"><button id="fight" class="win gold" style="flex:1;font-size:19px;min-height:52px">▶ 迎撃開始！</button><button id="cb" class="win" style="font-size:14px;min-height:52px">コンボ図鑑</button></div>'
  , 'dungeon');
  root.classList.add('fixed');
  on(root,'#cb',function(){ comboBook(build); });
  var grid = root.querySelector('#grid'), pal = root.querySelector('#pal');
  function draw(){
    root.querySelector('#souls').textContent = '魂 ' + S.souls + (S.price<1?'（3割引）':'');
    var ord = predict ? arrange(party) : party;
    root.querySelector('#order').innerHTML = '<span class="mute">'+(predict?'予想隊列':'侵入順')+'</span>' + ord.map(function(p){ return pic(p.id,'height:30px'); }).join('<span>▶</span>');
    var sc = grid.parentNode.scrollTop;
    grid.innerHTML = corridor('build');
    grid.parentNode.scrollTop = sc;
    pal.innerHTML = ITEM_ORDER.map(function(k){ var it = ITEMS[k]; return '<button data-k="'+k+'" class="'+(tool===k?'on':'')+'">'+icon(k,'width:28px;height:28px')+'<span>'+it.name+'</span><small>魂'+price(k)+'</small></button>'; }).join('') +
      '<button data-k="fix" class="'+(tool==='fix'?'on':'')+'">修理<small>壊れた罠</small></button>' +
      '<button data-k="del" class="'+(tool==='del'?'on':'')+'">撤去<small>半額返却</small></button>';
    var info = root.querySelector('#info'), tk = root.querySelector('#talk');
    if (tool === 'del'){ info.textContent = '置いた罠を撤去します。使った魂の半分が戻ります。'; tk.textContent = '魔王様「配置換えなのだ！」'; }
    else if (tool === 'fix'){ info.textContent = '罠は'+maxDur()+'回動くと壊れます（●が残り回数）。修理費は罠の値段×Lv×0.4。'; tk.textContent = '魔王様「直すのだ、直すのだ！」'; }
    else { info.textContent = ITEMS[tool].name + '：' + ITEMS[tool].desc + ' 重ねるとLvアップ（最大'+maxLv()+'）。'; tk.textContent = '魔王様「' + ITEMS[tool].talk + '」'; }
  }
  function say(t){ root.querySelector('#talk').textContent = '魔王様「' + t + '」'; }
  grid.addEventListener('click', function(e){
    var b = e.target.closest('[data-i]'); if (!b) return;
    var i = +b.dataset.i, c = S.grid[i];
    if (tool === 'del'){ if (c){ S.souls += Math.floor(c.spent/2); S.grid[i] = null; } draw(); return; }
    if (tool === 'fix'){ if (!c || c.dur > 0) return say('そこは壊れてないのだ'); var rc = repairCost(c); if (S.souls < rc) return say('魂が足りないのだ'); S.souls -= rc; c.dur = maxDur(); draw(); return; }
    var cost = price(tool);
    if (c && c.k === tool){ if (c.lv >= maxLv()) return say('これ以上強化できないのだ'); if (S.souls < cost) return say('魂が足りないのだ'); c.lv++; c.spent += cost; c.dur = maxDur(); S.souls -= cost; }
    else if (c){ return say('先に撤去するのだ'); }
    else { if (S.souls < cost) return say('魂が足りないのだ'); S.grid[i] = {k:tool, lv:1, spent:cost, dur:maxDur()}; S.souls -= cost; }
    if (S.souls >= 1000) unlock('rich');
    draw();
  });
  pal.addEventListener('click', function(e){ var b = e.target.closest('[data-k]'); if (!b) return; tool = b.dataset.k; draw(); });
  on(root,'#fight',function(){ save(); battle(); });
  draw();
}

/* =========================================================
   戦闘シミュレーション
   ========================================================= */
function simulate(){
  var head = [];
  var party = arrange(makeParty(), head);
  if (S.interro) party.forEach(function(p){ p.hp = Math.round(p.hp*0.9); });
  var ev = [], revealed = {}, smashed = {}, reached = 0, strikes = 1 + META.up.strike, prevTrig = null;
  var stat = {hakoCatch:0, anaKill:0, meFlee:0, hako:0, kata:0, combos:[]};
  var mult = S.event === 'moon' ? 1.25 : 1;
  var strike = S.event === 'strike';
  var RM = {ana:hasR('stake')?1.3:1, hono:hasR('oil')?1.3:1, hone:hasR('crest')?1.3:1, me:hasR('eye')?1.3:1, kiri:1, gi:1};
  function act(){ return party.filter(function(p){ return !p.out; }); }
  function aff(p, k){ return p.aff.indexOf(k) >= 0 && !p.used[k]; }
  function combo(k, lines){ lines.push('★コンボ「' + COMBOS[k].name + '」！'); if (stat.combos.indexOf(k) < 0) stat.combos.push(k); }
  function snap(pos, lines, flash){ ev.push({ pos:pos, lines:lines, flash:flash, party:party.map(function(p){ return {id:p.id, hp:p.hp, max:p.max, out:p.out, poison:p.poison}; }) }); }
  function downed(p, lines){
    lines.push(HEROES[p.id].short + '「' + HEROES[p.id].down + '」'); lines.push(HEROES[p.id].short + 'を撃退した！');
    if (hasR('bell')) act().forEach(function(o){ o.hp = Math.max(1, Math.round(o.hp*0.9)); });
  }
  function hurt(p, d, key, lines, verb){
    d = Math.max(1, Math.round(d));
    p.hp -= d; lines.push(HEROES[p.id].short + 'は' + verb + ' ' + d + 'のダメージ！');
    if (p.hp <= 0){
      if (aff(p, 'brave')){ p.used.brave = true; p.hp = 1; lines.push(HEROES[p.id].short + 'は不屈の心で踏みとどまった！'); return; }
      p.hp = 0; p.out = 'dead'; p.lastHit = key; if (key === 'ana') stat.anaKill++; downed(p, lines);
    }
  }
  function trap(p, base, key, lines, verb, extra){
    if (aff(p, 'swift')){ p.used.swift = true; lines.push(HEROES[p.id].short + 'は素早く罠をかわした！'); return; }
    var d = base * mult * RM[key] * (extra || 1);
    if (STAGE.bonus === key) d *= 1.3;
    if (key === 'me' && S.event === 'newmoon') d *= 1.5;
    if (p.id === 'seres' && key !== 'me') d *= 0.5;
    if (p.resist.indexOf(key) >= 0) d *= hasC('learn') ? 0.35 : 0.5;
    if (aff(p, 'armor') || p.aff.indexOf('armor') >= 0) d *= 0.8;
    if (key === 'ana' && p.id === 'aldo') d *= 2;
    if (key === 'ana' && p.id === 'knight') d *= 1.5;
    if (key === 'kiri' && p.id === 'noel') d *= 2;
    if (p.confused && key !== 'me'){ d *= 1.5; p.confused = false; combo('panic', lines); }
    var kn = party.filter(function(x){ return x.id === 'knight' && !x.out; })[0];
    if (kn && p !== kn && kn.hp > kn.max*0.3){ lines.push('ガウェインが' + HEROES[p.id].short + 'をかばった！'); p = kn; d *= 0.7; if (key === 'ana') d *= 1.5; }
    hurt(p, d, key, lines, verb);
  }
  function wear(idx, lines){ var c = S.grid[idx]; c.dur--; if (c.dur <= 0){ lines.push(ITEMS[c.k].name + 'が壊れた！'); } }
  function cowards(lines){
    var down = party.some(function(p){ return p.out === 'dead' || p.out === 'caught'; });
    party.forEach(function(p){ if (p.id === 'mirei' && !p.out && down){ p.out = 'fled'; lines.push('ミレイは怖くなって逃げ出した！'); } });
  }
  snap(0, ['勇者たちが城に入ってきた！'].concat(head, act().map(function(p){ return HEROES[p.id].short + '「' + HEROES[p.id].enter + '」'; })));
  for (var step = 1; step < PATH.length; step++){
    var idx = PATH[step], lines = [], flash = false, trig = null;
    if (!act().length) break;
    act().forEach(function(p){ if (p.poison > 0) hurt(p, p.poison * (hasR('jar') ? 2 : 1), 'kiri', lines, '毒で'); });
    cowards(lines);
    if (idx === THRONE){
      act().forEach(function(p){
        lines.push(HEROES[p.id].short + 'は玉座にたどり着いた！');
        if (strikes > 0){ strikes--; S.strikeEver = true; hurt(p, (p.id==='seres'?50:100) * (hasR('crown')?1.5:1), null, lines, '魔王様の一撃で'); }
        if (!p.out){ p.out = 'reached'; reached++; lines.push('城の耐久が1減った！'); }
      });
      cowards(lines); snap(step, lines, true); break;
    }
    var c = S.grid[idx];
    var L0 = act(), lead = L0[0];
    if (c && c.dur > 0 && lead && aff(lead, 'disarm')){ lead.used.disarm = true; c.dur = 0; lines.push(HEROES[lead.id].short + 'が' + ITEMS[c.k].name + 'を解除した！'); }
    if (c && c.dur <= 0){ if (!lines.length || lines[lines.length-1].indexOf('解除') < 0) lines.push('壊れた' + ITEMS[c.k].name + 'がある……'); }
    else if (c){
      var m = LVM[c.lv], L = act(), leader = L[0];
      flash = true;
      if (c.k === 'ana' || c.k === 'hono'){
        if (leader && leader.id === 'rou' && !leader.confused){ lines.push('ロウは' + ITEMS[c.k].name + 'を見破った！ 一行はよけて進んだ。'); flash = false; }
        else { trig = c.k; L.forEach(function(p){
          if (p.out) return;
          if (c.k === 'hono' && p.id === 'noel'){ lines.push('ノエルは炎を魔法で消した！'); return; }
          if (c.k === 'ana' && p.id === 'aldo') lines.push('アルドは前を見ていなかった！');
          var ex = 1;
          if (c.k === 'hono' && p.poison > 0){ ex = hasR('oil') ? 2 : 1.5; combo('ignite', lines); }
          trap(p, ITEMS[c.k].base * m, c.k, lines, c.k==='ana'?'落とし穴に落ちた！':'炎に焼かれた！', ex);
        }); wear(idx, lines); }
      } else if (c.k === 'kiri'){
        var pur = L.filter(function(p){ return p.id==='mirei' || p.id==='seres'; })[0];
        if (pur){ lines.push(HEROES[pur.id].short + 'は毒霧を浄化した！'); L.forEach(function(p){ p.poison = 0; }); flash = false; }
        else { trig = 'kiri'; L.forEach(function(p){
          if (p.out) return; trap(p, 20*m, 'kiri', lines, '毒霧を吸い込んだ！');
          if (!p.out){ if (aff(p, 'holy')){ p.used.holy = true; lines.push(HEROES[p.id].short + 'は聖水で毒を消した！'); } else p.poison = Math.max(p.poison, Math.round(8*m)); }
        }); wear(idx, lines); }
      } else if (c.k === 'gi'){
        if (strike){ lines.push('宝箱はすねて動かない……（ストライキ中）'); flash = false; }
        else if (revealed[idx]){ lines.push('開いた宝箱が転がっている……'); flash = false; }
        else {
          var hl = S.mon.hako.lv, hm = 1 + 0.2*(hl-1);
          var oc = 0.3 + 0.06*hl + (hasR('gem')?0.15:0) + (br('hako')==='mimic'?0.2:0);
          for (var q=0;q<L.length;q++){
            var p = L[q];
            if (p.id === 'seres' || (p.id === 'noel' && br('hako') !== 'mimic')) continue;
            if (p.id === 'rou' || p.aff.indexOf('greedy') >= 0 || Math.random() < oc){
              revealed[idx] = true; stat.hako++; trig = 'gi';
              var poisoned = p.poison > 0;
              lines.push(HEROES[p.id].short + 'は宝箱を開けた！ なんと ハコだった！');
              trap(p, (p.id==='rou'?100:60)*m*hm, 'gi', lines, 'かみつかれて');
              var th = br('hako') === 'glutton' ? 0.6 : 0.45;
              var catchIt = p.id === 'rou' || (hl >= 3 && p.hp < p.max*th);
              if (!p.out && !catchIt && poisoned && p.id !== 'knight'){ catchIt = true; combo('feast', lines); }
              if (!p.out && catchIt){ p.out = 'caught'; p.lastHit = 'gi'; stat.hakoCatch++; lines.push(HEROES[p.id].short + 'はハコに捕まった！'); if (hasR('bell')) act().forEach(function(o){ o.hp = Math.max(1, Math.round(o.hp*0.9)); }); }
              wear(idx, lines); break;
            }
          }
          if (!revealed[idx]){ lines.push('一行は宝箱を素通りした。'); flash = false; }
        }
      } else if (c.k === 'hone'){
        if (smashed[idx]){ lines.push('骸骨兵はバラバラのままだ……'); flash = false; }
        else {
          var kl = S.mon.kata.lv, km = (1 + 0.2*(kl-1)) * (br('kata')==='legion' ? 1.4 : 1);
          var sm = L.filter(function(p){ return p.id==='aldo' || p.id==='noel' || p.id==='seres'; })[0];
          stat.kata++;
          if (sm && (kl < 3 || (sm.id === 'seres' && br('kata') !== 'pride'))){ smashed[idx] = true; lines.push(sm.id==='seres' ? 'セレスは骸骨兵を光で浄化した！' : HEROES[sm.id].short + 'は骸骨兵を砕いた！'); wear(idx, lines); }
          else {
            trig = 'hone';
            if (sm) lines.push('カタコトは' + HEROES[sm.id].short + 'の一撃に耐えた！');
            var chase = prevTrig === 'ana';
            if (chase) combo('chase', lines);
            L.forEach(function(p){ if (!p.out) trap(p, 35*m*km*(kl>=5&&p.id==='seres'?2:1), 'hone', lines, '骸骨兵に斬られた！', chase ? 1.5 : 1); });
            wear(idx, lines);
          }
        }
      } else if (c.k === 'me'){
        trig = 'me';
        L.forEach(function(p){
          if (p.out) return;
          if (p.id === 'mirei'){ p.out = 'fled'; stat.meFlee++; lines.push('ミレイは魔眼を見て逃げ出した！'); return; }
          trap(p, 20*m, 'me', lines, '魔眼ににらまれた！');
          if (!p.out && p.id !== 'knight'){
            if (aff(p, 'holy')){ p.used.holy = true; lines.push(HEROES[p.id].short + 'は聖水で正気を保った！'); return; }
            lines.push(HEROES[p.id].short + 'は混乱した！'); trap(p, 20*m, 'me', lines, '自分を攻撃して'); if (!p.out) p.confused = true;
          }
        });
        wear(idx, lines);
      }
      cowards(lines);
    }
    prevTrig = trig;
    snap(step, lines, flash);
  }
  return { ev:ev, party:party, reached:reached, stat:stat };
}

/* =========================================================
   迎撃
   ========================================================= */
function battle(){
  CURBG = 'dungeon';
  var R = simulate(), k = 0, speed = 700, timer = null, log = [];
  var root = screen(
    '<div class="win bar"><span>'+nightLabel()+'　迎撃中</span><span class="purple">'+h(EVENTS[S.event].name)+'</span><span>'+hearts()+'</span></div>'+
    '<div id="st" style="display:grid;grid-template-columns:repeat('+Math.min(R.party.length,3)+',minmax(0,1fr));gap:5px"></div>'+
    '<div class="win log" id="log" style="height:132px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;gap:2px;flex-shrink:0"></div>'+
    '<div class="corr" id="corr" style="'+corrStyle()+'"><div class="lane" id="grid"></div></div>'+
    '<div style="display:flex;gap:6px"><div class="win" style="flex:1;display:flex;gap:18px;font-size:18px;padding:8px 14px"><button id="x1">×1</button><button id="x2">×2</button></div><div class="win" style="padding:8px 14px"><button id="skip" style="font-size:18px">スキップ</button></div></div>'
  , 'dungeon');
  root.classList.add('fixed');
  var grid = root.querySelector('#grid'), st = root.querySelector('#st'), lg = root.querySelector('#log');
  function setSpeed(v){ speed = v; root.querySelector('#x1').className = v===700?'gold':''; root.querySelector('#x2').className = v===240?'gold':''; }
  on(root,'#x1',function(){ setSpeed(700); });
  on(root,'#x2',function(){ setSpeed(240); });
  on(root,'#skip',function(){ clearTimeout(timer); while (k < R.ev.length){ log = log.concat(R.ev[k].lines); k++; } render(R.ev[R.ev.length-1], false); setTimeout(finish, 400); });
  setSpeed(700);
  function render(e, doFlash){
    var flashIdx = doFlash && e.flash ? PATH[e.pos] : -1;
    grid.innerHTML = corridor('battle', e, flashIdx);
    var cur = grid.querySelector('#t' + PATH[e.pos]), box = grid.parentNode;
    if (cur) box.scrollTop = Math.max(0, cur.offsetTop - box.clientHeight/2 + cur.offsetHeight/2);
    st.innerHTML = e.party.map(function(p){
      var stt = p.out==='dead'?'<span class="red">撃退</span>':p.out==='caught'?'<span class="gold">捕獲</span>':p.out==='fled'?'<span class="purple">逃走</span>':p.out==='reached'?'<span class="red">到達</span>':p.poison?'<span class="green">毒</span>':'';
      return '<div class="win'+(p.out&&p.out!=='reached'?' dim':'')+'" style="padding:5px 7px;font-size:12px"><div class="bar" style="font-size:13px"><span>'+HEROES[p.id].short+'</span>'+stt+'</div><p>'+p.hp+'/'+p.max+'</p><div class="hp"><i style="width:'+Math.round(100*p.hp/p.max)+'%;background:'+(p.hp/p.max<0.3?'#ff6b6b':'#6bff8a')+'"></i></div></div>';
    }).join('');
    lg.innerHTML = log.slice(-6).map(function(t){ var cls = t.indexOf('「')>0 ? ' class="mute"' : (/撃退|捕まった|逃げ出した/.test(t)?' class="gold"':(/耐久|壊れた/.test(t)?' class="red"':'')); return '<p'+cls+'>'+h(t)+'</p>'; }).join('');
  }
  function tick(){
    if (k >= R.ev.length){ setTimeout(finish, 500); return; }
    var e = R.ev[k++]; log = log.concat(e.lines); render(e, true);
    var jt = e.lines.join('');
    if (/耐久/.test(jt)){ shake(); sfx('hurt'); } else if (/撃退|捕まった/.test(jt)) sfx('down'); else if (/コンボ/.test(jt)) sfx('combo'); else if (e.flash) sfx('trap');
    timer = setTimeout(tick, e.lines.length ? speed + Math.min(3, e.lines.length) * speed * 0.5 : speed * 0.4);
  }
  var finished = false;
  function finish(){
    if (finished) return; finished = true;
    var gained = 0, list = [], caught = false;
    var fm = S.event === 'fest' ? 1.5 : 1;
    R.party.forEach(function(p){
      var b = HEROES[p.id], m = S.mem[p.id], r = Math.round((b.reward + S.night*10) * fm * (hasR('candle')?1.3:1) * (p.aff.indexOf('greedy')>=0?1.5:1));
      if (p.out === 'dead' || p.out === 'caught'){
        gained += r; m.def++; META.stats.def[p.id]++;
        if (p.out === 'caught'){ m.caught++; caught = true; }
        if (p.lastHit && m.resist.indexOf(p.lastHit) < 0 && p.id !== 'seres') m.resist.push(p.lastHit);
        list.push(b.short + '：' + (p.out==='caught'?'捕獲':'撃退') + '　+魂' + r);
      } else if (p.out === 'fled'){ var r2 = Math.floor(r/2); gained += r2; m.def++; m.fled++; META.stats.def[p.id]++; list.push(b.short + '：逃走　+魂' + r2); }
      else if (p.out === 'reached'){ list.push(b.short + '：玉座に到達'); }
      else list.push(b.short + '：撤退');
    });
    META.stats.hakoCatch += R.stat.hakoCatch; META.stats.anaKill += R.stat.anaKill; META.stats.meFlee += R.stat.meFlee; META.stats.nights++;
    var xm = hasR('tome') ? 2 : 1;
    addExp('hako', R.stat.hako*xm); addExp('kata', R.stat.kata*xm); addExp('gii', xm);
    R.stat.combos.forEach(function(c){ META.combos[c] = true; });
    if (Object.keys(META.combos).length >= 4) unlock('combo4');
    if (S.mon.hako.lv>=5 && S.mon.kata.lv>=5 && S.mon.gii.lv>=5) unlock('mon5');
    if (META.stats.hakoCatch >= 10) unlock('hako10');
    if (META.stats.anaKill >= 20) unlock('ana20');
    if (META.stats.meFlee >= 10) unlock('me10');
    if (S.night === 1 && !R.reached) unlock('first');
    S.lastCaught = caught; S.interro = false;
    S.castle -= R.reached; if (R.reached) S.hurtEver = true;
    var income = DIFF[S.diff].inc + (S.recruited.rou ? 40 : 0);
    income += (hasR('pot') ? 25 : 0) - (hasC('poor') ? 20 : 0);
    if (giiOn() && S.mon.gii.lv >= 3) income = Math.round(income * 1.1);
    S.journal.push(nightLabel() + '　' + list.join('／') + (R.reached ? '　玉座まで' + R.reached + '人' : '　城は無傷') + (R.stat.combos.length ? '　コンボ：' + R.stat.combos.map(function(c){ return COMBOS[c].name; }).join('・') : ''));
    S.relicOffer = S.mode === 'story' ? [3,6,9].indexOf(S.night) >= 0 : S.night % 3 === 0;
    S.souls += gained + income;
    if (S.souls >= 1000) unlock('rich');
    saveMeta();
    result(R, list, income);
  }
  tick();
}

/* =========================================================
   結果
   ========================================================= */
function result(R, list, income){
  var seresDown = R.party.some(function(p){ return p.id==='seres' && p.out==='dead'; });
  var lost = S.castle <= 0;
  CURBG = lost ? 'ruins' : 'dawn';
  var line = R.reached ? HURT_LINES[rnd(HURT_LINES.length)] : WIN_LINES[rnd(WIN_LINES.length)];
  if (S.mode === 'endless' && !lost){
    if (S.night >= 10) unlock('end10'); if (S.night >= 20) unlock('end20'); if (S.night >= 30) unlock('end30');
    if (S.night > META.bestEndless){ META.bestEndless = S.night; saveMeta(); }
  }
  var root = screen(topBar('結果') +
    '<p class="gold" style="text-align:center;font-size:28px;margin-top:8px;text-shadow:3px 3px 0 #b0402a">'+(lost?'城が落ちた……':R.reached?'なんとか耐えた':'夜明けだ！')+'</p>'+
    '<div style="display:flex;justify-content:center">'+pic('maou','height:200px')+'</div>'+
    '<div class="win"><p style="font-size:16px;line-height:1.6">魔王様「'+h(lost?'ぐぬぬ……':line)+'」</p></div>'+
    '<div class="win" style="display:flex;flex-direction:column;gap:5px;font-size:15px">'+list.map(function(t){return '<p>'+h(t)+'</p>';}).join('')+
      '<p class="mute">夜明けの魔力　+魂'+income+'</p><p class="gold">所持魂 '+S.souls+'</p></div>'+ achToast() +
    '<div class="win cmd" style="margin-top:auto"><button id="next" class="sel">'+(lost?'……':'次の夜へ')+'</button></div>');
  sfx(lost ? 'lose' : 'win');
  on(root,'#next',function(){
    if (lost){ talk(STORY.over, gameOver, 'ruins'); return; }
    if (S.relicOffer){ S.relicOffer = false; relicChoice(proceed); return; }
    proceed();
  });
  function proceed(){
    if (S.mode === 'story' && S.night === LAST){
      if (seresDown){ talk(STORY.final, finalChoice); return; }
      nightFlow(); return;
    }
    S.night++; nightFlow();
  }
}
function gameOver(){
  CURBG = 'ruins';
  var endless = S.mode === 'endless';
  var reach = S.night - 1, stones = Math.round((endless ? reach * 2 : Math.max(2, S.night * 2)) * (1 + 0.2*curseW()));
  META.stones += stones; saveMeta();
  var share = '「勇者を倒したい魔王様」' + (endless ? '無限の夜で' + reach + '夜を守りきった！' : '第' + S.night + '夜で城が落ちた……') + ' #勇者を倒したい魔王様';
  var root = screen('<div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:16px;text-align:center"><p class="red" style="font-size:40px">GAME OVER</p>'+
    '<p class="mute">'+(endless?'無限の夜　記録 '+reach+'夜（最高 '+META.bestEndless+'夜）':'第'+S.night+'夜で城が落ちた')+'</p><p class="gold">魔石 +'+stones+'（改築に使えるのだ）</p></div>'+ achToast() +
    '<div class="win cmd">'+(endless?'':'<button id="retry" class="sel">この夜をやり直す</button>')+'<button id="share">結果をコピー</button><a class="sharelink" href="https://twitter.com/intent/tweet?text='+encodeURIComponent(share)+'" target="_blank" rel="noopener">Xでシェア</a><button id="title">タイトルへ</button></div>');
  on(root,'#retry',function(){ S = clone(SNAP); setStage(S.stage || 0); save(); scout(); });
  on(root,'#share',function(e){ var b = e.currentTarget; try{ navigator.clipboard.writeText(share).then(function(){ b.textContent = 'コピーしたのだ！'; }, function(){ b.textContent = share; }); }catch(x){ b.textContent = share; } });
  on(root,'#title',function(){ clearRun(); titleScreen(); });
}
function finalChoice(){
  CURBG = 'throne';
  choice('セレスは膝をついている。魔王様は……', [
    ['とどめを刺す', function(){ endStory(S.giiTrust === false ? 'betray' : 'lonely'); }],
    ['見逃す', function(){
      if (S.kind >= 3 && S.giiTrust) endStory('father');
      else if ((S.recruited.rou || S.recruited.mirei) && S.giiTrust !== false) endStory('family');
      else endStory('friend');
    }]
  ]);
}
function endStory(key){
  var E = ENDINGS[key];
  var goodE = key === 'father' || key === 'family' || key === 'friend';
  talk(E.lines, function(){
    META.cleared[S.diff] = true; unlock('clear' + S.diff); unlock('e_' + key);
    if (!S.hurtEver) unlock('nohurt');
    if (!S.strikeEver) unlock('nostrike');
    META.endings[key] = true;
    if (curseW() >= 6) unlock('curse6');
    if (curseW() >= 10) unlock('curse10');
    var stones = Math.round((20 + S.diff * 20) * (1 + 0.2*curseW())); META.stones += stones; saveMeta(); clearRun();
    var good = key === 'father' || key === 'family' || key === 'friend';
    CURBG = good ? 'ending' : 'ruins';
    var share = '「勇者を倒したい魔王様」エンディング「' + E.name + '」を見た！ #勇者を倒したい魔王様';
    var root = screen('<div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:12px;text-align:center">'+
      '<p class="en">ENDING '+Object.keys(META.endings).length+'/5</p><p class="gold" style="font-size:26px;line-height:1.4;text-shadow:3px 3px 0 #b0402a">「'+h(E.name)+'」</p>'+
      '<div style="display:flex;align-items:flex-end;justify-content:center;gap:4px">'+(key==='father'?pic('sendai','height:170px')+pic('maou','height:170px'):good?pic('maou','height:170px')+pic('seres','height:160px'):pic('maou','height:180px;filter:grayscale(.8)'))+'</div>'+
      '<p class="mute" style="font-size:14px;line-height:1.7">'+(key==='father'?'真のエンディング。<br>あなたは魔王様の、いちばんの味方だった。':'まだ見ていないエンディングがあるようだ……<br>選択や仲間、ギィへの答えで結末が変わる。')+'</p>'+
      '<p class="gold">魔石 +'+stones+'　'+(S.diff<2?'次の難易度が解放された！':'')+'</p></div>'+ achToast() +
      '<div class="win cmd"><button id="t" class="sel">タイトルへ</button><a class="sharelink" href="https://twitter.com/intent/tweet?text='+encodeURIComponent(share)+'" target="_blank" rel="noopener">Xでシェア</a></div>');
    on(root,'#t',titleScreen);
  }, goodE ? 'ending' : 'ruins');
}


/* =========================================================
   v3：契約・章・進化・遺物・日誌・コンボ図鑑
   ========================================================= */
function contracts(cb){
  CURBG = 'room';
  var sel = [];
  function draw(){
    var w = sel.reduce(function(a,k){ return a + CURSES[k].w; }, 0);
    var root = screen('<div class="win bar"><span>魔王の契約</span><span class="red">重さ '+w+'</span><span class="gold">魔石×'+(1+0.2*w).toFixed(1)+'</span></div>'+
      '<p class="mute" style="font-size:13px;line-height:1.6">契約を結ぶと不利になるかわりに、手に入る魔石が増えるのだ。結ばなくても遊べるのだ。</p>'+
      CURSE_KEYS.map(function(k){ var c = CURSES[k], on = sel.indexOf(k) >= 0;
        return '<button data-c="'+k+'" class="win" style="display:flex;justify-content:space-between;align-items:center;gap:10px;text-align:left;width:100%;'+(on?'border-color:#ff6b6b':'')+'"><span><span class="'+(on?'red':'')+'">'+(on?'■ ':'□ ')+h(c.name)+'</span><br><span class="mute" style="font-size:12px">'+h(c.desc)+'</span></span><span class="red" style="flex-shrink:0">重さ'+c.w+'</span></button>'; }).join('')+
      '<div class="win cmd" style="margin-top:auto"><button id="ok" class="sel">この契約ではじめる</button><button id="bk">もどる</button></div>');
    root.addEventListener('click', function(e){ var b = e.target.closest('[data-c]'); if (!b) return; var k = b.dataset.c, i = sel.indexOf(k); if (i >= 0) sel.splice(i,1); else sel.push(k); sfx('sel'); draw(); });
    on(root,'#ok',function(){ sfx('sel'); cb(sel); });
    on(root,'#bk',titleScreen);
  }
  draw();
}
function chapterCard(next){
  var c = S.mode === 'story' ? CHAPTERS[S.night] : ['無限 第' + S.night + '夜', S.night % 10 === 0 ? '光の来訪' : '終わらない夜'];
  app.innerHTML = '<div class="chapter" style="' + bgStyle('ruins') + '"><p class="en">CHAPTER</p><p class="ch1">'+h(c[0])+'</p><p class="ch2">「'+h(c[1])+'」</p><p class="gold" style="margin-top:18px;font-size:16px">舞台：'+h(STAGE.name)+'　'+h(STAGE.sub)+'</p><p class="mute" style="font-size:13px">'+h(STAGE.desc)+'</p>'+(S.stageMsg?'<p class="purple" style="font-size:14px;margin-top:8px">'+h(S.stageMsg)+'</p>':'')+'<p class="mute blink" style="font-size:13px;margin-top:30px">タップで進む</p></div>';
  sfx('relic');
  app.firstChild.addEventListener('click', function(){ next(); });
}
function branchChoice(m, next){
  CURBG = 'throne';
  var names = {hako:'ハコ', kata:'カタコト', gii:'ギィ'};
  var opts = BRANCH[m].map(function(b){ return [b[1] + '：' + b[2], function(){ S.branch[m] = b[0]; save(); sfx('relic'); next(); }]; });
  var root = screen(topBar('進化') + '<div style="display:flex;justify-content:center">'+pic(m,'height:180px')+'</div>'+
    '<div class="win"><p style="font-size:17px;line-height:1.6">'+names[m]+'がLv3になった！<br>進む道をひとつ選ぶのだ。</p></div>'+
    '<div class="win cmd" style="margin-top:auto">'+opts.map(function(o,i){ return '<button data-i="'+i+'" style="font-size:15px;line-height:1.5">'+h(o[0])+'</button>'; }).join('')+'</div>');
  root.querySelector('.cmd').addEventListener('click', function(e){ var b = e.target.closest('[data-i]'); if (b) opts[+b.dataset.i][1](); });
}
function relicChoice(next){
  CURBG = 'throne';
  var pool = RELIC_KEYS.filter(function(k){ return S.relics.indexOf(k) < 0; }), pick = [];
  while (pick.length < 3 && pool.length) pick.push(pool.splice(rnd(pool.length),1)[0]);
  if (!pick.length){ next(); return; }
  sfx('relic');
  var root = screen(topBar('遺物') + '<p class="gold" style="text-align:center;font-size:22px;margin-top:12px;text-shadow:3px 3px 0 #b0402a">― 宝物庫の奥で何かが光った ―</p>'+
    '<div class="win"><p style="font-size:15px;line-height:1.6">ギィ「先代の遺物ですぜ。ひとつだけ持っていけます」</p></div>'+
    pick.map(function(k){ return '<button data-r="'+k+'" class="win" style="text-align:left;width:100%"><p class="gold" style="font-size:18px">◆ '+h(RELICS[k].name)+'</p><p style="font-size:14px;margin-top:4px">'+h(RELICS[k].desc)+'</p></button>'; }).join(''));
  root.addEventListener('click', function(e){ var b = e.target.closest('[data-r]'); if (!b) return; S.relics.push(b.dataset.r); if (S.relics.length >= 6) unlock('relic6'); save(); sfx('relic'); next(); });
}
function journal(back){
  CURBG = 'room';
  var root = screen('<div class="win bar"><button id="bk" style="font-size:16px;min-height:36px">◀ もどる</button><span>魔王軍日誌</span><span style="width:60px"></span></div>'+
    '<div class="win" style="font-size:14px;line-height:1.7;display:flex;flex-direction:column;gap:8px">'+(S.journal.length ? S.journal.slice().reverse().map(function(t){ return '<p>'+h(t)+'</p>'; }).join('') : '<p class="mute">まだ何も書かれていない。</p>')+'</div>');
  on(root,'#bk',back);
}
function comboBook(back){
  CURBG = 'room';
  var root = screen('<div class="win bar"><button id="bk" style="font-size:16px;min-height:36px">◀ もどる</button><span>罠コンボ図鑑</span><span>'+Object.keys(META.combos).length+'/4</span></div>'+
    '<p class="mute" style="font-size:13px;line-height:1.6">罠の並べ方しだいで、特別な効果が起きるのだ。見つけたコンボはここに記録されるのだ。</p>'+
    Object.keys(COMBOS).map(function(k){ var got = META.combos[k]; return '<div class="win'+(got?'':' dim')+'"><p class="'+(got?'gold':'mute')+'">'+(got?'★ '+h(COMBOS[k].name):'？？？')+'</p><p style="font-size:13px;margin-top:4px" class="'+(got?'':'mute')+'">'+(got?h(COMBOS[k].desc):'ヒント：'+({ignite:'毒と炎',chase:'穴のすぐ後ろ',panic:'混乱した者は……',feast:'弱った獲物'}[k]))+'</p></div>'; }).join(''));
  on(root,'#bk',back);
}
/* =========================================================
   改築・実績・図鑑
   ========================================================= */
function upgrades(){
  CURBG = 'room';
  function draw(){
    var root = screen('<div class="win bar"><button id="bk" style="font-size:16px;min-height:36px">◀ もどる</button><span>魔王城の改築</span><span class="gold">魔石 '+META.stones+'</span></div>'+
      '<p class="mute" style="font-size:13px;line-height:1.5">魔石は、ゲームオーバー・クリア・実績で手に入る。改築は次のプレイからずっと有効なのだ。</p>'+
      UPGRADES.map(function(u){
        var lv = META.up[u.id], maxed = lv >= u.max, cost = maxed ? 0 : u.cost[lv];
        return '<div class="win" style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div><p>'+h(u.name)+' <span class="mute">'+lv+'/'+u.max+'</span></p><p class="mute" style="font-size:13px">'+h(u.desc)+'</p></div>'+
          (maxed?'<span class="gold">MAX</span>':'<button data-u="'+u.id+'" style="border:2px solid '+(META.stones>=cost?'#ffe14a':'#5a5a8a')+';border-radius:6px;padding:6px 10px;min-height:44px;flex-shrink:0;color:'+(META.stones>=cost?'#ffe14a':'#5a5a8a')+'">魔石'+cost+'</button>')+'</div>';
      }).join(''));
    on(root,'#bk',titleScreen);
    root.addEventListener('click', function(e){ var b = e.target.closest('[data-u]'); if (!b) return; var u = UPGRADES.filter(function(x){ return x.id === b.dataset.u; })[0], lv = META.up[u.id]; if (lv >= u.max || META.stones < u.cost[lv]) return; META.stones -= u.cost[lv]; META.up[u.id]++; saveMeta(); draw(); });
  }
  draw();
}
function achievements(){
  CURBG = 'room';
  var root = screen('<div class="win bar"><button id="bk" style="font-size:16px;min-height:36px">◀ もどる</button><span>実績</span><span>'+Object.keys(META.ach).length+'/'+ACH.length+'</span></div>'+
    '<div class="win" style="font-size:13px;line-height:1.7"><p>偽宝箱での捕獲 '+META.stats.hakoCatch+'人　落とし穴での撃退 '+META.stats.anaKill+'人</p><p>魔眼で逃げた勇者 '+META.stats.meFlee+'人　守った夜 '+META.stats.nights+'夜</p><p>無限の夜 最高 '+META.bestEndless+'夜　エンディング '+Object.keys(META.endings).length+'/5</p></div>'+
    ACH.map(function(a){ var got = META.ach[a.id]; return '<div class="win'+(got?'':' dim')+'" style="padding:8px 12px"><p class="'+(got?'gold':'mute')+'">'+(got?'★ ':'☆ ')+h(a.name)+'</p><p class="mute" style="font-size:12px">'+h(a.desc)+'</p></div>'; }).join(''));
  on(root,'#bk',titleScreen);
}
function zukan(back){
  CURBG = 'room';
  loadMeta();
  var allies = [['maou','魔王ヴェルミナ','十三代目魔王。強がりだけど作戦はだいたい空回り'],['gii','参謀ギィ','先代から仕える皮肉屋。元は勇者パーティの斥候らしい'],['hako','ミミックのハコ','喋れないけど魔王様が大好き。噛みつきは本気'],['kata','骸骨兵カタコト','記憶をなくした元騎士。光の王国の紋章を背負う']];
  var heroIds = ['aldo','mirei','rou','noel','knight','seres'];
  function card(img, name, desc, extra, hidden){ return '<div class="win'+(hidden?' dim':'')+'"><div class="ph">'+pic(img, hidden?'filter:brightness(0) invert(.18)':'')+'</div><p>'+h(name)+'</p><p class="d">'+h(desc)+'</p>'+(extra||'')+'</div>'; }
  var root = screen('<div class="win bar"><button id="bk" style="font-size:16px;min-height:36px">◀ もどる</button><span>なかま図鑑</span><span style="width:60px"></span></div>'+
    '<p class="gold" style="font-size:18px">― 魔王軍 ―</p><div class="zk">'+allies.map(function(a){ return card(a[0], a[1], a[2]); }).join('')+'</div>'+
    '<p class="red" style="font-size:18px">― 勇者 ―</p><p class="mute" style="font-size:12px">撃退するほど、勇者の過去がわかる（1・3・6回）</p><div class="zk">'+heroIds.map(function(id){
      var d = META.stats.def[id] || 0, seen = d > 0 || id === 'aldo' || (id === 'seres' && S && S.metSeres);
      var st = HERO_STORY[id].map(function(t, i){ var need = [1,3,6][i]; return '<p class="d" style="text-align:left;'+(d>=need?'color:#fff':'')+'">'+(d>=need?'・'+h(t):'・？？？（あと'+(need-d)+'回）')+'</p>'; }).join('');
      return card(id, seen ? HEROES[id].name : '？？？', seen ? HEROES[id].trait : 'まだ出会っていない', '<p class="mute" style="font-size:12px">撃退 '+d+'回</p>'+st, !seen);
    }).join('')+'</div>');
  on(root,'#bk',back);
}

if (window.__TEST__) window.__T = { screens:{titleScreen:titleScreen, scout:scout, build:build, battle:battle, dayAction:dayAction, relicChoice:relicChoice, contracts:contracts, chapterCard:chapterCard, journal:journal, comboBook:comboBook, zukan:zukan, achievements:achievements, upgrades:upgrades, branchChoice:branchChoice, gameOver:gameOver, finalChoice:finalChoice, nightFlow:nightFlow, pickDiff:pickDiff}, simulate:simulate, newRun:newRun, getS:function(){return S;}, ITEMS:ITEMS, rooms:function(){return ROOMS;}, setStage:setStage, stageIndex:stageIndex, makeParty:makeParty, arrange:arrange, addExp:addExp, loadMeta:loadMeta, META:function(){return META;}, partyIds:partyIds, NIGHTS:NIGHTS, DIFF:DIFF, HEROES:HEROES };
loadMeta();
titleScreen();
})();
