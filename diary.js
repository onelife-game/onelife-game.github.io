// =====================================================================
// 言葉が残る ― 日記・タイムカプセル・子どもへの手紙・最期の言葉
// 書いた言葉は、何年もあとに自分の前に戻ってくる。走馬灯にも出てくる。
// =====================================================================
(function(){const st=document.createElement('style');st.textContent=`
.dyin{width:100%;box-sizing:border-box;margin-top:10px;padding:8px;font-size:16px;line-height:1.6;resize:none;border-radius:0}
.dyq{margin-top:10px;padding:10px 12px;border-left:3px solid var(--lime);background:rgba(199,249,75,.06);font-size:16px}`;document.head.appendChild(st);})();
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dyBox=(ph)=>`<textarea id="dyIn" class="dyin" rows="3" maxlength="80" placeholder="${esc(ph)}"></textarea>`;
function dyRead(){const e=document.getElementById('dyIn');return e?e.value.trim().slice(0,80):'';}
function diaryAdd(t,kind){S.diary=S.diary||[];S.diary.push({age:S.age,year:S.year,t,kind:kind||'日記'});}
function diarySituation(){
  const a=[];if(S.spouse)a.push(`${S.spouse.name}と暮らしている`);else if(S.partner)a.push(`${S.partner.name}と付き合っている`);
  const k=S.kids.filter(k=>k.alive!==false);if(k.length)a.push(`子どもは${k.length}人`);
  a.push(J().n);if(S.debt>100)a.push('借金がある');if(S.st.mental<30)a.push('心が疲れている');
  return a.join('、');
}
// ---- 節目の日記 ----
const DY_AGES=[15,20,25,30,40,50,60,70,80];
D('dy_diary',{a:[15,80],m:true,c:()=>DY_AGES.includes(S.age)&&S.flags.dyLast!==S.age,mk:()=>{S.flags.dyLast=S.age;
  return E('日記',`${S.age}歳になった。${diarySituation()}。<br>今の気持ちを、一言だけ書いておこう。${dyBox(pick(['今いちばん大事なもの','今の自分に言いたいこと','最近うれしかったこと','10年後の自分へ']))}`,[
  O('書いて残す',()=>{const v=dyRead();if(!v)return '何も書けないまま、ノートを閉じた。';diaryAdd(v);return `「${esc(v)}」と書いた。`;}),
  O('今年は書かない',()=>'ノートは、引き出しの奥にしまった。')]);}});
// ---- タイムカプセル（12歳 → 30歳で開く） ----
D('dy_capsule',{a:[12,12],m:true,c:()=>!S.capsule,mk:()=>E('タイムカプセル',`卒業の記念に、タイムカプセルを埋めることになった。30歳になったら掘り起こす約束だ。<br>未来の自分への手紙を書こう。${dyBox('30歳の自分へ')}`,[
  O('手紙を入れる',()=>{const v=dyRead();S.capsule={t:v||'（白紙）',age:S.age};if(v)diaryAdd(v,'タイムカプセル');return v?`「${esc(v)}」と書いて、缶に入れた。`:'何を書いていいかわからず、白紙のまま入れた。';}),
  O('好きなおもちゃを入れる',()=>{S.capsule={t:'',toy:1,age:S.age};return 'いちばん大事にしていたおもちゃを入れた。';})])});
D('dy_capsule_open',{a:[30,32],m:true,c:()=>S.capsule&&!S.capsule.opened,mk:()=>{S.capsule.opened=1;const c=S.capsule;
  return E('タイムカプセル',`小学校の同級生から連絡が来た。「タイムカプセル、掘り起こすよ」<br>錆びた缶の中から、${c.toy?'12歳のときに大事にしていたおもちゃが出てきた。':`12歳の自分の字で書かれた手紙が出てきた。<div class="dyq">${c.t==='（白紙）'?'（何も書かれていない）':esc(c.t)}</div>`}`,[
  O('今の自分は、あの頃の自分に胸を張れる',()=>{mod({mental:10});return '少し照れくさくて、同級生と笑い合った。';}),
  O('あの頃の自分に、謝りたくなった',()=>{mod({mental:-4,study:2});return '帰り道、もう一度がんばってみようと思った。';}),
  O('同級生と飲みに行く',()=>{mod({mental:6});friends().forEach(f=>f.close+=3);if(chance(.5))addPerson('friend','小学校の同級生');return '朝まで、昔の話をした。';})]);}});
// ---- 子どもへの手紙（生まれた年 → 20歳で渡す） ----
D('dy_letter',{a:[18,70],m:true,c:()=>S.kids.some(k=>k.alive!==false&&k.age<=1&&!k.letter&&!k.letterAsk),mk:()=>{const k=S.kids.find(k=>k.alive!==false&&k.age<=1&&!k.letter&&!k.letterAsk);k.letterAsk=1;
  return E('手紙',`${k.name}の寝顔を見ていた。この子が20歳になったときに渡す手紙を、書いておこうか。${dyBox(k.name.split(' ')[1]+'へ')}`,[
  O('書いて封をする',()=>{const v=dyRead();if(!v)return '何度も書き直して、結局書けなかった。';k.letter=v;diaryAdd(v,`${k.name}への手紙`);return '封筒に「20歳になったら開けること」と書いた。';}),
  O('今はやめておく',()=>'言葉は、そのうち見つかると思った。')],W(k));}});
D('dy_letter_open',{a:[38,95],m:true,c:()=>S.kids.some(k=>k.alive!==false&&k.age===20&&k.letter&&!k.letterRead),mk:()=>{const k=S.kids.find(k=>k.alive!==false&&k.age===20&&k.letter&&!k.letterRead);k.letterRead=1;
  return E('手紙',`${k.name}が20歳になった。20年前に書いた手紙を渡した。<div class="dyq">${esc(k.letter)}</div>${k.close>=50?`読み終えた${k.name}は、しばらく黙って、それから「ありがとう」と言った。`:`${k.name}は黙って読み、何も言わずに部屋に戻った。夜、部屋から鼻をすする音が聞こえた。`}`,[
  O('照れくさくて、笑ってごまかす',()=>{k.close+=15;mod({mental:12});return '20年前の自分の字が、思ったよりまっすぐだった。';})],W(k));}});
// ---- 最期の言葉を書いておく ----
D('dy_last',{a:[60,110],m:true,c:()=>!S.lastWords&&(S.age>=78||S.st.health<18),mk:()=>E('遺す言葉',`最近、自分の人生の終わりを考えることが増えた。<br>最期に、誰かに伝えたい言葉はあるだろうか。${dyBox('最期に残したい言葉')}`,[
  O('書いておく',()=>{const v=dyRead();if(!v)return 'ペンを持ったまま、窓の外を眺めた。';S.lastWords=v;diaryAdd(v,'最期の言葉');return '引き出しに、そっとしまった。';}),
  O('まだ早い',()=>'まだ、生きることを考えていたい。')])});
