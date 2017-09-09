import {Importer, MeshComponent} from 'whs';
import {MeshBasicMaterial, DoubleSide, Color} from 'three';

import {OBJLoader} from '../lib/OBJLoader';
import {app, camera} from '../app';

import MTLModule from '../modules/MTLModule';


// new Box({
//   geometry: [10, 1, 4],
//   material: new MeshBasicMaterial({color: 0xff0000}),
//   scale: [0.2, 0.2, 0.2],
//   position: [0, 5, 0]
// }).addTo(app);

const scale = 0.01;

console.log(camera.native);

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
  position: [10, 5, -5]
}).addTo(app).then(obj => console.log(obj));
