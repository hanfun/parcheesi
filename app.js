import {createMatch,activeColor,coordinate,legalMoves,roll,move,rollFair,COLOR_NAMES} from './assets/game-engine.js';
import {gameAudio} from './assets/game-audio.js';
/** Cờ Cá Ngựa • HTML UI Prototype
 * No Firebase, real account, wallet transaction, or game engine is implemented here.
 * All state is local to this browser and is for visual review only.
 */
const STORAGE = 'cocangua-ui-demo-v1';
const colors = {blue:'#66B8FA',green:'#77CEA5',red:'#FF848F',yellow:'#FFD06B'};
const modes = {basic:'Cơ bản',fun:'Vui nhộn'};
const gameMaps = [
  {id:'garden',name:'Vườn Ngựa Con',subtitle:'Bản đồ truyền thống, nhẹ nhàng',emoji:'🌿',mode:'basic'},
  {id:'forest',name:'Rừng Cổ Tích',subtitle:'Cỏ xanh, vườn hoa và lâu đài',emoji:'🌳',mode:'basic'},
  {id:'candy',name:'Lễ Hội Kẹo Ngọt',subtitle:'Ô may mắn và bẫy vui nhộn',emoji:'🍭',mode:'fun'},
  {id:'magic',name:'Vương Quốc Phép Thuật',subtitle:'Bất ngờ ở mỗi lượt chơi',emoji:'✨',mode:'fun'},
  {id:'cloud',name:'Đảo Mây Bồng Bềnh',subtitle:'Tăng tốc, dịch chuyển, may mắn',emoji:'☁️',mode:'fun'},
  {id:'flowers',name:'Vườn Hoa Bí Mật',subtitle:'Chibi pastel, nhiệm vụ kỳ diệu',emoji:'🌸',mode:'fun'},
];
const starterRooms = [
  {id:'ABC2K',name:'Chém Gió Thần Tốc',owner:'Mina',mode:'fun',count:2,max:4,stake:100,locked:true,map:'candy',status:'waiting'},
  {id:'TAY69',name:'Anh Em Tây Ninh',owner:'TuanIT',mode:'basic',count:3,max:4,stake:50,locked:false,map:'garden',status:'waiting'},
  {id:'NGA28',name:'Gia Đình Vui Vẻ',owner:'Candy',mode:'fun',count:1,max:4,stake:0,locked:false,map:'flowers',status:'waiting'},
  {id:'PRO88',name:'Cờ Cá Ngựa Pro',owner:'HorsePro',mode:'basic',count:4,max:4,stake:200,locked:true,map:'forest',status:'playing'},
  {id:'HELLO',name:'Tân Thủ Giao Lưu',owner:'Bunny',mode:'basic',count:2,max:3,stake:0,locked:false,map:'garden',status:'waiting'},
];
const leaderboard = [
  {name:'HorseMaster',score:12540,win:68,avatar:'👩🏻',lv:14},
  {name:'TuanIT',score:10680,win:64,avatar:'👨🏻',lv:13},
  {name:'MinaCute',score:9870,win:61,avatar:'👧🏻',lv:12},
  {name:'GameProVN',score:8960,win:58,avatar:'🧑🏻',lv:12},
  {name:'MeoMeo',score:8420,win:54,avatar:'🐱',lv:11},
  {name:'LongK',score:7890,win:52,avatar:'😎',lv:10},
  {name:'Cherry',score:7260,win:49,avatar:'👩🏼',lv:10},
];
const defaultState = {
 view:'home',authTab:'login',signedIn:false,name:'HorseMaster',avatar:'',score:2450,
 currentRoom:null,roomFilter:'all',query:'',rankFilter:'score',mode:'basic',map:'garden',
 create:{name:'Phòng Của Tôi',password:'',mode:'basic',max:4,stake:100,time:30,reward:'50-30-20-0',map:'garden'},
 skin:'funny',lobbyReady:false,live:false,dice:1,diceRolls:0,skillUsed:false,dialog:null,
 gamePreviewMode:'basic', localRooms:[]
};
const app=document.querySelector('#app');
let state={...defaultState};
let localMatch=null,gameBusy=false,gameEpoch=0;
try { const v=JSON.parse(localStorage.getItem(STORAGE)||'{}'); state={...state,...v,create:{...defaultState.create,...(v.create||{})},view:'home',currentRoom:null,live:false,lobbyReady:false}; }catch{}
function save(){
  const {name,avatar,score,signedIn,skin,mode,map,create,localRooms,gamePreviewMode}=state;
  // Never persist passwords or authentication claims: sign-in is only a transient demo session.
  const safeCreate={...create,password:''};
  localStorage.setItem(STORAGE,JSON.stringify({name,avatar,score,skin,mode,map,create:safeCreate,localRooms:localRooms.map(({password,...r})=>r),gamePreviewMode}));
}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n||0).toLocaleString('vi-VN');
const horseArtSrc=color=>({blue:'./assets/design/horse-blue.webp',red:'./assets/design/horse-red.webp',green:'./assets/design/horse-green.webp',yellow:'./assets/design/horse-yellow.webp'})[color]||'./assets/design/horse-blue.webp';
const renderAvatar=(v=state.name,size='')=>{
  const image=(v===state.name&&state.avatar)?`<img src="${state.avatar}" alt="Ảnh đại diện" />`:'';
  const face=String(v||'?').charAt(0).toUpperCase();
  return `<span class="avatar ${size}" aria-label="Avatar ${esc(v)}">${image||esc(face)}</span>`;
};
function horseSVG(color='blue',face='smile'){
 const fill=colors[color]||colors.blue;
 return `<svg class="horse-art" viewBox="0 0 250 264" role="img" aria-label="Ngựa con 3D chibi ${esc(color)}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="horseFill-${color}" x1=".2" y1=".1" x2=".9" y2="1"><stop stop-color="#ffffff" stop-opacity=".8"/><stop offset=".45" stop-color="${fill}"/><stop offset="1" stop-color="${fill}"/></linearGradient><linearGradient id="horseShine-${color}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#e8d9ee"/></linearGradient><filter id="horseShadow-${color}" x="-40%" width="180%" y="-40%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>
  <ellipse cx="123" cy="236" rx="90" ry="16" fill="#617aa6" opacity=".22" filter="url(#horseShadow-${color})"/>
  <path d="M177 160 Q235 125 212 106" fill="none" stroke="${fill}" stroke-width="20" stroke-linecap="round"/>
  <ellipse cx="132" cy="172" rx="68" ry="57" fill="url(#horseFill-${color})" stroke="#ffffff" stroke-width="5"/>
  <rect x="76" y="201" width="31" height="35" rx="14" fill="${fill}" stroke="#fff" stroke-width="4"/><rect x="152" y="202" width="31" height="35" rx="14" fill="${fill}" stroke="#fff" stroke-width="4"/>
  <path d="M86 84 Q69 33 96 35 Q126 35 123 81" fill="${fill}" stroke="#fff" stroke-width="5"/><path d="M158 75 Q155 28 181 33 Q202 46 177 92" fill="${fill}" stroke="#fff" stroke-width="5"/>
  <path d="M98 50L105 74L96 75Z M175 48L167 74L178 75Z" fill="#f6adbd"/>
  <path d="M85 90 Q65 120 81 158 Q65 132 55 112 Q53 100 67 80Z" fill="${fill}"/>
  <ellipse cx="137" cy="111" rx="72" ry="73" fill="url(#horseFill-${color})" stroke="white" stroke-width="6"/>
  <path d="M85 84 Q82 60 105 52 Q123 40 140 47 Q112 50 104 73" fill="#fff" opacity=".55"/>
  <ellipse cx="107" cy="115" rx="12" ry="17" fill="#37416a"/><ellipse cx="167" cy="115" rx="12" ry="17" fill="#37416a"/><circle cx="111" cy="109" r="5" fill="#fff"/><circle cx="171" cy="109" r="5" fill="#fff"/>
  <ellipse cx="97" cy="145" rx="14" ry="8" fill="#ff9bb1" opacity=".9"/><ellipse cx="180" cy="145" rx="14" ry="8" fill="#ff9bb1" opacity=".9"/>
  <ellipse cx="141" cy="150" rx="35" ry="26" fill="url(#horseShine-${color})" stroke="#fff" stroke-width="3"/>
  <circle cx="130" cy="145" r="3" fill="#916978"/><circle cx="155" cy="145" r="3" fill="#916978"/>
  ${face==='smile'?'<path d="M129 157 Q142 172 157 157" fill="none" stroke="#a66e86" stroke-width="4" stroke-linecap="round"/>':'<path d="M133 165 Q145 154 157 165" fill="none" stroke="#a66e86" stroke-width="4" stroke-linecap="round"/>'}
  <circle cx="124" cy="184" r="15" fill="#fff9"/><path d="M124 173l4 7 8 1-6 6 2 9-8-4-8 4 2-9-6-6 8-1z" fill="#fbc76c" />
 </svg>`;
}
function horseToken(color='blue',username=state.name){
 const src=state.avatar&&username===state.name?`<img src="${state.avatar}" alt=""/>`:`<span>${esc((username||'H').slice(0,1).toUpperCase())}</span>`;
 return `<div class="horse-token" style="--token-color:${colors[color]};position:relative;width:100%;max-width:95px;margin:auto">${horseSVG(color)}<span class="horse-face" style="position:absolute;left:42%;top:31%;width:25%;aspect-ratio:1;border:2px solid white;border-radius:50%;background:#fff5e7;display:grid;place-items:center;overflow:hidden;box-shadow:0 2px 5px #6c729944;font-size:13px;font-weight:900;color:#745489">${src}</span></div>`;
}
function mapSquares(mapId='garden', inGame=false){
 const type=gameMaps.find(x=>x.id===mapId)?.mode||'basic';
 const items=[];
 for(let r=0;r<15;r++){for(let c=0;c<15;c++){
   let cls='square ',symbol='';
   if(r<6&&c<6){cls+='home-blue';if(!inGame&&(r===2||r===4)&&(c===2||c===4))symbol='🐴';}
   else if(r<6&&c>8){cls+='home-green';if(!inGame&&(r===2||r===4)&&(c===10||c===12))symbol='🐴';}
   else if(r>8&&c<6){cls+='home-red';if(!inGame&&(r===10||r===12)&&(c===2||c===4))symbol='🐴';}
   else if(r>8&&c>8){cls+='home-yellow';if(!inGame&&(r===10||r===12)&&(c===10||c===12))symbol='🐴';}
   else if(r>=6&&r<=8&&c>=6&&c<=8){cls+='center';symbol=(r===7&&c===7)?'🏆':'';}
   else {
     cls+='path';
     if(c===7&&r<6)cls+=' lane-blue';
     if(c===7&&r>8)cls+=' lane-yellow';
     if(r===7&&c<6)cls+=' lane-red';
     if(r===7&&c>8)cls+=' lane-green';
     if(type==='fun'){
       const tile={"0,7":['🍀','green-special'],"6,1":['💣','bomb'],"8,3":['⭐','lucky'],"3,8":['🚀','boost'],"6,12":['💥','bomb'],"8,11":['❓','fun-special'],"13,8":['🍀','green-special'],"7,13":['⭐','lucky'],"1,6":['🎁','fun-special'],"12,6":['💫','boost']}[`${r},${c}`];
       if(tile){symbol=tile[0];cls+=' '+tile[1]+' tile';}
     }
   }
   items.push(`<div class="${cls}" data-cell="${r}-${c}">${symbol?`<span class="token" aria-hidden="true">${symbol}</span>`:''}</div>`);
 }}
 const horses=inGame&&!localMatch?`<div class="board-overlay" aria-hidden="true">${[
  ['blue',state.name,'Góc xanh','🟦'],
  ['green','MinaCute','Góc xanh lá','🟩'],
  ['red','TuanIT','Góc đỏ','🟥'],
  ['yellow','Cherry','Góc vàng','🟨'],
 ].map(([color,player,name,emoji])=>`<div class="stable stable-${color}"><div class="stable-heading"><span>${emoji} ${esc(name)}</span></div><div class="stable-horses">${Array.from({length:4},()=>`<div class="board-pony">${horseToken(color,player)}</div>`).join('')}</div><span class="stable-flag">${({blue:'⚑',green:'⚑',red:'⚑',yellow:'⚑'})[color]}</span></div>`).join('')}<div class="goal-plinth"><span>🏆</span><small>ĐÍCH</small></div></div>`:'';
 return `<div class="map-preview ${inGame?'map-live':''}" role="img" aria-label="Bàn Cờ Cá Ngựa minh họa ${esc(type)} gồm bốn màu">${items.join('')}${horses}</div>`;
}
function header(){
 const titles={home:'Vương quốc ngựa con',auth:'Tài khoản',rooms:'Danh sách phòng',create:'Tạo phòng mới',maps:'Chọn bản đồ',profile:'Hồ sơ của bạn',ranking:'Bảng xếp hạng',lobby:'Phòng chờ',game:'Đang chơi'};
 return `<header class="topbar"><div class="topbar-title"><div class="eyebrow">🌈 Vương quốc ngựa con</div><h1>${titles[state.view]||'Cờ Cá Ngựa'}</h1></div><div class="top-actions"><span class="demo-label">Bản mẫu UI</span><span class="pill">⭐ ${fmt(state.score)}</span><button type="button" class="user-pill" data-nav="profile" aria-label="Xem hồ sơ">${renderAvatar()}<span>${esc(state.name)}</span></button></div></header>`;
}
const navItems=[['home','🏡','Trang chủ'],['rooms','🎮','Tìm phòng'],['create','✨','Tạo phòng'],['maps','🗺️','Bản đồ'],['ranking','🏆','Xếp hạng'],['profile','👤','Hồ sơ']];
function sidebar(){return `<aside class="sidebar"><a href="#home" class="logo" data-nav="home"><span class="logo-horse">🐴</span><span class="logo-text">Cờ Cá Ngựa<small>Chibi Wonderland</small></span></a><nav class="nav-list" aria-label="Điều hướng chính">${navItems.map(([id,icon,title])=>`<button type="button" data-nav="${id}" class="nav-item ${state.view===id?'active':''}"><span class="nav-icon">${icon}</span>${title}</button>`).join('')}</nav><div class="sidebar-foot"><span class="tag green">🌼 Khu vườn ngựa con</span><p>Thiết kế chibi 3D • Chưa kết nối tài khoản, ví điểm hay Firebase.</p></div></aside>`;}
function bottomNav(){return `<nav class="bottom-nav" aria-label="Điều hướng điện thoại">${[['home','🏡','Trang chủ'],['rooms','🎮','Phòng'],['create','➕','Tạo'],['ranking','🏆','Top'],['profile','👤','Hồ sơ']].map(([id,icon,title])=>`<button type="button" data-nav="${id}" class="${state.view===id?'active':''}"><span>${icon}</span>${title}</button>`).join('')}</nav>`;}
function notice(){return `<div class="notice">🧩 <span><strong>Prototype giao diện:</strong> Dữ liệu phòng, đăng nhập, điểm và xúc xắc chỉ mô phỏng trên trình duyệt; chưa tạo tài khoản thật hay giao dịch điểm.</span></div>`;}
function home(){
 return `<section class="story-home">
   <div class="story-hero-art"><img src="./assets/design/home-scene.webp" alt="Vương quốc ngựa con với các nhân vật chibi 3D, bé cưỡi ngựa và lâu đài" /></div>
   <div class="story-home-content"><span class="storybook-kicker">🌼 THẾ GIỚI NGỰA CON ĐANG CHỜ BẠN</span>
     <h2>Chơi vui cùng <span>bạn bè!</span></h2>
     <p>Chọn một trong hai bản đồ chibi thật đáng yêu và bắt đầu cuộc phiêu lưu của bốn đội ngựa.</p>
     <div class="story-actions"><button class="btn btn-primary btn-lg" data-action="preview-basic">🎮 Chơi ngay</button>
       <div class="story-button-row"><button class="btn btn-blue" data-nav="create">✚ Tạo phòng</button><button class="btn btn-violet" data-nav="rooms">🚪 Vào phòng</button></div></div>
     <p class="story-demo-note">✨ Xem trước giao diện game — không cần đăng nhập</p>
   </div>
 </section>
 <section class="story-shortcuts"><button data-action="preview-fun"><span class="shortcut-icon">🎭</span><b>Bản đồ vui nhộn</b><small>Skill và ô bất ngờ</small></button><button data-nav="maps"><span class="shortcut-icon">🗺️</span><b>Chọn bản đồ</b><small>Khu vườn cổ tích</small></button><button data-nav="ranking"><span class="shortcut-icon">🏆</span><b>Bảng xếp hạng</b><small>Hội ngựa con</small></button><button data-nav="profile"><span class="shortcut-icon">🦄</span><b>Avatar của tôi</b><small>Ghép mặt lên ngựa</small></button></section>
 <section class="mode-showcase"><div class="section-heading"><div><h2>🗺️ Hai thế giới ngựa con</h2><p>Hình ảnh từ bản thiết kế bạn đã duyệt</p></div></div><div class="showcase-grid"><button class="showcase-board" data-action="preview-basic"><img src="./assets/design/board-classic.webp" alt="Bản đồ cờ cá ngựa cơ bản 3D chibi với 4 chuồng đỏ, xanh, xanh lá, vàng"/><span>🎲 Chế độ thường</span><small>Chơi theo luật truyền thống</small></button><button class="showcase-board" data-action="preview-fun"><img src="./assets/design/board-fun.webp" alt="Bản đồ cờ cá ngựa vui nhộn 3D chibi có ô bẫy và may mắn"/><span>✨ Chế độ vui nhộn</span><small>Bẫy, may mắn và kỹ năng</small></button></div></section>`;
}
function auth(){
 return `<div class="storybook-auth"><div class="storybook-auth-art"><img src="./assets/design/auth-scene.webp" alt="Bé gái và chú ngựa hồng chibi trong vườn cổ tích"/><div class="art-caption">🌈 Chào mừng đến vương quốc ngựa con!</div></div>
 <div class="card auth-form"><div class="auth-tabs"><button class="auth-tab ${state.authTab==='login'?'active':''}" data-auth-tab="login">Đăng nhập</button><button class="auth-tab ${state.authTab==='register'?'active':''}" data-auth-tab="register">Tạo tài khoản</button></div>
 <h2>${state.authTab==='login'?'Cùng nhau chơi nhé!':'✨ Tạo tài khoản'}</h2><p class="muted small">Giao diện demo, chưa tạo tài khoản hay lưu mật khẩu.</p>
 <form id="auth-form" class="stack">${state.authTab==='register'?`<div class="field"><label for="name-auth">👤 Tên người chơi</label><input required minlength="2" maxlength="24" id="name-auth" name="displayName" autocomplete="nickname" placeholder="Ngựa Con Vui Vẻ"/></div>`:''}
 <div class="field"><label for="email-auth">✉️ Email</label><input required type="email" id="email-auth" name="email" autocomplete="email" placeholder="ban@example.com"/></div>
 <div class="field"><label for="password-auth">🔐 Mật khẩu</label><input required minlength="6" type="password" id="password-auth" name="password" autocomplete="${state.authTab==='login'?'current-password':'new-password'}" placeholder="Ít nhất 6 ký tự"/></div>
 ${state.authTab==='register'?`<div class="field"><label for="confirm-auth">🔐 Nhập lại mật khẩu</label><input required minlength="6" type="password" id="confirm-auth" name="confirm" autocomplete="new-password" placeholder="Nhập lại mật khẩu"/></div>`:''}
 <button class="btn btn-primary btn-full btn-lg" type="submit">${state.authTab==='login'?'🔓 Đăng nhập demo ➜':'✨ Đăng ký demo ➜'}</button></form><button class="google-btn" data-action="google">🌈 Tiếp tục với Google (sắp có)</button><p class="auth-footnote">Bản xem trước giao diện — Firebase sẽ tích hợp sau.</p></div></div>`;
}
function rooms(){
 const list=[...state.localRooms,...starterRooms];const q=state.query.toLowerCase();
 const filtered=list.filter(x=>(state.roomFilter==='all'||x.mode===state.roomFilter)&&`${x.name} ${x.owner} ${x.id}`.toLowerCase().includes(q));
 return `<div class="storybook-page-title"><span>🎮</span><div><h2>Danh sách phòng</h2><p>Vào phòng của bạn bè hoặc chọn phòng phù hợp</p></div></div><div class="rooms-toolbar"><label class="search-input">🔍 <input id="room-search" placeholder="Tìm phòng (tên phòng, chủ phòng)…" value="${esc(state.query)}" aria-label="Tìm phòng"/></label><div class="segments"><button class="segment ${state.roomFilter==='all'?'active':''}" data-room-filter="all">Tất cả</button><button class="segment ${state.roomFilter==='basic'?'active':''}" data-room-filter="basic">Thường</button><button class="segment ${state.roomFilter==='fun'?'active':''}" data-room-filter="fun">Vui nhộn</button></div></div>
 <div class="room-list story-room-list">${filtered.length?filtered.map(room=>`<article class="room-item"><img class="room-thumb" src="${room.mode==='fun'?'./assets/design/board-fun.webp':'./assets/design/board-classic.webp'}" alt="${room.mode==='fun'?'Map vui nhộn':'Map thường'}"/><div><h3 class="room-name">${esc(room.name)} ${room.locked?'🔒':''}</h3><div class="room-info"><span class="tag ${room.mode==='fun'?'pink':'blue'}">${modes[room.mode]}</span><span class="tag">👥 ${room.count}/${room.max}</span><span class="tag yellow">⭐ ${fmt(room.stake)}</span></div><small class="muted">Chủ phòng: ${esc(room.owner)}</small></div><div class="room-actions"><button class="btn ${room.count>=room.max?'btn-soft':'btn-mint'} btn-sm" data-join="${esc(room.id)}" ${room.count>=room.max?'disabled':''}>${room.count>=room.max?'Đầy':'Vào ➜'}</button><small>${room.status==='playing'?'Đang chơi':'Chờ người'}</small></div></article>`).join(''):`<div class="empty">🌸 <strong>Không có phòng phù hợp</strong>Thử từ khóa khác hoặc tạo phòng nhé!</div>`}</div><button class="btn btn-blue story-fixed-create" data-nav="create">✚ Tạo phòng mới</button>${notice()}`;
}
function chooser(key,vals,active){return `<div class="segments">${vals.map(([value,text])=>`<button class="segment ${String(active)===String(value)?'active':''}" data-choice="${key}" data-value="${value}">${text}</button>`).join('')}</div>`;}
function create(){
 const c=state.create;
 return `${notice()}<div class="room-layout"><div class="card stack"><div><h2>✨ Tạo căn phòng của bạn</h2><p class="card-subtitle">Điều chỉnh các quy tắc trước khi mời bạn bè vào chơi</p></div><form id="create-form" class="stack"><div class="field"><label for="room-name">Tên phòng</label><input required maxlength="42" minlength="2" id="room-name" name="roomName" value="${esc(c.name)}" placeholder="Ví dụ: Đội ngựa siêu cấp"/></div><div class="field"><label for="room-password">Mật khẩu phòng (tùy chọn)</label><input maxlength="32" id="room-password" name="roomPassword" type="password" placeholder="Để trống nếu muốn phòng công khai" value="${esc(c.password)}"/></div><div class="field"><label>Chế độ chơi</label><div class="choice-grid"><button type="button" class="choice ${c.mode==='basic'?'active':''}" data-choice="mode" data-value="basic"><img class="mode-choice-thumb" src="./assets/design/board-classic.webp" alt=""/><b>Cơ bản</b><small>Truyền thống, không có kỹ năng</small>${c.mode==='basic'?'<span class="checkmark">✓</span>':''}</button><button type="button" class="choice ${c.mode==='fun'?'active':''}" data-choice="mode" data-value="fun"><img class="mode-choice-thumb" src="./assets/design/board-fun.webp" alt=""/><b>Vui nhộn</b><small>Ô bẫy, may mắn và skill</small>${c.mode==='fun'?'<span class="checkmark">✓</span>':''}</button></div></div><div class="config-grid"><div class="config-section"><h3>👥 Số người chơi</h3>${chooser('max',[[2,'2 người'],[3,'3 người'],[4,'4 người']],c.max)}</div><div class="config-section"><h3>⭐ Điểm mỗi người / ván</h3>${chooser('stake',[[0,'0'],[50,'50'],[100,'100'],[200,'200']],c.stake)}</div><div class="config-section"><h3>⏳ Thời gian mỗi lượt</h3>${chooser('time',[[15,'15s'],[30,'30s'],[45,'45s'],[60,'60s']],c.time)}</div><div class="config-section"><h3>🏆 Chia điểm theo hạng</h3><select id="room-reward" name="reward"><option value="50-30-20-0" ${c.reward==='50-30-20-0'?'selected':''}>Hạng nhất 50% / nhì 30% / ba 20%</option><option value="70-20-10-0" ${c.reward==='70-20-10-0'?'selected':''}>Hạng nhất 70% / nhì 20% / ba 10%</option><option value="100-0-0-0" ${c.reward==='100-0-0-0'?'selected':''}>Người đứng nhất nhận tất cả</option></select><p class="hint">Chỉ là dự kiến phân phối; chưa có ví thật.</p></div></div><div class="config-section"><div class="spread"><div><h3>🗺️ Bản đồ</h3><div class="mode-label">${esc(gameMaps.find(m=>m.id===c.map)?.name||'')}</div><img class="create-map-preview" src="${c.mode==='fun'?'./assets/design/board-fun.webp':'./assets/design/board-classic.webp'}" alt="Bản đồ đã chọn"/></div><button type="button" class="btn btn-soft btn-sm" data-nav="maps">Chọn map ➜</button></div></div><button class="btn btn-primary btn-full btn-lg" type="submit">🐴 Tạo phòng demo</button></form></div><aside class="aside-note"><span class="tag green">Xem trước ngựa chibi</span>${horseSVG('green')}<b>Đại chiến cùng bạn bè!</b><p class="muted small">Tự do chọn bản đồ, số người chơi và kiểu ngựa. Mọi thao tác trong bản mẫu là dữ liệu local.</p></aside></div>`;
}
function maps(){
 const c=state.create;
 const filtered=gameMaps.filter(x=>x.mode===c.mode);
 return `<div class="storybook-page-title"><span>🗺️</span><div><h2>Chọn bản đồ</h2><p>Chọn khu vườn cho chuyến phiêu lưu</p></div></div><div class="segments map-mode-filter"><button class="segment ${c.mode==='basic'?'active':''}" data-choice="mode" data-value="basic">🎲 Thường</button><button class="segment ${c.mode==='fun'?'active':''}" data-choice="mode" data-value="fun">⭐ Vui nhộn</button></div><div class="map-grid story-map-grid">${filtered.map(m=>`<button class="map-choice-card ${c.map===m.id?'selected':''}" data-select-map="${m.id}"><img class="map-photo" src="${m.mode==='fun'?'./assets/design/board-fun.webp':'./assets/design/board-classic.webp'}" alt="${esc(m.name)} 3D chibi"/><div class="map-caption"><div><strong>${m.emoji} ${esc(m.name)}</strong><p>${esc(m.subtitle)}</p></div><span>${c.map===m.id?'✅':'➜'}</span></div></button>`).join('')}</div><div class="card story-map-action"><div><b>📍 Đang chọn: ${esc(gameMaps.find(m=>m.id===c.map)?.name||'')}</b><p class="muted small">Bản đồ demo minh họa, chưa chốt luật di chuyển.</p></div><div class="story-button-row"><button class="btn btn-blue" data-action="${c.mode==='fun'?'preview-fun':'preview-basic'}">👀 Xem bàn cờ</button><button class="btn btn-primary" data-nav="create">✓ Xác nhận</button></div></div>`;
}
function profile(){
 return `${notice()}<div class="card stack"><div class="profile-hero"><div class="profile-person">${renderAvatar()}<div><h2>${esc(state.name)}</h2><p>Người chơi #HN000123 · Hội ngựa con 🌸</p><span class="tag green">Đã xem giao diện profile</span></div></div><div class="profile-coins"><span class="small muted">Số dư điểm (mẫu)</span><strong>⭐ ${fmt(state.score)}</strong></div></div><div class="cols-4"><div class="stat"><small>🎮 Tổng trận</small><strong>120</strong></div><div class="stat"><small>🏆 Trận thắng</small><strong>78</strong></div><div class="stat"><small>🚩 Trận thua</small><strong>42</strong></div><div class="stat"><small>📈 Tỷ lệ thắng</small><strong>65%</strong></div></div><div class="profile-body"><div class="stack"><div><h3 class="subhead">✏️ Chỉnh sửa hồ sơ</h3><div class="avatar-uploader">${renderAvatar()}<div><label class="btn btn-blue btn-sm" for="avatar-file">📷 Thay ảnh đại diện</label><input id="avatar-file" class="sr-only" type="file" accept="image/png,image/jpeg,image/webp"/><p class="hint">Ảnh dưới 3 MB, chỉ lưu trên trình duyệt để xem trước.</p></div></div></div><form id="profile-form" class="stack"><div class="field"><label for="profile-name">Tên hiển thị</label><input maxlength="24" minlength="2" required id="profile-name" name="displayName" value="${esc(state.name)}"/></div><button class="btn btn-mint" type="submit">💾 Lưu hồ sơ demo</button><button type="button" class="btn btn-soft" data-action="password">🔒 Đổi mật khẩu (chờ Firebase)</button></form></div><div><h3 class="subhead">🐴 Ngựa mang avatar của tôi</h3><div class="profile-horses">${['blue','green','red','yellow'].map(color=>`<div class="horse-preview approved-horse"><img src="${horseArtSrc(color)}" alt="Ngựa chibi ${color}"/><span class="custom-face">${renderAvatar()}</span><span>${({blue:'Xanh',green:'Lá',red:'Đỏ',yellow:'Vàng'})[color]}</span></div>`).join('')}</div><p class="small muted">Avatar được ghép lên vị trí mặt ngựa. Skin vui nhộn và ngựa cơ bản sẽ có vị trí crop riêng khi triển khai asset thật.</p><div class="hr"></div><h3 class="subhead">🎨 Kiểu ngựa</h3><div class="segments"><button class="segment ${state.skin==='classic'?'active':''}" data-skin="classic">🐴 Classic</button><button class="segment ${state.skin==='funny'?'active':''}" data-skin="funny">🦄 Funny</button></div></div></div><div class="section-heading"><h2>📜 Lịch sử hoạt động</h2></div><div class="empty">🗓️ <strong>Chưa có lịch sử thật</strong>Khi kết nối Firebase, trận đấu và giao dịch điểm sẽ hiển thị ở đây.</div></div>`;
}
function ranking(){
 const ranks=leaderboard.map(x=>({...x,show:state.rankFilter==='score'?x.score:state.rankFilter==='wins'?Math.round(x.win/100*x.score/100):x.lv*46})).sort((a,b)=>b.show-a.show);
 return `${notice()}<div class="spread"><div><h2 class="subhead" style="font-size:27px;margin:0">🏆 Vinh danh những chú ngựa xuất sắc</h2><p class="muted small">Bảng xếp hạng đang dùng dữ liệu minh họa</p></div><div class="ranking-controls"><div class="segments"><button class="segment ${state.rankFilter==='score'?'active':''}" data-rank="score">Tổng điểm</button><button class="segment ${state.rankFilter==='wins'?'active':''}" data-rank="wins">Tỷ lệ thắng</button><button class="segment ${state.rankFilter==='level'?'active':''}" data-rank="level">Cấp độ</button></div></div></div><div class="ranking-podium">${[ranks[1],ranks[0],ranks[2]].map((p,i)=>`<div class="podium ${i===1?'first':i===0?'second':'third'}"><div style="font-size:27px">${i===1?'👑':i===0?'🥈':'🥉'}</div><span class="avatar" style="margin:auto auto 8px">${p.avatar}</span><b>${esc(p.name)}</b><span class="score">⭐ ${fmt(p.show)}</span><div class="small muted">${i===1?'Hạng nhất':i===0?'Hạng nhì':'Hạng ba'}</div></div>`).join('')}</div><div class="card"><table class="rank-table"><thead><tr><th>Hạng</th><th>Người chơi</th><th>Điểm</th><th>Thắng</th></tr></thead><tbody>${ranks.map((p,i)=>`<tr class="${p.name===state.name?'me':''}"><td class="position">#${i+1}</td><td><div class="user-line"><span class="avatar">${p.avatar}</span>${esc(p.name)}</div></td><td>⭐ ${fmt(p.show)}</td><td>${p.win}%</td></tr>`).join('')}</tbody></table></div>`;
}
function lobby(){
 const room=state.currentRoom;
 if(!room){state.view='rooms';return rooms();}
 const players=[{name:state.name,ready:state.lobbyReady,avatar:null},{name:'MinaCute',ready:true,avatar:'👧🏻'}];
 return `${notice()}<div class="section-heading"><div><h2>🏡 ${esc(room.name)}</h2><p>Mã phòng ${esc(room.id)} · Chế độ ${modes[room.mode]}</p></div><button class="btn btn-soft btn-sm" data-action="leave-lobby">Rời phòng</button></div><div class="cols-2"><section class="card stack"><h2>👥 Các vị trí trong phòng</h2><div class="lobby-players">${Array.from({length:room.max},(_,i)=>{const p=players[i];return `<div class="player-seat ${p?'occupied':''} ${p?.ready?'ready':''}">${p?(p.avatar?`<span class="avatar">${p.avatar}</span>`:renderAvatar())+'<span>'+esc(p.name)+'</span><span class="tag '+(p.ready?'green':'yellow')+'">'+(p.ready?'✓ Sẵn sàng':'⏳ Chưa sẵn sàng')+'</span>':`<span style="font-size:32px">➕</span><span>Đang chờ…</span>`}</div>`;}).join('')}</div><div class="lobby-summary"><div class="summary-item">Chế độ<b>${modes[room.mode]}</b></div><div class="summary-item">Điểm / người<b>⭐ ${fmt(room.stake)}</b></div><div class="summary-item">Bản đồ<b>${esc(gameMaps.find(m=>m.id===room.map)?.name)}</b></div><div class="summary-item">Người chơi<b>${room.max} người tối đa</b></div></div><button class="btn ${state.lobbyReady?'btn-soft':'btn-mint'}" data-action="toggle-ready">${state.lobbyReady?'✓ Đã sẵn sàng (bấm để hủy)':'✅ Tôi đã sẵn sàng'}</button><button class="btn btn-primary" data-action="start-demo">🐴 Xem thử màn hình trong game</button><p class="small muted">Nút “Xem thử” chỉ mở UI bàn cờ. Chưa có ghép phòng, xử lý cược điểm hoặc luật chơi online.</p></section><section class="card stack"><h2>🗺️ Bản đồ đã chọn</h2><img class="lobby-board-photo" src="${room.mode==='fun'?'./assets/design/board-fun.webp':'./assets/design/board-classic.webp'}" alt="Bản đồ phòng chibi 3D"/><button class="btn btn-blue btn-sm" data-action="copy-code">📋 Copy mã phòng ${esc(room.id)}</button><p class="muted small">Khi triển khai online, hệ thống sẽ có ready-check, đồng bộ phòng và tự dọn phòng sau khi không còn ai.</p></section></div>`;
}
function resetLocalMatch(count=state.currentRoom?.max||state.create.max||4){
 gameEpoch++;gameBusy=false;localMatch=createMatch(count);
}
function cubeAngles(value){
 return {1:['0deg','0deg'],2:['0deg','-90deg'],3:['-90deg','0deg'],4:['90deg','0deg'],5:['0deg','90deg'],6:['0deg','180deg']}[value]||['0deg','0deg'];
}
function diceMarkup(value=1){
 const [x,y]=cubeAngles(value);
 return `<div class="dice-stage" id="dice" aria-label="Xúc xắc hiện ${value}" style="--face-x:${x};--face-y:${y}"><div class="dice-cube">${Array.from({length:6},(_,i)=>`<div class="die-face face-${i+1}" aria-hidden="true">${Array.from({length:9},(_,j)=>`<i class="pip pip-${j+1}"></i>`).join('')}</div>`).join('')}</div></div>`;
}
function game(){
 const room=state.currentRoom||{mode:state.create.mode,map:state.create.map,max:state.create.max||4,name:'Ván offline cùng bạn bè',stake:0};
 const mode=state.gamePreviewMode||room.mode||'basic';
 const chosenMap=gameMaps.find(m=>m.id===room.map&&m.mode===mode)||gameMaps.find(m=>m.mode===mode)||gameMaps[0];
 if(!localMatch)resetLocalMatch(room.max);
 const match=localMatch,turnColor=activeColor(match),valid=match.phase==='move'?legalMoves(match):[];
 const roster={blue:state.name||'Người chơi 1',green:'Người chơi 2',red:'Người chơi 3',yellow:'Người chơi 4'};
 const playerCards=match.players.map(color=>{
   const done=match.tokens[color].filter(x=>x===57).length;
   return `<div class="game-player ${turnColor===color?'active':''}" style="--player-color:${colors[color]}"><span class="player-disc" style="background:${colors[color]}">🐴</span><div><b>${esc(roster[color])}</b><small>${done}/4 ngựa về đích ${turnColor===color?'• Đến lượt':''}</small></div></div>`;
 }).join('');
 const ponies=match.players.flatMap(color=>match.tokens[color].map((progress,i)=>{
   const [r,c]=coordinate(color,progress,i),active=valid.some(x=>x.color===color&&x.index===i);
   return `<button type="button" class="pony-piece pony-${color} ${active?'can-move':''} ${progress===57?'at-finish':''}" style="--pony-x:${((c+.5)/15*100).toFixed(3)}%;--pony-y:${((r+.5)/15*100).toFixed(3)}%;--pony-color:${colors[color]}" data-pony-index="${i}" data-pony-color="${color}" aria-label="Ngựa ${i+1} màu ${COLOR_NAMES[color]}${active?', có thể di chuyển':''}" ${active&&!gameBusy?'':'disabled'}>
       <img src="${horseArtSrc(color)}" alt="" draggable="false"/><span class="pony-number">${i+1}</span>
     </button>`;
 })).join('');
 const boardHtml=mapSquares(chosenMap.id,true).replace(/<\/div>$/,`<div class="real-ponies">${ponies}</div></div>`);
 const help=mode==='fun'?'Ô may mắn và bẫy đang là phần trang trí; skill sẽ được phát triển sau.':'Luật thử nghiệm: tung 6 để xuất quân, 6 được thêm lượt, đá ngựa khi đến đúng ô.';
 return `<div class="rotate-alert"><div><div class="rotate-icon">📱↩️</div><h2>Xoay điện thoại dọc nhé!</h2><p>Để bàn cờ dễ theo dõi hơn 🌷</p><button class="btn btn-violet" data-action="leave-game">Về trang chủ</button></div></div>
 <div class="section-heading"><div><h2>🎲 ${esc(room.name)}</h2><p>Chơi offline 2–4 người trên cùng thiết bị • Không cần đăng nhập</p></div><button class="btn btn-soft btn-sm" data-action="leave-game">Thoát ván</button></div>
 <div class="game-mode-tabs"><button class="segment ${mode==='basic'?'active':''}" data-game-mode="basic" ${gameBusy?'disabled':''}>🎯 Cơ bản</button><button class="segment ${mode==='fun'?'active':''}" data-game-mode="fun" ${gameBusy?'disabled':''}>✨ Vui nhộn</button></div>
 <div class="game-layout playable-layout"><div class="stack">
   <div class="game-players">${playerCards}</div>
   <div class="game-board-wrap">
     <div class="board-heading"><div><b>${mode==='fun'?'Vườn ngựa vui nhộn':'Đường đua ngựa con'}</b><small>${esc(chosenMap.name)} • Chạm quân sáng lên để đi</small></div><span class="tag ${mode==='fun'?'pink':'blue'}">🐴 Bản chơi được</span></div>
     <div class="game-board interactive-board ${mode==='fun'?'fun-mode':''}">${boardHtml}</div>
   </div>
   <div class="approved-art-caption"><img src="${mode==='fun'?'./assets/design/board-fun.webp':'./assets/design/board-classic.webp'}" alt="Thiết kế minh họa chibi 3D đã duyệt" loading="lazy"/><span>🎨 Hình minh họa phong cách bàn cờ đã duyệt</span></div>
 </div>
 <div class="card game-controls">
   <div class="mode-banner ${mode}"><div><b>${mode==='fun'?'🎉 Vui nhộn':'🎯 Cơ bản'}</b><p>${esc(help)}</p></div></div>
   <div class="turn-panel">${diceMarkup(match.die||1)}<div class="turn-right"><span class="small muted">Lượt chơi: <strong>${esc(roster[turnColor])} • ${COLOR_NAMES[turnColor]}</strong></span>
   <button class="btn btn-primary btn-full" data-action="roll-dice" ${match.phase!=='roll'||gameBusy?'disabled':''}>🎲 ${match.phase==='roll'?'Tung xúc xắc':'Chọn ngựa để đi'}</button>
   <button class="btn btn-soft btn-sm sound-toggle" data-action="toggle-sound" aria-pressed="${gameAudio.isEnabled()}">${gameAudio.isEnabled()?'🔊 Âm thanh: Bật':'🔇 Âm thanh: Tắt'}</button></div></div>
   <div class="game-status" role="status" aria-live="polite">${esc(match.message)}</div>
   ${match.winner?`<div class="game-winner">🏆 ${COLOR_NAMES[match.winner]} đã thắng cuộc!</div>`:''}
   <div class="mini-stats"><div class="mini-stat"><span>🎲 Lượt tung</span><b>${match.rolls}</b></div><div class="mini-stat"><span>🏇 Đã về đích</span><b>${match.players.reduce((sum,c)=>sum+match.tokens[c].filter(p=>p===57).length,0)}</b></div></div>
   <div class="game-actions"><button class="btn btn-mint btn-sm" data-action="restart-local">🔄 Chơi ván mới</button><button class="btn btn-soft btn-sm" data-action="game-emote">😆 Biểu cảm</button><button class="btn btn-soft btn-sm" data-nav="profile">🦄 Avatar</button></div>
   <p class="small muted" style="margin:0">Đây là bản game offline đầu tiên. Luật đặc thù, kỹ năng, chat và chơi online sẽ cập nhật ở các giai đoạn tiếp theo.</p>
 </div></div>`;
}
function render(){
 const views={home,auth,rooms,create,maps,profile,ranking,lobby,game};
 const view=state.view in views?state.view:'home';
 const gameMode=view==='game'; document.body.classList.toggle('in-game',gameMode);
 app.innerHTML=`<div class="page"><div class="app-shell">${sidebar()}<main class="body-area">${header()}<div class="content">${views[view]()}</div></main></div>${bottomNav()}</div>`;
}
function toast(text){
 const holder=document.querySelector('#toast-root');holder.textContent='';const d=document.createElement('div');d.className='toast';d.textContent=text;holder.appendChild(d);setTimeout(()=>{if(d.isConnected)d.remove()},3200);
}
function navigate(view){
 if(view==='lobby'&&!state.currentRoom)view='home';
 if(view==='create'&&!state.signedIn){state.view='auth';state.authTab='login';render();toast('Để tạo phòng online, vui lòng mở giao diện tài khoản demo trước.');return;}
 if(view==='rooms'&&!state.signedIn){state.view='auth';state.authTab='login';render();toast('Để xem phòng online, vui lòng mở giao diện tài khoản demo trước.');return;}
 if(state.view==='game'&&view!=='game')gameEpoch++;
  state.view=view;history.replaceState({},'',`#${view}`);render();window.scrollTo({top:0,behavior:'instant'});
}
function modal(icon,title,body,yes,no='Hủy'){
 const div=document.createElement('div');div.className='modal-backdrop';
 div.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-heading"><div class="modal-icon">${icon}</div><h2 id="modal-heading">${esc(title)}</h2><p>${esc(body)}</p><div class="modal-actions"><button class="btn btn-soft" id="modal-no">${esc(no)}</button><button class="btn btn-primary" id="modal-yes">Đồng ý</button></div></div>`;
 document.body.appendChild(div);
 function close(){div.remove();}
 div.querySelector('#modal-no').addEventListener('click',close);
 div.addEventListener('click',e=>{if(e.target===div)close()});
 div.querySelector('#modal-yes').addEventListener('click',()=>{close();yes?.()});
}
function createRoom(form){
 const name=String(form.get('roomName')||'').trim();if(name.length<2){toast('Tên phòng phải có ít nhất 2 ký tự');return;}
 const id='CN'+Math.random().toString(36).slice(2,6).toUpperCase();
 const c=state.create;
 const room={id,name,owner:state.name,mode:c.mode,count:1,max:c.max,stake:c.stake,locked:!!form.get('roomPassword'),password:String(form.get('roomPassword')||''),map:c.map,status:'waiting'};
 state.currentRoom=room;state.gamePreviewMode=room.mode;
 state.localRooms.unshift({...room,password:undefined});
 save();navigate('lobby');toast('Đã tạo phòng demo trên thiết bị này 🌼');
}
function joinRoom(id){
 if(!state.signedIn){navigate('auth');return;}
 const room=[...state.localRooms,...starterRooms].find(r=>r.id===id);if(!room)return toast('Không tìm thấy phòng');
 const done=()=>{state.currentRoom={...room};state.lobbyReady=false;state.gamePreviewMode=room.mode;navigate('lobby');};
 if(room.locked){modal('🔒','Phòng có mật khẩu','Bản mẫu UI chưa có server để xác thực mật khẩu phòng. Nhấn đồng ý để vào phòng mô phỏng.',done,'Để sau');}
 else done();
}
async function handleAvatar(file){
 if(!file)return;
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>3*1024*1024){toast('Chỉ dùng JPG/PNG/WebP tối đa 3 MB');return;}
 try{
  const img=await createImageBitmap(file);
  const side=Math.min(img.width,img.height);
  const canvas=document.createElement('canvas');canvas.width=160;canvas.height=160;
  const ctx=canvas.getContext('2d');ctx.drawImage(img,(img.width-side)/2,(img.height-side)/2,side,side,0,0,160,160);
  state.avatar=canvas.toDataURL('image/jpeg',.78);img.close();save();render();toast('Đã thay avatar demo ✨');
 }catch{toast('Không thể đọc ảnh này');}
}
app.addEventListener('input',event=>{
 if(event.target.id==='room-search') {const el=event.target;state.query=el.value;const start=el.selectionStart;render();const newer=document.getElementById('room-search');newer?.focus();newer?.setSelectionRange(start,start);}
});
app.addEventListener('change',event=>{
 if(event.target.id==='avatar-file')handleAvatar(event.target.files?.[0]);
 if(event.target.id==='room-reward'){state.create.reward=event.target.value;save();}
});
app.addEventListener('submit',e=>{
 if(e.target.id==='auth-form'){
  e.preventDefault();const form=new FormData(e.target);const pwd=String(form.get('password')||'');const confirm=String(form.get('confirm')||'');
  if(state.authTab==='register'&&pwd!==confirm){toast('Mật khẩu nhập lại chưa khớp');return;}
  if(state.authTab==='register')state.name=String(form.get('displayName')||'HorseMaster').trim();
  state.signedIn=true;save();navigate('home');toast('Đã mở phiên demo! Chưa tạo tài khoản Firebase.');return;
 }
 if(e.target.id==='profile-form'){
  e.preventDefault();const name=String(new FormData(e.target).get('displayName')||'').trim();if(name.length<2){toast('Tên cần ít nhất 2 ký tự');return;}
  state.name=name;save();render();toast('Đã lưu tên demo trên trình duyệt');return;
 }
 if(e.target.id==='create-form'){
  e.preventDefault();const form=new FormData(e.target);state.create.name=String(form.get('roomName')||'');state.create.password=String(form.get('roomPassword')||'');state.create.reward=String(form.get('reward')||'50-30-20-0');save();createRoom(form);
 }
});
app.addEventListener('click',async e=>{
 const button=e.target.closest('button[data-nav],a[data-nav],button[data-action],button[data-auth-tab],button[data-room-filter],button[data-choice],button[data-select-map],button[data-skin],button[data-rank],button[data-join],button[data-game-mode],button[data-pony-index]');if(!button)return;
 if(button.dataset.nav){e.preventDefault();navigate(button.dataset.nav);return;}
 if(button.dataset.authTab){state.authTab=button.dataset.authTab;render();return;}
 if(button.dataset.roomFilter){state.roomFilter=button.dataset.roomFilter;render();return;}
 if(button.dataset.rank){state.rankFilter=button.dataset.rank;render();return;}
 if(button.dataset.skin){state.skin=button.dataset.skin;save();render();toast(`Đã chọn ngựa ${state.skin==='classic'?'Classic':'Funny'}`);return;}
 if(button.dataset.ponyIndex!==undefined){
   if(gameBusy||!localMatch||localMatch.phase!=='move'||button.dataset.ponyColor!==activeColor(localMatch))return;
   const index=Number(button.dataset.ponyIndex);
   if(!legalMoves(localMatch).some(x=>x.index===index))return;
   const result=move(localMatch,index),epoch=gameEpoch;
   gameBusy=true;button.classList.add('is-hopping');
   app.querySelectorAll('.pony-piece').forEach(el=>el.disabled=true);
   const animateStep=step=>{
     if(epoch!==gameEpoch)return;
     if(step<result.route.length){
       const [r,c]=result.route[step];
       button.style.setProperty('--pony-x',((c+.5)/15*100)+'%');
       button.style.setProperty('--pony-y',((r+.5)/15*100)+'%');
       if(step%2===0)gameAudio.play('move');
       setTimeout(()=>animateStep(step+1),135);
     }else{
       localMatch=result.game;gameBusy=false;
       if(result.victory)gameAudio.play('win');
       else if(result.captured.length)gameAudio.play('capture');
       else if(result.finished)gameAudio.play('finish');
       render();
     }
   };
   animateStep(0);return;
 }
 if(button.dataset.gameMode){state.gamePreviewMode=button.dataset.gameMode;save();render();return;}
 if(button.dataset.selectMap){state.create.map=button.dataset.selectMap;save();render();return;}
 if(button.dataset.choice){
  const k=button.dataset.choice,v=button.dataset.value;
  state.create[k]=['stake','max','time'].includes(k)?Number(v):v;
  if(k==='mode'){state.create.map=state.create.mode==='basic'?'garden':'candy';state.gamePreviewMode=state.create.mode;}
  save();render();return;
 }
 if(button.dataset.join){joinRoom(button.dataset.join);return;}
 const act=button.dataset.action;
 switch(act){
 case 'google':toast('Google đăng nhập sẽ hoạt động sau khi tích hợp Firebase.');break;
 case 'password':toast('Đổi mật khẩu sẽ dùng Firebase Authentication.');break;
 case 'copy-code':try{await navigator.clipboard.writeText(state.currentRoom?.id||'');toast('Đã sao chép mã phòng');}catch{toast(`Mã phòng: ${state.currentRoom?.id}`);}break;
 case 'leave-lobby':state.currentRoom=null;state.lobbyReady=false;navigate('rooms');break;
 case 'toggle-ready':state.lobbyReady=!state.lobbyReady;render();break;
 case 'start-demo':resetLocalMatch(state.currentRoom?.max||4);state.dice=1;state.diceRolls=0;state.skillUsed=false;state.gamePreviewMode=state.currentRoom?.mode||state.create.mode||'basic';navigate('game');break;
 case 'preview-basic':case 'preview-fun':{state.currentRoom=null;resetLocalMatch(state.create.max||4);state.gamePreviewMode=act==='preview-fun'?'fun':'basic';state.dice=1;state.diceRolls=0;state.skillUsed=false;state.create.mode=state.gamePreviewMode;state.create.map=state.gamePreviewMode==='fun'?'candy':'garden';navigate('game');break;}
 case 'leave-game':modal('🏡','Thoát ván offline','Tiến trình ván hiện tại sẽ không được lưu.',()=>{gameEpoch++;localMatch=null;navigate(state.currentRoom?'lobby':'home');});break;
 case 'restart-local':modal('🔄','Chơi ván mới','Ván đang chơi sẽ được đặt lại từ đầu.',()=>{resetLocalMatch(localMatch?.players.length||4);render();});break;
 case 'toggle-sound':gameAudio.toggle();render();break;
 case 'roll-dice':{
  if(!localMatch||localMatch.phase!=='roll'||gameBusy)return;
  gameBusy=true;const value=rollFair(),epoch=gameEpoch;
  const die=document.querySelector('#dice'),[x,y]=cubeAngles(value);
  die?.style.setProperty('--face-x',x);die?.style.setProperty('--face-y',y);
  die?.classList.add('is-rolling');
  button.disabled=true;app.querySelectorAll('[data-game-mode]').forEach(el=>el.disabled=true);
  gameAudio.play('roll');
  setTimeout(()=>{if(epoch!==gameEpoch)return;localMatch=roll(localMatch,value);gameBusy=false;render();},960);
  break;
 }
 case 'demo-skill':state.skillUsed=true;render();toast('✨ Đã bật khiên minh họa, không tác động tới luật chơi');break;
 case 'game-emote':toast(['Ủa alo! Tui đang đi bình thường mà!','Cho tui ra chuồng lại lần nữa với!','Ngựa con hôm nay hơi xui rồi!','Đợi đó, tui quay lại ngay!'][Math.floor(Math.random()*4)]);break;
 }
});
window.addEventListener('hashchange',()=>{const view=location.hash.slice(1);if(['home','auth','rooms','create','maps','profile','ranking','lobby','game'].includes(view))navigate(view);});
render();