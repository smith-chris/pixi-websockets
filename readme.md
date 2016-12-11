# Pixi-Websockets

 Minimal example of multiplayer game using pixi.js as a renderer on top of node.js and socket.io. 
 It is meant to be as simple as possible. No sprinkles there :)
 
 All game logic is executed at the server side and only state is sent to the client.
 
 The client responsibility is to render state correctly, listen for an user input and send it back to server. 

## Installation

If you don't want to use coffeescript or pug, skip first part of installation and delete **/src** directory. 

If you have the node package manager, npm, installed:
```sh
npm install -g coffee-script pug
```

Then enter cloned repository and install local dependencies:
```sh
npm install
```

## Usage

To start a server just run:

```sh
node app
```
Then open 'localhost:3000' in multiple browser tabs and see the magic happens :)

If you decide to develop using coffeescript and pug run this watch command before editing files:
```sh
npm run watch-all
```
Source code is in **/src** directory.

## Demo

It might take a while to run because this is using free tier.

http://nodejs-smithchris.rhcloud.com/

## Support

Please [open an issue](https://github.com/fraction/readme-boilerplate/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/fraction/readme-boilerplate/compare/).