"""Encode preview films from the exact frames used by the homepage."""
import subprocess,os,json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
out=root/'public/cinematic/previews';out.mkdir(parents=True,exist_ok=True)
for profile in ['desktop','mobile']:
    folder=root/f'public/cinematic/frames/{profile}'
    missing=[i for i in range(240) if not (folder/f'{i:04d}.webp').is_file()]
    if missing:raise SystemExit(f'{profile}: missing {len(missing)} frames; first missing {missing[0]}')
    movie=out/f'hytech-{profile}.mp4'
    subprocess.run(['ffmpeg','-y','-framerate','24','-start_number','0','-i',str(folder/'%04d.webp'),'-frames:v','240','-c:v','libx264','-preset','slow','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(movie),'-loglevel','error'],check=True)
for name,start,duration in [('01-garage-reveal',0,2),('02-airflow-corridor',2,2.4),('03-track-pursuit',4.4,5.6)]:
    subprocess.run(['ffmpeg','-y','-ss',str(start),'-i',str(out/'hytech-desktop.mp4'),'-t',str(duration),'-c:v','libx264','-preset','slow','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(out/f'{name}.mp4'),'-loglevel','error'],check=True)
manifest={'frames':240,'fps':24,'durationSeconds':10,'desktop':{'width':1440,'height':810},'mobile':{'width':576,'height':1152},'source':'Photo-guided artistic reconstruction of the supplied HyTech #204 reference'}
(root/'public/cinematic/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Exported full desktop/mobile films and three scene previews.')
