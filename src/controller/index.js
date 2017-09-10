import '@hughsk/fulltilt/dist/fulltilt.js';


// --- start
import AR from 'ar.js/three.js/contribs/npm/build/ar.js';

import {PerspectiveCamera} from 'three';

const source = new AR.ArToolkitSource({
  sourceType: 'webcam'
});

const {sourceWidth, sourceHeight} = source.parameters;

const patternUrl = 'https://192.168.1.19:8443/assets/patt.hiro';
const cameraParametersUrl = 'https://192.168.1.19:8443/assets/camera_para.dat';

source.init(() => {
  console.log('source is ready');
});

const ctx = new AR.ArToolkitContext({
  detectionMode: 'mono',
  cameraParametersUrl,
  sourceWidth,
  sourceHeight
});

console.log(AR);

const obj = new PerspectiveCamera();

const controls = new AR.ArMarkerControls(ctx, obj, {
  type: 'pattern',
  patternUrl: patternUrl,
  changeMatrixMode: 'cameraTransformMatrix'
});

ctx.init(() => {
  console.log(obj);
  obj.projectionMatrix.fromArray(
    ctx.arController.getCameraMatrix()
  );
});


// --- end


var otherEasyrtcid = "";

function connect() {
    easyrtc.setRoomOccupantListener(setRoomOccupantListener);
    easyrtc.connect("easyrtc.instantMessaging", loginSuccess, loginFailure);
}

function setRoomOccupantListener(roomName, occupants, isPrimary) {
    for (var easyrtcid in occupants) {
        otherEasyrtcid = easyrtcid;
    }
}
//        setInterval(function() {
//            if(""!==otherEasyrtcid){
//                var text = Math.random();
//                easyrtc.sendDataWS(otherEasyrtcid, "message", text);
//            }
//        }, 1000);
function loginSuccess(easyrtcid) {
    var selfEasyrtcid = easyrtcid;
    document.getElementById("iam").innerHTML = "I am " + easyrtcid;

    emitter()
}
function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}

function emitter(){
    const promiseRotation = new FULLTILT.getDeviceOrientation({ 'type': 'game' });
    const promiseMove = FULLTILT.getDeviceMotion();

    promiseRotation.then(controller => {
        // Store the returned FULLTILT.DeviceOrientation object
        controller.start(data => {
            const quat = controller.getFixedFrameQuaternion();
            //socket.emit('data-rotation', [quat.x, quat.y, quat.z, quat.w]);
            easyrtc.sendDataWS(otherEasyrtcid, "rotation", quat);
        })
    });

    // promiseMove.then(deviceMotion => {
    //     deviceMotion.start(data => {
    //         const pos = deviceMotion.getScreenAdjustedAcceleration();
    //         //socket.emit('data-position', [pos.x, pos.y, pos.z]);
    //         console.log(pos);
    //         easyrtc.sendDataWS(otherEasyrtcid, "position", pos);
    //     })
    // })

    function update() {
      requestAnimationFrame(update);
      if (source.ready === false) return;
      ctx.update(source.domElement);
      // console.log(obj.position);
      easyrtc.sendDataWS(otherEasyrtcid, "position", obj.position);
    }

    update();
}

connect();
