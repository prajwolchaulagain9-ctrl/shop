import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';
import jwt from 'jsonwebtoken';
import {randomBytes} from 'node:crypto';
import {spawn} from 'node:child_process';
import {writeFile,readFile,mkdir} from 'node:fs/promises';
import net from 'node:net';
dotenv.config({path:'.env.local',quiet:true});
const originalUri=process.env.MONGODB_URI;
const dbName='gautam_redesign_check_'+Date.now();
const testUri=new URL(originalUri);testUri.pathname='/'+dbName;
const secret=randomBytes(32).toString('hex');
const dir='test-results';await mkdir(dir,{recursive:true});
await writeFile(dir+'/uploaded-assets.json','[]');
let server;
async function waitForServer(){
 for(let i=0;i<90;i++){
  const ready=await new Promise(resolve=>{const socket=net.connect(3050,'127.0.0.1');socket.once('connect',()=>{socket.destroy();resolve(true)});socket.once('error',()=>resolve(false));});
  if(ready)return;await new Promise(resolve=>setTimeout(resolve,500));
 }throw new Error('Test server did not start.');
}
try{
 await mongoose.connect(originalUri,{serverSelectionTimeoutMS:7000});
 const products=await mongoose.connection.db.collection('products').find({}).toArray();
 await mongoose.disconnect();
 await mongoose.connect(testUri.toString(),{serverSelectionTimeoutMS:7000});
 await mongoose.connection.db.collection('products').insertMany(products);
 const ids=[new mongoose.Types.ObjectId(),new mongoose.Types.ObjectId(),new mongoose.Types.ObjectId()];
 await mongoose.connection.db.collection('users').insertMany(ids.map((id,i)=>({_id:id,firstName:i===1?'Admin':'Test',lastName:'Shopper',email:'test'+i+'@example.com',phone:'9840000000',role:i===1?'admin':'customer',password:'test-only-not-used',isEmailVerified:true,createdAt:new Date(),updatedAt:new Date()})));
 const fixture={customerToken:jwt.sign({userId:ids[0].toString()},secret,{expiresIn:'30m'}),adminToken:jwt.sign({userId:ids[1].toString()},secret,{expiresIn:'30m'}),strangerToken:jwt.sign({userId:ids[2].toString()},secret,{expiresIn:'30m'}),product:products.find(p=>p.isAvailable&&p.category==='slippers'),productCount:products.length};
 await writeFile(dir+'/fixtures.json',JSON.stringify(fixture));
 server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3050'],{env:{...process.env,MONGODB_URI:testUri.toString(),JWT_SECRET:secret,NODE_ENV:'production'},windowsHide:true,stdio:['ignore','pipe','pipe']});
 let log='';server.stdout.on('data',data=>log+=data);server.stderr.on('data',data=>log+=data);
 await waitForServer();
 const result=await new Promise((resolve,reject)=>{const child=spawn('python',['scripts/browser_check.py'],{windowsHide:true,stdio:'inherit'});child.on('error',reject);child.on('close',resolve);});
 await writeFile(dir+'/server.log',log);
 if(result!==0)throw new Error('Browser verification failed.');
 console.log('ISOLATED BROWSER AND API CHECKS PASSED');
}catch(error){console.error(error.message);process.exitCode=1;}
finally{
 if(server)await new Promise(resolve=>{const child=spawn('C:\\Windows\\System32\\taskkill.exe',['/PID',String(server.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});child.on('close',resolve);child.on('error',resolve);});
 if(mongoose.connection.db?.databaseName===dbName&&dbName.startsWith('gautam_redesign_check_')){await mongoose.connection.db.dropDatabase();console.log('Removed temporary test database.');}
 const assets=JSON.parse(await readFile(dir+'/uploaded-assets.json','utf8'));if(assets.length){cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});for(const id of assets)if(id.startsWith('gautam/products/'))await cloudinary.uploader.destroy(id);console.log('Removed temporary upload assets.');}
 await mongoose.disconnect();
}
