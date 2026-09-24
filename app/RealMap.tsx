"use client";

import { ChartNoAxesColumnIncreasing, Heart, MessageCircle, Repeat2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { prefecturePosts } from "./prefecturePosts";

const areaTrendWeather=(name:string)=>{
  const trends=[{key:"sunny",label:"晴れ"},{key:"cloudy",label:"曇り"},{key:"rainy",label:"雨"},{key:"storm",label:"雷雨"}];
  const hash=[...name].reduce((sum,char)=>sum+(char.codePointAt(0)||0),0);
  return trends[hash%trends.length];
};

const mapWeatherSvg=(weather:string)=>{
  if(weather==="sunny")return '<img class="forecast-map-icon weather-sun" src="/weather-sun.png" alt="">';
  if(weather==="cloudy")return '<img class="forecast-map-icon weather-cloud" src="/weather-cloud.png" alt="">';
  if(weather==="rainy")return '<span class="forecast-map-icon weather-rain"><img class="rain-cloud-piece" src="/weather-rain-cloud.png" alt=""><img class="rain-drop-piece drop-one" src="/weather-rain-drop-one.png" alt=""><img class="rain-drop-piece drop-two" src="/weather-rain-drop-two.png" alt=""><img class="rain-drop-piece drop-three" src="/weather-rain-drop-three.png" alt=""></span>';
  return '<img class="forecast-map-icon weather-storm" src="/weather-storm.png" alt="">';
};

export function RealMap({notify}:{notify:(message:string)=>void}){
  const mapNode=useRef<HTMLDivElement>(null);
  const mapInstance=useRef<import("leaflet").Map|null>(null);
  const [area,setArea]=useState("日本");
  const [zoom,setZoom]=useState(5);

  useEffect(()=>{
    let active=true;
    import("leaflet").then(async L=>{
      if(!active||!mapNode.current||mapInstance.current)return;
      const map=L.map(mapNode.current,{
        zoomControl:true,minZoom:4,maxZoom:18,zoomSnap:.5,zoomDelta:1,
        wheelDebounceTime:10,wheelPxPerZoomLevel:42,inertia:true,
        inertiaDeceleration:2400,inertiaMaxSpeed:1200,easeLinearity:.18,
        zoomAnimation:true,fadeAnimation:true,markerZoomAnimation:true,
      }).setView([37.4,137.2],5);
      const boundary=await fetch("/japan-prefectures.geojson").then(response=>response.json());
      const japan=L.geoJSON(boundary,{
        style:{fillColor:"#c9e5c0",fillOpacity:1,color:"#ffffff",weight:.8},
        onEachFeature:(feature,layer)=>{
          layer.on("click",()=>{
            const name=feature?.properties?.nam_ja||"選択エリア";
            setArea(name);
            const bounds=(layer as {getBounds?:()=>import("leaflet").LatLngBounds}).getBounds?.();
            if(bounds) map.fitBounds(bounds,{padding:[22,22],animate:true,duration:.35,maxZoom:11});
          });
        },
      }).addTo(map);
      const trendMarkers:import("leaflet").Marker[]=[];
      japan.eachLayer(layer=>{
        const featureLayer=layer as import("leaflet").Layer&{feature?:{properties?:{nam_ja?:string}};getBounds?:()=>import("leaflet").LatLngBounds};
        const name=featureLayer.feature?.properties?.nam_ja||"";
        const bounds=featureLayer.getBounds?.();
        if(!name||!bounds)return;
        const trend=areaTrendWeather(name);
        const marker=L.marker(bounds.getCenter(),{
          interactive:false,
          opacity:0,
          icon:L.divIcon({className:"pref-weather-marker",html:`<span class="map-weather-icon ${trend.key}">${mapWeatherSvg(trend.key)}</span>`,iconSize:[28,28],iconAnchor:[14,14]}),
        }).addTo(map);
        trendMarkers.push(marker);
      });
      map.fitBounds(japan.getBounds(),{padding:[18,18],animate:false});
      map.on("moveend zoomend",()=>{
        const z=map.getZoom(); setZoom(z);
        const visibleBounds=map.getBounds().pad(-.08);
        trendMarkers.forEach(marker=>marker.setOpacity(z>=7&&visibleBounds.contains(marker.getLatLng())?1:0));
        if(z<=5)setArea("日本");
      });
      mapInstance.current=map;
    });
    return()=>{active=false;mapInstance.current?.remove();mapInstance.current=null};
  },[]);

  const areaNotes=prefecturePosts[area]||prefecturePosts["日本"];
  const areaTrend=areaTrendWeather(area);
  const variedBodies=[
    areaNotes[0].split("。")[0]+"。",
    `${areaNotes[1]} しばらくその場にいたけど、時間がゆっくり流れている感じがしてよかった。`,
    areaNotes[2],
    `${areaNotes[3]} 予定にはなかった寄り道だったけど、こういう偶然があるから歩くのは楽しい。次に${area}へ来たときも、また寄ってみたい。`,
    `${areaNotes[4]} 写真に残すより、その場で見ていた時間のほうが長かった。`,
    `${areaNotes[5]} 帰ってから写真を見返したら、現地では気づかなかったものまで写っていた。今度は急がず、もう少しゆっくり歩いてみようと思う。${area}でおすすめの場所があったら知りたい。`,
  ];
  const regionalPosts=[
    {avatar:"🚃",name:"途中下車の記録",handle:"@yorimichi_train",time:"8分前",body:variedBodies[0]},
    {avatar:"☕",name:"町の喫茶店",handle:"@kissaten_note",time:"21分前",body:variedBodies[1]},
    {avatar:"📷",name:"きょうの路地",handle:"@roji_snap",time:"46分前",body:variedBodies[2]},
    {avatar:"🥐",name:"朝ごはん部",handle:"@asa_pan_log",time:"1時間前",body:variedBodies[3]},
    {avatar:"🐕",name:"柴犬こむぎ",handle:"@komugi_walk",time:"2時間前",body:variedBodies[4]},
    {avatar:"🎧",name:"帰り道プレイリスト",handle:"@walk_and_music",time:"3時間前",body:variedBodies[5]},
  ];
  const displayedPosts=regionalPosts;
  const engagement=[
    {replies:"3",reposts:"1",likes:"42",views:"386"},
    {replies:"0",reposts:"4",likes:"118",views:"742"},
    {replies:"7",reposts:"2",likes:"76",views:"519"},
    {replies:"2",reposts:"0",likes:"31",views:"204"},
    {replies:"11",reposts:"6",likes:"163",views:"891"},
    {replies:"1",reposts:"3",likes:"59",views:"427"},
  ];
  return <div className="real-map-view">
    <div className="live-area-title"><strong>{area}</strong><span>4月17日　投稿傾向 {areaTrend.label}</span></div>
    <div className="leaflet-map-shell"><div className="leaflet-map" ref={mapNode}/></div>
    <div className="map-scale-note">ズーム {zoom} — 天気は表示範囲の投稿全体の感情傾向です</div>
    <div className="region-feed" key={area}><div className="region-feed-title"><strong>{area}の投稿</strong><span>{displayedPosts.length}件を表示</span></div>{displayedPosts.map((post,index)=>{const counts=engagement[index];return <article className="sora-post region-post-in" style={{animationDelay:`${index*85}ms`}} key={`${area}-${post.handle}`}><div className="post-head"><div className={`photo-avatar generated-avatar avatar-${(index%6)+1}`}/><div className="identity"><strong>{post.name}</strong><span>{post.handle}</span></div><time>{post.time}</time></div><p>{post.body}</p><div className="metric-row"><button onClick={()=>notify("返信") }><MessageCircle/><span>{counts.replies}</span></button><button onClick={()=>notify("リポストしました")}><Repeat2/><span>{counts.reposts}</span></button><button onClick={()=>notify("いいねしました")}><Heart/><span>{counts.likes}</span></button><button><ChartNoAxesColumnIncreasing/><span>{counts.views}</span></button><button onClick={()=>notify("共有メニューを開きました")}><Upload/></button></div></article>})}</div>
  </div>;
}
