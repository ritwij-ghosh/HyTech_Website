# HyTech cinematic homepage

An original Blender scene and photo-guided reconstruction of the supplied #204
HyTech car. It is an artistic reconstruction, not a photogrammetry scan or CAD
model. Hidden geometry, the driver, track, corridor and small markings are
approximations. The #210 and #277 photographs were supporting visual references;
the #204 black/white/gold car establishes the principal silhouette and colors.
No Terminal Industries artwork is shipped in this project.

## Deliverables

- `artifacts/cinematic/hytech-cinematic.blend`: editable, packed-font scene master.
- `public/cinematic/frames/desktop`: 240 independently seekable 1440 × 810 WebP frames.
- `public/cinematic/frames/mobile`: 240 separately composed 576 × 1152 WebP frames.
- `public/cinematic/poster*.webp`: immediate-loading and reduced-motion posters.
- `public/cinematic/previews`: full desktop/portrait movies and individual scene clips.

The source scene includes modeled wings, curved bodywork, projected livery,
rounded slick tires, rotating rims, suspension links/springs, driver, cockpit,
HV wiring, garage architecture, airflow curves, track, barriers and grandstand.
Cycles supplies physical lighting, reflections, shadows, depth of field and
motion blur. The full sequence is 10 seconds at 24 fps. The website maps that
time to scroll distance, including reverse playback; it does not autoplay.

## Choreography

| Film / scroll | Action |
| --- | --- |
| 0–18% | Low three-quarter garage reveal; opening headline. |
| 18–40% | Corridor tracking with airflow lines. |
| 40–53% | Daylight exit and acceleration onto the circuit. |
| 53–90% | Side tracking passes into rear-quarter chase. |
| 90–100% | Car pulls away; HTML transition introduces homepage sponsors. |

## Rebuild

Use Blender 4.5 or newer and Python with Pillow/WebP support. FFmpeg with libx264
is needed for the preview movies. The website requires none of these tools.
Run from the repository root. Substitute your Blender and Python executables.

```sh
blender -b --python scripts/cinematic/build_scene.py -- --output /tmp/hytech-scene
blender -b /tmp/hytech-scene/hytech-cinematic.blend --python scripts/cinematic/refine_scene.py
blender -b artifacts/cinematic/hytech-cinematic.blend --python scripts/cinematic/project_livery.py
blender -b artifacts/cinematic/hytech-cinematic.blend --python scripts/cinematic/render_frames.py -- --profile desktop --image-python python3
blender -b artifacts/cinematic/hytech-cinematic.blend --python scripts/cinematic/render_frames.py -- --profile mobile --image-python python3
python3 scripts/cinematic/export_movies.py
```

`render_frames.py` uses Metal when available and otherwise falls back to the CPU.
It resumes by skipping existing frames. **When the model, camera or lighting
changes, remove the affected generated frames before rerendering.** Use
`--start 1 --end 20` for a short pass and `--preview` for four composition checks.
Intermediate PNGs are written under `/tmp/hytech-render-{profile}`. Master scene
refinement currently writes three inspection PNGs to `/tmp` as well.
The build uses Arial Bold from macOS if available, otherwise Blender's built-in
font. The supplied `.blend` has its chosen font packed for portability.

## Browser behavior

`HeroSection.tsx` renders frames to a 2D canvas with a bounded decoded-image
cache (32 desktop / 24 mobile) and four concurrent requests. Fast jumps cancel
obsolete requests. Leaving the hero pauses loading. Bitmap resources and
observers are released on teardown. Only the matching device sequence loads.

GSAP synchronizes the canvas, headline, chapter indicator and sponsor handoff.
Text and navigation remain HTML. The user can skip directly to sponsors.
Reduced motion uses a single viewport-height poster without frame downloads.
JavaScript-disabled and failed-frame-loading cases retain a static hero.

The animation is illustrative: airflow curves are an art-directed effect, not
validated CFD. No performance figures are inferred from the reconstruction.
