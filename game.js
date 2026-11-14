// =====================================================================
// 基本ユーティリティ
// =====================================================================
const R=Math.random,pick=a=>a[Math.floor(R()*a.length)],chance=p=>R()<p,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rn=(m,s)=>{let u=0,v=0;while(!u)u=R();while(!v)v=R();return m+s*Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
const wpick=o=>{let t=0;for(const k in o)t+=o[k];let r=R()*t;for(const k in o){r-=o[k];if(r<0)return k;}return Object.keys(o)[0];};
const $=s=>document.querySelector(s);
const META_KEY='tkk2-meta',SAVE_KEY='tkk2-save';
let META={titles:{},info:{},lives:0,yen:0};
try{const m=localStorage.getItem(META_KEY);if(m)META=Object.assign(META,JSON.parse(m));}catch(e){}
const saveMeta=()=>{try{localStorage.setItem(META_KEY,JSON.stringify(META));}catch(e){}};
function yen(v){const neg=v<0;v=Math.abs(v);let s;if(v>=10000){const o=Math.floor(v/10000),m=Math.round(v%10000);s=o+'億'+(m?m.toLocaleString()+'万':'')+'円';}else if(v>=100)s=Math.round(v).toLocaleString()+'万円';else if(v>=1)s=(Math.round(v*10)/10)+'万円';else s=Math.round(v*10000).toLocaleString()+'円';return (neg?'-':'')+s;}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2000);}

// =====================================================================
// 解説（実データ）
// =====================================================================
const INFO={
 minwage:{t:'東京都の最低賃金',b:'東京都の最低賃金は、2026年10月1日から時給1,280円。前年の1,226円から54円上がった。',s:'東京労働局（2026年）'},
 shoninkyu:{t:'初任給の相場',b:'2026年度の決定初任給は、大学卒で平均250,880円。大企業の大卒は約26.6万円、中小企業は約24.1万円。高校卒は大企業約22.2万円、中小企業約20.3万円。',s:'産労総合研究所「2026年度 決定初任給調査」'},
 rent:{t:'東京23区の家賃',b:'23区の単身向け物件で家賃相場がいちばん安い駅（京成本線・江戸川駅）でも6.9万円。山手線の田端・日暮里あたりでも、単身向けの平均家賃は10万円を超えている。',s:'SUUMOジャーナル（2026年）、LIFULL HOME\'S調べ'},
 rentup:{t:'上がり続ける家賃',b:'2026年第2四半期、東京都の募集家賃は前年同期比で7.6%上昇した。',s:'内閣府「今週の指標」No.1422'},
 salary:{t:'平均給与と正社員・非正規の差',b:'2024年の民間の平均給与は477.5万円で過去最高。正社員は544.9万円、パート・アルバイトなど正社員以外は206.3万円で、その差は338.6万円。業種別で最も低いのは「宿泊・飲食サービス」の279万円。',s:'国税庁「民間給与実態統計調査」（2024年分）'},
 tedori:{t:'額面と手取り',b:'給料からは社会保険料（約15%）と所得税・住民税が引かれる。住民税は前年の所得にかかるため、社会人2年目から引かれ始める。',s:'一般的な税・社会保険の仕組み（ゲーム内は簡略化）'},
 keirin:{t:'ギャンブルの還元率',b:'ボートレースと競輪の還元率は75%、オートレースは70%、競馬は券種で70〜80%。パチンコ・パチスロは約85%と言われる。',s:'マネーポスト、日刊ゲンダイ'},
 takarakuji:{t:'宝くじの還元率',b:'宝くじの売上のうち、当せん金として戻るのは46.9%。3万円分買った瞬間に、その価値は約1万4千円になる計算だ。',s:'宝くじ公式サイト（ファイナンシャルフィールドより）'},
 nisa:{t:'新NISA',b:'2024年に始まった新NISAは、年間360万円（つみたて投資枠120万円＋成長投資枠240万円）まで、生涯1,800万円まで投資の利益が非課税。普通の口座では利益に約20%の税金がかかる。',s:'金融庁・各証券会社の解説'},
 fire:{t:'FIREと4%ルール',b:'年間支出の25倍の資産を作り、毎年4%ずつ取り崩して暮らす考え方。4%は株式の平均的な成長率7%からインフレ率3%を引いた数字が根拠とされる。',s:'Business Insider Japan'},
 shogaku:{t:'奨学金という借金',b:'大学生の約半数が奨学金を利用し、平均の借入額は約310万円。延滞している人の46.2%は正社員として働いている。',s:'日本学生支援機構の調査（ファイナンシャルフィールドより）'},
 kigyo:{t:'起業の生存率',b:'日本で起業した会社が1年後に残っている割合は95.3%、5年後は81.7%、10年後はおよそ66.5〜72%とされる。',s:'中小企業白書（2017年版）ほか'},
 kinri:{t:'消費者金融と総量規制',b:'消費者金融から借りられるのは原則として年収の3分の1まで（総量規制）。金利は年15〜18%ほど。',s:'貸金業法の一般的な仕組み'},
 nenkin:{t:'年金のしくみ',b:'国民年金（基礎年金）は40年間すべて納めると満額で月約7万円。会社員は厚生年金が上乗せされ、働いた期間と給料が多いほど増える。受け取り開始は60〜75歳で選べ、遅らせるほど1か月あたり0.7%増え、早めると0.4%減る。',s:'日本年金機構の制度概要（金額は目安）'},
 rougo:{t:'老後2000万円問題',b:'2019年、金融庁の報告書が「年金だけでは老後に約2000万円不足する」という試算を示し、大きな議論になった。',s:'金融庁 金融審議会 報告書（2019年）'},
 shussan:{t:'出産にかかるお金',b:'健康保険から「出産育児一時金」として、子ども1人につき50万円が支給される（2023年4月から）。出産費用の多くはこれでまかなえる。',s:'厚生労働省'},
 taima:{t:'大麻と法律',b:'2024年12月に施行された改正法で、大麻の「使用」そのものも処罰の対象になった。逮捕されれば、仕事も人間関係も大きく失う。',s:'大麻取締法・麻薬及び向精神薬取締法の改正'},
 menkyo:{t:'運転免許の費用',b:'普通免許を教習所で取ると、費用は30万円前後。合宿免許なら20万円台で、2週間ほどで取れることもある。',s:'各教習所の料金相場（目安）'},
 hoken:{t:'医療保険',b:'日本には公的医療保険と「高額療養費制度」があり、医療費の自己負担には上限がある。民間の医療保険は、それでも足りない入院費や先進医療に備えるもの。',s:'厚生労働省の制度概要'},
 kaigo:{t:'介護の費用',b:'有料老人ホームは入居一時金に数百万円、月々の費用も20万円前後かかることが多い。公的な特別養護老人ホームは安いが、入居待ちが長い地域もある。',s:'各種介護費用の調査（目安）'},
 kyoiku:{t:'子どもの教育費',b:'幼稚園から大学まですべて公立なら教育費は1000万円ほど、すべて私立なら2000万円を超えるとも言われる。東京では中学受験をする家庭も多い。',s:'文部科学省「子供の学習費調査」などをもとにした目安'},
 sagi:{t:'特殊詐欺',b:'「オレオレ詐欺」や還付金詐欺などの特殊詐欺は、高齢者を中心に毎年大きな被害が出ている。「お金の話が出たら、一度電話を切って家族に確認」が鉄則。',s:'警察庁の注意喚起'},
 inshu:{t:'飲酒運転',b:'酒気帯び運転は3年以下の懲役または50万円以下の罰金、酒酔い運転は5年以下の懲役または100万円以下の罰金。免許も取り消される。',s:'道路交通法'},
 mlm:{t:'マルチ商法',b:'「誰かを紹介すれば儲かる」と、商品の購入と勧誘を続けさせる連鎖販売取引。大学生や若い社会人が勧誘されやすく、友人関係を失うケースが多い。',s:'消費者庁などの注意喚起をもとにした一般的な説明'},
 juken:{t:'東京の中学受験',b:'首都圏では私立・国立中学を受験する小学生が多く、塾代は小4〜小6の3年間で数百万円になることもある。',s:'各種教育費調査（目安）'},
};
function know(k){if(INFO[k]&&!META.info[k]){META.info[k]=1;saveMeta();}}
function infoLink(k){know(k);return ` <a href="#" data-i="${k}" class="ilink">［解説］</a>`;}
document.addEventListener('click',e=>{const k=e.target.dataset&&e.target.dataset.i;if(k&&INFO[k]){e.preventDefault();e.stopPropagation();const i=INFO[k];sheet(i.t,`<p>${i.b}</p><p class="src">出典：${i.s}</p>`);}},true);

// =====================================================================
// 名前・気質・家庭
// =====================================================================
const MN=['蓮','湊','大翔','悠真','陽太','颯','樹','蒼','健太','翔','拓海','大和','海斗','涼介','航','陸','奏太','律','晴','朝陽'];
const FN=['陽菜','結衣','葵','凛','芽依','美咲','さくら','彩花','七海','真央','優奈','莉子','千尋','楓','杏','紬','澪','心春','結菜','咲'];
const LN=['佐藤','鈴木','高橋','田中','伊藤','渡辺','山本','中村','小林','加藤','吉田','山田','佐々木','松本','井上','木村','林','清水','山口','森'];
const OLDM=['一郎','茂','博','誠','浩二','和夫','隆','修'],OLDF=['恵子','久美子','由美','裕子','直美','幸子','洋子','真理子'];
const TRAITS={
 '好奇心旺盛':{study:5,skill:3},'内気':{comm:-10,mental:-3},'負けず嫌い':{study:4,health:3},'おおらか':{mental:10},'神経質':{mental:-6,study:6},
 '器用':{skill:10},'体が弱い':{health:-18},'運動神経抜群':{health:12},'甘えん坊':{comm:4,mental:-3},'頑固':{moral:5},'正義感が強い':{moral:12},
 'ひょうきん':{comm:10},'整った顔立ち':{charm:16},'天才肌':{study:12},'飽きっぽい':{skill:-4},'お金に細かい':{},'寂しがり屋':{comm:4,mental:-4},'度胸がある':{mental:6},
};
const TALENTS={study:'勉強',sport:'スポーツ',art:'絵',music:'音楽',comedy:'笑い',tech:'機械・パソコン',looks:'容姿',talk:'話術'};
const RANKS=['極貧','苦しい','ふつう','裕福','富裕層'];
const RANK_ADJ=['極貧の','暮らしの苦しい','ふつうの','裕福な','富裕層の'];
const RANK_MONEY=[5,22,45,70,92];
const PARENT_JOBS=[['日雇い','無職','パート'],['工場勤務','配送ドライバー','パート','介護職'],['会社員','公務員','看護師','営業職'],['会社の管理職','医師','歯科医','中小企業の社長'],['会社経営者','開業医','弁護士','資産家']];
const PARENT_PERS=['教育熱心','放任主義','厳格','優しい','過保護','気分屋','酒癖が悪い','仕事人間'];
const pname=sex=>pick(LN)+' '+(sex==='M'?pick(MN):pick(FN));

// =====================================================================
// 職業
// =====================================================================
// cat: 正社員/公務員/専門職/非正規/個人事業/経営者/芸能/学生/無職/年金
const JOBS={
 student:{n:'学生',cat:'学生',of:'hoodie'},
 none:{n:'無職',cat:'無職',of:'hoodie'},
 neet:{n:'引きこもり',cat:'無職',of:'pajama'},
 welfare:{n:'生活保護',cat:'無職',of:'hoodie'},
 pension:{n:'年金生活',cat:'年金',of:'elder'},
 freeter:{n:'フリーター（飲食・コンビニ）',cat:'非正規',base:205,gr:4,cap:270,st:4,diff:0,req:()=>true,rq:'誰でも',of:'apron',info:'minwage'},
 apparel:{n:'アパレル販売員',cat:'非正規',base:230,gr:6,cap:320,st:5,diff:5,req:S=>S.st.charm>=40,rq:'魅力40',of:'casual'},
 gig:{n:'フードデリバリー配達員',cat:'個人事業',base:240,gr:0,cap:320,st:5,hp:-3,diff:0,req:()=>true,rq:'誰でも',of:'tracksuit'},
 keibi:{n:'警備員',cat:'非正規',base:250,gr:3,cap:320,st:3,diff:0,req:()=>true,rq:'誰でも',of:'office'},
 tobi:{n:'建設作業員（とび職）',cat:'正社員',base:330,gr:15,cap:600,st:6,hp:-4,diff:5,req:S=>S.st.health>=50,rq:'体力50',of:'work'},
 factory:{n:'物流倉庫の正社員',cat:'正社員',base:275,gr:9,cap:460,st:4,hp:-2,diff:10,req:()=>true,rq:'学歴不問',of:'work'},
 driver:{n:'トラック・配送ドライバー',cat:'正社員',base:360,gr:8,cap:520,st:6,hp:-2,diff:10,req:S=>S.lic,rq:'運転免許',of:'work'},
 taxi:{n:'タクシー運転手',cat:'正社員',base:380,gr:6,cap:600,st:5,diff:10,req:S=>S.lic&&S.age>=21,rq:'運転免許・21歳以上',of:'suit'},
 kaigo:{n:'介護職',cat:'正社員',base:300,gr:8,cap:460,st:7,diff:5,req:()=>true,rq:'学歴不問',of:'work'},
 hoiku:{n:'保育士',cat:'正社員',base:300,gr:9,cap:480,st:6,diff:15,req:S=>S.lics.hoiku,rq:'保育士資格',of:'apron'},
 sales:{n:'中小企業の営業',cat:'正社員',base:310,gr:13,cap:620,st:6,diff:20,req:()=>true,rq:'学歴不問',of:'suit'},
 fudosan:{n:'不動産営業（歩合）',cat:'正社員',base:300,gr:0,cap:2500,st:9,diff:20,req:()=>true,rq:'学歴不問',of:'suit',var:'fudosan'},
 chef:{n:'料理人',cat:'正社員',base:250,gr:10,cap:480,st:7,diff:5,req:()=>true,rq:'学歴不問',of:'chef'},
 biyoshi:{n:'美容師',cat:'正社員',base:240,gr:14,cap:580,st:6,diff:10,req:S=>S.lics.biyo,rq:'美容師免許',of:'apron'},
 nurse:{n:'看護師',cat:'専門職',base:430,gr:10,cap:700,st:9,diff:10,req:S=>S.lics.nurse,rq:'看護師免許',of:'nurse'},
 police:{n:'警察官',cat:'公務員',base:380,gr:16,cap:800,st:8,diff:30,req:S=>S.st.health>=55&&!S.crime&&S.age<=35,rq:'体力55・前科なし・35歳まで',of:'office'},
 fire:{n:'消防士',cat:'公務員',base:370,gr:15,cap:780,st:7,hp:-1,diff:30,req:S=>S.st.health>=60&&!S.crime&&S.age<=35,rq:'体力60・前科なし',of:'work'},
 koumuin:{n:'都庁・区役所の公務員',cat:'公務員',base:330,gr:15,cap:800,st:3,diff:55,req:S=>S.st.study>=55&&S.age<=30&&!S.crime,rq:'学力55・30歳まで',of:'office'},
 teacher:{n:'学校の先生',cat:'公務員',base:350,gr:14,cap:760,st:8,diff:45,req:S=>S.uni>=1&&!S.crime,rq:'大卒',of:'office'},
 designer:{n:'Webデザイナー',cat:'正社員',base:310,gr:13,cap:750,st:6,diff:30,req:S=>S.st.skill>=30,rq:'スキル30',of:'casual'},
 engineer:{n:'ITエンジニア',cat:'正社員',base:340,gr:0,cap:1600,st:6,diff:35,req:S=>S.st.skill>=38,rq:'スキル38',of:'hoodie',var:'engineer'},
 maker:{n:'大手メーカー総合職',cat:'正社員',base:410,gr:23,cap:1150,st:5,diff:58,req:S=>S.uni>=2,rq:'中堅以上の大卒',of:'suit',ret:60},
 ad:{n:'広告代理店',cat:'正社員',base:450,gr:40,cap:1600,st:10,diff:68,req:S=>S.uni>=3&&S.st.comm>=55,rq:'上位大卒・コミュ55',of:'suit',ret:60},
 tv:{n:'テレビ局',cat:'正社員',base:500,gr:55,cap:1700,st:9,diff:78,req:S=>S.uni>=3&&S.st.comm>=60,rq:'上位大卒・コミュ60',of:'casual',ret:60},
 bank:{n:'メガバンク',cat:'正社員',base:430,gr:32,cap:1450,st:8,diff:62,req:S=>S.uni>=3,rq:'上位大卒',of:'suit',ret:60},
 shosha:{n:'総合商社',cat:'正社員',base:560,gr:55,cap:2200,st:8,diff:80,req:S=>S.uni>=3&&S.st.comm>=55,rq:'上位大卒・コミュ55',of:'suit',ret:60},
 consul:{n:'外資系コンサル',cat:'正社員',base:650,gr:85,cap:2800,st:11,diff:85,req:S=>S.uni>=4,rq:'難関大卒',of:'suit',ret:60},
 gaishi:{n:'外資系投資銀行',cat:'正社員',base:900,gr:120,cap:4000,st:12,diff:92,req:S=>S.uni>=4&&S.st.study>=80,rq:'難関大卒・学力80',of:'suit',ret:60},
 lawyer:{n:'弁護士',cat:'専門職',base:600,gr:50,cap:2500,st:9,diff:70,req:S=>S.lics.law,rq:'司法試験合格',of:'suit'},
 doctor:{n:'医師',cat:'専門職',base:500,gr:75,cap:2200,st:10,diff:50,req:S=>S.lics.med,rq:'医師免許',of:'nurse'},
 pharm:{n:'薬剤師',cat:'専門職',base:450,gr:12,cap:750,st:5,diff:40,req:S=>S.lics.pharm,rq:'薬剤師免許',of:'nurse'},
 creator:{n:'動画クリエイター・配信者',cat:'個人事業',base:0,st:5,diff:0,req:()=>true,rq:'誰でも（稼げるかは別）',of:'hoodie',var:'creator'},
 mangaka:{n:'漫画家・イラストレーター',cat:'個人事業',base:0,st:7,diff:0,req:S=>S.talent==='art'||S.st.skill>=55,rq:'絵の才能',of:'hoodie',var:'art'},
 dream:{n:'芸人・バンド・役者の卵',cat:'芸能',base:130,st:5,diff:0,req:S=>S.age<=32,rq:'32歳まで',of:'stage',var:'dream'},
 athlete:{n:'プロスポーツ選手',cat:'芸能',base:600,st:6,diff:999,req:()=>false,of:'tracksuit',var:'athlete'},
 night:{get n(){return typeof S!=='undefined'&&S&&S.sex==='F'?'キャバクラ嬢':'ホスト';},cat:'個人事業',base:0,st:10,hp:-8,diff:15,req:S=>S.age<=35,rq:'35歳まで',of:'night',var:'night'},
 star:{n:'売れっ子（芸能）',cat:'芸能',base:3000,st:8,diff:999,req:()=>false,of:'stage',var:'star'},
 ceo:{n:'会社経営者',cat:'経営者',base:0,st:9,diff:999,req:()=>false,of:'suit',var:'ceo'},
 shop:{n:'自分の店のオーナー',cat:'経営者',base:0,st:8,diff:999,req:()=>false,of:'apron',var:'shop'},
 rikishi:{n:'力士（相撲部屋）',cat:'芸能',base:100,gr:0,cap:100,st:8,hp:-2,diff:0,sx:'M',req:S=>S.age<=22&&S.st.health>=75,rq:'男性・22歳まで・体力75',of:'tracksuit',var:'rikishi'},
 hisho:{n:'受付・秘書',cat:'正社員',base:300,gr:7,cap:460,st:4,diff:30,sx:'F',req:S=>S.st.charm>=55&&S.age<=35,rq:'女性・魅力55・35歳まで',of:'office'},
 fuzoku:{n:'風俗店勤務',cat:'個人事業',base:0,st:10,hp:-5,diff:999,req:()=>false,of:'night',var:'fuzoku'},
 yami:{n:'闇バイト（特殊詐欺の受け子）',cat:'個人事業',base:0,st:10,diff:999,req:()=>false,of:'hoodie',var:'yami'},
 hiyatoi:{n:'日雇い・寮つき派遣',cat:'非正規',base:200,gr:0,cap:220,st:6,hp:-4,diff:999,req:()=>false,of:'work'},
 silver:{n:'シルバー人材（軽作業）',cat:'非正規',base:80,gr:0,cap:80,st:2,diff:0,req:S=>S.age>=60,rq:'60歳以上',of:'elder'},
 rehire:{n:'再雇用（嘱託）',cat:'非正規',base:0,st:3,diff:999,req:()=>false,of:'suit'},
};
const UNI_N=['','Fラン大学','日東駒専クラス','MARCHクラス','早慶・東大クラス'];

// =====================================================================
// 住まい
// =====================================================================
const HOMES={
 jikka:{n:'実家',rent:0,bg:null,ln:'',col:'#00a7db',req:S=>S.fam.alive&&!S.spouse,hp:0,mt:-2},
 share:{n:'シェアハウス（中野）',rent:5.5,bg:'apart',ln:'中央線',col:'#f15a22',req:S=>!S.spouse,hp:0,mt:1},
 suburb:{n:'郊外のワンルーム（埼玉寄り）',rent:6.3,bg:'apart',ln:'埼京線',col:'#80c241',req:S=>!S.spouse,hp:-3,mt:0},
 adachi:{n:'23区の安い1K（足立区）',rent:7.5,bg:'apart',ln:'東武線',col:'#ee7b1a',req:S=>!S.spouse,hp:-1,mt:0,info:'rent'},
 normal:{n:'23区の1K（平均的）',rent:10.2,bg:'apart',ln:'山手線',col:'#9acd32',req:S=>!S.spouse,hp:0,mt:2,info:'rent'},
 toshin:{n:'都心の1LDK（港区）',rent:23,bg:'mansion',ln:'銀座線',col:'#a9a9a9',req:()=>true,hp:1,mt:6},
 fam_sub:{n:'郊外の2LDK',rent:13.5,bg:'mansion',ln:'田園都市線',col:'#00ada9',req:()=>true,hp:-2,mt:2},
 fam_23:{n:'23区の2LDK',rent:23,bg:'mansion',ln:'山手線',col:'#9acd32',req:()=>true,hp:0,mt:4},
 publ:{n:'都営住宅',rent:4,bg:'apart',ln:'都営線',col:'#e85298',req:S=>S.cash<200&&grossNow()<300,hp:0,mt:0},
 netcafe:{n:'ネットカフェ暮らし',rent:6,bg:'street',ln:'',col:'#555',req:()=>false,hp:-6,mt:-8},
 own:{n:'持ち家',rent:0,bg:'house',ln:'',col:'#d7261e',req:()=>false,hp:0,mt:4},
 nursing:{n:'有料老人ホーム',rent:0,bg:'home_old',ln:'',col:'#9b7cb6',req:()=>false,hp:2,mt:0},
};
const HOUSES=[
 {id:'h_sub',n:'郊外の中古マンション',price:3500,dr:-.01,vol:.04,bg:'mansion',ln:'田園都市線',col:'#00ada9'},
 {id:'h_ko',n:'郊外の新築一戸建て',price:5200,dr:-.015,vol:.04,bg:'house',ln:'京王線',col:'#80c241'},
 {id:'h_23',n:'23区の中古マンション',price:7000,dr:.01,vol:.06,bg:'mansion',ln:'山手線',col:'#9acd32'},
 {id:'h_tw',n:'湾岸のタワーマンション',price:15000,dr:.02,vol:.09,bg:'tower',ln:'ゆりかもめ',col:'#a9a9a9'},
];

// =====================================================================
// 投資
// =====================================================================
const ASSETS={
 teiki:{n:'定期預金',mu:.004,beta:0,sd:0,d:'元本保証。ほぼ増えない'},
 kokusai:{n:'個人向け国債',mu:.012,beta:0,sd:0,d:'元本保証。金利は低め'},
 jpidx:{n:'日本株インデックス',mu:0,beta:1.05,sd:.05,d:'日本の株式市場全体に連動'},
 haito:{n:'高配当株',mu:-.01,beta:.8,sd:.06,div:.035,d:'毎年3〜4%の配当が入る'},
 ai:{n:'AI・半導体株',mu:.03,beta:1.6,sd:.32,d:'大化けも、暴落もある'},
 bankst:{n:'銀行株',mu:0,beta:1.2,sd:.15,d:'景気と金利に敏感'},
 game:{n:'ゲーム・エンタメ株',mu:.01,beta:1.1,sd:.26,d:'ヒット作次第'},
 gold:{n:'金（ゴールド）',mu:.05,beta:-.3,sd:.12,d:'不況に強いと言われる'},
 crypto:{n:'仮想通貨',mu:.12,beta:.6,sd:.85,d:'1年で半分にも5倍にもなる'},
 fx:{n:'FX（レバレッジ25倍）',mu:-.05,beta:0,sd:1.2,d:'全額失うこともある'},
};
const REGIMES={
 boom:{n:'好景気',r:[.2,.08],next:{boom:.38,normal:.47,crash:.15},news:['日経平均が史上最高値を更新','新卒の売り手市場が続く','都心のマンション価格が過去最高に']},
 normal:{n:'平常',r:[.06,.1],next:{boom:.2,normal:.6,slump:.15,crash:.05},news:['株式市場は小動き','物価上昇が続く','賃上げ率は前年並み']},
 slump:{n:'景気後退',r:[-.08,.1],next:{boom:.1,normal:.5,slump:.3,crash:.1},news:['企業の業績悪化が相次ぐ','求人倍率が低下','ボーナス削減の動き']},
 crash:{n:'暴落',r:[-.32,.08],next:{boom:.45,normal:.35,slump:.2},news:['株価が歴史的な暴落','金融不安が世界に広がる','リストラの嵐']},
};

// =====================================================================
// 状態
// =====================================================================
let S=null,TAB='year';
function newState(o){
  o=o||{};
  const sex=o.sex||(chance(.5)?'M':'F');
  const rank=o.rank!=null?o.rank:+wpick({0:8,1:20,2:47,3:18,4:7});
  const place=o.place||wpick({'23ku':35,'tama':25,'local':40});
  const struct=wpick(rank<=1?{both:62,single_m:26,single_f:5,grand:7}:{both:86,single_m:9,single_f:2,grand:3});
  const traits=[];while(traits.length<2){const t=pick(Object.keys(TRAITS));if(!traits.includes(t))traits.push(t);}
  const talent=pick(Object.keys(TALENTS));
  const last=pick(LN);
  const look=newLook(sex);
  const st={study:8,skill:5,comm:12,health:72+Math.floor(R()*12),mental:70,charm:30+Math.floor(R()*16),moral:60};
  traits.forEach(t=>{for(const k in TRAITS[t])st[k]=clamp(st[k]+TRAITS[t][k],0,100);});
  if(traits.includes('整った顔立ち'))look.sk=Math.min(look.sk,1);
  const mkParent=(sx,age)=>({name:last+' '+(sx==='M'?pick(OLDM):pick(OLDF)),sex:sx,age,alive:true,job:pick(PARENT_JOBS[rank]),pers:pick(rank<=1?PARENT_PERS:PARENT_PERS.filter(p=>p!=='酒癖が悪い')),look:Object.assign(newLook(sx),{hs:sx==='M'?'short':'bob'}),close:65,care:false,debt:rank<=1&&chance(.25)});
  const fam={rank,money:RANK_MONEY[rank],place,struct,alive:true,
    father:struct==='single_m'||struct==='grand'&&chance(.5)?null:mkParent('M',26+Math.floor(R()*12)),
    mother:struct==='single_f'||struct==='grand'&&chance(.5)?null:mkParent('F',24+Math.floor(R()*10)),
    grand:struct==='grand'?mkParent(chance(.5)?'M':'F',62+Math.floor(R()*8)):null,sibs:[]};
  const nsib=+wpick({0:25,1:45,2:25,3:5});
  for(let i=0;i<nsib;i++){const sx=chance(.5)?'M':'F';const older=chance(.5);fam.sibs.push({name:sx==='M'?pick(MN):pick(FN),sex:sx,age:older?2+Math.floor(R()*6):-1-Math.floor(R()*5),older,close:60,look:newLook(sx),alive:true});}
  if(struct!=='both')fam.sibs=fam.sibs.filter(s=>s.older);
  return {v:2,name:sex==='M'?pick(MN):pick(FN),last,sex,age:0,year:2008,birthY:2008,traits,talent,look,st,fam,
    cash:0,debt:0,port:{},nisa:{v:0,basis:0,used:0,plan:0,yr:0},house:null,home:'jikka',rentAdd:0,
    job:{id:'student',salary:0,years:0},uni:0,hs:null,lics:{},lic:false,crime:0,
    vice:{smoke:0,drink:0,gamble:0,drug:0},ins:{med:false,life:false},
    people:[],partner:null,spouse:null,exes:[],kids:[],pet:null,
    flags:{},log:[],books:{},rows:[],queue:[],notes:[],used:{},mood:'normal',
    nenkin:{paid:0,kosei:0,salSum:0,start:0,amount:0},regime:'normal',rm:0,side:0,unemp:0,
    effort:1,life:1,totalGross:0,gamble:{n:0,net:0},company:null,shop:null,dream:0,followers:0,ended:false,evDone:{},illness:null,hosp:0,schol:0,phase:'main'};
}
const J=()=>JOBS[S.job.id]||JOBS.none;
const GROW=['study','skill','comm','charm'];
function mod(o){for(const k in o){let v=o[k];if(!isFinite(v))continue;if(v>0&&GROW.includes(k)){const c=S.st[k];v*=c<30?1:c<50?.65:c<65?.4:c<80?.22:.1;}S.st[k]=clamp(S.st[k]+v,0,100);}}
function log(t){S.log.push({age:S.age,year:S.year,t});}
function note(t){S.notes.push(t);}
function row(t,v){if(Math.abs(v)<.05)return;S.rows.push({t,v});}
function pay(v,label){v=+v;if(!isFinite(v))return;S.cash-=v;row(label,-v);}
function gain(v,label){v=+v;if(!isFinite(v))return;S.cash+=v;row(label,v);}
function friends(){return S.people.filter(p=>p.kind==='friend');}
function addPerson(kind,rel,o){o=o||{};const sex=o.sex||(chance(.5)?'M':'F');const p=Object.assign({id:Math.random().toString(36).slice(2,8),kind,name:pname(sex),sex,rel,close:50+Math.floor(R()*15),age:S.age+Math.floor(R()*3)-1,trait:pick(['堅実','お調子者','野心家','面倒見がいい','自由人','心配性','見栄っ張り','お人よし']),look:newLook(sex)},o);if(kind==='friend'&&friends().length>=9){const w=friends().sort((a,b)=>a.close-b.close)[0];S.people=S.people.filter(x=>x!==w);}S.people.push(p);return p;}
function houseGrowth(h){return 1+h.dr+rn(0,h.vol)+(S.regime==='crash'?-.08:S.regime==='boom'?.03:0);}
function newsNow(){return pick(REGIMES[S.regime].news);}
function grossNow(){return (S.job.salary||0)+(S.side||0);}
function fullName(){return S.last+' '+S.name;}
function parents(){return [S.fam.father,S.fam.mother].filter(Boolean);}
function hardness(){return (S.fam.rank<=0?2:S.fam.rank===1?1:0)+(S.fam.struct!=='both'?1:0)+(S.flags.abused?2:0)+(S.flags.shisetsu?2:0)+(S.flags.futoko?1:0)+(S.flags.hodo?1:0);}
function livingParents(){return parents().filter(p=>p.alive&&!p.left);}
function dropUnborn(){S.fam.sibs=S.fam.sibs.filter(s=>s.older||S.age+s.age>0);}
function famMoneyAdj(v){S.fam.money=clamp(S.fam.money+v,0,100);}
const assetsTotal=()=>S.cash+S.nisa.v+Object.values(S.port).reduce((s,a)=>s+a.v,0)+(S.house?S.house.value-S.house.loan:0)+(S.company?S.company.value*S.company.eq:0)+(S.reInv?S.reInv.value-S.reInv.loan:0)-S.debt-S.schol;
const investTotal=()=>S.nisa.v+Object.values(S.port).reduce((s,a)=>s+a.v,0)+(S.house?S.house.value-S.house.loan:0)+(S.reInv?S.reInv.value-S.reInv.loan:0);

// =====================================================================
// 子ども
// =====================================================================
function newKid(){
  const sex=chance(.5)?'M':'F';const tr=pick(Object.keys(TRAITS));
  const k={name:sex==='M'?pick(MN):pick(FN),sex,age:0,trait:tr,look:newLook(sex),close:70,st:{study:10,health:70+Math.floor(R()*15),mental:65,moral:60,talent:pick(Object.keys(TALENTS))},priv:0,juku:0,status:'',indep:false,away:false,job:null,income:0,married:false,grand:0};
  if(S.spouse&&S.spouse.look&&chance(.5))k.look.hc=S.spouse.look.hc;else k.look.hc=S.look.hc;
  return k;
}
function kidMod(k,o){for(const x in o)k.st[x]=clamp(k.st[x]+o[x],0,100);}
function kidLabel(k){const same=S.kids.filter(x=>x.sex===k.sex);const i=same.indexOf(k)+1;return (k.sex==='M'?['','長男','次男','三男','四男','五男']:['','長女','次女','三女','四女','五女'])[Math.min(i,5)];}
function kidJob(k){
  const s=k.st;let j;
  if(s.moral<25&&chance(.5))j={n:'定職につかず',inc:80,tier:0};
  else if(s.mental<25&&chance(.5))j={n:'引きこもり',inc:0,tier:0};
  else if(s.study>=80)j={n:pick(['外資系企業','医師','官僚','大手商社']),inc:900,tier:4};
  else if(s.study>=60)j={n:pick(['大手企業の会社員','銀行員','ITエンジニア','公務員']),inc:550,tier:3};
  else if(s.study>=40)j={n:pick(['会社員','看護師','保育士','営業職']),inc:400,tier:2};
  else j={n:pick(['フリーター','工場勤務','配送ドライバー','介護職']),inc:270,tier:1};
  if(k.st.talent==='sport'&&k.st.health>=80&&chance(.25))j={n:'プロスポーツ選手',inc:1500,tier:4};
  if(['music','comedy','looks'].includes(k.st.talent)&&chance(.12))j={n:'芸能人',inc:1200,tier:4};
  return j;
}

// =====================================================================
// 見た目（絵）
// =====================================================================
function outfitFor(age,jobId,sex){
  if(age<3)return 'baby';if(age<12)return 'kid';if(age<18)return S&&S.flags.dropout?'casual':'school';if(age>=65)return 'elder';
  return (JOBS[jobId]&&JOBS[jobId].of)||'casual';
}
function playerSVG(){
  const m=S.st.mental<25?'sad':S.mood||'normal';
  const L=Object.assign({},S.look);if(S.flags.dye&&S.age>=15&&S.age<40)L.dye=S.flags.dye;if(S.flags.glasses)L.glasses=true;
  return chibi({look:L,age:S.age,outfit:S.hosp?'pajama':outfitFor(S.age,S.job.id,S.sex),mood:m,cane:S.age>=78});
}
function personSVG(p,age,mood,outfit){return chibi({look:p.look,age,outfit:outfit||outfitFor(age,null,p.sex),mood:mood||'normal',cane:age>=80});}
function bgNow(){
  if(S.hosp)return 'hospital';
  if(S.home==='netcafe'||S.flags.homeless)return 'street';
  if(S.home==='nursing')return 'home_old';
  if(S.house)return S.house.bg;
  if(S.home==='jikka'){if(S.fam.place==='local')return 'local';return S.fam.rank<=1?'apart':'house';}
  return HOMES[S.home].bg||'apart';
}
function renderScene(){
  const el=$('#scene');if(!el)return;
  const items=[];
  const K=Math.max(1,(el.clientHeight||138)/138);
  const add=(svg,w,h,x,y)=>items.push(`<div class="ch" style="width:${w*K}px;height:${h*K}px;left:${x}%;bottom:${y*K}px">${svg}</div>`);
  // 家族
  const withFam=S.home==='jikka'||S.age<18;
  let left=[],right=[];
  if(S.spouse&&S.spouse.alive!==false)right.push(personSVG(S.spouse,S.spouse.age,S.spouse.close>60?'happy':S.spouse.close<25?'angry':'normal',S.spouse.of));
  S.kids.filter(k=>!k.indep&&!k.away&&k.alive!==false).slice(0,3).forEach(k=>left.push(personSVG(k,k.age,k.close>70?'happy':'normal')));
  if(withFam){livingParents().forEach(p=>right.push(personSVG(p,p.age,'normal',p.age>=65?'elder':p.job.includes('医')?'nurse':'casual')));S.fam.sibs.filter(s=>s.alive&&S.age-0>=0&&s.age+S.age>=0&&!s.left).slice(0,2).forEach(s=>left.push(personSVG(s,Math.max(0,S.age+s.age),'normal')));}
  const main=`<div class="ch me" style="width:${80*K}px;height:${120*K}px;left:50%;bottom:${6*K}px;transform:translateX(-50%)">${playerSVG()}</div>`;
  left.slice(0,3).forEach((svg,i)=>add(svg,56,84,30-i*13,8));
  right.slice(0,3).forEach((svg,i)=>add(svg,56,84,57+i*13,8));
  if(S.pet)items.push(`<div class="ch" style="width:${44*K}px;height:${36*K}px;left:${S.kids.length?6:20}%;bottom:${6*K}px">${catSVG()}</div>`);
  el.innerHTML=`<div class="bg">${sceneSVG(bgNow())}</div>${items.join('')}${main}`;
}

// =====================================================================
// タイトル
// =====================================================================
function title(){
  const t=$('#title');t.classList.remove('hidden');
  let hasSave=false;try{hasSave=!!localStorage.getItem(SAVE_KEY);}catch(e){}
  const tn=Object.keys(META.titles).length;
  const demo=[newLook('M'),newLook('F'),newLook('M'),newLook('F')];
  t.innerHTML=`<div class="tboard">
   <div class="trow"><span class="kind">種別</span><span class="dst">行先</span><span class="tm">発車</span></div>
   <div class="trow"><span class="kind">各停</span><span class="dst">寿命 ゆき</span><span class="tm">0歳</span></div>
   <div class="trow"><span class="kind">快速</span><span class="dst">億り人 ゆき</span><span class="tm">--</span></div>
   <div class="trow"><span class="kind">各停</span><span class="dst">ふつうの幸せ ゆき</span><span class="tm">--</span></div>
   <div class="trow"><span class="kind" style="color:#ff6a3d">運休</span><span class="dst" style="color:#ff6a3d">人生どん底 ゆき</span><span class="tm">--</span></div>
  </div>
  <div class="ttl">ワンライフ</div><div class="tsub">人生は、一度きり。超リアル人生ゲーム</div>
  <div class="tchars">${[[1,'baby'],[9,'kid'],[16,'school'],[30,'suit'],[72,'elder']].map(([a,o],i)=>`<div>${chibi({look:demo[i%4],age:a,outfit:o,mood:i%2?'happy':'normal'})}</div>`).join('')}</div>
  <div class="tlines"><i style="background:#9acd32"></i><i style="background:#f15a22"></i><i style="background:#0068b7"></i><i style="background:#e5171f"></i><i style="background:#00ada9"></i><i style="background:#a9a9a9"></i><i style="background:#9b7cb6"></i></div>
  <button class="tbtn" id="tNew">乗 車 す る<small>性別も、家も、才能も、ランダムで生まれる</small></button>
  ${hasSave?'<button class="tbtn s" id="tCont">途中から続ける<small>前回降りた駅から</small></button>':''}
  <button class="tbtn s" id="tPick">生まれを選んで乗車<small>性別・家庭の経済状況・生まれた場所を選ぶ（本番は課金予定 ¥160／今は無料）</small></button>
  <button class="tbtn s" id="tDex">記録を見る<small>手に入れた人生の称号 ${tn} / ${TITLES.length}</small></button>
  <div class="tinfo">0歳から寿命が尽きるまで、一年ずつ「駅」に停まりながら人生を進める。生まれる家、性別、気質、才能はランダム。そこから先は、毎年やってくる出来事に、あなたが答えていく。<br><br>給料・家賃・税金・還元率・年金などは、公的統計や調査をもとにしている（ゲーム用に簡略化）。<br>乗車回数 ${META.lives}　／　本番なら使った金額 ¥${META.yen}</div>`;
  $('#tNew').onclick=()=>{try{localStorage.removeItem(SAVE_KEY);}catch(e){}start();};
  if($('#tCont'))$('#tCont').onclick=()=>{try{S=JSON.parse(localStorage.getItem(SAVE_KEY));t.classList.add('hidden');render();}catch(e){start();}};
  $('#tPick').onclick=pickBirth;
  $('#tDex').onclick=()=>sheet('記録',dexHTML());
}
function pickBirth(){
  sheet('生まれを選ぶ',`<p class="src">本番では課金（¥160）を予定。今はテストなので無料。気質と才能はランダムのまま。</p>
  <div class="lab">性別</div><div class="seg" id="pS"><button data-v="M" class="on">男</button><button data-v="F">女</button></div>
  <div class="lab">家庭の経済状況</div><div class="seg" id="pR">${RANKS.map((r,i)=>`<button data-v="${i}" class="${i===2?'on':''}">${r}</button>`).join('')}</div>
  <div class="lab">生まれた場所</div><div class="seg" id="pP"><button data-v="23ku" class="on">東京23区</button><button data-v="tama">東京郊外</button><button data-v="local">地方</button></div>`,
  [{t:'この生まれで乗車する',f:ov=>{const g=id=>ov.querySelector(id+' .on').dataset.v;start({sex:g('#pS'),rank:+g('#pR'),place:g('#pP')});}}],
  ov=>ov.querySelectorAll('.seg').forEach(sg=>sg.querySelectorAll('button').forEach(b=>b.onclick=()=>{sg.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');})));
}
function start(o){
  S=newState(o);META.lives++;saveMeta();TAB='year';
  $('#title').classList.add('hidden');
  const f=S.fam,pl={'23ku':'東京23区','tama':'東京の郊外','local':'地方の町'}[f.place];
  const fam=f.struct==='both'?'両親':f.struct==='single_m'?'母ひとり':f.struct==='single_f'?'父ひとり':'祖父母';
  log(`${pl}の${RANK_ADJ[f.rank]}家に生まれる`);
  S.queue.push({id:'birth',tag:'誕生',who:null,tx:`${S.year}年、${pl}で生まれた。<br>名前は<b>${fullName()}</b>（${S.sex==='M'?'男の子':'女の子'}）。<br><br>家庭：<b>${RANKS[f.rank]}</b>（${fam}${f.sibs.length?'・きょうだい'+f.sibs.length+'人':''}）<br>${f.father?`父：${f.father.job}・${f.father.pers}<br>`:''}${f.mother?`母：${f.mother.job}・${f.mother.pers}<br>`:''}${f.grand?`育ててくれるのは祖${f.grand.sex==='M'?'父':'母'}（${f.grand.age}歳）<br>`:''}気質：<b>${S.traits.join('・')}</b><br><span class="note">才能はまだ誰にもわからない。</span>`,
   ops:[{t:'人生を始める',f:()=>{S.mood='happy';return null;}}]});
  startYear(true);
}

// =====================================================================
// 年の始まり
// =====================================================================
function eventsPerYear(){const a=S.age;if(a<3)return 2;if(a<6)return 2;if(a<13)return 3;if(a<23)return 3+(chance(.4)?1:0);if(a<60)return 2+(chance(.45)?1:0);return 2;}
function startYear(first){if(!isFinite(S.cash))S.cash=0;if(!isFinite(S.debt))S.debt=0;if(S.spouse&&!isFinite(S.spouse.income)){S.spouse.income=250;S.spouse.cap=S.spouse.cap||400;S.spouse.gr=S.spouse.gr||5;}
  S.used={};S.rows=[];S.lastRes=null;S.mood=S.mood==='happy'&&!first?'normal':S.mood;
  if(!first){S.prevNotes=S.notes;S.notes=[];}
  if(typeof buildEvents==='function')buildEvents(first);
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){}
  render();
}

// =====================================================================
// 税・お金
// =====================================================================
function tedori(g){if(g<=0)return {net:0,taxable:0};const so=g*.15,kd=clamp(g*.3+8,55,195),tx=Math.max(0,g-so-kd-48);
  const it=tx<=195?tx*.05:tx<=330?tx*.1-9.75:tx<=695?tx*.2-42.75:tx<=900?tx*.23-63.6:tx<=1800?tx*.33-153.6:tx<=4000?tx*.4-279.6:tx*.45-479.6;
  return {net:g-so-it*1.021-(S.prevTax||0)*.1,taxable:tx};}
function householdSize(){return 1+(S.spouse?1:0)+S.kids.filter(k=>!k.indep&&!k.away).length;}
function livingBase(){if(S.job.id==='student'&&S.age>=18)return [70,100,180][S.life];return [90,145,260][S.life]*(S.spouse?1.5:1)*(S.age>=70?.8:1);}
function kidCost(k){if(k.indep||k.away)return 0;const a=k.age;let c=a<3?55:a<7?70:a<13?85:a<16?95:a<19?115:0;if(k.juku&&a>=9&&a<19)c+=45;if(k.priv&&a>=12&&a<19)c+=100;if(k.uni&&a>=19&&a<23)c+=k.uni===2?200:150;return c;}
function rentYear(){if(S.house)return S.house.pay;if(S.home==='nursing')return 240;const h=HOMES[S.home];return (h.rent+(S.rentAdd||0))*12+(S.home==='jikka'?(S.age>=20?36:0):0);}
function subsYear(){let v=0;if(S.vice.smoke>=30)v+=22;if(S.vice.drink>=40)v+=Math.round(S.vice.drink/3);if(S.car)v+=50;if(S.pet)v+=12;if(S.ins.med)v+=5;if(S.ins.life)v+=15;if(S.oshi)v+=30;if(S.careCost)v+=S.careCost;if(S.yoiku)v+=S.yoiku;return v;}
function yearlyExpense(){let e=livingBase()+rentYear()+subsYear();S.kids.forEach(k=>e+=kidCost(k));return e;}
function pensionCalc(startAge){const k=82*Math.min(40,S.nenkin.paid)/40;const avg=S.nenkin.kosei?S.nenkin.salSum/S.nenkin.kosei:0;const ko=avg*.005481*S.nenkin.kosei;const m=startAge<65?1-(65-startAge)*12*.004:1+(startAge-65)*12*.007;return Math.round((k+ko)*m);}

// =====================================================================
// 仕事の収入
// =====================================================================
function setJob(id,sal){if(id==='student')S.baito=S.baito||80;
  const j=JOBS[id];if(S.job.id!==id&&!['student','none','neet'].includes(S.job.id))S.jobs=(S.jobs||[]).concat(J().n);
  let s=sal!=null?sal:(j.base||0);if(id==='engineer'&&sal==null)s=330+S.st.skill*1.3;if(S.uni>=3&&j.base>300&&sal==null)s*=1.05;
  S.job={id,salary:s,years:0};if(id!=='student')S.baito=0;
  if(['正社員','公務員','専門職'].includes(j.cat)&&chance(.6))addPerson('friend','職場の同僚');
  log(`${j.n}になる`);
}
function jobIncome(){
  const j=J(),eff=[-.1,0,.12][S.effort];let g=0;
  switch(j.var){
    case 'fudosan':g=250+S.st.comm*8*(.35+R()*1.35)*(1+eff)*(S.regime==='crash'?.6:1);break;
    case 'night':g=(150+(S.st.comm+S.st.charm)*7*(.3+R()*1.5))*(1+eff);break;
    case 'creator':S.followers=Math.max(0,(S.followers||0)*(1+(S.st.skill/100)*(.1+R()*.7))+S.st.skill*.12+(S.effort===2?5:0)-(S.age>45?S.followers*.08:0));g=S.followers*1.1;break;
    case 'art':g=40+S.st.skill*3*(.2+R()*1.4);if(S.st.skill>70&&chance(.06*(S.gift==='art'?4:1))){S.flags.hit=1;g+=2000;note('作品が大ヒットした！ 印税が一気に入ってきた。');log('作品が大ヒット');}break;
    case 'dream':g=130;S.dream+=S.st.skill*.08+R()*6+(S.effort===2?4:0)+(['comedy','music','looks'].includes(S.talent)?4:0);if(S.dream>=100&&chance(.05+S.st.charm/900+(['comedy','music','looks'].includes(S.talent)?.1:0))){setJob('star');S.flags.dreamCome=1;log('ブレイクして売れっ子に');note('テレビ出演をきっかけに、一気にブレイクした！ 夢が叶った。');}break;
    case 'star':g=1500+R()*4000;if(chance(.09)){note('人気が落ち着き、仕事が減ってきた。');setJob('dream',130);S.dream=60;}break;
    case 'athlete':g=S.job.salary*(0.6+R()*.9);S.job.salary=Math.max(300,S.job.salary+rn(50,200));if(S.age>=33&&chance(.35)){note('体の限界を感じ、現役を引退した。');log('現役引退');setJob('none');}break;
    case 'ceo':{const c=S.company;if(!c){g=0;break;}c.yrs++;const pw=(S.st.skill+S.st.comm+(c.joined?60:0))/3;const gr=(pw/50-1)*.5+rn(-.08,.34)+(S.effort===2?.08:0)+(S.regime==='crash'?-.3:S.regime==='boom'?.12:0);const damp=c.value>2e4?Math.log10(c.value/2e4)*.18:0;c.value=Math.min(5e6,Math.max(0,c.value*(1+gr-damp)));if(c.value<200||chance(.07))S.flags.coCrisis=1;g=S.job.salary+(c.value>5000?Math.min(6000,c.value*.008):0);break;}
    case 'shop':{const sh=S.shop;if(!sh){g=0;break;}sh.yrs++;const p=S.st.skill*7*(.25+R()*1.3)+(S.effort===2?80:0)-180+(S.regime==='boom'?60:S.regime==='crash'?-120:0);if(p<0){sh.loss+=-p;pay(-p,'店の赤字');g=0;}else g=p+120;if(sh.loss>700){note(`赤字が続き、${sh.kind}を閉店した。`);log(sh.kind+'を閉店');S.shop=null;S.flags.shopFail=1;setJob('none');}break;}
    case 'rikishi':S.sumo=(S.sumo||0)+S.st.health*.06+R()*9+(S.effort===2?4:0);if(!S.flags.sekitori&&S.sumo>=70&&chance(.35)){S.flags.sekitori=1;log('十両に昇進、関取になる');note('十両に昇進した。ついに関取だ。月給110万円が出る。');}g=S.flags.sekitori?1320:100;if(S.age>=30&&chance(S.flags.sekitori?.2:.35)){note('ケガが重なり、土俵を去った。');log('力士を引退');setJob('none');}break;
    case 'fuzoku':g=(280+S.st.charm*5*(.3+R()*1.2))*(S.age<28?1:S.age<34?.7:.45);mod({mental:-7});if(chance(.12)){note('客とのトラブルに巻き込まれた。');mod({mental:-10});}break;
    case 'yami':g=120+R()*200;mod({mental:-8,moral:-10});if(chance(.4)){S.job={id:'none',salary:0,years:0};arrest('特殊詐欺（受け子）',chance(.5)?3:0);}break;
    case 'engineer':g=S.job.salary;S.job.salary=Math.min(1600,S.job.salary+8+S.st.skill*.35*(1+eff)+(S.effort===2?10:0));break;
    default:
      if(['none','neet'].includes(S.job.id)){g=S.unemp||0;S.unemp=0;break;}
      if(['student','pension','welfare'].includes(S.job.id)){g=0;break;}
      g=S.job.salary;const perf=(S.st.skill*.5+S.st.comm*.3+S.st.study*.2)/50;
      if(j.gr)S.job.salary=Math.min(j.cap,S.job.salary+j.gr*(.5+perf*.5)*(1+eff*2)*(S.regime==='crash'||S.regime==='slump'?.3:1));
  }
  return Math.max(0,g);
}

// =====================================================================
// 一年の精算
// =====================================================================
function nextYear(){
  if(S.queue.length){toast('まだ答えていない出来事がある');return;}
  const N=S.notes;
  // ---- 子ども時代 ----
  if(S.age<15){
    kidIncome(); // random.js：家ごと・年ごとに違うお小遣いとお年玉
  }else{
    // ---- 収入 ----
    const jg=jobIncome(),side=(S.side||0)+(S.baito||0),gross=jg+side;S.totalGross+=gross;
    const td=tedori(gross);S.prevTax=td.taxable;
    if(jg>0)row(['個人事業','経営者','芸能'].includes(J().cat)?'事業収入（税引後）':S.job.id==='student'?'アルバイト代':'給与（手取り）',td.net*jg/(gross||1));
    if(side>0)row('バイト・副業（税引後）',td.net*side/(gross||1));
    S.cash+=td.net;
    if(['正社員','公務員','専門職'].includes(J().cat)){S.nenkin.kosei++;S.nenkin.salSum+=Math.min(gross,1300);S.nenkin.paid++;}
    else if(S.age>=20&&S.age<60&&S.flags.payNenkin!==false&&S.job.id!=='student'){if(S.cash>20){pay(20,'国民年金保険料');S.nenkin.paid++;}else S.nenkin.paid+=.5;}
    else if(S.job.id==='student'&&S.flags.payNenkin===true&&S.age>=20){S.nenkin.paid++;}
    if(S.job.id!=='student'&&!['無職','年金'].includes(J().cat))S.workYears=(S.workYears||0)+1;
    // 配偶者・子・年金・仕送り
    if(S.spouse&&S.spouse.work&&S.spouse.age<65){const sn=S.spouse.income*.78;gain(sn,'配偶者の手取り');S.spouse.income=Math.min(S.spouse.cap||1200,S.spouse.income+(S.spouse.gr||6));}
    if(S.spouse&&S.spouse.age>=65){gain(90,'配偶者の年金');}
    if(!S.nenkin.amount&&S.age>=66&&!S.nenkin.start)S.nenkin.start=65;
    if(!S.nenkin.amount&&S.nenkin.start&&S.age>S.nenkin.start){S.nenkin.amount=pensionCalc(S.nenkin.start);}
    if(S.nenkin.amount>0)gain(S.nenkin.amount,'年金');
    S.kids.forEach(k=>{if(k.indep&&k.income>0&&k.close>=55&&S.age>=60&&k.alive!==false){const v=Math.round(Math.min(120,k.income*.06*(k.close/70)));if(v>0)gain(v,`${k.name}からの仕送り`);}});
    if(S.job.id==='student'&&S.home!=='jikka'){const sh=[0,2,6,10,18][S.fam.rank]*12;if(sh>0&&S.fam.alive)gain(sh,'実家からの仕送り');}
    if(S.job.id==='welfare'){gain(150,'生活保護費');}
    if(!S.spouse&&(S.flags.singleMom||S.yoikuIn||S.flags.singleParent)&&S.kids.some(k=>!k.indep&&!k.away&&k.age>=0&&k.age<18)&&grossNow()<400)gain(50,'児童扶養手当');
    if(S.yoikuIn&&S.kids.some(k=>!k.indep))gain(S.yoikuIn,'養育費（受け取り）');
    // ---- 支出 ----
    const rent=rentYear();if(rent>0)pay(rent,S.house?'住宅ローン返済':S.home==='jikka'?'実家に入れるお金':S.home==='nursing'?'老人ホームの費用':'家賃');
    if(S.home!=='jikka'||S.age>=22)pay(livingBase()*(S.home==='jikka'?.4:1),'生活費');
    let kc=0;S.kids.forEach(k=>kc+=kidCost(k));if(kc)pay(kc,'子どもの費用');
    if(S.vice.smoke>=30)pay(22,'タバコ代');if(S.vice.drink>=40)pay(Math.round(S.vice.drink/3),'お酒代');
    if(S.car)pay(50,'車の維持費');if(S.pet)pay(12,'ペットの費用');if(S.ins.med)pay(5,'医療保険料');if(S.ins.life)pay(15,'生命保険料');if(S.oshi)pay(30,'推し活');
    if(S.careCost)pay(S.careCost,'親の介護費用');if(S.yoiku)pay(S.yoiku,'養育費');
    if(S.edu&&S.edu.left>0){if(S.edu.self){pay(S.edu.cost,'学費');}if(S.edu.loan){S.schol+=S.edu.cost+(S.home!=='jikka'?40:0);gain(S.edu.cost+(S.home!=='jikka'?40:0),'奨学金の振込');pay(S.edu.cost,'学費');}S.edu.left--;}
    if(S.schol>0&&(!S.edu||S.edu.left<=0)&&S.age>=22){const p=Math.min(S.schol,20);S.schol-=p;pay(p,'奨学金の返済');}
    if(S.reInv){const r=S.reInv;const net=r.rent-r.pay-25;row('ワンルーム投資の収支',net);S.cash+=net;r.value*=1-.02+rn(0,.03);r.loan=Math.max(0,r.loan-r.pay*.6);}
  }
  // ---- 住宅 ----
  if(S.house){const h=S.house;h.yrs++;const intr=h.loan*h.rate;h.loan=Math.max(0,h.loan-(h.pay-intr));h.value*=houseGrowth(h);if(h.loan<=0)h.pay=0;}
  // ---- 投資 ----
  marketYear();
  // ---- 借金 ----
  if(S.debt>0){const it=Math.min(S.debt,300)*.15+Math.max(0,S.debt-300)*.03;S.debt+=it;row('借金の利息',-it);if(S.debt>Math.max(300,grossNow()*1.2)&&S.age-(S.flags.bkAskAge||0)>=1){S.flags.bankruptAsk=1;S.flags.bkAskAge=S.age;}}
  if(S.cash<0)coverShortfall();
  else if(S.debt>0&&S.cash>80){const v=Math.min(S.debt,S.cash-80);S.debt-=v;pay(v,'借金返済');}
  // ---- 体と心 ----
  yearBody();
  // ---- 人 ----
  yearPeople();
  // ---- 記帳 ----
  S.books[S.year]={rows:S.rows,age:S.age,rm:S.rm,regime:S.regime};
  // ---- 加齢 ----
  S.age++;S.year++;S.job.years++;S.side=0;S.hosp=Math.max(0,(S.hosp||0)-1);
  if(S.age===15&&!S.hs)S.hs={tier:2,n:'公立高校'};
  // ---- 死 ----
  if(deathCheck())return;
  startYear();
}
function coverShortfall(){
  let need=-S.cash;
  const order=['crypto','fx','ai','game','bankst','jpidx','haito','gold','kokusai','teiki'];
  for(const k of order){if(need<=0)break;const a=S.port[k];if(!a||a.v<=0)continue;const v=Math.min(a.v,need);sellAsset(k,v,true);need=-S.cash;}
  if(S.cash<0&&S.nisa.v>0){const v=Math.min(S.nisa.v,-S.cash);S.nisa.v-=v;S.nisa.basis=Math.max(0,S.nisa.basis-v);gain(v,'NISAを取り崩し');}
  if(S.cash<0){const lim=Math.max(30,grossNow()/3)+(S.shop?300:0)+(S.house?200:0);const n2=-S.cash;S.debt+=n2;S.cash=0;row('借入（カード・消費者金融）',n2);if(S.debt>lim*1.8&&S.debt>150)S.flags.bankruptAsk=1;}
}
function sellAsset(k,v,auto){const a=S.port[k];if(!a)return;v=Math.min(v,a.v);const frac=a.v?v/a.v:0;const basis=a.basis*frac;const gainV=v-basis;const tax=k==='teiki'||k==='kokusai'?0:Math.max(0,gainV*.20315);a.v-=v;a.basis-=basis;S.cash+=v-tax;row(`${ASSETS[k].n}を売却${auto?'（不足分）':''}`,v);if(tax>0)row('譲渡益課税（20.315%）',-tax);if(a.v<.5)delete S.port[k];}
function marketYear(){
  const reg=REGIMES[S.regime];const rm=rn(reg.r[0],reg.r[1]);S.rm=rm;
  // NISA積立
  if(S.age>=18){const room=Math.min(360-(S.nisa.yr||0),1800-S.nisa.used);const v=Math.min(S.nisa.plan,room,Math.max(0,S.cash));if(v>0){pay(v,'新NISA 積立');S.nisa.v+=v;S.nisa.basis+=v;S.nisa.used+=v;}}
  S.nisa.yr=0;S.nisa.v*=1+rm+.01;
  for(const k in S.port){const A=ASSETS[k],a=S.port[k];const r=A.mu+A.beta*rm+(A.sd?rn(0,A.sd):0);a.v*=Math.max(k==='fx'?0:.05,1+r);if(A.div&&a.v>0){const d=a.v*A.div*.8;gain(d,'配当金（税引後）');}if(a.v<.3&&k==='fx'){delete S.port[k];note('FXでロスカットされ、証拠金がすべて消えた。');}}
  S.regime=wpick(reg.next);
}
function yearBody(){
  const j=J(),sm=[.5,1,1.6][S.effort],a=S.age;
  let h=-(j.st||0)*.28*sm+(j.hp||0)+(HOMES[S.home]?HOMES[S.home].hp||0:0)+(a<25?2:a<40?1:a<55?0:a<70?-1:-1.5)+(S.life===2?1:0)+1.5;
  let m=-(j.st||0)*.55*sm+(HOMES[S.home]?HOMES[S.home].mt||0:0)+[-3,0,3][S.life]+(S.spouse&&S.spouse.close>50?3:0)+(S.pet?2:0)+(friends().some(f=>f.close>=60)?2:-2)+3;
  if(S.vice.smoke>=30)h-=a>35?2:1;if(S.vice.drink>=60)h-=2;if(S.vice.drug>0){h-=6;m-=6;}
  if(S.age>=45){S.st.study=Math.max(0,S.st.study-.6);}if(S.age>=60){S.st.skill=Math.max(0,S.st.skill-.6);}
  if(S.illness){h-=3;S.illYears=(S.illYears||0)+1;if(S.illYears>=3){if(chance(.5)){S.notes.push(`長い闘病の末、${S.illness}が落ち着いた。`);S.illness=null;S.illYears=0;}}}
  if(S.age<15)m+=S.fam.father&&!S.fam.father.left&&S.fam.father.pers==='酒癖が悪い'?-4:0;
  mod({health:h,mental:m,charm:(a>35?-1:a<20?1:0)+(S.life===2?1:0),skill:S.job.id==='student'&&S.age>=15?(S.edu&&S.edu.it?6:2):(S.effort===2?2:a<60?1:0),study:a>=6&&a<22?(S.flags.futoko?0:2):0});
  if(S.vice.drink>=70&&chance(.12)&&!S.flags.alc){S.flags.alc=1;note('毎晩飲まないと眠れなくなった。アルコール依存の一歩手前だ。');}
}
function yearPeople(){
  const N=S.notes;
  S.people.forEach(p=>{p.close=clamp(p.close-4,0,100);p.age++;});
  S.people=S.people.filter(p=>p.kind!=='friend'||p.close>0);
  if(S.partner){S.partner.yrs++;S.partner.age++;S.partner.close-=11;if(S.partner.close<=12){N.push(`${S.partner.name}と別れた。すれ違いが続いた。`);log(S.partner.name+'と別れる');S.exes.push(S.partner.name);S.partner=null;mod({mental:-10});S.mood='sad';}}
  if(S.spouse){const sp=S.spouse;sp.years++;sp.age++;sp.close=clamp(sp.close-3+(S.effort===2?-4:0)+(sp.pers==='優しい'?2:0),0,100);
    if(sp.pers==='浪費家')pay(30,'配偶者の浪費');if(sp.pers==='ギャンブル好き'&&chance(.3)){pay(40,'配偶者のギャンブル負け');}
    const ma=S.sex==='F'?S.age:sp.age;
    if(S.flags.tryBaby&&ma<=45&&chance((ma<30?.6:ma<35?.5:ma<38?.35:ma<41?.2:.07)+(S.flags.ivf?.15:0))){S.flags.tryBaby=0;S.flags.ivf=0;const k=newKid();k.age=-1;S.kids.push(k);N.push(`子どもが生まれた。${kidLabel(k)}「${k.name}」。`);log(`${kidLabel(k)}の${k.name}が生まれる`);mod({mental:10});S.mood='happy';know('shussan');}
    const sh=sp.age<60?.003:sp.age<70?.01:sp.age<80?.03:sp.age<90?.09:.2;
    if(chance(sh)){N.push(`${sp.name}が亡くなった。`);log(sp.name+'に先立たれる');S.widow=sp.name;if(S.ins.life&&false){}S.spouse=null;mod({mental:-25});S.mood='sad';}}
  S.kids.forEach(k=>{if(k.alive===false)return;k.age++;
    kidMod(k,{study:k.age>=6&&k.age<22?(k.juku?4:2):0,mental:S.spouse&&S.spouse.close<30?-3:0,moral:k.close<30?-3:0});k.close=clamp(k.close-(k.age>=13&&k.age<=17?5:2),0,100);
    if(k.age===22&&!k.indep&&!k.away){const jb=kidJob(k);k.job=jb.n;k.income=jb.inc;k.tier=jb.tier;k.indep=jb.n!=='引きこもり';N.push(jb.n==='引きこもり'?`${k.name}は就職せず、部屋から出てこなくなった。`:`${k.name}が「${jb.n}」として社会に出た。`);log(`${k.name}が${jb.n}に`);if(jb.tier>=4)S.flags.kidSuccess=1;}
    if(k.indep&&!k.married&&k.age>=27&&chance(.18)){k.married=1;N.push(`${k.name}が結婚した。`);log(k.name+'が結婚');}
    if(k.married&&chance(.15)&&k.grand<3){k.grand++;N.push(`${k.name}に子どもが生まれた。孫ができた！`);log('孫が生まれる');mod({mental:10});S.mood='happy';}
    if(k.indep)k.income+=k.tier*6;
    const kh=k.age<1?.002:k.age<40?.0005:k.age<60?.003:.01;if(chance(kh)){k.alive=false;N.push(`${k.name}が、${k.age}歳で亡くなった。`);log(`${k.name}を亡くす`);mod({mental:-35});S.mood='sad';}});
  // 親
  for(const p of [S.fam.father,S.fam.mother,S.fam.grand]){if(!p||!p.alive)continue;p.age++;const h=p.age<50?.002:p.age<60?.005:p.age<70?.012:p.age<80?.035:p.age<90?.1:.22;
    if(chance(h*(p.debt?1.2:1))){p.alive=false;const lb=p===S.fam.grand?'祖'+(p.sex==='M'?'父':'母'):p.sex==='M'?'父':'母';N.push(`${lb}が亡くなった。${p.age}歳だった。`);log(lb+'を亡くす');mod({mental:-15});S.mood='sad';if(p.care){S.careCost=0;}
      if(S.age>=18&&p!==S.fam.grand){const live=livingParents().length;const inh=Math.round([0,80,600,2500,9000][S.fam.rank]*S.fam.money/RANK_MONEY[S.fam.rank]/(live?2:1)/(1+S.fam.sibs.filter(s=>s.alive).length*(live?0:1)));
        if(p.debt&&chance(.6)){S.queue.push(evInherit(p,lb,inh));}else if(inh>0){if(live===0)S.flags.inheritAsk={lb,inh};else{gain(inh*.5,'相続（配偶者分を除く）');N.push(`遺産として${yen(inh*.5)}を相続した。`);}}}
      if(!livingParents().length&&!S.fam.grand?.alive)S.fam.alive=false;}}
}
function evInherit(p,lb,inh){const debt=Math.round(300+R()*1500);return {id:'inheritDebt',tag:'相続',tx:`${lb}の遺品を整理していたら、借金の督促状が出てきた。調べると、借金は約${yen(debt)}。預金などのプラスの財産は約${yen(inh)}。`,ops:[
  {t:'すべて相続する',s:'借金も一緒に引き継ぐ',f:()=>{gain(inh,'相続');S.debt+=debt;return `財産と一緒に、${yen(debt)}の借金を背負った。`;}},
  {t:'相続放棄する',s:'3か月以内に家庭裁判所へ。財産も借金も受け取らない',f:()=>`相続を放棄した。何も受け取らないが、借金も背負わない。`},
  {t:'限定承認する',s:'財産の範囲内でだけ借金を返す',f:()=>{const net=Math.max(0,inh-debt);if(net>0)gain(net,'相続（限定承認）');pay(15,'司法書士費用');return `手続きは面倒だったが、${net>0?yen(net)+'が手元に残った':'借金を背負わずにすんだ'}。`;}}]};}
function deathCheck(){
  const a=S.age,h=S.st.health;
  let base=a<1?.002:a<15?.0002:a<40?.0005:a<50?.0012:a<60?.003:a<70?.009:a<80?.025:a<90?.07:a<100?.2:.45;
  const hm=h>=70?.6:h>=45?.85:h>=25?1.3:h>=10?2.2:4;
  let m=hm*(S.vice.smoke>=30&&a>40?1.5:1)*(S.vice.drink>=70?1.3:1)*(S.vice.drug?1.6:1)*(S.illness?2.5:1);
  let p=base*m*(S.conds&&S.conds.includes('byoki')?(a<40?1.8:1.35):1);
  if(h<=0){if(!S.collapsed&&a<70){S.collapsed=1;S.st.health=30;S.hosp=1;pay(100,'入院費');S.notes.push('過労で倒れ、救急車で運ばれた。2か月入院した。');log('倒れて入院');if(['正社員'].includes(J().cat)&&chance(.4))setJob('none');return false;}p=1;}
  if(R()<p){const cause=S.illness?S.illness:a>=85?pick(['老衰','肺炎','心不全']):a>=60?pick(['がん','心筋梗塞','脳卒中','肺炎']):S.vice.drug&&chance(.3)?'薬物による中毒':pick(['交通事故','急性心不全','くも膜下出血','がん']);endLife(cause);return true;}
  return false;
}

// =====================================================================
// 描画
// =====================================================================
function lineColor(){if(S.house)return S.house.col;return (HOMES[S.home]||HOMES.jikka).col;}
function render(){
  if(!S)return;
  $('#bSta').innerHTML=`<span class="age">${S.age}</span><small>歳</small>`;
  $('#bSub').innerHTML=`${S.year}年<br>${fullName()}・${J().n}`;
  {const evA=new Set((S.log||[]).filter(l=>/結婚|離婚|生まれる$|が生まれる|逮捕|破産|起業|社長|プロ|デビュー|当選|金メダル|入院|がん|亡くな|生活保護|相続|上京|入学|就職|になる$/.test(l.t)&&l.age>0).map(l=>l.age));
   let d='';for(let i=0;i<100;i++)d+=`<i class="${i===S.age?'now':i<S.age?(evA.has(i)?'hit':'on'):''}"></i>`;$('#dots').innerHTML=d;}
  const tk=[`住まい：${S.house?S.house.n:(HOMES[S.home]||{}).n}`,`景気：${REGIMES[S.regime].n}　${newsNow()}`,S.spouse?`配偶者：${S.spouse.name}`:S.partner?`恋人：${S.partner.name}`:'独身'].join('　　■　　');
  if($('#ticker').textContent!==tk)$('#ticker').textContent=tk;
  renderScene();
  $('#lCash').textContent=yen(S.cash);$('#lCash').className='v'+(S.cash<0?' neg':'');
  $('#lInv').textContent=yen(investTotal());$('#lDebt').textContent=yen(S.debt+S.schol);$('#lDebt').className='v'+(S.debt+S.schol>0?' neg':'');
  const sts=[['学力','study'],['スキル','skill'],['コミュ','comm'],['体力','health'],['メンタル','mental'],['魅力','charm'],['素行','moral']];
  $('#stats').innerHTML=sts.map(([n,k])=>{const v=Math.round(S.st[k]);const f=Math.round(v/20);return `<div class="stt ${v<25&&['health','mental','moral'].includes(k)?'low':''}">${n}<b>${v}</b><i>${[0,1,2,3,4].map(j=>`<u class="${j<f?'f':''}"></u>`).join('')}</i></div>`;}).join('');
  document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===TAB));
  const nb=$('#nextBtn');nb.disabled=S.queue.length>0||!!S.ended;nb.innerHTML=S.ended?'THE END':S.queue.length?`出来事に答える（残り${S.queue.length}）`:'次の年へ ▶';
  $('#fInfo').innerHTML=S.ended?'':`今年の出来事<br><b>${S.queue.length?'あと'+S.queue.length+'件':'すべて答えた'}</b>`;
  ({year:rYear,people:rPeople,money:rMoney,life:rLife,dex:()=>{$('#main').innerHTML=dexHTML();}})[TAB]();
}
function evCard(ev){
  const box=document.createElement('div');box.className='ev';
  const who=ev.who?`<div class="who">${ev.who}</div>`:'';
  box.innerHTML=`<div class="evh"><span class="tag">${ev.tag}</span><span class="evn">${S.age}歳</span></div><div class="evb">${who}<div class="tx">${ev.tx}</div></div><div class="ops"></div>`;
  ev.ops.forEach(o=>{if(o.c===false)return;const b=document.createElement('button');b.className='op';b.innerHTML=o.t+(o.s?`<small>${o.s}</small>`:'');b.onclick=e=>{if(e.target.dataset.i)return;
    S.queue.shift();S.mood='normal';let r;try{r=o.f();}catch(err){console.warn(err);r='（その間に事情が変わり、この話は立ち消えになった）';}if(r){S.notes.push(r);S.lastRes=r;}else S.lastRes=null;if(ev.log)log(o.t);render();$('#main').scrollTop=0;};box.querySelector('.ops').appendChild(b);});
  return box;
}
function rYear(){
  const m=$('#main');m.innerHTML='';
  if(S.ended){m.innerHTML='<div class="sec">この人生は終わった。</div>';return;}
  if(S.prevNotes&&S.prevNotes.length){const d=document.createElement('div');d.className='sec';d.innerHTML=`<h3>前の一年の知らせ</h3>`+S.prevNotes.map(n=>`<div class="nl">■ ${n}</div>`).join('');m.appendChild(d);}
  if(S.lastRes){const d=document.createElement('div');d.className='res';d.innerHTML=S.lastRes;m.appendChild(d);}
  if(S.queue.length){m.appendChild(evCard(S.queue[0]));return;}
  if(S.notes.length){const d=document.createElement('div');d.className='sec';d.innerHTML=`<h3>今年のできごと</h3>`+S.notes.map(n=>`<div class="nl">■ ${n}</div>`).join('');m.appendChild(d);}
  m.appendChild(actionsPanel());
}
function rPeople(){
  const m=$('#main');const row=(svg,n,s,c,col)=>`<div class="pp"><div class="pav">${svg}</div><div class="in"><b>${n}</b><span>${s}</span>${c!=null?`<div class="bar"><u style="width:${clamp(c,0,100)}%;background:${col||'#d7261e'}"></u></div>`:''}</div></div>`;
  let h='<div class="sec"><h3>家族</h3>';
  if(S.spouse)h+=row(personSVG(S.spouse,S.spouse.age,'normal',S.spouse.of),S.spouse.name,`配偶者・${S.spouse.age}歳・${S.spouse.job}（${S.spouse.work?'年収'+yen(S.spouse.income):'家庭に専念'}）・${S.spouse.pers}・実家は${RANKS[S.spouse.rank]}`,S.spouse.close);
  if(S.partner)h+=row(personSVG(S.partner,S.partner.age),S.partner.name,`恋人・付き合って${S.partner.yrs}年・${S.partner.job||''}・${S.partner.pers||''}`,S.partner.close);
  S.kids.forEach(k=>h+=row(personSVG(k,k.age,k.close>70?'happy':'normal'),`${k.name}（${kidLabel(k)}）`,k.alive===false?'他界':`${k.age}歳・${k.trait}${k.job?'・'+k.job:''}${k.priv?'・私立':''}${k.married?'・既婚':''}${k.grand?'・孫'+k.grand+'人':''}<br>学力${Math.round(k.st.study)} 素行${Math.round(k.st.moral)} 心${Math.round(k.st.mental)}`,k.close));
  for(const p of [S.fam.father,S.fam.mother,S.fam.grand]){if(!p)continue;const lb=p===S.fam.grand?'祖'+(p.sex==='M'?'父':'母'):p.sex==='M'?'父':'母';h+=row(p.alive?personSVG(p,p.age,'normal',p.age>=65?'elder':'casual'):'<div class="dead">故</div>',`${lb}・${p.name}`,p.alive?`${p.age}歳・${p.job}・${p.pers}${p.care?'・要介護':''}`:'他界',p.alive?p.close:null);}
  S.fam.sibs.forEach(s=>{const age=S.age+s.age;if(age<0)return;h+=row(personSVG(s,age),`${s.older?(s.sex==='M'?'兄':'姉'):(s.sex==='M'?'弟':'妹')}・${s.name}`,`${age}歳`,s.close,'#0068b7');});
  h+='</div><div class="sec"><h3>友人・知人<span>会わないと疎遠になる</span></h3>'+(S.people.length?S.people.map(f=>row(personSVG(f,Math.max(3,f.age)),f.name,`${f.rel}・${f.trait}`,f.close,'#0068b7')).join(''):'<p class="note">まだいない。</p>')+'</div>';
  if(S.exes.length)h+=`<div class="sec"><h3>過去の恋人</h3><p class="note">${S.exes.join('、')}</p></div>`;
  m.innerHTML=h;
}
function rMoney(){
  const m=$('#main');
  let h=`<div class="sec"><h3>資産</h3><div class="asset"><span>預金</span><b>${yen(S.cash)}</b><span>新NISA</span><b>${yen(S.nisa.v)}</b>${Object.entries(S.port).map(([k,a])=>`<span>${ASSETS[k].n}</span><b>${yen(a.v)}</b>`).join('')}${S.house?`<span>持ち家（評価額−ローン）</span><b>${yen(S.house.value-S.house.loan)}</b>`:''}${S.reInv?`<span>投資用ワンルーム（評価額−ローン）</span><b>${yen(S.reInv.value-S.reInv.loan)}</b>`:''}${S.company?`<span>自社株</span><b>${yen(S.company.value*S.company.eq)}</b>`:''}<span>借金</span><b class="neg">${yen(-S.debt)}</b>${S.schol>0?`<span>奨学金残高</span><b class="neg">${yen(-S.schol)}</b>`:''}<span class="t">純資産</span><b class="t">${yen(assetsTotal())}</b></div>
  <p class="note" style="margin-top:8px">年金の加入：国民年金 ${S.nenkin.paid}年／厚生年金 ${S.nenkin.kosei}年${S.nenkin.amount?`<br>受け取っている年金：年${yen(S.nenkin.amount)}`:`<br>65歳から受け取る見込み：年${yen(pensionCalc(65))}`}${infoLink('nenkin')}</p></div>`;
  const book=(rows,y,age,extra)=>`<div class="book"><div class="bh"><div>${y}</div><div>摘要（${age}歳）</div><div class="r">入出金</div></div>${rows.map(r=>`<div class="br"><div>${String(y).slice(2)}</div><div>${r.t}</div><div class="r ${r.v<0?'m':''}">${r.v<0?'-':'+'}${yen(Math.abs(r.v)).replace('円','')}</div></div>`).join('')}${extra||''}</div>`;
  if(S.rows.length)h+=`<div class="sec nb"><h3>今年の記帳</h3></div>`+book(S.rows,S.year,S.age);
  h+=`<div class="sec nb"><h3>通帳</h3></div>`;
  const yrs=Object.keys(S.books).sort((a,b)=>b-a);
  if(!yrs.length)h+='<p class="note" style="padding:0 14px">まだ記帳はない。</p>';
  yrs.slice(0,15).forEach(y=>{const b=S.books[y];if(!b.rows.length)return;h+=book(b.rows,y,b.age,`<div class="br"><div></div><div>この年の株式市場（${REGIMES[b.regime]?REGIMES[b.regime].n:''}）</div><div class="r ${b.rm<0?'m':''}">${b.rm>=0?'+':''}${Math.round((b.rm||0)*100)}%</div></div>`);});
  m.innerHTML=h;
}
function rLife(){const m=$('#main');m.innerHTML=`<div class="tl">${S.log.map(l=>`<div class="st"><div class="a">${l.age}歳・${l.year}年</div><div class="t">${l.t}</div></div>`).join('')}</div>`;m.scrollTop=m.scrollHeight;}
function sheet(title,html,btns,after){
  const ov=document.createElement('div');ov.className='ov';ov.innerHTML=`<div class="sh"><div class="hd"><span>${title}</span><button>閉じる ✕</button></div><div class="bd">${html}<div class="mb"></div></div></div>`;
  ov.querySelector('.hd button').onclick=()=>ov.remove();ov.onclick=e=>{if(e.target===ov)ov.remove();};
  const mb=ov.querySelector('.mb');(btns||[]).forEach(b=>{const e=document.createElement('button');e.className='op yl';e.innerHTML=b.t;if(b.dis)e.disabled=true;e.onclick=()=>{if(!b.keep)ov.remove();b.f&&b.f(ov);};mb.appendChild(e);});
  document.body.appendChild(ov);if(after)after(ov);return ov;
}
