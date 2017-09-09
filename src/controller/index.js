import '@hughsk/fulltilt/dist/fulltilt.js';
import GyroNorm from 'gyronorm';

import io from 'socket.io-client';

// const gyro = new GyroNorm();
const socket = io(`${window.NET_IP || '192.168.1.19'}:3000`);

const promiseRotation = new FULLTILT.getDeviceOrientation({ 'type': 'world' });
// const promiseMove = FULLTILT.getDeviceMotion();

promiseRotation.then(controller => {
  // Store the returned FULLTILT.DeviceOrientation object
  controller.start(data => {
    const quat = controller.getFixedFrameQuaternion();
    socket.emit('data-rotation', [quat.x, quat.y, quat.z, quat.w]);
  })
});

// promiseMove.then(deviceMotion => {
//   deviceMotion.start(data => {
//     const pos = deviceMotion.getScreenAdjustedAcceleration();
//     socket.emit('data-position', [pos.x, pos.y, pos.z]);
//   })
// })
