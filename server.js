/**
 * Created with JetBrains WebStorm.
 * User: rohitghatol
 * Date: 6/29/13
 * Time: 3:10 PM
 * To change this template use File | Settings | File Templates.
 */

var express = require('express')
    , app = express()
    , server = require("http").createServer(app);
    var arDrone = require('ar-drone');
    var client = arDrone.createClient();

app.use(express.static(__dirname + '/public'));

require("./drone/camera-feed");
require("./drone/controller");

var control = arDrone.createUdpControl();

setInterval(function() {
  // The emergency: true option recovers your drone from emergency mode that can
  // be caused by flipping it upside down or the drone crashing into something.
  // In a real program you probably only want to send emergency: true for one
  // second in the beginning, otherwise your drone may attempt to takeoff again
  // after a crash.
  control.ref({fly: true, emergency: false});
  // This command makes sure your drone hovers in place and does not drift.
  control.pcmd();
  // This causes the actual udp message to be send (multiple commands are
  // combined into one message)
  control.flush();
}, 30);

app.get('/control/:command', function(req,res){
	var command = req.params.command;
	switch(command){
		case "takeoff":
			console.log("takeoff");
			client
				.after(100, function(){
					client.calibrate(0);
				})
            	.after(100, function(){
					client.takeoff();
					client.animateLeds('blinkRed', 5, 2);
				});
			break;

    case "forward":
      client.forward(0.25);
      setTimeout(function(){
        client.forward(0);
      }, 500);
      break;

    case "back":
      client.back(0.25);
      setTimeout(function(){
        client.back(0);
      }, 500);
      break;

		case "turn-left":
			client.counterClockwise(0.40);
      client.back(0.1);
      setTimeout(function(){
        client.counterClockwise(0);
        client.back(0);
      })
			console.log("turn-left");
			break;

		case "turn-right":
			client.clockwise(0.40);
      client.back(0.1)
      setTimeout(function(){
        client.clockwise(0);
        client.back(0);
      }, 500);
			console.log("turn-right");
			break;

		case "land":
			console.log("land");
			client.land();
			break;

		case "battery":
			var batteryLvl = client.battery();
			console.log("Battery: " + batteryLvl)

	}
	res.send();
});



app.listen(3050);
