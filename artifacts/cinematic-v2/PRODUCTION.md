# HyTech photographic film — production handoff

## Current status

Four photographic keyframes have been generated with the built-in image_gen tool from the actual #204 photo. Original PNGs are in this directory; delivery WebPs are in `public/cinematic-v2/`. Exact image prompts are in `prompts.md`.

`/cinematic-preview` is a scrollable visual study with four stills, small framing changes and dissolves. It is explicitly labelled as a keyframe study. It is NOT generated video, a 3D reconstruction, an aerodynamic simulation, or the completed continuous film. The existing homepage remains available for comparison.

The stills preserve the broad identity and livery of the car; fine sponsor lettering and mechanical details can drift. Verify close-up branding against the real photograph before publishing. Smoke trails are art direction, not validated flow data.

No video-generation capability is connected in this session. The following motion prompts are prepared for an image-to-video service. Do not deliver a pan/zoom slideshow as the finished film.

## Film grammar

Target a 24-second master at 24 fps, with a consistent 16:9 desktop composition. Use four connected shots, with hidden transitions that feel continuous when scrubbed. Keep all page content, including sponsors, in the same scroll. Do not attempt a literal morph between garage, tunnel and circuit: it risks changing the car and making the environment feel synthetic.

The car always travels screen-right. Keep camera moves modest enough to retain the supplied side's real geometry. Do not orbit into unreferenced rear geometry. Use the original photograph as the identity anchor on every generation, where the provider permits it.

Keep a real helmeted driver in the cockpit throughout. The car is a small Formula SAE electric car, not an F1 chassis. No exhaust flames, combustion-engine visuals, halo, new livery or invented sponsor signage. Render no titles into the footage; HTML retains sharp, accessible typography.

## 01 — Dark reveal / 0–6 seconds

Start frame: `01-dark-reveal.png`.

Motion prompt: Film this exact real number 204 Formula SAE car in the dark garage. The car is stationary. A stabilized cinema camera dollies 60 cm toward the nose and makes a gentle eight-degree arc around the visible front-side quarter. True perspective and background parallax change with the dolly; do not simulate the move by scaling a still. Broad overhead reflections move naturally along the carbon weave. The helmeted driver is nearly still. Preserve all body panels, wings, tires and decals. Keep the wheels stationary. Restrained film grain, deep readable blacks, natural highlight rolloff. End as a near foreground dark structural column passes across the lens from right to left.

Overlay: “To race is not enough.” Remain legible during the opening hold, then fade before the camera's closest approach. Small existing HyTech wordmark remains in the page header.

## 02 — Wind tunnel / 6–11 seconds

Start frame: `02-wind-tunnel.png`.

Motion prompt: Reveal the same car from behind a passing dark foreground column in a practical wind-tunnel chamber. A low stabilized camera trucks slowly along the visible side, 40 cm of lateral travel. Thin translucent white smoke-tracer filaments travel from the nose at screen-right toward the rear at screen-left, moving smoothly over and around the body. Subtle wisps change shape over time; they never pass through solid panels, grow opaque or glow. Car and wheels remain stationary, driver remains seated. Preserve exact car identity. End by approaching a bright narrow opening at screen-right with restrained natural lens bloom, preparing a matched exposure transition to daylight.

Overlay: brief “Precision, before pace.” Do not cover the airflow or car with diagrams.

## 03 — Track pursuit / 11–19 seconds

Start frame: `03-track-pursuit.png`.

Motion prompt: Track the same real number 204 car at speed through a wide right-hand circuit bend at sunset. Camera is on a low stabilized tracking rig ahead of the visible front-side quarter, 25 cm above the asphalt. Camera gradually accelerates away by one metre while retaining the entire car in frame. The road, curbing, fence and hills show coherent depth-dependent parallax. Wheel rotation agrees with forward ground speed and tires stay in contact with the asphalt. Very subtle suspension and driver's helmet movement, natural steering angle through the bend, no drift or tire smoke. Body stays sharp with natural shutter blur on the rotating wheels and background. Preserve the compact Formula SAE dimensions, mechanical structure, decals and livery across every frame. Toward the end, the car approaches the shadow of a covered pit passage; let a nearby dark barrier briefly occlude the frame to hide the next cut.

No large headline here; allow the car to dominate. No excessive handheld shake or impossible camera acceleration.

## 04 — Pit passage / 19–24 seconds

Start frame: `04-pit-exit.png`.

Motion prompt: The same car emerges from a brief foreground occlusion into the shadowed pit passage, moving toward screen-right and gently decelerating. External camera dollies back smoothly to a wider view; car settles into the lower right of the frame. Warm evening rim light outlines the rear wing and nose. Wheel rotation slows naturally. Preserve driver, chassis, number and sponsor placements without warping. Camera comes to a controlled stop; hold the final composition for one second. Leave the left and upper frame dark and clear. No synthetic fade or typography baked into the footage.

Overlay: “Built together. Driven further.” Cross into the existing sponsors section through the last frame's dark negative space.

## Acceptance and integration

1. Inspect generated clips at normal speed and frame-by-frame for changing tires, suspension, wing geometry, driver helmet, number, decals, shadows and wheel-ground contact. Regenerate failed clips rather than hiding structural errors under blur.
2. Match exposure, white balance and grain. Stitch using foreground occlusions and matched light, not long dissolves that double the car. The current still preview's dissolves are only for pacing review.
3. Produce a separately composed portrait version: the entire car must remain visible, with typography clear above. A centre crop of a wide frame is not sufficient. The current mobile study letterboxes the landscape stills to preserve the whole car.
4. Export the approved master and chapter previews. Extract frame sequences into a NEW versioned asset directory. Update the existing canvas sequence player with the actual frame count and paths; never stretch the old 240-frame timing onto a longer master without adjusting it.
5. Keep the bounded decoded-frame cache and offscreen request cancellation. Measure download size, decode time, forward/reverse scrolling, rapid seeking, mobile memory, reduced-motion and failed-network fallback before switching the homepage.
6. Ship only after desktop and portrait clips pass car-identity review. The final video-generation, compositing and integration steps remain outstanding.
