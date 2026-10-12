"""Finish the reconstructed car and prepare a reproducible render master."""
import bpy, math, os
from mathutils import Vector
from math import sin,cos,pi
scene=bpy.context.scene
car=bpy.data.objects['HT204 / PHOTO RECONSTRUCTION']
carbon=bpy.data.materials['Woven carbon / satin clearcoat'];n=carbon.node_tree.nodes;links=carbon.node_tree.links;bs=n.get('Principled BSDF')
for link in list(links):
    if link.to_socket==bs.inputs['Base Color']:links.remove(link)
bs.inputs['Base Color'].default_value=(.009,.013,.018,1)
for node in n:
    if node.type=='BUMP':node.inputs['Strength'].default_value=.07;node.inputs['Distance'].default_value=.0004
steel=bpy.data.materials['Machined titanium'];black=bpy.data.materials['Anodized black'];white=bpy.data.materials['Warm white livery'];gold=bpy.data.materials['Georgia Tech champagne gold']
blue=bpy.data.materials['Driver suit navy']
blue.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(.006,.014,.035,1)
noise=blue.node_tree.nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=190
bump=blue.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.2;bump.inputs['Distance'].default_value=.001
blue.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);blue.node_tree.links.new(bump.outputs[0],blue.node_tree.nodes.get('Principled BSDF').inputs['Normal'])
for ob in list(scene.objects):
    if ob.name.startswith('Rounded slick tire'):
        sub=ob.modifiers.new('Rounded tire shoulders','SUBSURF');sub.levels=1
    if any(ob.name.startswith(s) for s in ['Driver helmet','Helmet dark visor','Helmet gold stripe']):ob.location.z-=.055
    if ob.name.startswith('Driver upper arm') or ob.name.startswith('Driver forearm'):
        bevel=ob.modifiers.new('Suit fabric folds','BEVEL');bevel.width=.026;bevel.segments=5

def mesh(name,verts,faces,mat):
    me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new(name,me);scene.collection.objects.link(o);o.parent=car;o.data.materials.append(mat);return o

def rod(name,a,b,r,mat):
    a,b=Vector(a),Vector(b);d=b-a;bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=r,depth=d.length,location=(a+b)/2)
    ob=bpy.context.object;ob.name=name;ob.rotation_euler=d.to_track_quat('Z','Y').to_euler();ob.data.materials.append(mat);ob.parent=car
    for poly in ob.data.polygons:poly.use_smooth=True

def line(name,pts,r,mat):
    cu=bpy.data.curves.new(name,'CURVE');cu.dimensions='3D';cu.bevel_depth=r;cu.bevel_resolution=3
    sp=cu.splines.new('BEZIER');sp.bezier_points.add(len(pts)-1)
    for bp,co in zip(sp.bezier_points,pts):bp.co=co;bp.handle_left_type='AUTO';bp.handle_right_type='AUTO'
    ob=bpy.data.objects.new(name,cu);scene.collection.objects.link(ob);ob.parent=car;cu.materials.append(mat)

for s in [-1,1]:
    # Broad white sidepod graphic from reference, with gold lower pinstripe.
    pts=[(-.89,s*.45,.33),(-.59,s*.538,.325),(-.27,s*.53,.35),(.16,s*.477,.455),(.19,s*.471,.41),(-.29,s*.535,.285),(-.67,s*.52,.28)]
    ob=mesh('White sidepod livery panel',pts,[(0,1,2,3,4,5,6)],white)
    line('Sidepod gold pinstripe',[(-.87,s*.452,.318),(-.59,s*.54,.31),(-.27,s*.532,.335),(.16,s*.479,.44)],.007,gold)
    # Driver shoulder seam, visor surround, helmet vents, wing fasteners.
    line('Suit white shoulder seam',[(-.60,s*.14,.76),(-.53,s*.194,.75),(-.43,s*.2,.69),(-.32,s*.216,.63)],.009,white)
    line('Visor rubber surround',[(-.419,s*.12,.88),(-.355,s*.07,.88),(-.332,0,.88)],.006,black)
    for j in range(3):rod('Helmet chin vent',(-.346,s*(.035+j*.025),.845),(-.337,s*(.035+j*.025),.845),.009,black)
    for x,z in [(-1.47,1.36),(-.84,1.34),(-.86,.78),(-1.32,.92)]:
        rod('Rear endplate rivet',(x,s*.644,z),(x,s*.649,z),.006,steel)
    for x in [.05,.4,.75,1.03]:rod('Body panel fastener',(x,s*.24,.44),(x,s*.245,.44),.005,steel)
# Subtle additional engine-room details visible in rear tracking shots.
for s in [-1,1]:
    for j in range(5):rod('Rear cooling stack',(-1.06,s*.18,.34+j*.025),(-.85,s*.18,.34+j*.025),.007,steel)
# Final camera lets the car pull away down the circuit.
cam=scene.camera;focus=bpy.data.objects['Camera focus']
for f in range(1,241):
    scene.frame_set(f);t=(f-1)/239
    if t>.9:
        q=(t-.9)/.1;cam.location.x-=7*q*q;cam.location.y-=2*q*q
        cam.rotation_euler=(focus.location-cam.location).to_track_quat('-Z','Y').to_euler();cam.keyframe_insert('location',frame=f);cam.keyframe_insert('rotation_euler',frame=f)
# Pack the font so the saved file is portable.
bpy.ops.file.pack_all()
scene.frame_set(1);scene.cycles.samples=20
scene.render.resolution_x=1440;scene.render.resolution_y=810
os.makedirs('artifacts/cinematic',exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath('artifacts/cinematic/hytech-cinematic.blend'))
scene.render.resolution_x=1280;scene.render.resolution_y=720
for f in [1,154,192]:
    scene.frame_set(f);scene.render.filepath=f'/tmp/hytech-refined-{f}.png';bpy.ops.render.render(write_still=True)
