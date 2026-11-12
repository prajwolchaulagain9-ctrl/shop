from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import base64, io, subprocess, sys

root = Path(__file__).resolve().parent.parent
out = root / 'public/media/studio'
frames = root / 'test-results/studio-frames'
out.mkdir(parents=True, exist_ok=True)
frames.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, 'C:/Users/User/shop_promo/tools')
import imageio_ffmpeg

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='chrome', args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    page = browser.new_page(viewport={'width':1000, 'height':1000}, device_scale_factor=1)
    page.goto('http://127.0.0.1:4390/scripts/render-studio.html')
    page.wait_for_function('window.studioReady === true')
    for i in range(160):
        data = page.evaluate('(t) => window.renderFrame(t)', i/20)
        raw = base64.b64decode(data.split(',',1)[1])
        (frames / f'{i:04}.png').write_bytes(raw)
        if i==28: Image.open(io.BytesIO(raw)).save(out/'heritage-mules.webp', quality=91)
        if i%40==0: print(f'3D RENDER {i}/160 frames',flush=True)
    (out/'heritage-mules.glb').write_bytes(bytes(page.evaluate('() => window.exportModel()')))
    page.evaluate('window.setScene("jewellery")')
    data=page.evaluate('window.renderFrame(0)')
    Image.open(io.BytesIO(base64.b64decode(data.split(',',1)[1]))).save(out/'ceremony-jewellery.webp',quality=90)
    browser.close()
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([ffmpeg,'-y','-loglevel','error','-framerate','20','-i',str(frames/'%04d.png'),'-c:v','libx264','-crf','22','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(out/'heritage-mules.mp4')],check=True)
print('3D ASSETS READY: animated mules, still render, editable GLB, jewellery render',flush=True)
