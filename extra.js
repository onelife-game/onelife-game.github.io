// =====================================================================
// ONE LIFE 拡張：時代・史実の相場・天才・生きづらさ・人生のやり直し
// =====================================================================
// ---- 史実データ（年末値） --------------------------------------------
// 日経平均（年末終値・円）…日本経済新聞社「日経平均プロフィル」ほか。2026年は10月末の暫定値
const HY0=1964;
const H_NK=[1217,1417,1452,1283,1715,2359,1987,2714,5208,4307,3817,4359,4991,4866,6002,6570,7116,7682,8017,9894,11543,13113,18701,21564,30159,38916,23849,22984,16925,17417,19723,19868,19361,15259,13842,18934,13786,10543,8579,10677,11489,16111,17226,15308,8860,10546,10229,8455,10395,16291,17451,19034,19114,22765,20015,23657,27444,28792,26095,33464,39895,50339,63290];
// S&P500 配当込みリターン（%、ドル建て）1965〜。2026年は10月中旬までの暫定値
const H_SPX=[null,12.45,-10.06,23.98,11.06,-8.5,4.01,14.31,18.98,-14.66,-26.47,37.2,23.84,-7.18,6.56,18.44,32.42,-4.91,21.55,22.56,6.27,31.73,18.67,5.25,16.61,31.69,-3.1,30.47,7.62,10.08,1.32,37.58,22.96,33.36,28.58,21.04,-9.1,-11.89,-22.1,28.68,10.88,4.91,15.79,5.49,-37,26.46,15.06,2.11,16,32.39,13.69,1.38,11.96,21.83,-4.38,31.49,18.4,28.71,-18.11,26.29,25.02,17.88,15];
// ドル円（年末・円）。1971年までは固定相場360円
const H_FX=[360,360,360,360,360,360,357.65,315.01,301.66,280.27,301.02,305.16,293.08,239.98,194.3,240.3,203.1,219.8,234.7,231.7,251.6,200.25,158.3,121.25,125.05,143.8,135.75,124.9,124.85,111.7,99.6,103.28,115.77,130.45,113.08,102.16,114.35,131.04,118.75,107.13,102.68,117.88,119.02,111.71,90.79,93.08,81.67,76.98,86.64,105.25,119.85,120.27,116.78,112.69,109.7,108.67,103.19,115.17,131.81,140.92,157.37,156.8,158.02];
// 金（年末・ドル/オンス）。1971年までは公定価格35ドル
const H_GOLD=[35,35,35,35,35,35,37.4,43.6,65.2,112,187,140,135,165,226,512,590,400,448,382,308,327,391,487,410,401,386,353,333,391,383,387,369,290,288,290,274,279,343,417,438,513,632,834,870,1104,1410,1531,1664,1205,1206,1060,1146,1303,1279,1515,1888,1806,1812,2063,2625,4323,4050];
// ビットコイン（年末・ドル）。2010年7月に取引所での売買が始まる
const H_BTC={2009:.08,2010:.3,2011:4.7,2012:13.5,2013:754,2014:320,2015:430,2016:964,2017:14156,2018:3742,2019:7194,2020:29002,2021:46306,2022:16547,2023:42265,2024:93429,2025:87498,2026:80000};
// 消費者物価指数（全国・総合、2020年=100、年平均）…総務省統計局・内閣府「長期経済統計」
const H_CPI=[22.5,23.9,25.1,26.1,27.6,29,30.9,32.9,34.5,38.6,47.5,53.1,58.1,62.8,65.5,67.9,73.2,76.6,78.8,80.3,82.2,83.8,84.3,84.4,85,86.9,89.6,92.6,94.1,95.3,96,95.9,96,97.7,98.3,98,97.3,96.5,95.6,95.3,95.3,95.2,95.5,95.5,96.9,95.5,94.8,94.5,94.5,94.9,97.5,98.2,98.1,98.6,99.5,100,100,99.8,102.3,105.6,108.5,111.9,114];
// 1年定期預金の金利（%、概算）…日本銀行・総務省「日本の長期統計系列」ほか
const H_DEP=[5.5,5.5,5.5,5.5,5.5,5.5,5.5,5.5,5.5,6.25,7.25,6.75,6,5,4,5.25,7,6,5.75,5.5,5.5,5.5,4,3.4,3.4,4.5,6.3,5.7,3.8,2.5,2,.7,.3,.3,.25,.15,.15,.03,.03,.03,.03,.03,.2,.35,.35,.15,.03,.03,.03,.03,.03,.03,.01,.01,.01,.01,.01,.01,.01,.01,.125,.3,.6];
// 東京圏・住宅地の地価変動率（%、その年の動き。国土交通省「地価公示」をもとにした概算）
const H_LAND=[15,15,15,15,15,15,19.9,15.1,35.9,35.4,-11.5,.6,1.7,3.5,8.8,18.3,14.1,7.4,4.1,2.2,1.7,3,21.5,68.6,.4,6.6,6.6,-9.1,-14.7,-8.7,-2.9,-5.5,-4.8,-3,-6,-6.8,-5.8,-5.9,-5.6,-4.7,-3.2,.5,3.6,5.5,-4.4,-4.9,-1.7,-1.6,-.7,.7,.5,.6,.7,1,1.3,1.4,-.5,.6,2.1,3.4,4.2,5,4];
// 実質賃金の水準（2020年=1、毎月勤労統計の実質賃金指数をもとにした概算）
const H_WAGE=[[1964,.52],[1970,.7],[1975,.82],[1980,.86],[1985,.92],[1990,1],[1996,1.07],[2000,1.06],[2005,1.05],[2010,1.03],[2015,.99],[2020,1],[2023,.97],[2026,.96]];
// その年の出来事（ニュース）
const H_NEWS={1965:'いざなぎ景気が始まる',1966:'ビートルズが来日',1967:'公害対策基本法が成立',1968:'日本のGNPが世界2位に',1969:'東名高速道路が全線開通',1970:'大阪万博が開幕',1971:'ニクソン・ショック。円が変動相場制へ',1972:'札幌五輪、沖縄が本土に復帰',1973:'第1次オイルショック。トイレットペーパー騒動',1974:'戦後初のマイナス成長。狂乱物価',1975:'山陽新幹線が博多まで開業',1976:'ロッキード事件',1977:'王貞治が756号本塁打',1978:'成田空港が開港',1979:'第2次オイルショック。ウォークマン発売',1980:'校内暴力が社会問題に',1981:'中国残留孤児が初来日',1982:'東北・上越新幹線が開業',1983:'東京ディズニーランド開園、ファミコン発売',1984:'新しい1万円札（福沢諭吉）が登場',1985:'プラザ合意で円高が急進',1986:'男女雇用機会均等法が施行。バブル景気の始まり',1987:'国鉄が分割民営化。NTT株フィーバー',1988:'青函トンネル・瀬戸大橋が開通。リクルート事件',1989:'平成に改元、消費税3%導入。日経平均が史上最高値38,915円',1990:'株価が暴落。不動産融資の総量規制',1991:'バブル崩壊。ジュリアナ東京が開店',1992:'地価の下落が本格化',1993:'Jリーグ開幕。細川連立内閣が発足',1994:'「就職氷河期」という言葉が流行',1995:'阪神・淡路大震災、地下鉄サリン事件。Windows95発売',1996:'住専問題に公的資金',1997:'消費税5%に。山一證券が自主廃業',1998:'日本長期信用銀行が破綻。長野五輪',1999:'iモード開始。ゼロ金利政策',2000:'ITバブルが崩壊',2001:'小泉内閣が「聖域なき構造改革」',2002:'日韓ワールドカップ',2003:'日経平均がバブル後最安値7,607円',2004:'新潟県中越地震',2005:'郵政民営化選挙',2006:'ライブドア事件',2007:'サブプライム問題が表面化',2008:'リーマン・ショック。年越し派遣村',2009:'政権交代で民主党政権に',2010:'日本のGDPが中国に抜かれ世界3位に',2011:'東日本大震災。計画停電',2012:'東京スカイツリー開業。第2次安倍内閣',2013:'異次元の金融緩和。東京五輪の開催が決定',2014:'消費税8%に。NISAが始まる',2015:'マイナンバー制度が始まる',2016:'マイナス金利政策が始まる',2017:'ビットコインが急騰、「億り人」が話題に',2018:'仮想通貨の巨額流出事件',2019:'令和に改元。消費税10%に',2020:'新型コロナウイルス。緊急事態宣言',2021:'東京五輪が無観客で開催',2022:'急激な円安と物価高',2023:'日経平均がバブル後の最高値を更新',2024:'新NISAが始まる。日経平均が34年ぶりに史上最高値',2025:'日経平均が初めて5万円台に',2026:'日経平均が6万円台に。AI関連株が相場をけん引'};
const HIST_LAST=2026;
const hv=(arr,y)=>arr[y-HY0];
function hasHist(y){return y>=HY0+1&&y<=HIST_LAST;}
function wageMul(y){if(y>HIST_LAST)return 1;let a=H_WAGE[0];for(const p of H_WAGE){if(p[0]<=y)a=p;else{return a[1]+(p[1]-a[1])*(y-a[0])/(p[0]-a[0]);}}return a[1];}
function histRegime(y){
  if([1974,1990,1997,1998,2008,2020].includes(y))return 'crash';
  if((y>=1991&&y<=1995)||[2001,2002,2009,2011].includes(y))return 'slump';
  if((y>=1986&&y<=1989)||(y>=1966&&y<=1970)||[2005,2013,2023,2024,2025,2026].includes(y))return 'boom';
  if(!hasHist(y))return null;
  const r=hv(H_NK,y)/hv(H_NK,y-1)-1;return r>.2?'boom':r<-.2?'crash':r<0?'slump':'normal';
}
// 実質リターン（2026年の価値に換算するため、物価上昇分を差し引く）
function histReturns(y){
  const inf=hv(H_CPI,y)/hv(H_CPI,y-1)-1,real=x=>(1+x)/(1+inf)-1;
  const fxr=hv(H_FX,y)/hv(H_FX,y-1)-1,nk=hv(H_NK,y)/hv(H_NK,y-1)-1;
  const dep=hv(H_DEP,y)/100*(y>=1988?1-.20315:1);
  const world=(1+hv(H_SPX,y)/100)*(1+fxr)-1;
  const gold=hv(H_GOLD,y)/hv(H_GOLD,y-1)*(1+fxr)-1;
  const btc=H_BTC[y]&&H_BTC[y-1]?H_BTC[y]/H_BTC[y-1]*(1+fxr)-1:null;
  return {inf,nk,fxr,world:real(world),teiki:real(dep),kokusai:real(dep+.004),jpidx:real(nk+.015),haito:real(nk*.8+.01),
    ai:real(nk*1.5+rn(.02,.22)),game:real(nk*1.1+rn(0,.2)),bankst:real(nk*1.2+(y>=1990&&y<=2003?-.08:0)+rn(0,.08)),
    gold:real(gold),crypto:btc==null?null:real(btc),fx:Math.max(-1,fxr*25),land:real(hv(H_LAND,y)/100)};
}
// ---- 資産の追加・時代による名前 --------------------------------------
ASSETS.world={n:'米国株インデックス（S&P500）',mu:.05,beta:.9,sd:.13,d:'アメリカの大企業500社に連動。為替の影響も受ける'};
Object.defineProperty(ASSETS.ai,'n',{get(){return S&&S.year<2015?'ハイテク株':'AI・半導体株';}});
function assetAvail(k){const y=S.year;if(k==='crypto')return y>=2010;if(k==='fx')return y>=1998;if(k==='ai')return true;return true;}
function nisaRule(){const y=S.year;if(y<2014)return null;if(y<2024)return {yr:120,life:600,n:'NISA（2014〜2023年の旧制度）'};return {yr:360,life:1800,n:'新NISA（全世界株）'};}

// ---- 相場の1年（史実の年は実データ、未来は確率） ----------------------
const _marketYear=marketYear;
marketYear=function(){
  const y=S.year;
  if(!hasHist(y)){_marketYear();return;}
  const R_=histReturns(y);S.rm=R_.jpidx;S.histR=R_;
  const nr=nisaRule();
  if(S.age>=18&&nr){const room=Math.min(nr.yr-(S.nisa.yr||0),nr.life-S.nisa.used);const v=Math.min(S.nisa.plan,room,Math.max(0,S.cash));if(v>0){pay(v,(nr.yr===120?'NISA':'新NISA')+' 積立');S.nisa.v+=v;S.nisa.basis+=v;S.nisa.used+=v;}}
  S.nisa.yr=0;S.nisa.v*=1+R_.world;
  for(const k in S.port){const a=S.port[k];let r=R_[k];if(r==null)r=0;a.v*=Math.max(k==='fx'?0:.02,1+r);
    if(k==='haito'&&a.v>0){gain(a.v*.025*.8,'配当金（税引後）');}
    if(k==='fx'&&a.v<.3){delete S.port[k];note('FXでロスカットされ、証拠金がすべて消えた。');}}
  S.regime=histRegime(y+1)||wpick(REGIMES[histRegime(y)||'normal'].next);
};
// 家の値段：史実の年は地価の動き（実質）に連動
const _houseGrowth=houseGrowth;
houseGrowth=function(h){if(!hasHist(S.year))return _houseGrowth(h);const r=histReturns(S.year).land;return Math.max(.6,1+r*.85-.012+rn(0,.02));};
newsNow=function(){return H_NEWS[S.year]||pick(REGIMES[S.regime].news);};
// 給料は時代の実質賃金に合わせる
const _jobIncome=jobIncome;
jobIncome=function(){return _jobIncome()*wageMul(S.year);};
// 就職のしやすさ（売り手市場・氷河期）
let _NG=false;
function eraJobMod(){const y=S.year;let m=0;
  if(y>=1986&&y<=1991)m=_NG?.25:.1;else if(y>=1993&&y<=2005)m=_NG?-.28:-.1;else if(y>=2009&&y<=2013)m=_NG?-.15:-.06;else if((y>=2014&&y<=2019)||(y>=2022&&y<=2026))m=_NG?.12:.04;else if(y>=1974&&y<=1976)m=-.08;
  if(S.conds&&S.conds.includes('fuun'))m-=.1;return m;}
const _jobChance=jobChance;
jobChance=function(j){return clamp(_jobChance(j)+eraJobMod(),.02,.97);};
const _evOffers=evOffers;
evOffers=function(t,ng){_NG=!!ng;try{return _evOffers(t,ng);}finally{_NG=false;}};
// 時代に存在しない仕事
const _reqCreator=JOBS.creator.req,_reqGig=JOBS.gig.req;
JOBS.creator.req=S=>S.year>=2008&&_reqCreator(S);
JOBS.gig.req=S=>S.year>=2016&&_reqGig(S);
JOBS.giin={n:'国会議員',cat:'専門職',base:2170,gr:0,cap:2170,st:9,diff:999,req:()=>false,of:'suit'};
JOBS.kishi={n:'プロ棋士',cat:'芸能',base:600,gr:40,cap:3000,st:6,diff:999,req:()=>false,of:'suit'};
JOBS.shogai={n:'障害者雇用（事務・IT）',cat:'正社員',base:260,gr:6,cap:420,st:2,diff:0,req:S=>S.conds&&S.conds.some(c=>['asd','adhd','byoki'].includes(c)),rq:'障害者手帳など',of:'office'};

// ---- 投資画面：その年に買えないものを止める ---------------------------
const _investSheet=investSheet;
investSheet=function(){
  _investSheet();
  const ov=[...document.querySelectorAll('.ov')].pop();if(!ov)return;
  ov.querySelectorAll('[data-buy]').forEach(b=>{if(!assetAvail(b.dataset.buy)){b.disabled=true;}});
  ov.querySelectorAll('.inv').forEach(box=>{const b=box.querySelector('[data-buy]');if(b&&!assetAvail(b.dataset.buy)){const n=box.querySelector('.note');if(n)n.innerHTML=b.dataset.buy==='crypto'?'<b>まだこの世に存在しない（ビットコインの取引が始まるのは2010年）</b>':'<b>個人向けFXが解禁されるのは1998年</b>';}});
  const nr=nisaRule(),nb=ov.querySelector('.inv');
  if(nb&&!nr){nb.querySelector('.ih b').textContent='NISA（まだない）';nb.querySelectorAll('button').forEach(x=>x.disabled=true);const n=nb.querySelector('.note');if(n)n.innerHTML='非課税で投資できるNISAが始まるのは2014年。';}
  else if(nb&&nr&&nr.yr===120){nb.querySelector('.ih b').textContent=nr.n;const n=nb.querySelector('.note');if(n)n.innerHTML=`非課税。年120万円まで、合計600万円まで（当時の制度）。${infoLink('nisa')}`;}
  if(hasHist(S.year)){const p=ov.querySelector('.src');if(p)p.innerHTML+=`<br>${S.year}年の相場は史実どおりに動く（日経平均・S&P500・ドル円・金・ビットコイン・預金金利の実データ）。金額はすべて2026年の価値に換算している。`;}
  else if(S.year>HIST_LAST){const p=ov.querySelector('.src');if(p)p.innerHTML+=`<br>${HIST_LAST+1}年より先の相場は、誰にもわからない（確率で動く）。`;}
};

// ---- 時代 -------------------------------------------------------------
const ERAS={
 bubble:{n:'バブル世代',y:1965,d:'1965年生まれ。高度成長期に育ち、22歳でバブル景気のど真ん中へ',p:240},
 hyoga:{n:'就職氷河期世代',y:1975,d:'1975年生まれ。卒業の年、求人倍率は過去最低。山一證券が消える',p:240},
 heisei:{n:'平成元年生まれ',y:1989,d:'1989年生まれ。バブル崩壊とともに育ち、就活の年に東日本大震災',p:240},
 now:{n:'令和の東京',y:2008,d:'2008年生まれ。18歳で今（2026年）を迎え、その先は誰も知らない',p:0},
 future:{n:'未来の東京',y:2045,d:'2045年生まれ。AI、自動運転、人口減少、首都直下地震の確率70%',p:240},
};
// ---- 天才（特殊な才能） ------------------------------------------------
const GIFTS={
 sport:{n:'スポーツの天才',d:'体の使い方が人と違う。走れば誰より速い',talent:'sport',st:{health:15},grow:['health']},
 voice:{n:'歌の天才',d:'一度聴いたら忘れられない声を持って生まれた',talent:'music',st:{charm:10,skill:5},grow:['skill','charm']},
 brain:{n:'頭脳の天才（IQ160）',d:'教科書は一度読めば覚えてしまう',talent:'study',st:{study:20},grow:['study']},
 art:{n:'絵の天才',d:'3歳で描いた絵に、大人が言葉を失う',talent:'art',st:{skill:12},grow:['skill']},
 beauty:{n:'圧倒的な美貌',d:'街を歩けば必ず振り返られる',talent:'looks',st:{charm:35},grow:['charm']},
 talk:{n:'天性の話術',d:'誰とでも5分で打ち解ける',talent:'talk',st:{comm:25},grow:['comm']},
 shogi:{n:'将棋の天才',d:'5歳で大人に勝つ',talent:'study',st:{study:10,skill:8},grow:['study','skill']},
};
// ---- 生きづらさ（ハードモード） ---------------------------------------
const CONDS={
 katoya:{n:'ひとり親の家',d:'物心ついた時から、親はひとりだけ'},
 fuantei:{n:'親の仕事がとても不安定',d:'日雇い・無職。給料日前は食べるものがない'},
 byoki:{n:'持病を持って生まれる',d:'生まれつき心臓が弱い。体力の上限が低く、通院が続く'},
 asd:{n:'自閉スペクトラム症',d:'人付き合いは苦手。でも好きなことへの集中力は誰にも負けない'},
 adhd:{n:'ADHD（注意欠如・多動症）',d:'忘れ物と衝動買いが多い。発想力と行動力は人一倍'},
 fuun:{n:'とことん運がない',d:'事故・詐欺・災難が人の倍やってくる。採用もされにくい'},
};
// ---- 親の職業 ----------------------------------------------------------
const PJOBS=[
 ['おまかせ',null],['医師',3],['弁護士',3],['会社経営者',4],['国会議員',4],['芸能人',3],['元プロ野球選手',3],['寿司屋の大将',2],['学校の先生',2],['公務員',2],['会社員',2],['トラック運転手',1],['スナック経営',1],['日雇い労働者',0],['自称パチプロ',0],['無職',0]];

// ---- 成長：天才は伸びやすく、特性によって伸び方が変わる ----------------
mod=function(o){for(const k in o){let v=o[k];if(!isFinite(v))continue;
  if(v>0&&GROW.includes(k)){const c=S.st[k];let f=c<30?1:c<50?.65:c<65?.4:c<80?.22:.1;
    const G=S.gift&&GIFTS[S.gift];if(G&&G.grow.includes(k))f=Math.max(f,.85)*1.3;
    if(S.conds){if(S.conds.includes('asd')){if(k==='comm')f*=.45;if(k==='study'||k==='skill')f*=1.35;}if(S.conds.includes('adhd')){if(k==='study')f*=.75;if(k==='skill')f*=1.2;}}
    v*=f;}
  if(v<0&&S.conds&&S.conds.includes('fuun')&&(k==='mental'||k==='health'))v*=1.2;
  S.st[k]=clamp(S.st[k]+v,0,100);}
  if(S.conds&&S.conds.includes('byoki'))S.st.health=Math.min(S.st.health,72);};
// 持病の通院費・ADHDの衝動買い
const _yearlyExpense=yearlyExpense;
yearlyExpense=function(){let e=_yearlyExpense();if(S.conds){if(S.conds.includes('byoki'))e+=8;if(S.conds.includes('adhd')&&S.age>=18&&!S.flags.adhdMed)e+=livingBase()*.08;}return e;};
const _yearBody=yearBody;
yearBody=function(){_yearBody();if(S.conds&&S.conds.includes('byoki')){S.st.health=Math.min(S.st.health,72);if(S.age>=18)pay(8,'通院・薬代');}if(S.conds&&S.conds.includes('adhd')&&S.age>=18&&!S.flags.adhdMed)pay(livingBase()*.08,'衝動買い');};

// ---- 出来事：時代でのしばり・運のなさ ----------------------------------
const _eligible=eligible;
eligible=function(d){if(d.y&&(S.year<d.y[0]||S.year>d.y[1]))return false;if(d.era&&!d.era.includes(S.era||'now'))return false;return _eligible(d);};
const BAD_EV=['accident','fire_quake','akisu','romance_scam','invest_scam','layoff','kenko','cancer','friend_borrow','oreore','spouse_affair','partner_fight','kid_trouble','rentup','jiko_kid','maigo','ijime_victim','parent_risutora','sibling_money','mental_down'];
const _buildEvents=buildEvents;
buildEvents=function(first){
  for(const d of DEFS){if(d._w0==null)d._w0=d.w;let w=d._w0;
    if(S.conds){if(S.conds.includes('fuun')&&BAD_EV.includes(d.id))w*=2.5;if(S.conds.includes('asd')&&['ijime_victim','futoko','mental_down'].includes(d.id))w*=1.8;if(S.conds.includes('adhd')&&['gamble_addict','gamble_inv','drink_adult','jobwork'].includes(d.id))w*=2;}
    d.w=w;}
  return _buildEvents(first);};
// 今の時代にしかない出来事は、その年からに限る
[['smartphone',[2010,9999]],['youtuber',[2012,9999]],['sns_trouble',[2006,9999]],['romance_scam',[2005,9999]],['yami_dm',[2015,9999]],['yami_trap',[2015,9999]]].forEach(([id,y])=>{const d=DEFS.find(x=>x.id===id);if(d)d.y=y;});
const _minorEvents=minorEvents;
minorEvents=function(){_minorEvents();
  if(S.conds&&S.conds.includes('fuun')&&S.age>=6&&chance(.35))S.notes.push(pick(['財布を落とした。','買ったばかりの傘を電車に忘れた。','自転車を盗まれた。','大事な日に限って熱が出た。','乗った電車が人身事故で2時間止まった。','スマホが水没した。','宝くじの番号が1つ違いだった。']));
  if(S.conds&&S.conds.includes('adhd')&&S.age>=6&&chance(.3))S.notes.push(pick(['また忘れ物をした。','締め切りを1日勘違いしていた。','鍵をなくして、家に入れなかった。','夢中になって、気づいたら朝だった。']));
};
// 年のはじめにニュースを1行
const _startYear=startYear;
startYear=function(first){
  if(!first&&S&&!S.ended)takeSnap();
  _startYear(first);
  if(!first&&H_NEWS[S.year-1]&&S.prevNotes)S.prevNotes.unshift(`【${S.year-1}年のニュース】${H_NEWS[S.year-1]}`);
};

// ---- 人生のやり直し（スナップショット） --------------------------------
const SNAP_KEY='tkk2-snaps';let SNAPS=[];
function takeSnap(){
  try{const s=JSON.stringify(S);SNAPS.push({age:S.age,year:S.year,s});
    SNAPS=SNAPS.filter((x,i)=>x.age%5===0||i>=SNAPS.length-3);
    try{localStorage.setItem(SNAP_KEY,JSON.stringify(SNAPS));}catch(e){SNAPS=SNAPS.filter(x=>x.age%10===0).concat(SNAPS.slice(-2));try{localStorage.setItem(SNAP_KEY,JSON.stringify(SNAPS));}catch(e2){}}
  }catch(e){}
}
function loadSnaps(){try{SNAPS=JSON.parse(localStorage.getItem(SNAP_KEY)||'[]');}catch(e){SNAPS=[];}}
loadSnaps();
function redoSheet(){
  if(!SNAPS.length){toast('戻れる年がない');return;}
  const list=SNAPS.slice().reverse().filter((x,i,a)=>a.findIndex(z=>z.age===x.age)===i);
  sheet('人生をやり直す',`<p class="note">あの年から、もう一度。そこから先の出来事は、また違うものになる。</p>`,
    list.map(x=>({t:`${x.age}歳（${x.year}年）に戻る`,f:()=>{
      S=JSON.parse(x.s);S.ended=false;SNAPS=SNAPS.filter(z=>z.age<x.age);META.redo=(META.redo||0)+1;saveMeta();
      document.querySelectorAll('.ov').forEach(o=>o.remove());TAB='year';$('#title').classList.add('hidden');
      log(`（${x.age}歳から、人生をやり直した）`);_startYear();render();}})));
}
const _endLife=endLife;
endLife=function(cause){_endLife(cause);
  const ov=[...document.querySelectorAll('.ov')].pop();if(!ov)return;const mb=ov.querySelector('.mb');if(!mb||!SNAPS.length)return;
  const b=document.createElement('button');b.className='op yl';b.innerHTML='人生をやり直す<small>好きな年齢に戻って、そこからもう一度</small>';b.onclick=()=>{ov.remove();redoSheet();};mb.prepend(b);};

// ---- 生まれを選ぶ（時代・親の職業・才能・生きづらさ） --------------------
pickBirth=function(){
  const seg=(id,items,on)=>`<div class="seg sm" id="${id}">${items.map(([v,t])=>`<button data-v="${v}" class="${v===on?'on':''}">${t}</button>`).join('')}</div>`;
  const pjSel=id=>`<select id="${id}" class="psel">${PJOBS.map(([n,r],i)=>`<option value="${i}">${n}${r!=null?`（${RANKS[r]}）`:''}</option>`).join('')}</select>`;
  sheet('生まれを選ぶ',`<p class="src">時代・家・才能などを選べる。選ばなかった項目はランダムで決まる。</p>
  <div class="lab">時代</div><div id="pE">${Object.entries(ERAS).map(([k,e])=>`<button class="op ${k==='now'?'on':''}" data-e="${k}">${e.n}<small>${e.d}</small></button>`).join('')}</div>
  <div class="lab">性別</div>${seg('pS',[['r','ランダム'],['M','男'],['F','女']],'r')}
  <div class="lab">家庭の経済状況</div>${seg('pR',[['r','ランダム']].concat(RANKS.map((r,i)=>[String(i),r])),'r')}
  <div class="lab">生まれた場所</div>${seg('pP',[['r','ランダム'],['23ku','東京23区'],['tama','東京郊外'],['local','地方']],'r')}
  <div class="lab">父の職業</div>${pjSel('pF')}<div class="lab">母の職業</div>${pjSel('pM')}
  <div class="lab">特別な才能（天才として生まれる）</div><div id="pG"><button class="op on" data-g="">なし（ふつうの人間）<small>才能はランダムに1つ</small></button>${Object.entries(GIFTS).map(([k,g])=>`<button class="op" data-g="${k}">${g.n}<small>${g.d}</small></button>`).join('')}</div>
  <div class="lab">生きづらさ（ハードモード・いくつでも）</div><div id="pC">${Object.entries(CONDS).map(([k,c])=>`<button class="op" data-c="${k}">${c.n}<small>${c.d}</small></button>`).join('')}<button class="op" data-c="rand">どれかがランダムで付く<small>何を背負うかは、生まれてみるまでわからない</small></button></div>
  <style>.psel{width:100%;padding:10px;border:2px solid var(--ink);background:#fff;font:inherit;font-size:14px;margin-bottom:4px}#pE .op.on,#pG .op.on,#pC .op.on{background:var(--yellow);border-width:3px}</style>`,
  [{t:'この生まれで始める',f:ov=>{
    const v=id=>{const b=ov.querySelector(id+' .on');return b?b.dataset.v:'r';};
    const era=ov.querySelector('#pE .on').dataset.e,gift=ov.querySelector('#pG .on').dataset.g||null;
    let conds=[...ov.querySelectorAll('#pC .on')].map(b=>b.dataset.c);
    if(conds.includes('rand')){conds=conds.filter(c=>c!=='rand');const pool=Object.keys(CONDS).filter(c=>!conds.includes(c));conds.push(pick(pool));if(chance(.3)){const p2=pool.filter(c=>!conds.includes(c));if(p2.length)conds.push(pick(p2));}}
    const o={era,gift,conds,pf:+ov.querySelector('#pF').value,pm:+ov.querySelector('#pM').value};
    if(v('#pS')!=='r')o.sex=v('#pS');if(v('#pR')!=='r')o.rank=+v('#pR');if(v('#pP')!=='r')o.place=v('#pP');
    start(o);}}],
  ov=>{
    ov.querySelectorAll('.seg').forEach(sg=>sg.querySelectorAll('button').forEach(b=>b.onclick=()=>{sg.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');upd();}));
    ov.querySelectorAll('#pE .op').forEach(b=>b.onclick=()=>{ov.querySelectorAll('#pE .op').forEach(x=>x.classList.remove('on'));b.classList.add('on');upd();});
    ov.querySelectorAll('#pG .op').forEach(b=>b.onclick=()=>{ov.querySelectorAll('#pG .op').forEach(x=>x.classList.remove('on'));b.classList.add('on');upd();});
    ov.querySelectorAll('#pC .op').forEach(b=>b.onclick=()=>{b.classList.toggle('on');upd();});
    ov.querySelectorAll('select').forEach(s=>s.onchange=upd);
    function upd(){}
    upd();
  });
};
function calcPrice(ov){let p=0;const on=s=>ov.querySelector(s+' .on');
  const e=on('#pE');if(e)p+=ERAS[e.dataset.e].p;
  if(['#pS','#pR','#pP'].some(s=>on(s)&&on(s).dataset.v!=='r')||+ov.querySelector('#pF').value||+ov.querySelector('#pM').value)p+=160;
  const g=on('#pG');if(g&&g.dataset.g)p+=360;return p;}
// 生まれたあとに、選んだ条件をあてはめる
const _start=start;
start=function(o){
  o=o||{};
  if(!o.era&&o.era!==''){/* ふつうの乗車：今の時代・まれに天才や生きづらさがランダムで付く */
    o.era='now';if(chance(.04))o.gift=pick(Object.keys(GIFTS));if(chance(.12))o.conds=[pick(Object.keys(CONDS))];}
  SNAPS=[];try{localStorage.removeItem(SNAP_KEY);}catch(e){}
  _BO=o;try{_start(o);}finally{_BO=null;}birthExtra(o);render();
};
let _BO=null;
const _newState=newState;
newState=function(o){const st=_newState(o);if(_BO){const prev=S;S=st;try{applyBirth(_BO);}finally{S=prev;}}return st;};
function applyBirth(o){
  const era=ERAS[o.era]||ERAS.now;S.era=o.era;
  S.year=era.y;S.birthY=era.y;
  const f=S.fam;S.conds=(o.conds||[]).slice();S.gift=o.gift||null;
  // 生きづらさ
  if(S.conds.includes('katoya')&&f.struct==='both'){if(o.pf&&!o.pm?false:o.pm&&!o.pf?true:chance(.8)){f.father=null;f.struct='single_m';}else{f.mother=null;f.struct='single_f';}f.sibs=f.sibs.filter(s=>s.older);if(o.rank==null)f.rank=Math.min(f.rank,1);f.money=RANK_MONEY[f.rank];}
  // 親の職業
  const setPJ=(p,i)=>{if(!p||!i)return;p.job=PJOBS[i][0];S.pj=(S.pj||[]).concat(PJOBS[i][0]);};
  if(o.pf){if(!f.father&&!S.conds.includes('katoya')){f.father=mkParentLike('M',f);f.struct=f.mother?'both':'single_f';}setPJ(f.father,o.pf);}
  if(o.pm){if(!f.mother&&!S.conds.includes('katoya')){f.mother=mkParentLike('F',f);f.struct=f.father?'both':'single_m';}setPJ(f.mother,o.pm);}
  if(o.pf||o.pm){const rs=[o.pf,o.pm].filter(Boolean).map(i=>PJOBS[i][1]);if(o.rank==null)f.rank=Math.max(...rs);f.money=RANK_MONEY[f.rank];}
  if(S.conds.includes('fuantei')){if(o.rank==null)f.rank=0;f.money=RANK_MONEY[0];parents().forEach(p=>{if(!o.pf&&!o.pm)p.job=pick(['日雇い労働者','無職','自称パチプロ','期間工']);if(chance(.5))p.pers=pick(['気分屋','酒癖が悪い','放任主義']);p.debt=true;});}
  if(S.conds.includes('byoki')){S.st.health=Math.min(S.st.health,55);}
  if(S.conds.includes('asd')){S.st.comm=Math.max(0,S.st.comm-6);S.st.study+=4;}
  if(S.conds.includes('adhd')){S.st.skill+=4;}
  // 天才
  if(S.gift){const G=GIFTS[S.gift];S.talent=G.talent;for(const k in G.st)S.st[k]=clamp(S.st[k]+G.st[k],0,100);if(S.gift==='beauty')S.look.sk=Math.min(S.look.sk,1);}
  S.birthRank=f.rank;
  if(S.year!==2008)S.regime=histRegime(S.year)||'normal';
}
function birthExtra(o){const era=ERAS[S.era]||ERAS.now;
  // 誕生のことば
  const b=S.queue.find(q=>q.id==='birth');
  if(b){    let extra=`<br><br>時代：<b>${era.n}</b>（${era.d}）`;
    if(S.gift)extra+=`<br><span style="color:#c08a00"><b>★ ${GIFTS[S.gift].n}</b></span>として生まれた。${GIFTS[S.gift].d}。`;
    if(S.conds.length)extra+=`<br><span style="color:var(--red)">背負うもの：${S.conds.map(c=>CONDS[c].n).join('、')}</span>`;
    b.tx+=extra;}
  if(S.gift)log(`${GIFTS[S.gift].n}として生まれる`);
}
function mkParentLike(sx,f){const ln=S.last;return {name:ln+' '+(sx==='M'?pick(OLDM):pick(OLDF)),sex:sx,age:sx==='M'?28+Math.floor(R()*10):26+Math.floor(R()*8),alive:true,job:'会社員',pers:pick(PARENT_PERS.filter(p=>p!=='酒癖が悪い')),look:Object.assign(newLook(sx),{hs:sx==='M'?'short':'bob'}),close:65,care:false,debt:false};}

// =====================================================================
// 時代の出来事（史実）
// =====================================================================
const G_=k=>S.gift===k, C_=k=>S.conds&&S.conds.includes(k), PJ_=n=>S.pj&&S.pj.includes(n);
D('h_tdl',{a:[3,14],y:[1983,1984],w:6,mk:()=>E('1983年','千葉に「東京ディズニーランド」ができた。クラスの話題はそればかりだ。',[
  O('親に連れて行ってとせがむ',()=>{if(S.fam.rank>=2){mod({mental:8});livingParents().forEach(p=>p.close+=6);return '開園してすぐ、家族で行った。一生忘れない一日になった。';}mod({mental:-3});return '「うちにはそんなお金はない」と言われた。';}),
  O('友達の話を聞くだけにする',()=>{mod({comm:2});return 'お土産のクッキーを一枚もらった。';})])});
D('h_famicom',{a:[6,14],y:[1983,1987],w:5,mk:()=>E('ファミコン','友達の家で「ファミリーコンピュータ」を見た。スーパーマリオに夢中になった。',[
  O('誕生日に買ってもらう',()=>{if(S.fam.rank>=1){mod({mental:6,skill:2});S.flags.game=1;return '毎日1時間の約束は、3日で破られた。';}return '買ってもらえなかった。';}),
  O('友達の家に通いつめる',()=>{mod({comm:4});friends().forEach(f=>f.close+=5);return '友達の家が、放課後の居場所になった。';}),
  O('外で遊ぶほうが好き',()=>{mod({health:4});return '缶けりと秘密基地の毎日。';})])});
D('h_bubble',{a:[20,70],y:[1987,1990],w:8,mk:()=>E('バブル',`${S.year}年。景気は青天井。タクシーを止めるのに1万円札を振る人がいる。会社の経費で毎晩飲み歩き、「土地は絶対に下がらない」と誰もが言う。${infoLink('kinri')}`,[
  O('ディスコと飲み会で遊びまくる',()=>{pay(Math.min(Math.max(S.cash,0),80),'ディスコ・飲み代');mod({mental:10,comm:5,health:-4});addPerson('friend','バブルの遊び仲間',{age:S.age});return '六本木で朝まで踊った。お金はいくらでも稼げる気がした。';}),
  O('株を買い増す（日本株インデックスに300万円）',()=>{const v=Math.min(300,Math.max(0,S.cash));if(v<=0)return '買うお金がなかった。';pay(v,'日本株インデックスを購入');S.port.jpidx=S.port.jpidx||{v:0,basis:0};S.port.jpidx.v+=v;S.port.jpidx.basis+=v;return `${yen(v)}分の株を買った。日経平均は4万円を目指していた。`;},'',S.age>=22),
  O('マンションを買う（ローンで）',()=>{houseSheet();return null;},'',S.age>=24),
  O('浮かれずに預金しておく',()=>{mod({moral:2});return '定期預金の金利は6%近い。それで十分だと思った。';})])});
D('h_hyoga',{a:[21,23],y:[1993,2005],m:true,c:()=>S.job.id==='student'&&S.uni>0&&!S.flags.hyoga,mk:()=>{S.flags.hyoga=1;return E('就職氷河期',`${S.year}年。大卒の求人は激減した。説明会に行っても「今年は採用を見送ります」。100社受けて内定ゼロの先輩もいる。`,[
  O('とにかく正社員を目指して100社受ける',()=>{mod({mental:-8});S.queue.unshift(evOffers('エントリーシートを100枚書いた。結果は……',true));return null;}),
  O('派遣社員として働きながら探す',()=>{setJob('freeter');S.flags.hakenGen=1;return '「いつか正社員に」と思いながら、派遣で働き始めた。';}),
  O('公務員試験に賭ける',()=>{if(S.st.study+R()*30>70){setJob('koumuin');S.mood='happy';return '倍率30倍の区役所に合格した。';}setJob('none');mod({mental:-10});return '不合格。浪人することになった。';}),
  O('大学院に逃げる',()=>{S.edu={n:'大学院',left:2,cost:60,kind:'uni'};mod({study:5});return '2年間、景気が良くなるのを待つことにした。';})]);}});
D('h_hakai',{a:[22,64],y:[1997,1998],m:true,c:()=>['bank','shosha','maker','sales','fudosan','ad'].includes(S.job.id)&&chance(.3),mk:()=>E('金融危機',`${S.year}年。勤め先の経営が行き詰まった。社長が涙ながらに会見する映像が、何度もテレビに流れた。`,[
  O('退職金をもらって次を探す',()=>{gain(Math.round(S.job.salary*.8),'退職金');setJob('none');S.unemp=S.job.salary*.5;S.queue.push(evOffers('ハローワークに通った。',false));return '会社がなくなった。';}),
  O('最後まで残務処理をする',()=>{mod({moral:6,mental:-10});setJob('none');addPerson('friend','同じ会社の戦友',{age:S.age});return '最後の日、同僚と居酒屋で泣いた。';})])});
D('h_lehman',{a:[20,64],y:[2008,2009],m:true,c:()=>(['非正規','正社員'].includes(J().cat))&&chance(J().cat==='非正規'?.4:.12),mk:()=>E('リーマン・ショック',J().cat==='非正規'?'派遣元から電話が来た。「来月で契約終了です」。寮も出なければならない。':'会社が「希望退職」を募集し始めた。上司から面談に呼ばれた。',[
  O('受け入れて次を探す',()=>{setJob('none');S.unemp=60;S.queue.push(evOffers('年明け、求人を探した。',false));return '年末、日比谷公園に「年越し派遣村」ができたとニュースで見た。';}),
  O('しがみつく',()=>{if(chance(.5)){S.job.salary*=.85;return '給料は下がったが、残れた。';}setJob('none');return '結局、契約は切られた。';})])});
D('h_btc',{a:[15,85],y:[2011,2013],w:5,mk:()=>E('ネットの噂',`ネット掲示板で「ビットコイン」という謎の電子のお金が話題になっている。1枚${H_BTC[S.year-1]<1?'数十円':'数百円'}。「どうせ詐欺だろ」というコメントが並ぶ。`,[
  O('1万円分だけ買ってみる',()=>{pay(1,'ビットコインを購入');S.port.crypto=S.port.crypto||{v:0,basis:0};S.port.crypto.v+=1;S.port.crypto.basis+=1;S.flags.earlyBtc=1;return 'よくわからないまま、1万円分を買ってパスワードをメモした。';}),
  O('10万円分買う',()=>{if(S.cash<10)return 'そんなお金はなかった。';pay(10,'ビットコインを購入');S.port.crypto=S.port.crypto||{v:0,basis:0};S.port.crypto.v+=10;S.port.crypto.basis+=10;S.flags.earlyBtc=1;return '10万円を、得体の知れないものに入れた。';}),
  O('怪しいので無視する',()=>'くだらない、と画面を閉じた。'),
  O('マイニングを始める',()=>{pay(5,'パソコンの電気代');S.port.crypto=S.port.crypto||{v:0,basis:0};S.port.crypto.v+=3;S.port.crypto.basis+=0;S.flags.earlyBtc=1;mod({skill:4});return 'パソコンをつけっぱなしにして、ビットコインを掘った。';},'',S.st.skill>=40)])});
D('h_btc17',{a:[18,85],y:[2017,2017],w:6,mk:()=>E('億り人',`同僚が「ビットコインで1億円稼いだ人がいる」と興奮している。1枚${yen(Math.round(14000*112/10000))}を超えた。今からでも間に合う、とネットは言う。`,[
  O('100万円分買う',()=>{if(S.cash<100)return '100万円もなかった。';pay(100,'ビットコインを購入');S.port.crypto=S.port.crypto||{v:0,basis:0};S.port.crypto.v+=100;S.port.crypto.basis+=100;return '年末、最高値近くで買った。';}),
  O('持っているビットコインを全部売る',()=>{if(!S.port.crypto||S.port.crypto.v<=0)return '持っていなかった。';const v=S.port.crypto.v;sellAsset('crypto',v);log('ビットコインを売って大金を得る');return `${yen(v)}で売り抜けた。`;},'',S.port.crypto&&S.port.crypto.v>0),
  O('見送る',()=>'バブルだ、と思って見送った。')])});
D('h_311',{a:[6,95],y:[2011,2011],m:true,mk:()=>E('2011年3月11日','午後2時46分、東京も大きく揺れた。電車は止まり、街は家に帰れない人であふれた。',[
  O('何時間もかけて歩いて帰る',()=>{mod({health:-3,mental:-6});return '国道を、知らない人たちと列になって歩いた。家に着いたのは夜中だった。';}),
  O('会社や学校に泊まる',()=>{mod({mental:-4});friends().forEach(f=>f.close+=4);return '床に段ボールを敷いて、みんなで朝を待った。';}),
  O('家族の安否を確かめ続ける',()=>{livingParents().forEach(p=>p.close+=10);if(S.spouse)S.spouse.close+=10;mod({mental:-5});return '電話がつながらない。メールが届いたのは夜だった。';}),
  O('落ち着いたら被災地へボランティアに行く',()=>{mod({moral:10,mental:-4,comm:3});pay(3,'ボランティアの交通費');return '夏、東北で泥かきをした。';},'',S.age>=16)])});
D('h_corona',{a:[6,95],y:[2020,2020],m:true,mk:()=>{gain(10,'特別定額給付金');const hit=['night','chef','shop','freeter','apparel','dream','taxi'].includes(S.job.id);return E('コロナ','緊急事態宣言。街から人が消えた。マスクは店頭から消え、1人10万円の給付金が配られた。',[
  O(hit?'客が消えた。耐える':'リモートワークに切り替える',()=>{if(hit){S.job.salary*=.7;if(S.shop){S.shop.loss+=150;}mod({mental:-10});return '売上は半分以下になった。';}mod({mental:3});return '満員電車に乗らなくてよくなった。';}),
  O('家族と過ごす時間を増やす',()=>{if(S.spouse)S.spouse.close+=8;S.kids.forEach(k=>k.close+=8);mod({mental:4});return '家で料理をするようになった。';}),
  O('この機会に投資を始める',()=>{S.nisa.plan=Math.max(S.nisa.plan,12);return 'つみたて投資を始めた。株価は、すぐに戻った。';},'',S.age>=20)]);}});
D('h_pager',{a:[13,22],y:[1993,1999],w:4,mk:()=>E('ポケベル','クラスでポケベルが流行っている。「0840（おはよう）」「14106（あいしてる）」。数字で気持ちを伝える時代だ。',[
  O('持つ',()=>{pay(1,'ポケベル');mod({comm:4});friends().forEach(f=>f.close+=4);return '公衆電話に並んで、メッセージを打った。';}),
  O('いらない',()=>'興味がなかった。')])});
D('h_keitai',{a:[12,25],y:[2000,2009],w:4,mk:()=>E('ケータイ','iモード、写メ、着メロ。ケータイが生活の中心になった。月のパケット代がとんでもないことになっている。',[
  O('パケ放題に入る',()=>{pay(5,'携帯代');mod({comm:4});return 'メールを1日100通送った。';}),
  O('パケット代を気にせず使う',()=>{pay(S.age<18?3:20,'高額なパケット代');famMoneyAdj(-3);return '請求書を見て、親が絶句した。';}),
  O('あまり使わない',()=>{mod({study:2});return '持ってはいるが、ほとんど鳴らない。';})])});
// 未来の東京（2027年以降）
D('f_ai',{a:[22,64],y:[2030,9999],w:4,cd:30,c:()=>['正社員','専門職','公務員'].includes(J().cat)&&!['nurse','kaigo','hoiku','doctor','tobi','chef','biyoshi','police','fire'].includes(S.job.id),mk:()=>E('AI',`${S.year}年。AIエージェントが、あなたの仕事の大半をこなせるようになった。会社は「人員の最適化」を発表した。`,[
  O('AIを使いこなす側に回る',()=>{if(S.st.skill+R()*40>70){S.job.salary*=1.25;return 'AIに指示を出す側になり、給料が上がった。';}S.job.salary*=.85;return 'うまく使いこなせなかった。';}),
  O('人にしかできない仕事に移る',()=>{setJob(pick(['kaigo','hoiku','chef']));return '人と向き合う仕事に転職した。';}),
  O('しがみつく',()=>{if(chance(.5)){setJob('none');S.unemp=80;return '部署ごとなくなった。';}S.job.salary*=.8;return '給料は大きく下がった。';})])});
D('f_auto',{a:[22,70],y:[2035,9999],m:true,c:()=>['driver','taxi'].includes(S.job.id)&&chance(.3),mk:()=>E('自動運転','無人の自動運転トラックとタクシーが、都内を走り始めた。運転手の求人が消えていく。',[
  O('遠隔監視オペレーターに転身する',()=>{setJob('keibi');return 'モニターの前で、無人の車を見守る仕事に就いた。';}),
  O('最後まで運転を続ける',()=>{S.job.salary*=.7;return '仕事は半分になった。';})])});
D('f_quake',{a:[0,99],y:[2027,9999],w:1,cd:99,c:()=>chance(.25),mk:()=>{mod({mental:-15,health:-5});if(S.house)S.house.value*=.75;return E('首都直下地震',`${S.year}年。ついに首都直下地震が来た。政府は「30年以内に70%程度」と言い続けていた。`,[
  O('避難所で暮らす',()=>{pay(Math.min(Math.max(S.cash,0),50),'生活の立て直し');return '体育館で3週間を過ごした。';}),
  O('地方の親戚を頼る',()=>{pay(20,'避難の費用');return 'しばらく東京を離れた。';}),
  O('地震保険で建て直す',()=>{if(S.house){gain(S.house.value*.15,'地震保険金');}return '保険金で、なんとか家を直した。';},'',!!S.house)]);}});
D('f_nenkin',{a:[60,65],era:['future'],m:true,c:()=>!S.flags.fNenkin,mk:()=>{S.flags.fNenkin=1;return E('年金',`${S.year}年。少子高齢化が進み、年金の水準は親の世代よりも2割ほど低い。「年金だけで暮らせる時代」は、とっくに終わっていた。${infoLink('nenkin')}`,[
  O('75歳まで働くと決める',()=>{S.flags.workLong=1;return '働けるうちは働く。';}),
  O('資産を取り崩して暮らす',()=>'貯めてきたお金に頼ることにした。')]);}});
const _pensionCalc=pensionCalc;pensionCalc=function(a){return _pensionCalc(a)*(S.era==='future'?.8:1);};

// =====================================================================
// 天才の人生
// =====================================================================
D('g_sport1',{a:[9,11],m:true,c:()=>G_('sport')&&!S.flags.gs1,mk:()=>{S.flags.gs1=1;S.flags.talentKnown=1;return E('天才','少年団の全国大会で、上級生を置き去りにしてゴールした。観客席がざわついた。',[
  O('強豪クラブに移籍する',()=>{famMoneyAdj(-5);mod({health:8,mental:-3});S.flags.eliteSport=1;return 'プロの下部組織に入った。練習は毎日4時間。';}),
  O('今のチームで楽しむ',()=>{mod({mental:6,comm:4});return '仲間と笑いながらボールを追った。';}),
  O('勉強も大事にする',()=>{mod({study:5});return '練習は週3回に抑えた。';})]);}});
D('g_sport2',{a:[16,18],m:true,c:()=>G_('sport')&&!S.flags.gs2,mk:()=>{S.flags.gs2=1;const top=S.flags.eliteSport||S.st.health>=85;S.flags.proAsk=1;return E('スカウト',top?'甲子園・インターハイで注目の的になった。複数のプロ球団・クラブが獲得に動いている。':'大会で活躍し、実業団からも声がかかった。',[
  O(top?'ドラフト1位でプロへ':'実業団に入る',()=>{setJob('athlete',top?1500:500);S.flags.pro=1;log(top?'ドラフト1位でプロ入り':'実業団に入る');S.mood='happy';return top?'契約金1億円。新聞の一面に名前が載った。':'社会人チームで競技を続けることになった。';}),
  O('大学で競技を続ける',()=>{S.flags.sportUni=1;return '推薦で大学に進むことにした。';}),
  O('競技をやめて普通の道へ',()=>{mod({mental:-6});return 'まわりは驚き、惜しんだ。';})]);}});
D('g_olympic',{a:[20,32],m:true,c:()=>G_('sport')&&S.job.id==='athlete'&&!S.flags.olympic&&chance(.35),mk:()=>{S.flags.olympic=1;return E('五輪','日本代表に選ばれた。4年に一度の大舞台が待っている。',[
  O('すべてを懸けて挑む',()=>{mod({health:-6});if(chance(.35+S.st.health/400)){gain(500,'金メダル報奨金');S.flags.gold=1;log('五輪で金メダル');setJob('star');S.mood='happy';return '金メダル。表彰台の一番上で、国歌を聞いた。CMのオファーが殺到した。';}if(chance(.4)){gain(200,'メダル報奨金');log('五輪でメダル');return '銅メダルを手にした。';}mod({mental:-12});return '予選で敗れた。テレビの前の人たちに申し訳なかった。';}),
  O('ケガを抱えて出場を辞退する',()=>{mod({mental:-10});return '代表の座を後輩に譲った。';})]);}});
D('g_voice',{a:[11,15],m:true,c:()=>G_('voice')&&!S.flags.gv1,mk:()=>{S.flags.gv1=1;S.flags.talentKnown=1;return E('天才','合唱コンクールでソロを歌った。会場が静まりかえり、審査員が泣いていた。帰り道、芸能事務所の名刺を渡された。',[
  O('事務所に入って練習生になる',()=>{S.flags.trainee=1;mod({skill:8,study:-4,mental:-3});return '学校が終わるとレッスンに通う日々が始まった。';}),
  O('音大を目指してクラシックの道へ',()=>{S.flags.classic=1;famMoneyAdj(-6);mod({skill:6});return '声楽の先生につくことになった。';}),
  O('普通の学生生活を選ぶ',()=>{mod({mental:5});return 'カラオケで友達を驚かせるだけで十分だった。';})]);}});
D('g_debut',{a:[16,22],m:true,c:()=>G_('voice')&&S.flags.trainee&&!S.flags.debut,mk:()=>{S.flags.debut=1;return E('デビュー','デビューが決まった。1曲目のミュージックビデオの撮影が来週から始まる。',[
  O('デビューする',()=>{if(chance(.55+S.st.charm/300)){setJob('star');S.flags.dreamCome=1;log('歌手としてデビュー、ヒットする');S.mood='happy';return '曲がSNSで爆発的に広まった。街で名前を呼ばれるようになった。';}setJob('dream',150);S.dream=70;return 'デビューしたが、なかなか売れない。';}),
  O('学業を終えてからにする',()=>{S.flags.trainee=0;return '事務所とは円満に別れた。';})]);}});
D('g_brain',{a:[9,12],m:true,c:()=>G_('brain')&&!S.flags.gb1,mk:()=>{S.flags.gb1=1;S.flags.talentKnown=1;return E('天才','小学生で、高校の数学の問題を解いてしまった。算数オリンピックで金賞を取り、新聞の取材が来た。',[
  O('飛び入学・海外の天才児プログラムへ',()=>{mod({study:12,comm:-4,mental:-4});S.flags.gifted=1;return '大人ばかりの教室で、ひとりだけランドセルを背負っていた。';}),
  O('同い年の友達と過ごす',()=>{mod({comm:6,mental:4});return '友達とサッカーをするほうが楽しかった。';}),
  O('将来のために中学受験をする',()=>{S.flags.jukenPlan=1;mod({study:6});return '最難関の中学を目指すことにした。';})]);}});
D('g_brain2',{a:[17,18],m:true,c:()=>G_('brain')&&!S.flags.gb2,mk:()=>{S.flags.gb2=1;return E('進路','海外の名門大学から、学費も生活費も全額出る奨学金のオファーが来た。',[
  O('海外の名門大学へ',()=>{S.uni=4;S.edu={n:'海外の名門大学',left:4,cost:0,kind:'uni'};setJob('student');S.flags.overseas=1;S.flags.dropout=0;mod({study:10,comm:4});log('海外の名門大学に進学');return '18歳の春、ボストン行きの飛行機に乗った。';}),
  O('東大に行く',()=>{S.uni=4;S.edu={n:'東京大学',left:4,cost:60,kind:'uni'};setJob('student');log('東京大学に進学');return '赤門をくぐった。';}),
  O('大学に行かずに起業する',()=>{S.company={value:3000,eq:.8,yrs:0,joined:1};setJob('ceo',300);log('18歳で起業');return '18歳で会社を作った。投資家が群がってきた。';})]);}});
D('g_art',{a:[12,15],m:true,c:()=>G_('art')&&!S.flags.ga1,mk:()=>{S.flags.ga1=1;S.flags.talentKnown=1;return E('天才','中学生で描いた絵が、大人に混じって全国コンクールの大賞を取った。',[
  O('美大・芸大を目指す',()=>{S.flags.geidai=1;mod({skill:8});return '予備校のデッサン室に通い始めた。';}),
  O('漫画を描いて投稿する',()=>{mod({skill:6});if(chance(.5)){S.flags.mangaDebut=1;return '少年誌の新人賞を取った。担当編集がついた。';}return '佳作だった。次こそは。';}),
  O('ネットにイラストを上げる',()=>{S.followers=(S.followers||0)+200;mod({skill:4});return '一晩で何万人にも見られた。';},'',S.year>=2008)]);}});
D('g_art2',{a:[19,26],m:true,c:()=>G_('art')&&!S.flags.ga2&&S.job.id!=='mangaka',mk:()=>{S.flags.ga2=1;return E('連載','出版社から「連載をやってみないか」と声がかかった。',[
  O('連載を始める',()=>{setJob('mangaka');S.st.skill=Math.max(S.st.skill,75);log('連載デビュー');return '毎週の締め切りとの戦いが始まった。';}),
  O('会社員をしながら描き続ける',()=>'安定を手放す勇気はなかった。')]);}});
D('g_beauty',{a:[12,16],m:true,c:()=>G_('beauty')&&!S.flags.gbt,mk:()=>{S.flags.gbt=1;return E('スカウト','原宿の竹下通りで、3人に同じ日にスカウトされた。',[
  O('モデル事務所に入る',()=>{S.flags.model=1;mod({charm:6,study:-3});return '雑誌の読者モデルとして撮影に呼ばれ始めた。';}),
  O('断る',()=>'人に見られる仕事には、興味がなかった。'),
  O('親に相談する',()=>{if(livingParents().some(p=>p.pers==='教育熱心'||p.pers==='厳格'))return '「学生の本分は勉強」と反対された。';S.flags.model=1;return '親は渋々許してくれた。';})]);}});
D('g_beauty2',{a:[18,24],m:true,c:()=>G_('beauty')&&S.flags.model&&!S.flags.gbt2,mk:()=>{S.flags.gbt2=1;return E('芸能','ドラマのオーディションに受かった。',[
  O('女優・俳優の道へ',()=>{if(chance(.5)){setJob('star');log('ドラマでブレイク');S.mood='happy';return '初めてのドラマで話題になった。';}setJob('dream',150);S.dream=75;return '端役が続いている。';}),
  O('別の道を選ぶ',()=>'華やかな世界には進まなかった。')]);}});
D('g_talk',{a:[28,50],m:true,c:()=>G_('talk')&&!S.flags.gtk&&S.st.comm>=70,mk:()=>{S.flags.gtk=1;return E('声','あなたの話を聞いた政党の関係者から「選挙に出ないか」と誘われた。',[
  O('国会議員に立候補する',()=>{pay(Math.min(300,Math.max(0,S.cash)),'選挙費用（供託金など）');if(chance(.4+S.st.comm/300)){setJob('giin');log('国会議員に当選');S.mood='happy';return '当選した。バッジをつけた日、手が震えた。';}mod({mental:-10});return '落選した。';}),
  O('講演やYouTubeで稼ぐ',()=>{setJob('creator');S.followers=(S.followers||0)+800;return '話すことを仕事にした。';},'',S.year>=2012),
  O('今の仕事で上を目指す',()=>{S.job.salary*=1.2;return '営業成績で社長賞を取った。';})]);}});
D('g_shogi',{a:[10,12],m:true,c:()=>G_('shogi')&&!S.flags.gsh,mk:()=>{S.flags.gsh=1;S.flags.talentKnown=1;return E('天才','小学生名人戦で優勝した。プロ棋士の師匠から「奨励会を受けなさい」と言われた。',[
  O('奨励会に入る（26歳までに四段になれなければ退会）',()=>{S.flags.shoreikai=1;mod({study:6,comm:-3});return '学校と将棋会館を往復する毎日が始まった。';}),
  O('趣味で続ける',()=>{mod({mental:4});return '将棋は一生の趣味になった。';})]);}});
D('g_shogi2',{a:[15,26],w:8,cd:2,c:()=>G_('shogi')&&S.flags.shoreikai&&S.job.id!=='kishi',mk:()=>{const ok=chance(.25+S.st.study/400);if(ok){S.flags.shoreikai=0;return E('四段',`三段リーグを勝ち抜いた。${S.age}歳でプロ棋士になった。`,[O('プロになる',()=>{setJob('kishi');log('プロ棋士になる');S.mood='happy';return '師匠に深く頭を下げた。';})]);}
  if(S.age>=26){S.flags.shoreikai=0;return E('退会','26歳の誕生日。年齢制限で奨励会を去ることになった。',[O('将棋を離れて働く',()=>{mod({mental:-15});setJob('none');S.queue.push(evOffers('将棋しか知らない人生だった。仕事を探した。',false));return null;}),O('アマチュアとして指し続ける',()=>{mod({mental:-8});return '将棋は、まだ好きだった。';})]);}
  return E('三段リーグ','今期も四段には届かなかった。年齢制限が近づいてくる。',[O('もう一期、挑む',()=>{mod({mental:-5});return '盤に向かった。';}),O('やめる',()=>{S.flags.shoreikai=0;mod({mental:-10});return '駒を置いた。';})]);}});
D('g_lonely',{a:[10,30],w:4,cd:6,c:()=>!!S.gift,mk:()=>E('孤独',`「${GIFTS[S.gift].n}」と呼ばれるたびに、自分が人と違うことを思い知らされる。妬みの言葉も聞こえてくる。`,[
  O('才能をひたすら磨く',()=>{const G=GIFTS[S.gift];const o={};G.grow.forEach(k=>o[k]=6);mod(Object.assign(o,{mental:-6,comm:-2}));return '誰にも負けたくなかった。';}),
  O('普通の友達をつくる',()=>{mod({comm:5,mental:5});addPerson('friend','才能と関係なくつき合える友達',{age:S.age});return '自分を「天才」と呼ばない友達ができた。';}),
  O('期待から逃げる',()=>{mod({mental:-3});S.flags.giftEscape=1;return 'しばらく、何もしたくなかった。';})])});

// =====================================================================
// 生きづらさ
// =====================================================================
D('c_asd1',{a:[3,7],m:true,c:()=>C_('asd')&&!S.flags.casd1,mk:()=>{S.flags.casd1=1;return E('発達','言葉が遅く、大きな音が苦手。同じ電車の図鑑を何百回も眺めている。3歳児健診で、専門の病院をすすめられた。',[
  O('診断を受けて、療育に通う',()=>{S.flags.diag=1;mod({comm:4,mental:3});famMoneyAdj(-2);return '「自閉スペクトラム症」と診断された。親は泣いたが、やるべきことが見えた。';}),
  O('様子を見る',()=>{mod({mental:-4});return '「そのうち追いつく」と言われ続けた。';}),
  O('親が認めようとしない',()=>{mod({mental:-8});livingParents().forEach(p=>p.close-=5);return '「普通にしなさい」と叱られる日々だった。';})]);}});
D('c_asd2',{a:[6,6],m:true,c:()=>C_('asd'),mk:()=>E('就学','小学校入学。どのクラスで学ぶ？',[
  O('通常学級',()=>{mod({comm:2,mental:-6});return '休み時間がいちばんつらかった。';}),
  O('通常学級＋通級（週に数時間の個別指導）',()=>{mod({comm:4,mental:2});return '自分のペースで学べる時間ができた。';}),
  O('特別支援学級',()=>{mod({mental:6,study:-2});return '少人数の教室で、落ち着いて過ごせた。';})])});
D('c_asd3',{a:[10,60],w:4,cd:5,c:()=>C_('asd'),mk:()=>E('こだわり',pick(['蛍光灯のチラつきと話し声が重なって、頭が割れそうになった。','急な予定変更でパニックになった。','好きな分野の話を2時間続けて、相手を困らせてしまった。','「空気を読め」と言われたが、空気は見えない。']),[
  O('イヤーマフやノイズキャンセリングを使う',()=>{pay(S.age>=18?3:0,'イヤーマフ');mod({mental:6});return '世界が少し静かになった。';}),
  O('好きなことに没頭して回復する',()=>{mod({mental:5,skill:4});return '自分の世界に戻ると、落ち着いた。';}),
  O('無理に周りに合わせる',()=>{mod({mental:-10,comm:3});return '帰り道、どっと疲れた。';})])});
D('c_adhd1',{a:[8,30],m:true,c:()=>C_('adhd')&&!S.flags.cadhd&&chance(.25),mk:()=>{S.flags.cadhd=1;return E('診断','忘れ物、遅刻、片づけられない部屋。「やる気がないだけ」と言われ続けてきたが、病院で「ADHD」と診断された。',[
  O('薬を飲んで治療する',()=>{S.flags.adhdMed=1;mod({study:5,mental:6});if(S.age>=18)pay(3,'通院');return '頭の中のざわざわが、少し静かになった。';}),
  O('薬は使わず、工夫で乗り切る',()=>{mod({skill:3,mental:3});return 'スマホのアラームとメモを総動員した。';}),
  O('診断を受け入れられない',()=>{mod({mental:-6});return '自分は怠けているだけだ、と思い込んだ。';})]);}});
D('c_adhd2',{a:[18,65],w:4,cd:4,c:()=>C_('adhd')&&!S.flags.adhdMed,mk:()=>E('衝動',pick(['気づいたら、ネットで10万円の買い物をしていた。','大事な会議の時間を完全に忘れていた。','思いつきで仕事を辞めたくなった。']),[
  O('勢いに任せる',()=>{pay(10,'衝動買い');mod({mental:4});return 'すっきりしたが、カードの請求が怖い。';}),
  O('ぐっとこらえる',()=>{mod({mental:-3});return '一晩寝かせたら、気持ちは消えていた。';}),
  O('その勢いで新しいことを始める',()=>{mod({skill:5});if(chance(.3)){S.followers=(S.followers||0)+50;}return '思いつきで始めたことが、意外と面白い。';})])});
D('c_byoki1',{a:[1,12],m:true,c:()=>C_('byoki')&&!S.flags.cbyo1,mk:()=>{S.flags.cbyo1=1;famMoneyAdj(-4);return E('入院','心臓の手術のため、長く入院することになった。病室の窓から、外で遊ぶ子どもたちが見える。',[
  O('院内学級で勉強する',()=>{mod({study:6,mental:-3});return '病院の中にも、学校があった。';}),
  O('同じ病棟の子と友達になる',()=>{mod({comm:5,mental:3});addPerson('friend','病院で出会った友達',{age:S.age});return '点滴をつけたまま、一緒にゲームをした。';}),
  O('家族に会いたいと泣く',()=>{livingParents().forEach(p=>p.close+=10);mod({mental:-4});return '母は毎日、面会時間ぎりぎりまでいてくれた。';})]);}});
D('c_byoki2',{a:[7,17],w:4,cd:4,c:()=>C_('byoki'),mk:()=>E('体育','また体育を見学している。「ずるい」と言われることもある。',[
  O('得意な勉強で勝負する',()=>{mod({study:5});return 'テストでは誰にも負けなかった。';}),
  O('先生に頼んで、できる範囲で参加する',()=>{mod({health:2,comm:3});return '記録係として、チームの一員になれた。';}),
  O('隠れて無理をする',()=>{mod({health:-10});return '息が苦しくなって、保健室に運ばれた。';})])});
D('c_byoki3',{a:[18,40],m:true,c:()=>C_('byoki')&&!S.flags.cbyo3,mk:()=>{S.flags.cbyo3=1;return E('就職','面接で持病のことを話すべきか、迷っている。',[
  O('正直に話して、配慮のある会社を探す',()=>{S.queue.unshift({id:'shogaiOffer',tag:'就職',tx:'障害者雇用の枠で応募した。',ops:[{t:'障害者雇用で働く（無理のない仕事）',f:()=>{setJob('shogai');return '通院の日は休める職場に就職した。';}},{t:'一般の求人を探す',f:()=>{S.queue.push(evOffers('一般の求人に応募した。',true));return null;}}]});return null;}),
  O('隠して一般の会社に入る',()=>{S.flags.hideIll=1;return '誰にも言わなかった。';})]);}});
D('c_fuun',{a:[6,90],w:4,cd:3,c:()=>C_('fuun'),mk:()=>E('不運',pick(['横断歩道で、信号無視の自転車にはねられた。','大雨で部屋が浸水した。','ネットで買ったものが、届かなかった。','楽しみにしていた旅行の前日に、骨折した。']),[
  O('もう笑うしかない',()=>{mod({mental:-2,comm:2});return '友達に話したら、ネタとしてウケた。';}),
  O('お祓いに行く',()=>{pay(S.age>=18?1:0,'お祓い');mod({mental:3});return '明治神宮で手を合わせた。';}),
  O('なんで自分ばかり、と落ち込む',()=>{mod({mental:-8});return '布団から出られなかった。';})])});

// =====================================================================
// 親の職業による人生
// =====================================================================
D('p_doctor',{a:[14,17],m:true,c:()=>PJ_('医師')&&!S.flags.pdoc,mk:()=>{S.flags.pdoc=1;return E('家業','「医者になって、病院を継ぎなさい」。物心ついた時から言われてきた。',[
  O('医学部を目指す',()=>{S.flags.medAim=1;mod({study:10,mental:-6});famMoneyAdj(-4);return '医学部専門の予備校に入れられた。';}),
  O('自分の夢を追うと言う',()=>{livingParents().forEach(p=>p.close-=12);mod({mental:4});return '父は口をきいてくれなくなった。';})]);}});
D('p_shacho',{a:[26,42],m:true,c:()=>PJ_('会社経営者')&&!S.flags.pshacho&&S.fam.alive!==false,mk:()=>{S.flags.pshacho=1;return E('事業承継','父の会社を継いでほしい、と頼まれた。社員は50人。業績は悪くない。',[
  O('社長を継ぐ',()=>{S.company={value:8000,eq:.6,yrs:0,joined:1};setJob('ceo',1200);log('家業の会社を継ぐ');return '二代目社長になった。古参の役員の視線が冷たい。';}),
  O('断って自分の道を行く',()=>{livingParents().forEach(p=>p.close-=8);return '会社は他人に売られることになった。';})]);}});
D('p_sushi',{a:[18,35],m:true,c:()=>PJ_('寿司屋の大将')&&!S.flags.psushi,mk:()=>{S.flags.psushi=1;return E('家業','「店を継ぐ気はあるか」。父が、カウンター越しに聞いてきた。',[
  O('修行して店を継ぐ',()=>{S.shop={yrs:0,kind:'寿司屋',loss:0};setJob('shop',0);mod({skill:8});log('寿司屋を継ぐ');return '包丁の握り方から、もう一度教わった。';}),
  O('継がない',()=>'のれんは、父の代で下ろされることになった。')]);}});
D('p_seijika',{a:[30,45],m:true,c:()=>PJ_('国会議員')&&!S.flags.pseiji,mk:()=>{S.flags.pseiji=1;return E('地盤','父が引退する。「地盤・看板・カバン」を継いで、次の選挙に出ないかと後援会が言ってきた。',[
  O('出馬する',()=>{if(chance(.7)){setJob('giin');log('世襲で国会議員に当選');S.mood='happy';return '当選した。「世襲だ」という批判も聞こえた。';}mod({mental:-10});return 'まさかの落選。';}),
  O('政治の世界には入らない',()=>'後援会はひどく落胆した。')]);}});
D('p_geino',{a:[5,12],m:true,c:()=>PJ_('芸能人')&&!S.flags.pgeino,mk:()=>{S.flags.pgeino=1;return E('二世','親の番組に一緒に出ないか、と誘われた。',[
  O('子役デビューする',()=>{mod({charm:8,comm:5,study:-4});S.flags.model=1;return '「〇〇の子ども」として話題になった。';}),
  O('出ない',()=>{mod({mental:3});return '普通の子として育ててほしかった。';})]);}});
D('p_pachi',{a:[4,10],w:5,cd:3,c:()=>PJ_('自称パチプロ'),mk:()=>E('家族','パチンコ屋の駐車場で、親が出てくるのを車の中で待っている。夏の車内は暑い。',[
  O('おとなしく待つ',()=>{mod({health:-6,mental:-6});return '何時間も待った。';}),
  O('店の中まで呼びに行く',()=>{mod({mental:-3});livingParents().forEach(p=>p.close-=4);return '「すぐ終わる」と言われた。';}),
  O('近所の人に助けを求める',()=>{mod({moral:3});if(chance(.5))return '通報され、児童相談所の人が家に来た。';return '近所のおばさんが、家に入れてくれた。';})])});

// 借金が年収の何倍にも膨らんだら、選べる道は限られる（闇金・任意整理はもう効かない）
(function(){const d=DEFS.find(x=>x.id==='bankrupt');if(!d)return;const mk0=d.mk;d.mk=function(){const ev=mk0();const huge=S.debt>Math.max(800,grossNow()*2.5);if(huge&&ev&&ev.ops){ev.ops=ev.ops.filter(o=>/自己破産|親に/.test(o.t));ev.ops.push(O('生活保護を申請し、自己破産する',()=>{S.debt=0;S.flags.bk=1;S.flags.bkAge=S.age;setJob('welfare');S.home='publ';log('自己破産・生活保護');return '弁護士と役所の窓口に通い、借金は消えた。暮らしは、ぎりぎりだ。';}));ev.tx+='<br><b>もう、返せる見込みはない。</b>';}return ev;};})();
// 高齢で収入がなく、お金も尽きたら生活保護
const _coverShortfall=coverShortfall;
coverShortfall=function(){_coverShortfall();if(S.age>=65&&S.debt>200&&['none','pension','silver'].includes(S.job.id)&&S.nenkin.amount<120&&!S.flags.oldWelf){S.flags.oldWelf=1;S.debt=0;setJob('welfare');note('年金だけでは暮らせず、生活保護を受けることになった。借金は自己破産で整理した。');log('高齢で生活保護を受ける');}};

// =====================================================================
// 結果をSNSでシェアする
// =====================================================================
const GAME_NAME='ONE LIFE';
const GAME_TAG='ONELIFE';
const GAME_URL=(()=>{try{const h=location.hostname;if(/^https?:$/.test(location.protocol)&&h&&!/claude|anthropic|usercontent/.test(h))return location.origin+location.pathname.replace(/index\.html$/,'');}catch(e){}return 'https://claude.ai/artifact/8UEAZe6NP3TVEh3ddgQr5N';})();
function lifeSummary(){
  const a=assetsTotal();const got=TITLES.filter(t=>t.c(a)).sort((x,y)=>y.p-x.p);const main=got[0];
  const era=ERAS[S.era||'now'];
  const pl={'23ku':'東京23区','tama':'東京の郊外','local':'地方'}[S.fam.place];
  const skip=/購入|売却|付き合う|お試し/;
  const seen=new Set();const logs=S.log.filter(l=>{if(skip.test(l.t)||/亡くなる|生まれる$/.test(l.t)||seen.has(l.t))return false;seen.add(l.t);return true;});
  const IMP=/金メダル|当選|デビュー|ブレイク|売れっ子|イグジット|上場|億|大ヒット|プロ|関取|逮捕|破産|生活保護|結婚|離婚|子どもが|の.+が生まれる|起業|社長|継ぐ|医師|弁護士|東京大学|名門|ホームレス|刑務所|闇|がんを克服|FIRE|宝くじ|相続|家を購入|マンション/;
  const imp=logs.filter(l=>IMP.test(l.t));
  const pickN=(arr,n)=>arr.length<=n?arr:Array.from({length:n},(_,i)=>arr[Math.round(i*(arr.length-1)/(n-1))]);
  return {a,main,got,era,pl,hl:(imp.length>=3?pickN(imp,3):pickN(logs,3)),
    kids:S.kids.filter(k=>k.alive!==false).length,married:!!(S.spouse||S.widow),gross:Math.round(S.totalGross||0)};
}
function wrapText(ctx,t,x,y,w,lh,max){let line='',n=0;for(const ch of t){const test=line+ch;if(ctx.measureText(test).width>w&&line){ctx.fillText(line,x,y);y+=lh;line=ch;if(++n>=max-1){/* last line */}}else line=test;}if(line)ctx.fillText(line,x,y);return y+lh;}
async function makeShareCard(){
  const L=lifeSummary(),W=1080,H=1350;
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');
  try{await document.fonts.ready;}catch(e){}
  const F='"BIZ UDPGothic","Hiragino Sans",sans-serif',D='"DotGothic16",monospace';
  // 地
  c.fillStyle='#f4f3ee';c.fillRect(0,0,W,H);
  // 発車標
  c.fillStyle='#111';c.fillRect(0,0,W,210);
  c.fillStyle='#ffb400';c.font=`72px ${D}`;c.fillText(GAME_NAME,60,112);
  c.font=`30px ${D}`;c.fillStyle='#9acd32';c.fillText('超リアル人生ゲーム　終点到着',62,170);
  c.fillStyle='#ffb400';c.textAlign='right';c.fillText(`${S.year}年`,W-60,170);c.textAlign='left';
  ['#9acd32','#f15a22','#0068b7','#e5171f','#00ada9','#a9a9a9','#9b7cb6'].forEach((col,i)=>{c.fillStyle=col;c.fillRect(i*W/7,210,W/7+1,16);});
  // キャラクター
  const svg=chibi({look:S.look,age:S.age,outfit:S.age>=65?'elder':outfitFor(S.age,S.job.id,S.sex),mood:'happy',cane:S.age>=80});
  await new Promise(res=>{const im=new Image();im.onload=()=>{c.drawImage(im,40,250,330,462);res();};im.onerror=res;im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);});
  // 名前と一生
  c.fillStyle='#111';c.font=`bold 54px ${F}`;c.fillText(fullName(),400,320);
  c.font=`30px ${F}`;c.fillStyle='#444';
  c.fillText(`${S.birthY}年、${L.pl}の${RANK_ADJ[S.birthRank!=null?S.birthRank:S.fam.rank]}家に生まれる`,400,372);
  c.fillText(`時代：${L.era.n}`,400,416);
  let yy=460;
  if(S.gift){c.fillStyle='#b07d00';c.fillText(`★ ${GIFTS[S.gift].n}`,400,yy);yy+=44;}
  if(S.conds&&S.conds.length){c.fillStyle='#d7261e';yy=wrapText(c,`背負ったもの：${S.conds.map(k=>CONDS[k].n).join('・')}`,400,yy,620,40,2);}
  c.fillStyle='#111';c.font=`bold 40px ${F}`;c.fillText(`享年${S.age}歳`,400,yy+20);
  c.font=`32px ${F}`;c.fillStyle='#444';c.fillText(`死因：${S.cause||'—'}`,400,yy+70);
  // 称号
  c.fillStyle='#fff';c.fillRect(60,740,W-120,200);c.lineWidth=6;c.strokeStyle='#111';c.strokeRect(60,740,W-120,200);
  c.fillStyle='#666';c.font=`28px ${F}`;c.textAlign='center';c.fillText('この人生の称号',W/2,792);
  c.fillStyle='#111';c.font=`bold 76px ${F}`;c.fillText(L.main.n,W/2,875);
  c.fillStyle='#555';c.font=`28px ${F}`;c.fillText(L.main.d,W/2,920);c.textAlign='left';
  // 数字
  const box=(x,lab,val)=>{c.fillStyle='#fff';c.fillRect(x,970,300,120);c.lineWidth=3;c.strokeRect(x,970,300,120);c.fillStyle='#666';c.font=`24px ${F}`;c.fillText(lab,x+18,1006);c.fillStyle=lab==='最終資産'&&L.a<0?'#d7261e':'#111';c.font=`bold 40px ${F}`;c.fillText(val,x+18,1066);};
  box(60,'最終資産',yen(L.a));box(390,'生涯年収（額面）',yen(L.gross));box(720,'家族',`${L.married?'結婚':'独身'}・子${L.kids}人`);
  // ハイライト
  c.fillStyle='#111';c.font=`bold 30px ${F}`;c.fillText('人生のハイライト',60,1150);
  c.font=`26px ${F}`;let hy=1188;L.hl.slice(0,3).forEach(l=>{c.fillStyle='#0068b7';c.fillText(`${l.age}歳`,60,hy);c.fillStyle='#222';const t=l.t.length>28?l.t.slice(0,27)+'…':l.t;c.fillText(t,160,hy);hy+=38;});
  // 下
  c.fillStyle='#111';c.fillRect(0,H-72,W,72);
  c.fillStyle='#ffb400';c.font=`28px ${D}`;c.fillText(`#${GAME_TAG}`,60,H-26);c.textAlign='right';c.fillStyle='#fff';c.font=`bold 26px ${F}`;c.fillText('あなたの人生は、どこで降りる？',W-60,H-26);c.textAlign='left';
  return cv;
}
function shareText(){const L=lifeSummary();
  return `${S.birthY}年生まれ（${L.era.n}）の${fullName()}は、${S.age}歳で${S.cause||'人生を終えた'}。\n称号「${L.main.n}」／最終資産 ${yen(L.a)}${S.gift?`／${GIFTS[S.gift].n}`:''}\n#${GAME_TAG} #人生ゲーム\n${GAME_URL}`;}
async function shareSheet(){
  const cv=await makeShareCard();const url=cv.toDataURL('image/png');const txt=shareText();
  const enc=encodeURIComponent(txt);
  sheet('結果をシェアする',`<p class="note">画像を長押し（パソコンは右クリック）で保存して、SNSに貼れる。</p>
  <img src="${url}" style="width:100%;border:2px solid var(--ink);display:block;margin:8px 0" alt="結果カード">
  <textarea id="shTx" readonly style="width:100%;height:110px;font:inherit;font-size:13px;padding:8px;border:2px solid var(--ink);box-sizing:border-box">${txt}</textarea>
  <div class="sharebtns" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
   <button class="op yl" id="shNative">共有する（アプリを選ぶ）</button>
   <a class="op" id="shSave" href="${url}" download="${GAME_TAG}_${S.birthY}.png" style="text-align:center;text-decoration:none">画像を保存</a>
   <a class="op" href="https://x.com/intent/post?text=${enc}" target="_blank" rel="noopener" style="text-align:center;text-decoration:none">Xに投稿</a>
   <a class="op" href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(GAME_URL)}&text=${enc}" target="_blank" rel="noopener" style="text-align:center;text-decoration:none">LINEで送る</a>
   <a class="op" href="https://www.threads.net/intent/post?text=${enc}" target="_blank" rel="noopener" style="text-align:center;text-decoration:none">Threadsに投稿</a>
   <button class="op" id="shCopy">文章をコピー</button>
  </div>
  <p class="src">Instagram・TikTokは、画像を保存してからアプリで投稿する。</p>`,[],ov=>{
    ov.querySelector('#shCopy').onclick=async()=>{try{await navigator.clipboard.writeText(txt);toast('コピーした');}catch(e){const t=ov.querySelector('#shTx');t.select();try{document.execCommand('copy');toast('コピーした');}catch(e2){toast('文章を長押ししてコピーしてね');}}};
    ov.querySelector('#shNative').onclick=async()=>{
      try{const blob=await new Promise(r=>cv.toBlob(r,'image/png'));const file=new File([blob],`${GAME_TAG}.png`,{type:'image/png'});
        if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],text:txt});return;}
        if(navigator.share){await navigator.share({text:txt,url:GAME_URL});return;}
      }catch(e){if(e&&e.name==='AbortError')return;}
      toast('この画面からは直接共有できない。画像を保存して投稿してね');};
  });
}
// 終点の画面に「シェア」ボタン
const _endLife2=endLife;
endLife=function(cause){_endLife2(cause);const ov=[...document.querySelectorAll('.ov')].pop();if(!ov)return;const mb=ov.querySelector('.mb');if(!mb)return;
  const b=document.createElement('button');b.className='op yl';b.innerHTML='この人生をシェアする<small>結果カードの画像をX・LINE・Instagramなどに</small>';b.onclick=()=>shareSheet();mb.prepend(b);};

// =====================================================================
// ドット絵化（キャラクター・背景・タイトル・結果カード）
// =====================================================================
const PX_SHIRT=['#E85D4A','#3D8ED6','#F2B632','#59B56C','#9A6BD1','#F08BB1','#F2EEE4','#4BB8B8'];
chibi=function(o){
  const L=Object.assign({},o.look||{});
  if(typeof L.shirt==='number')L.shirt=PX_SHIRT[L.shirt%PX_SHIRT.length];
  if(L.dye!=null&&typeof L.dye==='number')L.dye=['#C99A4A','#C8506A','#2D3E7A','#B9B4AE'][L.dye%4];
  if(L.hs==='messy')L.hs='spiky';
  let of=o.outfit;if(of==='chef')of='apron';
  return pixelChar({look:L,age:o.age,outfit:of,mood:o.mood,cane:o.cane}).replace(/ width="\d+" height="\d+"/,' style="width:100%;height:100%;display:block"');
};
catSVG=function(){const m=["..O......O..",".OCO....OCO.",".OCCOOOOCCO.","OCCCCCCCCCCO","OCEC CCCECCO".replace(' ','C'),"OCCCCPCCCCCO",".OCCCCCCCCO.","..OCCCCCCO..","..OCOOOOCO..","..OO....OO.."];
  const col={O:'#1B1A22',C:'#E8913A',E:'#1B1A22',P:'#F29A9A'};let r='';m.forEach((s,y)=>{[...s].forEach((c,x)=>{if(col[c])r+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${col[c]}"/>`;});});
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 10" shape-rendering="crispEdges">${r}</svg>`;};
function pixelScene(bg){
  const W=120,H=46;let r='';const R=(x,y,w,h,c)=>{r+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;};
  const night=bg==='tower';const sky=night?'#1B2350':bg==='local'?'#8FD3FF':bg==='hospital'||bg==='home_old'?'#BFE3F2':'#7EC8F0';
  R(0,0,W,H,sky);
  if(night){for(let i=0;i<22;i++)R((i*37)%W,(i*13)%20,1,1,'#FFFEF2');R(98,4,5,5,'#FFF3B0');}
  else{R(10,6,9,3,'#FFFFFF');R(12,4,5,2,'#FFFFFF');R(80,9,12,3,'#FFFFFF');R(83,7,6,2,'#FFFFFF');}
  const win=(x,y,w,h,c1,c2,step=3)=>{R(x,y,w,h,c1);for(let yy=y+2;yy<y+h-2;yy+=step)for(let xx=x+2;xx<x+w-2;xx+=step)R(xx,yy,1,1,c2);};
  const ground=bg==='local'?'#5FB04F':'#8C8C9A';
  if(bg==='local'){R(0,22,34,16,'#4A8F5A');R(6,18,20,4,'#4A8F5A');R(70,20,50,18,'#3F7F50');R(80,16,26,4,'#3F7F50');R(44,26,16,10,'#E9D9B6');R(42,23,20,3,'#C8323C');R(50,30,4,6,'#7A5230');R(0,38,W,8,ground);R(0,40,W,1,'#4E9A40');}
  else if(bg==='house'||bg==='home'){[[4,24],[30,22],[86,24]].forEach(([x,y])=>{R(x,y,22,38-y,'#F2E3C2');R(x-2,y-3,26,3,'#B5483C');R(x+4,y+4,5,4,'#7EC8F0');R(x+13,y+6,5,38-y-6,'#7A5230');});R(0,38,W,8,'#A7A39A');R(0,38,W,1,'#5C5A66');}
  else if(bg==='apart'){win(14,14,44,24,'#D9D2C3','#5B7FA6',4);R(14,12,44,2,'#8C8C9A');for(let y=18;y<38;y+=6)R(14,y,44,1,'#A79F90');win(72,20,30,18,'#E8C9A8','#5B7FA6',4);R(0,38,W,8,ground);}
  else if(bg==='mansion'){win(8,6,30,32,'#E6E2D8','#5B7FA6');win(44,12,26,26,'#CFC8BA','#5B7FA6');win(78,4,34,34,'#DDD7CB','#5B7FA6');R(0,38,W,8,ground);}
  else if(bg==='tower'){win(6,10,18,28,'#2B315E','#FFE08A');win(30,2,16,36,'#323A6E','#FFE08A',2);win(54,14,22,24,'#2B315E','#FFE08A');win(82,0,20,38,'#3A4380','#FFE08A',2);R(91,0,2,2,'#FF6B8B');R(0,38,W,8,'#2A2840');}
  else if(bg==='office'){win(4,4,36,34,'#9FB7CC','#E8F2F8',3);win(46,10,30,28,'#8AA3B8','#E8F2F8',3);win(82,6,34,32,'#A8BFD2','#E8F2F8',3);R(0,38,W,8,ground);}
  else if(bg==='school'){R(14,14,92,24,'#F2EEE4');R(14,12,92,2,'#C8C2B0');for(let x=18;x<102;x+=8)R(x,18,5,5,'#7EC8F0');for(let x=18;x<102;x+=8)R(x,27,5,5,'#7EC8F0');R(56,6,8,8,'#F2EEE4');R(58,8,4,4,'#1B1A22');R(0,38,W,8,'#C9A574');}
  else if(bg==='hospital'||bg==='home_old'){R(24,10,72,28,'#F6F6F2');for(let x=28;x<92;x+=7)for(let y=14;y<34;y+=6)R(x,y,4,3,'#9AD1E8');if(bg==='hospital'){R(57,3,6,2,'#E85D4A');R(59,1,2,6,'#E85D4A');}R(0,38,W,8,'#9FB08C');}
  else{win(2,12,24,26,'#B5A08A','#F2E3C2');win(30,6,20,32,'#C9B79C','#F2E3C2');R(56,20,26,18,'#E85D4A');R(56,18,26,2,'#B5483C');R(60,24,8,6,'#FFE08A');win(86,10,30,28,'#A8957F','#F2E3C2');R(0,38,W,8,ground);R(0,41,W,1,'#FFFEF2');}
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges">${r}</svg>`;
}
sceneSVG=function(bg){return pixelScene(bg);};

// ---- タイトル ----
title=function(){
  const t=$('#title');t.classList.remove('hidden');
  let hasSave=false;try{hasSave=!!localStorage.getItem(SAVE_KEY);}catch(e){}
  const tn=Object.keys(META.titles).length;const sx=chance(.5)?'M':'F';const lk=newLook(sx);
  const sprites=[[1,'baby'],[8,'kid'],[16,'school'],[28,sx==='F'?'office':'suit'],[80,'elder']].map(([a,of])=>`<div style="display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:${a<3?36:a<12?42:48}px;height:${a<3?39:a<12?57:72}px">${chibi({look:lk,age:a,outfit:of,mood:'happy',cane:a>=80})}</div><span style="font-size:12px;color:var(--gr)">${a}</span></div>`).join('');
  let dots='';for(let i=0;i<100;i++)dots+=`<i style="display:block;aspect-ratio:1;background:${i===0?'var(--lime)':'var(--ln)'}"></i>`;
  t.innerHTML=`<div style="min-height:100%;display:flex;flex-direction:column;padding:34px 22px 26px">
   <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gr)"><span>LIFE SIMULATION</span><span>&copy;2026</span></div>
   <h1 class="ttl" style="margin-top:42px">ONE<br>LIFE</h1>
   <div class="tsub">人生は、一度きり。</div>
   <div style="margin:30px 4px 0;border:3px solid var(--fg);background:var(--win);box-shadow:0 0 0 3px var(--bg),0 0 0 6px var(--ln);padding:12px 14px">
     <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gr);margin-bottom:8px"><span>0歳</span><span>100歳</span></div>
     <div style="display:grid;grid-template-columns:repeat(20,minmax(0,1fr));gap:4px">${dots}</div>
   </div>
   <div style="display:flex;justify-content:space-between;align-items:flex-end;margin:26px 6px 0">${sprites}</div>
   <div style="margin-top:auto;padding-top:28px">
     <button class="tbtn" id="tNew">▶ 生まれる<small>性別も、家も、時代も、才能も、ランダムで生まれる</small></button>
     ${hasSave?`<button class="tbtn s" id="tCont">続きから<small>前回の${(()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY));return s.age+'歳・'+s.year+'年';}catch(e){return '人生';}})()}</small></button>`:''}
     <button class="tbtn s" id="tPick">生まれ・時代・才能を選ぶ<small>バブル期・氷河期・未来の東京／親の職業／天才／ハードモード</small></button>
     <button class="tbtn s" id="tDex">人生の記録<small>手に入れた称号 ${tn} / ${TITLES.length}</small></button>
     <div class="tinfo" style="margin-top:8px">0歳から寿命が尽きるまで、1年ずつ人生を進める。給料・家賃・税金・年金・株価などは、公的統計や当時の実データをもとにしている（ゲーム用に簡略化）。</div>
   </div></div>`;
  $('#tNew').onclick=()=>{try{localStorage.removeItem(SAVE_KEY);}catch(e){}start();};
  if($('#tCont'))$('#tCont').onclick=()=>{try{S=JSON.parse(localStorage.getItem(SAVE_KEY));t.classList.add('hidden');render();}catch(e){start();}};
  $('#tPick').onclick=pickBirth;
  $('#tDex').onclick=()=>sheet('人生の記録',dexHTML());
};

// ---- 結果カード（ドット絵） ----
makeShareCard=async function(){
  const L=lifeSummary(),W=1080,H=1350;
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
  try{await Promise.all([document.fonts.load('40px "Press Start 2P"'),document.fonts.load('40px "DotGothic16"')]);}catch(e){}
  const PS='"Press Start 2P",monospace',DG='"DotGothic16",monospace';
  const BG='#0F0E17',WIN='#1B1A2B',FG='#FFFEF2',LIME='#C7F94B',PINK='#FF6B8B',GR='#A9A7C4',LN='#2F2D46',GOLD='#FFC94A';
  const frame=(x,y,w,h)=>{c.fillStyle=LN;c.fillRect(x-12,y-12,w+24,h+24);c.fillStyle=BG;c.fillRect(x-6,y-6,w+12,h+12);c.fillStyle=FG;c.fillRect(x,y,w,h);c.fillStyle=WIN;c.fillRect(x+6,y+6,w-12,h-12);};
  c.fillStyle=BG;c.fillRect(0,0,W,H);
  c.fillStyle=LIME;c.font=`56px ${PS}`;c.textBaseline='alphabetic';c.fillText('ONE LIFE',64,124);
  c.fillStyle=GR;c.font=`30px ${DG}`;c.textAlign='right';c.fillText(`${S.birthY} - ${S.year}`,W-64,120);c.textAlign='left';
  // 100の点
  const evA=new Set(S.log.filter(l=>/結婚|離婚|が生まれる|逮捕|破産|起業|社長|プロ|デビュー|当選|金メダル|入院|がん|生活保護|相続|上京|入学|就職|になる$/.test(l.t)&&l.age>0).map(l=>l.age));
  const gx=64,gy=170,cs=34,gp=9;for(let i=0;i<100;i++){const x=gx+(i%25)*(cs+gp),y=gy+Math.floor(i/25)*(cs+gp);c.fillStyle=i<=S.age?(evA.has(i)?PINK:LIME):LN;c.fillRect(x,y,cs,cs);}
  // キャラクター
  frame(64,370,300,420);
  const svg=chibi({look:S.look,age:S.age,outfit:S.age>=65?'elder':outfitFor(S.age,S.job.id,S.sex),mood:'happy',cane:S.age>=80});
  await new Promise(res=>{const im=new Image();im.onload=()=>{c.drawImage(im,94,430,240,360);res();};im.onerror=res;im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);});
  // 名前
  c.fillStyle=FG;c.font=`52px ${DG}`;c.fillText(fullName(),410,420);
  c.font=`28px ${DG}`;c.fillStyle=GR;
  c.fillText(`${S.birthY}年、${L.pl}の${RANK_ADJ[S.birthRank!=null?S.birthRank:S.fam.rank]}家に`,410,474);
  c.fillText(`時代：${L.era.n}`,410,516);
  let yy=560;if(S.gift){c.fillStyle=GOLD;c.fillText(`★ ${GIFTS[S.gift].n}`,410,yy);yy+=42;}
  if(S.conds&&S.conds.length){c.fillStyle=PINK;c.fillText(`背負ったもの：${S.conds.map(k=>CONDS[k].n).slice(0,2).join('・')}`,410,yy);yy+=42;}
  c.fillStyle=LIME;c.font=`44px ${PS}`;c.fillText(`${S.age}`,410,yy+70);const aw=c.measureText(`${S.age}`).width;c.font=`32px ${DG}`;c.fillText('歳で',410+aw+14,yy+68);
  c.fillStyle=FG;c.font=`30px ${DG}`;c.fillText(`${S.cause||'人生を終えた'}`,410,yy+120);
  // 称号
  frame(64,840,W-128,180);
  c.textAlign='center';c.fillStyle=GR;c.font=`26px ${DG}`;c.fillText('この人生の称号',W/2,894);
  c.fillStyle=LIME;c.font=`64px ${DG}`;c.fillText(L.main.n,W/2,966);
  c.fillStyle=GR;c.font=`24px ${DG}`;c.fillText(L.main.d,W/2,1002);c.textAlign='left';
  // 数字
  const box=(x,lab,val,col)=>{c.fillStyle=WIN;c.fillRect(x,1060,300,110);c.strokeStyle=LN;c.lineWidth=4;c.strokeRect(x,1060,300,110);c.fillStyle=GR;c.font=`24px ${DG}`;c.fillText(lab,x+18,1096);c.fillStyle=col;c.font=`36px ${DG}`;c.fillText(val,x+18,1148);};
  box(64,'最終資産',yen(L.a),L.a<0?PINK:GOLD);box(390,'生涯年収',yen(L.gross),FG);box(716,'家族',`${L.married?'結婚':'独身'}・子${L.kids}人`,FG);
  // 下
  c.fillStyle=LIME;c.fillRect(0,H-96,W,96);c.fillStyle=BG;c.font=`30px ${DG}`;c.fillText(`#${GAME_TAG}`,64,H-38);c.textAlign='right';c.fillText('あなたの人生は、どうなる？',W-64,H-38);c.textAlign='left';
  return cv;
};
