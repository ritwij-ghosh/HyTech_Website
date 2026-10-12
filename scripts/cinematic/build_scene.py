"""HyTech photo-guided cinematic reconstruction. Run with Blender 4.5+.
The model is an artistic reconstruction of the #204 reference, not engineering CAD.
Coordinates: +X forward, +Y left, +Z up. All geometry and materials are original.
"""
import bpy, math, os, sys, argparse, random
from mathutils import Vector
from math import sin, cos, pi

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
p = argparse.ArgumentParser()
p.add_argument('--output', default='/tmp/hytech-render')
p.add_argument('--frames', type=int, default=240)
p.add_argument('--width', type=int, default=1600)
p.add_argument('--samples', type=int, default=32)
p.add_argument('--preview', action='store_true')
p.add_argument('--animate', action='store_true')
p.add_argument('--mobile', action='store_true')
a = p.parse_args(args)
os.makedirs(a.output, exist_ok=True)
random.seed(204)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = a.samples
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 5
scene.cycles.diffuse_bounces = 2
scene.cycles.glossy_bounces = 3
scene.render.use_persistent_data = True
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'METAL'; prefs.get_devices()
    for dev in prefs.devices: dev.use = dev.type == 'METAL'
    if any(d.type == 'METAL' for d in prefs.devices): scene.cycles.device = 'GPU'
except Exception as ex: print('GPU fallback:', ex)
scene.render.resolution_x = a.width
scene.render.resolution_y = round(a.width * (1.5 if a.mobile else 9/16))
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'
scene.render.fps = 24
scene.render.film_transparent = False
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.view_settings.exposure = -0.45
scene.render.use_motion_blur = True
scene.render.motion_blur_shutter = 0.32
scene.frame_start = 1; scene.frame_end = a.frames

# Materials: real geometry, woven carbon, rough rubber, brushed metals.
def material(name, color, metallic=0, rough=.4):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=(*color,1)
    bs.inputs['Metallic'].default_value=metallic; bs.inputs['Roughness'].default_value=rough
    return m
carbon=material('Woven carbon / satin clearcoat',(.012,.017,.022),.42,.26)
n=carbon.node_tree.nodes; l=carbon.node_tree.links; bs=n.get('Principled BSDF')
tex=n.new('ShaderNodeTexCoord'); mapping=n.new('ShaderNodeVectorMath'); mapping.operation='SCALE'; mapping.inputs[3].default_value=260
l.new(tex.outputs['Generated'],mapping.inputs[0])
check=n.new('ShaderNodeTexChecker'); check.inputs['Color1'].default_value=(.008,.012,.016,1); check.inputs['Color2'].default_value=(.017,.022,.028,1); check.inputs['Scale'].default_value=1
l.new(mapping.outputs[0],check.inputs['Vector']); l.new(check.outputs['Color'],bs.inputs['Base Color'])
bump=n.new('ShaderNodeBump'); bump.inputs['Strength'].default_value=.17; bump.inputs['Distance'].default_value=.0015
l.new(check.outputs['Fac'],bump.inputs['Height']); l.new(bump.outputs[0],bs.inputs['Normal']); bs.inputs['Coat Weight'].default_value=.4
black=material('Anodized black',(.012,.016,.021),.75,.27)
rubber=material('Hot slick rubber',(.006,.007,.008),.02,.72)
n=rubber.node_tree.nodes; l=rubber.node_tree.links; no=n.new('ShaderNodeTexNoise'); no.inputs['Scale'].default_value=165; no.inputs['Detail'].default_value=3
bu=n.new('ShaderNodeBump'); bu.inputs['Strength'].default_value=.28; bu.inputs['Distance'].default_value=.001
l.new(no.outputs['Fac'],bu.inputs['Height']); l.new(bu.outputs[0],n.get('Principled BSDF').inputs['Normal'])
gold=material('Georgia Tech champagne gold',(.48,.34,.13),.6,.3)
white=material('Warm white livery',(.86,.87,.84),.15,.25)
steel=material('Machined titanium',(.34,.38,.41),.9,.23)
disc=material('Brake rotor',(.16,.17,.18),.85,.5)
orange=material('HV orange',(.85,.13,.008),.2,.32)
red=material('Red accents',(.42,.016,.01),.1,.4)
blue=material('Driver suit navy',(.012,.035,.075),0,.72)
visor=material('Smoked helmet visor',(.009,.024,.034),.85,.12)
concrete=material('Architectural concrete',(.12,.135,.15),.05,.78)
wall=material('Graphite wall panels',(.04,.055,.064),.55,.34)
asphalt=material('Circuit asphalt',(.065,.07,.072),.02,.92)
n=asphalt.node_tree.nodes; l=asphalt.node_tree.links; noise=n.new('ShaderNodeTexNoise'); noise.inputs['Scale'].default_value=110
coord=n.new('ShaderNodeTexCoord'); l.new(coord.outputs['Object'],noise.inputs['Vector'])
b=n.new('ShaderNodeBump'); b.inputs['Strength'].default_value=.4; b.inputs['Distance'].default_value=.008
l.new(noise.outputs['Fac'],b.inputs['Height']); l.new(b.outputs[0],n.get('Principled BSDF').inputs['Normal'])
grass=material('Dry circuit grass',(.11,.145,.065),0,.95)
paint=material('Track paint',(.64,.65,.61),0,.8)
skid=material('Rubber racing line',(.032,.034,.034),0,.82)
def emission(name,col,strength):
    m=material(name,col)
    bs=m.node_tree.nodes.get('Principled BSDF'); bs.inputs['Emission Color'].default_value=(*col,1); bs.inputs['Emission Strength'].default_value=strength
    return m
led=emission('Warm white light strips',(.85,.9,1),6)
flowmat=emission('Airflow / cool silver',(.32,.63,.74),2)

font_path='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
font=bpy.data.fonts.load(font_path) if os.path.exists(font_path) else None

car=bpy.data.objects.new('HT204 / PHOTO RECONSTRUCTION',None); scene.collection.objects.link(car)

def finish(o,name,mat,parent=car,smooth=True):
    o.name=name
    if mat:o.data.materials.append(mat)
    if parent:o.parent=parent
    if smooth and o.type=='MESH':
        for f in o.data.polygons:f.use_smooth=True
    return o

def mesh(name,verts,faces,mat,parent=car):
    me=bpy.data.meshes.new(name); me.from_pydata(verts,[],faces); me.update()
    o=bpy.data.objects.new(name,me); scene.collection.objects.link(o)
    return finish(o,name,mat,parent)

def bevel(o,amount=.02,segments=3):
    mod=o.modifiers.new('Manufactured edge radii','BEVEL'); mod.width=amount; mod.segments=segments
    mod=o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    return o

def box(name,loc,scale,mat,parent=car,edge=.008):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object
    o.scale=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    finish(o,name,mat,parent,False)
    if edge:bevel(o,edge)
    return o

def sphere(name,loc,scale,mat,parent=car):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=20,location=loc)
    o=bpy.context.object; o.scale=scale; return finish(o,name,mat,parent)

def rod(name,a,b,r,mat,parent=car,vertices=16):
    a,b=Vector(a),Vector(b); d=b-a
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=d.length,location=(a+b)/2)
    o=bpy.context.object; o.rotation_euler=d.to_track_quat('Z','Y').to_euler()
    return finish(o,name,mat,parent)

def curve(name,pts,r,mat,parent=car):
    cu=bpy.data.curves.new(name,'CURVE'); cu.dimensions='3D'; cu.resolution_u=12; cu.bevel_depth=r; cu.bevel_resolution=3
    sp=cu.splines.new('BEZIER'); sp.bezier_points.add(len(pts)-1)
    for bp,co in zip(sp.bezier_points,pts):bp.co=co; bp.handle_left_type='AUTO'; bp.handle_right_type='AUTO'
    o=bpy.data.objects.new(name,cu); scene.collection.objects.link(o); return finish(o,name,mat,parent)

def label(name,body,loc,size,mat,side=-1,parent=car):
    cu=bpy.data.curves.new(name,'FONT'); cu.body=body; cu.size=size; cu.align_x='CENTER'; cu.align_y='CENTER'; cu.extrude=.0002
    if font:cu.font=font
    o=bpy.data.objects.new(name,cu); scene.collection.objects.link(o); o.location=loc
    # Text local X runs along car +X on right-hand side, normal points out.
    o.rotation_euler=(pi/2,0,0) if side==-1 else (pi/2,0,pi)
    finish(o,name,mat,parent);return o

# Smooth lofts keep the squat FSAE proportions, rather than a generic F1 body.
def loft(name,stations,mat,offset_y=0):
    verts=[]; N=48
    for x,w,z,h in stations:
        for j in range(N):
            t=j/N*2*pi; verts.append((x,offset_y+w*cos(t),z+h*sin(t)))
    faces=[]
    for k in range(len(stations)-1):
        for j in range(N):faces.append((k*N+j,k*N+(j+1)%N,(k+1)*N+(j+1)%N,(k+1)*N+j))
    faces += [tuple(range(N-1,-1,-1)),tuple((len(stations)-1)*N+j for j in range(N))]
    o=mesh(name,verts,faces,mat)
    sub=o.modifiers.new('Body surface continuity','SUBSURF'); sub.levels=2
    return o
nose=[(-.27,.30,.47,.23),(-.15,.32,.49,.25),(.15,.32,.46,.23),(.52,.28,.4,.2),(.91,.235,.33,.165),(1.20,.19,.28,.12),(1.38,.09,.245,.05),(1.40,.045,.245,.028)]
loft('Sculpted carbon nose / footbox',nose,carbon)
# Livery strips lie just above the same body surface.
for sign in [-1,1]:
    for start,width,mat in [(.15,.30,white),(.46,.075,gold)]:
        verts=[]
        for x,w,z,h in nose:
            for t in [pi/2+sign*start,pi/2+sign*(start+width)]:verts.append((x,w*cos(t)*1.012,z+h*sin(t)+.007))
        o=mesh('Continuous nose livery',verts,[(i*2,i*2+1,i*2+3,i*2+2) for i in range(len(nose)-1)],mat)
        sub=o.modifiers.new('Stripe continuity','SUBSURF'); sub.levels=2

# Open cockpit tub and sidepods, flat floor and rising diffuser.
loft('Lower monocoque',[(-1.05,.22,.25,.11),(-.82,.34,.26,.14),(-.35,.35,.26,.13),(.15,.30,.25,.09)],carbon)
for s in [-1,1]:
    loft('Sidepod sculpted intake',[(-1.0,.07,.28,.08),(-.72,.155,.3,.13),(-.2,.14,.30,.135),(.18,.10,.35,.16),(.35,.055,.38,.12)],carbon,s*.39)
    curve('Cockpit gold lip',[(-1.0,s*.26,.39),(-.7,s*.32,.43),(-.38,s*.32,.43),(-.19,s*.3,.65)],.012,gold)
    mesh('Sidepod white sweep',[(-.94,s*.43,.27),(-.35,s*.53,.29),(.22,s*.44,.46),(-.1,s*.50,.38),(-.67,s*.51,.32)],[(0,1,2,3,4)],white)
    label('Sidepod wordmark','HYTECH RACING',(-.48,s*.54,.325),.063,white,s)
    label('SAE decal','SAE',(.3,s*.29,.52),.075,white,s)
    # Inlet louvers.
    for j in range(7):rod('Radiator grille',(-.05+j*.025,s*.497,.32),(-.05+j*.025,s*.497,.43),.0035,black)
verts=[(-1.3,-.69,.11),(.94,-.74,.075),(1.35,-.60,.075),(1.35,.60,.075),(.94,.74,.075),(-1.3,.69,.11),(-1.52,.65,.26),(-1.52,-.65,.26)]
floor=mesh('Carbon undertray and diffuser',verts,[(0,1,2,3,4,5),(0,5,6,7)],carbon)
sol=floor.modifiers.new('Laminate thickness','SOLIDIFY'); sol.thickness=.016
for y in [-.55,-.32,0,.32,.55]:mesh('Diffuser strake',[(-1.5,y,.25),(-.9,y,.1),(-1.5,y,.10)],[(0,1,2)],carbon)

# Visible tubular frame, wiring, dampers and independent suspension.
for s in [-1,1]:
    rod('Main rollover hoop',(-.82,s*.27,.28),(-.72,s*.24,1.22),.017,steel)
    rod('Roll hoop diagonal',(-1.10,s*.27,.31),(-.72,s*.24,1.22),.013,steel)
    rod('Cockpit side rail',(-.8,s*.29,.48),(-.15,s*.28,.53),.014,black)
    rod('Rear triangulation',(-1.1,s*.29,.28),(-.65,-s*.25,.69),.011,steel)
    for axle in [-.95,.89]:
        for z in [.20,.34]:
            for dx in [-.23,.23]:rod('Carbon wishbone',(axle+dx,s*.28,z),(axle,s*.65,z+.035),.010,carbon)
        rod('Pushrod',(axle,s*.64,.25),(axle-.18,s*.24,.54),.009,steel)
        rod('Damper',(axle-.18,s*.22,.4),(axle+.09,s*.22,.54),.025,black)
        # Helical spring.
        pts=[]
        for j in range(110):
            q=j/109; pts.append((axle-.18+.27*q,s*.22+.020*cos(q*16*pi),.4+.14*q+.020*sin(q*16*pi)))
        curve('Gold suspension coil',pts,.004,gold)
    curve('Insulated HV cable',[(-.99,s*.22,.31),(-.85,s*.30,.46),(-.56,s*.32,.4),(-.4,s*.25,.32)],.011,orange)
rod('Roll hoop crossbar',(-.72,-.24,1.22),(-.72,.24,1.22),.017,steel)
box('Accumulator enclosure',(-.96,0,.35),(.27,.46,.29),black)
for side in [-1,1]:
    label('SKF sponsor','SKF',(-.72,side*.536,.29),.048,white,side)
    label('EATON sponsor','EATON',(-1.13,side*.644,1.02),.048,white,side)
for y in [-.17,0,.17]:rod('Rear electronics cooling',(-1.1,y,.48),(-.82,y,.48),.008,steel)
rod('Status mast',(-.76,0,1.12),(-.76,0,1.44),.007,steel)
sphere('Ready to drive beacon',(-.76,0,1.29),(.025,.025,.015),emission('Green status',(.12,.6,.1),3))

# Real airfoil cross sections, triple-element wings and tall curved endplates.
def airfoil(name,x,z,span,chord,angle=0):
    N=32; verts=[]
    for y in [-span/2,span/2]:
        for top in [1,-1]:
            for j in range(N):
                u=j/(N-1); thick=5*.09*(.2969*math.sqrt(max(u,0))-.126*u-.3516*u*u+.2843*u**3-.1015*u**4)
                xx=chord*(u-.5); zz=chord*(top*thick+.08*sin(pi*u))
                verts.append((x+xx*cos(angle)-zz*sin(angle),y,z+xx*sin(angle)+zz*cos(angle)))
    faces=[]
    for side in range(2):
        for j in range(N-1):faces.append((side*N+j,side*N+j+1,2*N+side*N+j+1,2*N+side*N+j))
    for yside in range(2):
        off=yside*2*N
        for j in range(N-1):faces.append((off+j,off+j+1,off+N+j+1,off+N+j))
    return mesh(name,verts,faces,carbon)
for j in range(3):
    airfoil('Front wing element',1.36-j*.125,.14+j*.055,1.72,.24,-.15)
    airfoil('Rear wing element',-1.1-j*.12,1.15+j*.11,1.22,.29,.3)
for s in [-1,1]:
    # Rear side plate: recognizable tall rounded trapezoid from reference.
    pts=[(-1.52,1.43),(-.89,1.43),(-.76,1.34),(-.78,.75),(-.88,.65),(-1.14,.68),(-1.38,.85),(-1.50,1.1)]
    plate=mesh('Tall rear-wing endplate',[(x,s*.63,z) for x,z in pts],[tuple(range(len(pts)))],carbon)
    so=plate.modifiers.new('Endplate laminate','SOLIDIFY'); so.thickness=.013; bevel(plate,.035,5)
    label('Race number','204',(-1.13,s*.643,1.19),.25,white,s)
    label('Rear wing team','HYTECH',(-1.12,s*.644,.97),.062,white,s)
    label('Rear wing institution','GEORGIA TECH',(-1.12,s*.644,.89),.04,gold,s)
    curve('Rear endplate gold sweep',[(-1.46,s*.643,1.37),(-1.37,s*.643,1.04),(-1.18,s*.643,.8),(-.93,s*.643,.73)],.016,gold)
    rod('Wing pylon',(-1.04,s*.37,.3),(-1.08,s*.43,1.15),.017,black)
    plate=box('Front wing endplate',(1.32,s*.87,.21),(.55,.016,.27),carbon,edge=.035)
    label('Front wing GT','GT',(1.16,s*.885,.225),.115,gold,s)
    label('Front wing racing','HYTECH',(1.42,s*.885,.26),.055,white,s)
    label('Front wing racing small','RACING',(1.42,s*.885,.195),.053,white,s)
    for x in [1.1,1.5]:sphere('Wing fastener',(x,s*.887,.3),(.008,.003,.008),steel)

# Tires are a lathed rounded slick profile; rims, rotor holes, centerlocks and spokes.
wheels=[]
for x in [-.95,.89]:
    for s in [-1,1]:
        group=bpy.data.objects.new('Wheel assembly',None); scene.collection.objects.link(group); group.parent=car; group.location=(x,s*.69,.275); wheels.append(group)
        verts=[]; profile=[(-.115,.178),(-.133,.195),(-.135,.232),(-.112,.261),(-.072,.269),(.072,.269),(.112,.261),(.135,.232),(.133,.195),(.115,.178)]
        N=80
        for y,r in profile:
            for j in range(N):t=j/N*2*pi; verts.append((r*cos(t),y,r*sin(t)))
        faces=[]
        for k in range(len(profile)-1):
            for j in range(N):faces.append((k*N+j,k*N+(j+1)%N,(k+1)*N+(j+1)%N,(k+1)*N+j))
        mesh('Rounded slick tire',verts,faces,rubber,group)
        for yy in [-.118,.118]:
            bpy.ops.mesh.primitive_torus_add(major_radius=.171,minor_radius=.009,major_segments=64,minor_segments=10,location=(0,yy,0),rotation=(pi/2,0,0))
            finish(bpy.context.object,'Machined rim lip',steel,group)
        rod('Wheel barrel',(0,-.10,0),(0,.10,0),.165,black,group,64)
        rod('Ventilated brake rotor',(0,s*.11,0),(0,s*.118,0),.125,disc,group,64)
        for j in range(20):
            t=j/20*2*pi; rod('Rotor perforation',(.103*cos(t),s*.119,.103*sin(t)),(.103*cos(t),s*.122,.103*sin(t)),.005,black,group,8)
        for j in range(10):
            t=j/10*2*pi; rod('Forged wheel spoke',(.045*cos(t),s*.143,.045*sin(t)),(.154*cos(t+.12),s*.124,.154*sin(t+.12)),.009,black,group)
        rod('Centerlock hub',(0,s*.12,0),(0,s*.15,0),.048,gold,group,12)
        rod('Centerlock cap',(0,s*.15,0),(0,s*.155,0),.024,black,group,12)
        label('Slick tire branding','HOOSIER',(0,s*.137,.212),.036,white,s,group)
        label('Tire sidewall','RACING',(0,s*.137,-.215),.024,white,s,group)

# Driver is present throughout so the racing shot never shows an empty cockpit.
sphere('Driver torso',(-.53,0,.58),(.17,.19,.25),blue)
sphere('Driver helmet',(-.48,0,.96),(.145,.13,.175),white)
# Curved front visor slice (+X is forward).
verts=[]
for z in [.93,1.025]:
    for j in range(25):
        t=-1.15+2.3*j/24; verts.append((-.48+.147*cos(t),.132*sin(t),z))
mesh('Helmet dark visor',verts,[(j,j+1,26+j,25+j) for j in range(24)],visor)
curve('Helmet gold stripe',[(-.58,-.11,1.04),(-.47,-.126,1.065),(-.36,-.075,1.04)],.008,gold)
for s in [-1,1]:
    rod('Driver upper arm',(-.53,s*.17,.68),(-.31,s*.2,.62),.063,blue)
    rod('Driver forearm',(-.31,s*.2,.62),(-.10,s*.16,.70),.052,blue)
    sphere('Racing glove',(-.1,s*.16,.70),(.07,.044,.052),black)
    curve('Harness',[(-.67,s*.10,.8),(-.43,s*.09,.69),(-.33,s*.09,.5)],.021,red)
rod('Steering column',(-.13,0,.54),(-.09,0,.70),.016,steel)
curve('Steering wheel',[(-.09,-.17,.70),(-.09,-.13,.78),(-.09,.13,.78),(-.09,.17,.70),(-.09,.1,.65),(-.09,-.1,.65),(-.09,-.17,.70)],.016,black)

# One connected environment, from light-controlled garage to open circuit.
box('Landscape',(70,0,-.14),(360,300,.2),grass,None,0)
box('Pit lane concrete',(-6,0,-.025),(40,14,.05),concrete,None,0)
box('Garage polished floor',(-3,0,.005),(30,14,.025),material('Garage epoxy',(.07,.08,.085),.35,.22),None,0)
for s in [-1,1]:
    box('Testing corridor wall',(-3,s*7,2),(30,.25,4),wall,None)
    for x in range(-16,13,2):
        box('Architectural wall seam',(x,s*6.86,2),(.018,.012,4),black,None,0)
        box('Wall wash strip',(x,s*6.84,2.65),(.04,.025,1.8),led,None,0)
    curve('Corridor gold guide',[(-17,s*2.65,.025),(12,s*2.65,.025)],.017,gold,None)
box('Testing corridor ceiling',(-3,0,4.1),(30,14.3,.2),wall,None)
for x in [-12,-6,0,6,11]:
    box('Overhead softbox',(x,0,4),(.22,6,.045),led,None)
    ld=bpy.data.lights.new('Ceiling soft light','AREA'); ld.energy=500; ld.shape='RECTANGLE'; ld.size=5; ld.size_y=2
    ob=bpy.data.objects.new('Ceiling soft light',ld); scene.collection.objects.link(ob); ob.location=(x,0,3.9)
for s in [-1,1]:
    box('Garage exit jamb',(12,s*6.9,2),(.4,.4,4),concrete,None)
    box('Exit light',(12.24,s*6.7,2),(.06,.06,3.8),led,None)
# Text is set into the architecture, not a floating HUD.
label('Garage wall lettering','HYTECH / 204',(1,-6.83,1.8),.40,white,-1,None)

# Circuit bends gently after the pit release.
def track_y(x):return 0 if x<28 else 7*sin(min((x-28)/85,1.6))**2
def track_angle(x):
    return math.atan2(track_y(x+.1)-track_y(x-.1),.2)
xs=[12+i*1.5 for i in range(110)]
verts=[]
for x in xs:
    y=track_y(x); verts.extend([(x,y-7,.013),(x,y+7,.013)])
mesh('Continuous circuit surface',verts,[(2*i,2*i+1,2*i+3,2*i+2) for i in range(len(xs)-1)],asphalt,None)
for s in [-1,1]:
    curve('Circuit edge line',[(x,track_y(x)+s*6.4,.027) for x in xs],.045,paint,None)
    for i,x in enumerate(xs):
        o=box('Painted curb',(x,track_y(x)+s*6.8,.045),(1.48,.6,.09),white if i%2 else red,None,.015);o.rotation_euler.z=track_angle(x)
    # Track safety wall and fence.
    for x in range(16,175,4):
        y=track_y(x)+s*10
        o=box('Concrete safety barrier',(x,y,.58),(3.95,.45,1.16),concrete,None,.04);o.rotation_euler.z=track_angle(x)
        rod('Catch fence post',(x,y,1.1),(x,y,3.3),.025,steel,None)
    for z in [1.4,1.9,2.4,2.9,3.3]:curve('Catch fence cable',[(x,track_y(x)+s*10,z) for x in xs],.008,steel,None)
for shift in [-.65,.65]:curve('Racing rubber line',[(x,track_y(x)+shift,.025) for x in xs],.075,skid,None)
# Pit complex opposite the camera; stepped grandstand on far side.
for x in range(18,66,8):
    box('Pit garage building',(x,16,2.4),(7.8,6,4.8),wall,None,.025)
    box('Pit glass',(x,12.97,3.1),(6.8,.04,1.3),visor,None,.01)
    box('Pit shutter',(x,12.94,1.15),(5.5,.04,2),steel,None,.01)
    for z in [0.5,.7,.9,1.1,1.3,1.5,1.7]:box('Shutter seam',(x,12.90,z),(5.5,.018,.015),black,None,0)
for row in range(8):
    box('Grandstand concrete tier',(94,15+row*.85,.45+row*.42),(48,.85,.22),concrete,None,.025)
    for col in range(48):box('Grandstand seat',(71+col,15+row*.85,.64+row*.42),(.6,.45,.16),blue if col%5 else white,None,.035)
for x in range(65,126,15):
    rod('Track lighting mast',(x,19,0),(x,19,12),.09,steel,None)
    box('Track floodlights',(x,18.8,12),(1.6,.7,.25),black,None)
# A sparse treeline gives depth without an artificial empty horizon.
for i in range(95):
    x=random.uniform(-15,185); y=random.choice([-1,1])*random.uniform(35,65); height=random.uniform(4,8)
    rod('Distant tree trunk',(x,y,0),(x,y,height*.7),.18,black,None,6)
    for cluster in range(4):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2,radius=1,location=(x+random.uniform(-1.5,1.5),y+random.uniform(-1.5,1.5),height*.55+cluster*.65))
        tree=bpy.context.object;tree.scale=(1.8,1.8,height*.30)
        for v in tree.data.vertices:v.co*=random.uniform(.75,1.22)
        finish(tree,'Distant irregular foliage',grass,None,False)

# Airflow lives only in the short corridor beat and follows the car.
flows=[]
for j in range(12):
    y=(j-5.5)*.16; z=.35+(j%3)*.19
    pts=[]
    for k in range(30):
        x=2.5-k*.2; near=math.exp(-((x-.25)/1.05)**2)
        yy=y+(1 if y>=0 else -1)*.22*near
        zz=z+.37*near if abs(y)<.5 else z+.08*near
        pts.append((x,yy,zz))
    flows.append(curve('Aerodynamic streamline',pts,.0025,flowmat))

world=bpy.data.worlds.new('Late afternoon circuit sky'); scene.world=world; world.use_nodes=True
nodes=world.node_tree.nodes; links=world.node_tree.links; sky=nodes.new('ShaderNodeTexSky'); sky.sky_type='NISHITA'; sky.sun_elevation=.25; sky.sun_rotation=2.3; sky.air_density=1.05; sky.dust_density=1.4
links.new(sky.outputs['Color'],nodes.get('Background').inputs['Color']); nodes.get('Background').inputs['Strength'].default_value=.20
sun=bpy.data.lights.new('Late afternoon sun','SUN'); sun.energy=1.6; sun.angle=.06
ob=bpy.data.objects.new('Late afternoon sun',sun);scene.collection.objects.link(ob);ob.rotation_euler=(.5,-.6,-.55)
# Large photographic fill, restrained enough to preserve carbon shading.
ld=bpy.data.lights.new('Car soft fill','AREA');ld.energy=220;ld.shape='DISK';ld.size=5
fill=bpy.data.objects.new('Car soft fill',ld);scene.collection.objects.link(fill)

bpy.ops.object.camera_add(); cam=bpy.context.object; cam.name='Continuous external tracking camera';scene.camera=cam
cam.data.lens=44;cam.data.sensor_width=36;cam.data.clip_end=500
cam.data.dof.use_dof=True;cam.data.dof.aperture_fstop=5.6
focus=bpy.data.objects.new('Camera focus',None);scene.collection.objects.link(focus);cam.data.dof.focus_object=focus

def smooth(t):return max(0,min(1,t))**2*(3-2*max(0,min(1,t)))
def mix(a,b,t):return a+(b-a)*t
def camera_key(t):
    # Continuous choreography. Slow reveal, side tracking, front wheel pass,
    # rear-quarter chase and a final widening as the car pulls away.
    keys=[(0,(4.2,-5.8,2.0),46),(.16,(3.5,-5.0,1.6),48),(.31,(2.1,-5.0,1.25),46),(.47,(2.8,-5.4,1.25),46),(.63,(1.1,-4.7,.85),45),(.78,(-3.7,-4.7,1.4),43),(.9,(-4.5,-5.5,1.65),44),(1,(-10,-7.5,2.4),44)]
    for i in range(len(keys)-1):
        ta,pa,la=keys[i];tb,pb,lb=keys[i+1]
        if t<=tb:
            q=smooth((t-ta)/(tb-ta));return Vector(tuple(mix(pa[j],pb[j],q) for j in range(3))),mix(la,lb,q)
    return Vector(keys[-1][1]),keys[-1][2]

for f in range(1,a.frames+1):
    t=(f-1)/(a.frames-1)
    # distance is smooth, with a deliberate increase in pace at the exit.
    if t<.18:xx=.3*smooth(t/.18)
    elif t<.44:xx=.3+14*((t-.18)/.26)**1.6
    else:xx=14.3+85*((t-.44)/.56)**1.12
    yy=track_y(xx); angle=track_angle(xx)
    car.location=(xx,yy,.003*sin(t*130)*smooth((t-.42)/.15)); car.rotation_euler=(.003*sin(t*100)*smooth((t-.4)/.2),.002*sin(t*90),angle)
    car.keyframe_insert('location',frame=f);car.keyframe_insert('rotation_euler',frame=f)
    for wh in wheels:wh.rotation_euler.y=xx/.269;wh.keyframe_insert('rotation_euler',frame=f)
    offset,lens=camera_key(t)
    if a.mobile:offset*=1.08;offset.z+=.25;lens*=.75
    rot=car.rotation_euler.to_matrix();cam.location=Vector((xx,yy,0))+rot@offset
    target=Vector((xx,yy,.62))
    # Keep subject in lower half during opening for the headline.
    if t<.18:target.z+=.15*(1-smooth(t/.18))
    cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=lens
    cam.data.shift_y=.065*(1-smooth(t/.2));cam.data.keyframe_insert('shift_y',frame=f)
    cam.keyframe_insert('location',frame=f);cam.keyframe_insert('rotation_euler',frame=f);cam.data.keyframe_insert('lens',frame=f)
    focus.location=(xx,yy,.6);focus.keyframe_insert('location',frame=f)
    fill.location=(xx+2,yy-4,4);fill.rotation_euler=(Vector((xx,yy,.4))-fill.location).to_track_quat('-Z','Y').to_euler();fill.keyframe_insert('location',frame=f);fill.keyframe_insert('rotation_euler',frame=f)
    for ob in flows:
        scale=smooth((t-.15)/.04)*(1-smooth((t-.34)/.06)); ob.data.bevel_depth=.0025*scale;ob.data.keyframe_insert('bevel_depth',frame=f)
# Linear samples prevent bezier overshoots in camera/wheel animation.
for ob in list(scene.objects)+[cam.data]+[ob.data for ob in flows]:
    if ob.animation_data and ob.animation_data.action:
        for fc in ob.animation_data.action.fcurves:
            for k in fc.keyframe_points:k.interpolation='LINEAR'
scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(a.output,'hytech-cinematic.blend'))
if a.preview:
    for t in [0,.25,.46,.64,.8,.95]:
        scene.frame_set(1+round(t*(a.frames-1)));scene.render.filepath=os.path.join(a.output,f'preview-{round(t*100):02d}.png');bpy.ops.render.render(write_still=True)
elif a.animate:
    scene.render.filepath=os.path.join(a.output,'frame-');bpy.ops.render.render(animation=True)
print('HYTECH_SCENE_COMPLETE',a.output)
