// =====================================================================
// 仕事の中身を遊ぶ ― 職業ごとの出来事と、「勝負」のミニゲーム
// =====================================================================
// ---- 勝負ミニゲーム：動くカーソルを、光る枠の中で止める ----
// lv: 0〜100（スキルなど）。高いほど枠が広く、カーソルが遅い。cb(結果) 結果は 'great' | 'ok' | 'miss'
function shoubu(title,sub,lv,cb){
  lv=Math.max(0,Math.min(100,lv));
  const w=Math.round(10+lv*.22),c=RI(15,85-w);const speed=Math.max(.55,1.6-lv/110);
  const ov=document.createElement('div');ov.className='ov';ov.style.zIndex=60;
  ov.innerHTML=`<div class="sh" style="max-width:460px"><div class="hd"><span>勝負</span></div><div class="bd" style="text-align:center">
    <div style="font-size:18px;margin:6px 0">${title}</div><div class="note">${sub}</div>
    <div style="position:relative;height:34px;margin:22px 4px;background:#20232b;border:2px solid var(--ln)">
      <div style="position:absolute;left:${c}%;width:${w}%;top:0;bottom:0;background:rgba(199,249,75,.35);border-left:2px solid var(--lime);border-right:2px solid var(--lime)"></div>
      <div style="position:absolute;left:${c+w*.35}%;width:${w*.3}%;top:0;bottom:0;background:rgba(199,249,75,.6)"></div>
      <div id="sbCur" style="position:absolute;top:-6px;bottom:-6px;width:4px;background:#fff;left:0"></div></div>
    <button class="op yl" id="sbGo" style="font-size:18px">止める！</button><div id="sbRes" style="min-height:26px;margin-top:8px"></div></div></div>`;
  document.body.appendChild(ov);
  let x=0,dir=1,done=false,last=performance.now();
  const cur=ov.querySelector('#sbCur');
  const tick=t=>{if(done)return;const dt=(t-last)/1000;last=t;x+=dir*dt*100/speed;if(x>=100){x=100;dir=-1;}if(x<=0){x=0;dir=1;}cur.style.left=x+'%';requestAnimationFrame(tick);};
  requestAnimationFrame(tick);
  ov.querySelector('#sbGo').onclick=()=>{if(done)return;done=true;
    const res=x>=c+w*.35&&x<=c+w*.65?'great':x>=c&&x<=c+w?'ok':'miss';
    ov.querySelector('#sbRes').innerHTML=res==='great'?'<b style="color:var(--lime)">大成功！</b>':res==='ok'?'<b style="color:var(--gold)">成功</b>':'<b style="color:var(--red)">失敗……</b>';
    setTimeout(()=>{ov.remove();const r=cb(res);if(r){S.notes.push(r);S.lastRes=r;}render();},900);};
}
// 勝負つきの選択肢（押すとミニゲームが始まる）
function OS(label,title,sub,lv,fn,show){return O(label+'<span class="rt" style="color:var(--lime)">勝負</span>',()=>{setTimeout(()=>shoubu(title,sub,typeof lv==='function'?lv():lv,fn),50);return '';},'',show);}

const JG={
 sales:['sales','fudosan','ad','hisho'],
 craft:['chef','biyoshi','shop'],
 it:['engineer','designer'],
 care:['kaigo','nurse','hoiku','doctor','pharm'],
 public:['teacher','koumuin','police','fire'],
 elite:['bank','shosha','consul','gaishi','maker','tv','lawyer'],
 art:['creator','mangaka','dream','star','athlete'],
 field:['driver','taxi','factory','tobi','keibi'],
 part:['freeter','apparel','gig','hiyatoi'],
};
const JOBIN=g=>()=>JG[g].includes(S.job.id);
const sk=()=>S.st.skill,cm=()=>S.st.comm;
const raise=(a,b)=>{const v=RI(a,b);S.job.salary+=v;return v;};

// ---- 営業 ----
D('w_sales1',{a:[20,65],w:6,cd:4,c:JOBIN('sales'),mk:()=>E('仕事',`今期の目標まで、あと一件。大口の取引先との最終商談の日が来た。`,[
  OS('真っ向勝負で決めにいく','最終商談','相手の目を見て、ここだという瞬間に切り出せ',()=>(cm()+sk())/2,r=>{if(r==='great'){const v=raise(40,90);mod({mental:10});log('大口契約を決める');return `大口契約を決めた。社長賞をもらい、年収が${yen(v)}上がった。`;}if(r==='ok'){raise(10,25);return '条件を少し譲って、契約にこぎつけた。';}mod({mental:-8});S.job.salary*=.96;return '「今回は見送らせてください」。帰りの電車で、手が震えていた。';}),
  O('接待で落とす（自腹5万円）',()=>{pay(5,'接待');mod({health:-3});if(chance(.55)){raise(10,30);return '三次会のカラオケで、契約が決まった。';}return '飲ませるだけ飲ませて、契約は他社に取られた。';}),
  O('数字を少し盛って報告する',()=>{mod({moral:-5});if(chance(.3)){S.job.salary*=.85;mod({mental:-12});return '水増しがバレた。始末書と減給。';}return '今期はなんとかしのいだ。来期の自分に借金をした気分だ。';})])});
D('w_sales2',{a:[22,65],w:4,cd:6,c:JOBIN('sales'),mk:()=>E('仕事','上司から「客にこの商品を売れ。デメリットは聞かれたら言えばいい」と言われた。お年寄りの客には、明らかに合わない商品だ。',[
  O('指示通りに売る',()=>{raise(10,20);mod({moral:-8,mental:-5});return '成績は上がった。あのおばあさんの顔が、しばらく頭から離れなかった。';}),
  O('正直に説明して、売らない',()=>{mod({moral:6});S.job.salary*=.97;if(chance(.4)){addPerson('friend','お客さん',{age:S.age+35});return '数年後、そのお客さんが家族全員を紹介してくれた。';}return '上司ににらまれた。';}),
  O('会社の窓口に通報する',()=>{mod({moral:8,mental:-4});if(chance(.5))return '調査が入り、売り方が見直された。';S.job.salary*=.92;return '通報者が誰か、すぐに噂になった。';})])});
// ---- 職人・店 ----
D('w_craft1',{a:[20,70],w:6,cd:4,c:JOBIN('craft'),mk:()=>E('仕事',S.job.id==='biyoshi'?'有名な美容コンテストに出られることになった。':'有名なグルメ評論家が、お忍びで店に来ているらしい。',[
  OS('全力の一皿（一作）を出す','本番','手元に集中しろ。いちばんいい瞬間に止めろ',()=>sk(),r=>{if(r==='great'){const v=raise(40,100);mod({mental:12,charm:3});log('評論家に絶賛される');if(S.shop)S.shop.rep=(S.shop.rep||0)+20;return `絶賛された。予約が数か月先まで埋まり、年収が${yen(v)}上がった。`;}if(r==='ok'){raise(5,20);return '「悪くない」と書かれた。それだけで十分だった。';}mod({mental:-10});if(S.shop)S.shop.rep=(S.shop.rep||0)-10;return '「平凡」とだけ書かれた。客足が少し減った。';}),
  O('いつも通りに作る',()=>{mod({mental:2});return 'いつもの味で勝負した。評価は、まずまずだった。';})])});
D('w_craft2',{a:[20,60],w:4,cd:6,c:JOBIN('craft'),mk:()=>E('仕事','師匠が言った。「お前にはもう教えることはない。独立するか、ここに残るか、決めろ」',[
  O('独立する（開業資金300万円）',()=>{if(S.cash<300){S.debt+=300-Math.max(0,S.cash);S.cash=Math.max(0,S.cash-300);}else pay(300,'開業資金');S.job.salary*=chance(.4)?1.5:.7;mod({mental:6});log('独立して店を持つ');return '小さな店を持った。看板に、自分の名前が入っている。';}),
  O('残って店を支える',()=>{raise(10,30);addPerson('friend','師匠',{age:S.age+30,close:80});return '師匠は何も言わずに、肩をたたいた。';})])});
// ---- IT ----
D('w_it1',{a:[22,60],w:6,cd:4,c:JOBIN('it'),mk:()=>E('仕事','リリース前夜。本番環境で、原因不明のエラーが出ている。チームのみんなが、こっちを見ている。',[
  OS('自分が原因を突き止める','障害対応','ログの中から、原因の一行を見つけ出せ',()=>sk(),r=>{if(r==='great'){const v=raise(30,80);mod({mental:10,skill:3});return `原因を一発で見つけた。「神」と呼ばれ、年収が${yen(v)}上がった。`;}if(r==='ok'){mod({health:-4});return '朝の5時、なんとか直った。';}mod({mental:-10,health:-6});S.job.salary*=.95;return 'リリースは延期。お客さんに頭を下げに行った。';}),
  O('上司にエスカレーションする',()=>{mod({mental:-2});return 'ベテランが来て、30分で直した。悔しかった。';}),
  O('こっそり帰る',()=>{mod({moral:-6});if(chance(.5)){S.job.salary*=.9;return '翌朝、チャットが炎上していた。';}return '誰も気づかなかった。罪悪感だけが残った。';})])});
D('w_it2',{a:[22,55],w:4,cd:6,c:JOBIN('it'),mk:()=>E('仕事','AIが、自分の仕事の半分をこなせるようになってきた。',[
  O('AIを使いこなす側に回る',()=>{mod({study:4,skill:4});raise(20,60);return '自分の生産性は3倍になった。その分、仕事も3倍になった。';}),
  O('AIにできない仕事を探す',()=>{mod({comm:4});return '人と話す仕事に、少しずつ軸足を移した。';}),
  O('気にしない',()=>{if(chance(.3)){S.job.salary*=.85;return '翌年、チームの半分が別の部署に回された。自分も。';}return 'まだ大丈夫、と思った。';})])});
// ---- ケア ----
D('w_care1',{a:[20,70],w:6,cd:4,c:JOBIN('care'),mk:()=>E('仕事','夜勤の途中、担当している人の容体が急に変わった。',[
  OS('落ち着いて処置する','緊急対応','手を止めるな。ここだ、という瞬間に動け',()=>(sk()+S.st.mental)/2,r=>{if(r==='great'){mod({mental:12,skill:3});addPerson('friend','担当していた人の家族',{age:S.age+10});return '助かった。後日、家族が泣きながらお礼に来た。';}if(r==='ok'){mod({mental:3});return 'なんとか持ち直した。';}mod({mental:-15});return '最善を尽くした。それでも、だめだった。帰り道、ずっと空を見ていた。';}),
  O('すぐに応援を呼ぶ',()=>{mod({mental:-2});return '先輩が駆けつけて、一緒に処置した。';})])});
D('w_care2',{a:[22,65],w:5,cd:5,c:JOBIN('care'),mk:()=>E('仕事','人手が足りない。休みの日にまで電話が来る。「今日、入れない？」',[
  O('出勤する',()=>{mod({health:-5,mental:-4,moral:3});raise(3,8);return 'ありがとう、と言われる。でも、体が悲鳴を上げている。';}),
  O('断る',()=>{mod({mental:3});return '罪悪感はあった。でも、自分が倒れたら誰も守れない。';}),
  O('転職を考える',()=>{S.queue.push(evOffers('転職サイトに登録した。',false));return '求人を見始めた。';})])});
// ---- 公務 ----
D('w_public1',{a:[22,65],w:5,cd:5,c:JOBIN('public'),mk:()=>E('仕事',S.job.id==='teacher'?'保護者から、深夜にまた長文のメールが届いた。「うちの子だけ、ひいきされていない」':'窓口で、住民に怒鳴られている。こちらにはどうにもできない制度の話だ。',[
  OS('冷静に、誠実に対応する','対応','言葉を選べ。ここで間違えると、炎上する',()=>cm(),r=>{if(r==='great'){mod({mental:8,comm:3});return '最後には「わかってくれてありがとう」と言われた。';}if(r==='ok')return 'なんとか収まった。';mod({mental:-12});return '言葉を間違えた。上司と一緒に、謝罪に行くことになった。';}),
  O('上に任せる',()=>{mod({mental:-3});return '自分は、何のためにこの仕事を選んだんだろう。';})])});
D('w_public2',{a:[30,60],w:4,cd:8,c:JOBIN('public'),mk:()=>E('仕事','昇任試験の案内が来た。受かれば管理職。ただ、現場からは離れることになる。',[
  O('受ける',()=>{if(S.st.study+R()*40>70){raise(40,80);mod({mental:-3});log('管理職に昇任');return '受かった。机の上の書類が、3倍になった。';}mod({mental:-5});return '落ちた。また来年。';}),
  O('現場に残る',()=>{mod({mental:5});return '「先生」「お巡りさん」と呼ばれる仕事が、好きだった。';})])});
// ---- エリート ----
D('w_elite1',{a:[24,60],w:6,cd:4,c:JOBIN('elite'),mk:()=>E('仕事','役員の前で、社運をかけたプロジェクトのプレゼンをすることになった。',[
  OS('自分がプレゼンする','役員プレゼン','一番大事な数字を言う瞬間で止めろ',()=>(cm()+S.st.study)/2,r=>{if(r==='great'){const v=raise(80,200);log('役員プレゼンで大成功');mod({mental:10});return `プロジェクトが通った。抜擢され、年収が${yen(v)}上がった。`;}if(r==='ok'){raise(20,50);return '条件つきで通った。';}mod({mental:-12});S.job.salary*=.95;return '途中で頭が真っ白になった。プロジェクトは別のチームに回された。';}),
  O('同期に手柄を譲る',()=>{const f=addPerson('friend','会社の同期',{close:75});return `${nm1(f.name)}は、ずっと恩に着ると言った。`;})])});
D('w_elite2',{a:[28,60],w:4,cd:6,c:JOBIN('elite'),mk:()=>E('仕事','海外赴任の打診が来た。シンガポールに3年。給料は1.5倍。',[
  O('行く',()=>{S.job.salary*=1.5;mod({study:5,skill:4});if(S.spouse)S.spouse.close-=10;friends().forEach(f=>f.close-=10);log('海外赴任');return '赤道の近くで、3年を過ごした。日本の友達とは、少し疎遠になった。';}),
  O('家族の事情で断る',()=>{S.job.salary*=.97;if(S.spouse)S.spouse.close+=6;return '出世は少し遠のいた。';})])});
// ---- 表現 ----
D('w_art1',{a:[18,60],w:6,cd:4,c:JOBIN('art'),mk:()=>E('仕事','大きなチャンスが来た。これを逃せば、次はいつ来るかわからない。',[
  OS('全てを懸けて挑む','本番','一番いい瞬間をつかめ',()=>sk(),r=>{if(r==='great'){const v=raise(100,400);S.followers=(S.followers||0)*1.5+5;log('大舞台で成功');mod({mental:15,charm:4});return `大成功だった。名前が一気に知られ、年収が${yen(v)}上がった。`;}if(r==='ok'){raise(10,40);return '手ごたえはあった。少しずつ、仕事が増えた。';}mod({mental:-15});return '頭が真っ白になった。チャンスは、通り過ぎていった。';}),
  O('今回は見送る',()=>{mod({mental:-3});return 'まだ準備ができていない、と自分に言い聞かせた。';})])});
D('w_art2',{a:[18,50],w:4,cd:6,c:JOBIN('art'),mk:()=>E('仕事','SNSで、作品が一部の人に激しく叩かれている。',[
  O('反論する',()=>{if(chance(.4)){S.followers=(S.followers||0)*1.2;return '反論が逆に話題になって、ファンが増えた。';}mod({mental:-12});return '火に油を注いだ。';}),
  O('黙って作り続ける',()=>{mod({skill:3,mental:-4});return '一か月後、誰も覚えていなかった。';}),
  O('しばらくSNSを休む',()=>{mod({mental:5});return 'スマホを置いたら、作品のことを考える時間が増えた。';})])});
// ---- 現場 ----
D('w_field1',{a:[18,70],w:6,cd:4,c:JOBIN('field'),mk:()=>E('仕事',S.job.id==='driver'||S.job.id==='taxi'?'雪の夜。ハンドルが取られる。前の車が急ブレーキを踏んだ。':'高所での作業中、足場がぐらりと揺れた。',[
  OS('とっさに対応する','危機一髪','あわてるな。ここだ、という瞬間に体を動かせ',()=>(S.st.health+sk())/2,r=>{if(r==='great'){mod({skill:3,mental:4});raise(5,15);return '紙一重でかわした。親方（上司）に、初めてほめられた。';}if(r==='ok'){mod({mental:-3});return '冷や汗をかいたが、無事だった。';}mod({health:-20,mental:-8});S.job.salary*=.85;log('仕事中にけがをする');return '大けがをした。労災はおりたが、しばらく働けなかった。';})])});
D('w_field2',{a:[25,70],w:4,cd:6,c:JOBIN('field'),mk:()=>E('仕事','若い外国人の後輩が入ってきた。日本語はまだ片言だ。',[
  O('丁寧に教える',()=>{mod({comm:3,moral:3});addPerson('friend','職場の後輩',{age:S.age-10});return '仕事を覚えるのが、驚くほど早かった。故郷の料理をごちそうになった。';}),
  O('放っておく',()=>'後輩は半年で辞めた。')])});
// ---- 非正規 ----
D('w_part1',{a:[18,65],w:6,cd:4,c:JOBIN('part'),mk:()=>E('仕事','バイトリーダーに推薦された。時給は50円上がるが、責任は倍になる。',[
  OS('引き受けて結果を出す','繁忙期','ピークの時間を、さばききれ',()=>(sk()+cm())/2,r=>{if(r==='great'){S.job.salary+=RI(20,40);mod({comm:3});if(chance(.4)){setJob('sales',RI(330,400));log('正社員に登用');return '店長に推されて、正社員に登用された。';}return '店長に信頼されるようになった。';}if(r==='ok'){S.job.salary+=10;return 'なんとか回した。';}mod({mental:-8});return 'ミスが重なり、クレームが本社まで届いた。';}),
  O('断る',()=>'気楽なままでいたかった。')])});
D('w_part2',{a:[18,60],w:4,cd:6,c:JOBIN('part'),mk:()=>E('仕事','急にシフトを減らされた。「来月から週2で」とだけ言われた。',[
  O('掛け持ちを探す',()=>{mod({health:-4});gain(RI(10,30),'掛け持ちのバイト');return '朝と夜、二つの職場を行き来する日々が始まった。';}),
  O('労働相談の窓口に行く',()=>{mod({study:2});if(chance(.4)){gain(RI(5,15),'未払い分の支払い');return '一方的なシフトカットに、補償が出ることを知った。';}return '話は聞いてもらえた。それだけだった。';}),
  O('正社員の求人を探す',()=>{S.queue.push(evOffers('求人を探し始めた。',false));return '求人を探し始めた。';})])});
