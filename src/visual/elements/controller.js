import {Importer, MeshComponent, Group} from 'whs';
import {MeshBasicMaterial, DoubleSide, Color, AxisHelper} from 'three';
import io from 'socket.io-client';

const socket = io(`${window.NET_IP || '192.168.1.19'}:3000`);

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
  const degToRad = (deg) => deg / 180 * Math.PI;


  socket.on('update-rotation', data => {
    fixGroup.quaternion.set(
      data[0],
      data[2],
      -data[1],
      data[3]
    );
  })

  socket.on('update-position', pos => {
    fixGroup.position.set(pos[0], pos[1], pos[2])
  });
});;
