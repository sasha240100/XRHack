import '@hughsk/fulltilt/dist/fulltilt.js';


// --- start
import AR from 'ar.js/three.js/contribs/npm/build/ar.js';

import {
  PerspectiveCamera,
  Object3D,
  Vector3,
  Scene,
  WebGLRenderer,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial
} from 'three';

const scene = new Scene();
const renderer = new WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(window.innerWidth / window.innerHeight);
// const camera1 = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// camera1.lookAt(new Vector3(0, 0, 10));

const sphere = new Mesh(
  new SphereGeometry(1, 32, 32),
  new MeshBasicMaterial({color: 0xffffff})
);

// sphere.position.set(0, 0, 10);

scene.add(sphere);

document.body.appendChild(renderer.domElement);

function render() {
  requestAnimationFrame(render);
  // console.log(camera.position);/
  renderer.render(scene, camera);
}

render();

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



const controls = new AR.ArMarkerControls(ctx, camera, {
  type: 'pattern',
  patternUrl: patternUrl,
  changeMatrixMode: 'cameraTransformMatrix'
});

const smoothedRoot = new Object3D();
const smoothedControls = new AR.ArSmoothedControls(smoothedRoot, {
  lerpPosition: 0.4,
  lerpQuaternion: 0.3,
  lerpScale: 1
});

ctx.init(() => {
  console.log(camera);
  camera.projectionMatrix.fromArray(
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
    // document.getElementById("iam").innerHTML = "I am " + easyrtcid;

    emitter()
}
function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}

function emitter(){
    const promiseRotation = new FULLTILT.getDeviceOrientation({ 'type': 'game' });
    const promiseMove = FULLTILT.getDeviceMotion();

    promiseRotation.then(controller => {
        // Store the returned FULLTILT.DeviceOrientation cameraect
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
      smoothedControls.update(camera);
      camera.projectionMatrix.copy(ctx.getProjectionMatrix());
      // console.log(ctx.getProjectionMatrix().elements);
      // console.log(camera.position);
      // easyrtc.sendDataWS(otherEasyrtcid, "position", camera.position);
    }

    setInterval(() => {
      easyrtc.sendDataWS(otherEasyrtcid, "position", smoothedRoot.position);
    }, 100);

    update();
}

connect();
