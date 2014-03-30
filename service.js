var Leap = require("leapjs"),
	exec = require("child_process").exec;
//LeapTrainer = require("./lib/LeapTrainer").LeapTrainer;

var controller = new Leap.Controller();

var resolutionX = 0;
var resolutionY = 0;

var hTolerance = 100;
var vTolerance = 100;
var detect = true;
var start_flag=0;
var start_frame='';
var i=0;
var tot_fingers=0, avg_fingers;

controller.on("frame", function(frame) {
	if(detect) {
		if(frame.hands.length >= 1 ){
			if(tot_fingers>0){
				tot_fingers=Math.max(frame.fingers.length,tot_fingers);
			}
			if(start_flag === 0) {
				start_flag=1;
				start_frame=frame;
				tot_fingers=frame.fingers.length;

			}

			//swipe left-right
			if (Math.abs(frame.translation(start_frame)[0]) > hTolerance && start_flag === 1 ) {
				
				start_flag=0;
				detect = false;
				
					if(frame.translation(start_frame)[0] > 0) {
						//exec("wmctrl -r :ACTIVE: -t 1", function (err, stdout, stderr) {});
						if(tot_fingers>=4){
							exec(__dirname+"/win.sh l 5;", function (err, stdout, stderr) {});
						}
						if(tot_fingers<4){exec(__dirname+"/win.sh r;", function (err, stdout, stderr) {});}
						//console.log("right");
					} else {
						//console.log("left");
						if(tot_fingers>=4){
							exec(__dirname+"/win.sh r 5", function (err, stdout, stderr) {});
						}
						if(tot_fingers<4){
							exec(__dirname+"/win.sh l", function (err, stdout, stderr) {});
						}
					}
					
				
				setTimeout(function() {detect = true;}, 600);//enable it to receive next response after 500 msec only
			}
		
		//swipe up-down
		if (Math.abs(frame.translation(start_frame)[1]) > vTolerance && start_flag === 1) {
			start_flag=0;
			detect = false;
			//console.log(frame.fingers.length);
			if(frame.translation(start_frame)[1] > 0) {
				
				if(tot_fingers>=4){
					console.log("up");
				exec("wmctrl -v -r :ACTIVE: -b add,maximized_vert,maximized_horz;", function (err, stdout, stderr) {});
			}
			} else {
				if(tot_fingers>=4){
					console.log("down");
				exec("wmctrl -v -r :ACTIVE: -b remove,maximized_vert,maximized_horz;", function (err, stdout, stderr) {});
			}
			}
			setTimeout(function() {detect = true;}, 600);
		}
	}
	}
});

controller.on('connect', function() {
	console.log("connect");
});

controller.on('disconnect', function() {
	console.log("disconnect");
});

controller.on('deviceConnected', function() {
	console.log("deviceConnected");
});

controller.on('deviceDisconnected', function() {
	console.log("deviceDisconnected");
});



controller.connect();
console.log("\nWaiting for device to connect...");
