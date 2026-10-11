"use client";

import {
  Bell, ChartNoAxesColumnIncreasing, Cloud, CloudRain, Heart, Home,
  Mail, Map, MapPin, MessageCircle, Pencil, Repeat2, Search, Send, Settings,
  Sun, Upload, UserPlus, UserRound, X, Zap
} from "lucide-react";
import { type FormEvent, type PointerEvent, type WheelEvent, useEffect, useMemo, useRef, useState } from "react";
import { RealMap } from "./RealMap";

type Weather = "sunny" | "cloudy" | "rainy" | "storm";
type View = "timeline" | "notifications" | "search" | "messages" | "profile" | "userProfile" | "following" | "followers" | "followAdd" | "settings";
type Category = "エンタメ" | "スポーツ" | "テクノロジー" | "ビジネス" | "育児" | "キャリア・教育" | "美容";
type Post = { id:number; weather:Weather; name:string; handle:string; avatar:string; time:string; body:string; replies:string; reposts:string; likes:string; views:string };
type Account = {name:string;handle:string;avatar:string;weather:Weather;avatarClass?:number};

const weatherInfo = {
  sunny: { label:"晴れ", icon:Sun, symbol:"🌤️", message:"明るく前向きな投稿が多いタイムラインです", color:"#f6b900" },
  cloudy: { label:"曇り", icon:Cloud, symbol:"☁️", message:"落ち着いた話題と少し不安な投稿が混在しています", color:"#78909c" },
  rainy: { label:"雨", icon:CloudRain, symbol:"🌧️", message:"ネガティブな投稿が増えています。無理せず閲覧してください", color:"#367cd8" },
  storm: { label:"雷雨", icon:Zap, symbol:"⛈️", message:"炎上・強い表現が多い状態です。閲覧には注意してください", color:"#28233e" },
};
const weatherOrder:Weather[] = ["sunny","cloudy","rainy","storm"];
const categories:Category[] = ["エンタメ","スポーツ","テクノロジー","ビジネス","育児","キャリア・教育","美容"];

function SearchWeatherMark({weather}:{weather:Weather}){
  if(weather==="rainy")return <span className="search-weather-mark search-weather-rain"><img className="search-rain-cloud" src="/weather-rain-cloud.png" alt=""/><img className="search-rain-drop drop-one" src="/weather-rain-drop-one.png" alt=""/><img className="search-rain-drop drop-two" src="/weather-rain-drop-two-repaired.png" alt=""/><img className="search-rain-drop drop-three" src="/weather-rain-drop-three.png" alt=""/></span>;
  const src=weather==="sunny"?"/weather-sun.png":weather==="cloudy"?"/weather-cloud.png":"/weather-storm.png";
  return <img className={`search-weather-mark search-weather-${weather}`} src={src} alt=""/>;
}

function SettingSwitch({checked,onChange,label}:{checked:boolean;onChange:()=>void;label:string}){
  return <button type="button" className={`setting-switch ${checked?"on":""}`} role="switch" aria-checked={checked} aria-label={label} onClick={onChange}><i/></button>;
}

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
  {id:10,weather:"sunny",name:"朝ごはん記録",handle:"@toast_morning",avatar:"🍳",time:"34分前",body:"目玉焼きが今日はきれいに焼けた。パンも焦がさなかったので、それだけでいい朝。",replies:"1",reposts:"0",likes:"24",views:"118"},
  {id:11,weather:"sunny",name:"フィルム散歩",handle:"@film_walk",avatar:"📷",time:"1時間前",body:"商店街の花屋さんで、店先の鉢に猫が丸くなっていた。お店の人に聞いたら毎日同じ時間に来るらしい。写真を一枚撮らせてもらった。",replies:"4",reposts:"2",likes:"73",views:"405"},
  {id:12,weather:"sunny",name:"ひなたの台所",handle:"@hinata_kitchen",avatar:"🍙",time:"3時間前",body:"余っていた野菜を全部入れてスープにした。味付けは適当だったのに、家族がおかわりしてくれた。次も同じ味にできる自信はない。",replies:"3",reposts:"1",likes:"51",views:"277"},
  {id:13,weather:"sunny",name:"週末ランナー",handle:"@slow_run_day",avatar:"👟",time:"6時間前",body:"久しぶりに5km走れた。速くはなかったけれど、川沿いの風が気持ちよくて最後まで歩かなかった。",replies:"6",reposts:"0",likes:"88",views:"462"},
  {id:14,weather:"cloudy",name:"午後三時",handle:"@three_pm_note",avatar:"☕",time:"47分前",body:"予定を詰めすぎたかもしれない。明日の約束をひとつ来週に移してもらった。",replies:"2",reposts:"0",likes:"19",views:"136"},
  {id:15,weather:"cloudy",name:"まどぎわ",handle:"@window_side",avatar:"🪴",time:"2時間前",body:"返信しようと思って文章を何度も書き直して、結局まだ送れていない。考えすぎているだけだと思うけど、もう少し時間を置く。",replies:"5",reposts:"1",likes:"38",views:"249"},
  {id:16,weather:"cloudy",name:"通勤メモ",handle:"@train_memo",avatar:"🚃",time:"4時間前",body:"電車が少し遅れていた。ホームは混んでいたけど、前にいた人が落とした手袋を別の人が拾って渡していて、空気が少しやわらいだ。",replies:"2",reposts:"1",likes:"46",views:"318"},
  {id:17,weather:"cloudy",name:"ことばを探す",handle:"@words_between",avatar:"✏️",time:"7時間前",body:"嬉しいとも悲しいとも言い切れない日だった。こういう日のことを説明できる言葉があるなら知りたい。",replies:"7",reposts:"2",likes:"64",views:"391"},
  {id:18,weather:"rainy",name:"深夜の机",handle:"@late_desk",avatar:"💻",time:"28分前",body:"今日中に終わらせたかった作業がまだ残っている。焦るほど手が止まるので、一度お茶を入れてくる。",replies:"3",reposts:"0",likes:"27",views:"174"},
  {id:19,weather:"rainy",name:"青い傘",handle:"@blue_umbrella",avatar:"☂️",time:"1時間前",body:"楽しみにしていた予定が急になくなった。仕方ないことだと分かっているけど、今日はちょっと残念なままでいる。",replies:"5",reposts:"1",likes:"43",views:"286"},
  {id:20,weather:"rainy",name:"眠れない夜",handle:"@still_awake",avatar:"🛏️",time:"3時間前",body:"早く寝ようとすると余計にいろいろ思い出す。明日のことは明日考えればいいのに、頭だけが先に走っている。",replies:"8",reposts:"2",likes:"69",views:"437"},
  {id:21,weather:"rainy",name:"小さな休憩",handle:"@pause_today",avatar:"🫖",time:"5時間前",body:"誰かと比べて落ち込んで、そんな自分にも疲れた。今日はできたことを一つだけ数えて終わりにする。洗濯はした。",replies:"6",reposts:"1",likes:"58",views:"354"},
  {id:22,weather:"storm",name:"一次情報を読む",handle:"@source_first",avatar:"🔎",time:"9分前",body:"画像一枚だけで断定する投稿が急に増えている。元の発表を確認したら条件がかなり省かれていた。拡散する前にリンク先まで見てほしい。",replies:"14",reposts:"9",likes:"97",views:"781"},
  {id:23,weather:"storm",name:"配信ウォッチ",handle:"@stream_check",avatar:"📺",time:"13分前",body:"配信者の発言が炎上しているけど、切り抜きと本編で受ける印象が違う。批判するにしても、見ていない内容まで決めつけるのは違うと思う。",replies:"21",reposts:"8",likes:"112",views:"894"},
  {id:24,weather:"storm",name:"静観します",handle:"@wait_and_see",avatar:"🧊",time:"31分前",body:"情報が数分ごとに変わっていて、今は何が正しいのか分からない。新しい投稿を追うのをやめて、公式の説明を待つ。",replies:"10",reposts:"5",likes:"76",views:"566"},
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
const ownProfilePosts:Post[] = [
  {id:101,weather:"cloudy",name:"黄昏",handle:"@taso_gare",avatar:"",time:"6時間前",body:"上着のポケットに手を入れたら、半年前になくしたと思ってたワイヤレスイヤホンの左耳側が出てきた。\nああ、ここにあったんだ。って思った次の瞬間、そういえば右耳側は先週、駅のホームで落として失くしたんだったと思い出して、もう二度と両耳揃わないんだな、って妙に静かな気持ちで泣きそうになってる。",replies:"13100",reposts:"11200",likes:"36300",views:"97400"},
  {id:102,weather:"sunny",name:"黄昏",handle:"@taso_gare",avatar:"",time:"12時間前",body:"自炊がめんどくさい人は、お米を炊く炊飯器の中に冷凍餃子とカット野菜と白だしを入れてスイッチを押すと、30分後には『料理を諦めた人間の末路』みたいな激ウマおじやが出来上がります。洗い物は内釜だけ。全人類やって。",replies:"9800",reposts:"7400",likes:"28100",views:"82300"},
  {id:103,weather:"sunny",name:"黄昏",handle:"@taso_gare",avatar:"",time:"1日",body:"旅先の朝、予定を決めずに各駅停車へ。窓から見えた海がきれいだったので、次の駅で降りてみることにした。",replies:"4200",reposts:"3100",likes:"19700",views:"56800"},
];
const followAddGroups:{label:string;weathers:Weather[]}[] = [
  {label:"エンタメ",weathers:["storm","storm","rainy","storm"]},
  {label:"スポーツ",weathers:["rainy","storm","rainy","storm"]},
  {label:"テクノロジー",weathers:["rainy","rainy","sunny","cloudy"]},
  {label:"ビジネス",weathers:["storm","rainy","cloudy","sunny"]},
  {label:"育児",weathers:["storm","storm","rainy","sunny"]},
  {label:"キャリア・教育",weathers:["cloudy","rainy","cloudy","storm"]},
  {label:"美容",weathers:["rainy","cloudy","storm","sunny"]},
  {label:"フード",weathers:["sunny","cloudy","cloudy","storm"]},
];
const followAddAccounts = [
  ["みなみの映画帳","@minami_cinema"],["夜ふかしラジオ","@night_radio"],["ことり劇場","@kotori_stage"],["音楽散歩","@music_walk"],
  ["青空ランナー","@sky_runner"],["週末スタジアム","@weekend_stadium"],["ボールの記憶","@ball_memory"],["観戦日和","@game_day"],
  ["未来の道具箱","@future_tools"],["コードと珈琲","@code_coffee"],["ロボット通信","@robot_news"],["デジタル星空","@digital_sky"],
  ["まちの仕事帖","@town_business"],["働き方メモ","@workstyle_note"],["小さな商店","@small_shop"],["朝の経済便","@morning_market"],
  ["すくすく日記","@sukusuku_days"],["おやこ時間","@oyako_time"],["絵本の森","@picturebook_forest"],["ちいさな成長","@little_growth"],
  ["学び直しノート","@learn_again"],["放課後研究室","@after_school_lab"],["しごと図鑑","@career_guide"],["資格の小径","@study_path"],
  ["透明感メイク","@clear_makeup"],["髪と暮らし","@hair_life"],["色彩手帖","@color_note"],["スキンケア便り","@skin_letter"],
  ["朝ごはん研究所","@breakfast_lab"],["季節の台所","@season_kitchen"],["おにぎり日和","@onigiri_day"],["旅する食卓","@travel_table"],
] as const;
const trendDays = [
  {label:"4月18日",short:"18",day:"木"},{label:"4月19日",short:"19",day:"金"},{label:"4月20日",short:"20",day:"土"},
  {label:"4月21日",short:"21",day:"日"},{label:"4月22日",short:"22",day:"月"},{label:"4月23日",short:"23",day:"火"},
];
const categoryForecasts:Record<Category,Weather[]> = {
  "エンタメ":["sunny","cloudy","sunny","rainy","cloudy","sunny"],
  "スポーツ":["cloudy","sunny","rainy","cloudy","rainy","storm"],
  "テクノロジー":["sunny","sunny","cloudy","rainy","sunny","cloudy"],
  "ビジネス":["rainy","cloudy","storm","rainy","cloudy","sunny"],
  "育児":["cloudy","sunny","cloudy","rainy","sunny","cloudy"],
  "キャリア・教育":["sunny","cloudy","sunny","sunny","rainy","cloudy"],
  "美容":["sunny","sunny","cloudy","rainy","sunny","cloudy"],
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
  "育児":[
    ["親子で楽しめる週末イベント、地域の公園で開催","保育園の手作り給食が話題、家庭向けレシピも公開","子どもの初めての一歩、家族から祝福の声","読み聞かせ会に多くの親子、笑顔あふれる一日に"],
    ["雨の日の室内遊び、保育士の工夫が参考になると話題","子育て支援センターが相談時間を延長","親子向け防災教室、身近な備えを学ぶ","離乳食の悩みを共有するオンライン交流会を開催"],
    ["小学生が地域の清掃活動に参加、住民から感謝","親子で作る簡単朝ごはん、投稿が人気に","子どもの絵を展示する商店街企画がスタート","育児日記を続けるコツ、経験者が紹介"],
    ["送迎時間の混雑を受け、園が新しいルールを案内","子どもの体調不良が増加、休養を呼びかけ","遊具の一部を点検のため利用停止","育児情報の誤解が拡散、専門家が解説"],
    ["地域の一時保育枠を拡充、予約方法を改善","父親向け育児講座、参加者同士の交流も","親子写真コンテスト、自然な一枚が大賞","子ども食堂に地元農家が野菜を寄付"],
    ["子育て投稿への強い批判が増加、冷静な対話を呼びかけ","匿名の育児情報を巡り混乱、自治体が訂正","園への問い合わせが集中、回答に時間","家族写真の無断転載が判明、注意喚起"],
  ],
  "キャリア・教育":[
    ["学生の地域課題プロジェクト、企業が実用化を支援","若手社員の提案制度から新サービス誕生","社会人向け夜間講座、受講者の満足度高く","高校生の研究発表が国際大会で入賞"],
    ["オンライン面接のポイント、採用担当者が解説","学校図書館の利用時間を延長","職場体験に参加した生徒が成果を発表","学び直し支援制度の対象講座を拡充"],
    ["大学と企業が共同で新しい実習科目を開設","転職後の研修を支える交流会が好評","資格試験の無料相談会を開催","学生チームのビジネス案が最優秀賞"],
    ["試験日程の変更を発表、受験者へ確認呼びかけ","採用サイトの不具合が復旧","研修資料の誤記を訂正","学校行事が悪天候で延期"],
    ["リモート研修に対話型プログラムを導入","若者向けキャリア相談窓口を新設","教員の業務改善案を生徒と共同検討","卒業生による仕事紹介イベントを開催"],
    ["就職情報の誤投稿が拡散、運営が注意喚起","教育方針を巡る議論が過熱","面接体験談の真偽に疑問、投稿者が説明","学校への中傷が増加、相談窓口を案内"],
  ],
  "美容":[
    ["春色メイクの投稿が人気、自然な仕上がりに注目","美容師が紹介する簡単ヘアアレンジが話題","地域の素材を使った石けん、新商品を発売","肌にやさしい日焼け対策を専門家が解説"],
    ["朝の時短ケア、利用者の工夫が集まる","季節の変わり目の保湿方法を紹介","セルフネイル講座に初心者が参加","美容室のヘアドネーション活動が広がる"],
    ["再利用できる化粧品容器、回収店舗を拡大","学生が考案した香りの商品が受賞","パーソナルカラー体験会を開催","睡眠と肌の関係を研究チームが発表"],
    ["人気商品の欠品が続き、入荷時期を案内","広告写真の加工表現を巡り議論","予約システム障害で一部受付を停止","成分表示の誤りを訂正し交換対応"],
    ["地域サロンが高齢者向け訪問サービスを開始","髪型の変化を楽しむ投稿に温かな反応","環境配慮型コスメの売上が伸長","メイクを通じた交流イベントを開催"],
    ["美容法の誤情報が拡散、医師が注意を呼びかけ","商品の効果を巡り批判が集中","無断転載された施術写真、店舗が削除要請","強い表現のレビューが増え運営が対応"],
  ],
};

export default function HomePage(){
  const [weather,setWeather]=useState<Weather>("sunny");
  const [view,setView]=useState<View>("timeline");
  const [liked,setLiked]=useState<number[]>([]);
  const [reposted,setReposted]=useState<number[]>([]);
  const [repostMenuTarget,setRepostMenuTarget]=useState<Post|null>(null);
  const [quoteTarget,setQuoteTarget]=useState<Post|null>(null);
  const [quoteDraft,setQuoteDraft]=useState("");
  const [quotePosts,setQuotePosts]=useState<{id:number;body:string;original:Post}[]>([]);
  const [replied,setReplied]=useState<number[]>([]);
  const [replyTarget,setReplyTarget]=useState<Post|null>(null);
  const [replyDraft,setReplyDraft]=useState("");
  const [composer,setComposer]=useState(false);
  const [draft,setDraft]=useState("");
  const [query,setQuery]=useState("");
  const [searchSubmitted,setSearchSubmitted]=useState(false);
  const [trendSort,setTrendSort]=useState<"top"|"latest">("top");
  const [keyboardOpen,setKeyboardOpen]=useState(false);
  const [category,setCategory]=useState<Category>("スポーツ");
  const [trendDay,setTrendDay]=useState(trendDays.length-1);
  const [mapMode,setMapMode]=useState(false);
  const [selectedAccount,setSelectedAccount]=useState<Account|null>(null);
  const [accountReturnView,setAccountReturnView]=useState<View>("timeline");
  const forecastStrip=useRef<HTMLDivElement>(null);
  const searchPage=useRef<HTMLDivElement>(null);
  const [toast,setToast]=useState("");
  const [showSplash,setShowSplash]=useState(true);
  const [activeChat,setActiveChat]=useState<number|null>(null);
  const [messageDraft,setMessageDraft]=useState("");
  const [sentMessages,setSentMessages]=useState<Record<number,string[]>>({});
  const [notificationTab,setNotificationTab]=useState<"all"|"posts">("all");
  const [defaultWeather,setDefaultWeather]=useState<Weather>("sunny");
  const [quietWeathers,setQuietWeathers]=useState<Weather[]>(["storm"]);
  const [reduceMotion,setReduceMotion]=useState(false);
  const [postNotifications,setPostNotifications]=useState(true);
  const [reactionNotifications,setReactionNotifications]=useState(true);
  const [addedFollows,setAddedFollows]=useState<string[]>([]);
  const notificationsRead=false;
  const [dragOffset,setDragOffset]=useState(0);
  const [dragWidth,setDragWidth]=useState(390);
  const [dragPreviewWeather,setDragPreviewWeather]=useState<Weather|null>(null);
  const appSurface=useRef<HTMLElement|null>(null);
  const horizontalGesture=useRef<{x:number;y:number}|null>(null);
  const gestureAxis=useRef<"pending"|"horizontal"|"vertical">("pending");
  const gestureDragging=useRef(false);
  const suppressSwipeClick=useRef(false);
  const lastWheelSwitch=useRef(0);
  const wheelTravel=useRef(0);
  const wheelResetTimer=useRef<number|null>(null);
  const feed=useMemo(()=>posts.filter(p=>p.weather===weather),[weather]);
  const dragPreviewFeed=useMemo(()=>dragPreviewWeather?posts.filter(p=>p.weather===dragPreviewWeather):[],[dragPreviewWeather]);
  const exactSearchResults=useMemo(()=>posts.filter(p=>`${p.name}${p.handle}${p.body}`.toLowerCase().includes(query.trim().toLowerCase())),[query]);
  const searchResults=useMemo(()=>query.trim()?(exactSearchResults.length?exactSearchResults:posts.slice(0,6)):[],[query,exactSearchResults]);
  const hasExactSearchResults=exactSearchResults.length>0;
  const info=weatherInfo[weather];
  const trendWeather=categoryForecasts[category][trendDay];
  const dailyHeadlines=trendStories[category][trendDay];
  const weatherPostGroups:{weather:Weather;name:string;others:number;avatars:number[];time:string}[]=[
    {weather:"sunny",name:"夜更かしの猫",others:3,avatars:[1,2],time:"5分前"},
    {weather:"cloudy",name:"ニュースを読む人",others:2,avatars:[4,5],time:"18分前"},
    {weather:"rainy",name:"雨宿り",others:1,avatars:[6,3],time:"36分前"},
    {weather:"storm",name:"トレンドを追う人",others:2,avatars:[2,4],time:"1時間前"},
  ];
  const selectedCoverIndex=selectedAccount
    ? [...selectedAccount.handle].reduce((total,character)=>total+character.charCodeAt(0),0)%3+1
    : 1;
  const compactCount=(value:string|number)=>{
    const count=typeof value==="number"?value:Number(value);
    if(!Number.isFinite(count))return String(value);
    if(count>=1000){
      const abbreviated=(count/1000).toFixed(1).replace(/\.0$/,'');
      return `${abbreviated}k`;
    }
    return String(count);
  };
  const shownLikes=(post:Post)=>{
    const base=Number(post.likes);
    return Number.isFinite(base)?compactCount(base+(liked.includes(post.id)?1:0)):post.likes;
  };
  const shownReposts=(post:Post)=>{
    const base=Number(post.reposts);
    const quoted=quotePosts.some(quote=>quote.original.id===post.id);
    return Number.isFinite(base)?compactCount(base+(reposted.includes(post.id)?1:0)+(quoted?1:0)):post.reposts;
  };
  const shownReplies=(post:Post)=>{
    const base=Number(post.replies);
    return Number.isFinite(base)?compactCount(base+(replied.includes(post.id)?1:0)):post.replies;
  };
  const toggleRepost=(post:Post)=>setReposted(items=>{
    const removing=items.includes(post.id);
    notify(removing?"リポストを取り消しました":"リポストしました");
    return removing?items.filter(id=>id!==post.id):[...items,post.id];
  });
  const submitReply=(event:FormEvent)=>{
    event.preventDefault();
    if(!replyTarget||!replyDraft.trim())return;
    setReplied(items=>items.includes(replyTarget.id)?items:[...items,replyTarget.id]);
    setReplyDraft("");
    setReplyTarget(null);
    notify("返信を送信しました");
  };
  const submitQuote=(event:FormEvent)=>{
    event.preventDefault();
    if(!quoteTarget||!quoteDraft.trim())return;
    setQuotePosts(items=>[{id:Date.now(),body:quoteDraft.trim(),original:quoteTarget},...items]);
    setQuoteDraft("");
    setQuoteTarget(null);
    notify("引用して投稿しました");
  };
  const postActions=(post:Post)=><div className="metric-row">
    <button className={replied.includes(post.id)?"replied":""} aria-label="返信" onClick={()=>setReplyTarget(post)}><MessageCircle fill={replied.includes(post.id)?"currentColor":"none"}/><span>{shownReplies(post)}</span></button>
    <button className={reposted.includes(post.id)?"reposted":""} aria-label="リポストメニュー" aria-pressed={reposted.includes(post.id)} onClick={()=>setRepostMenuTarget(post)}><Repeat2/><span>{shownReposts(post)}</span></button>
    <button className={`like-button ${liked.includes(post.id)?"liked":""}`} aria-pressed={liked.includes(post.id)} aria-label={liked.includes(post.id)?"いいねを取り消す":"いいね"} onClick={()=>setLiked(items=>items.includes(post.id)?items.filter(id=>id!==post.id):[...items,post.id])}><Heart fill={liked.includes(post.id)?"currentColor":"none"}/><span>{shownLikes(post)}</span></button>
    <button aria-label="表示回数"><ChartNoAxesColumnIncreasing/><span>{compactCount(post.views)}</span></button>
    <button className="share" aria-label="共有" onClick={()=>notify("共有メニュー")}><Upload/></button>
  </div>;
  useEffect(()=>{
    if(view!=="search"||mapMode)return;
    const frame=window.requestAnimationFrame(()=>{
      const strip=forecastStrip.current;
      const item=strip?.children[trendDay] as HTMLElement|undefined;
      if(!strip||!item)return;
      const centeredLeft=item.offsetLeft-(strip.clientWidth-item.offsetWidth)/2;
      strip.scrollTo({left:Math.max(0,centeredLeft),behavior:"auto"});
    });
    return()=>window.cancelAnimationFrame(frame);
  },[trendDay,category,view,mapMode]);
  useEffect(()=>{
    if(view!=="search")return;
    const frame=window.requestAnimationFrame(()=>searchPage.current?.scrollTo({top:0,behavior:"auto"}));
    return()=>window.cancelAnimationFrame(frame);
  },[view,mapMode,searchSubmitted]);
  useEffect(()=>{const timer=window.setTimeout(()=>setShowSplash(false),1800);return()=>window.clearTimeout(timer)},[]);
  const notify=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(""),1500)};
  const changeWeather=(next:Weather)=>{
    if(weather===next)return;
    setWeather(next);
  };
  const resetWeatherSwipe=()=>{
    horizontalGesture.current=null;
    gestureAxis.current="pending";
    gestureDragging.current=false;
    setDragOffset(0);
    setDragPreviewWeather(null);
  };
  const setWeatherWithSlide=(next:Weather)=>{
    resetWeatherSwipe();
    if(weather===next)return;
    changeWeather(next);
  };
  const weatherAtStep=(step:number)=>{
    const index=weatherOrder.indexOf(weather);
    const nextIndex=index+step;
    return nextIndex<0||nextIndex>=weatherOrder.length?null:weatherOrder[nextIndex];
  };
  const shiftWeather=(step:number)=>{
    const next=weatherAtStep(step);
    if(next)changeWeather(next);
  };
  const adjacentWeather=(step:number)=>{
    return weatherAtStep(step);
  };
  const startWeatherSwipe=(e:PointerEvent<HTMLElement>)=>{
    if(e.pointerType!=="mouse")return;
    if((e.target as HTMLElement).closest(".main-nav,.new-post"))return;
    horizontalGesture.current={x:e.clientX,y:e.clientY};
    gestureAxis.current="pending";
    gestureDragging.current=false;
    setDragOffset(0);
    setDragPreviewWeather(null);
  };
  const moveWeatherSwipe=(e:PointerEvent<HTMLElement>)=>{
    if(e.pointerType!=="mouse")return;
    const start=horizontalGesture.current;
    if(!start)return;
    const dx=e.clientX-start.x;
    const dy=e.clientY-start.y;
    const absX=Math.abs(dx);
    const absY=Math.abs(dy);
    if(gestureAxis.current==="pending"){
      if(Math.max(absX,absY)<6)return;
      if(absY>=10&&absY>absX*1.5){
        gestureAxis.current="vertical";
        return;
      }
      if(absX>=6&&absX>absY*.65){
        gestureAxis.current="horizontal";
        gestureDragging.current=true;
        e.currentTarget.setPointerCapture?.(e.pointerId);
      }else if(Math.max(absX,absY)>=18){
        gestureAxis.current=absX>=absY?"horizontal":"vertical";
        if(gestureAxis.current==="horizontal"){
          gestureDragging.current=true;
          e.currentTarget.setPointerCapture?.(e.pointerId);
        }
      }else{
        return;
      }
    }
    if(gestureAxis.current==="horizontal"&&gestureDragging.current){
      const width=e.currentTarget.clientWidth||390;
      setDragWidth(width);
      const nextOffset=Math.max(-width,Math.min(width,dx));
      const preview=adjacentWeather(nextOffset<0?1:-1);
      setDragOffset(preview?nextOffset:0);
      setDragPreviewWeather(preview);
    }
  };
  const endWeatherSwipe=(e:PointerEvent<HTMLElement>)=>{
    if(e.pointerType!=="mouse")return;
    const start=horizontalGesture.current;
    const dx=start?e.clientX-start.x:0;
    const wasDragging=gestureDragging.current;
    const switchDistance=Math.max(28,Math.min(dragWidth*.09,40));
    const shouldSwitch=gestureDragging.current&&Math.abs(dx)>switchDistance;
    if(wasDragging){
      suppressSwipeClick.current=true;
      window.setTimeout(()=>{suppressSwipeClick.current=false},80);
    }
    resetWeatherSwipe();
    if(shouldSwitch)shiftWeather(dx<0?1:-1);
  };
  const wheelWeather=(e:WheelEvent<HTMLDivElement>)=>{
    if(Math.abs(e.deltaX)<Math.abs(e.deltaY)*1.25)return;
    wheelTravel.current+=e.deltaX;
    if(wheelResetTimer.current!==null)window.clearTimeout(wheelResetTimer.current);
    wheelResetTimer.current=window.setTimeout(()=>{wheelTravel.current=0},180);
    const now=Date.now();
    if(now-lastWheelSwitch.current<650||Math.abs(wheelTravel.current)<140)return;
    lastWheelSwitch.current=now;
    const direction=wheelTravel.current>0?1:-1;
    wheelTravel.current=0;
    shiftWeather(direction);
  };
  useEffect(()=>{
    if(view!=="timeline")resetWeatherSwipe();
  },[view]);
  useEffect(()=>{
    const surface=appSurface.current;
    if(!surface||view!=="timeline")return;
    const beginTouch=(event:globalThis.TouchEvent)=>{
      if(event.touches.length!==1||(event.target as HTMLElement).closest(".main-nav,.new-post"))return;
      const touch=event.touches[0];
      horizontalGesture.current={x:touch.clientX,y:touch.clientY};
      gestureAxis.current="pending";
      gestureDragging.current=false;
      setDragOffset(0);
      setDragPreviewWeather(null);
    };
    const moveTouch=(event:globalThis.TouchEvent)=>{
      const start=horizontalGesture.current;
      const touch=event.touches[0];
      if(!start||!touch||gestureAxis.current==="vertical")return;
      const dx=touch.clientX-start.x;
      const dy=touch.clientY-start.y;
      const absX=Math.abs(dx);
      const absY=Math.abs(dy);
      if(gestureAxis.current==="pending"){
        if(Math.max(absX,absY)<4)return;
        if(absY>=8&&absY>absX*1.3){
          gestureAxis.current="vertical";
          return;
        }
        if(absX>=4&&absX>absY*.7){
          gestureAxis.current="horizontal";
          gestureDragging.current=true;
        }else if(Math.max(absX,absY)>=14){
          gestureAxis.current=absX>=absY?"horizontal":"vertical";
          gestureDragging.current=gestureAxis.current==="horizontal";
        }else{
          return;
        }
      }
      if(gestureAxis.current!=="horizontal")return;
      event.preventDefault();
      const width=surface.clientWidth||390;
      const nextOffset=Math.max(-width,Math.min(width,dx));
      const index=weatherOrder.indexOf(weather);
      const nextIndex=index+(nextOffset<0?1:-1);
      const preview=nextIndex<0||nextIndex>=weatherOrder.length?null:weatherOrder[nextIndex];
      setDragWidth(width);
      setDragOffset(preview?nextOffset:0);
      setDragPreviewWeather(preview);
    };
    const finishTouch=(event:globalThis.TouchEvent)=>{
      const start=horizontalGesture.current;
      const touch=event.changedTouches[0];
      const dx=start&&touch?touch.clientX-start.x:0;
      const wasDragging=gestureAxis.current==="horizontal"&&gestureDragging.current;
      const width=surface.clientWidth||390;
      const shouldSwitch=wasDragging&&Math.abs(dx)>Math.max(24,Math.min(width*.07,34));
      if(wasDragging){
        suppressSwipeClick.current=true;
        window.setTimeout(()=>{suppressSwipeClick.current=false},100);
      }
      resetWeatherSwipe();
      if(shouldSwitch)shiftWeather(dx<0?1:-1);
    };
    surface.addEventListener("touchstart",beginTouch,{passive:true});
    surface.addEventListener("touchmove",moveTouch,{passive:false});
    surface.addEventListener("touchend",finishTouch,{passive:true});
    surface.addEventListener("touchcancel",resetWeatherSwipe,{passive:true});
    return()=>{
      surface.removeEventListener("touchstart",beginTouch);
      surface.removeEventListener("touchmove",moveTouch);
      surface.removeEventListener("touchend",finishTouch);
      surface.removeEventListener("touchcancel",resetWeatherSwipe);
    };
  },[view,weather]);
  const openSearchHome=()=>{
    setKeyboardOpen(false);
    setQuery("");
    setSearchSubmitted(false);
    setTrendSort("top");
    setMapMode(false);
    setView("search");
  };
  const openAccount=(account:Account,returnView:View="timeline")=>{setSelectedAccount(account);setAccountReturnView(returnView);setView("userProfile")};
  const submit=(e:FormEvent)=>{e.preventDefault();if(!draft.trim())return;setDraft("");setComposer(false);notify("投稿しました（感情を分析中）")};
  const conversations=[
    {name:"夜更かしの猫",handle:"@digi_walker_01",preview:"写真ありがとう！月きれいだったね",time:"12分",avatar:1,messages:["今日の帰り、月がすごくきれいだったよ","見た！写真ありがとう。雲の間から見える感じよかったね"]},
    {name:"ハナコ＠読書垢",handle:"@flower_book_log",preview:"その本、読み終わったら感想聞きたい",time:"1時間",avatar:3,messages:["この前話してた本、やっと買えた！","いいな。その本、読み終わったら感想聞きたい"]},
    {name:"フィルム散歩",handle:"@film_walk",preview:"土曜日なら空いてるよ",time:"昨日",avatar:5,messages:["今度あの商店街、一緒に写真撮りに行かない？","土曜日なら空いてるよ"]},
    {name:"朝ごはん記録",handle:"@toast_morning",preview:"レシピ送るね",time:"2日",avatar:2,messages:["前に載せてたスープ、おいしそうだった","ありがとう！あとでレシピ送るね"]},
    {name:"海辺のソーダ",handle:"@umi_soda",preview:"あのカフェ、窓側の席がよかったよ",time:"3日",avatar:4,messages:["海沿いでゆっくりできる店知らない？","あのカフェ、窓側の席がよかったよ"]},
    {name:"ねこまる",handle:"@nekomaru_days",preview:"動画見た！最後の顔かわいすぎる",time:"4日",avatar:6,messages:["うちの猫、箱に入ろうとして失敗してた笑","動画見た！最後の顔かわいすぎる"]},
    {name:"珈琲と雨音",handle:"@coffee_rain",preview:"深煎りなら駅前のお店がおすすめ",time:"5日",avatar:1,messages:["苦めのコーヒーが飲める店を探してる","深煎りなら駅前のお店がおすすめ"]},
    {name:"放課後ゲーム部",handle:"@after5_game",preview:"今夜9時からなら参加できる！",time:"6日",avatar:3,messages:["今日みんなで協力モードやらない？","今夜9時からなら参加できる！"]},
    {name:"小さな植物園",handle:"@green_room88",preview:"新しい葉が出たら写真見せて",time:"1週間",avatar:5,messages:["教えてもらった通り鉢を替えてみたよ","いい感じ！新しい葉が出たら写真見せて"]},
    {name:"週末パン屋めぐり",handle:"@bread_trip",preview:"午前中なら焼きたてが多いみたい",time:"1週間",avatar:2,messages:["気になってたパン屋、今度行ってみる","午前中なら焼きたてが多いみたい"]},
    {name:"夜のラジオ",handle:"@midnight_radio",preview:"その曲、次の配信で流すね",time:"2週間",avatar:4,messages:["この前紹介してた曲、すごくよかった","ありがとう。その曲、次の配信でも流すね"]},
    {name:"ゆるラン日記",handle:"@slow_run_log",preview:"無理せず同じペースで走ろう",time:"2週間",avatar:6,messages:["今週末、川沿いを軽く走らない？","いいね。無理せず同じペースで走ろう"]},
  ];
  const sendMessage=(e:FormEvent)=>{e.preventDefault();if(activeChat===null||!messageDraft.trim())return;setSentMessages(v=>({...v,[activeChat]:[...(v[activeChat]||[]),messageDraft.trim()]}));setMessageDraft("")};

  return <main className="sora-stage"><section ref={appSurface} className={`sora-app theme-${weather} ${view==="timeline"?"timeline-swipe-enabled":""}`} onPointerDown={view==="timeline"?startWeatherSwipe:undefined} onPointerMove={view==="timeline"?moveWeatherSwipe:undefined} onPointerUp={view==="timeline"?endWeatherSwipe:undefined} onPointerCancel={e=>{if(view==="timeline"&&e.pointerType==="mouse")resetWeatherSwipe()}} onLostPointerCapture={e=>{if(e.pointerType==="mouse"&&horizontalGesture.current)resetWeatherSwipe()}} onClickCapture={e=>{if(suppressSwipeClick.current){e.preventDefault();e.stopPropagation();suppressSwipeClick.current=false}}}>
    {view==="timeline"&&<><header className="sora-header">
      <button className={`header-tool notification-trigger ${notificationsRead?"":"has-unread"}`} aria-label="通知" onClick={()=>setView("notifications")}><Bell/><i/></button>
      <div className="forecast-mark custom-weather-mark" title={`現在のタイムライン：${info.label}`}><img src="/header-weather-transparent.png" alt="天気タイムライン"/></div>
      <button className="header-tool" aria-label="設定" onClick={()=>setView("settings")}><Settings/></button>
    </header>

    <nav className="weather-tabs" aria-label="タイムラインの感情を選択">
      {weatherOrder.map(key=><button key={key} className={weather===key?"active":""} onClick={()=>{setWeatherWithSlide(key);setView("timeline")}} aria-label={weatherInfo[key].label}><SearchWeatherMark weather={key}/></button>)}
    </nav></>}

    {view==="timeline"&&dragPreviewWeather&&dragOffset!==0&&<div aria-hidden="true" className={`timeline-area weather-bg ${dragPreviewWeather} weather-adjacent-preview`} style={{transform:`translateX(${dragOffset+(dragOffset>0?-dragWidth:dragWidth)}px)`}}>
      {dragPreviewFeed.map((post,index)=><article className="sora-post region-post-in" style={{animationDelay:`${index*85}ms`}} key={`preview-${post.id}`}>
        <div className="post-head"><button className={`photo-avatar account-link generated-avatar avatar-${((post.id-1)%6)+1}`} tabIndex={-1} aria-label={`${post.name}のプロフィール`}/><div className="identity"><strong>{post.name}</strong><span>{post.handle}</span></div><time>{post.time}</time></div>
        <p>{post.body}</p>
        <div className="metric-row">
          <button tabIndex={-1}><MessageCircle/><span>{post.replies}</span></button>
          <button tabIndex={-1}><Repeat2/><span>{post.reposts}</span></button>
          <button tabIndex={-1} className={`like-button ${liked.includes(post.id)?"liked":""}`}><Heart fill={liked.includes(post.id)?"currentColor":"none"}/><span>{shownLikes(post)}</span></button>
          <button tabIndex={-1}><ChartNoAxesColumnIncreasing/><span>{post.views}</span></button>
          <button tabIndex={-1} className="share"><Upload/></button>
        </div>
      </article>)}
    </div>}

    {view==="timeline"&&<div className={`timeline-area weather-bg ${weather} ${dragOffset!==0?"is-pulling":""}`} style={dragOffset!==0?{transform:`translateX(${dragOffset}px)`}:undefined} onWheel={wheelWeather}>
      <div className="sky-feed-heading"><span>この空の声</span><i/><small>新しい順</small></div>
      {feed.map(post=><article className="sora-post" key={post.id}>
        <div className="post-head"><button className={`photo-avatar account-link generated-avatar avatar-${((post.id-1)%6)+1}`} onClick={()=>openAccount(post)} aria-label={`${post.name}のプロフィール`}/><div className="identity"><strong>{post.name}</strong><span>{post.handle}</span></div><time>{post.time}</time></div>
        <p>{post.body}</p>
        {postActions(post)}
      </article>)}
    </div>}

    {view==="notifications"&&<div className="notification-page">
      <header className="notification-head"><button className="notification-back" onClick={()=>setView("timeline")} aria-label="タイムラインへ戻る">‹</button><div><span>SORA</span><h1>通知</h1></div></header>
      <nav className="notification-tabs" aria-label="通知の種類"><button className={notificationTab==="all"?"active":""} onClick={()=>setNotificationTab("all")}>すべて</button><button className={notificationTab==="posts"?"active":""} onClick={()=>setNotificationTab("posts")}>ツイート</button></nav>
      <div className="notification-feed">
        <section>{weatherPostGroups.map((group,index)=><button className={`notification-row post-notice grouped-post-notice region-post-in ${notificationsRead?"":"unread"}`} style={{animationDelay:`${240+index*90}ms`}} key={`notice-${group.weather}`} onClick={()=>{setWeather(group.weather);setView("timeline")}}><span className="notice-avatar-stack">{group.avatars.map((avatar,index)=><i className={`generated-avatar avatar-${avatar}`} key={`${group.weather}-${index}`}/>)}</span><span className="notification-copy"><strong>{group.name}さんと他{group.others}人の新しい投稿があります</strong><small>{group.time} ・ <b className={group.weather}>{weatherInfo[group.weather].label}</b></small></span><span className="notice-weather-mini"><SearchWeatherMark weather={group.weather}/></span></button>)}</section>
        {notificationTab==="all"&&<section><h2>あなたへの反応</h2>
          <button className={`notification-row reaction-notice region-post-in ${notificationsRead?"":"unread"}`} style={{animationDelay:"600ms"}}><span className="notice-avatar generated-avatar avatar-2"/><span className="notification-copy"><strong>デジタル・ノマドさんがいいねしました</strong><p>「帰り道、雲の切れ間から月が…」</p><small>12分前</small></span><Heart fill="currentColor"/></button>
          <button className="notification-row reaction-notice region-post-in" style={{animationDelay:"690ms"}}><span className="notice-avatar generated-avatar avatar-3"/><span className="notification-copy"><strong>ハナコ＠読書垢さんが返信しました</strong><p>その本、私も気になっていました</p><small>1時間前</small></span><MessageCircle fill="currentColor"/></button>
          <button className="notification-row reaction-notice region-post-in" style={{animationDelay:"780ms"}}><span className="notice-avatar generated-avatar avatar-5"/><span className="notification-copy"><strong>フィルム散歩さんがリポストしました</strong><p>「今日は空がすごくきれいだった」</p><small>3時間前</small></span><Repeat2/></button>
          <button className="notification-row reaction-notice region-post-in" style={{animationDelay:"870ms"}}><span className="notice-avatar generated-avatar avatar-4"/><span className="notification-copy"><strong>朝ごはん記録さんがフォローしました</strong><small>昨日</small></span><UserPlus/></button>
        </section>}
      </div>
    </div>}

    {view==="settings"&&<div className={`settings-page ${reduceMotion?"motion-reduced":""}`}>
      <header className="settings-head"><button onClick={()=>setView("timeline")} aria-label="タイムラインへ戻る">‹</button><div><small>SORA</small><h1>空模様の設定</h1></div></header>
      <section className={`settings-sky-preview ${defaultWeather}`} aria-label={`最初に開く空は${weatherInfo[defaultWeather].label}`}><span className="settings-preview-mark"><SearchWeatherMark weather={defaultWeather}/></span><div><small>最初に開く空</small><strong>{weatherInfo[defaultWeather].label}</strong><p>{weatherInfo[defaultWeather].message}</p></div></section>
      <div className="settings-scroll">
        <section className="settings-group"><header><strong>タイムライン</strong><small>見る情報の空模様を整える</small></header>
          <p className="settings-label">最初に表示する天気</p>
          <div className="settings-weather-options">{weatherOrder.map(key=><button key={key} className={defaultWeather===key?"active":""} aria-pressed={defaultWeather===key} onClick={()=>{setDefaultWeather(key);setWeather(key)}}><SearchWeatherMark weather={key}/><span>{weatherInfo[key].label}</span></button>)}</div>
          <p className="settings-label">控えめに表示する天気</p>
          <div className="settings-quiet-options">{weatherOrder.map(key=><button key={key} className={quietWeathers.includes(key)?"active":""} aria-pressed={quietWeathers.includes(key)} onClick={()=>setQuietWeathers(items=>items.includes(key)?items.filter(item=>item!==key):[...items,key])}><span>{weatherInfo[key].symbol}</span>{weatherInfo[key].label}<i>{quietWeathers.includes(key)?"選択中":""}</i></button>)}</div>
        </section>
        <section className="settings-group"><header><strong>表示と動き</strong><small>疲れにくい見え方に調整する</small></header>
          <div className="settings-row"><span><strong>アニメーションを減らす</strong><small>天気と画面切り替えの動きを穏やかにします</small></span><SettingSwitch checked={reduceMotion} onChange={()=>setReduceMotion(v=>!v)} label="アニメーションを減らす"/></div>
        </section>
        <section className="settings-group"><header><strong>通知</strong><small>受け取りたい知らせを選ぶ</small></header>
          <div className="settings-row"><span><strong>フォロー中の新しい投稿</strong><small>投稿を天気別にまとめて知らせます</small></span><SettingSwitch checked={postNotifications} onChange={()=>setPostNotifications(v=>!v)} label="新しい投稿の通知"/></div>
          <div className="settings-row"><span><strong>あなたへの反応</strong><small>いいね・返信・リポスト・フォロー</small></span><SettingSwitch checked={reactionNotifications} onChange={()=>setReactionNotifications(v=>!v)} label="あなたへの反応の通知"/></div>
        </section>
        <section className="settings-group settings-safety"><header><strong>アカウントと安全</strong><small>公開範囲や見たくない相手を管理する</small></header><button onClick={()=>notify("公開範囲の設定")}>公開範囲 <span>›</span></button><button onClick={()=>notify("ミュート・ブロック")}>ミュート・ブロック <span>›</span></button><button onClick={()=>notify("ログアウト")}>ログアウト <span>›</span></button></section>
      </div>
    </div>}

    {view==="search"&&<div ref={searchPage} className={`discover-page reference-discover search-weather-bg ${categoryForecasts[category][trendDay]}`} onPointerDown={e=>{if(keyboardOpen&&!(e.target as HTMLElement).closest(".phone-keyboard,.discover-search"))setKeyboardOpen(false)}}>
      {!searchSubmitted&&<div className="discover-top"><label className="discover-search"><Search/><input value={query} onFocus={()=>setKeyboardOpen(true)} onChange={e=>{setQuery(e.target.value);setSearchSubmitted(false)}} onKeyDown={e=>{if(e.key==="Enter"&&query.trim()){setSearchSubmitted(true);setKeyboardOpen(false)}}} placeholder="検索"/></label><button className={`view-toggle ${mapMode?"map-on":"weather-on"}`} onClick={()=>{setSearchSubmitted(false);setKeyboardOpen(false);setMapMode(v=>!v)}} aria-label={mapMode?"天気予報へ切り替え":"天気マップへ切り替え"}><span>{mapMode?<i className="toggle-map-glyph"><Map/><MapPin/></i>:<i className="toggle-weather-glyph"><Sun/><Cloud/></i>}</span></button></div>}
      {searchSubmitted?<div className="search-timeline trend-detail"><header className="trend-detail-head"><button className="search-back" onClick={()=>setSearchSubmitted(false)} aria-label="検索画面へ戻る">‹</button><h1>{query.trim()}</h1><p>この話題について投稿された内容をまとめて表示しています。関連する反応や意見をタイムラインで確認できます。</p><nav><button className={trendSort==="top"?"active":""} onClick={()=>setTrendSort("top")}>トップ</button><button className={trendSort==="latest"?"active":""} onClick={()=>setTrendSort("latest")}>最新</button></nav></header>{(trendSort==="latest"?[...searchResults].reverse():searchResults).map((post,i)=><article className="sora-post region-post-in" style={{animationDelay:`${i*75}ms`}} key={`search-${post.id}`}><div className="post-head"><button className="account-link" onClick={()=>openAccount({name:post.name,handle:post.handle,avatar:post.avatar,weather:post.weather})}><span className={`photo-avatar generated-avatar avatar-${((post.id-1)%6)+1}`}/></button><div className="identity"><strong>{post.name}</strong><span>{post.handle}</span></div><time>{post.time}</time></div><p>{hasExactSearchResults?post.body:i===0?`${query.trim()}について、流れている情報をいくつか確認した。見出しだけでは分からない部分も多いので、元の発表や前後の内容まで読んでから判断したい。`:`${query.trim()}に関する投稿を見かけた。${post.body}`}</p>{postActions(post)}</article>)}</div>:<>{!mapMode&&<><div className="category-tabs" aria-label="ジャンルを選択">{categories.map(item=>{const itemWeather=categoryForecasts[item][trendDay];return <button key={item} className={category===item?"active":""} onClick={e=>{setCategory(item);const strip=e.currentTarget.parentElement;if(strip){const left=e.currentTarget.offsetLeft-(strip.clientWidth-e.currentTarget.offsetWidth)/2;strip.scrollTo({left:Math.max(0,left),behavior:"smooth"})}}} aria-label={`${item} ${weatherInfo[itemWeather].label}`}><span className={`category-weather-mark ${itemWeather}`} aria-hidden="true"><SearchWeatherMark weather={itemWeather}/></span><span>{item}</span></button>})}</div>
      <div className="reference-weather-strip" ref={forecastStrip} aria-label="日ごとの天気予報">
        {trendDays.map((date,i)=>{const w=categoryForecasts[category][i];return <button key={date.label} className={`${w} ${trendDay===i?"selected":""}`} onClick={()=>setTrendDay(i)} aria-label={`${date.label} ${weatherInfo[w].label}`}><SearchWeatherMark weather={w}/></button>})}
      </div>
      <strong className="reference-date">{trendDays[trendDay].label}({trendDays[trendDay].day})</strong>
      <div className="reference-dots">{trendDays.map((_,i)=><i key={i} className={trendDay===i?"active":""}/>)}</div>
      <div className="news-list">{dailyHeadlines.map((headline,i)=><button className="region-post-in" style={{animationDelay:`${i*85}ms`}} key={`${category}-${trendDay}-${i}`} onClick={()=>{setQuery(headline);setSearchSubmitted(true);setKeyboardOpen(false)}}>{headline}</button>)}</div>
      </>}
      {mapMode&&<RealMap notify={notify}/>}</>}
      {keyboardOpen&&!searchSubmitted&&<div className="phone-keyboard" aria-label="日本語キーボード"><div className="keyboard-keys">{["あ","か","さ","た","な","は","ま","や","ら","小","わ","ー"].map(key=><button key={key} onMouseDown={e=>e.preventDefault()} onClick={()=>setQuery(v=>v+key)}>{key}</button>)}</div><div className="keyboard-actions"><button onMouseDown={e=>e.preventDefault()} onClick={()=>setQuery(v=>v.slice(0,-1))}>⌫</button><button className="keyboard-space" onMouseDown={e=>e.preventDefault()} onClick={()=>setQuery(v=>v+" ")}>空白</button><button className="keyboard-search" disabled={!query.trim()} onMouseDown={e=>e.preventDefault()} onClick={()=>{if(query.trim()){setSearchSubmitted(true);setKeyboardOpen(false)}}}>検索</button></div></div>}
    </div>}

    {view==="profile"&&<div className="profile-page"><div className="profile-cover"/><div className="profile-main"><div className="profile-avatar"/><div className="profile-tools"><button aria-label="検索"><Search/></button><button aria-label="編集" onClick={()=>notify("プロフィール編集")}><Pencil fill="currentColor"/></button><button aria-label="ユーザーを追加" onClick={()=>setView("followAdd")}><UserPlus fill="currentColor"/></button></div><div className="profile-counts"><button onClick={()=>setView("following")}><strong>100</strong><span>フォロー中</span></button><button onClick={()=>setView("followers")}><strong>100</strong><span>フォロワー</span></button></div><h1>黄昏</h1><span className="profile-handle">@taso_gare</span><div className="profile-weather"><span><Sun fill="currentColor"/><strong>12%</strong></span><span><Cloud/><strong>10%</strong></span><span><CloudRain/><strong>61%</strong></span><span><Zap fill="currentColor"/><strong>27%</strong></span></div><p>どこまでも続く青空と、旅先で出会った美味しいコーヒーが好き。☕ 週末はカメラを片手に、各駅停車の旅に出ます。</p></div><div className="profile-feed">
      {quotePosts.map(quote=>{const quotedPost:Post={id:quote.id,weather:quote.original.weather,name:"黄昏",handle:"@taso_gare",avatar:"",time:"たった今",body:quote.body,replies:"0",reposts:"0",likes:"0",views:"1"};return <article className="profile-post quote-profile-post region-post-in" key={quote.id}><div className="post-head"><div className="profile-post-avatar"/><div className="identity"><strong>黄昏</strong><span>@taso_gare</span></div><time>たった今</time></div><p>{quote.body}</p><div className="quoted-post-card"><strong>{quote.original.name}</strong><span>{quote.original.handle}</span><p>{quote.original.body}</p></div>{postActions(quotedPost)}</article>})}
      {posts.filter(post=>reposted.includes(post.id)).map(post=><article className="profile-post repost-profile-post region-post-in" key={`repost-${post.id}`}><div className="reposted-by"><Repeat2/>黄昏さんがリポスト</div><div className="post-head"><div className={`photo-avatar generated-avatar avatar-${((post.id-1)%6)+1}`}/><div className="identity"><strong>{post.name}</strong><span>{post.handle}</span></div><time>{post.time}</time></div><p>{post.body}</p>{postActions(post)}</article>)}
      {ownProfilePosts.map((post,i)=><article className="profile-post region-post-in" style={{animationDelay:`${i*85}ms`}} key={post.id}><div className="post-head"><div className="profile-post-avatar"/><div className="identity"><strong>{post.name}</strong><span>{post.handle}</span></div><time>{post.time}</time></div><p>{post.body}</p>{postActions(post)}</article>)}</div></div>}

    {view==="userProfile"&&selectedAccount&&<div className="profile-page other-profile"><div className={`other-cover cover-${selectedCoverIndex}`}><button onClick={()=>setView(accountReturnView)} aria-label="前の画面へ戻る">‹</button><span className="other-cover-shade" aria-hidden="true"/></div><div className="other-profile-main"><div className={`other-avatar ${selectedAccount.avatarClass?`generated-avatar avatar-${selectedAccount.avatarClass}`:""}`}>{selectedAccount.avatarClass?"":selectedAccount.avatar}</div><button className="other-follow" onClick={()=>notify(`${selectedAccount.name}をフォローしました`)}>フォロー</button><h1>{selectedAccount.name}</h1><span>{selectedAccount.handle}</span><p>{weatherInfo[selectedAccount.weather].message}</p><div className="other-counts"><strong>86</strong> フォロー中　 <strong>428</strong> フォロワー</div></div><div className={`profile-feed timeline-area weather-bg account-weather-feed ${selectedAccount.weather}`}>{posts.filter(p=>p.weather===selectedAccount.weather).map(p=><article className="sora-post" key={p.id}><div className="post-head"><div className={`photo-avatar ${selectedAccount.avatarClass?`generated-avatar avatar-${selectedAccount.avatarClass}`:""}`}>{selectedAccount.avatarClass?"":selectedAccount.avatar}</div><div className="identity"><strong>{selectedAccount.name}</strong><span>{selectedAccount.handle}</span></div><time>{p.time}</time></div><p>{p.body}</p>{postActions(p)}</article>)}</div></div>}

    {view==="followAdd"&&<div className="follow-add-page">
      <header className="follow-add-head"><button onClick={()=>setView("profile")} aria-label="プロフィールへ戻る">‹</button><h1>フォロー</h1><button className="follow-all" aria-pressed={addedFollows.length===followAddAccounts.length} onClick={()=>{const allFollowed=addedFollows.length===followAddAccounts.length;setAddedFollows(allFollowed?[]:followAddAccounts.map((_,index)=>String(index)));notify(allFollowed?"一括フォローを解除しました":"おすすめを一括フォローしました")}}>{addedFollows.length===followAddAccounts.length?"解除":"一括フォロー"}</button></header>
      <div className="follow-add-intro"><strong>おすすめのアカウント</strong><span>興味のあるジャンルから見つけよう</span></div>
      <div className="follow-add-groups">{followAddGroups.map((group,groupIndex)=><section className="follow-add-group" key={group.label}><h2>{group.label}</h2><div className="follow-add-grid">{group.weathers.map((candidateWeather,itemIndex)=>{const accountIndex=groupIndex*4+itemIndex;const candidateId=String(accountIndex);const [candidateName,candidateHandle]=followAddAccounts[accountIndex];const avatarClass=(accountIndex%6)+1;const isAdded=addedFollows.includes(candidateId);return <button className={`follow-add-person ${isAdded?"followed":""}`} aria-label={`${candidateName}のプロフィールを開く`} onClick={()=>openAccount({name:candidateName,handle:candidateHandle,avatar:"",weather:candidateWeather,avatarClass},"followAdd")} key={candidateId}><span className={`follow-add-avatar generated-avatar avatar-${avatarClass}`}/><i className="follow-add-weather"><SearchWeatherMark weather={candidateWeather}/></i></button>})}</div></section>)}</div>
    </div>}

    {(view==="following"||view==="followers")&&<div className="sub-page followers-page follower-directory">
      <button className="follower-back" onClick={()=>setView("profile")} aria-label="プロフィールへ戻る">‹</button>
      <div className="follower-weather-summary" aria-label="フォロワーの天気傾向"><span><i className="follower-summary-weather"><SearchWeatherMark weather="sunny"/></i><b>12%</b></span><span><i className="follower-summary-weather"><SearchWeatherMark weather="cloudy"/></i><b>10%</b></span><span><i className="follower-summary-weather"><SearchWeatherMark weather="rainy"/></i><b>61%</b></span><span><i className="follower-summary-weather"><SearchWeatherMark weather="storm"/></i><b>27%</b></span></div>
      <nav className="follower-tabs"><button className={view==="followers"?"active":""} onClick={()=>setView("followers")}>フォロワー</button><button className={view==="following"?"active":""} onClick={()=>setView("following")}>フォロー</button></nav>
      <div className="follower-list">{followers.map((f,i)=>{const WeatherIcon=weatherInfo[f.weather].icon;return <div className="follower-card region-post-in" style={{animationDelay:`${i*70}ms`}} key={`${view}-${f.handle}`}><button className="follower-identity" onClick={()=>openAccount(f,view)}><span className={`follower-photo generated-avatar avatar-${(i%6)+1}`}><i className={`follower-weather-badge ${f.weather}`}><WeatherIcon fill={f.weather==="sunny"||f.weather==="storm"?"currentColor":"none"}/></i></span><span><strong>{f.name}</strong><small>{f.handle}</small></span></button><button className={`follow-pill ${view==="following"||i===3?"following":""}`} onClick={()=>notify(view==="following"||i===3?`${f.name}のフォローを解除しました`:`${f.name}をフォローしました`)}>{view==="following"||i===3?"フォロー中":"フォローする"}</button></div>})}</div>
    </div>}

    {view==="messages"&&<div className={`dm-page ${activeChat!==null?"chat-open":""}`}>
      <div className="dm-list-screen"><header className="dm-header"><h1>メッセージ</h1><button aria-label="新しいメッセージ" onClick={()=>notify("新しいメッセージ")}>＋</button></header><label className="dm-search"><Search/><input placeholder="メッセージを検索"/></label><div className="dm-list">{conversations.map((chat,i)=><button className="dm-row region-post-in" style={{animationDelay:`${i*85}ms`}} key={chat.handle} onClick={()=>setActiveChat(i)}><span className={`dm-avatar generated-avatar avatar-${chat.avatar}`}/><span className="dm-copy"><strong>{chat.name}</strong><small>{chat.handle}</small><p>{chat.preview}</p></span><time>{chat.time}</time></button>)}</div></div>
      {activeChat!==null&&<div className="dm-chat-screen"><header className="dm-chat-head"><button onClick={()=>setActiveChat(null)} aria-label="メッセージ一覧へ戻る">←</button><span className={`dm-avatar generated-avatar avatar-${conversations[activeChat].avatar}`}/><div><strong>{conversations[activeChat].name}</strong><small>{conversations[activeChat].handle}</small></div></header><div className="dm-thread">{conversations[activeChat].messages.map((message,i)=><p className={i%2===0?"mine":"theirs"} key={message}>{message}</p>)}{(sentMessages[activeChat]||[]).map((message,i)=><p className="mine" key={`sent-${i}`}>{message}</p>)}</div><form className="dm-compose" onSubmit={sendMessage}><input value={messageDraft} onChange={e=>setMessageDraft(e.target.value)} placeholder="メッセージを入力"/><button disabled={!messageDraft.trim()} aria-label="送信"><Send fill="currentColor"/></button></form></div>}
    </div>}

    {view!=="settings"&&<button className="new-post" aria-label="投稿を作成" onClick={()=>setComposer(true)}><MessageCircle fill="currentColor"/></button>}
    <nav className="main-nav"><button aria-label="タイムライン" className={view==="timeline"||view==="notifications"?"active":""} onClick={()=>{setKeyboardOpen(false);setView("timeline")}}><Home/></button><button aria-label="検索" className={view==="search"?"active":""} onClick={openSearchHome}><Search/></button><button aria-label="プロフィール" className={view==="profile"||view==="following"||view==="followers"||view==="followAdd"||view==="userProfile"?"active":""} onClick={()=>{setKeyboardOpen(false);setView("profile")}}><UserRound/></button><button aria-label="メッセージ" className={view==="messages"?"active":""} onClick={()=>{setKeyboardOpen(false);setActiveChat(null);setView("messages")}}><Mail/></button></nav>
    {showSplash&&<div className="app-splash" aria-label="アプリを起動中"><img src="/header-weather-transparent.png" alt=""/></div>}
  </section>

  {composer&&<div className="modal-shade"><form className="post-modal" onSubmit={submit}><header><button type="button" onClick={()=>setComposer(false)}><X/></button><strong>新しい投稿</strong><button disabled={!draft.trim()}>投稿</button></header><textarea autoFocus value={draft} onChange={e=>setDraft(e.target.value)} placeholder="いま、どうしていますか？" maxLength={240}/><div className="analysis-preview"><span>{info.symbol}</span><p>投稿後、AIが感情を分析して適切な天気に分類します。</p></div></form></div>}
  {repostMenuTarget&&<div className="repost-menu-shade" onClick={()=>setRepostMenuTarget(null)}><div className="repost-menu" role="menu" onClick={event=>event.stopPropagation()}><button role="menuitem" onClick={()=>{toggleRepost(repostMenuTarget);setRepostMenuTarget(null)}}><Repeat2/><span>{reposted.includes(repostMenuTarget.id)?"リポストを取り消す":"リポスト"}</span></button><button role="menuitem" onClick={()=>{setQuoteTarget(repostMenuTarget);setRepostMenuTarget(null)}}><Pencil/><span>引用</span></button><button className="repost-cancel" onClick={()=>setRepostMenuTarget(null)}>キャンセル</button></div></div>}
  {quoteTarget&&<div className="modal-shade"><form className="post-modal quote-modal" onSubmit={submitQuote}><header><button type="button" aria-label="閉じる" onClick={()=>{setQuoteTarget(null);setQuoteDraft("")}}><X/></button><strong>引用</strong><button disabled={!quoteDraft.trim()}>投稿</button></header><textarea autoFocus value={quoteDraft} onChange={event=>setQuoteDraft(event.target.value)} placeholder="コメントを追加" maxLength={240}/><div className="quoted-post-card quote-compose-card"><strong>{quoteTarget.name}</strong><span>{quoteTarget.handle}</span><p>{quoteTarget.body}</p></div></form></div>}
  {replyTarget&&<div className="modal-shade"><form className="post-modal reply-modal" onSubmit={submitReply}><header><button type="button" aria-label="閉じる" onClick={()=>{setReplyTarget(null);setReplyDraft("")}}><X/></button><strong>返信</strong><button disabled={!replyDraft.trim()}>送信</button></header><div className="reply-target"><strong>{replyTarget.name}</strong><span>{replyTarget.handle}</span><p>{replyTarget.body}</p></div><textarea autoFocus value={replyDraft} onChange={event=>setReplyDraft(event.target.value)} placeholder={`${replyTarget.name}さんへ返信`} maxLength={240}/></form></div>}
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
