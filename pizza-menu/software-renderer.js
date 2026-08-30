import * as THREE from './vendor/three.core.min.js';
// A canvas rasterizer of the same three-dimensional mesh triangles for devices without WebGL.
export class SoftwareRenderer {
 constructor(){this.domElement=document.createElement('canvas');this.ctx=this.domElement.getContext('2d');this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.ratio=1;this.light=new THREE.Vector3(-3,7,4).normalize()}
 setPixelRatio(r){this.ratio=Math.min(r,1.5)}
 setSize(w,h){this.w=w;this.h=h;this.domElement.width=Math.round(w*this.ratio);this.domElement.height=Math.round(h*this.ratio);this.domElement.style.width=w+'px';this.domElement.style.height=h+'px'}
 setAnimationLoop(fn){let last=0;const loop=t=>{requestAnimationFrame(loop);if(t-last<50)return;last=t;fn(t)};requestAnimationFrame(loop)}
 render(scene,camera){
 if(!this.w||!this.h)return;
 const c=this.ctx;c.setTransform(this.ratio,0,0,this.ratio,0,0);c.clearRect(0,0,this.w,this.h);
 scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
 const triangles=[];
 scene.traverse(mesh=>{
  if(!mesh.isMesh||!mesh.visible||mesh.material.isShadowMaterial)return;
  const g=mesh.geometry,p=g.attributes.position,uv=g.attributes.uv,indices=g.index?.array;
  const world=[],screen=[];
  for(let i=0;i<p.count;i++){const a=new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);world.push(a);const b=a.clone().project(camera);screen.push({x:(b.x+1)*this.w/2,y:(1-b.y)*this.h/2,z:b.z})}
  const count=indices?indices.length:p.count;
  for(let k=0;k<count;k+=3){const ids=indices?[indices[k],indices[k+1],indices[k+2]]:[k,k+1,k+2];const v=ids.map(i=>screen[i]);if(v.some(a=>a.z<-1||a.z>1))continue;
   const area=(v[1].x-v[0].x)*(v[2].y-v[0].y)-(v[1].y-v[0].y)*(v[2].x-v[0].x);if(area>=-.01)continue;
   let mat=mesh.material;if(Array.isArray(mat)){const group=g.groups.find(group=>k>=group.start&&k<group.start+group.count);mat=mat[group?.materialIndex||0]}
   const a=world[ids[0]],b=world[ids[1]],d=world[ids[2]];
   const normal=new THREE.Vector3().subVectors(b,a).cross(new THREE.Vector3().subVectors(d,a)).normalize();
   const shade=.67+.33*Math.max(0,normal.dot(this.light));
   const color=mat.color?.clone().multiplyScalar(shade).getStyle()||'#c78f45';
   triangles.push({layer:mesh.renderOrder||0,v,z:(v[0].z+v[1].z+v[2].z)/3,color,image:mat.map?.image,uv:uv?ids.map(i=>[uv.getX(i),1-uv.getY(i)]):null});
  }
 });
 triangles.sort((a,b)=>a.layer-b.layer||b.z-a.z);
 for(const t of triangles){const v=t.v;
  if(t.image&&t.uv){this.drawTexturedTriangle(c,v,t.uv,t.image);continue}
  c.beginPath();c.moveTo(v[0].x,v[0].y);c.lineTo(v[1].x,v[1].y);c.lineTo(v[2].x,v[2].y);c.closePath();c.fillStyle=t.color;c.fill();c.lineWidth=.45;c.strokeStyle=t.color;c.stroke();
 }
 }
 drawTexturedTriangle(c,p,uv,image){
 const [u0,v0]=[uv[0][0]*image.width,uv[0][1]*image.height], [u1,v1]=[uv[1][0]*image.width,uv[1][1]*image.height], [u2,v2]=[uv[2][0]*image.width,uv[2][1]*image.height];
 const det=u0*(v1-v2)+u1*(v2-v0)+u2*(v0-v1);if(Math.abs(det)<.0001)return;
 const solve=(a,b,d)=>[(a*(v1-v2)+b*(v2-v0)+d*(v0-v1))/det,(a*(u2-u1)+b*(u0-u2)+d*(u1-u0))/det,(a*(u1*v2-u2*v1)+b*(u2*v0-u0*v2)+d*(u0*v1-u1*v0))/det];
 const x=solve(p[0].x,p[1].x,p[2].x),y=solve(p[0].y,p[1].y,p[2].y);
 // Slightly overlap adjoining triangles to avoid antialiasing cracks.
 const cx=(p[0].x+p[1].x+p[2].x)/3,cy=(p[0].y+p[1].y+p[2].y)/3;
 const expanded=p.map(a=>{const dx=a.x-cx,dy=a.y-cy,length=Math.hypot(dx,dy)||1;return{x:a.x+dx/length*.55,y:a.y+dy/length*.55}});
 c.save();c.beginPath();c.moveTo(expanded[0].x,expanded[0].y);c.lineTo(expanded[1].x,expanded[1].y);c.lineTo(expanded[2].x,expanded[2].y);c.closePath();c.clip();c.transform(x[0],y[0],x[1],y[1],x[2],y[2]);c.drawImage(image,0,0);c.restore();
 }
}
