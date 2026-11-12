import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
const root = process.cwd();
const publicRoot = path.join(root, 'public');
const backupDir = path.join(root, '.media-backups');
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(), api_key: process.env.CLOUDINARY_API_KEY?.trim(), api_secret: process.env.CLOUDINARY_API_SECRET?.trim(), secure: true });
async function verify(url) {
  const r = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error('Uploaded asset verification failed: ' + r.status);
}
async function upload(input, publicId, type = 'image') {
  const result = await cloudinary.uploader.upload(input, { public_id: publicId, resource_type: type, overwrite: false, ...(type === 'image' ? { transformation: [{ width: 1800, height: 1800, crop: 'limit' }] } : {}) });
  await verify(result.secure_url);
  return result.secure_url;
}
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}
async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 7000 });
  const db = mongoose.connection.db;
  const products = db.collection('products');
  const originals = db.collection('product_image_originals');
  const rows = await products.find({}, { projection: { image: 1 } }).toArray();
  await mkdir(backupDir, { recursive: true });
  const backup = path.join(backupDir, 'product-images-' + Date.now() + '.json');
  await writeFile(backup, JSON.stringify(rows, null, 2));
  let migrated = 0;
  for (const row of rows) {
    if (row.image?.startsWith('https://res.cloudinary.com/')) { await verify(row.image); continue; }
    let source = row.image;
    if (source?.startsWith('/')) {
      source = path.resolve(publicRoot, decodeURIComponent(source).slice(1));
      if (!source.startsWith(publicRoot + path.sep)) throw new Error('Product path leaves public directory.');
      await stat(source);
    } else if (!source?.startsWith('data:image/')) throw new Error('Unexpected product image format.');
    const url = await upload(source, 'gautam/products/' + row._id.toString());
    await originals.updateOne({ _id: row._id }, { $setOnInsert: { image: row.image, savedAt: new Date() } }, { upsert: true });
    const changed = await products.updateOne({ _id: row._id, image: row.image }, { $set: { image: url } });
    if (changed.modifiedCount) migrated++;
    console.log('Product image verified', migrated, '/', rows.length);
  }
  const manifestFile = path.join(publicRoot, 'media/manifest.json');
  const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
  const files = (await walk(path.join(publicRoot, 'media'))).filter(f => /\.(webp|mp4|glb|vtt|srt)$/i.test(f));
  for (const file of files) {
    const relative = '/' + path.relative(publicRoot, file).split(path.sep).join('/');
    if (manifest[relative]) { await verify(manifest[relative]); continue; }
    const extension = path.extname(file);
    const type = extension === '.mp4' ? 'video' : extension === '.webp' ? 'image' : 'raw';
    const id = 'gautam/' + path.relative(path.join(publicRoot, 'media'), file).split(path.sep).join('/').replace(type === 'raw' ? /$^/ : /\.[^.]+$/, '');
    manifest[relative] = await upload(file, id, type);
    await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
    console.log('Brand asset verified', relative);
  }
  await products.createIndex({ isAvailable: 1, category: 1, createdAt: -1 });
  await products.createIndex({ category: 1, createdAt: -1 });
  const total = await products.countDocuments({});
  const cloudCount = await products.countDocuments({ image: /^https:\/\/res\.cloudinary\.com\// });
  const report = { productCount: total, migratedThisRun: migrated, verifiedCloudinaryProducts: cloudCount, retainedOriginals: await originals.countDocuments({}), brandAssets: Object.keys(manifest).length, completedAt: new Date().toISOString() };
  await writeFile(path.join(backupDir, 'migration-report.json'), JSON.stringify(report, null, 2));
  console.log('MIGRATION COMPLETE', JSON.stringify(report));
}
try { await main(); } catch (error) { console.error('Migration stopped:', error.message); process.exitCode = 1; } finally { await mongoose.disconnect(); }
