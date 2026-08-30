import * as THREE from './vendor/three.module.min.js';

const stage = document.getElementById('stage');
const status = document.getElementById('stage-status');
const get = id => document.getElementById(id);
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
} catch (error) {
  window.pizza3DReady = true;
  status.textContent = 'This browser could not start 3D. Try opening in Chrome. The menu and cart still work.';
  document.querySelector('.showroom').classList.add('has-error');
  throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
stage.prepend(renderer.domElement);
renderer.domElement.setAttribute('aria-hidden', 'true');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
const ambient = new THREE.HemisphereLight(0xfff6dd, 0x5c4933, 3);
scene.add(ambient);
const key = new THREE.DirectionalLight(0xffeed5, 4);
key.position.set(-3, 7, 4); key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);key.shadow.camera.left=-6;key.shadow.camera.right=6;key.shadow.camera.top=6;key.shadow.camera.bottom=-6;key.shadow.normalBias=.04;
scene.add(key);
const fill = new THREE.DirectionalLight(0xd7e9ff, 1.1);fill.position.set(4,3,-3);scene.add(fill);
const turntable = new THREE.Group();scene.add(turntable);
const boardMaterial = new THREE.MeshStandardMaterial({color:0x483523,roughness:.78});
const board = new THREE.Mesh(new THREE.CylinderGeometry(1.78,1.83,.15,96),boardMaterial);
board.position.y=-.17;board.receiveShadow=true;board.castShadow=true;turntable.add(board);
const boardRim = new THREE.Mesh(new THREE.TorusGeometry(1.76,.035,12,96),new THREE.MeshStandardMaterial({color:0xad8550,roughness:.55}));
boardRim.rotation.x=-Math.PI/2;boardRim.position.y=-.08;turntable.add(boardRim);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.3}));ground.rotation.x=-Math.PI/2;ground.position.y=-.28;ground.receiveShadow=true;scene.add(ground);
let pizzaGroup=new THREE.Group();turntable.add(pizzaGroup);
const textures = new Map();
const sourceImage = new Image();sourceImage.src = new URL('menu.webp',import.meta.url).href;
function textureFor(product){
 if(textures.has(product.id))return textures.get(product.id);
 const [x,y,w,h]=product.crop;
 const surface=document.createElement('canvas');surface.width=surface.height=512;
 const context=surface.getContext('2d');
 context.drawImage(sourceImage,x+3,y+3,w-6,h-6,0,0,512,512);
 const texture=new THREE.CanvasTexture(surface);texture.colorSpace=THREE.SRGBColorSpace;
 texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
 textures.set(product.id,texture);return texture;
}
function createPizza(product){
 const group = new THREE.Group();
 const crustMaterial=new THREE.MeshStandardMaterial({color:0xd19448,roughness:.92});
 const body=new THREE.Mesh(new THREE.CylinderGeometry(1.48,1.43,.17,96),crustMaterial);
 body.castShadow=true;body.receiveShadow=true;group.add(body);
 const crust=new THREE.Mesh(new THREE.TorusGeometry(1.43,.075,16,96),new THREE.MeshStandardMaterial({color:0xe2ac61,roughness:.85}));
 crust.rotation.x=-Math.PI/2;crust.position.y=.073;crust.castShadow=true;group.add(crust);
 const top = new THREE.Mesh(new THREE.CircleGeometry(1.43,96),new THREE.MeshStandardMaterial({map:textureFor(product),roughness:.96}));
 top.rotation.x=-Math.PI/2;top.position.y=.102;top.receiveShadow=true;group.add(top);
 return group;
}
function clearPizza(){pizzaGroup.traverse(obj=>{if(obj.isMesh){obj.geometry.dispose();if(Array.isArray(obj.material))obj.material.forEach(m=>m.dispose());else obj.material.dispose();}});turntable.remove(pizzaGroup);pizzaGroup=new THREE.Group();turntable.add(pizzaGroup);}
let current=window.pizzaProducts[0],loaded=false;
function updatePizza(product){
 current=product;if(!loaded)return;
 clearPizza();
 if(product.id==='duo'){
  const a=createPizza(window.pizzaProducts[0]),b=createPizza(window.pizzaProducts[1]);
  a.scale.setScalar(.59);b.scale.setScalar(.59);a.position.set(-.7,.025,-.24);b.position.set(.65,.18,.28);pizzaGroup.add(a,b);
 } else pizzaGroup.add(createPizza(product));
 status.textContent='';window.pizza3DReady=true;document.querySelector('.showroom').classList.remove('has-error');
}
sourceImage.onload=()=>{loaded=true;updatePizza(current)};
if(sourceImage.complete&&sourceImage.naturalWidth){loaded=true;updatePizza(current)}
sourceImage.onerror=()=>{window.pizza3DReady=true;status.textContent='Pizza photo could not load. Please refresh to retry.';document.querySelector('.showroom').classList.add('has-error');};
window.addEventListener('pizza-selected',e=>updatePizza(e.detail));
let azimuth=0,polar=.62,distance=7.4;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let spinning=!reduced.matches;
function updateSpin(){get('spin').setAttribute('aria-pressed',String(spinning));get('spin').textContent=spinning?'Pause rotation':'Auto rotate'}updateSpin();
function updateCamera(){camera.position.set(distance*Math.sin(polar)*Math.sin(azimuth),distance*Math.cos(polar),distance*Math.sin(polar)*Math.cos(azimuth));camera.lookAt(0,0,0)}
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
function zoom(delta){distance=clamp(distance+delta,4.6,11);updateCamera()}
get('spin').onclick=()=>{spinning=!spinning;updateSpin()};
get('zoom-in').onclick=()=>zoom(-.7);get('zoom-out').onclick=()=>zoom(.7);
get('tilt').onclick=()=>{polar=polar<.8?1.22:polar<1.1?.32:.62;updateCamera()};
get('reset-view').onclick=()=>{azimuth=0;polar=.62;distance=7.4;turntable.rotation.y=0;updateCamera()};
const pointers=new Map();let lastPinch=0;
stage.addEventListener('pointerdown',e=>{e.preventDefault();stage.focus({preventScroll:true});stage.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});spinning=false;updateSpin();if(pointers.size===2){const[a,b]=[...pointers.values()];lastPinch=Math.hypot(a.x-b.x,a.y-b.y)}});
stage.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const prev=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1){azimuth-=(e.clientX-prev.x)*.009;polar=clamp(polar+(e.clientY-prev.y)*.007,.15,1.47);updateCamera()}else if(pointers.size===2){const[a,b]=[...pointers.values()];const next=Math.hypot(a.x-b.x,a.y-b.y);if(lastPinch>0&&next>0)zoom(distance*(lastPinch/next-1));lastPinch=next}});
for(const name of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(name,e=>{pointers.delete(e.pointerId);lastPinch=0});
stage.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY*.006)},{passive:false});
stage.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','r','R',' '].includes(e.key))return;e.preventDefault();spinning=false;updateSpin();if(e.key==='ArrowLeft')azimuth-=.15;if(e.key==='ArrowRight')azimuth+=.15;if(e.key==='ArrowUp')polar=clamp(polar-.12,.15,1.47);if(e.key==='ArrowDown')polar=clamp(polar+.12,.15,1.47);if(e.key==='+'||e.key==='=')zoom(-.5);if(e.key==='-')zoom(.5);if(e.key.toLowerCase()==='r')get('reset-view').click();if(e.key===' ')get('spin').click();updateCamera()});
new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}).observe(stage);
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();status.textContent='3D paused by your browser. Refresh to restore it.';document.querySelector('.showroom').classList.add('has-error')});
let previousTime=0;renderer.setAnimationLoop(time=>{const dt=Math.min((time-previousTime)/1000,.05);previousTime=time;if(document.hidden)return;if(spinning&&pointers.size===0)turntable.rotation.y+=dt*.17;renderer.render(scene,camera)});updateCamera();
