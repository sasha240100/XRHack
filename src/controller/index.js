import '@hughsk/fulltilt/dist/fulltilt.js';

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
    const promiseRotation = new FULLTILT.getDeviceOrientation({ 'type': 'world' });
    const promiseMove = FULLTILT.getDeviceMotion();

    promiseRotation.then(controller => {
        // Store the returned FULLTILT.DeviceOrientation object
        controller.start(data => {
            const quat = controller.getFixedFrameQuaternion();
            //socket.emit('data-rotation', [quat.x, quat.y, quat.z, quat.w]);
            easyrtc.sendDataWS(otherEasyrtcid, "rotation", quat);
        })
    });

    promiseMove.then(deviceMotion => {
        deviceMotion.start(data => {
            const pos = deviceMotion.getScreenAdjustedAcceleration();
            //socket.emit('data-position', [pos.x, pos.y, pos.z]);
            console.log(pos);
            easyrtc.sendDataWS(otherEasyrtcid, "position", pos);
        })
    })
}

connect();
