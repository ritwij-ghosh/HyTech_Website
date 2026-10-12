"""Project the sidepod livery onto the reconstructed curved surface."""
import bpy,math,os
from mathutils import Vector
scene=bpy.context.scene;scene.frame_set(1);car=bpy.data.objects['HT204 / PHOTO RECONSTRUCTION']
for name in ['White sidepod livery panel','Sidepod gold pinstripe','Sidepod white sweep','Sidepod wordmark','SKF sponsor']:
    for ob in list(scene.objects):
        if ob.name.startswith(name):bpy.data.objects.remove(ob,do_unlink=True)
deps=bpy.context.evaluated_depsgraph_get()
for index,s in enumerate([-1,1]):
    pod=bpy.data.objects['Sidepod sculpted intake'+('' if index==0 else '.001')].evaluated_get(deps)
    for stripe in ['white','gold']:
        verts=[];faces=[]
        for j in range(61):
            q=j/60;x=-.82+q*1.0;center=.292+.055*q*q;wid=.012+.041*q
            zz=[center-wid,center+wid] if stripe=='white' else [center+wid+.004,center+wid+.010]
            for z in zz:
                hit,pos,normal,face=pod.ray_cast(Vector((x,s*1,z)),Vector((0,-s,0)))
                verts.append(tuple(pos+normal*.0015) if hit else (x,s*.48,z))
        for j in range(60):faces.append((j*2,j*2+1,j*2+3,j*2+2))
        me=bpy.data.meshes.new('Projected livery');me.from_pydata(verts,[],faces);me.update();ob=bpy.data.objects.new('Conformal sidepod '+stripe,me);scene.collection.objects.link(ob);ob.parent=car
        me.materials.append(bpy.data.materials['Warm white livery' if stripe=='white' else 'Georgia Tech champagne gold'])
bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath('artifacts/cinematic/hytech-cinematic.blend'))
