"use client";

import {
  Bell, BookOpen, ChartNoAxesColumnIncreasing, Cloud, CloudRain, Heart, Home,
  MapPin, MessageCircle, Pencil, Plus, Repeat2, Search, Settings,
  Sun, Upload, UserPlus, UserRound, X, Zap
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { RealMap } from "./RealMap";

type Weather = "sunny" | "cloudy" | "rainy" | "storm";
type View = "timeline" | "search" | "profile" | "userProfile" | "following" | "followers" | "messages";
type Category = "エンタメ" | "スポーツ" | "テクノロジー" | "ビジネス";
type Post = { id:number; weather:Weather; name:string; handle:string; avatar:string; time:string; body:string; replies:string; reposts:string; likes:string; views:string };

const weatherInfo = {
  sunny: { label:"晴れ", icon:Sun, symbol:"🌤️", message:"明るく前向きな投稿が多いタイムラインです", color:"#f6b900" },
  cloudy: { label:"曇り", icon:Cloud, symbol:"☁️", message:"落ち着いた話題と少し不安な投稿が混在しています", color:"#78909c" },
  rainy: { label:"雨", icon:CloudRain, symbol:"🌧️", message:"ネガティブな投稿が増えています。無理せず閲覧してください", color:"#367cd8" },
  storm: { label:"雷雨", icon:Zap, symbol:"⛈️", message:"炎上・強い表現が多い状態です。閲覧には注意してください", color:"#28233e" },
};

const posts:Post[] = [
  {id:1,weather:"sunny",name:"夜更かしの猫",handle:"@digi_walker_01",avatar:"🌌",time:"5時間前",body:"帰り道、雲の切れ間から月がすごくきれいに見えた。急いで撮ったから少しブレたけど、今日いちばん嬉しかった瞬間かも。",replies:"3",reposts:"1",likes:"42",views:"386"},
  {id:2,weather:"sunny",name:"デジタル・ノマド",handle:"@digi_inoma_2",avatar:"🎮",time:"5時間前",body:"82歳のおじいちゃんがスマホデビュー。最初に送ってきたのが、筋肉ムキムキのウサギのスタンプだった。どこで見つけたの（笑） 電話しか使わないと言っていたのに、今日は朝から写真も送ってきた。覚えるの早すぎる。",replies:"8",reposts:"5",likes:"126",views:"814"},
  {id:3,weather:"sunny",name:"ハナコ＠読書垢",handle:"@flower_book_log",avatar:"🐶",time:"5時間前",body:"散歩の途中で気になってた本屋さんに寄れた。店員さんのおすすめがどれも良くて、結局3冊も買ってしまった。週末が楽しみ。",replies:"2",reposts:"0",likes:"57",views:"293"},
  {id:4,weather:"cloudy",name:"考えごとの午後",handle:"@gray_afternoon",avatar:"🏙️",time:"2時間前",body:"今日は早めに切り上げる。",replies:"4",reposts:"1",likes:"35",views:"241"},
  {id:5,weather:"cloudy",name:"ニュースを読む人",handle:"@news_reader",avatar:"📰",time:"3時間前",body:"話題の記事、見出しだけだとかなり印象が違う。本文を最後まで読んだら、最初に想像していた話とは少し違っていた。引用されている部分だけが広がっているけど、反対側の意見も読んでから考えたい。急いで結論を出さなくてもいい気がする。",replies:"12",reposts:"7",likes:"89",views:"672"},
  {id:6,weather:"rainy",name:"雨宿り",handle:"@take_a_break",avatar:"🌧️",time:"1時間前",body:"ちょっと疲れた。何を見ても悪いほうに考えてしまうので、今日はもうスマホを置く。温かいもの飲んで寝よう。",replies:"6",reposts:"2",likes:"74",views:"468"},
  {id:7,weather:"rainy",name:"静かな夜",handle:"@quiet_night",avatar:"🌙",time:"4時間前",body:"返信を見て少しへこんだ。今は返さないでおく。",replies:"9",reposts:"3",likes:"61",views:"514"},
  {id:8,weather:"storm",name:"トレンドを追う人",handle:"@trend_watch",avatar:"⚡",time:"18分前",body:"例の件、切り取られた動画だけが広がってるけど、前後まで見るとだいぶ印象が違う。断定する前に元動画を見たほうがいい。",replies:"18",reposts:"11",likes:"143",views:"926"},
  {id:9,weather:"storm",name:"ひと休み",handle:"@take_it_easy",avatar:"🛡️",time:"22分前",body:"タイムラインの空気がかなり荒れてる。気になって見続けてしまうけど、今日はここまでにしようかな。",replies:"7",reposts:"4",likes:"82",views:"603"},
];

const followers = [
  {name:"あかり",handle:"@akari_sky",weather:"sunny" as Weather,avatar:"🌸"},
  {name:"ケン",handle:"@travel_ken",weather:"sunny" as Weather,avatar:"🧳"},
  {name:"mio",handle:"@mio_note",weather:"cloudy" as Weather,avatar:"🎧"},
  {name:"静かな夜",handle:"@quiet_night",weather:"rainy" as Weather,avatar:"🌙"},
  {name:"トレンド観測",handle:"@trend_watch",weather:"storm" as Weather,avatar:"⚡"},
  {name:"ゆう",handle:"@yuu_coffee",weather:"cloudy" as Weather,avatar:"☕"},
  {name:"ハル",handle:"@haru_days",weather:"sunny" as Weather,avatar:"🐕"},
  {name:"しおり",handle:"@shiori_books",weather:"rainy" as Weather,avatar:"📚"},
  {name:"レン",handle:"@ren_music",weather:"cloudy" as Weather,avatar:"🎸"},
  {name:"なつき",handle:"@natsuki_food",weather:"sunny" as Weather,avatar:"🍰"},
];
const diaryEntries = [
  {time:"今日・18:40",intent:"返信はいりません",body:"帰りの電車で窓に映った顔が思ったより疲れていて、今日は予定をひとつ断った。誰かに相談するほどではないけれど、ここに書いたら少し呼吸が楽になった。"},
  {time:"今日・16:15",intent:"気づいてくれたら十分",body:"知らない道を選んで歩いたら、小さなパン屋を見つけた。焼きたての匂いにつられて買った塩パンがおいしかった。こういう偶然を忘れたくなくて残しておく。"},
  {time:"今日・12:08",intent:"そっと見守って",body:"やることは進んでいるのに、なぜか気持ちだけ置いていかれている感じ。音楽を止めて窓を開けたら、風の音が思ったより大きかった。"},
  {time:"昨日・23:31",intent:"少しだけ気づいてほしい",body:"返信の言葉がずっと頭に残っている。考えすぎだと分かっているけど、今日はうまく切り替えられなかった。明日は少し軽くなっていますように。"},
  {time:"昨日・21:06",intent:"今は見守って",body:"タイムラインを見続けていたら、知らない人の怒りまで自分のことのように感じて疲れた。今夜は通知を切って、温かいものを飲んで寝る。"},
  {time:"昨日・17:20",intent:"返信はいりません",body:"いつもの店でコーヒーを頼んだら、店員さんが前に話したことを覚えていてくれた。それだけなのに、今日は少し救われた気がした。"},
  {time:"昨日・08:45",intent:"読んだよだけ欲しい",body:"犬の散歩で公園まで行った。雨上がりの土の匂いと、濡れた草の上を慎重に歩く足がかわいかった。朝からちょっと得をした気分。"},
  {time:"2日前",intent:"そっと見守って",body:"読みたかった本を開いたのに、同じページを何度も読んでしまう。今日は集中できない日らしい。そんな日も記録しておく。"},
  {time:"2日前",intent:"気づいてくれたら十分",body:"練習していた曲がやっと最後までつながった。まだ人に聴かせるほどではないけど、自分の中ではかなりうれしい。"},
  {time:"3日前",intent:"返信はいりません",body:"新しく作ったプリン、見た目は少し崩れたけれど味は成功。家族が黙って二個目を食べていたので、たぶん本当においしかった。"},
];
const trendDays = [
  {label:"4月18日",short:"18",day:"木"},{label:"4月19日",short:"19",day:"金"},{label:"4月20日",short:"20",day:"土"},
  {label:"4月21日",short:"21",day:"日"},{label:"4月22日",short:"22",day:"月"},{label:"4月23日",short:"23",day:"火"},
];
const categoryForecasts:Record<Category,Weather[]> = {
  "エンタメ":["sunny","cloudy","sunny","rainy","cloudy","sunny"],
  "スポーツ":["cloudy","sunny","rainy","cloudy","rainy","storm"],
  "テクノロジー":["sunny","sunny","cloudy","rainy","sunny","cloudy"],
  "ビジネス":["rainy","cloudy","storm","rainy","cloudy","sunny"],
};
const trendStories:Record<Category,string[][]> = {
  "エンタメ":[
    ["深夜ドラマの最終回に反響、伏線の回収が見事と話題","新人バンドが商店街で無料ライブ、買い物客も足を止める","人気声優が初のエッセイ集を発売、制作の裏側を語る","地方の小さな映画館、名作特集で連日満席に"],
    ["人気漫画の実写映画化を発表、主人公役に若手俳優","音楽番組の生演奏で機材トラブル、即興対応に称賛","長寿ラジオ番組が放送千回、リスナーから祝福続々","美術館の夜間開館が好評、若い来場者が大幅増"],
    ["野外フェスの追加出演者を発表、意外な共演に期待","自主制作アニメが海外映画祭で観客賞を受賞","落語家とラッパーの異色公演、追加開催が決定","人気小説の続編が発売前に重版、書店で予約相次ぐ"],
    ["配信ドラマの演出を巡り賛否、監督が意図を説明","舞台公演が悪天候で中止、出演者が動画でメッセージ","映画レビューのネタバレ投稿に苦情、議論広がる","ライブ会場の運営遅延、主催者が返金対応を発表"],
    ["新人俳優の自然な演技が口コミで話題、配信順位上昇","懐かしいアニメの再放送に世代を超えた反響","駅ピアノで始まった即興演奏、通行人との合奏に","写真展で来場者が選ぶ一枚、夕暮れの作品が首位"],
    ["人気グループの発言が切り取られ拡散、公式が全文公開","授賞式の結果を巡りファン同士の議論が過熱","配信者の迷惑撮影に店舗が声明、動画は非公開に","映画宣伝の偽アカウントが急増、制作会社が注意喚起"],
  ],
  "スポーツ":[
    ["九回二死から逆転打、球場が総立ちに","高校女子駅伝で大会新記録、仲間と抱き合い涙","車いすテニス体験会に百人、選手が直接指導","地域リーグの珍プレー動画、審判の笑顔も話題"],
    ["代表戦で新人が初得点、家族への感謝を語る","競泳リレーで鮮やかな逆転、今季世界最高タイム","ベテラン投手が通算二千奪三振を達成","子どもたちが選手入場をエスコート、温かな拍手"],
    ["十八歳の選手がツアー初優勝、冷静な試合運び光る","延長戦の末に劇的決着、両チームへ大きな拍手","無名校が強豪を破り初の全国大会出場","けがから復帰した主将、決勝点をアシスト"],
    ["雨天試合でボールが止まる珍事、再試合を協議","判定説明に時間を要し、選手の集中が途切れる","大会バスの遅延で開始時刻を変更","観客席のマナーを巡りクラブが注意を呼びかけ"],
    ["日本代表が現地入り、初練習は一部非公開","主力選手が軽い違和感、次戦出場は当日判断","強風で記録が公認されず、選手は複雑な表情","チケット転売が増加、主催者が本人確認を強化"],
    ["判定に激怒の指揮官、試合後に審判控室へ乱入。「前代未聞の暴挙」に公式処分とファンからの批判殺到","超人気マンガの『実写映画化』。原作者がSNSで事前の約束と全く違う変更をされたと告発","世界的ゲーム会社の超大作RPG、10年の開発期間を経て発売されるも、バグまみれで進行不能","人気選手がSNSで発した一言をめぐり議論が過熱。所属チームは投稿の意図について説明を発表"],
  ],
  "テクノロジー":[
    ["電池が二日持つ新型スマホ、来月発売へ","音声で家電をまとめて操作する国産端末を発表","災害時に使える通信アプリ、自治体が導入","学生開発の字幕メガネがコンテストで優勝"],
    ["生成AIを授業で活用、教員向け指針を公開","写真整理アプリに重複削除機能を追加","小型ドローンで山間部へ医薬品を配送","古いゲーム機を修理する動画が人気に"],
    ["国産ロボットが飲食店で接客実験を開始","折りたためる電子ペーパー端末を初公開","視覚障害者向けナビアプリ、駅構内で実証","海洋ごみを検出するAIカメラを開発"],
    ["決済サービスで障害、復旧後も一部に遅延","アプリ更新後に電池消費増加、修正版を配布","クラウド保存の設定ミスで一部データ非表示","偽の警告通知が拡散、公式が削除方法を案内"],
    ["小型衛星の打ち上げ成功、地上局との通信確認","翻訳イヤホンの対応言語が二十に拡大","農業用センサーで水使用量を三割削減","無料のプログラミング教室、全国へ展開"],
    ["SNSの新機能に個人情報懸念、設定確認を呼びかけ","有名サービスを装う偽アプリ、被害報告相次ぐ","AI生成動画の誤情報が拡散、識別表示を検討","大規模情報流出の可能性、運営会社が緊急調査"],
  ],
  "ビジネス":[
    ["老舗菓子店が若手職人の新ブランドを発売","空き店舗を共同オフィスへ、商店街に活気","廃材を使った家具が好評、予約は三か月待ち","町工場の技術を生かした文具が海外進出"],
    ["駅前再開発に図書館と保育施設、計画を公表","地域バスでキャッシュレス実験を開始","社員食堂の食品ロスを半減、他社も注目","週休三日制の試験導入、応募者が増加"],
    ["食品メーカー三社が一部商品の値下げを発表","中古衣料の回収サービス、利用者が倍増","個人書店の共同配送で送料を削減","農家直送の定期便、若い世代に人気"],
    ["配送遅延が続き各社が受付件数を制限","原材料不足で限定商品の販売を休止","予約システム障害、店舗で長い待ち時間","新店舗の騒音を巡り住民説明会を開催"],
    ["商店街の夜市が復活、百店舗が参加予定","若手社員の提案から生まれた商品がヒット","地方ホテルが長期滞在プランを開始","子育て世代向けの柔軟勤務制度を拡充"],
    ["決算発表後に株価急落、業績予想を下方修正","広告表現を巡り批判、企業が掲載を取り下げ","下請けへの支払い遅延が判明、調査委員会設置","大量閉店の報道を会社が否定、情報が錯綜"],
  ],
};

export default function HomePage(){
  const [weather,setWeather]=useState<Weather>("sunny");
  const [view,setView]=useState<View>("timeline");
  const [liked,setLiked]=useState<number[]>([]);
  const [composer,setComposer]=useState(false);
  const [draft,setDraft]=useState("");
  const [query,setQuery]=useState("");
  const [searchSubmitted,setSearchSubmitted]=useState(false);
  const [keyboardOpen,setKeyboardOpen]=useState(false);
  const [selectedExchange,setSelectedExchange]=useState<number|null>(null);
  const [journalDraft,setJournalDraft]=useState("");
  const [journalReplies,setJournalReplies]=useState<string[]>([]);
  const [diaryTurnSent,setDiaryTurnSent]=useState(false);
  const [journalMood,setJournalMood]=useState<Weather>("sunny");
  const [journalReaction,setJournalReaction]=useState("");
  const [comfortDraft,setComfortDraft]=useState("");
  const [umbrellaSent,setUmbrellaSent]=useState(false);
  const [kindnessScore,setKindnessScore]=useState(24);
  const [category,setCategory]=useState<Category>("スポーツ");
  const [trendDay,setTrendDay]=useState(trendDays.length-1);
  const [mapMode,setMapMode]=useState(false);
  const [selectedAccount,setSelectedAccount]=useState<{name:string;handle:string;avatar:string;weather:Weather}|null>(null);
  const forecastStrip=useRef<HTMLDivElement>(null);
  const [toast,setToast]=useState("");
  const [showSplash,setShowSplash]=useState(true);
  const feed=useMemo(()=>posts.filter(p=>p.weather===weather),[weather]);
  const exactSearchResults=useMemo(()=>posts.filter(p=>`${p.name}${p.handle}${p.body}`.toLowerCase().includes(query.trim().toLowerCase())),[query]);
  const searchResults=useMemo(()=>query.trim()?(exactSearchResults.length?exactSearchResults:posts.slice(0,6)):[],[query,exactSearchResults]);
  const hasExactSearchResults=exactSearchResults.length>0;
  const info=weatherInfo[weather];
  const trendWeather=categoryForecasts[category][trendDay];
  const dailyHeadlines=trendStories[category][trendDay];
  const AccountWeatherIcon=selectedAccount?weatherInfo[selectedAccount.weather].icon:Cloud;
  useEffect(()=>{if(view!=="search")return;const item=forecastStrip.current?.children[trendDay] as HTMLElement|undefined;if(item) forecastStrip.current?.scrollTo({left:item.offsetLeft-125,behavior:"smooth"})},[trendDay,category,view]);
  useEffect(()=>{const timer=window.setTimeout(()=>setShowSplash(false),1800);return()=>window.clearTimeout(timer)},[]);
  const notify=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(""),1500)};
  const openAccount=(account:{name:string;handle:string;avatar:string;weather:Weather})=>{setSelectedAccount(account);setView("userProfile")};
  const submit=(e:FormEvent)=>{e.preventDefault();if(!draft.trim())return;setDraft("");setComposer(false);notify("投稿しました（感情を分析中）")};

  return <main className="sora-stage"><section className={`sora-app theme-${weather}`}>
    {view==="timeline"&&<><header className="sora-header">
      <button aria-label="通知" onClick={()=>notify("新しい通知はありません")}><Bell fill="currentColor"/></button>
      <div className="forecast-mark custom-weather-mark" title={`現在のタイムライン：${info.label}`}><img src="/header-weather-transparent.png" alt="天気タイムライン"/></div>
      <button aria-label="設定" onClick={()=>notify("設定")}><Settings fill="currentColor"/></button>
    </header>

    <nav className="weather-tabs" aria-label="タイムラインの感情を選択">
      {(Object.keys(weatherInfo) as Weather[]).map(key=>{const Icon=weatherInfo[key].icon;return <button key={key} className={weather===key?"active":""} onClick={()=>{setWeather(key);setView("timeline")}} aria-label={weatherInfo[key].label}><Icon fill={key==="sunny"?"currentColor":"none"}/></button>})}
    </nav></>}

    {view==="timeline"&&<div key={weather} className={`timeline-area weather-bg ${weather}`}>
      <div className={`forecast-note ${weather}`}><span>{info.symbol}</span><div><strong>タイムライン予報：{info.label}</strong><p>{info.message}</p></div></div>
      {feed.map(post=><article className="sora-post" key={post.id}>
        <div className="post-head"><button className={`photo-avatar account-link generated-avatar avatar-${((post.id-1)%6)+1}`} onClick={()=>openAccount(post)} aria-label={`${post.name}のプロフィール`}/><div className="identity"><strong>{post.name}</strong><span>{post.handle}</span></div><time>{post.time}</time></div>
        <p>{post.body}</p>
        <div className="metric-row">
          <button onClick={()=>notify("返信")}><MessageCircle/><span>{post.replies}</span></button>
          <button onClick={()=>notify("リポストしました")}><Repeat2/><span>{post.reposts}</span></button>
          <button className={`like-button ${liked.includes(post.id)?"liked":""}`} aria-pressed={liked.includes(post.id)} aria-label={liked.includes(post.id)?"いいねを取り消す":"いいね"} onClick={()=>setLiked(v=>v.includes(post.id)?v.filter(id=>id!==post.id):[...v,post.id])}><Heart fill={liked.includes(post.id)?"currentColor":"none"}/><span>{post.likes}</span></button>
          <button><ChartNoAxesColumnIncreasing/><span>{post.views}</span></button>
          <button className="share" onClick={()=>notify("共有メニュー")}><Upload/></button>
        </div>
      </article>)}
    </div>}

    {view==="search"&&<div className="discover-page reference-discover" onPointerDown={e=>{if(keyboardOpen&&!(e.target as HTMLElement).closest(".phone-keyboard,.discover-search"))setKeyboardOpen(false)}}>
      <div className="discover-top"><label className="discover-search"><Search/><input value={query} onFocus={()=>setKeyboardOpen(true)} onChange={e=>{setQuery(e.target.value);setSearchSubmitted(false)}} onKeyDown={e=>{if(e.key==="Enter"&&query.trim()){setSearchSubmitted(true);setKeyboardOpen(false)}}} placeholder="検索"/></label><button className={`view-toggle ${mapMode?"map-on":""}`} onClick={()=>{setSearchSubmitted(false);setKeyboardOpen(false);setMapMode(v=>!v)}} aria-label="天気と地図を切り替え"><span>{mapMode?"🗾":weatherInfo[trendWeather].symbol}</span></button></div>
      {searchSubmitted?<div className="search-timeline"><div className="search-result-title"><button className="search-back" onClick={()=>setSearchSubmitted(false)} aria-label="検索画面へ戻る">←</button><strong>「{query.trim()}」の検索結果</strong><span>{searchResults.length}件</span></div>{searchResults.map((post,i)=><article className="sora-post" key={`search-${post.id}`}><div className="post-head"><button className="account-link" onClick={()=>openAccount({name:post.name,handle:post.handle,avatar:post.avatar,weather:post.weather})}><span className={`photo-avatar generated-avatar avatar-${((post.id-1)%6)+1}`}/></button><div className="identity"><strong>{post.name}</strong><span>{post.handle}</span></div><time>{post.time}</time></div><p>{hasExactSearchResults?post.body:i===0?`「${query.trim()}」について調べていたら、思っていたより知らないことが多くて驚いた。気になった部分をもう少し詳しく見てみたい。`:`${query.trim()}の話題を見かけた。${post.body}`}</p><div className="metric-row"><button><MessageCircle/><span>{post.replies}</span></button><button><Repeat2/><span>{post.reposts}</span></button><button className={`like-button ${liked.includes(post.id)?"liked":""}`} onClick={()=>setLiked(v=>v.includes(post.id)?v.filter(id=>id!==post.id):[...v,post.id])}><Heart fill={liked.includes(post.id)?"currentColor":"none"}/><span>{post.likes}</span></button><button><ChartNoAxesColumnIncreasing/><span>{post.views}</span></button><button><Upload/></button></div></article>)}</div>:<>{!mapMode&&<><div className={`category-tabs category-${(["エンタメ","スポーツ","テクノロジー","ビジネス"] as Category[]).indexOf(category)}`}>{(["エンタメ","スポーツ","テクノロジー","ビジネス"] as Category[]).map(item=><button key={item} className={category===item?"active":""} onClick={()=>setCategory(item)}>{item}</button>)}</div>
      <div className="reference-weather-strip" ref={forecastStrip} aria-label="日ごとの天気予報">
        {trendDays.map((date,i)=>{const w=categoryForecasts[category][i];const Icon=w==="rainy"?Cloud:weatherInfo[w].icon;return <button key={date.label} className={`${w} ${trendDay===i?"selected":""}`} onClick={()=>setTrendDay(i)} aria-label={`${date.label} ${weatherInfo[w].label}`}><Icon fill={w==="storm"||w==="rainy"?"currentColor":"none"}/></button>})}
      </div>
      <strong className="reference-date">{trendDays[trendDay].label}({trendDays[trendDay].day})</strong>
      <div className="reference-dots">{trendDays.map((_,i)=><i key={i} className={trendDay===i?"active":""}/>)}</div>
      <div className="news-list">{dailyHeadlines.map((headline,i)=><button key={`${category}-${trendDay}-${i}`} onClick={()=>notify("記事を開きます")}>{headline}</button>)}</div>
      </>}
      {mapMode&&<RealMap notify={notify}/>}</>}
      {keyboardOpen&&!searchSubmitted&&<div className="phone-keyboard" aria-label="日本語キーボード"><div className="keyboard-keys">{["あ","か","さ","た","な","は","ま","や","ら","小","わ","ー"].map(key=><button key={key} onMouseDown={e=>e.preventDefault()} onClick={()=>setQuery(v=>v+key)}>{key}</button>)}</div><div className="keyboard-actions"><button onMouseDown={e=>e.preventDefault()} onClick={()=>setQuery(v=>v.slice(0,-1))}>⌫</button><button className="keyboard-space" onMouseDown={e=>e.preventDefault()} onClick={()=>setQuery(v=>v+" ")}>空白</button><button className="keyboard-search" disabled={!query.trim()} onMouseDown={e=>e.preventDefault()} onClick={()=>{if(query.trim()){setSearchSubmitted(true);setKeyboardOpen(false)}}}>検索</button></div></div>}
    </div>}

    {view==="profile"&&<div className="profile-page"><div className="profile-cover"/><div className="profile-main"><div className="profile-avatar"/><div className="profile-tools"><button aria-label="検索"><Search/></button><button aria-label="編集" onClick={()=>notify("プロフィール編集")}><Pencil fill="currentColor"/></button><button aria-label="ユーザーを追加"><UserPlus fill="currentColor"/></button></div><div className="profile-counts"><button onClick={()=>setView("following")}><strong>100</strong><span>フォロー中</span></button><button onClick={()=>setView("followers")}><strong>100</strong><span>フォロワー</span></button></div><h1>黄昏</h1><span className="profile-handle">@taso_gare</span><div className="profile-weather"><span><Sun fill="currentColor"/><strong>12%</strong></span><span><Cloud/><strong>10%</strong></span><span><CloudRain/><strong>61%</strong></span><span><Zap fill="currentColor"/><strong>27%</strong></span></div><p>どこまでも続く青空と、旅先で出会った美味しいコーヒーが好き。☕ 週末はカメラを片手に、各駅停車の旅に出ます。</p></div><div className="profile-feed">{[
      "上着のポケットに手を入れたら、半年前になくしたと思ってたワイヤレスイヤホンの左耳側が出てきた。\nああ、ここにあったんだ。って思った次の瞬間、そういえば右耳側は先週、駅のホームで落として失くしたんだったと思い出して、もう二度と両耳揃わないんだな、って妙に静かな気持ちで泣きそうになってる。",
      "自炊がめんどくさい人は、お米を炊く炊飯器の中に冷凍餃子とカット野菜と白だしを入れてスイッチを押すと、30分後には『料理を諦めた人間の末路』みたいな激ウマおじやが出来上がります。洗い物は内釜だけ。全人類やって。",
      "旅先の朝、予定を決めずに各駅停車へ。窓から見えた海がきれいだったので、次の駅で降りてみることにした。"
    ].map((body,i)=><article className="profile-post" key={i}><div className="post-head"><div className="profile-post-avatar"/><div className="identity"><strong>黄昏</strong><span>@taso_gare</span></div><time>{i===0?"6時間前":i===1?"12時間前":"1日"}</time></div><p>{body}</p><div className="metric-row"><button><MessageCircle/><span>13.1k</span></button><button><Repeat2/><span>11.2k</span></button><button><Heart/><span>36.3k</span></button><button><ChartNoAxesColumnIncreasing/><span>97.4k</span></button><button><Upload/></button></div></article>)}</div></div>}

    {view==="userProfile"&&selectedAccount&&<div className="profile-page other-profile"><div className={`other-cover ${selectedAccount.weather}`}><AccountWeatherIcon className={`account-weather-icon ${selectedAccount.weather}`} fill={selectedAccount.weather==="sunny"||selectedAccount.weather==="storm"?"currentColor":"none"}/></div><div className="other-profile-main"><div className="other-avatar">{selectedAccount.avatar}</div><button className="other-follow" onClick={()=>notify(`${selectedAccount.name}をフォローしました`)}>フォロー</button><h1>{selectedAccount.name}</h1><span>{selectedAccount.handle}</span><p>{weatherInfo[selectedAccount.weather].message}</p><div className="other-counts"><strong>86</strong> フォロー中　 <strong>428</strong> フォロワー</div></div><div className="profile-feed">{posts.filter(p=>p.weather===selectedAccount.weather).slice(0,2).map(p=><article className="profile-post" key={p.id}><div className="post-head"><div className="follower-avatar">{selectedAccount.avatar}</div><div className="identity"><strong>{selectedAccount.name}</strong><span>{selectedAccount.handle}</span></div><time>{p.time}</time></div><p>{p.body}</p><div className="metric-row"><button><MessageCircle/><span>{p.replies}</span></button><button><Repeat2/><span>{p.reposts}</span></button><button><Heart/><span>{p.likes}</span></button><button><ChartNoAxesColumnIncreasing/><span>{p.views}</span></button><button><Upload/></button></div></article>)}</div></div>}

    {view==="following"&&<div className="sub-page followers-page"><button className="profile-back" onClick={()=>setView("profile")}>← プロフィール</button><h1>フォロー中</h1><p className="intro">黄昏さんがフォローしているユーザー</p>{followers.map(f=><button className="follower-row" key={f.handle} onClick={()=>openAccount(f)}><span className="follower-avatar">{f.avatar}</span><span><strong>{f.name}</strong><small>{f.handle}</small></span><em>フォロー中</em></button>)}</div>}

    {view==="followers"&&<div className="sub-page followers-page"><button className="profile-back" onClick={()=>setView("profile")}>← プロフィール</button><h1>フォロワー予報</h1><p className="intro">フォロワーのタイムライン状態を天気で確認できます。</p><div className="follower-summary"><span>あなたの周りの空模様</span><strong>🌤️ おおむね晴れ</strong></div>{followers.map(f=><button className="follower-row" key={f.handle} onClick={()=>openAccount(f)}><span className="follower-avatar">{f.avatar}</span><span><strong>{f.name}</strong><small>{f.handle}</small></span><em>{weatherInfo[f.weather].symbol} {weatherInfo[f.weather].label}</em></button>)}</div>}

    {view==="messages"&&<div className="sub-page exchange-page">{selectedExchange===null?<><header className="exchange-header"><div><small>フォロワーが書いた日記</small><h1>みんなの日記</h1></div><BookOpen/></header><p className="intro">フォロワーの日記と、そこから読み取った感情の傾向を見ることができます。</p><div className="diary-week"><span>最近の日記</span><strong>10人</strong></div>{followers.slice(0,10).map((f,i)=>{const DiaryWeatherIcon=f.weather==="rainy"?Cloud:weatherInfo[f.weather].icon;return <button className="exchange-row" key={f.handle} onClick={()=>{setSelectedExchange(i);setJournalReaction("")}}><span className="follower-avatar">{f.avatar}</span><span><strong>{f.name}の日記</strong><small>{diaryEntries[i].time}　{diaryEntries[i].intent}</small></span><em className={`diary-emotion ${f.weather}`}><b><DiaryWeatherIcon fill={f.weather==="storm"||f.weather==="rainy"?"currentColor":"none"}/></b><small>{weatherInfo[f.weather].label}</small></em></button>})}</>:<><header className="exchange-book-head"><button onClick={()=>setSelectedExchange(null)}>←</button><div><strong>{followers[selectedExchange].name}の日記</strong><small>{weatherInfo[followers[selectedExchange].weather].label}の感情</small></div><span>{followers[selectedExchange].avatar}</span></header><div className={`diary-sky living-sky ${followers[selectedExchange].weather}`}><div className="sky-cloud cloud-a"/><div className="sky-cloud cloud-b"/><span className="sky-weather">{weatherInfo[followers[selectedExchange].weather].symbol}</span><span className="sky-star">✦</span><div className="sky-caption"><small>日記から読み取った空</small><strong>今日の感情傾向</strong></div></div><div className="journal-book"><article className="journal-entry partner"><header><strong>{followers[selectedExchange].name}</strong><time>{diaryEntries[selectedExchange].time}</time></header><div className="diary-intent">{diaryEntries[selectedExchange].intent}</div><p>{diaryEntries[selectedExchange].body}</p><p className="no-reply-note">返信は不要です。短いリアクションだけ送れます。</p><div className="journal-reactions text-reactions">{["読んだよ","無理しないで","話したくなったら聞くよ"].map(label=><button className={journalReaction===label?"active":""} key={label} onClick={()=>{setJournalReaction(label);notify("リアクションを送りました")}}><small>{label}</small></button>)}</div>{journalReaction&&<div className="care-sent"><strong>「{journalReaction}」を送りました</strong><span>返信は不要です</span></div>}</article></div></>}</div>}

    <button className="new-post" aria-label="投稿を作成" onClick={()=>setComposer(true)}><Plus/></button>
    <nav className="main-nav"><button className={view==="timeline"?"active":""} onClick={()=>{setKeyboardOpen(false);setView("timeline")}}><Home fill="currentColor"/></button><button className={view==="search"?"active":""} onClick={()=>{setKeyboardOpen(false);setView("search")}}><Search/></button><button className={view==="profile"||view==="following"||view==="followers"||view==="userProfile"?"active":""} onClick={()=>{setKeyboardOpen(false);setView("profile")}}><UserRound fill="currentColor"/></button><button className={view==="messages"?"active":""} onClick={()=>{setKeyboardOpen(false);setView("messages")}}><BookOpen/></button></nav>
    {showSplash&&<div className="app-splash" aria-label="アプリを起動中"><img src="/header-weather-transparent.png" alt=""/></div>}
  </section>

  {composer&&<div className="modal-shade"><form className="post-modal" onSubmit={submit}><header><button type="button" onClick={()=>setComposer(false)}><X/></button><strong>新しい投稿</strong><button disabled={!draft.trim()}>投稿</button></header><textarea autoFocus value={draft} onChange={e=>setDraft(e.target.value)} placeholder="いま、どうしていますか？" maxLength={240}/><div className="analysis-preview"><span>{info.symbol}</span><p>投稿後、AIが感情を分析して適切な天気に分類します。</p></div></form></div>}
  {toast&&<div className="sora-toast">{toast}</div>}
  </main>
}

function MapDiscovery({zoom,setZoom,notify}:{zoom:number;setZoom:(n:number)=>void;notify:(s:string)=>void}){
  const areas=[
    {name:"日本",date:"4月17日",weather:"🌤️",avatar:"👧",user:"猫れ",handle:"@digi_neko",body:"うちのチワワ、私が『可愛いねぇ〜』って褒めると、絶対に左に首を15度傾ける。日本中のやさしい投稿を眺めています。"},
    {name:"東京都",date:"4月17日",weather:"🌧️",avatar:"🏖️",user:"海大好き",handle:"@umi_suki",body:"清澄白河のカフェ、並びすぎててウケる。みんなそんなにコンクリート打ちっぱなしの壁見ながらコーヒー飲みたいんか。"},
    {name:"渋谷区",date:"4月17日",weather:"⛈️",avatar:"🏙️",user:"渋谷ウォッチ",handle:"@shibuya_watch",body:"渋谷駅周辺では強い言葉を含む投稿が増えています。閲覧する情報を選びながら、無理のない範囲で利用してください。"},
  ];
  const area=areas[zoom];
  const change=(next:number)=>setZoom(Math.max(0,Math.min(2,next)));
  return <div className="map-discovery">
    <div className={`map-canvas zoom-${zoom}`} onWheel={e=>change(zoom+(e.deltaY<0?1:-1))} onClick={()=>change(zoom+1)}>
      <div className="map-title"><strong>{area.name}</strong><span>{area.date}</span></div>
      {zoom===0?<div className="japan-shape"><img src="/japan-map.png" alt="日本地図" /></div>:<div className="region-shape"><span>{area.weather}</span></div>}
      <div className="map-controls"><button onClick={e=>{e.stopPropagation();change(zoom+1)}} disabled={zoom===2}>＋</button><button onClick={e=>{e.stopPropagation();change(zoom-1)}} disabled={zoom===0}>−</button></div>
      <small>地図をタップ／スクロールしてズーム</small>
    </div>
    <article className="map-post"><div className="post-head"><div className="photo-avatar">{area.avatar}</div><div className="identity"><strong>{area.user}</strong><span>{area.handle}</span></div><time>5時間前</time></div><p>{area.body}</p><div className="metric-row"><button onClick={()=>notify("返信")}><MessageCircle/><span>13.1k</span></button><button><Repeat2/><span>11.2k</span></button><button><Heart/><span>36.3k</span></button><button><ChartNoAxesColumnIncreasing/><span>97.4k</span></button><button><Upload/></button></div></article>
  </div>
}
