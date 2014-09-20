/**
 * Created with JetBrains WebStorm.
 * User: rohitghatol
 * Date: 6/29/13
 * Time: 6:32 PM
 * To change this template use File | Settings | File Templates.
 */

var io = require('socket.io').listen(3002);
io.set('log level', 1);

io.sockets.on('connection', function (socket) {
    var arDrone = require('ar-drone');
    var client = arDrone.createClient();

    setInterval(function(){
        var batteryLevel = client.battery();
        socket.emit('event', { name: 'battery',value: batteryLevel});
    },1000);

    socket.on('event', function (data) {
        if(data.name=="stop"){
            console.log("Browser asked Ar Drone to Stay and Hover");
            client.stop();
        }else {
            if(data.name=="takeoff"){
                console.log("Browser asked Ar Drone to Take Off");
                client.takeoff();
                client.calibrate(0);
            }
            if(data.name=="spin"){
                console.log("Browser asked Ar Drone to Start Spinning");
                client.clockwise(0.1);
            }
            if(data.name=="land"){
                console.log("Browser asked Ar Drone to Land");
                client.land();
            }
            if(data.name=="forward"){
                console.log("Browser asked Ar Drone to Land");
                client.forward(0.1);
            }
            if(data.name=="backward"){
                console.front("Browser asked Ar Drone to Land");
                client.back(0.1);
            }
            if(data.name=="up"){
                console.front("Browser asked Ar Drone to Land");
                client.up(0.1);
            }
            if(data.name=="down"){
                console.front("Browser asked Ar Drone to Land");
                client.down(0.1);
            }
        }

    });
});
