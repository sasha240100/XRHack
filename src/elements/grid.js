import {MeshComponent} from 'whs';
import {MeshBasicMaterial, GridHelper} from 'three';

import {app} from '../app';

const grid = MeshComponent.from(
  new GridHelper(100, 200)
);

grid.addTo(app);
