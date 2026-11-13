// =====================================================================
// 出来事エンジン
// =====================================================================
const E=(tag,tx,ops,who)=>({tag,tx,ops,who});
const O=(t,f,s,c)=>({t,f,s,c:c===undefined?true:!!c});
const DEFS=[];
function D(id,o){o.id=id;o.w=o.w||3;o.cd=o.cd||0;DEFS.push(o);}
const W=p=>p?personSVG(p,p.age!=null?Math.max(0,p.age):30,p._mood||'normal',p.of):'';
function done(id){return S.evDone[id]!=null;}
function eligible(d){if(S.age<d.a[0]||S.age>d.a[1])return false;const last=S.evDone[d.id];if(last!=null){if(!d.cd)return false;if(S.age-last<d.cd)return false;}try{return d.c?d.c():true;}catch(e){return false;}}
function buildEvents(first){
  if(first)return;
  const ms=DEFS.filter(d=>d.m&&eligible(d));
  ms.forEach(d=>{const ev=d.mk();if(ev){ev.id=d.id;S.queue.push(ev);S.evDone[d.id]=S.age;}});
  let n=Math.max(1,eventsPerYear()-Math.floor(ms.length/2));
  for(let i=0;i<n;i++){
    const el=DEFS.filter(d=>!d.m&&eligible(d)&&!S.queue.some(q=>q.id===d.id));if(!el.length)break;
    let tot=el.reduce((s,d)=>s+d.w,0),r=R()*tot,ch=el[0];for(const d of el){r-=d.w;if(r<0){ch=d;break;}}
    const ev=ch.mk();S.evDone[ch.id]=S.age;if(ev){ev.id=ch.id;S.queue.push(ev);}
  }
  // ちょっとした出来事（選択なし）
  minorEvents();
}
function minorEvents(){
  const a=S.age,N=S.notes;
  if(a<6&&chance(.35))N.push(pick(['高い熱を出して、夜中に救急外来へ運ばれた。','近所の公園の砂場が、いちばんの遊び場だった。','初めて自転車の補助輪が外れた。','親戚の集まりで、みんなにかわいがられた。']));
  if(a>=6&&a<13&&chance(.3))N.push(pick(['運動会の徒競走で転んだ。','夏休みの宿題を最終日に泣きながら終わらせた。','インフルエンザで1週間学校を休んだ。','給食のカレーが毎週の楽しみだった。']));
  if(a>=20&&a<65&&chance(.2)){const t=pick([['電車の中で財布をすられた。',-3],['会社から臨時ボーナスが出た。',10],['スマホを落として画面を割った。',-3],['ふるさと納税で、いい肉が届いた。',0],['電気代がまた上がった。',-2]]);N.push(t[0]);if(t[1]>0)gain(t[1],'臨時収入');else if(t[1]<0)pay(-t[1],'臨時出費');}
  if(a>=65&&chance(.25))N.push(pick(['膝が痛むようになってきた。','近所の同年代が亡くなったと聞いた。','若い頃の写真を見返した。','孫の写真を待ち受けにした。']));
}
// =====================================================================
// 0〜5歳
// =====================================================================
D('baby_nature',{a:[0,1],m:true,c:()=>S.age===1,mk:()=>E('1歳','よちよち歩きを始めた。どんな子どもに育っていく？',[
  O('家中を探検して回る',()=>{mod({study:3,health:2});if(chance(.2)){mod({health:-5});return '階段から落ちて、おでこにたんこぶを作った。';}return '引き出しを片っ端から開けて回った。';},'好奇心が育つ'),
  O('絵本をじっと見つめる',()=>{mod({study:5});return '同じ絵本を何度も「読んで」とせがんだ。';},'学力の芽'),
  O('音楽が鳴ると体を揺らす',()=>{mod({skill:3});if(S.talent==='music')S.flags.talentHint=1;return 'テレビの歌に合わせて、手を叩いて踊った。';},'リズム感'),
  O('誰にでもニコニコ笑いかける',()=>{mod({comm:5});return 'スーパーのレジの人にまで手を振った。';},'人なつっこさ'),
  O('ずっと親にくっついて離れない',()=>{mod({mental:4,comm:-2});parents().forEach(p=>p.close+=8);return '親の姿が見えないと泣き出した。';},'甘えん坊'),
  O('ぐずってなかなか寝ない',()=>{mod({health:-2});parents().forEach(p=>p.close-=3);return '夜泣きが続き、親は寝不足になった。';},'手のかかる子')])});
D('first_word',{a:[1,2],m:true,c:()=>S.age===2,mk:()=>E('2歳','初めてはっきりしゃべった言葉は……',[
  O('「ママ」',()=>{if(S.fam.mother)S.fam.mother.close+=10;return '母が涙ぐんで喜んだ。';}),
  O('「パパ」',()=>{if(S.fam.father)S.fam.father.close+=10;return '父が親戚中に電話をかけた。';}),
  O('「ワンワン」',()=>{mod({mental:3});return '近所の犬を指さして叫んだ。';}),
  O('「いや！」',()=>{mod({moral:-2,mental:2});return 'イヤイヤ期の始まりだった。';}),
  O('「ありがと」',()=>{mod({moral:4,comm:2});return '周りの大人がみんな驚いた。';})])});
D('hoikuen',{a:[3,3],m:true,mk:()=>{const work=S.fam.struct!=='both'||S.fam.rank<=2;return E('3歳',work?'保育園に通い始めた。初日、親が帰ろうとすると……':'幼稚園に入った。初日、親が帰ろうとすると……',[
  O('大泣きして離れない',()=>{mod({mental:-2});return '1か月泣き続けたが、やがて先生に懐いた。';}),
  O('すぐに友達の輪に入る',()=>{mod({comm:5});addPerson('friend','幼なじみ',{age:S.age,close:70});return '初日から友達ができた。この子とは長い付き合いになる。';}),
  O('一人で黙々とブロックで遊ぶ',()=>{mod({skill:4,comm:-2});return 'ブロックで大きなお城を作った。';}),
  O('先生のそばから離れない',()=>{mod({moral:3});return '先生のお手伝いが好きな子になった。';})]);}});
D('omocha',{a:[3,5],w:5,mk:()=>{const f=friends()[0];return E('園で',`${f?f.name.split(' ')[1]+'くん（ちゃん）':'友達'}に、使っていたおもちゃを取られた。`,[
  O('取り返す',()=>{mod({health:2,moral:-2});if(f)f.close-=5;return '取っ組み合いのけんかになった。';}),
  O('ゆずってあげる',()=>{mod({moral:4,mental:-1});if(f)f.close+=5;return '先生にほめられた。';}),
  O('先生に言いつける',()=>{mod({moral:2});return '先生が間に入ってくれた。';}),
  O('「一緒に遊ぼう」と言う',()=>{mod({comm:5});if(f)f.close+=10;return '二人でもっと楽しい遊びを考えた。';}),
  O('大声で泣く',()=>{mod({mental:-2});return 'おもちゃは戻ってきたが、泣き虫と言われた。';})],W(f));}});
D('naraigoto',{a:[4,7],m:true,c:()=>S.age===5,mk:()=>{const r=S.fam.rank;return E('習い事',r>=2?'親が「何か習い事をしてみる？」と聞いてきた。':'近所の子は習い事に通っている。うちは余裕がなさそうだ。',[
  O('スイミング',()=>{S.flags.nr='swim';mod({health:8});famMoneyAdj(-2);return 'スイミングに通い始めた。';},'',r>=1),
  O('ピアノ',()=>{S.flags.nr='piano';mod({skill:6});famMoneyAdj(-3);if(S.talent==='music'){S.flags.talentKnown=1;return 'ピアノを始めた。先生が「この子は耳がいい」と驚いた。';}return 'ピアノを始めた。';},'',r>=2),
  O('英語教室',()=>{S.flags.nr='eng';mod({study:6});famMoneyAdj(-3);return '英語教室に通い始めた。';},'',r>=2),
  O('サッカー・野球チーム',()=>{S.flags.nr='sport';mod({health:6,comm:5});famMoneyAdj(-2);addPerson('friend','チームメイト',{age:S.age});if(S.talent==='sport'){S.flags.talentKnown=1;return 'チームに入った。コーチに「センスがある」と言われた。';}return 'チームに入った。';},'',r>=1),
  O('公文・学習塾',()=>{S.flags.nr='kumon';mod({study:8,mental:-2});famMoneyAdj(-2);if(S.talent==='study')S.flags.talentKnown=1;return 'プリントを毎日解いた。';},'',r>=1),
  O('絵画教室',()=>{S.flags.nr='art';mod({skill:6});famMoneyAdj(-2);if(S.talent==='art'){S.flags.talentKnown=1;return '絵画教室で、先生が作品を額に入れて飾ってくれた。';}return '絵を描くのが好きになった。';},'',r>=2),
  O('何もしない・外で遊ぶ',()=>{mod({mental:4,health:3});return '毎日、日が暮れるまで公園で遊んだ。';})]);}});
D('maigo',{a:[3,6],w:2,mk:()=>E('迷子',`休日のショッピングモールで、親とはぐれてしまった。`,[
  O('その場で泣いて待つ',()=>{mod({mental:-2});return 'お店の人が見つけてくれた。';}),
  O('自分で探し回る',()=>{mod({mental:3,study:1});return '15分後、自分で親を見つけた。';}),
  O('お店の人に「迷子です」と言う',()=>{mod({comm:4,moral:2});return '館内放送で呼び出してもらった。';}),
  O('声をかけてきた知らない人についていく',()=>{mod({mental:-6});parents().forEach(p=>p.close+=5);return '出口の手前で、血相を変えた親に見つけられた。こっぴどく叱られた。';})])});
D('sibling_born',{a:[1,8],m:true,c:()=>S.fam.sibs.some(s=>!s.older&&S.age+s.age===0),mk:()=>{const s=S.fam.sibs.find(s=>!s.older&&S.age+s.age===0);return E('きょうだい',`${s.sex==='M'?'弟':'妹'}の${s.name}が生まれた。親の目が赤ちゃんばかりに向いている。`,[
  O('お世話を手伝う',()=>{s.close+=15;mod({moral:4});return 'おむつを運ぶのが自分の仕事になった。';}),
  O('赤ちゃん返りする',()=>{mod({mental:-3});parents().forEach(p=>p.close+=3);return '急におねしょをするようになった。';}),
  O('知らんぷりする',()=>{s.close-=10;return 'あまり関心がわかなかった。';}),
  O('「かわいい」とずっと見ている',()=>{s.close+=10;mod({mental:3});return '寝顔を見ているだけで楽しかった。';})],W({look:s.look,age:0,sex:s.sex}));}});
D('play_style',{a:[4,6],w:4,mk:()=>E('遊び','いちばん夢中になっている遊びは？',[
  O('外で鬼ごっこ',()=>{mod({health:5,comm:3});if(S.talent==='sport')S.flags.talentKnown=1;return '足の速さでクラス一番になった。';}),
  O('ブロック・工作',()=>{mod({skill:5});if(S.talent==='tech')S.flags.talentKnown=1;return '親が驚くような大作を作った。';}),
  O('お絵描き',()=>{mod({skill:4});if(S.talent==='art')S.flags.talentKnown=1;return '描いた絵が区のコンクールに飾られた。';}),
  O('ごっこ遊び',()=>{mod({comm:5});if(S.talent==='talk'||S.talent==='comedy')S.flags.talentKnown=1;return 'みんなを笑わせる役が得意だった。';}),
  O('タブレットで動画',()=>{mod({mental:3,study:-1});return '気づけば一日中、動画を見ていた。';}),
  O('図鑑を読む',()=>{mod({study:5});if(S.talent==='study')S.flags.talentKnown=1;return '恐竜の名前を全部言えるようになった。';})])});
// =====================================================================
// 家庭の出来事（子ども時代）
// =====================================================================
D('parents_fight',{a:[3,17],w:2,cd:4,c:()=>S.fam.father&&S.fam.mother&&S.fam.father.alive&&S.fam.mother.alive&&S.fam.struct==='both',mk:()=>{const div=chance(S.fam.rank<=1?.45:.25);return E('家族',div?'両親が離婚することになった。「どっちと暮らしたい？」と聞かれた。':'夜中、両親が怒鳴り合う声で目が覚めた。',div?[
  O('母と暮らす',()=>{S.fam.struct='single_m';S.fam.father.left=1;dropUnborn();S.fam.father.close-=20;famMoneyAdj(-15);S.fam.rank=Math.max(0,S.fam.rank-1);mod({mental:-10});log('両親が離婚、母と暮らす');return '母と二人の暮らしが始まった。家計は苦しくなった。';}),
  O('父と暮らす',()=>{S.fam.struct='single_f';S.fam.mother.left=1;dropUnborn();S.fam.mother.close-=20;famMoneyAdj(-8);mod({mental:-10});log('両親が離婚、父と暮らす');return '父と二人の暮らしが始まった。';}),
  O('どちらも選べないと泣く',()=>{S.fam.struct='single_m';S.fam.father.left=1;dropUnborn();famMoneyAdj(-15);S.fam.rank=Math.max(0,S.fam.rank-1);mod({mental:-15});log('両親が離婚');return '結局、母についていくことになった。しばらく誰とも話せなかった。';})]:[
  O('布団をかぶって耳をふさぐ',()=>{mod({mental:-6});return '朝になると、二人とも何もなかったように振る舞っていた。';}),
  O('二人の間に割って入る',()=>{mod({mental:-3,moral:3});parents().forEach(p=>p.close+=5);return '泣きながら止めた。両親はばつが悪そうに黙った。';}),
  O('きょうだいと一緒に寝る',()=>{S.fam.sibs.forEach(s=>s.close+=10);mod({mental:-2});return 'きょうだいと手をつないで眠った。';},'',S.fam.sibs.length>0),
  O('明るくふるまって場を和ませる',()=>{mod({comm:4,mental:-4});return '家の中のムードメーカーを演じるようになった。';})]);}});
D('parent_risutora',{a:[4,20],w:2,cd:0,c:()=>S.fam.rank>=1&&S.fam.father&&S.fam.father.alive&&!S.fam.father.left,mk:()=>E('家族','父の会社が倒産した。しばらく仕事が見つからないらしい。',[
  O('お小遣いはいらないと言う',()=>{famMoneyAdj(-10);mod({moral:5});S.fam.father.close+=10;return '父が黙って頭をなでた。';}),
  O('習い事・塾をやめる',()=>{famMoneyAdj(-6);mod({study:-3});return '家計のために、習い事をやめた。';}),
  O('いつも通りに過ごす',()=>{famMoneyAdj(-15);S.fam.rank=Math.max(0,S.fam.rank-1);return '家の空気がどこか重くなった。';}),
  O('新聞配達でお金を稼ぐ',()=>{famMoneyAdj(-5);mod({health:3,moral:4});S.cash+=3;return '早朝の新聞配達を始めた。';},'中学生以上',S.age>=13)])});
D('grandpa',{a:[4,16],w:2,cd:0,mk:()=>E('家族','祖父母の家に遊びに行った。祖父が「お前、将来何になりたいんだ？」と聞いてきた。',[
  O('「お金持ち！」',()=>{mod({mental:2});S.cash+=1;return '祖父は笑って、こっそりお小遣いをくれた。';}),
  O('「お医者さん」',()=>{mod({study:3});return '祖父は「勉強しなきゃな」と嬉しそうだった。';}),
  O('「YouTuber」',()=>{return '祖父は首をかしげていた。';}),
  O('「わからない」',()=>{return '「それでいい、ゆっくり探せ」と言われた。';}),
  O('「おじいちゃんみたいな人」',()=>{mod({moral:3});return '祖父は照れくさそうにそっぽを向いた。';})])});
D('kids_abuse',{a:[3,15],w:2,cd:5,c:()=>parents().some(p=>p.alive&&!p.left&&p.pers==='酒癖が悪い'),mk:()=>{const p=parents().find(p=>p.pers==='酒癖が悪い');S.flags.abused=(S.flags.abused||0)+1;return E('家族',`酒に酔った${p.sex==='M'?'父':'母'}が、また物に当たり散らしている。`,[
  O('自分の部屋に逃げる',()=>{mod({mental:-8});return '震えながら朝を待った。';}),
  O('学校の先生に相談する',()=>{mod({mental:-2,moral:3});if(chance(.5)){p.pers='優しい';return '先生が児童相談所に連絡し、家に支援が入った。少しずつ家が落ち着いた。';}return '先生は話を聞いてくれたが、家は変わらなかった。';}),
  O('祖父母の家に避難する',()=>{mod({mental:-3});return 'しばらく祖父母の家で暮らした。';}),
  O('言い返す',()=>{mod({mental:-5,health:-5});p.close-=20;return '殴られた。でも、もう黙っていないと決めた。';},'',S.age>=10)],W(Object.assign({},p,{_mood:'angry'})));}});
// =====================================================================
// 小学校（6〜11歳）
// =====================================================================
D('shogaku',{a:[6,6],m:true,mk:()=>{const can=S.fam.rank>=3&&S.fam.place!=='local';return E('小学校',`いよいよ小学生。${can?'親は私立小学校の「お受験」も考えているようだ。':'ピカピカのランドセルを背負って登校した。'}`,[
  O('近所の公立小学校へ',()=>{addPerson('friend','小学校の友達',{age:S.age});return '近所の子たちと同じ学校に通う。';}),
  O('私立小学校を受験する',()=>{famMoneyAdj(-10);if(S.st.study+S.st.comm+R()*40>55){S.flags.privEle=1;mod({study:6});addPerson('friend','私立小の同級生',{age:S.age,trait:'見栄っ張り'});log('私立小学校に入学');return '合格した。制服で電車通学が始まった。';}addPerson('friend','小学校の友達',{age:S.age});return '不合格。地元の公立小学校に通うことになった。';},'',can)]);}});
D('make_friend',{a:[6,11],w:6,cd:3,mk:()=>E('友達','クラス替えがあった。誰と仲良くなる？',[
  O('クラスで一番やんちゃな子',()=>{addPerson('friend','小学校の悪友',{age:S.age,trait:'お調子者'});mod({comm:4,moral:-3});return 'いたずら仲間ができた。';}),
  O('勉強ができる子',()=>{addPerson('friend','小学校の友達',{age:S.age,trait:'堅実'});mod({study:4});return '一緒に図書室に通うようになった。';}),
  O('おとなしくて一人でいる子',()=>{addPerson('friend','小学校の親友',{age:S.age,trait:'お人よし',close:70});mod({moral:4});return '話してみると、すごく気が合った。';}),
  O('お金持ちの家の子',()=>{addPerson('friend','小学校の友達',{age:S.age,trait:'見栄っ張り'});mod({charm:2});return '家に遊びに行ったら、プールがあった。';}),
  O('転校生',()=>{addPerson('friend','転校生だった友達',{age:S.age,trait:'自由人'});mod({comm:3});return '転校生の案内係を引き受け、親友になった。';}),
  O('誰とも群れない',()=>{mod({mental:-2,skill:3});return '一人の時間が好きだった。';})])});
D('ijime_see',{a:[7,14],w:4,cd:4,mk:()=>E('学校','クラスの子が、何人かから毎日からかわれている。',[
  O('「やめろよ」と止めに入る',()=>{mod({moral:8,mental:-2});if(chance(.3)){S.flags.target=1;return '次の日から、自分が標的になった。';}addPerson('friend','助けた同級生',{age:S.age,close:75});return 'からかいは止まった。その子とは親友になった。';}),
  O('先生にこっそり伝える',()=>{mod({moral:5});return '先生が動き、いじめはなくなった。';}),
  O('見て見ぬふりをする',()=>{mod({moral:-4});return '自分が巻き込まれるのが怖かった。ずっと心に引っかかっている。';}),
  O('一緒になってからかう',()=>{mod({moral:-10,comm:2});S.flags.bully=1;return '笑いながら一緒にからかった。';}),
  O('いじめられている子と友達になる',()=>{mod({moral:6,comm:2});addPerson('friend','小学校の親友',{age:S.age,close:70,trait:'お人よし'});return '放課後、二人でゲームをした。';})])});
D('ijime_victim',{a:[7,15],w:3,cd:3,c:()=>S.st.comm<40||S.flags.target,mk:()=>E('学校','上履きを隠された。机には落書き。クラスの何人かが、こっちを見て笑っている。',[
  O('先生に相談する',()=>{if(chance(.5)){mod({mental:-3});return '先生が対応し、いじめは収まった。';}mod({mental:-10});return '先生は「気にしすぎ」と言った。';}),
  O('親に打ち明ける',()=>{parents().forEach(p=>p.close+=10);mod({mental:-4});if(S.fam.rank>=2&&chance(.4)){S.flags.tenko=1;return '親が学校に乗り込み、転校することになった。';}return '親が学校と話し合ってくれた。';}),
  O('やり返す',()=>{mod({moral:-3,health:-3});if(S.st.health>=60){mod({mental:5});return '主犯格を突き飛ばした。それ以来、誰も手を出してこない。';}mod({mental:-10});return '返り討ちにあった。';}),
  O('じっと耐える',()=>{mod({mental:-14});return '何も言わずに耐えた。毎朝、お腹が痛くなる。';}),
  O('学校を休む',()=>{mod({mental:-4,study:-5});S.flags.futoko=1;log('不登校になる');return '学校に行けなくなった。';})])});
D('futoko',{a:[8,17],m:true,c:()=>S.flags.futoko&&!S.flags.futokoDone,mk:()=>{S.flags.futokoDone=1;return E('不登校','学校に行かなくなって半年。部屋でゲームばかりしている。',[
  O('フリースクールに通う',()=>{S.flags.futoko=0;mod({mental:8,comm:3});famMoneyAdj(-5);addPerson('friend','フリースクールの仲間',{age:S.age});return '自分のペースで学べる場所を見つけた。';},'',S.fam.rank>=1),
  O('保健室登校から始める',()=>{S.flags.futoko=0;mod({mental:4});return '保健室の先生が、いつも温かく迎えてくれた。';}),
  O('転校する',()=>{S.flags.futoko=0;mod({mental:6});addPerson('friend','転校先の友達',{age:S.age});return '環境を変えて、再スタートを切った。';}),
  O('ネットで仲間を見つける',()=>{mod({skill:6,mental:3});addPerson('friend','ネットの友達',{age:S.age,trait:'自由人'});return 'オンラインゲームで、顔も知らない仲間ができた。';}),
  O('このまま部屋にこもる',()=>{mod({mental:-6,study:-6});S.flags.hikikomori=1;return '昼夜が逆転していった。';})]);}});
D('test_zero',{a:[8,14],w:3,cd:3,mk:()=>E('テスト','算数のテストで、とんでもない点数を取ってしまった。',[
  O('正直に親に見せる',()=>{mod({moral:3});parents().forEach(p=>p.close+=3);return '怒られたが、一緒に解き直してくれた。';}),
  O('ランドセルの奥に隠す',()=>{mod({moral:-2});if(chance(.5)){parents().forEach(p=>p.close-=6);return '大掃除の日に見つかり、二倍怒られた。';}return 'なんとかバレなかった。';}),
  O('点数を書き換える',()=>{mod({moral:-6});parents().forEach(p=>p.close-=8);return 'すぐにバレた。点数よりも嘘を叱られた。';}),
  O('悔しくて猛勉強する',()=>{mod({study:7,mental:-2});return '次のテストで満点を取った。';})])});
D('manbiki',{a:[9,16],w:3,cd:0,mk:()=>{const f=friends()[0];return E('誘い',`${f?f.name.split(' ')[1]:'友達'}が「コンビニでお菓子パクろうぜ。バレないって」と言ってきた。`,[
  O('きっぱり断る',()=>{mod({moral:5});if(f)f.close-=5;return '「つまんねーやつ」と言われたが、気にしなかった。';}),
  O('見張り役をする',()=>{mod({moral:-6});if(chance(.3)){S.flags.hodo=1;parents().forEach(p=>p.close-=10);return '店員に捕まり、親が呼び出された。';}return '心臓がばくばくした。';}),
  O('自分もやる',()=>{mod({moral:-10});if(f)f.close+=5;if(chance(.4)){S.flags.hodo=1;parents().forEach(p=>p.close-=15);log('万引きで補導される');return '店の奥に連れていかれ、警察と親が呼ばれた。';}return '成功してしまった。罪悪感と高揚感が入り混じった。';}),
  O('先生に言う',()=>{mod({moral:4});if(f)f.close-=20;return '友達には「チクリ魔」と呼ばれるようになった。';})],W(f));}});
D('game_nego',{a:[7,12],w:3,cd:0,mk:()=>E('おねだり','クラスのみんなが持っている最新のゲーム機が欲しい。',[
  O('「テストで100点とったら」と交渉',()=>{mod({study:5});if(chance(.6)){mod({mental:5});return '本当に100点を取り、ゲーム機を手に入れた。';}return 'あと一歩届かなかった。';}),
  O('泣いて頼み込む',()=>{if(S.fam.rank>=2){famMoneyAdj(-2);mod({mental:4,moral:-2});return '根負けした親が買ってくれた。';}return '「うちはうち、よそはよそ」と言われた。';}),
  O('お年玉で自分で買う',()=>{if(S.cash>=3.5){pay(3.5,'ゲーム機');mod({mental:6});return '自分のお金で買った。大切にしようと思った。';}return 'お年玉では足りなかった。';}),
  O('友達の家でやらせてもらう',()=>{friends().forEach(f=>f.close+=4);mod({comm:2});return '友達の家に入り浸るようになった。';}),
  O('我慢する',()=>{mod({moral:2,mental:-2});return '話題についていけないことが少しさびしかった。';})])});
D('smartphone',{a:[9,12],m:true,c:()=>S.age===10,mk:()=>E('スマホ','クラスの半分がスマホを持ち始めた。',[
  O('買ってもらう',()=>{S.flags.phone=1;famMoneyAdj(-2);mod({comm:3,study:-2});return 'スマホを手に入れた。夜中までLINEが鳴りやまない。';},'',S.fam.rank>=1),
  O('キッズ携帯で我慢',()=>{return '連絡はできるが、グループには入れない。';}),
  O('いらないと言う',()=>{mod({study:2});return 'スマホなしで過ごした。';})])});
D('summer',{a:[6,14],w:4,cd:2,mk:()=>E('夏休み','長い夏休みが始まった。',[
  O('自由研究に全力を注ぐ',()=>{mod({study:4,skill:4});if(chance(.25)){mod({mental:5});return '自由研究が区の賞をとった。';}return '自由研究をやりきった。';}),
  O('ひたすら遊ぶ',()=>{mod({mental:6,health:3,study:-2});friends().forEach(f=>f.close+=5);return '真っ黒に日焼けした。';}),
  O(S.fam.place==='local'?'山や川で虫取り':'田舎の祖父母の家に泊まる',()=>{mod({mental:6,health:3});return 'カブトムシを捕まえた。夜はスイカを食べた。';}),
  O('塾の夏期講習',()=>{mod({study:8,mental:-3});famMoneyAdj(-2);return '毎日塾に通った。';},'',S.fam.rank>=1),
  O('家の手伝いをする',()=>{mod({moral:4});parents().forEach(p=>p.close+=5);return 'お小遣いを少しもらえた。';}),
  O('動画を撮って投稿する',()=>{mod({skill:4});S.flags.sideSNS=1;return '動画を投稿した。再生数は12回だった。';},'',S.flags.phone)])});
D('juken_plan',{a:[9,10],m:true,c:()=>S.age===9&&S.fam.place!=='local'&&S.fam.rank>=2&&!S.flags.privEle,mk:()=>E('中学受験',`塾のチラシが届いた。東京では中学受験をする子が多い。${infoLink('juken')}`,[
  O('中学受験をする',()=>{S.flags.jukenPlan=1;famMoneyAdj(-12);mod({study:8,mental:-6});log('中学受験の塾に通い始める');return '週5日、塾に通う生活が始まった。';},'塾代は3年で数百万円'),
  O('地元の公立中学に進む',()=>{return 'みんなと同じ公立中学に進むことにした。';})])});
D('hatsukoi',{a:[9,13],w:4,cd:0,mk:()=>{const p=addPerson('crush','初恋の人',{age:S.age,sex:S.sex==='M'?'F':'M',close:30});return E('初恋',`クラスの${p.name.split(' ')[1]}のことが、なぜか気になって仕方ない。`,[
  O('思い切って告白する',()=>{if(S.st.charm+S.st.comm+R()*40>80){p.close=80;mod({mental:8,charm:3});return 'まさかのOKだった！ 手をつないで帰った。';}mod({mental:-6});return '「ごめん」と言われた。その日は一日中、上の空だった。';}),
  O('手紙を書く',()=>{if(chance(.4)){p.close=70;mod({mental:6});return '返事の手紙が下駄箱に入っていた。';}return '手紙は渡せないまま、机の奥にしまった。';}),
  O('友達に相談する',()=>{if(chance(.6)){mod({mental:-5});return '次の日、クラス中に知れ渡っていた。';}return '友達が応援してくれた。';}),
  O('見ているだけでいい',()=>{return '目が合うだけで、一日が楽しかった。';})],W(p));}});
D('iinkai',{a:[8,11],w:3,mk:()=>E('学校','学級委員を決めることになった。',[
  O('立候補する',()=>{mod({comm:6,moral:3});return '学級委員になった。人前で話すのに慣れてきた。';}),
  O('友達を推薦する',()=>{friends().forEach(f=>f.close+=4);return '友達が学級委員になった。';}),
  O('下を向いて目立たないようにする',()=>{return '何事もなく終わった。';})])});
D('undokai',{a:[6,12],w:3,cd:2,mk:()=>E('運動会','クラス対抗リレーの選手を決めることになった。',[
  O('アンカーに立候補',()=>{if(S.st.health>=65){mod({comm:4,mental:6});S.mood='happy';return '最後に二人抜いて、クラスを優勝させた！';}mod({mental:-4});return 'ゴール前で抜かれてしまった。';}),
  O('応援団をやる',()=>{mod({comm:5});return '声が枯れるまで応援した。';}),
  O('なるべく出番を減らす',()=>{return '玉入れだけ出た。';})])});
D('youtuber',{a:[10,14],w:2,mk:()=>E('夢','人気YouTuberの動画を見て、「自分もやりたい」と思った。',[
  O('チャンネルを作って投稿する',()=>{S.flags.sideSNS=1;mod({skill:5});if(S.talent==='comedy'||S.talent==='talk'){S.flags.talentKnown=1;S.followers=(S.followers||0)+5;return '投稿した動画が学校でちょっと話題になった。';}return '再生数は伸びないが、編集が楽しい。';}),
  O('見る専門でいい',()=>'見ているだけで十分楽しい。'),
  O('親に反対されてあきらめる',()=>{mod({mental:-2});return '「勉強しなさい」と言われた。';})])});
D('jiko_kid',{a:[6,17],w:1,cd:0,mk:()=>E('事故','自転車で坂道を下っていたら、ブレーキが効かなかった。',[
  O('とっさに飛び降りる',()=>{mod({health:-8});return '腕を骨折した。ギプス姿で1か月過ごした。';}),
  O('ハンドルにしがみつく',()=>{if(chance(.5)){mod({health:-15});return '車と接触し、入院することになった。';}return '奇跡的に無傷だった。';})])});
// =====================================================================
// 中学（12〜14歳）
// =====================================================================
D('chugaku',{a:[12,12],m:true,mk:()=>{
  if(S.flags.jukenPlan){const ok=S.st.study+R()*30>60;if(ok){S.flags.privMid=1;S.st.study+=5;addPerson('friend','中学の同級生',{age:S.age,trait:'堅実'});log('私立中学に合格');return E('中学受験','合格発表の日。掲示板に自分の番号が……あった！',[O('親と抱き合って喜ぶ',()=>{parents().forEach(p=>p.close+=12);S.mood='happy';return '私立中学に進学した。';})]);}
    return E('中学受験','合格発表の日。掲示板に、自分の番号はなかった。',[O('泣く',()=>{mod({mental:-10});return '地元の公立中学に進むことになった。';}),O('「公立でトップになる」と誓う',()=>{mod({study:5});return '悔しさをバネにした。';})]);}
  return E('中学','中学生になった。部活は何にする？',[
    O('サッカー・野球・バスケ部',()=>{S.flags.club='運動部';mod({health:8,comm:5});addPerson('friend','部活の仲間',{age:S.age});if(S.talent==='sport')S.flags.talentKnown=1;return '朝練と夕練の日々が始まった。';}),
    O('吹奏楽部',()=>{S.flags.club='吹奏楽部';mod({skill:6,comm:3});addPerson('friend','部活の仲間',{age:S.age});if(S.talent==='music')S.flags.talentKnown=1;return 'トランペットを担当することになった。';}),
    O('美術部',()=>{S.flags.club='美術部';mod({skill:7});if(S.talent==='art')S.flags.talentKnown=1;return '放課後、静かな美術室で絵を描いた。';}),
    O('パソコン部',()=>{S.flags.club='パソコン部';mod({skill:8});if(S.talent==='tech')S.flags.talentKnown=1;return 'プログラミングに夢中になった。';}),
    O('生徒会',()=>{S.flags.club='生徒会';mod({comm:7,study:3,moral:3});return '生徒会の書記になった。';}),
    O('帰宅部',()=>{S.flags.club='帰宅部';mod({mental:3});return '自由な放課後を手に入れた。';})]);}});
D('hankouki',{a:[12,16],w:5,cd:3,c:()=>livingParents().length>0,mk:()=>{const p=pick(livingParents());return E('反抗期',`${p.sex==='M'?'父':'母'}に「スマホばかり見て！ 勉強しなさい！」と怒鳴られた。`,[
  O('素直に謝る',()=>{p.close+=5;mod({study:2});return '少し気まずかったが、夕飯は普通に食べた。';}),
  O('「うるせえ」と言い返す',()=>{p.close-=10;mod({moral:-3});return '家の中で口をきかない日が続いた。';}),
  O('無視して部屋にこもる',()=>{p.close-=6;mod({mental:-2});return 'ドアに鍵をかけた。';}),
  O('家を飛び出す',()=>{p.close-=8;mod({mental:-3});if(chance(.3)){S.flags.hodo=1;return '夜の公園にいたところを補導された。';}return '友達の家に泊めてもらった。';}),
  O('ちゃんと話し合う',()=>{p.close+=10;mod({comm:4,mental:3});return '自分の考えを初めて親に伝えた。';}),
  O('祖父母の家に逃げ込む',()=>{mod({mental:2});return '祖母が何も聞かずにご飯を作ってくれた。';})],W(Object.assign({},p,{_mood:'angry'})));}});
D('senpai',{a:[12,16],w:3,cd:0,mk:()=>E('学校','部活の先輩に、体育館の裏に呼び出された。「生意気なんだよ」',[
  O('黙って従う',()=>{mod({mental:-6});return 'パシリにされる日々が始まった。';}),
  O('走って逃げる',()=>{mod({health:2});return '逃げ切った。次の日からは気まずい。';}),
  O('先生に報告する',()=>{mod({moral:3});return '先輩は指導を受けた。';}),
  O('言い返して一歩も引かない',()=>{if(S.st.health+R()*40>70){mod({mental:6,comm:3});return '先輩はそれきり絡んでこなくなった。';}mod({health:-8});return '殴られた。でも、謝らなかった。';})])});
D('tabako_young',{a:[13,19],w:4,cd:0,mk:()=>{const f=friends()[0]||addPerson('friend','地元の先輩',{age:S.age+2,trait:'お調子者'});return E('誘い',`${f.name.split(' ')[1]}が「一本吸ってみ？」とタバコを差し出してきた。`,[
  O('きっぱり断る',()=>{mod({moral:3});return '「まじめかよ」と笑われたが、吸わなかった。';}),
  O('一口だけ吸ってみる',()=>{if(chance(.4)){S.vice.smoke=35;return 'むせたが、なぜかまた吸いたくなった。気づけば習慣になっていた。';}return 'むせ返った。二度と吸わないと思った。';}),
  O('吸う。カッコいいと思った',()=>{S.vice.smoke=50;mod({moral:-6,charm:2});S.flags.yankee=1;if(chance(.25)){S.flags.hodo=1;return '駅の裏で吸っているところを補導された。';}return 'タバコを吸うようになった。';}),
  O('その場を離れる',()=>{f.close-=8;return 'その友達とは、だんだん距離ができた。';})],W(f));}});
D('sake_young',{a:[15,19],w:3,cd:0,mk:()=>E('誘い','友達の家での集まりで、缶チューハイが回ってきた。',[
  O('飲む',()=>{S.vice.drink+=20;mod({moral:-4,comm:3});if(chance(.15)){mod({health:-10});return '飲みすぎて倒れ、救急車で運ばれた。親が飛んできた。';}return '頭がぐるぐるした。';}),
  O('飲んだふりをする',()=>{mod({comm:2});return 'うまくごまかした。';}),
  O('ジュースを頼む',()=>{mod({moral:2});return '誰も気にしなかった。';}),
  O('帰る',()=>{friends().forEach(f=>f.close-=3);return '先に帰った。';})])});
D('sns_trouble',{a:[12,22],w:3,cd:4,c:()=>S.flags.phone||S.age>=15,mk:()=>E('SNS','裏アカウントで悪口を書いたのが、本人にバレた。',[
  O('素直に謝る',()=>{mod({moral:4});return '許してはもらえたが、前のようには戻らなかった。';}),
  O('「自分じゃない」と言い張る',()=>{mod({moral:-5,mental:-4});friends().forEach(f=>f.close-=8);return 'スクショが回り、クラスで孤立した。';}),
  O('アカウントを消して逃げる',()=>{mod({mental:-4});return 'しばらく学校に行くのがつらかった。';}),
  O('SNSを完全にやめる',()=>{mod({mental:4,study:3});return 'スマホから離れたら、気持ちが軽くなった。';})])});
D('koukou',{a:[15,15],m:true,c:()=>!S.flags.privMid,mk:()=>{
  const s=S.st.study;const tgt=[[4,'都立トップ校',75],[3,'進学校',58],[2,'普通の都立高校',40],[1,'工業・商業高校',20],[1,'偏差値の低い高校',0]];
  const ops=tgt.map(([t,n,need])=>O(`${n}を受ける`,()=>{const ok=s+R()*20>=need+5;const got=ok?{tier:t,n}:{tier:Math.max(1,t-1),n:t>=3?'すべり止めの私立高校':'定員割れの高校'};S.hs=got;if(!ok)famMoneyAdj(-4);addPerson('friend','高校の友達',{age:S.age,trait:t<=1?pick(['お調子者','自由人']):pick(['堅実','野心家','面倒見がいい'])});if(t<=1)S.flags.yankee=S.flags.yankee||chance(.3);log(`${got.n}に入学`);if(!ok)mod({mental:-6});return ok?`${n}に合格した！`:`不合格……。${got.n}に通うことになった。`;},`学力の目安 ${need}`));
  ops.push(O('通信制高校に行く',()=>{S.hs={tier:1,n:'通信制高校'};mod({mental:4});log('通信制高校に入学');return '自分のペースで学べる通信制高校を選んだ。';}));
  ops.push(O('高校に行かず働く',()=>{S.hs={tier:0,n:'中卒'};S.flags.dropout=1;setJob('freeter');log('中学を出て働く');return '中学を卒業して、働き始めた。';}));
  return E('高校受験',`高校受験。今の学力は${Math.round(s)}。どこを受ける？`,ops);}});
D('koukou_priv',{a:[15,15],m:true,c:()=>S.flags.privMid,mk:()=>{S.hs={tier:4,n:'私立中高一貫校'};return E('高校','中高一貫校なので、高校受験はない。',[O('内部進学する',()=>{addPerson('friend','高校の友達',{age:S.age,trait:'野心家'});return 'そのまま高校に上がった。';})]);}});
// =====================================================================
// 高校（15〜17）
// =====================================================================
D('baito',{a:[15,19],m:true,c:()=>S.age===16&&S.hs&&S.hs.tier>0,mk:()=>E('アルバイト','アルバイトを始めようか迷っている。',[
  O('コンビニ',()=>{S.baito=60;mod({comm:3});addPerson('friend','バイト仲間',{age:S.age+2});return 'コンビニでバイトを始めた。時給は1,280円。'+infoLink('minwage');}),
  O('居酒屋・飲食',()=>{S.baito=75;mod({comm:5,health:-2});addPerson('friend','バイト先の先輩',{age:S.age+3,trait:'面倒見がいい'});return '居酒屋で働き始めた。まかないがうまい。';}),
  O('引っ越しのバイト',()=>{S.baito=80;mod({health:5});return '体はきついが、日払いでお金が入る。';}),
  O('塾講師',()=>{S.baito=70;mod({study:3,comm:3});return '小学生に算数を教えている。';},'学力55以上',S.st.study>=55),
  O('アパレル',()=>{S.baito=55;mod({charm:5});return '服が安く買えるのがうれしい。';},'魅力45以上',S.st.charm>=45),
  O('やらない（勉強や部活に集中）',()=>{S.baito=0;mod({study:3});return 'バイトはしないことにした。';})])});
D('koibito_teen',{a:[14,19],w:4,cd:3,c:()=>!S.partner,mk:()=>{const sx=S.sex==='M'?'F':'M';const p={name:pname(sx),sex:sx,age:S.age,look:newLook(sx),close:55,yrs:0,job:'学生',pers:pick(['優しい','気が強い','寂しがり屋'])};return E('恋','同じクラスの'+p.name+'から、放課後に「好きです」と告白された。',[
  O('付き合う',()=>{S.partner=p;mod({mental:8,charm:2});log(p.name+'と付き合う');S.mood='happy';return '初めての恋人ができた。';}),
  O('友達でいたいと伝える',()=>{mod({moral:2});return '気まずかったが、友達のままでいることになった。';}),
  O('ほかに好きな人がいると断る',()=>{return '正直に断った。';})],W(p));}});
D('bike',{a:[16,19],w:2,mk:()=>E('バイク','先輩に「中古のバイク、5万で譲ってやるよ」と言われた。',[
  O('免許を取ってバイクに乗る',()=>{if(S.cash<12)return 'お金が足りなかった。';pay(12,'バイク免許と車体');S.flags.bike=1;mod({mental:6,charm:3});if(chance(.15)){mod({health:-20});return '雨の日に転倒し、足を骨折した。';}return '風を切って走るのが最高だった。';}),
  O('断る',()=>'危ないので断った。'),
  O('免許なしで乗ってみる',()=>{mod({moral:-8});if(chance(.5)){S.flags.hodo=1;parents().forEach(p=>p.close-=10);return '警察に止められ、補導された。';}return 'バレなかった。でも二度と乗らないと決めた。';})])});
D('yoasobi',{a:[15,19],w:3,cd:3,mk:()=>E('夜の街','金曜の夜。友達に「渋谷行こうぜ」と誘われた。終電はとっくにない。',[
  O('朝まで遊ぶ',()=>{mod({comm:4,mental:4,health:-3,moral:-3});if(chance(.2)){S.flags.hodo=1;return 'センター街で補導された。';}return '始発で帰った。親はかんかんだった。';}),
  O('終電で帰る',()=>{return '楽しかった。ほどほどが一番。';}),
  O('断って家で寝る',()=>{mod({health:2});return 'ぐっすり眠った。';}),
  O('クラブに潜り込む',()=>{mod({moral:-5});S.flags.club=1;return '年齢をごまかしてクラブに入った。大音量の中で、知らない大人に話しかけられた。';},'',S.st.charm>=45)])});
D('taima',{a:[16,40],w:2,cd:6,c:()=>S.flags.club||S.flags.yankee||S.st.moral<50||chance(.3),mk:()=>E('誘い','知り合いに「これ吸うとめっちゃ楽しくなるよ。みんなやってる」と、植物片の入った袋を見せられた。'+infoLink('taima'),[
  O('きっぱり断る',()=>{mod({moral:5});return '断った。その人とは距離を置くことにした。';}),
  O('その場から離れる',()=>{return '何も言わずに帰った。';}),
  O('一回だけなら……',()=>{S.vice.drug=30;mod({moral:-15});if(chance(.25)){arrest('大麻の所持');return '数日後、家に警察が来た。';}return '頭がぼんやりした。「一回だけ」のはずだった。';}),
  O('警察に通報する',()=>{mod({moral:6});return '匿名で通報した。';})])});
D('drug_spiral',{a:[16,60],m:true,c:()=>S.vice.drug>0&&chance(.35),mk:()=>E('依存','またあの感覚が欲しくなっている。',[
  O('手に入れて使う',()=>{S.vice.drug=Math.min(100,S.vice.drug+25);mod({health:-10,mental:-8});pay(10,'違法薬物');if(chance(.3)){arrest('違法薬物の使用');return '職務質問で見つかり、逮捕された。';}return 'やめられない。';}),
  O('依存症の専門外来に相談する',()=>{pay(5,'専門外来');if(chance(.5)){S.vice.drug=0;mod({mental:5});log('薬物をやめる');return '治療を受けて、手を切ることができた。';}return '治療を始めたが、まだ苦しい。';}),
  O('連絡先をすべて消す',()=>{if(chance(.4)){S.vice.drug=0;return 'もう二度と戻らないと誓った。';}return '数か月後、また連絡してしまった。';})])});
function arrest(what,yrs){S.crime=(S.crime||0)+1;log(`${what}で逮捕される`);mod({mental:-20,moral:-5});friends().forEach(f=>f.close-=20);parents().forEach(p=>p.close-=20);S.mood='shock';
  if(['正社員','公務員','専門職'].includes(J().cat)){setJob('none');S.notes.push('会社を懲戒解雇された。');}
  if(S.partner){S.exes.push(S.partner.name);S.partner=null;}
  if(S.age<20){S.notes.push(yrs>=3?'少年院に送られ、1年を過ごした。':'家庭裁判所に送られ、保護観察処分になった。');if(yrs>=3){S.age+=1;S.year+=1;}return;}
  if(yrs==null)yrs=chance(.5)?0:2;
  if(!yrs){pay(50,'弁護士費用');S.notes.push('執行猶予つきの判決が出た。');}else{S.notes.push(`懲役${yrs}年の判決を受け、刑務所で${yrs}年を過ごした。`);S.age+=yrs;S.year+=yrs;S.flags.prison=1;if(S.spouse&&chance(.5)){S.notes.push(`${S.spouse.name}から離婚届が届いた。`);S.exes.push(S.spouse.name);S.spouse=null;}}}
D('bunkasai',{a:[15,17],w:3,cd:2,mk:()=>E('文化祭','文化祭で何をやる？',[
  O('バンドを組んでステージに立つ',()=>{mod({comm:5,charm:4,skill:3});if(S.talent==='music'){S.flags.talentKnown=1;return '体育館が揺れるほど盛り上がった。';}return 'ミスだらけだったが、最高の思い出になった。';}),
  O('漫才コンテストに出る',()=>{mod({comm:6});if(S.talent==='comedy'){S.flags.talentKnown=1;return '全校が爆笑した。お笑いの道を本気で考え始めた。';}return 'すべった。';}),
  O('クラスの模擬店の店長',()=>{mod({comm:5,skill:3});return '焼きそばが完売した。';}),
  O('サボって家にいる',()=>{friends().forEach(f=>f.close-=4);return '誰にも気づかれなかった。';}),
  O('好きな人と一緒に回る',()=>{if(S.partner){S.partner.close+=15;return '二人で写真を撮った。';}mod({mental:3});return '勇気を出して誘ってみた。';})])});
D('ryugaku',{a:[15,17],w:2,c:()=>S.fam.rank>=3,mk:()=>E('留学','学校の交換留学プログラムの案内が来た。1年間アメリカへ。',[
  O('行く',()=>{famMoneyAdj(-10);mod({study:8,comm:8,mental:5});S.flags.ryugaku=1;log('アメリカに1年留学');return 'ホストファミリーと過ごした1年で、世界が広がった。';}),
  O('行かない',()=>'日本に残った。')])});
D('tantei',{a:[17,17],m:true,c:()=>S.hs&&S.hs.tier>0&&!S.flags.dropout,mk:()=>E('進路面談',`担任との進路面談。高校は${S.hs.n}、今の学力は${Math.round(S.st.study)}。`,[
  O('指定校推薦を狙う',()=>{if(S.st.moral>=60&&S.hs.tier>=2){S.flags.suisen=1;return '真面目な態度が評価され、推薦枠がもらえそうだ。';}return '素行が足りず、推薦はもらえなかった。';}),
  O('一般入試で上を目指す',()=>{mod({study:6,mental:-4});return '受験勉強に本腰を入れた。';}),
  O('専門学校に行きたい',()=>{S.flags.wantSenmon=1;return '手に職をつけたいと伝えた。';}),
  O('就職したい',()=>{S.flags.wantWork=1;return '先生が求人票を見せてくれた。';}),
  O('まだ何も考えていない',()=>{mod({mental:-2});return '「そろそろ考えないとな」と言われた。';})])});
// =====================================================================
// 18歳：進路
// =====================================================================
D('shinro',{a:[18,21],m:true,c:()=>!S.flags.dropout&&!S.flags.shisetsu&&S.job.id==='student'&&!S.edu&&(S.age===18||S.roninReady),mk:()=>{
  const s=S.st.study+(S.hs?S.hs.tier*3:0)+(S.flags.suisen?10:0);
  const ops=[];
  const uni=(tier,n,need,cost)=>O(`${n}を受験する`,()=>{const ok=s+R()*20>=need+5;if(!ok){S.queue.unshift(evRonin());mod({mental:-8});return `${n}は不合格だった……。`;}S.uni=tier;S.edu={n:UNI_N[tier],left:4,cost,kind:'uni'};S.baito=S.baito||80;S.queue.unshift(evPayEdu(cost,4,UNI_N[tier]));log(`${n.replace('（私立）','')}に合格`);S.mood='happy';return `${n}に合格した！`;},`学力の目安 ${need}・学費 年${cost}万円`);
  ops.push(uni(4,'東大・早慶',78,80));
  ops.push(uni(3,'MARCHクラスの大学',60,110));
  ops.push(uni(2,'日東駒専クラスの大学',45,110));
  ops.push(O('名前を書けば入れる大学に行く',()=>{S.uni=1;S.baito=S.baito||80;S.edu={n:UNI_N[1],left:4,cost:110,kind:'uni'};S.queue.unshift(evPayEdu(110,4,'大学'));log('大学に入学');return '大学に入学した。';},'学費 年110万円'));
  if(S.st.study>=82)ops.push(O('医学部を受験する',()=>{if(s+R()*20>=92){S.edu={n:'医学部',left:6,cost:80,kind:'med'};S.uni=4;S.queue.unshift(evPayEdu(80,6,'医学部'));log('医学部に合格');S.mood='happy';return '医学部に合格した！';}S.queue.unshift(evRonin());return '医学部は不合格だった。';},'6年間'));
  ops.push(O('専門学校に行く',()=>{S.queue.unshift(evSenmon());return null;},'IT・美容・看護・保育・調理など'));
  ops.push(O('就職する',()=>{S.job.id='none';S.queue.unshift(evOffers('高校卒業。就職活動の結果は……',true));know('shoninkyu');return null;},'初任給は約20〜22万円'));
  ops.push(O('フリーターになる',()=>{setJob('freeter');return 'とりあえずバイトで暮らす。'+infoLink('minwage');}));
  ops.push(O('夢を追う（芸人・音楽・役者）',()=>{setJob('dream');S.flags.dreamStart=1;return '夢を追うと決めた。バイトをしながら舞台に立つ。';}));
  if(S.fam.rank>=4)ops.push(O('海外の大学に進学する',()=>{S.uni=4;S.flags.ryugaku=1;S.edu={n:'海外の大学',left:4,cost:400,kind:'uni'};famMoneyAdj(-30);mod({comm:8});log('海外の大学に進学');return 'ボストンの大学に進学した。学費は親が出してくれる。';}));
  return E('18歳・進路',`高校卒業。${S.fam.place==='local'?'地元を出て東京へ行くか、ここで決める。':'人生の大きな分かれ道だ。'}<br>学力 ${Math.round(S.st.study)}／スキル ${Math.round(S.st.skill)}／コミュ ${Math.round(S.st.comm)}`,ops);}});
function evRonin(){return E('浪人','受験に失敗した。どうする？',[
  O('浪人してもう一年がんばる',()=>{S.flags.ronin=(S.flags.ronin||0)+1;mod({study:12,mental:-8});famMoneyAdj(-6);S.job.id='student';S.roninReady=1;setTimeout(()=>{S.evDone.shinro=null;},0);return '予備校に通う一年が始まった。来年もう一度挑戦する。';}),
  O('受かった大学に行く',()=>{S.uni=1;S.edu={n:UNI_N[1],left:4,cost:110,kind:'uni'};S.queue.unshift(evPayEdu(110,4,'大学'));return '受かった大学に進むことにした。';}),
  O('就職する',()=>{S.job.id='none';S.queue.unshift(evOffers('就職活動をした。',true));return null;}),
  O('フリーターになる',()=>{setJob('freeter');return 'とりあえずバイトで暮らす。';})]);}
function evPayEdu(cost,yrs,n){const r=S.fam.rank;return E('学費',`${n}の学費（${yrs}年で約${yen(cost*yrs)}）はどうする？`,[
  O('親に出してもらう',()=>{famMoneyAdj(-cost*yrs/25);return '親が学費を出してくれる。頭が上がらない。';},'家計に余裕があれば',r>=2&&S.fam.alive),
  O('奨学金を借りる',()=>{S.edu.loan=1;log('奨学金を借りる');return '奨学金を借りることにした。卒業したら返していく。'+infoLink('shogaku');},'卒業後に返済'),
  O('バイトで自分で払う',()=>{S.edu.self=1;S.baito=110;mod({health:-4});return 'バイトを掛け持ちして学費を払う。';})]);}
function evSenmon(){return E('専門学校','どの専門学校に行く？',[
  O('IT・プログラミング（2年）',()=>{S.edu={n:'IT専門学校',left:2,cost:120,kind:'senmon',bt:1,it:1,lic:'it'};S.baito=80;S.queue.unshift(evPayEdu(120,2,'専門学校'));log('IT専門学校に入学');return 'IT専門学校に入学した。';}),
  O('美容（2年）',()=>{S.edu={n:'美容専門学校',left:2,cost:130,kind:'senmon',bt:1,lic:'biyo'};S.queue.unshift(evPayEdu(130,2,'専門学校'));log('美容専門学校に入学');return '美容専門学校に入学した。';}),
  O('看護（3年）',()=>{S.edu={n:'看護学校',left:3,cost:100,kind:'senmon',bt:1,lic:'nurse'};S.queue.unshift(evPayEdu(100,3,'看護学校'));log('看護学校に入学');return '看護学校に入学した。';}),
  O('保育（2年）',()=>{S.edu={n:'保育の専門学校',left:2,cost:110,kind:'senmon',bt:1,lic:'hoiku'};S.queue.unshift(evPayEdu(110,2,'専門学校'));log('保育の専門学校に入学');return '保育の専門学校に入学した。';}),
  O('調理（1年）',()=>{S.edu={n:'調理師学校',left:1,cost:180,kind:'senmon',bt:1,lic:'chef'};S.queue.unshift(evPayEdu(180,1,'調理師学校'));log('調理師学校に入学');return '調理師学校に入学した。';}),
  O('デザイン（2年）',()=>{S.edu={n:'デザイン専門学校',left:2,cost:130,kind:'senmon',bt:1,it:1};S.queue.unshift(evPayEdu(130,2,'専門学校'));log('デザイン専門学校に入学');return 'デザイン専門学校に入学した。';})]);}
D('jyoukyo',{a:[18,18],m:true,c:()=>S.fam.place==='local'&&!S.flags.shisetsu&&S.job.id!=='none'&&!S.flags.jyoukyo,mk:()=>{S.flags.jyoukyo=1;return E('上京','春、地元を離れて東京に出る。どこに住む？',[
  O('シェアハウス（中野）',()=>{S.home='share';addPerson('friend','シェアハウスの住人',{age:S.age+3,trait:'自由人'});return '中野のシェアハウスで暮らし始めた。'+infoLink('rent');},'月5.5万円'),
  O('23区の安い1K（足立区）',()=>{S.home='adachi';return '足立区のアパートに住み始めた。';},'月7.5万円'),
  O('郊外のワンルーム',()=>{S.home='suburb';return '埼玉寄りのワンルームに住み始めた。満員電車が待っている。';},'月6.3万円'),
  O('学生寮',()=>{S.home='share';return '学生寮に入った。';},'月5万円ほど',S.edu)]);}});
D('jitaku_teen',{a:[18,18],m:true,c:()=>S.fam.place!=='local'&&!S.flags.jyoukyo&&!S.flags.shisetsu,mk:()=>{S.flags.jyoukyo=1;return E('住まい','実家暮らしを続ける？ それとも一人暮らし？',[
  O('実家に住み続ける',()=>{S.home='jikka';return '実家から通う。家にお金を入れることになった。';}),
  O('一人暮らしを始める（23区の1K）',()=>{S.home='normal';mod({mental:4});return '一人暮らしを始めた。自由と、家賃の請求書が同時にやってきた。'+infoLink('rent');},'月10.2万円'),
  O('シェアハウスに住む',()=>{S.home='share';addPerson('friend','シェアハウスの住人',{age:S.age+3});return 'シェアハウスに引っ越した。';},'月5.5万円')]);}});
// =====================================================================
// 大学・専門（18〜23）
// =====================================================================
D('circle',{a:[18,19],m:true,c:()=>S.edu&&S.edu.kind==='uni'&&!S.flags.circle,mk:()=>{S.flags.circle=1;return E('大学','新歓の季節。どのサークルに入る？',[
  O('飲み会ばかりのテニスサークル',()=>{mod({comm:8,charm:3,study:-4});S.vice.drink+=15;addPerson('friend','サークルの仲間',{age:S.age});addPerson('friend','サークルの仲間',{age:S.age});return '毎週のように飲み会があった。';}),
  O('本気の体育会',()=>{mod({health:10,comm:4,moral:3});addPerson('friend','体育会の同期',{age:S.age,trait:'面倒見がいい'});S.flags.taiikukai=1;return '朝練の日々。就活では体育会が有利らしい。';}),
  O('ボランティアサークル',()=>{mod({moral:6,comm:4});addPerson('friend','ボランティア仲間',{age:S.age});return '週末は子ども食堂を手伝った。';}),
  O('学生起業サークル',()=>{mod({skill:5,comm:4});addPerson('friend','起業仲間',{age:S.age,trait:'野心家'});return '意識の高い仲間に囲まれた。';}),
  O('音楽・お笑いサークル',()=>{mod({skill:5,comm:4});addPerson('friend','サークルの仲間',{age:S.age,trait:'自由人'});return 'ライブハウスに入り浸った。';}),
  O('どこにも入らない',()=>{mod({study:4});return '授業とバイトだけの生活を送った。';})]);}});
D('tani',{a:[19,22],w:4,cd:2,c:()=>S.edu&&S.edu.left>0,mk:()=>E('大学','前期の試験が近い。出席はぎりぎりだ。',[
  O('ちゃんと授業に出る',()=>{mod({study:5});return '真面目に出席し、単位を取った。';}),
  O('友達に代返を頼む',()=>{mod({moral:-3});if(chance(.3)){S.edu.left++;mod({mental:-6});return 'バレて単位を落とした。留年が決まった。';}return 'なんとか単位を取った。';}),
  O('テスト前だけ詰め込む',()=>{if(S.st.study+R()*30>55)return 'ぎりぎりで単位が取れた。';S.edu.left++;return '単位を落として、留年が決まった。';}),
  O('遊びを優先して留年覚悟',()=>{S.edu.left++;mod({mental:6,comm:4,study:-4});famMoneyAdj(-4);return '留年した。でも楽しかった。';})])});
D('seijin',{a:[20,20],m:true,mk:()=>E('成人式','20歳。成人式の案内が届いた。'+(S.fam.place==='local'?'地元に帰るかどうか。':''),[
  O('参加して、地元の仲間と再会する',()=>{friends().forEach(f=>{if(/幼なじみ|小学校|中学|地元|高校/.test(f.rel))f.close+=15;});mod({mental:5});S.mood='happy';return '久しぶりの顔ぶれと朝まで飲んだ。';}),
  O('袴・振袖で派手に決める',()=>{pay(Math.min(S.cash,15),'衣装代');mod({charm:4,mental:6});return '写真をたくさん撮った。';}),
  O('行かない',()=>'成人式には行かなかった。')])});
D('nenkin20',{a:[20,20],m:true,c:()=>!['正社員','公務員','専門職'].includes(J().cat),mk:()=>E('年金',`20歳になり、国民年金の納付書が届いた。月1万7千円ほど。${infoLink('nenkin')}`,[
  O('きちんと払う',()=>{S.flags.payNenkin=true;return '毎月払うことにした。';}),
  O('学生納付特例を申請する',()=>{S.flags.payNenkin=false;return '在学中は猶予してもらうことにした。';},'',S.job.id==='student'),
  O('親に払ってもらう',()=>{S.flags.payNenkin=true;famMoneyAdj(-4);return '親が払ってくれることになった。';},'',S.fam.rank>=2&&S.fam.alive),
  O('払わない',()=>{S.flags.payNenkin=false;S.flags.noNenkin=1;return '払わなかった。老後のことなんて、まだ考えられない。';})])});
D('mlm',{a:[19,40],w:3,cd:6,c:()=>friends().length>0,mk:()=>{const f=pick(friends());return E('勧誘',`久しぶりに${f.name}からお茶に誘われた。「すごいビジネスがあってさ。話だけでも聞いてよ」${infoLink('mlm')}`,[
  O('話に乗る',()=>{pay(Math.min(30,Math.max(0,S.cash)),'ビジネスの初期費用');S.flags.mlm=1;S.people.forEach(x=>{if(x.kind==='friend'&&x!==f)x.close-=12;});return '商品を買い、友人に声をかけ始めた。気づけば友人が離れていく。';}),
  O('話だけ聞いて断る',()=>{f.close-=10;return '2時間話を聞いて、断った。';}),
  O('きっぱり断る',()=>{f.close-=20;return 'それきり連絡は来なくなった。';}),
  O('逆に説得してやめさせる',()=>{if(S.st.comm>=55){f.close+=10;return `${f.name}は目を覚まして、ビジネスを抜けた。`;}f.close-=25;return '説得は届かなかった。';})],W(f));}});
D('shukatsu',{a:[19,32],m:true,c:()=>S.edu&&S.edu.left<=0&&!S.edu.done,mk:()=>{const e=S.edu;e.done=1;if(e.lic&&e.lic!=='it'&&e.lic!=='chef')S.lics[e.lic]=1;if(e.lic==='chef')S.flags.chefSchool=1;if(e.it)mod({skill:15});
  if(e.kind==='med'){const ok=S.st.study+R()*20>70;if(ok){S.lics.med=1;return E('医師国家試験','6年間の医学部を終え、医師国家試験の結果発表の日。',[O('合格！医師になる',()=>{setJob('doctor');S.mood='happy';return '研修医として働き始めた。';})]);}return E('医師国家試験','医師国家試験に落ちてしまった。',[O('来年もう一度受ける',()=>{e.done=0;e.left=1;return 'もう一年、勉強に専念する。';}),O('医師をあきらめて就職する',()=>{S.queue.unshift(evOffers('就職活動をした。',true));return null;})]);}
  const ops=[O('就職活動をする',()=>{S.queue.unshift(evOffers(`${e.n}を卒業。就職活動の結果は……`,true));return null;}),
    O('大学院に進む',()=>{S.edu={n:'大学院',left:2,cost:60,kind:'uni'};S.queue.unshift(evPayEdu(60,2,'大学院'));mod({study:4});return '大学院に進んだ。';},'2年',e.kind==='uni'),
    O('司法試験を目指す',()=>{S.flags.lawStudy=1;S.job={id:'none',salary:0,years:0};return '法科大学院を経て、司法試験を目指す。';},'学力75以上',e.kind==='uni'&&S.st.study>=75),
    O('公務員試験を受ける',()=>{if(S.st.study+R()*25>60){setJob(S.st.health>=60&&chance(.3)?'police':'koumuin');S.mood='happy';return '公務員試験に合格した。';}setJob('freeter');return '公務員試験に落ちた。バイトをしながら来年を目指す。';}),
    O('就職せずに起業する',()=>{S.company={value:500,eq:.8,yrs:0};setJob('ceo',120);log('卒業と同時に起業');return '仲間と会社を立ち上げた。'+infoLink('kigyo');}),
    O('就職せずにフリーターになる',()=>{setJob('freeter');return 'とりあえずバイトを続ける。';})];
  return E('就職',`${e.n}を卒業する年になった。`,ops);}});
D('lawexam',{a:[23,32],m:true,c:()=>S.flags.lawStudy&&!S.lics.law,mk:()=>E('司法試験','司法試験の結果発表。',[
  O('結果を見る',()=>{if(S.st.study+R()*35>95){S.lics.law=1;S.flags.lawStudy=0;setJob('lawyer');S.mood='happy';log('司法試験に合格');return '合格していた！ 弁護士への道が開けた。';}mod({mental:-8});if(S.age>=30){S.flags.lawStudy=0;S.queue.push(evOffers('司法試験をあきらめ、就職活動をした。',false));return '不合格。もうあきらめることにした。';}return '不合格。来年もう一度挑戦する。';})])});
// =====================================================================
// 社会人（20〜59）
// =====================================================================
function genPartner(venue,premium){
  const sx=S.sex==='M'?'F':'M';
  const myRank=Math.round((S.st.charm+S.st.comm)/45+(grossNow()>600?1:0));
  const rank=clamp(+wpick({0:8,1:20,2:45,3:20,4:7})+(premium?1:0)+(myRank>=3?1:myRank<=1?-1:0),0,4);
  const jobs=[['フリーター','派遣社員','無職'],['介護職','販売員','配送ドライバー'],['会社員','看護師','公務員','保育士'],['大手企業の会社員','医師','外資系社員'],['会社経営者','弁護士','資産家の跡取り']];
  const job=pick(jobs[rank]);const inc=[150,280,380,650,1200][rank]*(.8+R()*.4);
  const pers=pick(['優しい','優しい','倹約家','浪費家','気が強い','家庭的','仕事人間','浮気性','ギャンブル好き','寂しがり屋']);
  const age=clamp(S.age+Math.floor(R()*9)-4,18,90);
  return {name:pname(sx),sex:sx,age,look:newLook(sx),job,income:Math.round(inc),rank,pers,close:50,yrs:0,venue,of:rank>=3?'suit':'casual',cap:[260,400,700,1600,3000][rank],gr:[2,5,8,20,40][rank]};
}
function evMeet(venue,premium){const p=genPartner(venue,premium);return E('出会い',`${venue}で、${p.name}（${p.age}歳）と出会った。<br>職業：${p.job}／年収 約${yen(p.income)}<br>実家：${RANKS[p.rank]}／性格：${p.pers==='浮気性'||p.pers==='ギャンブル好き'?'？？？':p.pers}`,[
  O('猛アタックする',()=>{if(S.st.charm*.5+S.st.comm*.5+R()*50>55+p.rank*6){S.partner=p;p.close=60;log(p.name+'と付き合う');S.mood='happy';return `${p.name}と付き合うことになった。`;}mod({mental:-4});return 'やんわりと断られた。';}),
  O('ゆっくり距離を縮める',()=>{if(S.st.comm+R()*50>45+p.rank*5){S.partner=p;p.close=55;log(p.name+'と付き合う');return `何度か食事に行き、自然と付き合うことになった。`;}return '友達のまま、連絡が途絶えた。';}),
  O('条件をしっかり確認してから',()=>{p.pers==='浮気性'||p.pers==='ギャンブル好き'?null:null;return `よく話を聞いてみると、${p.name}は「${p.pers}」な人らしい。${p.pers==='浮気性'||p.pers==='ギャンブル好き'?'やめておいた。':'また会う約束をした。'}`+(p.pers!=='浮気性'&&p.pers!=='ギャンブル好き'&&chance(.6)?(S.partner=p,log(p.name+'と付き合う'),'<br>そして付き合うことになった。'):'');}),
  O('今は恋愛より仕事',()=>'連絡先だけ交換した。')],W(p));}
D('meet',{a:[18,65],w:6,cd:2,c:()=>!S.partner&&!S.spouse,mk:()=>evMeet(pick(['友人の誕生日パーティー','職場の飲み会','行きつけのカフェ','マッチングアプリ','趣味のサークル','友人の結婚式の二次会']))});
D('partner_fight',{a:[18,70],w:4,cd:2,c:()=>S.partner&&S.partner.yrs>=1,mk:()=>{const p=S.partner;return E('恋人',`${p.name}と大げんかした。「仕事と私、どっちが大事なの？」`,[
  O('休みを取って旅行に連れていく',()=>{pay(15,'旅行');p.close+=25;return '箱根で二泊した。また笑い合えた。';}),
  O('とことん話し合う',()=>{p.close+=S.st.comm>=50?18:5;return '朝まで話し合った。';}),
  O('仕事を優先する',()=>{p.close-=25;return 'すれ違いが増えていく。';}),
  O('別れを切り出す',()=>{S.exes.push(p.name);S.partner=null;mod({mental:-6});return '別々の道を歩くことにした。';})],W(p));}});
D('propose',{a:[20,70],w:6,cd:2,c:()=>S.partner&&S.partner.yrs>=1&&S.partner.close>=50,mk:()=>{const p=S.partner;return E('結婚',`付き合って${p.yrs}年。${p.name}との将来を考える時が来た。`,[
  O('夜景の見えるレストランでプロポーズ',()=>{pay(Math.min(S.cash,40),'婚約指輪');if(p.close+R()*35>60){marry();return `${p.name}は泣きながら「はい」と言った。`;}S.exes.push(p.name);S.partner=null;mod({mental:-15});S.mood='sad';return '「ごめん、まだ考えられない」。そのまま別れることになった。';}),
  O('家でさりげなくプロポーズ',()=>{if(p.close+R()*30>58){marry();return `${p.name}は笑って「やっと？」と言った。`;}p.close-=10;return 'はぐらかされた。';}),
  O('同棲から始める',()=>{p.close+=8;S.flags.dousei=1;return '一緒に暮らし始めた。家賃が少し浮いた。';}),
  O('結婚はしないでこのままでいる',()=>{p.close-=8;return '今の関係のままでいることにした。';}),
  O('別れる',()=>{S.exes.push(p.name);S.partner=null;mod({mental:-8});return '別れることにした。';})],W(p));}});
function marry(){
  const p=S.partner;if(!p)return;if(!isFinite(p.income)||p.rank==null){const g=genPartner('',false);for(const k of ['income','rank','cap','gr','job','of'])if(p[k]==null||p[k]==='学生'||(k==='income'&&!isFinite(p.income)))p[k]=g[k];}S.spouse=Object.assign(p,{years:0,work:true,close:Math.max(65,p.close)});S.partner=null;log(p.name+'と結婚');S.mood='happy';
  if(['share','suburb','adachi','normal','jikka','publ'].includes(S.home)&&!S.house)S.home=p.rank>=3?'fam_23':'fam_sub';
  S.queue.unshift(E('結婚式','結婚式はどうする？',[
    O('式は挙げない（入籍だけ）',()=>'二人で区役所に婚姻届を出しに行った。'),
    O('家族だけで小さな式',()=>{pay(60,'結婚式');mod({mental:6});return '家族だけのあたたかい式になった。';},'60万円'),
    O('みんなを招いて盛大に',()=>{pay(150,'結婚式（ご祝儀差し引き）');friends().forEach(f=>f.close+=10);mod({mental:12});return '友人たちに祝福され、最高の一日になった。';},'350万円（ご祝儀で約200万円戻る）'),
    O('海外でリゾート婚',()=>{pay(250,'海外挙式');mod({mental:15});return 'ハワイの教会で式を挙げた。';},'250万円')]));
  S.queue.unshift(E('結婚',`${p.name}は結婚後も働く？`,[
    O('共働きを続ける',()=>`共働きで、家事も分担することにした。`,`相手の年収 約${yen(p.income)}`),
    O('相手が家庭に入る',()=>{S.spouse.work=false;return '家庭に入ってもらうことにした。';}),
    O('自分が家庭に入る',()=>{setJob('none');S.flags.shufu=1;return '自分が仕事を辞め、家庭に入ることにした。';})],W(p)));
  if(p.rank>=4)S.queue.push(E('両家顔合わせ',`${p.name}の実家は大きな家だった。義父が「家を買うなら援助しよう」と言う。`,[O('ありがたく受け取る',()=>{gain(1500,'義実家からの援助');return '1,500万円を援助してもらった。';}),O('自分たちの力でやると断る',()=>{mod({moral:4});return '義父は「頼もしいな」と笑った。';})]));
  if(p.rank===0)S.queue.push(E('両家顔合わせ',`${p.name}の親には借金があるらしい。「少しでいいから助けてほしい」と頼まれた。`,[O('200万円を援助する',()=>{pay(200,'義実家への援助');p.close+=15;return '義理の親が何度も頭を下げた。';}),O('断る',()=>{p.close-=15;return '断った。妻（夫）は黙っていた。';})]));
}
function momAge(){return S.sex==='F'?S.age:S.spouse?S.spouse.age:S.age;}
D('baby_plan',{a:[18,70],m:true,c:()=>{if(!S.spouse||S.flags.noKids||S.flags.tryBaby||S.kids.length>=6)return false;const ma=momAge();if(ma<22||ma>42)return false;return S.flags.babyAskAge==null||S.age>=S.flags.babyAskAge;},mk:()=>{const ma=momAge();const n=S.kids.length;S.flags.babyAskAge=S.age+(n?2:1);return E('家族',`${S.spouse.name}と、${n?`${n+1}人目`:'子ども'}のことを話し合った。${S.sex==='F'?'あなた':S.spouse.name}は${ma}歳。${ma>=35?'「高齢出産」と呼ばれる年齢だ。':''}${infoLink('kyoiku')}`,[
  O(n?'もう一人産もう':'子どもを産もう',()=>{S.flags.tryBaby=1;S.spouse.close+=5;return '二人で決めた。';}),
  O('不妊治療を受ける',()=>{S.flags.tryBaby=1;S.flags.ivf=1;pay(S.age>=43?80:30,'不妊治療（保険適用外分を含む）');mod({mental:-4});return '病院に通い始めた。2022年から不妊治療は保険が使えるようになった。';},'年30〜80万円',ma>=30),
  O('お金が貯まるまで待つ',()=>{S.flags.babyAskAge=S.age+2;return '貯金が300万円を超えたら、と決めた。';}),
  O('仕事が落ち着いてから',()=>{S.flags.babyAskAge=S.age+3;S.job.salary+=5;return '数年はキャリアを優先することにした。';}),
  O('相手の気持ちに任せる',()=>{if(chance(S.spouse.pers==='家庭的'||S.spouse.pers==='優しい'?.7:.4)){S.flags.tryBaby=1;return `${S.spouse.name}は「欲しい」と言った。`;}S.flags.babyAskAge=S.age+2;return `${S.spouse.name}は「まだいい」と言った。`;}),
  O(n?'子どもはもう十分':'子どもは持たない',()=>{S.flags.noKids=1;return n?'これ以上は増やさないことにした。':'二人で生きていくことにした。';})],W(S.spouse));}});
D('dekichatta',{a:[16,40],w:2,cd:6,c:()=>S.partner&&!S.spouse&&!S.partner.preg&&momAge()>=16&&momAge()<=42&&chance(.18),mk:()=>{const p=S.partner;p.preg=1;const me=S.sex==='F';return E('妊娠',me?`妊娠検査薬に、くっきりと線が出た。${p.name}にはまだ言っていない。`:`${p.name}から「妊娠したみたい」と告げられた。`,[
  O('結婚して、産む',()=>{marry();S.flags.tryBaby=0;const k=newKid();k.age=-1;S.kids.push(k);log('授かり婚');S.mood='happy';return '授かり婚をした。周りは驚いたが、祝ってくれた。';}),
  O(me?'結婚はせず、一人で産んで育てる':'認知して、養育費を払う',()=>{const k=newKid();k.age=-1;k.single=1;if(me){S.kids.push(k);S.exes.push(p.name);S.partner=null;S.flags.singleMom=1;mod({mental:-6});log('シングルマザーになる');return 'ひとりで育てると決めた。児童扶養手当の申請書をもらってきた。';}k.away=true;k.indep=false;S.kids.push(k);S.yoiku=(S.yoiku||0)+36;S.exes.push(p.name);S.partner=null;return '結婚はしなかった。毎月3万円の養育費を払うことになった。';}),
  O('二人でよく話し合い、産まないことを選ぶ',()=>{pay(15,'手術費用');mod({mental:-12});p.close-=10;return 'つらい決断だった。しばらく二人とも口数が少なかった。';}),
  O(me?'相手の親に相談する':'逃げる',()=>{if(me){if(chance(.5)){marry();const k=newKid();k.age=-1;S.kids.push(k);return '相手の親が強く背中を押し、結婚することになった。';}S.exes.push(p.name);S.partner=null;const k=newKid();k.age=-1;S.kids.push(k);S.flags.singleMom=1;return '相手は消えた。ひとりで産むことになった。';}S.exes.push(p.name);S.partner=null;S.yoiku=(S.yoiku||0)+36;mod({moral:-20});return '連絡を絶った。数年後、家庭裁判所から養育費の請求が届いた。';})],W(p));}});
D('ikukyu',{a:[20,55],m:true,c:()=>S.kids.some(k=>k.age===0&&!k.ikq)&&['正社員','公務員','専門職'].includes(J().cat),mk:()=>{const k=S.kids.find(k=>k.age===0&&!k.ikq);k.ikq=1;return E('育休',`${k.name}が生まれた。育休を取る？`,[
  O('1年しっかり取る',()=>{S.job.salary*=.97;k.close+=20;if(S.spouse)S.spouse.close+=15;mod({mental:5});return '育休を1年取った。毎日が子どもの成長でいっぱいだった。';}),
  O('1か月だけ取る',()=>{k.close+=8;if(S.spouse)S.spouse.close+=5;return '1か月だけ育休を取った。';}),
  O('仕事を優先する',()=>{if(S.spouse)S.spouse.close-=12;S.job.salary+=10;return '育休は取らなかった。';})],W(Object.assign({},k,{age:0})));}});
D('hoikuen_ochi',{a:[20,55],m:true,c:()=>S.kids.some(k=>k.age===1&&!k.hoiku)&&S.spouse&&S.spouse.work,mk:()=>{const k=S.kids.find(k=>k.age===1&&!k.hoiku);k.hoiku=1;if(chance(.55))return null;return E('保育園',`${k.name}の保育園に落ちた。待機児童だ。`,[
  O('認可外保育園に預ける',()=>{pay(60,'認可外保育園');return '月5万円の認可外保育園に預けた。';}),
  O('配偶者が仕事を辞める',()=>{S.spouse.work=false;return '配偶者が仕事を辞めた。';}),
  O('自分の親に頼る',()=>{livingParents().forEach(p=>p.close+=10);return '親が毎日来てくれることになった。';},'',livingParents().length>0),
  O('育休を延長する',()=>{S.job.salary*=.95;return '育休を延長した。';})]);}});
D('kid_school',{a:[22,70],m:true,c:()=>S.kids.some(k=>k.age===6&&!k.schoolSet),mk:()=>{const k=S.kids.find(k=>k.age===6&&!k.schoolSet);k.schoolSet=1;return E('子ども',`${k.name}が小学生になる。`,[
  O('近所の公立小学校',()=>'近所の公立小学校に通う。'),
  O('私立小学校を受験させる',()=>{pay(80,'受験準備');if(k.st.study+R()*40>40){k.priv=1;kidMod(k,{study:6});return '私立小学校に合格した。';}return '不合格。公立に通う。';},'受験準備で約80万円'),
  O('習い事をたくさんさせる',()=>{pay(30,'習い事');kidMod(k,{study:3,health:3});return 'スイミング、ピアノ、英語。週5日の習い事。';}),
  O('のびのび育てる',()=>{kidMod(k,{mental:6});return '放課後は友達と走り回っている。';})],W(k));}});
D('kid_juken',{a:[25,75],m:true,c:()=>S.kids.some(k=>k.age===10&&!k.jk),mk:()=>{const k=S.kids.find(k=>k.age===10&&!k.jk);k.jk=1;return E('子どもの受験',`${k.name}が10歳になった。周りの子は中学受験の塾に通い始めている。${infoLink('juken')}`,[
  O('中学受験させる',()=>{k.juku=1;k.priv=1;kidMod(k,{study:10,mental:-6});return `${k.name}は週5日、塾に通い始めた。`;},'塾代と私立の学費で数百万円'),
  O('本人に決めさせる',()=>{if(k.st.study>=50){k.juku=1;k.priv=1;kidMod(k,{study:8});return `${k.name}は自分から「受験したい」と言った。`;}kidMod(k,{mental:4});return `${k.name}は地元の中学に行きたいと言った。`;}),
  O('地元の公立中学に進ませる',()=>{kidMod(k,{mental:3});return '地元の公立中学に進む。';}),
  O('スポーツや芸術を伸ばす',()=>{kidMod(k,{health:8,mental:4});if(['sport','music','art'].includes(k.st.talent))kidMod(k,{study:2});return '好きなことに打ち込ませることにした。';})],W(k));}});
D('kid_trouble',{a:[25,80],w:5,cd:3,c:()=>S.kids.some(k=>k.age>=12&&k.age<=18&&!k.indep),mk:()=>{const k=pick(S.kids.filter(k=>k.age>=12&&k.age<=18&&!k.indep));const t=pick(['夜遊び','反抗','いじめ','不登校','恋愛','進路']);
  const txt={夜遊び:`${k.name}が深夜になっても帰ってこない。`,反抗:`${k.name}が「うるせえ、ほっとけよ」と言って部屋にこもった。`,いじめ:`${k.name}が学校でいじめられているらしい。`,不登校:`${k.name}が「学校に行きたくない」と言い出した。`,恋愛:`${k.name}に恋人ができたらしい。成績が下がっている。`,進路:`${k.name}が「大学には行かない。○○になりたい」と言い出した。`}[t];
  return E('子ども',txt,[
   O('頭ごなしに叱る',()=>{k.close-=12;kidMod(k,{moral:3,mental:-6});return '家の中が冷え込んだ。';}),
   O('じっくり話を聞く',()=>{k.close+=12;kidMod(k,{mental:6,moral:3});return `${k.name}がぽつりぽつりと本音を話してくれた。`;}),
   O('好きにさせる',()=>{kidMod(k,{moral:-5,mental:3});return '見守ることにした。';}),
   O('学校や専門家に相談する',()=>{pay(5,'相談');kidMod(k,{mental:5});return 'カウンセラーが間に入ってくれた。';}),
   O('配偶者に任せる',()=>{if(S.spouse)S.spouse.close-=6;k.close-=6;return '「あなたの子でもあるのに」と言われた。';},'',!!S.spouse),
   O('お小遣いで釣る',()=>{pay(5,'お小遣い');kidMod(k,{moral:-3});k.close+=4;return 'その場は収まった。';})],W(k));}});
D('kid_uni',{a:[30,85],m:true,c:()=>S.kids.some(k=>k.age===18&&!k.uniAsk),mk:()=>{const k=S.kids.find(k=>k.age===18&&!k.uniAsk);k.uniAsk=1;return E('子どもの進路',`${k.name}が18歳になった。学力は${Math.round(k.st.study)}。大学に行きたいと言っている。`,[
  O('学費を全額出す',()=>{k.uni=1;kidMod(k,{study:5});return `${k.name}の学費を出すことにした。`;},'4年で数百万円'),
  O('一人暮らしの費用まで出す',()=>{k.uni=2;kidMod(k,{study:5,mental:4});return `${k.name}は大学近くで一人暮らしを始めた。`;},'年200万円ほど'),
  O('奨学金を借りてもらう',()=>{kidMod(k,{study:4});k.close-=5;return `${k.name}は奨学金を借りて進学した。`;}),
  O('就職してほしい',()=>{k.close-=10;kidMod(k,{study:-5});return `${k.name}は就職することになった。`;})],W(k));}});
D('kid_money',{a:[45,95],w:3,cd:5,c:()=>S.kids.some(k=>k.indep&&k.alive!==false),mk:()=>{const k=pick(S.kids.filter(k=>k.indep&&k.alive!==false));const big=k.tier>=3;return E('子ども',big?`${k.name}から「お父さん（お母さん）に家をリフォームしてあげたい」と連絡があった。`:`${k.name}から「ちょっとお金を貸してくれない？」と連絡があった。`,big?[
  O('ありがたく受ける',()=>{gain(200,`${k.name}からの援助`);k.close+=5;S.mood='happy';return '立派になったものだと思った。';}),
  O('気持ちだけ受け取る',()=>{k.close+=10;return '「元気でいてくれればいい」と伝えた。';})]:[
  O('100万円を貸す',()=>{pay(100,`${k.name}に貸す`);k.close+=10;if(chance(.5)){S.queue.push(E('子ども',`${k.name}が借りたお金を返しに来た。`,[O('受け取る',()=>{gain(100,'返済');return '律儀な子に育ったものだ。';})]));}return 'お金を貸した。';}),
  O('理由を聞いてから考える',()=>{k.close+=5;return '事情を聞くと、転職の準備資金だった。少しだけ援助した。';}),
  O('自分でなんとかしなさいと言う',()=>{k.close-=12;return '電話の向こうで黙り込んだ。';})],W(k));}});
D('affair_temp',{a:[25,65],w:2,cd:6,c:()=>S.spouse,mk:()=>{const sx=S.sex==='M'?'F':'M';const p={name:pname(sx),sex:sx,age:S.age-5,look:newLook(sx)};return E('誘惑',`職場の${p.name}から「二人で飲みに行きませんか」と誘われた。明らかに好意を感じる。`,[
  O('きっぱり断る',()=>{mod({moral:3});return '家族の顔が浮かんだ。';}),
  O('食事だけなら',()=>{if(chance(.3))return evAffairFound(false);return '何事もなく帰った。少しだけ、胸がざわついた。';}),
  O('一線を越える',()=>{mod({moral:-12,mental:4});if(chance(.5))return evAffairFound(true);S.flags.affair=1;return '秘密ができた。';})],W(p));}});
function evAffairFound(real){S.queue.unshift(E('修羅場',`${S.spouse.name}にスマホを見られた。「これ、どういうこと？」`,[
  O('土下座して謝る',()=>{S.spouse.close-=25;if(S.spouse.close<20){divorce(true);return '許してはもらえなかった。慰謝料を払い、離婚した。';}return '何とか許してもらえた。でも信頼は戻らない。';}),
  O('開き直る',()=>{divorce(true);return '離婚することになった。慰謝料も払った。';}),
  O('「誤解だ」と言い張る',()=>{if(!real&&chance(.6)){S.spouse.close-=5;return '本当に何もなかったので、信じてもらえた。';}divorce(true);return '嘘はばれた。離婚することになった。';})],W(Object.assign({},S.spouse,{_mood:'angry'}))));return '帰り道、背中に視線を感じた。';}
D('spouse_affair',{a:[25,70],w:2,cd:5,c:()=>S.spouse&&(S.spouse.pers==='浮気性'||S.spouse.close<30),mk:()=>{const sp=S.spouse;return E('家庭',`${sp.name}の様子がおかしい。スマホを肌身離さず持ち歩き、帰りも遅い。`,[
  O('問い詰める',()=>{if(sp.pers==='浮気性'||chance(.4)){S.queue.unshift(E('家庭',`${sp.name}の浮気が発覚した。`,[O('離婚して慰謝料を請求する',()=>{divorce(false);gain(200,'慰謝料');return '離婚した。';}),O('やり直す',()=>{sp.close=40;sp.pers='優しい';mod({mental:-10});return '一度だけ、やり直すことにした。';}),O('見なかったことにする',()=>{mod({mental:-15});return '何も言わずに暮らし続けた。';})],W(sp)));return '問い詰めた。';}sp.close-=10;return '「疑うなんてひどい」と泣かれた。仕事が忙しかっただけらしい。';}),
  O('探偵を雇う',()=>{pay(50,'探偵費用');if(sp.pers==='浮気性'||chance(.4)){divorce(false);gain(300,'慰謝料');return '証拠をそろえて離婚し、慰謝料を受け取った。';}return '調べたが、何も出てこなかった。';}),
  O('信じて何もしない',()=>{return '何も聞かなかった。';})],W(sp));}});
function divorce(myFault){const sp=S.spouse;const hc=Math.max(0,S.cash*.5),hn=S.nisa.v*.5;S.nisa.v-=hn;S.nisa.basis*=.5;pay(hc,'財産分与');if(hn>0)row('財産分与（NISA分）',-hn);if(myFault)pay(Math.min(Math.max(0,S.cash),300),'慰謝料');log(sp.name+'と離婚');S.exes.push(sp.name);
  const kids=S.kids.filter(k=>!k.indep&&k.alive!==false);
  if(kids.length){S.queue.unshift(E('親権','子どもの親権はどうする？',[O('自分が引き取る',()=>{if(sp.work)S.yoikuIn=kids.length*40;return '子どもは自分が育てることになった。';}),O('相手に任せる',()=>{kids.forEach(k=>{k.away=1;k.close-=25;});S.yoiku=kids.length*48;return '子どもとは月に一度会うことになった。養育費を払う。';})]));}
  S.spouse=null;S.flags.divorced=1;mod({mental:-20});S.mood='sad';if(S.home==='fam_23'||S.home==='fam_sub')S.home='normal';}
D('jobwork',{a:[22,60],w:5,cd:2,c:()=>['正社員','公務員','専門職'].includes(J().cat),mk:()=>pick([
  ()=>E('職場','上司に、取引先との飲み会に毎週付き合えと言われる。',[O('毎回付き合う',()=>{S.vice.drink+=8;mod({health:-4,comm:4});S.job.salary+=10;return '上司に気に入られた。';}),O('たまに断る',()=>'ほどほどに付き合うことにした。'),O('一切行かない',()=>{S.job.salary-=5;mod({mental:3});return '評価は少し下がった。';})]),
  ()=>E('職場','同期が先に課長に昇進した。',[O('悔しさをバネに働く',()=>{S.effort=2;mod({skill:4,mental:-3});return 'がむしゃらに働いた。';}),O('素直に祝う',()=>{friends().forEach(f=>{if(f.rel==='職場の同僚')f.close+=8;});return '同期と飲みに行った。';}),O('転職を考え始める',()=>{S.queue.push(evOffers('転職エージェントに登録して、何社か受けた。',false));return null;})]),
  ()=>E('職場','新しい上司が、毎日のように皆の前で怒鳴る。',[O('耐える',()=>{mod({mental:-14});return '黙って耐える日々。';}),O('人事に相談する',()=>{if(S.st.comm>=50){mod({mental:5});return '上司は異動になった。';}mod({mental:-5});return '何も変わらなかった。';}),O('録音して労基署に行く',()=>{mod({moral:4});if(chance(.6))return '会社に指導が入り、上司は処分された。';return '「証拠が足りない」と言われた。';}),O('会社を辞める',()=>{setJob('none');S.unemp=grossNow()*.5;mod({mental:10});return '辞表を出した。失業保険をもらいながら次を探す。';})]),
  ()=>E('職場','大きなプロジェクトのリーダーに指名された。',[O('引き受ける',()=>{if(S.st.skill+S.st.comm+R()*40>100){S.job.salary+=40;S.flags.manager=1;log('プロジェクトを成功させ昇進');return 'プロジェクトは大成功。昇進が決まった。';}mod({mental:-10});return 'プロジェクトは失敗した。責任を問われた。';}),O('辞退する',()=>'今は荷が重いと断った。')]),
  ()=>E('職場','会社が副業を解禁した。',[O('Webライターを始める',()=>{S.side+=30+S.st.skill*.5;mod({skill:3});return '副業を始めた。';}),O('せどり（転売）をする',()=>{S.side+=chance(.5)?60:-10;return '転売を始めた。';}),O('動画投稿を始める',()=>{S.flags.sideSNS=1;S.followers=(S.followers||0)+3;return '週末に動画を撮り始めた。';}),O('本業に集中する',()=>'本業に集中することにした。')])])()});
D('promotion',{a:[30,58],w:4,cd:4,c:()=>['正社員','公務員'].includes(J().cat)&&S.job.years>=5&&!S.flags.manager&&S.st.skill+S.st.comm>=90,mk:()=>E('昇進','上司に呼ばれた。「来期から課長をやってくれないか」',[
  O('引き受ける',()=>{S.job.salary+=90;S.flags.manager=1;log('管理職に昇進');S.mood='happy';return '管理職になった。責任も残業も増えた。';},'年収アップ・ストレス増'),
  O('断る',()=>'今のポジションのままでいい。')])});
D('tenkin',{a:[25,55],w:2,cd:8,c:()=>['maker','bank','shosha','ad'].includes(S.job.id),mk:()=>E('辞令','大阪支社への転勤の内示が出た。',[
  O('単身赴任で行く',()=>{S.job.salary+=60;if(S.spouse)S.spouse.close-=15;S.kids.forEach(k=>k.close-=10);pay(30,'単身赴任費');return '週末だけ東京に帰る生活が始まった。';},'',!!S.spouse),
  O('家族で引っ越す',()=>{S.job.salary+=60;S.flags.leftTokyo=1;if(S.spouse&&S.spouse.work)S.spouse.work=false;log('大阪へ転勤');return '東京を離れ、大阪へ。';}),
  O('断る',()=>{S.job.salary-=30;return '出世コースから外れた。';}),
  O('会社を辞める',()=>{setJob('none');return '転勤を機に会社を辞めた。';})])});
D('layoff',{a:[30,62],w:4,cd:6,c:()=>(S.regime==='crash'||S.regime==='slump')&&J().cat==='正社員',mk:()=>E('リストラ','業績悪化で、会社が早期退職者を募集し始めた。',[
  O('早期退職に応じる',()=>{const g=Math.round(S.job.salary*1.5);gain(g,'割増退職金');setJob('none');S.unemp=S.job.salary*.5;return `割増退職金${yen(g)}を受け取って退職した。`;}),
  O('会社にしがみつく',()=>{if(chance(.35)){setJob('none');return '数か月後、部署ごとなくなった。';}S.job.salary*=.9;return 'なんとか残った。給料は下がった。';})])});
D('headhunt',{a:[28,55],w:3,cd:5,c:()=>S.st.skill>=70&&J().cat==='正社員',mk:()=>E('オファー','外資系企業のヘッドハンターから連絡が来た。「今の年収の1.5倍を出します」',[
  O('移籍する',()=>{S.job.salary*=1.5;S.job.years=0;mod({mental:-4});log('外資系へ転職');return '給料は跳ね上がったが、成果を求められる毎日だ。';}),
  O('今の会社に残る',()=>'今の会社に残った。')])});
D('startup_inv',{a:[24,45],w:3,cd:0,c:()=>friends().some(f=>f.trait==='野心家'),mk:()=>{const f=friends().find(x=>x.trait==='野心家');return E('誘い',`${f.name}が起業した。「一緒にやらないか。給料は下がるけど、株を渡す」`,[
  O('仲間になる',()=>{S.company={value:3000,eq:.08,yrs:0,joined:1};setJob('ceo',300);f.close+=20;log(f.name+'のスタートアップに参加');return '会社を辞めて合流した。'+infoLink('kigyo');}),
  O('出資だけする（300万円）',()=>{if(S.cash<300)return 'お金が足りなかった。';pay(300,'友人の会社に出資');S.port.ai=S.port.ai||{v:0,basis:0};S.flags.angel=1;f.close+=10;if(chance(.15)){gain(3000,'出資先が上場');return '数年後、会社は上場した。出資した株が10倍になった！';}return '応援の気持ちで出資した。';}),
  O('断る',()=>{f.close-=5;return '安定を選んだ。';})],W(f));}});
D('romance_scam',{a:[30,80],w:2,cd:8,c:()=>!S.spouse,mk:()=>E('SNS','SNSで知り合った外国人の医師と、毎日メッセージをやりとりしている。「あなたに会いに日本へ行きたい。でも渡航費が足りない」',[
  O('100万円を送る',()=>{pay(Math.min(100,Math.max(0,S.cash)),'送金');mod({mental:-15});S.mood='sad';return '送金した翌日から、連絡が一切なくなった。ロマンス詐欺だった。';}),
  O('ビデオ通話を求める',()=>'ビデオ通話を頼むと、急に連絡が途絶えた。'),
  O('ブロックする',()=>'怪しいと思ってブロックした。')])});
D('invest_scam',{a:[22,75],w:3,cd:6,c:()=>S.cash>=100,mk:()=>E('投資話','SNSで、有名な投資家を名乗る人から「月利10%の投資グループ」に招待された。',[
  O('100万円を預ける',()=>{pay(100,'投資詐欺');mod({mental:-10});S.mood='sad';return '最初の月だけ「利益」が表示された。翌月、グループは消えていた。';}),
  O('少額（10万円）で試す',()=>{pay(10,'投資詐欺');return '10万円は戻ってこなかった。授業料だと思うことにした。';}),
  O('無視する',()=>'怪しい話には乗らない。'),
  O('警察に通報する',()=>{mod({moral:3});return '通報した。同じ被害者が大勢いたらしい。';})])});
D('one_room',{a:[24,45],w:2,cd:0,c:()=>J().cat==='正社員'&&!S.reInv,mk:()=>E('勧誘','会社に不動産会社から電話。「節税になるワンルーム投資、頭金ほぼゼロで始められます」',[
  O('話を聞いて契約する',()=>{if(S.cash<100)return 'お金が足りなかった。';pay(100,'ワンルーム頭金');S.reInv={value:2200,loan:2400,pay:105,rent:96};log('投資用ワンルームを購入');return '契約した。毎月、家賃収入よりローンと管理費のほうが多い……。';}),
  O('断る',()=>'電話を切った。'),
  O('しつこいので上司に相談する',()=>'会社が電話をブロックしてくれた。')])});
D('drunk_drive',{a:[20,80],w:2,cd:5,c:()=>S.car&&S.vice.drink>=20,mk:()=>E('誘惑',`飲み会の帰り、駐車場に車を停めている。少し飲んだだけだ。${infoLink('inshu')}`,[
  O('運転して帰る',()=>{if(chance(.3)){arrest('飲酒運転');S.lic=false;S.car=null;return '検問で捕まり、免許取り消しになった。';}if(chance(.08)){mod({health:-30});pay(300,'事故の賠償');S.lic=false;return '電柱に突っ込んだ。命は助かったが、すべてを失った。';}mod({moral:-6});return '無事に帰れた。でも、ぞっとした。';}),
  O('運転代行を呼ぶ',()=>{pay(1,'運転代行');return '代行を呼んで帰った。';}),
  O('タクシーで帰る',()=>{pay(1,'タクシー代');return '車は翌日取りに来た。';})])});
D('accident',{a:[18,85],w:1,cd:8,mk:()=>{const car=S.car;return E('事故',car?'交差点で、自転車と接触事故を起こしてしまった。':'横断歩道を渡っていたら、右折してきた車にはねられた。',car?[
  O('すぐに救護して警察に通報',()=>{pay(S.ins.med?10:30,'事故の対応');mod({mental:-8});return '相手は軽いけがで済んだ。保険で対応した。';}),
  O('動揺してその場を離れる',()=>{arrest('ひき逃げ');S.lic=false;S.car=null;return '数日後、警察が来た。ひき逃げとして逮捕された。';})]:[
  O('救急車で運ばれる',()=>{mod({health:-20});if(!S.ins.med)pay(20,'治療費');gain(50,'相手の保険から賠償金');S.hosp=1;return '足を骨折し、2か月入院した。';})]);}});
D('fire_quake',{a:[18,100],w:1,cd:15,mk:()=>{const q=chance(.5);return E(q?'地震':'火事',q?'深夜、東京を大きな地震が襲った。':'隣の部屋から火が出た。',[
  O('すぐに外へ避難する',()=>{const d=S.house?S.house.value*.08:20;if(S.house)S.house.value-=d;else pay(Math.min(20,Math.max(0,S.cash)),'家財の被害');mod({mental:-6});return '命は助かった。部屋の中はめちゃくちゃになった。';}),
  O('大事なものを持ち出してから逃げる',()=>{if(chance(.25)){mod({health:-15});return '逃げ遅れて、煙を吸い込んだ。入院することになった。';}return '通帳と写真を持ち出せた。';})]);}});
D('akisu',{a:[20,90],w:1,cd:10,mk:()=>E('空き巣','旅行から帰ると、窓ガラスが割られていた。',[O('警察に届ける',()=>{pay(Math.min(15,Math.max(0,S.cash)),'盗まれた現金・品物');mod({mental:-5});return '犯人は捕まらなかった。防犯カメラをつけた。';})])});
D('reunion',{a:[25,75],w:3,cd:5,mk:()=>E('同窓会',`${S.age}歳。同窓会の案内が届いた。`,[
  O('参加する',()=>{pay(3,'同窓会');friends().forEach(f=>{if(/幼なじみ|小学校|中学|高校|地元/.test(f.rel))f.close+=15;});if(chance(.4))addPerson('friend','再会した同級生');mod({mental:5});return pick(['みんな、それぞれの人生を生きている。','あの頃好きだった人は、すっかりお母さん（お父さん）になっていた。','いじめっ子だったやつが、頭を下げてきた。']);}),
  O('見栄を張って高い服で行く',()=>{pay(15,'同窓会の服');mod({charm:3,mental:3});return '「出世したね」と言われた。';}),
  O('行かない',()=>'今年は行かなかった。')])});
D('friend_borrow',{a:[20,80],w:3,cd:6,c:()=>friends().length>0,mk:()=>{const f=pick(friends());return E('友人',`${f.name}から連絡があった。「本当に困ってて……50万円貸してくれないか」`,[
  O('貸す',()=>{pay(50,'友人に貸す');if(f.trait==='堅実'||chance(.4)){S.queue.push(E('友人',`${f.name}がお金を返しに来た。`,[O('受け取る',()=>{gain(50,'友人から返済');f.close+=15;return '友情が深まった。';})],W(f)));return '貸した。';}f.close-=10;return '貸した。それきり連絡が減っていった。';},'',S.cash>=50),
  O('半分なら貸せる',()=>{pay(25,'友人に貸す');f.close+=3;return '25万円を貸した。';},'',S.cash>=25),
  O('断る',()=>{f.close-=15;return '断った。少し気まずくなった。';}),
  O('理由をしっかり聞く',()=>{f.close+=5;return '話を聞くと、ギャンブルの借金だった。貸さずに、相談窓口を教えた。';})],W(f));}});
D('friend_wed',{a:[23,45],w:3,cd:3,c:()=>friends().length>0,mk:()=>{const f=pick(friends());return E('友人',`${f.name}から結婚式の招待状が届いた。`,[
  O('出席する（ご祝儀3万円）',()=>{pay(3,'ご祝儀');f.close+=15;if(!S.partner&&!S.spouse&&chance(.3))S.queue.push(evMeet('友人の結婚式の二次会'));return `${f.name}の晴れ姿に、少し泣いた。`;}),
  O('スピーチを引き受ける',()=>{pay(3,'ご祝儀');f.close+=25;mod({comm:3});return '会場を沸かせるスピーチをした。';}),
  O('欠席する',()=>{f.close-=10;return '仕事を理由に欠席した。';})],W(f));}});
D('kenko',{a:[30,90],w:3,cd:3,c:()=>S.st.health<40||S.age>=40,mk:()=>E('健康診断','健康診断で「要精密検査」の判定が出た。',[
  O('すぐに病院へ行く',()=>{pay(3,'精密検査');if(S.illness){S.flags.early=1;return '早めに見つかった。治療を始める。';}mod({health:5});return '大事には至らなかった。生活を見直すきっかけになった。';}),
  O('忙しいので後回し',()=>{mod({health:-6});if(chance(.3))S.illness=S.illness||'がん';return '結局、病院には行かなかった。';}),
  O('生活習慣を変える',()=>{mod({health:8});S.vice.drink=Math.max(0,S.vice.drink-15);return 'お酒を減らし、毎朝歩くようにした。';})])});
D('cancer',{a:[45,95],w:2,cd:15,c:()=>!S.illness&&chance(S.vice.smoke>=30?.35:.15),mk:()=>{S.illness='がん';log('がんと診断される');return E('告知',`医師から「がんです」と告げられた。${S.flags.early||S.flags.dockYear>=S.age-1?'幸い、早期の発見だった。':'少し進行している。'}${infoLink('hoken')}`,[
  O('標準治療（手術・抗がん剤）',()=>{pay(S.ins.med?15:60,'がんの治療費');const p=(S.flags.early?.85:.6)+(S.st.health/400);if(chance(p)){S.illness=null;mod({health:-10});log('がんを克服');return '長い治療を乗り越え、がんは消えた。';}mod({health:-20});return '治療を続けるが、思わしくない。';}),
  O('先進医療を受ける',()=>{pay(S.ins.med?50:300,'先進医療');const p=(S.flags.early?.9:.7);if(chance(p)){S.illness=null;mod({health:-5});log('がんを克服');return '最新の治療で、がんを克服した。';}mod({health:-15});return '治療を続ける。';},'300万円ほど（保険で一部カバー）'),
  O('民間療法に頼る',()=>{pay(100,'高額なサプリ・民間療法');mod({health:-20});return 'お金だけが消えていった。';}),
  O('治療せず、残りの時間を大切にする',()=>{mod({mental:10});S.flags.noTreat=1;return '家族と過ごす時間を選んだ。';})]);}});
D('mental_down',{a:[20,65],w:3,cd:5,c:()=>S.st.mental<30,mk:()=>E('心','朝、ベッドから起き上がれなくなった。何をしても涙が出る。',[
  O('心療内科に行って休職する',()=>{S.job.salary*=.9;mod({mental:25});pay(5,'通院');return '3か月休んだ。少しずつ、日常が戻ってきた。';}),
  O('仕事を辞める',()=>{setJob('none');mod({mental:20});return '仕事を辞めた。休むことにした。';}),
  O('誰にも言わず無理を続ける',()=>{mod({mental:-10,health:-10});return '限界が近い。';}),
  O('実家に帰る',()=>{S.home='jikka';mod({mental:18});return '実家で、母の作るご飯を食べた。';},'',S.fam.alive&&!S.spouse)])});
D('gamble_inv',{a:[20,80],w:1,cd:6,c:()=>friends().length>0,mk:()=>{const f=pick(friends());return E('誘い',`${f.name}に「今日、京王閣で競輪やってるから行こうぜ」と誘われた。${infoLink('keirin')}`,[
  O('行く（5万円持って）',()=>{f.close+=8;return gambleRun(5,'中穴');}),
  O('大穴一点勝負（1万円）',()=>{f.close+=8;return gambleRun(1,'大穴');}),
  O('行かない',()=>'今日はやめておいた。')],W(f));}});
D('gamble_addict',{a:[20,90],m:true,c:()=>S.flags.gamAddict&&chance(.5),mk:()=>E('依存','気がつくと、また足が競輪場に向かっていた。',[
  O('預金の1割を賭ける',()=>gambleRun(Math.max(1,S.cash*.1),'本命')),
  O('借金してでも取り返す',()=>{S.debt+=50;S.cash+=50;return gambleRun(50,'中穴');}),
  O('ぐっとこらえて帰る',()=>{mod({mental:-5});if(chance(.3)){S.flags.gamAddict=0;S.vice.gamble=20;return '帰れた。少しずつ、離れられそうな気がする。';}return 'なんとか帰った。';}),
  O('ギャンブル依存症の相談窓口へ',()=>{if(chance(.6)){S.flags.gamAddict=0;S.vice.gamble=0;log('ギャンブルをやめる');return '自助グループに通い始めた。';}return '相談したが、まだ苦しい。';})])});
D('lotto_rumor',{a:[20,95],w:2,cd:3,mk:()=>E('年末','年末ジャンボの売り場に、長い行列ができている。1等7億円。'+infoLink('takarakuji'),[
  O('10枚買う（3,000円）',()=>lotto(10)),O('100枚買う（3万円）',()=>lotto(100)),O('買わない',()=>'夢は買わなかった。')])});
D('smoke_adult',{a:[20,60],w:2,cd:0,c:()=>S.vice.smoke<30,mk:()=>E('誘い','仕事のストレスがたまっている。喫煙所に行くと、上司も同僚もみんなそこで話している。',[
  O('タバコを吸い始める',()=>{S.vice.smoke=50;mod({comm:3,health:-3});return '喫煙所の会話に入れるようになった。タバコ代は年20万円を超える。';}),
  O('吸わないが喫煙所には行く',()=>{mod({comm:2});return '受動喫煙だけは避けられなかった。';}),
  O('別のストレス発散法を探す',()=>{mod({health:2});return 'サウナにハマった。';})])});
D('drink_adult',{a:[20,70],w:2,cd:5,c:()=>S.vice.drink>=30,mk:()=>E('お酒','気がつくと毎晩、缶ビールを3本空けている。',[
  O('このまま飲む',()=>{S.vice.drink+=20;mod({health:-4});return 'お酒の量が増えていく。';}),
  O('休肝日を作る',()=>{S.vice.drink=Math.max(0,S.vice.drink-15);mod({health:3});return '週2日は飲まないことにした。';}),
  O('お酒をやめる',()=>{if(chance(.5)){S.vice.drink=0;mod({health:6});return 'きっぱりやめた。';}return '3日でまた飲んでしまった。';})])});
D('car_license',{a:[18,22],w:3,c:()=>!S.lic,mk:()=>E('免許','周りの友達が次々に運転免許を取っている。'+infoLink('menkyo'),[
  O('合宿免許で取る（25万円）',()=>{if(S.cash<25)return 'お金が足りなかった。';pay(25,'合宿免許');S.lic=true;log('運転免許を取る');if(chance(.4))addPerson('friend','合宿で知り合った友人');return '2週間の合宿で免許を取った。';}),
  O('教習所に通う（32万円）',()=>{if(S.cash<32)return 'お金が足りなかった。';pay(32,'教習所');S.lic=true;log('運転免許を取る');return '教習所に通って免許を取った。';}),
  O('親に出してもらう',()=>{famMoneyAdj(-3);S.lic=true;log('運転免許を取る');return '親が費用を出してくれた。';},'',S.fam.rank>=2&&S.fam.alive),
  O('東京には必要ない',()=>'電車があれば十分だ。')])});
D('rentup',{a:[18,90],w:3,cd:2,c:()=>!S.house&&HOMES[S.home]&&HOMES[S.home].rent>0,mk:()=>E('更新',`アパートの更新通知が届いた。家賃を月${(HOMES[S.home].rent*.06).toFixed(1)}万円上げたいという。${infoLink('rentup')}`,[
  O('受け入れる',()=>{S.rentAdd=(S.rentAdd||0)+HOMES[S.home].rent*.06;return '値上げを受け入れた。';}),
  O('交渉する',()=>{if(S.st.comm>=55)return '交渉の結果、値上げは見送りになった。';S.rentAdd=(S.rentAdd||0)+HOMES[S.home].rent*.06;return '交渉は不発だった。';}),
  O('引っ越しを考える',()=>{setTimeout(moveSheet,50);return '物件を探し始めた。';})])});
D('sibling_money',{a:[25,80],w:2,cd:8,c:()=>S.fam.sibs.some(s=>s.alive&&S.age+s.age>=20),mk:()=>{const s=pick(S.fam.sibs.filter(s=>s.alive&&S.age+s.age>=20));const lb=s.older?(s.sex==='M'?'兄':'姉'):(s.sex==='M'?'弟':'妹');return E('きょうだい',`${lb}の${s.name}から「事業が苦しいんだ。300万円だけ助けてくれ」と頼まれた。`,[
  O('300万円を出す',()=>{pay(300,`${lb}への援助`);s.close+=20;if(chance(.4)){S.queue.push(E('きょうだい',`${lb}の事業が持ち直し、借りたお金を返しに来た。`,[O('受け取る',()=>{gain(300,'返済');return '肩の荷が下りた。';})]));}return 'お金を出した。';},'',S.cash>=300),
  O('100万円だけ出す',()=>{pay(100,`${lb}への援助`);s.close+=5;return '少しだけ助けた。';},'',S.cash>=100),
  O('断る',()=>{s.close-=25;return 'それ以来、正月も顔を合わせなくなった。';})],W({look:s.look,age:S.age+s.age,sex:s.sex}));}});
D('chunen',{a:[40,55],w:3,cd:0,mk:()=>E('中年の危機','ふと、「このままでいいのか」と思う夜が増えた。',[
  O('バイクや楽器を買う',()=>{pay(80,'趣味の買い物');mod({mental:12});return '大型バイクの免許を取った。';}),
  O('転職して新しい世界へ',()=>{S.queue.push(evOffers('思い切って転職活動をした。',false));return null;}),
  O('起業する',()=>{setTimeout(bizSheet,50);return '起業の準備を始めた。';}),
  O('家族との時間を増やす',()=>{if(S.spouse)S.spouse.close+=15;S.kids.forEach(k=>k.close+=10);mod({mental:8});return '週末は家族と過ごすことにした。';}),
  O('何もしない',()=>{mod({mental:-3});return 'いつも通りの毎日が続く。';})])});
D('fire_q',{a:[30,59],m:true,c:()=>!S.flags.fireAsk&&!['無職','年金'].includes(J().cat)&&(S.cash+S.nisa.v+Object.values(S.port).reduce((s,a)=>s+a.v,0))>=yearlyExpense()*25,mk:()=>{S.flags.fireAsk=1;return E('選択',`資産が年間の生活費（約${yen(yearlyExpense())}）の25倍を超えた。働かなくても暮らせるかもしれない。${infoLink('fire')}`,[
  O('仕事を辞めてFIREする',()=>{setJob('none');S.flags.fired=1;log('FIREを達成');S.mood='happy';return '辞表を出した。もう満員電車に乗らなくていい。';}),
  O('ゆるく働きながら暮らす（サイドFIRE）',()=>{S.effort=0;S.flags.sideFire=1;return '仕事を減らし、自分の時間を増やした。';}),
  O('まだ働き続ける',()=>'まだ働くことにした。')]);}});
// =====================================================================
// 親の介護・相続
// =====================================================================
D('care',{a:[30,80],m:true,c:()=>livingParents().some(p=>p.age>=76&&!p.care)&&chance(.18),mk:()=>{const p=livingParents().find(p=>p.age>=76&&!p.care);p.care=true;const lb=p.sex==='M'?'父':'母';return E('介護',`${lb}（${p.age}歳）が倒れた。一人での生活は難しく、介護が必要になった。${infoLink('kaigo')}`,[
  O('有料老人ホームに入ってもらう',()=>{pay(Math.min(Math.max(0,S.cash),300),'入居一時金');S.careCost=(S.careCost||0)+120;S.flags.caredParent=1;return `${lb}は施設に入った。費用は自分が払う。`;},'一時金＋月10万円ほど'),
  O('特別養護老人ホームの空きを待つ',()=>{S.careCost=(S.careCost||0)+50;mod({mental:-6});S.flags.caredParent=1;return '入居まで2年待った。その間は自分が通って介護した。';}),
  O('自分の家に引き取る',()=>{S.flags.caregive=1;S.flags.caredParent=1;mod({mental:-8});if(S.spouse)S.spouse.close-=10;S.job.salary*=.85;return `${lb}と同居を始めた。仕事は減らすしかなかった。`;}),
  O(S.fam.place==='local'?'仕事を辞めて地元に帰る':'仕事を辞めて介護に専念する',()=>{setJob('none');S.flags.caredParent=1;if(S.fam.place==='local'){S.flags.leftTokyo=1;log('介護のため地元へ帰る');}mod({mental:-10});return '仕事を辞めて、介護に専念することにした。';}),
  O('きょうだいに任せる',()=>{S.fam.sibs.forEach(s=>s.close-=20);p.close-=15;mod({mental:-5});return 'きょうだいに任せた。後ろめたさが残る。';},'',S.fam.sibs.some(s=>s.alive))],W(Object.assign({},p,{_mood:'sad'})));}});
D('inherit_fight',{a:[30,95],m:true,c:()=>S.flags.inheritAsk,mk:()=>{const {lb,inh}=S.flags.inheritAsk;S.flags.inheritAsk=null;const n=S.fam.sibs.filter(s=>s.alive).length+1;const share=inh/n;
  if(n===1){gain(inh,'相続');return E('相続',`両親が遺した財産、約${yen(inh)}をすべて相続した。`,[O('受け取る',()=>'実家の片付けをしながら、子どもの頃を思い出した。')]);}
  return E('相続',`両親の遺産は約${yen(inh)}。きょうだいで分けることになった。`,[
    O('法定相続分どおりに分ける',()=>{gain(share,'相続');return `${yen(share)}を相続した。`;}),
    O('介護をした分、多くもらいたいと主張',()=>{if(S.flags.caregive||S.flags.caredParent){gain(share*1.5,'相続');S.fam.sibs.forEach(s=>s.close-=10);return '話し合いの末、多めに受け取った。';}S.fam.sibs.forEach(s=>s.close-=30);gain(share,'相続');return 'もめにもめた。きょうだいとは疎遠になった。';}),
    O('きょうだいに譲る',()=>{S.fam.sibs.forEach(s=>s.close+=20);mod({moral:5});return '自分の分は譲った。';}),
    O('弁護士を立てて争う',()=>{pay(100,'弁護士費用');gain(share*1.3,'相続');S.fam.sibs.forEach(s=>s.close=0);return '裁判の末、多くを手にした。きょうだいとの縁は切れた。';})]);}});
// =====================================================================
// 定年・年金・老後
// =====================================================================
D('teinen',{a:[60,65],m:true,c:()=>['正社員','公務員','専門職'].includes(J().cat)&&S.age===(J().ret||65)&&!S.flags.teinen,mk:()=>{S.flags.teinen=1;const tai=Math.round(Math.min(S.job.salary,1200)*clamp(S.job.years,0,38)*.09);return E('定年',`${S.age}歳。定年を迎えた。退職金は約${yen(tai)}。`,[
  O('再雇用で働き続ける',()=>{gain(tai,'退職金');const s=S.job.salary*.55;setJob('rehire',s);return '同じ会社で、嘱託として働き続ける。給料は大きく下がった。';}),
  O('完全に引退する',()=>{gain(tai,'退職金');setJob('none');log('引退');return '長い会社員生活が終わった。';}),
  O('第二の人生で起業する',()=>{gain(tai,'退職金');setTimeout(bizSheet,50);return '退職金を元手に、新しいことを始める。';}),
  O('シルバー人材センターに登録する',()=>{gain(tai,'退職金');setJob('silver');return '公園の清掃の仕事を始めた。';})]);}});
D('nenkin_start',{a:[60,75],m:true,c:()=>!S.nenkin.amount&&!S.nenkin.decided,mk:()=>{S.nenkin.decided=1;const v=a=>yen(pensionCalc(a));return E('年金',`年金をいつから受け取る？ 早めると減り、遅らせると増える。${infoLink('nenkin')}<br>国民年金 ${S.nenkin.paid}年／厚生年金 ${S.nenkin.kosei}年`,[
  O(`今すぐ（${S.age}歳から）`,()=>{S.nenkin.amount=pensionCalc(S.age);S.nenkin.start=S.age;log('年金を受け取り始める');return `年に約${yen(S.nenkin.amount)}の年金が入るようになった。`;},`年 約${v(S.age)}`),
  O('65歳から',()=>{S.nenkin.start=65;return '65歳から受け取ることにした。';},`年 約${v(65)}`,S.age<65),
  O('70歳から（42%増）',()=>{S.nenkin.start=70;return '70歳まで待つことにした。';},`年 約${v(70)}`,S.age<70),
  O('75歳から（84%増）',()=>{S.nenkin.start=75;return '75歳まで待つことにした。';},`年 約${v(75)}`,S.age<75)]);}});
D('nenkin_begin',{a:[61,80],m:true,c:()=>S.nenkin.start&&S.age===S.nenkin.start&&!S.nenkin.amount,mk:()=>{S.nenkin.amount=pensionCalc(S.nenkin.start);log('年金を受け取り始める');if(['none'].includes(S.job.id))S.job.id='pension';S.notes.push(`年金の受け取りが始まった。年に約${yen(S.nenkin.amount)}。`);return null;}});
D('rougo2000',{a:[65,66],m:true,c:()=>S.age===65,mk:()=>{const a=assetsTotal();return E('老後',`65歳。資産は約${yen(a)}、年金は年に約${yen(S.nenkin.amount||pensionCalc(65))}。${infoLink('rougo')}`,a<1000?[
  O('働き続ける',()=>{if(S.job.id==='none'||S.job.id==='pension')setJob('silver');return '体が動くうちは働くことにした。';}),
  O('生活を切り詰める',()=>{S.life=0;return '節約生活を始めた。';}),
  O('生活保護を申請する',()=>{setJob('welfare');log('生活保護を受ける');return '役所で生活保護を申請した。';},'',a<100)]:[
  O('悠々自適に暮らす',()=>{if(['none'].includes(S.job.id))S.job.id='pension';S.mood='happy';return '好きなことをして暮らす。';}),
  O('世界一周旅行に出る',()=>{pay(300,'世界一周');mod({mental:20});S.mood='happy';return '3か月かけて世界を回った。';}),
  O('子や孫のために残す',()=>{S.life=Math.min(S.life,1);return '贅沢はせず、子どもたちのために残す。';})]);}});
D('oreore',{a:[65,100],w:3,cd:5,mk:()=>{const k=S.kids.find(k=>k.indep);return E('電話',`「もしもし、俺だけど……${k?'':'（声がよく聞き取れない）'}会社のお金をなくしちゃって、今日中に300万円必要なんだ」${infoLink('sagi')}`,[
  O('すぐに振り込む',()=>{pay(Math.min(300,Math.max(0,S.cash)),'オレオレ詐欺');mod({mental:-15});S.mood='sad';return '後で本人に電話すると、何も知らなかった。詐欺だった。';}),
  O('一度切って、本人にかけ直す',()=>{mod({mental:3});return '本人は家にいた。詐欺だった。';}),
  O('警察に通報する',()=>{mod({moral:3});return '警察が受け子を捕まえた。';}),
  O('「名前を言ってみて」と言う',()=>'電話はすぐに切れた。')]);}});
D('menkyo_return',{a:[75,90],m:true,c:()=>S.lic&&S.age>=75&&!S.flags.henno,mk:()=>{S.flags.henno=1;return E('免許','子どもに「そろそろ免許を返納したら？」と言われた。',[
  O('返納する',()=>{S.lic=false;S.car=null;mod({mental:-3});return '免許を返納した。行動範囲が少し狭くなった。';}),
  O('まだ運転する',()=>{if(chance(.15)){mod({health:-15});pay(100,'事故の賠償');return 'アクセルとブレーキを踏み間違え、店に突っ込んだ。';}return 'もう少しだけ運転を続けることにした。';})]);}});
D('rojin',{a:[75,105],m:true,c:()=>S.st.health<40&&S.home!=='nursing'&&!S.flags.rojinAsk,mk:()=>{S.flags.rojinAsk=1;return E('老後','一人で暮らすのが難しくなってきた。',[
  O('有料老人ホームに入る',()=>{pay(Math.min(Math.max(0,S.cash),500),'入居一時金');S.home='nursing';S.house=null;mod({mental:-3});log('老人ホームに入る');return '老人ホームに入った。毎日、誰かと話ができる。';},'一時金＋年240万円'),
  O('子どもと同居する',()=>{const k=S.kids.find(k=>k.indep&&k.close>=40);if(k){k.close+=5;S.flags.withKid=1;mod({mental:6});return `${k.name}の家で暮らすことになった。孫の声がにぎやかだ。`;}return '頼れる子どもはいなかった。';},'',S.kids.some(k=>k.indep)),
  O('ヘルパーを頼んで自宅で暮らす',()=>{S.careCost=(S.careCost||0)+60;return '週3回、ヘルパーさんが来てくれる。';}),
  O('一人で頑張る',()=>{mod({health:-5});return 'まだ大丈夫、と自分に言い聞かせた。';})]);}});
D('yuigon',{a:[70,100],m:true,c:()=>S.age>=72&&!S.flags.yuigon&&assetsTotal()>100,mk:()=>{S.flags.yuigon=1;return E('終活','そろそろ、遺言を書いておこうか。',[
  O('子どもたちに均等に分ける',()=>{S.kids.forEach(k=>k.close+=5);return '公正証書で遺言を残した。';},'',S.kids.length>0),
  O('いちばん世話になった子に多く',()=>{return '介護してくれた子に多く残すことにした。';},'',S.kids.length>1),
  O('全額を寄付する',()=>{mod({moral:10});S.flags.kifu=1;return '恵まれない子どもたちのために寄付すると決めた。';}),
  O('配偶者にすべて残す',()=>'配偶者にすべてを残すことにした。','',!!S.spouse),
  O('遺言は書かない',()=>'なるようになる、と思った。')]);}});
D('elder_hobby',{a:[66,95],w:3,cd:3,mk:()=>E('老後','時間がたっぷりある。何をして過ごす？',[
  O('囲碁・将棋',()=>{mod({study:3,mental:5});addPerson('friend','碁会所の仲間',{age:S.age});return '碁会所に通うようになった。';}),
  O('ボランティア',()=>{mod({moral:5,mental:6});return '通学路の見守りを始めた。子どもたちに「おはよう」と言われる。';}),
  O('大学に入り直す',()=>{pay(50,'学費');mod({study:8,mental:8});return 'シニア入学で大学に通い始めた。';}),
  O('孫の世話',()=>{S.kids.forEach(k=>{if(k.grand)k.close+=10;});mod({mental:8});return '孫の送り迎えが日課になった。';},'',S.kids.some(k=>k.grand)),
  O('家でテレビを見る',()=>{mod({health:-2});return '一日中テレビを見て過ごした。';})])});
D('supple',{a:[65,100],w:2,cd:6,mk:()=>E('勧誘','健康食品の無料説明会に行ったら、「がんにも効く」というサプリを勧められた。年60万円。',[
  O('買う',()=>{pay(60,'健康食品');return '飲み続けたが、体は特に変わらなかった。';}),
  O('お試しだけ',()=>{pay(1,'お試し');return '定期購入の契約になっていて、解約に苦労した。';}),
  O('断る',()=>'断った。')])});
D('spouse_old',{a:[60,100],w:2,cd:5,c:()=>S.spouse,mk:()=>E('夫婦',`${S.spouse.name}と二人きりの夕食。会話が少なくなった。`,[
  O('二人で旅行に行く',()=>{pay(30,'夫婦旅行');S.spouse.close+=20;mod({mental:8});return '若い頃に行った場所を、もう一度訪ねた。';}),
  O('昔の写真を一緒に見る',()=>{S.spouse.close+=12;return '笑ったり、泣いたりした。';}),
  O('熟年離婚を考える',()=>{if(S.spouse.close<30){divorce(false);return '長い結婚生活に区切りをつけた。';}return '思いとどまった。';})],W(S.spouse))});
D('widow',{a:[50,100],m:true,c:()=>S.widow&&!S.flags.widowAsk,mk:()=>{S.flags.widowAsk=1;return E('喪失',`${S.widow}がいなくなった家は、静かすぎる。`,[
  O('子どもの近くに引っ越す',()=>{S.kids.forEach(k=>k.close+=8);return '子どもの家の近くに引っ越した。';},'',S.kids.some(k=>k.indep)),
  O('趣味の仲間と過ごす',()=>{addPerson('friend','趣味の仲間',{age:S.age});mod({mental:8});return '週に一度、仲間とお茶をするようになった。';}),
  O('再婚相手を探す',()=>{S.queue.push(evMeet('シニアの婚活パーティー'));return '新しい出会いを探すことにした。';}),
  O('一人で静かに暮らす',()=>{mod({mental:-5});return '仏壇に毎朝、話しかける。';})]);}});
// =====================================================================
// 破綻・どん底
// =====================================================================
D('hellowork',{a:[19,64],m:true,c:()=>S.job.id==='none'&&!S.flags.shufu&&!S.flags.fired&&!S.flags.lawStudy&&!(S.edu&&S.edu.left>0)&&!S.used.jobhunt&&chance(.8),mk:()=>{S.used.jobhunt=1;return E('ハローワーク',`仕事がないまま${S.unempYrs=(S.unempYrs||0)+1}年目。新宿のハローワークの待合室は、平日の朝から人でいっぱいだ。`,[
  O('とにかく応募する',()=>{S.queue.unshift(evOffers('窓口で紹介された求人に応募した。結果は……',false));return null;}),
  O('職業訓練を受けてから探す',()=>{mod({skill:6,mental:3});S.unemp=Math.max(S.unemp||0,60);S.queue.unshift(evOffers('訓練を終えて、求人に応募した。',false));return '半年の職業訓練を受けた。給付金も出た。';},'学びながら給付金'),
  O('倉庫や警備の仕事でしのぐ',()=>{setJob(pick(['keibi','gig','freeter']));return '選ばなければ、仕事はあった。';}),
  O('今年は休む',()=>{mod({mental:4});return 'もう少しだけ、休むことにした。';})]);}});
// ---- どうにもならない境遇（ランダム・生まれと運しだい） ----
D('shisetsu',{a:[3,14],m:true,c:()=>!S.flags.shisetsu&&(S.flags.abused||0)>=2&&chance(.35),mk:()=>{S.flags.shisetsu=1;S.fam.rank=0;livingParents().forEach(p=>{p.left=1;p.close-=30;});log('児童養護施設で暮らすことになる');return E('保護','ある朝、児童相談所の職員が家に来た。あなたは一時保護され、そのまま児童養護施設で暮らすことになった。'+infoLink('kyoiku'),[
  O('施設の暮らしになじもうとする',()=>{mod({mental:-6,comm:3});addPerson('friend','施設の仲間',{age:S.age});return '同じ部屋の子と、少しずつ話すようになった。';}),
  O('心を閉ざす',()=>{mod({mental:-12,comm:-4});return '誰とも口をきかなかった。';}),
  O('職員の人に何でも話す',()=>{mod({mental:2,moral:3});addPerson('friend','施設の職員',{age:40});return '「いつでも聞くよ」と言ってくれる大人が、初めてできた。';})]);}});
D('shisetsu_out',{a:[18,18],m:true,c:()=>S.flags.shisetsu,mk:()=>E('18歳','18歳。施設を出る日が来た。頼れる家はない。手元にあるのは、施設で貯めたわずかなお金だけだ。',[
  O('住み込みの仕事に就く',()=>{setJob('hiyatoi');S.home='share';return '寮つきの工場に就職した。';}),
  O('給付型奨学金で大学に行く',()=>{if(S.st.study>=55){S.uni=2;S.edu={n:'大学',left:4,cost:0,kind:'uni'};setJob('student');S.baito=90;return '返さなくていい奨学金と、施設出身者の支援金で大学に進んだ。';}return '学力が足りず、奨学金の審査に落ちた。';},'学力55以上'),
  O('自立援助ホームに入る',()=>{S.home='share';mod({mental:4});S.queue.unshift(evOffers('支援員と一緒に仕事を探した。',true));return null;})])});
D('young_carer',{a:[10,17],w:3,cd:4,c:()=>livingParents().some(p=>p.ill||p.pers==='酒癖が悪い')||(S.fam.struct!=='both'&&S.fam.rank<=1),mk:()=>E('家族','親が働けなくなった。料理も洗濯も、きょうだいの世話も、気づけば全部あなたがやっている。',[
  O('家のことを優先する',()=>{mod({study:-6,mental:-8,moral:4});S.flags.carer=1;return '部活をやめた。友達と遊ぶ時間もなくなった。';}),
  O('学校の先生に打ち明ける',()=>{mod({mental:-2});if(chance(.5)){famMoneyAdj(5);return 'スクールソーシャルワーカーにつないでもらい、ヘルパーが来るようになった。';}return '「大変だね」と言われただけだった。';}),
  O('バイトで家計を支える',()=>{S.baito=Math.max(S.baito||0,40);mod({study:-4,health:-4});famMoneyAdj(4);return '学校帰りにコンビニで夜まで働いた。';},'',S.age>=15)])});
D('oya_shakkin',{a:[16,30],w:3,cd:6,c:()=>S.fam.rank<=1&&livingParents().length>0,mk:()=>{const p=pick(livingParents());return E('親の借金',`${p.sex==='M'?'父':'母'}が消費者金融で借金を重ねていたことがわかった。督促状の束が出てきた。`,[
  O('自分が肩代わりする',()=>{S.debt+=150;p.close+=10;mod({mental:-10});return '150万円の借金を背負った。';}),
  O('少しずつ援助する',()=>{pay(Math.min(Math.max(S.cash,0),40),'親への援助');mod({mental:-5});return 'できる範囲で助けた。';}),
  O('縁を切る',()=>{p.left=1;p.close-=40;mod({mental:-8});return '連絡先を消した。';}),
  O('自分の名前で借りさせられる',()=>{S.debt+=80;mod({mental:-15});S.flags.abused=(S.flags.abused||0)+1;return '断れなかった。';})]);}});
D('ochiru',{a:[18,32],w:4,cd:3,c:()=>S.sex==='F'&&hardness()>=2&&(S.cash<20||S.debt>100)&&!['fuzoku','night'].includes(S.job.id)&&!S.spouse,mk:()=>E('お金',`家賃を2か月滞納した。${S.debt>0?`借金は${yen(S.debt)}。`:''}知り合いに「稼げる店を紹介できるよ」と言われた。`,[
  O('風俗店で働く',()=>{setJob('fuzoku');mod({mental:-10});log('風俗店で働き始める');return '「少しの間だけ」と自分に言い聞かせた。';}),
  O('キャバクラで働く',()=>{setJob('night');return 'ドレスを借りて、初めて店に立った。';}),
  O('昼と夜のバイトを掛け持ちする',()=>{S.baito=Math.max(S.baito||0,120);mod({health:-10,mental:-6});return '睡眠は1日4時間になった。';}),
  O('役所の窓口で相談する',()=>{if(chance(.5)){setJob('welfare');return '生活保護が認められた。';}return '「まだ働けますよね」と言われ、追い返された。';}),
  O('実家に帰る',()=>{S.home='jikka';mod({mental:-4});return '居心地は悪いが、屋根はある。';},'',livingParents().length>0&&!S.flags.shisetsu)])});
D('yami_dm',{a:[16,40],w:2,cd:3,c:()=>(S.cash<30||S.debt>80)&&hardness()>=1&&!['yami'].includes(S.job.id),mk:()=>E('DM',`SNSに「即日5万円・ホワイト案件・誰でもOK」というDMが届いた。${S.debt>0?`借金の返済日が迫っている。`:''}`,[
  O('応募して身分証を送る',()=>{setJob('yami');S.flags.yamiTrap=1;mod({moral:-10});return '身分証を送った瞬間、「逃げたら家族に行く」と言われた。';}),
  O('怪しいので無視する',()=>'ブロックした。'),
  O('警察の相談窓口（#9110）に通報する',()=>{mod({moral:4});return '相談員に話を聞いてもらった。';})])});
D('yami_trap',{a:[16,45],w:6,cd:2,c:()=>S.flags.yamiTrap&&S.job.id!=='yami'&&!S.flags.prison,mk:()=>E('脅し','闇バイトの指示役から「また仕事だ。断ったら住所をさらす」とメッセージが来た。',[
  O('言われた通りにやる',()=>{if(chance(.45)){arrest('特殊詐欺',2);return '現場で待っていた警察官に囲まれた。';}gain(30,'出どころの言えない金');mod({mental:-12,moral:-10});return 'また一つ、戻れない場所に近づいた。';}),
  O('警察に駆け込んで保護を求める',()=>{S.flags.yamiTrap=0;mod({mental:-6,moral:6});if(chance(.3)){arrest('特殊詐欺（自首）',0);return '自首扱いになり、執行猶予がついた。';}return '警察が守ってくれた。やっと連絡が止まった。';}),
  O('スマホを捨てて引っ越す',()=>{S.flags.yamiTrap=chance(.5)?1:0;pay(30,'急な引っ越し');return S.flags.yamiTrap?'それでも、どこからか連絡は来た。':'それきり、連絡は来なくなった。';})])});
D('fuzoku_life',{a:[18,45],w:6,cd:2,c:()=>S.job.id==='fuzoku',mk:()=>E('夜','気づけば、この仕事を続けて何年かたつ。お金はあるのに、心がすり減っていく。',[
  O('昼の仕事を探す',()=>{S.queue.push(evOffers('昼の仕事に応募した。履歴書の空白をどう書くか悩んだ。',false));return null;}),
  O('お金を貯めて辞めると決める',()=>{S.flags.quitPlan=S.age+2;return '目標額を決めた。';}),
  O('ホストクラブに通う',()=>{pay(Math.max(0,Math.min(S.cash,150)),'ホストクラブ');mod({mental:6});S.oshi=1;return 'つかの間、全部忘れられた。';}),
  O('支援団体に相談する',()=>{mod({mental:8});S.queue.push(evOffers('支援団体の紹介で、仕事を探した。',false));return null;})])});
D('drug_escape',{a:[16,45],w:3,cd:4,c:()=>hardness()>=2&&S.st.mental<35&&!S.vice.drug,mk:()=>E('眠れない夜',`何日も眠れない。${S.sex==='F'?'店の先輩':'現場の先輩'}が「これ飲めば一発で楽になるよ」と、小さな錠剤を差し出してきた。`,[
  O('受け取って飲む',()=>{S.vice.drug=1;mod({mental:12,health:-8});log('薬物に手を出す');return '頭が真っ白になった。何もかもどうでもよくなった。';}),
  O('断る',()=>{mod({mental:-3});return '断った。眠れない夜は続く。';}),
  O('心療内科に行く',()=>{pay(3,'通院');mod({mental:10});return '処方された薬で、少しずつ眠れるようになった。';})])});
D('bankrupt',{a:[18,100],m:true,c:()=>S.flags.bankruptAsk,mk:()=>{S.flags.bankruptAsk=0;return E('破綻',`借金が${yen(S.debt)}に膨らんだ。もう返せる額ではない。${infoLink('kinri')}`,[
  O('自己破産する',()=>{S.debt=0;S.flags.bk=1;S.flags.bkAge=S.age;if(S.house){S.house=null;S.home='publ';}for(const k in S.port)delete S.port[k];S.car=null;log('自己破産');mod({mental:-10});S.mood='sad';return '自己破産を申し立てた。7年間はローンもカードも作れない。';}),
  O('任意整理で返していく',()=>{if(S.flags.nini){S.debt*=.9;return '二度目の任意整理は、ほとんど減らなかった。';}S.flags.nini=1;S.debt*=.6;mod({mental:-5});return '弁護士に頼んで利息をカットしてもらった。';}),
  O('親に泣きつく',()=>{if(S.fam.alive&&S.fam.rank>=2){const v=Math.min(S.debt,[0,50,300,1000,3000][S.fam.rank]);S.debt-=v;famMoneyAdj(-20);parents().forEach(p=>p.close-=10);return `親が${yen(v)}を肩代わりしてくれた。`;}return '親にも頼れなかった。';}),
  O('闇金に手を出す',()=>{S.debt+=200;S.cash+=200;mod({mental:-20});S.flags.yamikin=1;return '取り立ての電話が鳴りやまない。';})]);}});
D('homeless',{a:[18,90],m:true,c:()=>S.cash<5&&S.debt>100&&['none','neet','freeter'].includes(S.job.id)&&S.home!=='jikka'&&!S.house&&!S.flags.homeless,mk:()=>{return E('どん底','家賃を3か月滞納し、アパートを追い出された。',[
  O('ネットカフェで暮らす',()=>{S.home='netcafe';S.flags.homeless=1;log('住む家を失う');mod({mental:-15,health:-8});S.mood='sad';return '狭いブースで眠る日々が始まった。';}),
  O('生活保護を申請する',()=>{setJob('welfare');S.home='publ';S.debt=0;S.flags.homeless=1;log('生活保護を受ける');return '支援団体の人と一緒に役所に行き、生活保護を受けることになった。';}),
  O('実家に帰る',()=>{S.home='jikka';mod({mental:-8});return '頭を下げて実家に戻った。';},'',S.fam.alive),
  O('住み込みの仕事を探す',()=>{setJob('tobi',280);S.home='share';return '寮付きの建設現場で働き始めた。';})]);}});
D('netcafe_life',{a:[18,90],m:true,c:()=>S.home==='netcafe'&&chance(.6),mk:()=>E('ネットカフェ','ネットカフェ暮らしが続いている。',[
  O('日雇いで必死に働く',()=>{S.side+=120;mod({health:-6});if(S.cash+120>40){S.home='suburb';return 'お金をためて、ようやく小さな部屋を借りられた。';}return '日雇いの現場を転々とした。';}),
  O('支援団体に相談する',()=>{setJob('welfare');S.home='publ';return '生活保護を受けて、アパートに入れた。';}),
  O('何もかも嫌になる',()=>{mod({mental:-15,health:-10});return '何も考えられない日が続いた。';})])});
D('cocrisis',{a:[18,90],m:true,c:()=>S.flags.coCrisis&&S.company,mk:()=>{S.flags.coCrisis=0;return E('経営','会社の資金が底をつきそうだ。来月の給料が払えない。',[
  O('自分の預金から500万円入れる',()=>{pay(500,'会社へ貸付');S.company.value+=300;return 'なんとか危機を乗り越えた。';},'',S.cash>=500),
  O('借金して会社を守る',()=>{S.debt+=500;S.company.value+=300;return '個人で借金をして会社を守った。';}),
  O('ベンチャーキャピタルから資金調達',()=>{if(S.st.comm+R()*40>70){S.company.eq*=.7;S.company.value*=1.4;return '投資家が出資を決めた。持ち株は減ったが、会社は生き延びた。';}return '出資は断られた。';}),
  O('会社をたたむ',()=>{S.company=null;setJob('none');S.flags.coFail=1;log('会社をたたむ');S.mood='sad';return '会社をたたんだ。';})]);}});
D('ipo',{a:[22,90],w:5,cd:3,c:()=>S.company&&S.company.value>=30000,mk:()=>E('経営',`会社の企業価値が${yen(S.company.value)}と評価された。大手企業から買収の打診が来ている。`,[
  O('会社を売る（イグジット）',()=>{const g=Math.round(S.company.value*S.company.eq*.8);gain(g,'株式売却');S.company=null;setJob('none');S.flags.exit=1;log('会社を売却');S.mood='happy';return `株式を売却し、${yen(g)}を手にした。`;}),
  O('上場を目指す',()=>{if(chance(.5)){S.company.value*=1.6;log('会社が上場');return '会社が上場した！ 鐘を鳴らした。';}return '上場は延期になった。';}),
  O('まだ売らない',()=>'もっと大きくできるはずだ。')])});
D('dream30',{a:[30,30],m:true,c:()=>S.job.id==='dream',mk:()=>E('夢','30歳。客席は今日もまばらだ。同級生たちは家を買ったり、子どもが生まれたりしている。',[
  O('夢を追い続ける',()=>{mod({mental:-5});return 'まだ終われない。';}),
  O('夢をあきらめて就職する',()=>{S.queue.unshift(evOffers('夢をあきらめ、就職活動を始めた。',false));log('夢をあきらめる');return '長かった夢に区切りをつけた。';}),
  O('裏方として業界に残る',()=>{setJob('freeter',260);S.job={id:'freeter',salary:260,years:0};return '舞台の裏方として働くことにした。';})])});
D('scout',{a:[16,26],w:2,c:()=>S.st.charm>=70,mk:()=>E('スカウト','原宿を歩いていたら、芸能事務所にスカウトされた。',[
  O('事務所に入る',()=>{setJob('dream');S.dream+=30;return 'オーディションの日々が始まる。';}),
  O('レッスン料を払えば、と言われたので怪しんで断る',()=>'名刺だけもらって断った。'),
  O('断る',()=>'興味はなかった。')])});
D('sport_pro',{a:[17,22],m:true,c:()=>S.talent==='sport'&&S.st.health>=80&&!S.flags.proAsk,mk:()=>{S.flags.proAsk=1;return E('スカウト','プロチームのスカウトが、試合を見に来ていた。「うちに来ないか」',[
  O('プロになる',()=>{setJob('athlete',600);S.flags.pro=1;log('プロスポーツ選手になる');S.mood='happy';return 'プロ契約を結んだ。';}),
  O('進学・就職を優先する',()=>'夢よりも安定を選んだ。')]);}});
D('night_scout',{a:[18,28],w:2,c:()=>S.cash<30&&S.st.comm>=45,mk:()=>E('歌舞伎町','金欠でぼんやり歩いていたら「うちで働けば月100万も夢じゃないよ」と声をかけられた。',[
  O('夜の世界に入る',()=>{setJob('night');return '夜の世界に足を踏み入れた。';}),
  O('断る',()=>'断って家に帰った。')])});
D('night_trouble',{a:[18,40],w:4,cd:2,c:()=>S.job.id==='night',mk:()=>E('夜','太客から、店の外で会いたいと言われている。断れば売上は落ちる。',[
  O('会う',()=>{if(chance(.4)){mod({mental:-15});return '関係がこじれ、つきまとわれるようになった。';}gain(100,'太客の売上');return '売上が跳ね上がった。';}),
  O('断る',()=>{mod({mental:3});return '一線は守った。';}),
  O('この世界から足を洗う',()=>{S.queue.push(evOffers('夜の仕事をやめて、昼の仕事を探した。',false));return null;})])});
D('pet_life',{a:[20,95],w:2,cd:6,c:()=>S.pet,mk:()=>E('ペット',`${S.pet.name}が、最近ごはんを食べない。`,[
  O('動物病院に連れていく',()=>{pay(15,'動物病院');return '手術を受けて元気になった。';}),
  O('様子を見る',()=>{if(chance(.4)){const n=S.pet.name;S.pet=null;mod({mental:-15});S.mood='sad';return `${n}が、静かに息を引き取った。`;}return '数日後、またごはんを食べるようになった。';})])});
D('hikikomori',{a:[18,50],m:true,c:()=>S.flags.hikikomori&&S.job.id!=='neet'&&!S.flags.hikiDone&&['none','student'].includes(S.job.id),mk:()=>{S.flags.hikiDone=1;return E('部屋','気がつけば、何年も部屋から出ていない。',[
  O('このまま部屋にいる',()=>{S.job.id='neet';S.home='jikka';return '引きこもりの生活が続く。';}),
  O('支援機関に相談する',()=>{S.flags.hikikomori=0;mod({mental:8});S.queue.push(evOffers('支援を受けながら、仕事を探した。',false));return '一歩、外に出た。';}),
  O('ネットで稼ぐ',()=>{setJob('creator');return '部屋から動画を配信し始めた。';})]);}});
D('neet_out',{a:[20,70],w:4,cd:2,c:()=>S.job.id==='neet',mk:()=>E('部屋','親が「いつまでこうしているの」と泣いている。',[
  O('アルバイトを始める',()=>{setJob('freeter');S.flags.hikikomori=0;return '近所のコンビニでバイトを始めた。';}),
  O('職業訓練校に通う',()=>{mod({skill:10});setJob('freeter');return '職業訓練でパソコンを学んだ。';}),
  O('黙ってドアを閉める',()=>{mod({mental:-5});livingParents().forEach(p=>p.close-=10);return '何も言えなかった。';})])});
