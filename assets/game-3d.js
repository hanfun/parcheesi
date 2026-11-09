/* Real-time WebGL game board. Geometry is deliberately procedural so GitHub Pages
 * needs no external binary models. Replace horse meshes with GLB assets later. */
let active=null,threePromise=null,lastAngle=0,hasAngle=false;
const palette={blue:0x58b7ef,green:0x64cda0,red:0xf17c89,yellow:0xf7cb61};
const rotations={blue:0,green:Math.PI/2,yellow:Math.PI,red:-Math.PI/2};
function loadThree(){return threePromise??=import('https://esm.sh/three@0.170.0');}
export async function mount3DBoard(host,game,coordinate,mode,choose){
 if(active){active.dispose();active=null;}
 if(!host||!host.isConnected)return;
 let T;try{T=await loadThree();}catch(e){console.warn('3D unavailable, showing 2D board',e);return;}
 if(!host.isConnected)return;
 const scene=new T.Scene();scene.background=new T.Color(mode==='fun'?0xfce7ef:0xe2f3ed);
 const camera=new T.PerspectiveCamera(39,1,.1,150);
 camera.position.set(0,20,23);camera.lookAt(0,0,0);
 const renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.shadowMap.enabled=true;
 renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.domElement.className='board-webgl';renderer.domElement.setAttribute('aria-label','Bàn cờ ba chiều tương tác');
 host.prepend(renderer.domElement);
 const world=new T.Group();scene.add(world);
 scene.add(new T.HemisphereLight(0xffffff,0xaab4cc,2.3));
 const light=new T.DirectionalLight(0xffffff,3.1);light.position.set(-9,22,12);light.castShadow=true;light.shadow.mapSize.set(1024,1024);
 light.shadow.camera.left=-18;light.shadow.camera.right=18;light.shadow.camera.top=18;light.shadow.camera.bottom=-18;scene.add(light);
 const mat=(color,rough=.72)=>new T.MeshStandardMaterial({color,roughness:rough,metalness:.05});
 const cream=mat(0xfff5df),wood=mat(0xb57d4d),gold=mat(0xf8d46e),dark=mat(0x4d3b59);
 const team=Object.fromEntries(Object.entries(palette).map(([c,v])=>[c,mat(v,.42)]));
 function box(w,h,d,m,x,y,z,shadow=true){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=shadow;o.receiveShadow=true;world.add(o);return o;}
 function ball(radius,m,x,y,z,group=world){const o=new T.Mesh(new T.SphereGeometry(radius,14,10),m);o.position.set(x,y,z);o.castShadow=true;group.add(o);return o;}
 box(16.2,.7,16.2,wood,0,-.47,0);
 box(15.4,.2,15.4,cream,0,-.01,0);
 const boardColors={blue:team.blue,green:team.green,red:team.red,yellow:team.yellow};
 for(let r=0;r<15;r++)for(let c=0;c<15;c++){
  let m=cream,depth=.12;
  if(r<6&&c<6)m=team.blue;
  else if(r<6&&c>8)m=team.green;
  else if(r>8&&c<6)m=team.red;
  else if(r>8&&c>8)m=team.yellow;
  else if(r>=6&&r<=8&&c>=6&&c<=8)m=gold;
  else if(c===7&&r<6)m=team.blue;
  else if(r===7&&c>8)m=team.green;
  else if(r===7&&c<6)m=team.red;
  else if(c===7&&r>8)m=team.yellow;
  else m=((r+c)%2)?cream:mat(0xf4e7d0);
  box(.94,depth,.94,m,c-7,.13, r-7);
 }
 for(const [c,spots] of Object.entries({blue:[[2,2],[2,4],[4,2],[4,4]],green:[[2,10],[2,12],[4,10],[4,12]],red:[[10,2],[10,4],[12,2],[12,4]],yellow:[[10,10],[10,12],[12,10],[12,12]]})){
  for(const [r,col] of spots){box(1.25,.13,1.25,cream,col-7,.26,r-7);}
 }
 const plinth=box(2,.48,2,gold,0,.45,0);plinth.rotation.y=Math.PI/4;
 const crown=new T.Mesh(new T.ConeGeometry(.55,.9,5),gold);crown.position.set(0,1.12,0);world.add(crown);
 // Low-poly 3D pony: body, four legs, raised head, mane and ears.
 const ponies=[];
 function pony(color,index,progress){
  const group=new T.Group();world.add(group);
  const body=new T.Mesh(new T.CapsuleGeometry(.24,.38,4,8),team[color]);body.rotation.z=Math.PI/2;body.position.y=.6;group.add(body);
  for(const x of [-.23,.23])for(const z of [-.17,.17]){
   const leg=new T.Mesh(new T.CylinderGeometry(.09,.105,.37,8),team[color]);leg.position.set(x,.29,z);group.add(leg);
  }
  const neck=new T.Mesh(new T.CylinderGeometry(.14,.18,.47,8),team[color]);neck.position.set(.28,.88,0);neck.rotation.z=-.32;group.add(neck);
  ball(.22,team[color],.37,1.14,0,group);
  const snout=ball(.15,cream,.53,1.08,0,group);snout.scale.set(1.2,.6,.8);
  for(const z of [-.13,.13]){
   const ear=new T.Mesh(new T.ConeGeometry(.085,.23,7),team[color]);ear.position.set(.27,1.38,z);group.add(ear);
   ball(.046,dark,.52,1.2,z,group);
  }
  for(let i=0;i<4;i++)ball(.10,dark,.12-i*.095,1.24-i*.08,0,group);
  const tail=new T.Mesh(new T.ConeGeometry(.13,.45,8),team[color]);tail.position.set(-.48,.82,0);tail.rotation.z=-.75;group.add(tail);
  group.scale.setScalar(.8);
  const [r,col]=coordinate(color,progress,index);group.position.set(col-7,.29,r-7);
  group.userData={color,index};ponies.push(group);
 }
 for(const color of game.players)game.tokens[color].forEach((p,i)=>pony(color,i,p));
 const raycaster=new T.Raycaster(),mouse=new T.Vector2();
 function pointer(e){
  if(e.type!=='pointerup')return;
  const rect=renderer.domElement.getBoundingClientRect();
  mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
  raycaster.setFromCamera(mouse,camera);
  const hit=raycaster.intersectObjects(ponies,true)[0];
  if(hit){let o=hit.object;while(o.parent&&o.userData.index===undefined)o=o.parent;
   if(o.userData.index!==undefined)choose(o.userData.color,o.userData.index);
  }
 }
 renderer.domElement.addEventListener('pointerup',pointer);
 let width=0,frame=0,disposed=false,target=rotations[game.players[game.turn]]||0;
 // Keep a stable orientation when players change; animate shortest rotation.
 let angle=hasAngle?lastAngle:target;world.rotation.y=angle;
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(w!==width){width=w;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}}
 const clock=new T.Clock();
 function tick(){if(disposed)return;frame=requestAnimationFrame(tick);resize();
  const delta=Math.min(clock.getDelta(),.05);
  angle+=Math.atan2(Math.sin(target-angle),Math.cos(target-angle))*Math.min(1,delta*3.3);
  world.rotation.y=angle;lastAngle=angle;hasAngle=true;
  ponies.forEach((p,i)=>{p.position.y=.29+Math.sin(performance.now()*.0025+i)*.035;});
  renderer.render(scene,camera);
 }
 tick();
 const api={
  setTurn(color){target=rotations[color]??0;},
  sync(next){
   for(const p of ponies){const progress=next.tokens[p.userData.color]?.[p.userData.index]??-1;
    const [r,c]=coordinate(p.userData.color,progress,p.userData.index);p.position.x=c-7;p.position.z=r-7;
   }
   api.setTurn(next.players[next.turn]);
  },
  dispose(){disposed=true;cancelAnimationFrame(frame);renderer.domElement.removeEventListener('pointerup',pointer);renderer.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});renderer.domElement.remove();}
 };
 active=api;return api;
}
export function dispose3DBoard(){active?.dispose();active=null;}
export function sync3DBoard(game){active?.sync(game);}
