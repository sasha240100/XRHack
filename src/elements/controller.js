import {Box} from 'whs';
import {MeshBasicMaterial} from 'three';

import {app} from '../app';

new Box({
  geometry: [10, 1, 4],
  material: new MeshBasicMaterial({color: 0xff0000}),
  scale: [0.2, 0.2, 0.2],
  position: [0, 5, 0]
}).addTo(app);
