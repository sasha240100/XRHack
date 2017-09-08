import {
  App,
  ElementModule,
  SceneModule,
  DefineModule,
  RenderingModule,
  PerspectiveCamera,
  OrbitControlsModule
} from 'whs';

export const app = new App([
  new ElementModule(),
  new SceneModule(),
  new DefineModule('camera', new PerspectiveCamera({
    position: [0, 0, 5]
  })),
  new RenderingModule(),
  new OrbitControlsModule()
]);

app.start();
