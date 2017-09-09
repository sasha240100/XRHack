import '@hughsk/fulltilt/dist/fulltilt.js';
import GyroNorm from 'gyronorm';

import io from 'socket.io-client';

const gyro = new GyroNorm();
const socket = io(`${window.NET_IP || '192.168.1.19'}:3000`);

// console.log(socket);

// socket.emit('message', 'hello');

// debugger;

gyro.init().then(() => {
  gyro.start(data => {
    console.log(data);
    socket.emit('data', [data.do.alpha, data.do.beta, data.do.gamma]);

    // Process:
    // data.do.alpha	( deviceorientation event alpha value )
    // data.do.beta		( deviceorientation event beta value )
    // data.do.gamma	( deviceorientation event gamma value )
    // data.do.absolute	( deviceorientation event absolute value )

    // data.dm.x		( devicemotion event acceleration x value )
    // data.dm.y		( devicemotion event acceleration y value )
    // data.dm.z		( devicemotion event acceleration z value )

    // data.dm.gx		( devicemotion event accelerationIncludingGravity x value )
    // data.dm.gy		( devicemotion event accelerationIncludingGravity y value )
    // data.dm.gz		( devicemotion event accelerationIncludingGravity z value )

    // data.dm.alpha	( devicemotion event rotationRate alpha value )
    // data.dm.beta		( devicemotion event rotationRate beta value )
    // data.dm.gamma	( devicemotion event rotationRate gamma value )
  });
}).catch(e => {
  alert(e)
  // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
});
