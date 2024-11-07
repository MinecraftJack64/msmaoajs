var BIGSCALE = 5

class Debugger {
  static log(msg, type = "other") {
    console.log(msg)
  }
}

class SpanSet {
  proverse = []
  anverse = []
  prox = 0
  anx = 0
  direction = 0
  begin() {
    prox = 0
    direction = 1
  }
  end() {
    anx = anverse.length - 1
    direction = -1
  }
  testnext(val) {
    if (proverse[prox].start) { }
  }
  add(entry) {
    if (proverse.length == 0 || entry.start > proverse[proverse.length - 1].start) {
      proverse.push(entry)
    } else if (proverse[0].start < entry.start) {
      proverse.unshift(entry)
    } else {
      let id = 0
      while (entry.start > proverse[id].start) {
        id++
      }
      proverse.splice(id, 0, entry)
    }
    if (anverse.length == 0 || entry.end > anverse[anverse.length - 1].end) {
      anverse.push(entry)
    } else if (anverse[0].end < entry.end) {
      anverse.unshift(entry)
    } else {
      let id = 0
      while (entry.end > anverse[id].end) {
        id++
      }
      anverse.splice(id, 0, entry)
    }
  }
}



function drawdot(os){
  
}
class Input {
  static keys = []
  static clicksubscribers = []
  static touches = {}
  static mousedown = false
  static updatedevpane() {
    document.getElementById("Devout").innerHTML = "Mouse position: (" + Input.mousex + ", " + Input.mousey + "); Mouse down? " + Input.mousedown + "; Keys currently pressed down: " + Input.keys
  }
  static getmousepos(evt) {//Positional
    var rect = Game.canvas.getBoundingClientRect();
    this.mousex = (evt.clientX - rect.left)*Game.canvas.width/rect.width/BIGSCALE;
    this.mousey = (evt.clientY - rect.top)*Game.canvas.height/rect.height/BIGSCALE;
    Input.updatedevpane()
    this.notifyClick("mousemove")
  }
  static keydown(evt) {
    if (this.keys.indexOf(evt.key) == -1) {
      this.keys.push(evt.key)
    }
    Input.updatedevpane()
  }
  static keyup(evt) {
    if (this.keys.indexOf(evt.key) >= 0) {
      this.keys.splice(this.keys.indexOf(evt.key), 1)
    }
    Input.updatedevpane()
  }
  static touchstart(evt) {
    Input.updatedevpane()
  }
  static addClickListener(obj) {
    this.clicksubscribers.push(obj)
  }
  static removeClickListener(obj) {
    this.clicksubscribers.splice(this.clicksubscribers.indexOf(obj), 1)
  }
  static notifyClick(action){
    for(var i = 0; i < this.clicksubscribers.length; i++){
      this.clicksubscribers[i].notify(action, this.mousex, this.mousey)
    }
  }
  static init() {
    //Init key detection
    document.addEventListener('keydown', this.keydown.bind(this))
    document.addEventListener('keyup', this.keyup.bind(this))

    //Init mouse detection
    document.addEventListener("mousemove", this.getmousepos.bind(this))
    document.addEventListener("mousedown", (function(e) { this.mousedown = true; Input.updatedevpane(); this.notifyClick("click") }).bind(this))
    document.addEventListener("mouseup", (function(e) { this.mousedown = false; Input.updatedevpane(); this.notifyClick("unclick") }).bind(this))

    //Init touch detection
    //Init wheel detection
    //addEventListener("wheel", (event) => {env.screenpanner.size+=event.deltaY/500;Game.render()});
  }
}
class Game {
  static start() {
    //Get context
    this.canvas = document.getElementById("game")
    Game.ctx = this.canvas.getContext("2d");
    this.canvas.height = 270 * BIGSCALE;
    this.canvas.width = 480 * BIGSCALE;
    this.canvas.style.aspectRatio = '16 / 9';
    this.canvas.style.width = '100%';

    Input.init()
  }
  static render() {
    env.resetrender()
    Debugger.log("Game render called", "event")
    //background
    Game.ctx.drawImage(env.bgimage, 0, 0, env.bgimage.width, env.bgimage.height, -1 * (Game.canvas.width / 2) / BIGSCALE, -1 * (Game.canvas.height / 2) / BIGSCALE, Game.canvas.width / BIGSCALE, Game.canvas.height / BIGSCALE)
    //focal island
    env.resettransform(true)
    env.island.render(env)
    //griditems
    for (var i = 0; i < env.island.local.griditems.length; i++) {
      Debugger.log('Rendering Grid item: ' + env.island.local.griditems[i], "event")
      env.island.local.griditems[i].render(env)
    }
    if(env.ui){env.ui.render(env)}//render the master menu(UI)
    if(env.menuset.length>0){env.menuset[env.menuset.length-1].render(env)}//render the topmost menu
    for(var i = 0; i < env.popupset.length; i++){//render popups
      env.popupset[i].render(env)
    }
    env.resettransform(false)
    //locstion crosshair
    let mousex = Input.mousex-env.coordinatewidth/2, mousey = Input.mousey-env.coordinateheight/2;
    Game.ctx.drawImage(env.devtools.crosshair, 0, 0, env.devtools.crosshair.width, env.devtools.crosshair.height, -1 * env.devtools.crosshair.width / 4+mousex, -1 * env.devtools.crosshair.height / 4+mousey, env.devtools.crosshair.width/2, env.devtools.crosshair.height/2)
    Game.ctx.fillStyle = "gray"
    Game.ctx.fillRect(0, 0, mousex, mousey)
    //crosshair(temporary)
    Game.ctx.transform(0.3, 0, 0, 0.3, 0, 0)
    Game.ctx.globalAlpha = 0.5
    Game.ctx.drawImage(env.devtools.crosshair, 0, 0, env.devtools.crosshair.width, env.devtools.crosshair.height, -1 * env.devtools.crosshair.width / 2, -1 * env.devtools.crosshair.height / 2, env.devtools.crosshair.width, env.devtools.crosshair.height)
    for (var t of env.devtools.miscrenderers) { t.render(env) }
    Debugger.log("Game render success")
    //window.requestAnimationFrame(Game.render, env);
  }
}

var TSIZE = 1
var TX = 10
var TY = 10
//import * as mypaths from './st/tracks/cloud/loader.js'


class Env {
  island = null
  menuset = []
  ui = null
  popupset = []
  screenpanner = {
    x: 0,
    y: 0,
    size: 1,
    rot: 0
  }
  resettransform(usepanner) {
    Game.ctx.setTransform(BIGSCALE, 0, 0, BIGSCALE, this.width / 2, this.height / 2)//A coordinate multiplies by BIGSCALE and adds by half the width and height to get to the actual location in the canvas
    if (usepanner) {
      Game.ctx.transform(this.screenpanner.size, 0, 0, this.screenpanner.size, this.screenpanner.x, this.screenpanner.y)//coordinates will also multiply by the control size and add by the control location if they are on the island
      Game.ctx.rotate((this.screenpanner.rot) * Math.PI / 180)
    }
  }
  reversetransformonpoint(usepanner, pos) {
    let s = this.screenpanner.size
    let x = pos.x
    let y = pos.y
    if (usepanner) {
      x -= this.screenpanner.x
      y -= this.screenpanner.y
      x /= s
      y /= s
    }
    x -= this.width / 2
    y -= this.height / 2
    x /= BIGSCALE
    y /= BIGSCALE
    return { x: x, y: y }
  }
  gettargetlocation(pos){
    return {x:pos.x*BIGSCALE+this.width/2, y:pos.y*BIGSCALE+this.height/2}
  }
  gettargetlocationfromisland(pos){
    let s = this.gettargetlocation(pos)
    return {x:s.x*this.screenpanner.size+this.screenpanner.x, y:s.y*this.screenpanner.size+this.screenpanner.y}
  }
  gettargetfrommonster(pos){
    let s = this.gettargetlocation(pos)
  }
  transformobject(pos) {
    Game.ctx.transform(pos.size, 0, 0, pos.size, pos.x, pos.y)//Position on island
    Game.ctx.scale((pos.xs || 1), (pos.ys || 1))
  }
  resetrender() {
    Game.ctx.globalAlpha = 1
    this.resettransform(false)
  }
  constructor() {
    this.devtools.crosshair = new Image()
    this.devtools.crosshair.src = 'https://upload.wikimedia.org/wikipedia/commons/9/95/Crosshairs_Red.svg'
    this.width = Game.canvas.width
    this.height = Game.canvas.height
    this.coordinatewidth = this.width/BIGSCALE;
    this.coordinateheight = this.height/BIGSCALE;
  }
  devtools = {
    miscrenderers: []
  }
}
Game.start()
var env = new Env()
env.island = new Island({ env: env, type: 'Island/arcanic' })

env.bgimage = new Image()
env.bgimage.onload = (e) => {
  Game.render(env)
}
env.bgimage.src = env.island.getbgimage()

var monsstorrm = new Monster({ typemini: "cc/storrm", env: env })
var monsstorrm2 = new Monster({ typemini: "cc/storrm", env: env })
var monsbruc = new Monster({ typemini: "cc/bruc", env: env })
var monsbruc2 = new Monster({ typemini: "cc/bruc", env: env })
//var monssnail = new Monster({typemini:"nn/snail",env:env})
//var monsgam = new Monster({typemini:"nn/gam",env:env})
monsbruc.local.orientation = -1
env.island.place(env, monsstorrm, { x: 0, y: 0 })
env.island.place(env, monsstorrm2, { x: 0, y: 60 })
env.island.place(env, monsbruc, { x: 70, y: 20 })
env.island.place(env, monsbruc2, { x: -70, y: 20 })
//env.island.place(env, monssnail, {x:0,y:0})
//env.island.place(env, monsgam, {x:0,y:2})
//monsbruc2.loadparagon(env)
//monsbruc.loadparagon(env)
//monsstorrm.loadparagon(env)
//monsstorrm2.loadparagon(env)
//Ordering works

var arcanesong = new SongEngine({ type: "Song/arcanic", env: env })
//arcanesong.cadence.run()

var skelly = new Skeleton({
  name: 'RootBone', length: 20, deg: -90, children:
    [{
      name: 'Tweeg', length: 15, deg: 45, children:
        [{ name: 'Twoog', length: 25, deg: 45 }]
    }, {
      name: 'Proboscis', length: 50, deg: -45, children:
        [{ name: 'Probefeth1', length: 40, deg: -60 },
        {
          name: 'Probefeth2', length: 45, deg: 0, children:
            [{ mode: 'ligament', name: 'ligma', x: 30, y: 30, children: [{ name: 'special', length: 10, deg: 0 }] }]
        },
        { name: 'Probefeth3', length: 40, deg: 60 }]
    }]
})
skelly.getRealLocation({ x: 0, y: 0, rot: 0 })
//env.devtools.miscrenderers.push(skelly)
Debugger.log(skelly)

//Debugger.log(env)
function BIGRENDER() {
  Debugger.log(env)
  Game.render()
}
//Testing here
let tbv = arcanesong.cadence.meter//number of seconds in the track unit
//Current part in a song (circular degrees) is
//(performance.now()%tbv)/tbv*360
let animph = function(){
  Game.render()
  let songslice = (performance.now()%tbv)/tbv*360//the current frame of the verse
  //monsstorrm.paragon.renderer.skeleton.bones.deg=songslice
  let storrmbones = monsstorrm.paragon.renderer.skeleton.bonedict
  storrmbones.Leftstub.deg = 35*Math.sin(songslice/180*Math.PI)
  storrmbones.Rightstub.deg = -35*Math.sin(songslice/180*Math.PI)
  storrmbones.Leftheadstub.deg = 10*Math.sin(songslice/180*Math.PI)
  storrmbones.Rightheadstub.deg = -10*Math.sin(songslice/180*Math.PI)
  storrmbones.BodyBone.deg = 30*Math.sin(songslice/180*Math.PI)
  let x = -10*Math.sin(songslice/180*Math.PI)
  storrmbones.BodyLigament.x = x
  storrmbones.BodyLigament.y = -20*Math.cos(x/60*Math.PI)+55
  let brucbones = monsbruc.paragon.renderer.skeleton.bonedict
  storrmbones.Leftstub.deg = 35*Math.sin(songslice/180*Math.PI)
  Debugger.log(performance.now())
}
let interval;
function startanims(){
  if(!interval){
    interval = setInterval(animph, 20)
  }
}
function stopanims(){
  clearInterval(interval)
  interval = null
}
let testbtn = new Button({type:'square/ok', callback:function(){Debugger.log("Button clicked")}});
console.log(testbtn)
testbtn.activate()
/*Example formatting for anmimations
idle: {
  mode:'skeletal',
  state:'.DEFAULTSTATE',
  spans:{
    state:{
      length: 180,
      controller: function(bdict, frame, funcs){
        bdict.BodyBone.deg = funcs.sin(frame/2, 20)
        bdict.Leftheadmount.deg = funcs.sin(frame, 35)
      }
    }
  }
}
*/
/*
Data storage
interstate - Constantly interchangable data(monster biggification, costume, location)(reversible)
permastate - Permanent changes to data(Purchasing options and upgrades)
tempstate - memory that will exist for a certain length of time(will change automatically over time)
metastate - data specific to the grid item type
metastate is shared accross all instances and is not stored

Monster states:
Interstate
  Location
  Name
  Isbiggified
  Currentcostume
  Ismuted
  citizenship
Permastate
  Type
  CostumesPurchased
  IsBiggifiable
  Level
  Associated island
  *Canevolve
Tempstate
  *Eggs zapped
  Time left
  bankamount
Metastate
  name(Type)
  aliases
  elements
  gridsize
  shop cost
  shop level requirements
  native islands
  bank rate
  bank wallet amount
  description
*/
let f = {
  type: "Monster-purchase",
  targetid: "30",
  confirmtarget: "9a",
  data: {
    island: ''
  }
}
/*
Meta includes stuff about the type of thing("static variables")
local includes stuff about the instance of the thing("instance variables")
everything else is just internal
*/
//OMG THE RENDERING ACTUALLY WORKS NOW IT IS SO BEAUTIFUL I AM SO HAPPY I AM SO HAPPY I AM SO HAPPY I AM SO HAPPY I AM SO HAPPY I AM SO HAPPY I AM SO HAPPY
//IT CAN ACTUALLY TELL WHERE THE MOUSE IS IN THE UNPANNED RENDERER

//Todo: add a thing to position monster assets in the right place on the skeleton