// Generated by CoffeeScript 1.12.1
(function() {
  var bunnyTexture, children, events, keymap, renderer, socket, stage, state;
  renderer = PIXI.autoDetectRenderer(256, 256, {
    backgroundColor: "#fff"
  });
  document.body.appendChild(renderer.view);
  stage = new PIXI.Container();
  bunnyTexture = PIXI.Texture.fromImage("/images/bunny.png");
  keymap = {
    ".": "up",
    "o": "left",
    "e": "down",
    "u": "right",
    "ArrowUp": "up",
    "ArrowLeft": "left",
    "ArrowDown": "down",
    "ArrowRight": "right"
  };
  events = {};
  state = {
    keys: {}
  };
  document.addEventListener("keydown", (function(e) {
    var keyName;
    keyName = keymap[e.key];
    if (keyName) {
      if ((!state.keys[keyName]) || state.keys[keyName] === "keyup") {
        if (events.keys == null) {
          events.keys = {};
        }
        events.keys[keyName] = state.keys[keyName] = "keydown";
        return events.triggered = true;
      }
    }
  }), false);
  document.addEventListener("keyup", (function(e) {
    var keyName;
    keyName = keymap[e.key];
    if (keyName) {
      if (events.keys == null) {
        events.keys = {};
      }
      events.keys[keyName] = state.keys[keyName] = "keyup";
      return events.triggered = true;
    }
  }), false);
  socket = io();
  children = [];
  return socket.on("render", function(data) {
    var child, e, i, id, j, len, len1, ref, ref1;
    if (data.removals) {
      ref = data.removals;
      for (i = 0, len = ref.length; i < len; i++) {
        id = ref[i];
        child = children[id];
        if (child) {
          stage.removeChild(child);
          delete children[id];
        }
      }
    }
    ref1 = data.positions;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      e = ref1[j];
      child = children[e.id];
      if (!child) {
        stage.addChild(child = new PIXI.Sprite(bunnyTexture));
        children[e.id] = child;
      }
      child.position.x = e.x;
      child.position.y = e.y;
    }
    renderer.render(stage);
    if (events.triggered) {
      events.triggered = false;
      socket.emit("events", events);
      return events = {};
    }
  });
})();