// =====================================================================
// デフォルメキャラ（太線・ベタ塗り）
// =====================================================================
const ART={
  OL:'#2b2220',
  SKIN:['#ffe3cc','#fcd5b5','#f0c29b','#d9a37b'],
  HAIR:['#2b2b33','#3d2b22','#5e3b25','#7a4f30'],
  DYE:['#b07a3c','#e3bf62','#c43a2f','#8e8e9a','#5a6fb0'],
  EYE:['#3b2a20','#5a3a22','#26365a','#3d5a2a','#6b3b5a'],
  SHIRT:['#e8564a','#3d8ed6','#f2b632','#59b56c','#9a6bd1','#f08bb1','#ffffff','#4bb8b8'],
};
function stageOf(a){return a<3?'baby':a<12?'kid':a<18?'teen':a<60?'adult':'elder';}
const STG={
  baby:{hr:25,hy:64,bt:86,bh:26,bw:36,lh:9,sw:2},
  kid:{hr:25,hy:46,bt:68,bh:30,bw:30,lh:24,sw:2.2},
  teen:{hr:23,hy:38,bt:58,bh:38,bw:30,lh:32,sw:2.3},
  adult:{hr:22,hy:34,bt:53,bh:42,bw:32,lh:38,sw:2.3},
  elder:{hr:22,hy:40,bt:59,bh:39,bw:33,lh:32,sw:2.3},
};
// 人物の見た目（生まれた時に決まる）
function newLook(sex){
  return {sex,sk:Math.floor(Math.random()*4),hc:Math.random()<.75?0:Math.floor(Math.random()*4),
    hs:sex==='M'?['short','spiky','short','messy'][Math.floor(Math.random()*4)]:['long','bob','pony','long','twin'][Math.floor(Math.random()*5)],
    ec:Math.floor(Math.random()*5),shirt:Math.floor(Math.random()*8),glasses:false,dye:null,skirt:sex==='F'&&Math.random()<.6};
}
function chibi(o){
  // o: {look, age, outfit, mood, cane}
  const L=o.look,st=stageOf(o.age),P=STG[st],cx=50,hr=P.hr,hy=P.hy,OL=ART.OL,sw=P.sw;
  const skin=ART.SKIN[L.sk];
  let hair=L.dye!=null?ART.DYE[L.dye]:ART.HAIR[L.hc];
  if(st==='elder')hair=o.age>=75?'#dcdcdc':'#a9a9ad';
  const S=`stroke="${OL}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"`;
  let hs=L.hs;if(st==='baby')hs='baby';if(st==='kid'&&hs==='long'&&L.sex==='F')hs='twin';if(st==='elder'&&L.sex==='M'&&o.age>=70)hs='bald';
  const out=[];
  // ---- 後ろ髪 ----
  if(hs==='long')out.push(`<path d="M${cx-hr-4} ${hy-6} Q${cx-hr-9} ${hy+hr*1.3} ${cx-hr+3} ${hy+hr*1.6} L${cx+hr-3} ${hy+hr*1.6} Q${cx+hr+9} ${hy+hr*1.3} ${cx+hr+4} ${hy-6} Z" fill="${hair}" ${S}/>`);
  if(hs==='bob')out.push(`<path d="M${cx-hr-4} ${hy-6} Q${cx-hr-6} ${hy+hr*.8} ${cx-hr+2} ${hy+hr*.95} L${cx+hr-2} ${hy+hr*.95} Q${cx+hr+6} ${hy+hr*.8} ${cx+hr+4} ${hy-6} Z" fill="${hair}" ${S}/>`);
  if(hs==='pony')out.push(`<ellipse cx="${cx+hr+3}" cy="${hy+6}" rx="6" ry="13" transform="rotate(-18 ${cx+hr+3} ${hy+6})" fill="${hair}" ${S}/>`);
  if(hs==='twin'){out.push(`<ellipse cx="${cx-hr-4}" cy="${hy+10}" rx="6" ry="12" fill="${hair}" ${S}/>`);out.push(`<ellipse cx="${cx+hr+4}" cy="${hy+10}" rx="6" ry="12" fill="${hair}" ${S}/>`);}
  // ---- 体 ----
  out.push(body(o,st,P,skin,S));
  // ---- 頭 ----
  out.push(`<circle cx="${cx}" cy="${hy}" r="${hr}" fill="${skin}" ${S}/>`);
  // ---- 顔 ----
  out.push(face(o,st,P,S));
  // ---- 前髪 ----
  out.push(frontHair(hs,cx,hy,hr,hair,S,st));
  if(L.glasses&&st!=='baby'){const ey=hy+hr*.2,ex=hr*.37,r=hr*.22;out.push(`<circle cx="${cx-ex}" cy="${ey}" r="${r}" fill="none" ${S}/><circle cx="${cx+ex}" cy="${ey}" r="${r}" fill="none" ${S}/><path d="M${cx-ex+r} ${ey} L${cx+ex-r} ${ey}" ${S}/>`);}
  if(o.hat==='cap')out.push(`<path d="M${cx-hr-1} ${hy-hr*.35} Q${cx} ${hy-hr*1.35} ${cx+hr+1} ${hy-hr*.35} Z" fill="#d6413a" ${S}/><path d="M${cx+hr*.2} ${hy-hr*.4} L${cx+hr+12} ${hy-hr*.3}" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140">${out.join('')}</svg>`;
}
function frontHair(hs,cx,hy,hr,c,S,st){
  if(hs==='bald')return `<path d="M${cx-hr+1} ${hy-2} Q${cx-hr-3} ${hy+6} ${cx-hr+3} ${hy+10}" fill="${c}" ${S}/><path d="M${cx+hr-1} ${hy-2} Q${cx+hr+3} ${hy+6} ${cx+hr-3} ${hy+10}" fill="${c}" ${S}/>`;
  if(hs==='baby')return `<path d="M${cx-6} ${hy-hr+1} Q${cx-2} ${hy-hr-9} ${cx+3} ${hy-hr-2} Q${cx+6} ${hy-hr-8} ${cx+8} ${hy-hr+1}" fill="none" ${S}/>`;
  const top=`M${cx-hr-2} ${hy+3} C${cx-hr-4} ${hy-hr-9} ${cx+hr+4} ${hy-hr-9} ${cx+hr+2} ${hy+3}`;
  let pts=[],n=hs==='spiky'?6:hs==='messy'?6:5;
  const yUp=hy-hr*.38,yDn=hy-hr*.04;
  for(let i=0;i<=n*2;i++){const x=cx+hr+2-(2*hr+4)*i/(n*2);const y=i%2?yDn+(hs==='messy'&&i%4===1?3:0):yUp+(i===0||i===n*2?hr*.35:0);pts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);}
  let d=top+' '+pts.join(' ')+' Z';
  let extra='';
  if(hs==='spiky'){extra=`<path d="M${cx-hr+2} ${hy-hr*.7} L${cx-hr*.6} ${hy-hr-10} L${cx-hr*.2} ${hy-hr*.95} L${cx+hr*.15} ${hy-hr-12} L${cx+hr*.45} ${hy-hr*.9} L${cx+hr*.8} ${hy-hr-7} L${cx+hr-1} ${hy-hr*.6} Z" fill="${c}" ${S}/>`;}
  if(hs==='long'||hs==='bob'||hs==='twin'||hs==='pony'){extra+=`<path d="M${cx-hr-2} ${hy-2} Q${cx-hr-4} ${hy+hr*.5} ${cx-hr+3} ${hy+hr*.75} L${cx-hr+5} ${hy-4} Z" fill="${c}" ${S}/><path d="M${cx+hr+2} ${hy-2} Q${cx+hr+4} ${hy+hr*.5} ${cx+hr-3} ${hy+hr*.75} L${cx+hr-5} ${hy-4} Z" fill="${c}" ${S}/>`;}
  const shine=`<path d="M${cx-hr*.55} ${hy-hr*.72} Q${cx-hr*.2} ${hy-hr*.9} ${cx+hr*.05} ${hy-hr*.78}" fill="none" stroke="#ffffff" stroke-opacity=".55" stroke-width="2.2" stroke-linecap="round"/>`;
  return extra+`<path d="${d}" fill="${c}" ${S}/>`+shine;
}
function face(o,st,P,S){
  const cx=50,hr=P.hr,hy=P.hy,L=o.look,ec=ART.EYE[L.ec],OL=ART.OL,m=o.mood||'normal';
  const ey=hy+hr*.2,ex=hr*.36,rx=hr*.13,ry=hr*.19;let s='';
  // 眉
  const by=hy-hr*.06;
  const brow=m==='angry'?[[-ex-4,by-1,-ex+4,by+2],[ex-4,by+2,ex+4,by-1]]:m==='sad'?[[-ex-4,by+2,-ex+4,by-1],[ex-4,by-1,ex+4,by+2]]:[[-ex-4,by,-ex+4,by-1],[ex-4,by-1,ex+4,by]];
  if(st!=='baby')brow.forEach(b=>s+=`<path d="M${cx+b[0]} ${b[1]} L${cx+b[2]} ${b[3]}" stroke="${OL}" stroke-width="1.6" stroke-linecap="round"/>`);
  // 目
  for(const sgn of [-1,1]){const x=cx+sgn*ex;
    if(m==='happy'||st==='baby'&&m!=='sad'){s+=`<path d="M${x-rx-1} ${ey+1} Q${x} ${ey-ry-1} ${x+rx+1} ${ey+1}" fill="none" stroke="${OL}" stroke-width="2.2" stroke-linecap="round"/>`;continue;}
    if(m==='shock'){s+=`<circle cx="${x}" cy="${ey}" r="${rx*.9}" fill="#fff" ${S}/><circle cx="${x}" cy="${ey}" r="1.6" fill="${OL}"/>`;continue;}
    s+=`<ellipse cx="${x}" cy="${ey}" rx="${rx}" ry="${ry}" fill="${ec}" stroke="${OL}" stroke-width="1.3"/><ellipse cx="${x}" cy="${ey+ry*.25}" rx="${rx*.55}" ry="${ry*.55}" fill="${OL}" opacity=".55"/><circle cx="${x-rx*.35}" cy="${ey-ry*.4}" r="${rx*.42}" fill="#fff"/><circle cx="${x+rx*.4}" cy="${ey+ry*.35}" r="${rx*.2}" fill="#fff"/>`;
    s+=`<path d="M${x-rx-1.5} ${ey-ry+1} Q${x} ${ey-ry-2.5} ${x+rx+1.5} ${ey-ry+1}" fill="none" stroke="${OL}" stroke-width="2.4" stroke-linecap="round"/>`;
    if(m==='sad')s+=`<path d="M${x+sgn*2} ${ey+ry+1} q1 4 0 6" stroke="#6fb7e8" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
  // 頬
  s+=`<ellipse cx="${cx-hr*.56}" cy="${hy+hr*.47}" rx="${hr*.14}" ry="${hr*.08}" fill="#ff8a8a" opacity=".45"/><ellipse cx="${cx+hr*.56}" cy="${hy+hr*.47}" rx="${hr*.14}" ry="${hr*.08}" fill="#ff8a8a" opacity=".45"/>`;
  // 口
  const my=hy+hr*.56;
  if(m==='happy')s+=`<path d="M${cx-4} ${my-1} Q${cx} ${my+5} ${cx+4} ${my-1} Z" fill="#c9443a" stroke="${OL}" stroke-width="1.4" stroke-linejoin="round"/>`;
  else if(m==='sad'||m==='angry')s+=`<path d="M${cx-3.5} ${my+2} Q${cx} ${my-1.5} ${cx+3.5} ${my+2}" fill="none" stroke="${OL}" stroke-width="1.6" stroke-linecap="round"/>`;
  else if(m==='shock')s+=`<ellipse cx="${cx}" cy="${my+1}" rx="2.6" ry="3.2" fill="#c9443a" stroke="${OL}" stroke-width="1.3"/>`;
  else s+=`<path d="M${cx-2.5} ${my} Q${cx} ${my+1.5} ${cx+2.5} ${my}" fill="none" stroke="${OL}" stroke-width="1.6" stroke-linecap="round"/>`;
  if(st==='elder')s+=`<path d="M${cx-ex-rx-3} ${ey+ry+2} l-2 1.5 M${cx+ex+rx+3} ${ey+ry+2} l2 1.5" stroke="${OL}" stroke-width="1" />`;
  if(st==='elder'&&L.sex==='M'&&o.age>=65)s+=`<path d="M${cx-6} ${my-3} Q${cx} ${my-6} ${cx+6} ${my-3} Q${cx} ${my-1} ${cx-6} ${my-3} Z" fill="#dcdcdc" stroke="${OL}" stroke-width="1.2"/>`;
  return s;
}
// 服装の色セット
function outfitColors(o,st){
  const L=o.look,f=o.outfit||'casual',sh=ART.SHIRT[L.shirt];
  const map={
    baby:{top:L.sex==='F'?'#f6b9cb':'#a7d6f2',bot:L.sex==='F'?'#f6b9cb':'#a7d6f2',sleeve:null,skirt:false,legSkin:true},
    kid:{top:sh,bot:'#34466e',skirt:L.sex==='F'&&L.skirt,legSkin:true,randoseru:o.age>=6&&o.age<=11},
    school:L.sex==='M'?{top:'#23262f',bot:'#23262f',gakuran:true}:{top:'#ffffff',bot:'#2a3557',skirt:true,sailor:true,legSkin:true},
    casual:{top:sh,bot:'#4a6a9a',skirt:L.sex==='F'&&L.skirt,legSkin:L.sex==='F'&&L.skirt},
    hoodie:{top:'#7b8794',bot:'#3c4250',hood:true},
    suit:{top:L.sex==='F'?'#2d3446':'#26314d',bot:L.sex==='F'?'#2d3446':'#26314d',suit:true,skirt:L.sex==='F',legSkin:L.sex==='F'},
    office:{top:'#8a8f99',bot:'#5c616b',suit:true},
    nurse:{top:'#f3d5df',bot:'#f3d5df',nurse:true},
    chef:{top:'#ffffff',bot:'#2b2b2b',chef:true},
    work:{top:'#3f6fb3',bot:'#3f6fb3',work:true},
    night:L.sex==='M'?{top:'#151515',bot:'#151515',suit:true,open:true}:{top:'#c42c4a',bot:'#c42c4a',dress:true,legSkin:true},
    stage:{top:'#f2c12e',bot:'#1c1c1c',suit:true,open:true},
    apron:{top:sh,bot:'#4a3b2f',apron:true},
    elder:{top:'#b89a6e',bot:'#6b5a48',cardigan:true},
    pajama:{top:'#9bc7e8',bot:'#9bc7e8'},
    tracksuit:{top:'#2f5fa8',bot:'#2f5fa8',jersey:true},
  };
  return map[f]||map.casual;
}
function body(o,st,P,skin,S){
  const cx=50,bt=P.bt,bh=P.bh,bw=P.bw,lh=P.lh,OL=ART.OL,C=outfitColors(o,st);let s='';
  const torsoH=st==='baby'?bh:bh*.62,y1=bt+torsoH;
  // ランドセル
  if(C.randoseru)s+=`<rect x="${cx-bw/2-5}" y="${bt+2}" width="${bw+10}" height="${torsoH+4}" rx="4" fill="${o.look.sex==='F'?'#c8323b':'#2a2a2a'}" ${S}/>`;
  // 脚
  if(st!=='baby'){
    const legW=bw/2-3,lx1=cx-bw/2+3,lx2=cx+2;
    const legCol=C.legSkin?skin:C.bot;
    const ly=C.skirt||C.dress?y1+lh*.45:y1;
    s+=`<rect x="${lx1}" y="${y1-2}" width="${legW}" height="${lh+2}" rx="3" fill="${legCol}" ${S}/><rect x="${lx2}" y="${y1-2}" width="${legW}" height="${lh+2}" rx="3" fill="${legCol}" ${S}/>`;
    if(C.legSkin&&!(C.skirt||C.dress))s+=`<rect x="${lx1}" y="${y1-2}" width="${legW}" height="${lh*.45}" fill="${C.bot}" ${S}/><rect x="${lx2}" y="${y1-2}" width="${legW}" height="${lh*.45}" fill="${C.bot}" ${S}/>`;
    if(st==='kid'&&!C.skirt){}
    // 靴
    s+=`<ellipse cx="${lx1+legW/2-1}" cy="${y1+lh+1}" rx="${legW/2+2.5}" ry="3.6" fill="#3a2e28" ${S}/><ellipse cx="${lx2+legW/2+1}" cy="${y1+lh+1}" rx="${legW/2+2.5}" ry="3.6" fill="#3a2e28" ${S}/>`;
  }else{
    s+=`<ellipse cx="${cx-9}" cy="${bt+bh+2}" rx="7" ry="5" fill="${C.bot}" ${S}/><ellipse cx="${cx+9}" cy="${bt+bh+2}" rx="7" ry="5" fill="${C.bot}" ${S}/>`;
  }
  // スカート・ドレス
  if(C.skirt||C.dress)s+=`<path d="M${cx-bw/2+1} ${y1-3} L${cx-bw/2-5} ${y1+lh*.5} L${cx+bw/2+5} ${y1+lh*.5} L${cx+bw/2-1} ${y1-3} Z" fill="${C.bot}" ${S}/>`;
  // 胴
  const tw=st==='baby'?bw:bw;
  s+=`<path d="M${cx-tw/2+2} ${bt} Q${cx-tw/2-1} ${bt+2} ${cx-tw/2} ${bt+6} L${cx-tw/2+1} ${y1} L${cx+tw/2-1} ${y1} L${cx+tw/2} ${bt+6} Q${cx+tw/2+1} ${bt+2} ${cx+tw/2-2} ${bt} Z" fill="${C.top}" ${S}/>`;
  // 首まわりの装飾
  if(C.suit){s+=`<path d="M${cx-6} ${bt} L${cx} ${bt+12} L${cx+6} ${bt} Z" fill="#ffffff" ${S}/>`;if(!C.open)s+=`<path d="M${cx-2} ${bt+3} L${cx+2} ${bt+3} L${cx+2.5} ${bt+16} L${cx} ${bt+19} L${cx-2.5} ${bt+16} Z" fill="${o.look.shirt%2?'#b83236':'#2f5fa8'}" stroke="${OL}" stroke-width="1.3"/>`;s+=`<path d="M${cx-6} ${bt} L${cx-2} ${bt+14} M${cx+6} ${bt} L${cx+2} ${bt+14}" stroke="${OL}" stroke-width="1.4"/>`;}
  if(C.gakuran){s+=`<rect x="${cx-5}" y="${bt-1}" width="10" height="4" fill="#23262f" ${S}/>`;for(let i=0;i<3;i++)s+=`<circle cx="${cx}" cy="${bt+7+i*7}" r="1.6" fill="#e8c14e" stroke="${OL}" stroke-width=".8"/>`;}
  if(C.sailor){s+=`<path d="M${cx-tw/2+1} ${bt+1} L${cx} ${bt+12} L${cx+tw/2-1} ${bt+1} L${cx+tw/2-3} ${bt+8} L${cx} ${bt+16} L${cx-tw/2+3} ${bt+8} Z" fill="#2a3557" ${S}/><path d="M${cx-4} ${bt+12} L${cx} ${bt+20} L${cx+4} ${bt+12} Z" fill="#d23a3a" ${S}/>`;}
  if(C.nurse)s+=`<rect x="${cx+3}" y="${bt+6}" width="6" height="5" fill="#fff" stroke="${OL}" stroke-width="1"/>`;
  if(C.chef)s+=`<path d="M${cx-6} ${bt} Q${cx} ${bt+8} ${cx+6} ${bt}" fill="#e85a4f" ${S}/>`;
  if(C.work)s+=`<rect x="${cx-8}" y="${bt+8}" width="7" height="6" fill="none" stroke="${OL}" stroke-width="1.2"/>`;
  if(C.apron)s+=`<path d="M${cx-tw/2+4} ${bt+8} L${cx+tw/2-4} ${bt+8} L${cx+tw/2-2} ${y1+6} L${cx-tw/2+2} ${y1+6} Z" fill="#7b5a3f" ${S}/>`;
  if(C.cardigan)s+=`<path d="M${cx} ${bt+2} L${cx} ${y1}" stroke="${OL}" stroke-width="1.4"/><circle cx="${cx+2}" cy="${bt+9}" r="1.2" fill="${OL}"/><circle cx="${cx+2}" cy="${bt+16}" r="1.2" fill="${OL}"/>`;
  if(C.hood)s+=`<path d="M${cx-9} ${bt+1} Q${cx} ${bt+9} ${cx+9} ${bt+1}" fill="#6a7582" ${S}/>`;
  if(C.jersey)s+=`<path d="M${cx} ${bt+1} L${cx} ${y1}" stroke="#fff" stroke-width="1.4"/>`;
  // 腕
  const al=st==='baby'?12:bh*.55,sy=bt+3,sleeve=C.top;
  for(const sg of [-1,1]){const x0=cx+sg*(tw/2-1),x1=cx+sg*(tw/2+5);s+=`<path d="M${x0} ${sy} L${x1} ${sy+al} L${x1-sg*6} ${sy+al+1} L${x0-sg*5} ${sy+6} Z" fill="${sleeve}" ${S}/><circle cx="${x1-sg*3}" cy="${sy+al+3}" r="${st==='baby'?4:3.6}" fill="${skin}" ${S}/>`;}
  // 杖
  if(o.cane)s+=`<path d="M${cx+tw/2+3} ${sy+al+2} L${cx+tw/2+5} ${y1+lh+4} M${cx+tw/2+3} ${sy+al+2} q4 -3 6 1" stroke="#6b4a2c" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return s;
}
// 猫
function catSVG(){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 50"><g stroke="${ART.OL}" stroke-width="2" stroke-linejoin="round"><path d="M44 40 q12 -2 10 -16" fill="none" stroke-width="4" stroke-linecap="round"/><path d="M41 40 q14 -2 12 -16" fill="none" stroke="#e8a25a" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="32" cy="38" rx="14" ry="9" fill="#e8a25a"/><circle cx="20" cy="26" r="11" fill="#e8a25a"/><path d="M11 21 L10 10 L18 16 Z M29 21 L30 10 L22 16 Z" fill="#e8a25a"/><circle cx="16" cy="26" r="1.6" fill="${ART.OL}"/><circle cx="24" cy="26" r="1.6" fill="${ART.OL}"/><path d="M18.5 30 q1.5 1.5 3 0" fill="none" stroke-width="1.2"/></g></svg>`;}

// =====================================================================
// 背景シーン
// =====================================================================
function sceneSVG(bg){
  const W=360,H=150,OL=ART.OL,S=`stroke="${OL}" stroke-width="2" stroke-linejoin="round"`;
  let sky='#cfe6f2',ground='#dfd8c8',s='';
  const pole=(x)=>`<rect x="${x}" y="22" width="5" height="108" fill="#8d8d8d" ${S}/><path d="M${x-10} 30 L${x+15} 30" ${S}/>`;
  const wires=`<path d="M0 34 Q90 46 180 32 T360 34" fill="none" stroke="${OL}" stroke-width="1.2"/><path d="M0 42 Q90 54 180 40 T360 42" fill="none" stroke="${OL}" stroke-width="1.2"/>`;
  switch(bg){
    case 'local':s+=`<path d="M0 90 L60 40 L120 85 L190 30 L260 88 L320 50 L360 80 L360 120 L0 120 Z" fill="#9fc28a" ${S}/><rect x="0" y="105" width="360" height="45" fill="#b9d98a"/><path d="M0 112 L360 112 M0 124 L360 124 M0 136 L360 136" stroke="#93b86a" stroke-width="2"/><path d="M230 70 L270 50 L310 70 Z" fill="#b5523f" ${S}/><rect x="238" y="70" width="64" height="35" fill="#efe4cf" ${S}/>`;ground='#b9d98a';break;
    case 'house':s+=`<path d="M20 58 L70 30 L120 58 Z" fill="#6f7e8c" ${S}/><rect x="28" y="58" width="84" height="62" fill="#f1e7d3" ${S}/><rect x="40" y="70" width="18" height="16" fill="#bfe0f0" ${S}/><rect x="80" y="86" width="18" height="34" fill="#9b6b45" ${S}/><path d="M240 64 L290 36 L340 64 Z" fill="#a8513f" ${S}/><rect x="248" y="64" width="84" height="56" fill="#e9e2d2" ${S}/><rect x="260" y="76" width="16" height="14" fill="#bfe0f0" ${S}/>${pole(170)}${wires}`;break;
    case 'apart':s+=`<rect x="30" y="40" width="160" height="80" fill="#e6dccb" ${S}/><path d="M24 40 L196 40" stroke="${OL}" stroke-width="4"/><path d="M30 80 L190 80" ${S}/>`+[50,90,130].map(x=>`<rect x="${x}" y="50" width="22" height="24" fill="#a9c8d8" ${S}/><rect x="${x}" y="88" width="22" height="26" fill="#a9c8d8" ${S}/>`).join('')+`<path d="M190 120 L215 80 L215 40" fill="none" ${S}/><path d="M196 110 L222 110 M202 100 L222 100 M208 90 L222 90" stroke="${OL}" stroke-width="1.5"/><rect x="250" y="30" width="80" height="90" fill="#c9c3b6" ${S}/>${pole(232)}${wires}`;break;
    case 'mansion':s+=`<rect x="40" y="10" width="110" height="110" fill="#d8d3c8" ${S}/>`+[...Array(5)].map((_,r)=>[0,1,2,3].map(c=>`<rect x="${50+c*24}" y="${18+r*20}" width="16" height="12" fill="#a9c8d8" stroke="${OL}" stroke-width="1.3"/>`).join('')).join('')+`<rect x="230" y="40" width="100" height="80" fill="#c2bdb0" ${S}/>${pole(190)}`;break;
    case 'tower':sky='#9ccbe8';s+=`<rect x="90" y="-10" width="70" height="130" fill="#7fa5c2" ${S}/>`+[...Array(9)].map((_,r)=>`<path d="M90 ${r*14+4} L160 ${r*14+4}" stroke="#d4e6f2" stroke-width="2"/>`).join('')+`<rect x="200" y="20" width="50" height="100" fill="#9bb6cb" ${S}/><rect x="20" y="60" width="50" height="60" fill="#b7c6d3" ${S}/><rect x="0" y="118" width="360" height="32" fill="#6aa0c8"/>`;ground='#cfd6dc';break;
    case 'street':sky='#4a5466';ground='#7b7b7b';s+=`<rect x="20" y="30" width="90" height="90" fill="#3d4352" ${S}/><rect x="250" y="20" width="90" height="100" fill="#3d4352" ${S}/>`+[30,60,90].map(x=>`<rect x="${x}" y="45" width="12" height="10" fill="#f2d16b"/>`).join('')+`<rect x="40" y="108" width="60" height="7" fill="#8a6a4a" ${S}/><text x="275" y="60" font-size="13" fill="#f25a8a" font-family="sans-serif" font-weight="bold">NET CAFE</text>`;break;
    case 'office':s+=`<rect x="10" y="5" width="120" height="115" fill="#c8d2db" ${S}/>`+[...Array(6)].map((_,r)=>`<path d="M10 ${r*18+14} L130 ${r*18+14}" stroke="#eef3f7" stroke-width="3"/>`).join('')+`<rect x="230" y="25" width="110" height="95" fill="#b8c4ce" ${S}/>`;break;
    case 'school':s+=`<rect x="40" y="30" width="200" height="90" fill="#efe8da" ${S}/><rect x="120" y="14" width="40" height="22" fill="#efe8da" ${S}/><circle cx="140" cy="25" r="7" fill="#fff" ${S}/>`+[60,100,170,210].map(x=>`<rect x="${x}" y="50" width="22" height="18" fill="#a9c8d8" ${S}/><rect x="${x}" y="84" width="22" height="18" fill="#a9c8d8" ${S}/>`).join('')+`<path d="M260 120 L260 60 M250 70 Q260 40 272 66" stroke="${OL}" stroke-width="2" fill="#f4b8c8"/>`;break;
    case 'hospital':s+=`<rect x="60" y="20" width="240" height="100" fill="#f2f4f5" ${S}/>`+[80,130,180,230].map(x=>`<rect x="${x}" y="40" width="30" height="20" fill="#bfe0f0" ${S}/>`).join('')+`<rect x="170" y="76" width="22" height="8" fill="#3fa87b"/><rect x="177" y="69" width="8" height="22" fill="#3fa87b"/>`;break;
    case 'home_old':s+=`<path d="M60 56 L150 26 L240 56 Z" fill="#5d6c62" ${S}/><rect x="72" y="56" width="156" height="64" fill="#ece0c8" ${S}/><rect x="90" y="70" width="40" height="30" fill="#d8c79f" ${S}/><path d="M110 70 L110 100 M90 85 L130 85" stroke="${OL}" stroke-width="1.4"/><circle cx="300" cy="70" r="26" fill="#9cc26f" ${S}/><rect x="296" y="90" width="8" height="30" fill="#7b5a3f" ${S}/>`;break;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice"><rect width="${W}" height="${H}" fill="${sky}"/>${s}<rect x="0" y="118" width="${W}" height="32" fill="${ground}" opacity="${bg==='tower'?0:1}"/><path d="M0 118 L${W} 118" stroke="${OL}" stroke-width="2"/></svg>`;
}
