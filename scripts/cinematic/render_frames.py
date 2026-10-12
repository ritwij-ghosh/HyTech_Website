"""Render the saved Blender master to web-ready, independently seekable frames.
blender -b artifacts/cinematic/hytech-cinematic.blend --python scripts/cinematic/render_frames.py -- --profile desktop
"""
import bpy, os, sys, argparse, subprocess, math, shutil
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
p=argparse.ArgumentParser();p.add_argument('--profile',choices=['desktop','mobile'],default='desktop');p.add_argument('--start',type=int,default=1);p.add_argument('--end',type=int,default=240);p.add_argument('--samples',type=int,default=16);p.add_argument('--preview',action='store_true');p.add_argument('--image-python',default=os.environ.get('HYTECH_IMAGE_PYTHON','python3'));a=p.parse_args(args)
scene=bpy.context.scene;cam=scene.camera
scene.cycles.samples=a.samples;scene.cycles.use_adaptive_sampling=True;scene.cycles.adaptive_threshold=.055
scene.render.use_persistent_data=True
try:
    prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
    for d in prefs.devices:d.use=d.type=='METAL'
    if any(d.type=='METAL' for d in prefs.devices):scene.cycles.device='GPU'
except Exception:pass
if a.profile=='mobile':
    scene.render.resolution_x=576;scene.render.resolution_y=1152
    cam.data.sensor_fit='HORIZONTAL'
    # Recompose the film for portrait. The car stays fully in shot, with title space.
    for f in range(1,241):
        scene.frame_set(f);t=(f-1)/239
        cam.data.lens*=.92;cam.data.keyframe_insert('lens',frame=f)
        cam.data.shift_y=.07*(1-min(t/.2,1));cam.data.keyframe_insert('shift_y',frame=f)
else:scene.render.resolution_x=1440;scene.render.resolution_y=810
scene.render.resolution_percentage=100
folder=os.path.abspath(f'public/cinematic/frames/{a.profile}');os.makedirs(folder,exist_ok=True)
raw=f'/tmp/hytech-render-{a.profile}';os.makedirs(raw,exist_ok=True)
frames=[1,61,154,216] if a.preview else range(a.start,a.end+1)
for f in frames:
    dest=os.path.join(folder,f'{f-1:04d}.webp')
    if os.path.exists(dest) and not a.preview:continue
    scene.frame_set(f);scene.render.filepath=os.path.join(raw,f'{f:04d}.png')
    result=bpy.ops.render.render(write_still=True)
    if 'CANCELLED' in result or not os.path.isfile(scene.render.filepath):
        raise SystemExit('Render interrupted; completed frames are preserved for resume.')
    subprocess.run([a.image_python,os.path.abspath('scripts/cinematic/encode_frame.py'),scene.render.filepath,dest],check=True)
    if f==1:shutil.copyfile(dest,os.path.abspath('public/cinematic/poster-mobile.webp' if a.profile=='mobile' else 'public/cinematic/poster.webp'))
    print(f'HYTECH_FRAME {a.profile} {f}/240',flush=True)
print('HYTECH_RENDER_COMPLETE',a.profile,flush=True)
