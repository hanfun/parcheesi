/**
 * Chibi toy-board WebGL renderer. The approved art remains available as a
 * fully playable 2D view; this is its independent, interactive 3D counterpart.
 * No gameplay decisions happen here: rules live in game-engine.js.
 */
import {legalMoves, TRACK} from './game-engine.js';
let active=null,loadPromise=null,version=0,lastAngle=0,hasAngle=false;
const teamHex={blue:0x60b5f4,green:0x73c986,red:0xfa858c,yellow:0xf6c661};
const turns={blue:0,green:Math.PI/2,yellow:Math.PI,red:-Math.PI/2};
const bases={blue:[-4.5,-4.5],green:[4.5,-4.5],red:[-4.5,4.5],yellow:[4.5,4.5]};
const getThree=()=>loadPromise??=import('https://esm.sh/three@0.170.0');

export async function mount3DBoard(host,game,coordinate,mode,choose,options={}){
 const token=++version;
 if(active){active.dispose();active=null;}
 if(!host?.isConnected)return;
 let T;try{T=await getThree();}catch(error){console.warn('Không tải được Three.js',error);return;}
 if(token!==version||!host.isConnected)return;
 let renderer;
 try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}
 catch(error){console.warn('WebGL không được hỗ trợ; dùng giao diện gốc',error);return;}
 const scene=new T.Scene();
 scene.background=new T.Color(mode==='fun'?0xffe8ee:0xdff5ee);
 scene.fog=new T.Fog(scene.background,34,75);
 const camera=new T.PerspectiveCamera(39,1,.1,100);
 camera.position.set(0,20.8,23.2);camera.lookAt(0,.2,0);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
 renderer.setSize(Math.max(1,host.clientWidth),Math.max(1,host.clientHeight),false);
 renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.domElement.className='board-webgl';
 renderer.domElement.setAttribute('aria-label','Bàn cờ 3D chibi; chạm ngựa đang phát sáng để đi');
 renderer.domElement.setAttribute('role','img');
 host.prepend(renderer.domElement);
 const world=new T.Group();scene.add(world);
 scene.add(new T.HemisphereLight(0xffffff,0x8ab8a8,2.45));
 const sun=new T.DirectionalLight(0xffffff,2.9);sun.position.set(-9,22,13);sun.castShadow=true;
 sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-15;sun.shadow.camera.right=15;
 sun.shadow.camera.top=15;sun.shadow.camera.bottom=-15;sun.shadow.bias=-.0005;scene.add(sun);
 const material=(c,rough=.67)=>new T.MeshStandardMaterial({color:c,roughness:rough,metalness:.02});
 const m={
  wood:material(0xbb8251),woodDark:material(0x805434),trim:material(0xf7d49a),
  cream:material(0xfff4db),white:material(0xfffdf5),path:material(0xf4e7cc),
  center:material(0xffd57a),grass:material(0x9ddc8f),dark:material(0x4b4059),
  blush:material(0xffa6b8),nose:material(0xffe9d9),gold:material(0xffcb5a,.3)
 };
 const colors=Object.fromEntries(Object.entries(teamHex).map(([name,c])=>[name,material(c,.42)]));
 const lightColors=Object.fromEntries(Object.entries(teamHex).map(([name,c])=>[name,material(new T.Color(c).lerp(new T.Color(0xffffff),.5),.54)]));
 const created=[];
 function mesh(geometry,mat,parent=world){
  const object=new T.Mesh(geometry,mat);object.castShadow=true;object.receiveShadow=true;parent.add(object);created.push(object);return object;
 }
 function block(w,h,d,mat,x,y,z,parent=world){
  const o=mesh(new T.BoxGeometry(w,h,d),mat,parent);o.position.set(x,y,z);return o;
 }
 function sphere(r,mat,x,y,z,parent=world,seg=16){
  const o=mesh(new T.SphereGeometry(r,seg,12),mat,parent);o.position.set(x,y,z);return o;
 }
 function cone(radius,height,mat,x,y,z,parent=world){
  const o=mesh(new T.ConeGeometry(radius,height,9),mat,parent);o.position.set(x,y,z);return o;
 }
 // A raised wooden toy board, rounded-looking candy-colored tiles and a garden.
 block(18,.55,18,m.woodDark,0,-.65,0);
 block(17.6,.32,17.6,m.wood,0,-.32,0);
 block(16.5,.12,16.5,m.trim,0,-.10,0);
 block(15.3,.13,15.3,m.cream,0,-.01,0);
 // Decorative wooden rim and four turf corners.
 for(const d of [-1,1]){
  block(18,.28,.33,m.trim,0,-.07,d*8.85);
  block(.33,.28,18,m.trim,d*8.85,-.07,0);
 }
 const funTrack=new Map();
 if(mode==='fun'){
  const specs=[[3,'red'],[11,'yellow'],[22,'blue'],[29,'green'],[40,'yellow'],[49,'red']];
  for(const [at,color] of specs)funTrack.set(TRACK[at].join(','),color);
 }
 for(let r=0;r<15;r++)for(let c=0;c<15;c++){
  let tile=(r+c)%2?m.cream:m.path;
  if(r<6&&c<6)tile=lightColors.blue;
  else if(r<6&&c>8)tile=lightColors.green;
  else if(r>8&&c<6)tile=lightColors.red;
  else if(r>8&&c>8)tile=lightColors.yellow;
  else if(r>=6&&r<=8&&c>=6&&c<=8)tile=m.center;
  else if(r<6&&c===7)tile=colors.blue;
  else if(r===7&&c>8)tile=colors.green;
  else if(r===7&&c<6)tile=colors.red;
  else if(r>8&&c===7)tile=colors.yellow;
  const special=funTrack.get(r+','+c);
  if(special)tile=lightColors[special];
  block(.955,.12,.955,tile,c-7,.15,r-7);
  if(special){
   // Sparkling toy gem: decoration only, not a gameplay trap.
   const gem=cone(.17,.27,colors[special],c-7,.38,r-7);
   gem.rotation.z=Math.PI;
  }
 }
 // Soft raised stables with four individual pads for the four ponies.
 for(const color of Object.keys(bases)){
  const [x,z]=bases[color];
  const plinth=block(5.4,.18,5.4,colors[color],x,.21,z);plinth.receiveShadow=true;
  block(4.85,.16,4.85,lightColors[color],x,.36,z);
  for(const ox of [-1,1])for(const oz of [-1,1]){
   const pad=mesh(new T.CylinderGeometry(.65,.75,.2,24),m.white);
   pad.position.set(x+ox,yPad(),z+oz);
  }
  // Pastel posts make the corner resemble a miniature toy stable.
  for(const dx of [-2.45,2.45])for(const dz of [-2.45,2.45]){
   const post=mesh(new T.CylinderGeometry(.09,.11,.53,9),m.trim);
   post.position.set(x+dx,.61,z+dz);
   sphere(.16,m.gold,x+dx,.94,z+dz);
  }
 }
 function yPad(){return .53;}
 // Center: raised golden trophy tower, visible over other pieces.
 const podium=mesh(new T.CylinderGeometry(1.25,1.52,.35,8),m.gold);
 podium.position.set(0,.53,0);
 const cup=mesh(new T.CylinderGeometry(.32,.45,.52,12),m.gold);
 cup.position.set(0,1.0,0);
 const crown=cone(.52,.66,m.gold,0,1.57,0);
 for(let a=0;a<5;a++){
  const theta=a*Math.PI*2/5;
  sphere(.12,m.white,Math.cos(theta)*.32,1.28,Math.sin(theta)*.32);
 }
 // Garden flowers/tufts along the outer frame match the approved chibi palette.
 const leaf=material(0x75bc74),pink=material(0xff9cbe),sunny=material(0xffe78b);
 for(let i=0;i<28;i++){
  const side=Math.floor(i/7),k=i%7,offset=-7.6+k*2.5;
  let x=0,z=0;
  if(side===0){x=offset;z=-8.42;}
  if(side===1){x=8.42;z=offset;}
  if(side===2){x=offset;z=8.42;}
  if(side===3){x=-8.42;z=offset;}
  const stem=mesh(new T.CylinderGeometry(.035,.045,.35,6),leaf);stem.position.set(x,.20,z);
  for(let p=0;p<5;p++){
   const a=p*Math.PI*2/5;
   sphere(.105,p%2?pink:sunny,x+Math.cos(a)*.13,.40,z+Math.sin(a)*.13,world,9);
  }
  sphere(.095,m.gold,x,.43,z,world,10);
 }
 // Distinct round-faced toy ponies with a personalized face badge above the head.
 const ponies=[],lookup=new Map();
 function faceTexture(color,index){
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(64,64,62,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f7e6d2';ctx.beginPath();ctx.arc(64,64,54,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#504264';ctx.font='900 66px Nunito, sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText((options.labels?.[color]||color.slice(0,1)).slice(0,1).toUpperCase(),64,70);
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
  if(color==='blue'&&options.avatar){
   const img=new Image();img.onload=()=>{
    if(token!==version)return;
    ctx.save();ctx.beginPath();ctx.arc(64,64,53,0,Math.PI*2);ctx.clip();
    ctx.drawImage(img,11,11,106,106);ctx.restore();texture.needsUpdate=true;
   };img.src=options.avatar;
  }
  return texture;
 }
 const avatars=new Map(Object.keys(teamHex).map(c=>[c,faceTexture(c,0)]));
 function pony(color,index,progress){
  const group=new T.Group();world.add(group);group.userData={color,index};
  // Four legs and oversized head, shiny eyes, tiny ears and rosy cheeks.
  const body=sphere(.42,colors[color],0,.74,0,group);body.scale.set(1.22,.85,.87);
  for(const x of [-.27,.27])for(const z of [-.22,.22]){
   const leg=mesh(new T.CylinderGeometry(.11,.15,.42,10),colors[color],group);
   leg.position.set(x,.40,z);
   sphere(.13,lightColors[color],x,.19,z,group);
  }
  const neck=sphere(.29,colors[color],.28,1.02,0,group);
  neck.scale.set(.72,1.2,.85);
  const head=sphere(.43,colors[color],.34,1.35,0,group);
  head.scale.set(1.03,1.03,.91);
  const muzzle=sphere(.27,m.nose,.62,1.20,0,group);
  muzzle.scale.set(.9,.75,1.05);
  for(const z of [-.27,.27]){
   const ear=cone(.14,.39,colors[color],.18,1.84,z,group);
   ear.rotation.z=-.15;
   sphere(.077,m.dark,.66,1.43,z*.75,group);
   sphere(.028,m.white,.69,1.48,z*.75,group);
   sphere(.10,m.blush,.55,1.24,z*1.15,group);
  }
  for(let i=0;i<4;i++)sphere(.115,lightColors[color],.13-i*.105,1.69-i*.09,0,group);
  const tail=cone(.17,.52,lightColors[color],-.53,.96,0,group);tail.rotation.z=-1.1;
  sphere(.12,m.gold,.38,.72,-.3,group);
  const portrait=new T.Sprite(new T.SpriteMaterial({map:avatars.get(color),transparent:true,depthWrite:false}));
  portrait.position.set(.30,2.18,.1);portrait.scale.set(.72,.72,1);group.add(portrait);
  // Halo is only visible on legal selections; raycasts still hit the horse meshes.
  const ring=mesh(new T.TorusGeometry(.58,.085,8,32),m.gold,group);
  ring.position.set(0,.23,0);ring.rotation.x=Math.PI/2;
  group.scale.setScalar(.69);
  const [r,c]=coordinate(color,progress,index);
  const baseY=progress<0?.69:.37;
  group.position.set(c-7,baseY,r-7);
  const entry={group,color,index,ring,baseY,hop:0,selectable:false};
  ponies.push(entry);lookup.set(color+':'+index,entry);
 }
 for(const color of game.players)game.tokens[color].forEach((p,i)=>pony(color,i,p));
 function selectable(next){
  const ids=new Set(next.phase==='move'?legalMoves(next).map(v=>v.color+':'+v.index):[]);
  for(const p of ponies){p.selectable=ids.has(p.color+':'+p.index);p.ring.visible=p.selectable;}
 }
 selectable(game);
 const raycaster=new T.Raycaster(),pointer=new T.Vector2();
 function onPointer(event){
  if(event.type!=='pointerup')return;
  const rect=renderer.domElement.getBoundingClientRect();
  if(!rect.width||!rect.height)return;
  pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
  raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.intersectObjects(ponies.map(v=>v.group),true);
  for(const picked of hit){
   let node=picked.object;
   while(node&&!node.userData?.color)node=node.parent;
   if(!node?.userData?.color)continue;
   const piece=lookup.get(node.userData.color+':'+node.userData.index);
   if(piece?.selectable){choose(piece.color,piece.index);break;}
  }
 }
 renderer.domElement.addEventListener('pointerup',onPointer);
 let frame=0,disposed=false,width=0,height=0,target=turns[game.players[game.turn]]||0;
 let angle=hasAngle?lastAngle:target;world.rotation.y=angle;
 const clock=new T.Clock();
 function tick(){
  if(disposed)return;
  frame=requestAnimationFrame(tick);
  const w=host.clientWidth,h=host.clientHeight;
  if(w!==width||h!==height){width=w;height=h;renderer.setSize(Math.max(1,w),Math.max(1,h),false);camera.aspect=Math.max(1,w)/Math.max(1,h);camera.updateProjectionMatrix();}
  const delta=Math.min(clock.getDelta(),.05);
  angle+=Math.atan2(Math.sin(target-angle),Math.cos(target-angle))*Math.min(1,delta*3);
  world.rotation.y=angle;lastAngle=angle;hasAngle=true;
  const now=performance.now()*.003;
  for(const p of ponies){
   const bob=p.selectable?Math.sin(now*2+p.index)*.075:Math.sin(now+p.index)*.018;
   p.hop=Math.max(0,p.hop-delta*3.7);
   p.group.position.y=p.baseY+bob+Math.sin(p.hop*Math.PI)*.45;
   p.ring.rotation.z+=delta*.6;
  }
  renderer.render(scene,camera);
 }
 tick();
 const api={
  step(color,index,r,c){
   const p=lookup.get(color+':'+index);
   if(!p)return;
   p.group.position.x=c-7;p.group.position.z=r-7;p.baseY=.37;p.hop=1;
  },
  sync(next){
   for(const p of ponies){
    const progress=next.tokens[p.color]?.[p.index]??-1;
    const [r,c]=coordinate(p.color,progress,p.index);
    p.group.position.x=c-7;p.group.position.z=r-7;
    p.baseY=progress<0?.69:.37;
   }
   selectable(next);target=turns[next.players[next.turn]]??0;
  },
  dispose(){
   if(disposed)return;disposed=true;
   cancelAnimationFrame(frame);
   renderer.domElement.removeEventListener('pointerup',onPointer);
   renderer.dispose();renderer.domElement.remove();
   const materials=new Set();
   for(const o of created){o.geometry?.dispose();if(o.material){for(const material of (Array.isArray(o.material)?o.material:[o.material]))materials.add(material);}}
   Object.values(m).forEach(v=>materials.add(v));
   Object.values(colors).forEach(v=>materials.add(v));
   Object.values(lightColors).forEach(v=>materials.add(v));
   materials.add(leaf);materials.add(pink);materials.add(sunny);
   for(const mt of materials)mt.dispose();
   for(const texture of avatars.values())texture.dispose();
   for(const pony of ponies)pony.group.traverse(o=>{if(o.isSprite)o.material.dispose();});
  }
 };
 active=api;
 return api;
}
export function dispose3DBoard(){version++;if(active){active.dispose();active=null;}}
export function sync3DBoard(game){active?.sync(game);}
export function step3DBoard(color,index,row,col){active?.step(color,index,row,col);}
