import '@hughsk/fulltilt/dist/fulltilt.js';
import AR from 'ar.js/three.js/contribs/npm/build/ar.js';
import GyroNorm from 'gyronorm';

import {Object3D} from 'three';

import io from 'socket.io-client';

// const gyro = new GyroNorm();
console.log(window.NET_IP);
const socket = io(`${window.NET_IP || '192.168.1.19'}:3000`);

const promiseRotation = new FULLTILT.getDeviceOrientation({ 'type': 'game' });
// const promiseMove = FULLTILT.getDeviceMotion();

promiseRotation.then(controller => {
  // Store the returned FULLTILT.DeviceOrientation object
  controller.start(data => {
    const quat = controller.getFixedFrameQuaternion();
    socket.emit('data-rotation', [quat.x, quat.y, quat.z, quat.w]);
  })
});

const source = new AR.ArToolkitSource({
  sourceType: 'webcam'
});

const {sourceWidth, sourceHeight} = source.parameters;

const patternUrl = './patt.hiro';
const cameraParametersUrl = './camera_para.dat';

source.init(() => {
  console.log('source is ready');
});

const ctx = new AR.ArToolkitContext({
  detectionMode: 'mono',
  cameraParametersUrl,
  sourceWidth,
  sourceHeight
});

console.log(ctx);

const obj = new Object3D();

const controls = new AR.ArMarkerControls(ctx, obj, {
  type: 'pattern',
  patternUrl: patternUrl,
  changeMatrixMode: 'cameraTransformMatrix'
});

ctx.init(() => {
  obj.projectionMatrix.fromArray(
    ctx.arController.getCameraMatrix()
  );
});

function update() {
  requestAnimationFrame(update);
  if (source.ready === false) return;
  ctx.update(source.domElement);
  socket.emit('data-position', [obj.position.x, obj.position.y, obj.position.z]);
  console.log(obj.position);
}

update();
