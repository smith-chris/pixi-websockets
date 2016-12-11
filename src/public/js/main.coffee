(->
  # standard Pixi initialization
  renderer = PIXI.autoDetectRenderer(256, 256, backgroundColor: "#fff")

  # append Canvas element to DOM
  document.body.appendChild(renderer.view)

  # create base container that wil contain all rendered elements
  stage = new PIXI.Container()

  bunnyTexture = PIXI.Texture.fromImage("/images/bunny.png")


  keymap = {
    ".": "up"
    "o": "left"
    "e": "down"
    "u": "right"
    "ArrowUp": "up"
    "ArrowLeft": "left"
    "ArrowDown": "down"
    "ArrowRight": "right"
  }

  events = {}
  state = {
    keys: {}
  }

  document.addEventListener "keydown", ( (e) ->
    keyName = keymap[e.key]
    if keyName
      # pressed key is in our keymap
      if(not state.keys[keyName]) or state.keys[keyName] is "keyup"
        # key has not been pressed yet or its state is 'keyup'
        events.keys ?= {}
        events.keys[keyName] = state.keys[keyName] = "keydown"
        events.triggered = yes
  ), no

  document.addEventListener "keyup", ( (e) ->
    keyName = keymap[e.key]
    if keyName
      # pressed key is in our keymap
      events.keys ?= {}
      events.keys[keyName] = state.keys[keyName] = "keyup"
      events.triggered = yes
  ), no

  socket = io()
  children = []

  socket.on "render", (data) ->
    if data.removals
      # id list of players that quited the game have to be removed
      for id in data.removals
        child = children[id]
        if child
          stage.removeChild(child)
          delete children[id]
    # new positions with id attached
    for e in data.positions
      child = children[e.id]
      if not child
        # child not found by id - create new one
        stage.addChild(child = new PIXI.Sprite(bunnyTexture))
        children[e.id] = child
      child.position.x = e.x
      child.position.y = e.y
    renderer.render(stage)
    if events.triggered
      # thanks to this procedural implementation of events
      # multiple events will be sent in one package
      events.triggered = no
      socket.emit "events", events
      events = {}
)()