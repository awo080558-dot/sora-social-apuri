"use client";

import {
  Bell, Bookmark, ChevronLeft, Cloud, CloudRain, Heart, Home,
  Image as ImageIcon, Mail, MapPin, MessageCircle, MoreHorizontal,
  Plus, Search, Send, Settings, Share2, Sun, UserRound, X, Zap
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type Tab = "home" | "search" | "profile" | "messages";
type Weather = "sunny" | "cloudy" | "rainy" | "storm";
type Post = {
  id: number; name: string; handle: string; time: string; avatar: string;
  body: string; weather: Weather; likes: number; replies: number; reposts: number;
  liked?: boolean; location?: string; photo?: string;
};

const weatherMeta = {
  sunny: { label: "晴れ", icon: Sun, accent: "#f6b91c" },
  cloudy: { label: "くもり", icon: Cloud, accent: "#78909c" },
  rainy: { label: "雨", icon: CloudRain, accent: "#4a79ef" },
  storm: { label: "雷", icon: Zap, accent: "#7656de" },
};

const initialPosts: Post[] = [
  { id: 1, name: "夜空かしの翁", handle: "@digi_walker_01", time: "5分前", avatar: "夜", weather: "sunny", likes: 36300, replies: 3100, reposts: 11200, location: "東京都 渋谷区", body: "公式からの発表の『重大発表』の文字を見た瞬間、心臓がロケットみたいに高鳴った。主人公が走り出す次のシーンまで、空を見ながら待つ。" },
  { id: 2, name: "デジタル・ノマド", handle: "@digi_noma_2", time: "8分前", avatar: "旅", weather: "cloudy", likes: 9700, replies: 1300, reposts: 2100, body: "東京のおじいちゃん（82歳）がスマホデビュー。最初の投稿は『今日の雲は犬に見える』でした。こういう小さな発見を共有できるの、なんだかいいな。" },
  { id: 3, name: "ハナコ＠旅事情", handle: "@flower_book_log", time: "12分前", avatar: "花", weather: "rainy", likes: 15800, replies: 880, reposts: 3400, location: "神奈川県 鎌倉市", body: "雨上がりの鎌倉。濡れた石畳が空を映していて、街全体が大きな水たまりみたい。遠回りして帰ろう。", photo: "rain" },
  { id: 4, name: "そら日和", handle: "@sora_biyori", time: "21分前", avatar: "空", weather: "storm", likes: 4200, replies: 560, reposts: 920, body: "遠くで雷の音。窓辺でコーヒーを淹れて、静かに雨雲が通り過ぎるのを待っています。" },
];

function compact(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("home");
  const [weather, setWeather] = useState<Weather>("sunny");
  const [posts, setPosts] = useState(initialPosts);
  const [composer, setComposer] = useState(false);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  const visiblePosts = useMemo(() => posts.filter((post) => {
    const matchesWeather = weather === post.weather;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || `${post.name} ${post.handle} ${post.body}`.toLowerCase().includes(q);
    return tab === "search" ? matchesQuery : matchesWeather;
  }), [posts, query, tab, weather]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const toggleLike = (id: number) => setPosts((current) => current.map((post) => post.id === id
    ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }
    : post));

  const submitPost = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setPosts((current) => [{ id: Date.now(), name: "中澤 颯", handle: "@hayate_sora", time: "たった今", avatar: "颯", weather, likes: 0, replies: 0, reposts: 0, body: draft.trim(), location: "東京都" }, ...current]);
    setDraft(""); setComposer(false); setTab("home"); notify("空に投稿しました");
  };

  return (
    <main className={`app weather-${weather}`}>
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <section className="phone-shell" aria-label="SORA social app">
        <header className="topbar">
          <button className="icon-button" aria-label="通知" onClick={() => notify("新しい通知はありません")}><Bell size={21} /></button>
          <button className="brand" onClick={() => setTab("home")} aria-label="ホームへ"><span className="brand-mark">S</span><span>SORA</span></button>
          <button className="icon-button" aria-label="設定" onClick={() => notify("設定は準備中です")}><Settings size={21} /></button>
        </header>

        {tab === "home" && <>
          <div className="weather-strip" role="tablist" aria-label="天気で絞り込み">
            {(Object.keys(weatherMeta) as Weather[]).map((key) => {
              const ItemIcon = weatherMeta[key].icon;
              return <button key={key} className={weather === key ? "active" : ""} onClick={() => setWeather(key)} role="tab" aria-selected={weather === key} style={{ "--accent": weatherMeta[key].accent } as React.CSSProperties}><ItemIcon /><span>{weatherMeta[key].label}</span></button>;
            })}
          </div>
          <div className="weather-summary">
            <div><p>東京の空</p><strong>{weatherMeta[weather].label}の投稿</strong></div>
            <span>{visiblePosts.length} stories</span>
          </div>
        </>}

        {tab === "search" && <div className="page-head search-head"><h1>見つける</h1><label><Search size={19} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="人や空の話題を検索" /></label></div>}
        {tab === "messages" && <Messages />}
        {tab === "profile" && <Profile posts={posts} />}

        {(tab === "home" || tab === "search") && <div className="feed">
          {visiblePosts.length ? visiblePosts.map((post) => <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} onNotify={notify} />) : <div className="empty"><Cloud size={42} /><strong>まだ投稿がありません</strong><p>別の天気をのぞいてみましょう。</p></div>}
        </div>}

        <button className="compose-fab" onClick={() => setComposer(true)} aria-label="新規投稿"><Plus size={26} /></button>
        <nav className="bottom-nav" aria-label="メインナビゲーション">
          <NavButton active={tab === "home"} label="ホーム" icon={Home} onClick={() => setTab("home")} />
          <NavButton active={tab === "search"} label="検索" icon={Search} onClick={() => setTab("search")} />
          <NavButton active={tab === "profile"} label="プロフィール" icon={UserRound} onClick={() => setTab("profile")} />
          <NavButton active={tab === "messages"} label="メッセージ" icon={Mail} onClick={() => setTab("messages")} badge />
        </nav>
      </section>

      {composer && <div className="modal-backdrop" onMouseDown={() => setComposer(false)}><form className="composer" onSubmit={submitPost} onMouseDown={(e) => e.stopPropagation()}>
        <div className="composer-head"><button type="button" onClick={() => setComposer(false)}><X /></button><strong>空に投稿</strong><button className="post-button" disabled={!draft.trim()}>投稿する</button></div>
        <div className="composer-body"><div className="avatar avatar-self">颯</div><textarea autoFocus maxLength={240} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="いま、どんな空を見ていますか？" /></div>
        <div className="composer-tools"><button type="button" onClick={() => notify("写真選択はデモです")}><ImageIcon /> 写真</button><button type="button"><MapPin /> 東京</button><span>{draft.length}/240</span></div>
      </form></div>}
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

function PostCard({ post, onLike, onNotify }: { post: Post; onLike: () => void; onNotify: (s: string) => void }) {
  const WIcon = weatherMeta[post.weather].icon;
  return <article className="post-card">
    <div className={`avatar avatar-${post.id % 4}`}>{post.avatar}</div>
    <div className="post-main">
      <div className="post-meta"><div><strong>{post.name}</strong><span>{post.handle}</span></div><span className="time"><WIcon size={14} />{post.time}</span><button aria-label="その他"><MoreHorizontal size={18} /></button></div>
      {post.location && <span className="location"><MapPin size={12} />{post.location}</span>}
      <p className="post-text">{post.body}</p>
      {post.photo && <div className="sky-photo"><span>雨上がり、午後5:42</span></div>}
      <div className="post-actions">
        <button onClick={() => onNotify("返信画面は次の版で追加します")}><MessageCircle /> <span>{compact(post.replies)}</span></button>
        <button onClick={() => onNotify("リポストしました")}><Share2 /> <span>{compact(post.reposts)}</span></button>
        <button className={post.liked ? "liked" : ""} onClick={onLike}><Heart fill={post.liked ? "currentColor" : "none"} /> <span>{compact(post.likes)}</span></button>
        <button className="bookmark" onClick={() => onNotify("保存しました")}><Bookmark /></button>
      </div>
    </div>
  </article>;
}

function NavButton({ active, label, icon: Icon, onClick, badge }: { active: boolean; label: string; icon: typeof Home; onClick: () => void; badge?: boolean }) {
  return <button className={active ? "active" : ""} onClick={onClick} aria-label={label}><span className="nav-icon"><Icon />{badge && <i />}</span><small>{label}</small></button>;
}

function Profile({ posts }: { posts: Post[] }) {
  return <div className="profile-page"><div className="profile-cover"><div className="cover-sun" /></div><div className="profile-info"><div className="avatar profile-avatar">颯</div><button>プロフィールを編集</button><h1>中澤 颯</h1><p className="handle">@hayate_sora</p><p>デザインと、空と、散歩。<br />毎日の小さな発見を集めています。</p><div className="profile-location"><MapPin size={14} /> 東京</div><div className="stats"><span><strong>128</strong> フォロー</span><span><strong>2,481</strong> フォロワー</span></div></div><div className="profile-tabs"><button className="active">投稿</button><button>メディア</button><button>いいね</button></div><div className="mini-post"><div className="avatar avatar-self">颯</div><div><strong>中澤 颯</strong><span> たった今</span><p>{posts[0]?.body}</p></div></div></div>;
}

function Messages() {
  const people = [{n:"山田 あかり", m:"夕焼けすごかったね！", a:"朱", t:"2分"},{n:"sora",m:"写真を送信しました",a:"空",t:"1時間"},{n:"旅するケン",m:"今度その場所教えて",a:"旅",t:"昨日"}];
  return <div className="messages-page"><div className="page-head message-title"><h1>メッセージ</h1><button><Plus /></button></div><label className="message-search"><Search /><input placeholder="メッセージを検索" /></label><div className="message-list">{people.map((p,i)=><button key={p.n}><div className={`avatar avatar-${i}`}>{p.a}</div><div><strong>{p.n}</strong><p>{p.m}</p></div><time>{p.t}</time><ChevronLeft className="chevron" /></button>)}</div></div>;
}
