import {
  App,
  ElementModule,
  SceneModule,
  DefineModule,
  RenderingModule,
  PerspectiveCamera,
  ResizeModule,
  OrbitControlsModule,
  Group
} from 'whs';

// import * as VRKit from 'whs/modules/VRKit.js';

export const camera = new PerspectiveCamera({
  position: [0, 0, 5]
});

const cameraGroup = new Group(camera);
cameraGroup.position.set(0, 5, 5);

export const app = new App([
  new ElementModule(),
  new SceneModule(),

  new DefineModule('camera', camera),

  new RenderingModule({bgColor: 0xe7e7e7}),
  new OrbitControlsModule(),
  new ResizeModule(),
  // new VRKit.VR2Module()
]);

cameraGroup.addTo(app);

// app.module(
//   new VRKit.VRControls({
//     object: app.get('camera'),
//     intensity: 10
//   })
// )

app.start();
