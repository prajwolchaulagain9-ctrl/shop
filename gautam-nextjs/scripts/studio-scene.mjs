import * as THREE from 'three';
import { GLTFExporter } from '../node_modules/three/examples/jsm/exporters/GLTFExporter.js';

// Original, editable 3D study based on the red velvet embroidered mules in s22.jpg.
// Catalog photography remains the source of truth for the purchased products.
const scene = new THREE.Scene();
scene.background = new THREE.Color('#eee8dc');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(1000, 1000);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .85;
document.body.appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
camera.position.set(5.8, 6.7, -7.6);
camera.lookAt(0, .1, 0);
scene.add(new THREE.HemisphereLight('#fff9eb', '#8b7768', 1.5));
function light(x,y,z,power,size){const l = new THREE.DirectionalLight('#fff4dc',power);l.position.set(x,y,z);l.castShadow=true;l.shadow.mapSize.set(size,size);l.shadow.camera.left=-6;l.shadow.camera.right=6;l.shadow.camera.top=6;l.shadow.camera.bottom=-6;l.shadow.normalBias=.04;scene.add(l);return l;}
light(-4,8,3,2.8,2048); light(5,4,-3,1.6,1024);
const velvet = new THREE.MeshPhysicalMaterial({ color: '#651025', roughness: .91, sheen: .7, sheenColor: new THREE.Color('#8c243a'), sheenRoughness: .8, side: THREE.DoubleSide });
const lining = new THREE.MeshStandardMaterial({color:'#801727',roughness:.98,side:THREE.DoubleSide});
const sole = new THREE.MeshStandardMaterial({color:'#43332a',roughness:.9});
const gold = new THREE.MeshStandardMaterial({color:'#dcb66c',metalness:.72,roughness:.36});
const pearl = new THREE.MeshStandardMaterial({color:'#fff3c6',metalness:.25,roughness:.28});
const stone = new THREE.MeshStandardMaterial({color:'#e4ddcd',roughness:.88});
const emerald = new THREE.MeshStandardMaterial({color:'#174f40',metalness:.4,roughness:.21});
const stage = new THREE.Mesh(new THREE.CylinderGeometry(3.55,3.62,.3,100),stone);
stage.position.y=-.42;stage.receiveShadow=true;scene.add(stage);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:'#eee8dc',roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.59;ground.receiveShadow=true;scene.add(ground);
const rim=new THREE.Mesh(new THREE.TorusGeometry(3.56,.008,6,180),gold);rim.rotation.x=Math.PI/2;rim.position.y=-.27;scene.add(rim);

function outline(){const s=new THREE.Shape();s.moveTo(0,-1.6);s.bezierCurveTo(.44,-1.56,.76,-1.04,.66,-.35);s.bezierCurveTo(.55,.44,.4,.74,.35,1.12);s.bezierCurveTo(.35,1.45,-.35,1.45,-.35,1.12);s.bezierCurveTo(-.4,.74,-.55,.44,-.66,-.35);s.bezierCurveTo(-.76,-1.04,-.44,-1.56,0,-1.6);return s;}
function width(z){return .67*Math.sqrt(Math.max(.0001,1-((z+.38)/1.23)**2));}
function height(z){return .68*Math.sqrt(Math.max(.01,1-((z+.35)/1.26)**2));}
function surface(x,z){return new THREE.Vector3(x,.24+Math.sqrt(Math.max(0,1-(x/width(z))**2))*height(z)+.025,z);}
function thread(group,points,material=gold,radius=.012){const curve=new THREE.CatmullRomCurve3(points);const m=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(24,points.length*3),radius,5,false),material);m.castShadow=true;group.add(m);return m;}
function shoe(){
 const g=new THREE.Group();
 const base=new THREE.Mesh(new THREE.ExtrudeGeometry(outline(),{depth:.13,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:3,steps:1,curveSegments:32}),sole);base.rotation.x=Math.PI/2;base.position.y=.22;base.castShadow=true;g.add(base);
 const bed=new THREE.Mesh(new THREE.ShapeGeometry(outline(),40),lining);bed.rotation.x=Math.PI/2;bed.position.y=.24;g.add(bed);
 const points=[],indices=[];const rows=44,cols=40;
 for(let r=0;r<=rows;r++){const z=-1.595+r/rows*1.88;for(let c=0;c<=cols;c++){const theta=c/cols*Math.PI;points.push(Math.cos(theta)*width(z),.24+Math.sin(theta)*height(z),z);}}
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const a=r*(cols+1)+c,b=a+cols+1;indices.push(a,b,a+1,b,b+1,a+1);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));geo.setIndex(indices);geo.computeVertexNormals();const upper=new THREE.Mesh(geo,velvet);upper.castShadow=true;g.add(upper);
 const opening=[];for(let i=0;i<=80;i++){const th=i/80*Math.PI;opening.push(new THREE.Vector3(Math.cos(th)*width(.285),.24+Math.sin(th)*height(.285),.285));}thread(g,opening,gold,.018);
 for(const side of [-1,1]){const edge=[];for(let i=0;i<=80;i++){const z=-1.59+i/80*1.87;edge.push(new THREE.Vector3(side*width(z),.252,z));}thread(g,edge,gold,.014);}
 // Raised embroidery follows the actual curved upper, rather than a flat decal.
 for(const [cx,cz,scale] of [[0,-.75,.95],[0,-1.16,.43]]){
   for(let p=0;p<10;p++){const pts=[];const a=p/10*Math.PI*2;for(let j=0;j<=32;j++){const t=j/32*Math.PI*2,r=.16+.095*Math.cos(t);const x=cx+scale*(Math.cos(a)*r+Math.sin(a)*.065*Math.sin(t));const z=cz+scale*(Math.sin(a)*r-Math.cos(a)*.065*Math.sin(t));pts.push(surface(x,z));}thread(g,pts,pearl,.009);}
   for(const radius of [.052,.082]){const pts=[];for(let j=0;j<=48;j++){const a=j/48*Math.PI*2;pts.push(surface(cx+Math.cos(a)*radius,cz+Math.sin(a)*radius));}thread(g,pts,gold,.014);}
   const gem=new THREE.Mesh(new THREE.SphereGeometry(.045,16,10),emerald);gem.position.copy(surface(cx,cz));gem.scale.y=.4;g.add(gem);
 }
 for(const side of [-1,1]){
   for(const z0 of [-.96,-.42,-.08]){const pts=[];for(let i=0;i<=60;i++){const t=i/60*2*Math.PI;const x=side*(.34+.1*Math.sin(t)*(1-.3*Math.cos(t)));const z=z0+.14*Math.cos(t);pts.push(surface(x,z));}thread(g,pts,gold,.011);}
   for(let i=0;i<36;i++){const z=-1.4+i/36*1.56,x=side*width(z)*.84;const bead=new THREE.Mesh(new THREE.SphereGeometry(.017,8,6),pearl);bead.position.copy(surface(x,z));g.add(bead);}
 }
 return g;
}
const product=new THREE.Group();scene.add(product);
const left=shoe();left.position.set(-.87,.05,-.26);left.rotation.y=.19;left.rotation.z=.06;product.add(left);
const right=shoe();right.position.set(.84,.42,.46);right.rotation.y=-.28;right.rotation.z=-.08;product.add(right);
const necklaces = new THREE.Group();
for(let i=0;i<82;i++){const a=i/82*Math.PI*2;const m=new THREE.Mesh(new THREE.SphereGeometry(.068,16,12),i%4===0?emerald:gold);m.position.set(1.48*Math.cos(a),.07+Math.abs(Math.sin(a))*.025,1.72*Math.sin(a));m.castShadow=true;necklaces.add(m);}
const pendant=new THREE.Mesh(new THREE.TorusGeometry(.38,.055,12,70),gold);pendant.rotation.x=Math.PI/2;pendant.position.set(0,.08,1.83);necklaces.add(pendant);
for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const m=new THREE.Mesh(new THREE.SphereGeometry(.065,14,10),pearl);m.position.set(.49*Math.cos(a),.07,1.83+.49*Math.sin(a));necklaces.add(m);}
const center=new THREE.Mesh(new THREE.SphereGeometry(.25,32,20),emerald);center.scale.y=.24;center.position.set(0,.09,1.83);necklaces.add(center);
window.setScene = (kind='mules')=>{product.visible=kind==='mules';if(kind==='jewellery'){scene.add(necklaces);necklaces.visible=true;}else necklaces.visible=false;};
window.renderFrame = (t=0)=>{const phase=t/8*Math.PI*2;product.rotation.y=.06+Math.sin(phase)*.12;left.position.y=.07+Math.sin(phase)*.07;right.position.y=.43+Math.sin(phase+.7)*.08;renderer.render(scene,camera);return renderer.domElement.toDataURL('image/png');};
window.exportModel = async()=>{const exporter=new GLTFExporter();const out=await exporter.parseAsync(product,{binary:true});return Array.from(new Uint8Array(out));};
window.setScene();window.renderFrame();window.studioReady=true;
