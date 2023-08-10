var Game = {
  start: function () {
    //Get context
    this.canvas = document.getElementById("game")
    this.ctx = this.canvas.getContext("2d");
    this.canvas.height = 270;
    this.canvas.width = 480;
  },
  render: function (env) {
    console.log("Attempting rendering of bgimage")
    this.ctx.drawImage(env.bgimage, 0, 0, env.bgimage.width, env.bgimage.height, 0, 0, this.canvas.width, this.canvas.height)
  }
}
var Island = class {
  getbgimage = function(){
    var img = new Image()
    img.src = "gfx/sky/carnival.png"
    return img
  }
}
class Env{
  island = null
  constructor(){
  }
}
var env = new Env()
env.island = new Island()
env.bgimage = new Image()
env.bgimage.onload = (e) => {
  Game.render(env)
}
env.bgimage.src = "gfx/sky/carnival.png"
//document.body.appendChild(env.bgimage)
console.log(env.bgimage)
Game.start()
Game.render(env)