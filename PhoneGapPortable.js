var PhoneGapPortable = {
    acceleration:{
        x:undefined,
        y:undefined,
        z:undefined,
        timestamp: undefined
    }
};
window.addEventListener('devicemotion', function (e) {
    if(e.acceleration != null){
        PhoneGapPortable.acceleration.x = e.acceleration.x/30;
        PhoneGapPortable.acceleration.y = e.acceleration.y/30;
        PhoneGapPortable.acceleration.z = e.acceleration.z/30;
    }else{
        PhoneGapPortable.acceleration.x = e.accelerationIncludingGravity.x/30;
        PhoneGapPortable.acceleration.y = e.accelerationIncludingGravity.y/30;
        PhoneGapPortable.acceleration.z = e.accelerationIncludingGravity.z/30;
    }
    PhoneGapPortable.acceleration.timestamp = new Date().getTime();
}, false);
navigator.accelerometer = {};
navigator.accelerometer.getCurrentAcceleration = function(onSuccess, onError){
    if (window.DeviceMotionEvent == undefined) {
        setTimeout(function(){
            onError();
        },1);
        return false;
    }else{
        if(PhoneGapPortable.acceleration.timestamp == undefined){
            setTimeout(function(){
                onError();
            },1);
            return false;
        }else{
            setTimeout(function(){
                onSuccess(PhoneGapPortable.acceleration);
            },1);
            return true;
        }
    }
}
navigator.accelerometer.watchAcceleration = function(onSuccess, onError, options){
    if (window.DeviceMotionEvent == undefined) {
        setTimeout(function(){
            onError();
        },1);
        return false;
    }else{
        if(options.frequency == undefined){
            options.frequency = 10000;
        }
        return setInterval(function(){
            onSuccess(PhoneGapPortable.acceleration);
        }, options.frequency);
    }
}
navigator.accelerometer.clearWatch = function(watchID){
    clearInterval(watchID);
}

navigator.notification = {};
navigator.notification.alert = function(message, alertCallback, title, buttonName){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:427/alert',
        data: JSON.stringify({
            message: message,
            title: title,
            button: buttonName
        }),
        dataType: "json",
        success: alertCallback
    });
}
alert = navigator.notification.alert;
navigator.notification.confirm = function(message, confirmCallback, title, ButtonLabels){
    console.log(ButtonLabels);
    ButtonLabels = ButtonLabels.split(",");
    $.ajax({
        type: 'POST',
        url: 'http://localhost:427/confirm',
        data: JSON.stringify({
            message: message,
            title: title,
            button: ButtonLabels[0],
            otherbutton: ButtonLabels[1]
        }),
        dataType: "json",
        success: function(data){
            console.log(data["answer"]);
            confirmCallback(data.answer);
        }
    });
}
confirm = navigator.notification.confirm;
navigator.notification.vibrate = function(time){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:427/vibrate',
        dataType: "json",
        data: JSON.stringify({
            time: time
        })
    });
}
$.ajax({
    type: 'POST',
    url: 'http://localhost:427/device',
    data: "{}",
    dataType: "json",
    success: function(data){
        window.device = data;
    }
});
