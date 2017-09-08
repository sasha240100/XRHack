import {Box} from 'whs';
import {MeshBasicMaterial} from 'three';

import {app} from '../app';

new Box({
  geometry: [1, 1, 1],
  material: new MeshBasicMaterial({color: 0x00ff00})
}).addTo(app);
