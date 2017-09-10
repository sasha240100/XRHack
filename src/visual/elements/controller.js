import {Importer, MeshComponent, Group} from 'whs';
import {MeshBasicMaterial, DoubleSide, Color, AxisHelper} from 'three';

import {OBJLoader} from '../lib/OBJLoader';
import {app, camera} from '../app';

import MTLModule from '../modules/MTLModule';

export const placementGroup = new Group();
placementGroup.position.set(10, 5, -5);
// placementGroup.rotation.set(Math.PI / 2, 0, Math.PI / 2);
placementGroup.addTo(app);

const fixGroup = new Group();
// fixGroup.rotation.set(0, 0, 0);
fixGroup.native.add(new AxisHelper());
fixGroup.addTo(placementGroup);

const scale = 0.01;

MTLModule.loader.setTexturePath('/assets/tex/');

new Importer({
  loader: new OBJLoader(),
  url: '/assets/controller.obj',

  parser(group) {
    return this.applyBridge({mesh: group}).mesh;
  },

  modules: [
    new MTLModule('/assets/controller.mtl', (material) => {
      console.log(material);

      if (material.name === 'Screen') {
        material.emissive = new Color(0xffffff);
        material.emissiveMap = material.map;
      }
    })
  ],

  scale: [scale, scale, scale],
  rotation: [0, -Math.PI / 2, -Math.PI / 2]
}).addTo(fixGroup).then(controller => {
  //const degToRad = (deg) => deg / 180 * Math.PI;

});

function onMessage(who, msgType, data) {
    switch(msgType){
        case 'rotation':
            let rotation = data
            fixGroup.quaternion.set(
                rotation.x,
                rotation.z,
                -rotation.y,
                rotation.w
            )
            // console.log(rotation);
            break;

        case 'position':
            let pos = data
            // fixGroup.position.set(-pos.x, -pos.y, -pos.z)
            fixGroup.position.set(-pos.x, -pos.y, pos.z).multiplyScalar(2);
            console.log(fixGroup.position);
            break;
    }
}

function connect() {
    easyrtc.setPeerListener(onMessage);
    easyrtc.connect("easyrtc.instantMessaging");
}

window.connect = connect
