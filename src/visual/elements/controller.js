import {Importer, MeshComponent, Group, Loop} from 'whs';
import {MeshBasicMaterial, DoubleSide, Color, AxisHelper, Vector3} from 'three';
import TWEEN, {Tween} from 'tween.js';

import {OBJLoader} from '../lib/OBJLoader';
import {app, camera} from '../app';

import MTLModule from '../modules/MTLModule';

export const placementGroup = new Group();
placementGroup.position.set(10, 5, -5);
// placementGroup.rotation.set(Math.PI / 2, 0, Math.PI / 2);
placementGroup.addTo(app);

const positionGroup = new Group();
positionGroup.addTo(placementGroup);

const fixGroup = new Group();
// fixGroup.rotation.set(0, 0, 0);
fixGroup.native.add(new AxisHelper());
fixGroup.addTo(positionGroup);

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

let getVec = new Vector3();

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
            if (pos.x > 100 || pos.y > 100 || pos.z > 100) return;

            // pos.x += 0.5;
            // pos.x *= 4;
            console.log(pos);
            getVec.set(pos.x, pos.y, pos.z).multiplyScalar(2);
            new Tween(positionGroup.position).to(getVec, 100).start();

            break;
    }
}

function connect() {
    easyrtc.setPeerListener(onMessage);
    easyrtc.connect("easyrtc.instantMessaging");
}

new Loop(() => TWEEN.update()).start(app);

window.connect = connect
