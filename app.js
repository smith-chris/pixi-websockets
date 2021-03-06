// Generated by CoffeeScript 1.12.1
var Player, app, express, io, port, removals, server, sockets;

express = require("express");

app = express();

server = require("http").Server(app);

port = process.env.PORT || 3000;

app.get("/", function(req, res) {
  return res.sendFile(__dirname + "/views/index.html");
});

app.use("/", express["static"](__dirname + "/public"));

server.listen(port, function() {
  return console.log("server is listening on port: " + port);
});

sockets = {};

removals = [];

Player = (function() {
  function Player() {
    this.x = Math.random() * 235;
    this.y = Math.random() * 235;
    this.keys = {
      left: "keyup",
      right: "keyup",
      down: "keyup",
      up: "keyup"
    };
    this.updated = true;
  }

  Player.prototype.speed = Math.random() * 2 + 1;

  Player.prototype.events = function(data) {
    var key, ref, results, val;
    ref = data.keys;
    results = [];
    for (key in ref) {
      val = ref[key];
      results.push(this.keys[key] = val);
    }
    return results;
  };

  Player.prototype.update = function() {
    if (this.keys.left === "keydown") {
      this.x -= this.speed;
      this.updated = true;
    } else if (this.keys.right === "keydown") {
      this.x += this.speed;
      this.updated = true;
    }
    if (this.keys.up === "keydown") {
      this.y -= this.speed;
      return this.updated = true;
    } else if (this.keys.down === "keydown") {
      this.y += this.speed;
      return this.updated = true;
    }
  };

  return Player;

})();

io = require("socket.io")(server, {});

io.sockets.on("connection", function(socket) {
  var data, k, s;
  console.log("player connected with id: " + socket.id);
  socket.x = 0;
  socket.y = 0;
  socket.player = new Player();
  sockets[socket.id] = socket;
  socket.on("disconnect", function() {
    console.log("player disconnected");
    delete sockets[socket.id];
    return removals.push(socket.id);
  });
  socket.on("events", function(data) {
    return socket.player.events(data);
  });
  data = {
    positions: []
  };
  for (k in sockets) {
    s = sockets[k];
    data.positions.push({
      id: s.id,
      x: s.player.x,
      y: s.player.y
    });
  }
  return socket.emit("render", data);
});

setInterval((function() {
  var data, k, s;
  data = {
    positions: []
  };
  data.removals = removals;
  for (k in sockets) {
    s = sockets[k];
    s.player.update();
    if (s.player.updated) {
      s.player.updated = false;
      data.positions.push({
        id: s.id,
        x: s.player.x,
        y: s.player.y
      });
    }
  }
  for (k in sockets) {
    s = sockets[k];
    s.emit("render", data);
  }
  if (removals.length > 0) {
    return removals = [];
  }
}), 1000 / 25);
