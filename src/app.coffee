# standard Express initialization
express = require "express"
app = express()
server = require("http").Server app

port = process.env.PORT or 3000

app.get "/", (req, res) ->
  res.sendFile "#{__dirname}/views/index.html"

app.use "/", express.static("#{__dirname}/public")

server.listen port, ->
  console.log "server is listening on port: #{port}"

# list of players connected
sockets = {}
# list of those that quited
removals = []

# Player class represents player state in a game and is also handling the events
class Player
  constructor: () ->
    # randomize initial position
    @x = Math.random() * 235
    @y = Math.random() * 235
    @keys = {
      left: "keyup"
      right: "keyup"
      down: "keyup"
      up: "keyup"
    }
    @updated = yes

  # randomize speed between values 1 and 3
  speed: Math.random() * 2 + 1

  events: (data) ->
    # apply key states to this entity
    for key, val of data.keys
      @keys[key] = val

  update: () ->
    if @keys.left is "keydown"
      @x -= @speed
      @updated = yes
    else if @keys.right is "keydown"
      @x += @speed
      @updated = yes

    if @keys.up is "keydown"
      @y -= @speed
      @updated = yes
    else if @keys.down is "keydown"
      @y += @speed
      @updated = yes

# socket.io setup
io = require("socket.io") server, {}

io.sockets.on "connection", (socket) ->
  console.log "player connected with id: #{socket.id}"
  socket.x = 0
  socket.y = 0
  socket.player = new Player()
  sockets[socket.id] = socket


  socket.on "disconnect", ->
    console.log "player disconnected"
    delete sockets[socket.id]
    removals.push socket.id

  socket.on "events", (data) ->
    # receive events from a player and act upon them
    socket.player.events(data)

  data = {
    positions: []
  }
  for k,s of sockets
    data.positions.push
      id: s.id
      x: s.player.x
      y: s.player.y

  socket.emit "render", data

# this is main game loop
setInterval (->
  # prepare data object that will be sent to every player
  data = {
    positions: []
  }
  data.removals = removals

  for k, s of sockets
    s.player.update()
    if s.player.updated
      s.player.updated = no
      # some data on this player has changed
      # so we are adding it to data object
      # that will be emmited to every player later
      data.positions.push
        id: s.id
        x: s.player.x
        y: s.player.y

  for k, s of sockets
    # this will cause executing a 'render' part on the client side
    # (with appropriate data)
    s.emit "render", data

  if removals.length > 0
    removals = []

), 1000 / 25