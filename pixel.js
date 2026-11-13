// =====================================================================
// ONE LIFE ドット絵キャラクター（16×24 ほか）
// 文字1つ＝1ドット。色は look（肌・髪・服）から差し替える
// O:輪郭 S:肌 R:ほお H:髪 E:目 M:口 C:服 c:服の影 W:シャツ T:ネクタイ/ボタン P:ズボン B:くつ K:杖 G:ランドセル
// =====================================================================
const PX_SPR={
 adult:[
 ".....OOOOOO.....",
 "...OOHHHHHHOO...",
 "..OHHHHHHHHHHO..",
 ".OHHHHHHHHHHHHO.",
 ".OHHHHHHHHHHHHO.",
 ".OHHSSSSSSSSHHO.",
 ".OHSSSSSSSSSSHO.",
 ".OSSSESSSSESSSO.",
 ".OSSSESSSSESSSO.",
 ".OSRRSSSSSSRRSO.",
 "..OSSSSMMSSSSO..",
 "...OOSSSSSSOO...",
 ".....OOSSOO.....",
 "...OOCCWWCCOO...",
 "..OCCCCWTCCCCO..",
 ".OCCOCCWTCCOCCO.",
 ".OCCOCCCTCCOCCO.",
 ".OSSOCCCCCCOSSO.",
 "..OO.OCCCCO.OO..",
 ".....OPPPPO.....",
 ".....OPPPPO.....",
 ".....OPOOPO.....",
 "....OBBOOBBO....",
 "....OOO..OOO....",
 ],
 kid:[
 "....OOOOOO....",
 "..OOHHHHHHOO..",
 ".OHHHHHHHHHHO.",
 "OHHHHHHHHHHHHO",
 "OHHSSSSSSSSHHO",
 "OHSSSSSSSSSSHO",
 "OSSSESSSSESSSO",
 "OSSSESSSSESSSO",
 "OSRRSSSSSSRRSO",
 ".OSSSSMMSSSSO.",
 "..OOSSSSSSOO..",
 "...OCCWWCCO...",
 "..OCCCCCCCCO..",
 ".OSOCCCCCCOSO.",
 "..O.OCCCCO.O..",
 "....OPPPPO....",
 "....OSOOSO....",
 "...OBBOOBBO...",
 "...OOO..OOO...",
 ],
 baby:[
 "...OOOOOO...",
 "..OHHHHHHO..",
 ".OSSSSSSSSO.",
 "OSSSSSSSSSSO",
 "OSSESSSSESSO",
 "OSRSSSSSSRSO",
 "OSSSSMMSSSSO",
 ".OSSSSSSSSO.",
 ".OCCCCCCCCO.",
 "OSOCCCCCCOSO",
 ".OOCCCCCCOO.",
 "..OSSOOSSO..",
 "..OOO..OOO..",
 ],
 elder:[
 "................",
 ".....OOOOOO.....",
 "...OOHHHHHHOO...",
 "..OHHHHHHHHHHO..",
 ".OHHSSSSSSSSHHO.",
 ".OHSSSSSSSSSSHO.",
 ".OSSSSSSSSSSSSO.",
 ".OSSEESSSSEESSO.",
 ".OSRRSSSSSSRRSO.",
 "..OSSSSMMSSSSO..",
 "...OOSSSSSSOO...",
 ".....OOSSOO.....",
 "...OOCCWWCCOO...",
 "..OCCCCWWCCCCO..",
 ".OCCOCCTCCCOCCO.",
 ".OCCOCCCCCCOCCO.",
 ".OSSOCCTCCCOSSOK",
 "..OO.OCCCCCO.OOK",
 ".....OPPPPPO...K",
 ".....OPPPPPO...K",
 ".....OPOOOPO...K",
 "....OBBO.OBBO..K",
 "....OOO...OOO..K",
 "................",
 ],
};
// 髪型の上書き（長い髪・おだんごなど）
function pxHair(rows,style,stage){
  const r=rows.map(s=>s.split(''));const W=r[0].length,set=(y,x,v)=>{if(r[y]&&x>=0&&x<W)r[y][x]=v;};
  const top=stage==='elder'?1:0;
  if(style==='long'||style==='twin'||style==='pony'){
    const y0=stage==='baby'?2:top+5,y1=stage==='kid'?13:stage==='baby'?7:top+16;
    for(let y=y0;y<=y1;y++){if(style==='long'){set(y,0,'O');set(y,1,'H');set(y,W-2,'H');set(y,W-1,'O');}}
    if(style==='twin'){for(let y=y0;y<y0+6;y++){set(y,0,'H');set(y,W-1,'H');}}
    if(style==='pony'){for(let y=top+3;y<top+9;y++){set(y,W-1,'H');}}
  }
  if(style==='bob'){const y0=stage==='baby'?2:top+5;for(let y=y0;y<y0+6;y++){set(y,1,'H');set(y,W-2,'H');}}
  if(style==='spiky'){set(top,3,'H');set(top,7,'H');set(top,12,'H');set(top+1,2,'H');}
  if(style==='bald'){for(let y=0;y<5;y++)r[y]=r[y].map(c=>c==='H'?'S':c);}
  return r.map(a=>a.join(''));
}
const PX_OUT={
 baby:{C:'#F6D6E0',c:'#E9B8C8',W:'#F6D6E0',T:'#F6D6E0',P:'#F6D6E0',B:'#FFFFFF'},
 kid:{C:'#E85D4A',W:'#FFFFFF',T:'#E85D4A',P:'#3A5BA0',B:'#FFFFFF'},
 school_M:{C:'#1E2230',W:'#1E2230',T:'#E8C547',P:'#1E2230',B:'#3A2A20'},
 school_F:{C:'#F4F4F4',W:'#1F3A73',T:'#D7263D',P:'#1F3A73',B:'#3A2A20'},
 suit:{C:'#2A3550',W:'#FFFFFF',T:'#C8323C',P:'#2A3550',B:'#2B1D14'},
 office:{C:'#3A3F58',W:'#FFFFFF',T:'#FFFFFF',P:'#3A3F58',B:'#2B1D14'},
 casual:{C:'#4E9F7A',W:'#F2EEE4',T:'#4E9F7A',P:'#3A4C7A',B:'#E9E5DA'},
 hoodie:{C:'#8C6CC8',W:'#8C6CC8',T:'#E9E5DA',P:'#2E2E38',B:'#FFFFFF'},
 work:{C:'#E8913A',W:'#F4F1E8',T:'#9AA0A6',P:'#3B5E8C',B:'#3A2A20'},
 night:{C:'#16161C',W:'#E2B2D8',T:'#C9A227',P:'#16161C',B:'#16161C'},
 nurse:{C:'#F7F7F7',W:'#9AD1E8',T:'#F7F7F7',P:'#F7F7F7',B:'#FFFFFF'},
 apron:{C:'#E7D3A8',W:'#FFFFFF',T:'#8E6B3A',P:'#4A4A55',B:'#3A2A20'},
 elder:{C:'#9C7A54',W:'#E9E1CF',T:'#C9B48A',P:'#6E6457',B:'#3A2A20'},
 tracksuit:{C:'#2C64C6',W:'#FFFFFF',T:'#FFFFFF',P:'#2C64C6',B:'#FFFFFF'},
 stage:{C:'#C42E5E',W:'#F4D35E',T:'#F4D35E',P:'#1E1E24',B:'#1E1E24'},
 pajama:{C:'#A7C7E7',W:'#A7C7E7',T:'#FFFFFF',P:'#A7C7E7',B:'#A7C7E7'},
};
const PX_SKIN=['#FCE3CF','#F6D2B4','#E8B48E','#C98E66'];
const PX_HAIR=['#2A2426','#5A3A26','#8A5A34','#C99A4A','#B9B4AE','#2D3E7A','#C8506A'];
function pxShade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;r=Math.round(r*f);g=Math.round(g*f);b=Math.round(b*f);return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1);}
function pixelChar(o){
  const look=o.look||{},age=o.age||0,sex=look.sex||'M';
  const stage=age<3?'baby':age<12?'kid':age<70?'adult':'elder';
  let outfit=o.outfit||'casual';if(outfit==='school')outfit=sex==='F'?'school_F':'school_M';if(stage==='baby')outfit='baby';if(stage==='kid'&&!PX_OUT[outfit])outfit='kid';
  const pal=Object.assign({},PX_OUT[outfit]||PX_OUT.casual);
  if(outfit==='casual'&&look.shirt)pal.C=look.shirt;
  const skin=PX_SKIN[Math.min(PX_SKIN.length-1,look.sk||0)];
  let hair=look.dye||PX_HAIR[look.hc||0]||PX_HAIR[0];if(stage==='elder')hair='#C9C6C0';
  const col={O:'#1B1A22',S:skin,R:'#F29A9A',H:hair,E:'#1B1A22',M:o.mood==='sad'?'#1B1A22':'#B5443A',W:pal.W,T:pal.T,C:pal.C,c:pxShade(pal.C,.8),P:pal.P,B:pal.B,K:'#7A5230',G:'#C8323C'};
  let style=look.hs||(sex==='F'?'long':'short');if(stage==='baby')style=sex==='F'?'bob':'short';if(stage==='elder'&&sex==='M')style=chanceBald(look)?'bald':'short';
  let rows=pxHair(PX_SPR[stage],style,stage);
  if(stage!=='elder'||!o.cane)rows=rows.map(s=>s.replace(/K/g,'.'));
  // 表情：かなしい→口を下げる、うれしい→目を細く
  if(o.mood==='happy'){rows=rows.map((s,y)=>{const i=s.indexOf('E');return s;});}
  const H=rows.length,W=rows[0].length;let rects='';
  rows.forEach((s,y)=>{let x=0;while(x<W){const ch=s[x];if(ch==='.'){x++;continue;}let w=1;while(x+w<W&&s[x+w]===ch)w++;rects+=`<rect x="${x}" y="${y}" width="${w}" height="1" fill="${col[ch]||'#ff00ff'}"/>`;x+=w;}});
  // ランドセル
  if(stage==='kid'&&age>=6&&age<=11&&o.bag!==false){rects+=`<rect x="0" y="11" width="2" height="4" fill="#1B1A22"/><rect x="0" y="12" width="1" height="2" fill="${col.G}"/>`;}
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" shape-rendering="crispEdges">${rects}</svg>`;
}
function chanceBald(look){return ((look.hc||0)+(look.sk||0))%3===0;}
if(typeof module!=='undefined')module.exports={pixelChar,PX_SPR};
