import {Importer, MeshComponent, Group} from 'whs';
import {MeshBasicMaterial, DoubleSide, Color} from 'three';
import io from 'socket.io-client';

const socket = io('192.168.1.19:3000');

import {OBJLoader} from '../lib/OBJLoader';
import {app, camera} from '../app';

import MTLModule from '../modules/MTLModule';

export const placementGroup = new Group();
placementGroup.position.set(10, 5, -5);
placementGroup.addTo(app);

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

  scale: [scale, scale, scale]
}).addTo(placementGroup).then(controller => {
  const degToRad = (deg) => deg / 180 * Math.PI;

  socket.on('update', data => {

    controller.rotation.set(
      degToRad(data[0]),
      degToRad(data[1]),
      degToRad(data[2])
    );
  })
});;
