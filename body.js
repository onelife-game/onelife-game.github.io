// =====================================================================
// 体と心が見た目に出る
//  体型（やせ〜太め）・白髪・目の下のクマが、暮らし方で少しずつ変わる
//  心が限界に近づくと、画面の色や文字がおかしくなっていく
// =====================================================================
function bodyState(){S.body=S.body||{w:0,gray:0,tired:0};return S.body;}
function bodyYear(){
  if(S.age<16)return;const B=bodyState(),v=S.vice||{};
  let dw=(v.drink?.25:0)+(S.life===2?.15:0)+(S.st.mental<35?.2:0)+(S.age>=40?.08:0)+(S.gymYr===S.age-1?-.45:0)+(['tobi','athlete','hiyatoi','factory'].includes(S.job.id)?-.2:0)+(S.st.health<30?-.15:0)+rn(-.08,.08);
  B.w=Math.max(-1.2,Math.min(3,B.w+dw));
  B.gray=Math.max(0,Math.min(1,B.gray+(S.age>=35?.025:0)+(S.st.mental<30?.04:0)+(S.age>=50?.03:0)));
  B.tired=Math.max(0,Math.min(1,B.tired*.6+(S.st.mental<40?.35:0)+(S.effort===2?.25:0)+(S.st.health<40?.2:0)));
}
const _startYearB=startYear;
startYear=function(first){_startYearB(first);if(!S)return;if(!first){bodyYear();const B=bodyState();
  if(B.w>=1.5&&!S.flags.bodyW1){S.flags.bodyW1=1;S.notes.push('久しぶりに会った友達に「なんか、ふっくらした？」と言われた。');}
  if(B.w>=2.5&&!S.flags.bodyW2){S.flags.bodyW2=1;S.notes.push('健康診断で「このままだと生活習慣病です」と言われた。');mod({health:-3});}
  if(B.gray>=.45&&!S.flags.bodyG){S.flags.bodyG=1;S.notes.push('鏡を見たら、白髪が増えていた。');}
  if(B.tired>=.6&&!S.flags.bodyT){S.flags.bodyT=1;S.notes.push('「顔色悪いよ。ちゃんと寝てる？」と言われた。');}
  if(B.tired<.3)S.flags.bodyT=0;}
  mindFx();
};
// ---- キャラの絵に反映（今の自分を描くときだけ） ----
const _playerSVGB=playerSVG;
playerSVG=function(){window._drawMe=1;try{return _playerSVGB.apply(this,arguments);}finally{window._drawMe=0;}};
const _chibiB=chibi;
chibi=function(o){
  if(!S||!o||!(window._drawMe||o.look===S.look)||o.age!==S.age||o.age<16)return _chibiB(o);
  const B=bodyState();
  let look=o.look;if(B.gray>=.55&&o.age<70&&look.dye==null)look=Object.assign({},look,{dye:3});
  let svg=_chibiB(Object.assign({},o,{look}));
  // 体型：首から下（13行目〜）を横に広げる／細くする
  const sx=1+Math.max(-1,Math.min(3,B.w))*.08;
  if(Math.abs(sx-1)>.03){const head=[],bodyR=[];svg.replace(/<rect [^>]*\/>/g,m=>{const y=+(m.match(/ y="(\d+)"/)||[0,0])[1];(y>=13?bodyR:head).push(m);return m;});
    const inner=head.join('')+`<g transform="translate(8 0) scale(${sx.toFixed(2)} 1) translate(-8 0)">${bodyR.join('')}</g>`;
    svg=svg.replace(/(<svg[^>]*>)[\s\S]*(<\/svg>)/,`$1${inner}$2`);}
  // 目の下のクマ（大人の絵だけ）
  if(B.tired>=.45&&o.age<70){const op=Math.min(.75,B.tired).toFixed(2);svg=svg.replace('</svg>',`<rect x="5" y="9" width="1" height="1" fill="#7a5a8a" opacity="${op}"/><rect x="10" y="9" width="1" height="1" fill="#7a5a8a" opacity="${op}"/></svg>`);}
  return svg;
};
// ---- 心が限界のとき：画面の色が抜け、文字がにじむ ----
(function(){const st=document.createElement('style');st.textContent=`
body.mind1 #main{filter:saturate(.55) contrast(.95)}
body.mind2 #main{filter:saturate(.15) contrast(.9) brightness(.92)}
body.mind2 #main .nl,body.mind2 #main .ev .tx{animation:mindBlur 6s infinite}
@keyframes mindBlur{0%,86%,100%{filter:none;transform:none}88%{filter:blur(1.2px);transform:translateX(1px)}91%{filter:blur(.4px);transform:translateX(-1px)}}`;document.head.appendChild(st);})();
function mindFx(){const m=S&&!S.ended?S.st.mental:100;document.body.classList.toggle('mind1',m<30&&m>=15);document.body.classList.toggle('mind2',m<15);}
const _renderB=render;
render=function(){const r=_renderB.apply(this,arguments);try{mindFx();}catch(e){}return r;};
// 心が限界のとき、文章にときどきノイズが混じる
const _famTextB=famText;
famText=function(t){t=_famTextB(t);if(!t||typeof t!=='string'||!S||S.st.mental>=12||/</.test(t))return t;return chance(.35)?t.replace(/。/,'。……。'):t;};

{const g=ACTS.find(a=>a.id==='gym');if(g){const f=g.f;g.f=function(){S.gymYr=S.age;return f.apply(this,arguments);};}}
