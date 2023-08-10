var BIGSCALE = 10

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

class Branch {
  componentchildren = []
  getChild(path) {
    if (path.length == 0) {
      return this
    }
    return this.children[path.shift()].getChild(path)
  }
  getbone(name) {
    if (this.name == name) {
      return this
    } else if (this.children.length == 0) {
      return null
    } else {
      let ret = null
      for (var x in this.children) {
        ret = (ret || this.children[x].getbone(name))
      }
      return ret
    }
  }
  addbone(bone) {
    this.children[bone.name] = bone
  }
  bind(target, dat) {
    this.componentchildren.push(target)
    if (dat.offsetdeg) {
      target.mountangle = dat.offsetdeg
    }
    if (dat.offsetx) {
      target.mountx = dat.offsetx
    }
    if (dat.offsety) {
      target.mounty = dat.offsety
    }
    target.mounttype = dat.bindtype
  }
  getxy(d, r) {
    return { x: r * Math.cos(d * Math.PI / 180), y: r * Math.sin(d * Math.PI / 180), realdeg: d }
  }
  getrt(x, y, pdeg) {
    let r = Math.sqrt(x ** 2 + y ** 2)
    let deg = Math.atan2(x, y) * 180 / Math.PI
    let realdeg = deg + pdeg
    return this.getxy(realdeg, r)
  }
}
class Ligament extends Branch {//Has to have children, cannot be root
  yscale = 1
  xscale = 1
  constructor(parent, name, x, y, children, bonedict) {
    super()
    this.parent = parent
    this.name = name
    this.x = x
    this.y = y
    this.children = {}
    bonedict[name] = this
    for (var x of children) {
      if (!x.mode) { x.mode = 'bone' }
      if (x.mode == 'ligament') {
        this.children[x.name] = new Ligament(this, x.name, x.x, x.y, x.children, bonedict)
      }
      else {
        this.children[x.name] = new Bone(this, x.name, x.length, x.deg, x.hasOwnProperty('children') ? x.children : [], bonedict)
      }
    }
  }
  getRealLocation() {
    let res = this.getrt(this.x * this.xscale, this.y * this.yscale, this.parent.realdeg)
    /*let r = Math.sqrt((this.x*this.xscale)**2+(this.y*this.yscale)**2)
    let deg = Math.atan2(this.x, this.y)*180/Math.PI
    this.realdeg = deg+this.parent.realdeg
    this.tipx = r*Math.cos(this.realdeg*Math.PI/180)+this.parent.tipx
    this.tipy = r*Math.sin(this.realdeg*Math.PI/180)+this.parent.tipy*/
    this.realdeg = this.parent.realdeg//res.realdeg
    this.tipx = this.parent.tipx + res.x
    this.tipy = this.parent.tipy + res.y
    for (var x in this.children) {
      this.children[x].getRealLocation()
    }
    for (var x of this.componentchildren) {
      if (x instanceof Branch) {
        x.getRealLocation()
      } else {
        x.state.x = this.parent.tipx
        x.state.y = this.parent.tipy
        x.state.rot = this.realdeg + 90 + x.mountangle
      }
    }
  }
  render() {
    Game.ctx.beginPath();
    Game.ctx.moveTo(this.parent.tipx, this.parent.tipy);
    Game.ctx.setLineDash([3, 2])
    Game.ctx.lineTo(this.tipx, this.tipy);
    Game.ctx.strokeStyle = "blue";
    Game.ctx.lineWidth = 1;
    Game.ctx.stroke();
    Game.ctx.drawImage(Skeleton.rotjointimage, 0, 0, Skeleton.rotjointimage.width, Skeleton.rotjointimage.height, this.tipx - 2, this.tipy - 2, 4, 4)
    for (var x in this.children) {
      this.children[x].render()
    }
  }
}
class Bone extends Branch {
  static mainlen = 10
  scale = 1
  constructor(parent, name, length, defaultdeg, children, bonedict, isroot = false) {
    super()
    this.length = length
    this.name = name
    this.deg = defaultdeg
    this.parent = parent
    this.children = {}
    bonedict[name] = this
    for (var x of children) {
      if (!x.mode) { x.mode = 'bone' }
      if (x.mode == 'ligament') {
        this.children[x.name] = new Ligament(this, x.name, x.x, x.y, x.children, bonedict)
      }
      else {
        this.children[x.name] = new Bone(this, x.name, x.length, x.deg, x.hasOwnProperty('children') ? x.children : [], bonedict)
      }
    }
    if (children.length == 0) {
      this.istip = true
    } else {
      this.istip = false
    }
  }
  getRealLocation() {
    let res = this.getxy(this.deg + this.parent.realdeg, this.length * this.scale)
    /*this.realdeg = this.deg+this.parent.realdeg
    this.tipx = this.length*this.scale*Math.cos(this.realdeg*Math.PI/180)+this.parent.tipx
    this.tipy = this.length*this.scale*Math.sin(this.realdeg*Math.PI/180)+this.parent.tipy*/
    this.realdeg = res.realdeg
    this.tipx = res.x + this.parent.tipx
    this.tipy = res.y + this.parent.tipy
    for (var x in this.children) {
      this.children[x].getRealLocation()
    }
    for (var x of this.componentchildren) {
      if (x instanceof Branch) {
        x.getRealLocation()
      } else {
        if (x.mounttype == 'at') {
          var rx = this.parent.tipx
          var ry = this.parent.tipy
        } else {
          var rx = this.tipx
          var ry = this.tipy
        }
        if (x.mountx || x.mounty) {
          let res = this.getrt((x.mountx || 0), (x.mounty || 0), ((this.realdeg) || 0))
          x.state.x = rx + res.x
          x.state.y = ry + res.y
          x.state.rot = this.realdeg + 90 + (x.mountangle || 0)
        } else {
          x.state.x = rx
          x.state.y = ry
          x.state.rot = this.realdeg + 90
        }
      }
    }
  }
  render() {
    Game.ctx.beginPath();
    Game.ctx.moveTo(this.parent.tipx, this.parent.tipy);
    Game.ctx.lineTo(this.tipx, this.tipy);
    Game.ctx.setLineDash([])
    Game.ctx.strokeStyle = "white";
    Game.ctx.lineWidth = 1;
    Game.ctx.stroke();
    Game.ctx.drawImage(Skeleton.rotjointimage, 0, 0, Skeleton.rotjointimage.width, Skeleton.rotjointimage.height, this.tipx - 2, this.tipy - 2, 4, 4)
    for (var x in this.children) {
      this.children[x].render()
    }
  }
}
class Skeleton {
  static boneimage = new Image()
  static rotjointimage = new Image()
  bonedict = {}
  constructor(bonedat) {
    this.bones = new Bone(this, bonedat.name, bonedat.length, bonedat.deg, bonedat.children, this.bonedict, true)
    Skeleton.boneimage.src = './gfx/dev/bone.svg'
    Skeleton.rotjointimage.src = './gfx/dev/rotjoint.svg'
  }
  getbone(s) {
    return this.bonedict[s]
  }
  getRealLocation() {
    this.tipx = 0
    this.tipy = 0
    this.realdeg = 0
    this.bones.getRealLocation()
  }
  render(pos) {
    env.resettransform(true)
    env.transformobject(pos)
    Game.ctx.globalAlpha = 1
    Game.ctx.drawImage(Skeleton.rotjointimage, 0, 0, Skeleton.rotjointimage.width, Skeleton.rotjointimage.height, this.tipx - 2, this.tipy - 2, 4, 4)
    this.bones.render()
  }
}

function coordRectToIso(obj) {
  return obj
}
function coordIsoToRect(obj) {
  return obj
}
class MonsterLoader {
  static paragon = {}
  static hasParagon(type) {
    return MonsterLoader.paragon.hasOwnProperty(type)
  }
  static downloadParagon(type) {
    return MonsterLoader.paragon[type]
  }
  static uploadParagon(type, dat) {
    MonsterLoader.paragon[type] = dat
  }
}
class MonsterParagon {
  constructor({ env, type }) {
    this.renderer = new Renderer({ env: env, type: type })
    this.sounder = new Sounder({ env: env, type: type })
    this.meta = Resourcer.getmeta(type)
    this.renderer.showskelly = true
  }
  render(env, anim, frame, pos, ops) {
    this.renderer.render(env, anim, frame, pos, ops)
  }
}
function drawdot(os){
  
}
class Input {
  static keys = []
  static touches = {}
  static mousedown = false
  static updatedevpane() {
    document.getElementById("Devout").innerHTML = "Mouse position: (" + Input.mousex + ", " + Input.mousey + "); Mouse down? " + Input.mousedown + "; Keys currently pressed down: " + Input.keys
  }
  static getmousepos(evt) {//Positional
    var rect = document.getElementById("game").getBoundingClientRect();
    this.mousex = (evt.clientX - rect.left) * BIGSCALE;
    this.mousey = (evt.clientY - rect.top) * BIGSCALE;
    Input.updatedevpane()
    drawdot(this.mousex, this.mousey)
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
  static init() {
    //Init key detection
    document.addEventListener('keydown', this.keydown.bind(this))
    document.addEventListener('keyup', this.keyup.bind(this))

    //Init mouse detection
    document.addEventListener("mousemove", this.getmousepos.bind(this))
    document.addEventListener("mousedown", (function(e) { this.mousedown = true; Input.updatedevpane() }).bind(this))
    document.addEventListener("mouseup", (function(e) { this.mousedown = false; Input.updatedevpane() }).bind(this))

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
    /*env.menuset[env.menuset.length-1].render(env)
    for(var i = 0; i < env.popupset.length; i++){
      env.popupset[i].render(env)
    }
    env.mastermenu.render(env)*/
    env.resettransform(false)
    Game.ctx.transform(0.3, 0, 0, 0.3, 0, 0)
    Game.ctx.globalAlpha = 0.5
    Game.ctx.drawImage(env.devtools.crosshair, 0, 0, env.devtools.crosshair.width, env.devtools.crosshair.height, -1 * env.devtools.crosshair.width / 2, -1 * env.devtools.crosshair.height / 2, env.devtools.crosshair.width, env.devtools.crosshair.height)
    for (var t of env.devtools.miscrenderers) { t.render(env) }
    Debugger.log("Game render success")
    //window.requestAnimationFrame(Game.render, env);
  }
}
class Sounder {
  ready = false
  constructor({ env, type } = {}) {
    this.mode = 'sprite'
    this.dat = { srcs: [{ src: 'st/tracks/cloud/storrm.mp3', tracks: { track1: [0, 3], track2: [6, 4] } }, { src: 'st/tracks/cloud/bruc.mp3', tracks: { track1: [0, 3], track2: [6, 4] } }] }
    Promise.all(
      this.dat.srcs.map(async (t, i) => {
        const tmpHowl = this.mode == 'sprite' ? (new Howl({ src: [t.src], sprite: t.tracks, preload: true })) : (new Howl({ src: [t.src], preload: true }));
        Debugger.log("Sounder loading begins", "Sounder")
        const syncPromise = new Promise((resolve) => {
          tmpHowl.once('load', function() {
            //Handle image
            Debugger.log("Finished loading howler: " + i, "Sounder");
            //resolve final image
            resolve(tmpHowl);
          });
          //Begin loading each image
        });
        // Wait for syncPromise (image loaded)
        return await syncPromise;
      })//Slack systems
    ).then((values) => {
      Debugger.log("Loaded all sounds: ", "Sounder")
      Debugger.log(values, "Sounder")
    })
  }
}
class Renderer {//All state vars: x, y, rot, size, visible, xs, ys, trans, sprite, index
  static gridstates = ['x', 'y', 'rot', 'size', 'visible', 'xs', 'ys', 'trans', 'sprite', 'index']
  static formatstate(pos1, issprite = false) {//Formats an object into a State and marks it as formatted. Formatted objects are skipped
    if (pos1.format) {
      return 0
    }
    pos1.x = (pos1.x || 0)
    pos1.y = (pos1.y || 0)
    pos1.rot = (pos1.rot || 0)
    pos1.size = (pos1.size || 1)
    pos1.visible = pos1.hasOwnProperty('visible') ? pos1.visible : true
    pos1.xs = (pos1.xs || 1)
    pos1.ys = (pos1.ys || 1)
    pos1.trans = (pos1.trans || 1)
    if (issprite) {
      pos1.sprite = (pos1.sprite || 0)
      pos1.index = (pos1.index || -1)
      pos1.format = 2
    } else {
      pos1.format = 1
    }
  }
  static clonestate(pos1) {//Clone a position
    var pos2 = {}
    Renderer.formatstate(pos1)
    for (var x of Renderer.gridstates) {
      pos2[x] = pos1[x]
    }
    return pos2
  }
  static getanimtree(obj, select, list, path = '') {//Takes the animation config object and puts all paths into a list
    if (path != '')
      path += '/'
    for (var i = 0; i < obj.config.length; i++) {
      let x = obj.config[i]
      if (obj[x].hasOwnProperty('config')) {
        Renderer.getanimtree(obj[x], list, path + x)
      } else {
        list.push({ name: path + x, dat: obj[x] })
      }
    }
  }
  static getexpandedpos(val, saltrange) {//Converts placeholder values into the actual numbers
    if (!val) {
      return 0
    } else {
      switch (val) {
        case '.CENTER':
          return saltrange / 2
        case '.UPPER':
          return saltrange
        default:
          return val
      }
    }
  }
  static addpos(pos1, pos2) {//Add two positions together and return the result(both originals unchanged, new one is a clone)
    let pos3 = {}
    Renderer.formatstate(pos1)
    Renderer.formatstate(pos2, true)
    pos3.x = pos1.x + pos2.x
    pos3.y = pos1.y + pos2.y
    pos3.rot = pos1.rot + pos2.rot
    pos3.size = pos1.size * pos2.size
    pos3.visible = pos1.visible && pos2.visible
    pos3.xs = pos1.xs * pos2.xs
    pos3.ys = pos1.ys * pos2.ys
    pos3.trans = pos1.trans * pos2.trans
    pos3.sprite = pos2.sprite
    pos3.index = pos2.index
    return pos3
  }
  ready = false
  loadanims(select) {//Load all animations(WIP)
    //CONFIGURE ANIMATION CHANNELS
    this.defaultpos = this.dat.anims.defaultstate
    this.animationset = {}
    var biglist = []
    Renderer.getanimtree(this.dat.anims, select, biglist)

    for (var key of biglist) {
      this.animationset[key.name] = key.dat
    }

    this.renderjob = this.applystates(this.defaultpos)
    this.lastframe = -1
    this.lastanim = ""
  }
  configureobj() {//Organize all loaded resources into components(renderable objects)
    this.components = {}

    //CONFIGURE ALL RENDERER COMPONENTS
    for (var i = 0; i < this.dat.config.length; i++) {
      let currcomponent = this.dat.config[i]
      let cdat = {}

      //Get srcs
      let srcs = []
      for (var d = 0; d < currcomponent.srcmeta.length; d++) {
        srcs.push(this.resources[currcomponent.srcmeta[d].id])
      }
      cdat.srcs = srcs

      //Push final component
      this.components[currcomponent.name] = cdat
    }

    //CONFIGURE SKELETON(if applicable)
    if (this.dat.defaulttree) {
      this.skeleton = new Skeleton(this.dat.defaulttree)
      for (var op of this.dat.bindingmagic) {
        var targ = this.skeleton.getbone(op.target)
        var sub = this.components[op.subject]
        targ.bind(sub, op.binddata)
      }
      //env.devtools.miscrenderers.push(this.skeleton)
    }
  }
  async getsrcpromise(srcs) {//Load all images and put them in this.resources
    this.resources = await Promise.all(
      srcs.map(async (t, i) => {
        const tmpImage = new Image()
        const syncPromise = new Promise((resolve) => {
          tmpImage.onload = (e) => {
            //Handle image
            Debugger.log("Finished loading image: " + i, "Renderer")
            //resolve final image
            resolve(tmpImage)
          }
          //Begin loading each image
          tmpImage.src = 'gfx/' + this.type + (this.dat.srcext == '' ? '' : '/') + t.src + this.dat.srcext
          tmpImage.pos = t.defaultposition
        })
        // Wait for syncPromise (image loaded)
        return await syncPromise
      }) //Slack systems
    )
    //PROCESS RESOURCES
    for (var i_1 = 0; i_1 < this.resources.length; i_1++) {
      let img = this.resources[i_1]
      img.pos.x = Renderer.getexpandedpos(img.pos.x, img.width) * -1
      img.pos.y = Renderer.getexpandedpos(img.pos.y, img.height) * -1
      img.pos.rot = (img.pos.rot || 0)
      img.pos.size = (img.pos.size || 1)
    }
  }
  async initialize({env, select, seed}){
    //FETCH METADATA
    this.dat = Resourcer.getanims(env, this.type)
    this.SCALE = this.dat.scalefactor
    //LOAD ALL RESOURCES
    if (seed) {
      this.resources = seed.resources//Link srcs
      this.configureobj()//CONFIGURE COMPONENTS AND SKELETON
      this.loadanims(select)//CONFIGURE SELECTED ANIMATIONS

      this.ready = true
      Debugger.log("This renderer was seeded", "Renderer")
    } else {
      await this.getsrcpromise(this.dat.srcs)
      this.configureobj()//CONFIGURE COMPONENTS AND SKELETON
      this.loadanims(select)//CONFIGURE SELECTED ANIMATIONS

      this.ready = true
      Debugger.log("This renderer has been loaded", "Renderer")
    }
  }
  constructor({
    env,
    type,//ex Monster/nn/snail/rare ex Decoration/pt/bubblerite/small
    select = "",
    seed
  } = {}) {
    this.type = type
    this.initialize({env: env, type: type, select: select, seed: seed})
  }
  plot(env, pos, ops) {//Plot all objects on the canvas based on the latest calculations
    if (!this.ready)
      return false
    for (var x of this.renderjob) {
      var image = this.components[x].srcs[this.components[x].state.index]
      var currstate = this.components[x].state
      //finalpos.size*=this.SCALE
      env.resettransform(ops.isongrid)//Center of island
      env.transformobject(pos)
      Game.ctx.transform(currstate.size * this.SCALE, 0, 0, currstate.size * this.SCALE, currstate.x, currstate.y)
      Game.ctx.rotate((pos.rot + currstate.rot) * Math.PI / 180)
      Game.ctx.scale((currstate.xs || 1), (currstate.ys || 1));
      let scalesize = (image.pos.size || 1);
      Game.ctx.scale(scalesize, scalesize);
      Game.ctx.drawImage(image, 0, 0, image.width, image.height, image.pos.x, image.pos.y, image.width, image.height)
    }
    env.resettransform(ops.isongrid)//Center of island
    Game.ctx.transform(1, 0, 0, 1, pos.x, pos.y)//Position on island
    Game.ctx.drawImage(Skeleton.rotjointimage, 0, 0, Skeleton.rotjointimage.width, Skeleton.rotjointimage.height, -2, -2, 2, 2)
  }
  applystates(state) {//Give all objects a state if they do not have one and return a list of the indexes of all visible objects
    let tr = []
    for (var x of state['.INDEXES']) {
      if (!this.components[x].hasOwnProperty('state')) {
        this.components[x].state = {}
      }
      this.components[x].state = Renderer.clonestate(state[x])
      if (state[x].visible) {
        tr.push(x)
      }
    }
    return tr
  }
  calcrender(env, channel, frame) {
    if (!this.ready)
      return false
    if (!this.animationset[channel])
      return false
    //this.renderjob = this.applystates(this.defaultpos)
    switch (this.animationset[channel].mode) {
      case "stillframe":
        //
        break;
      case "skeletal":
        this.renderjob = this.applystates(this.defaultpos)//Placeholder
        this.skeleton.getRealLocation()
        break;
      /*case "framed":
        nothing
      break;
      case "motile":
        nothing
      break;*/
    }
  }
  render(env, channel, frame, pos, ops) {
    if (frame != this.lastframe || channel != this.lastanim) {
      this.calcrender(env, channel, frame)
    }
    this.plot(env, pos, ops)
    if (this.skeleton && this.showskelly) {
      this.skeleton.render(pos)
    }
  }
}
var TSIZE = 1
var TX = 10
var TY = 10
//import * as mypaths from './st/tracks/cloud/loader.js'
class Popup {//WIP
  //creating a popup
  constructor({
    title = "LISTEN UP!",
    description = null,
    components = [],
    type = "notice",
    actions = null,
    height = null
  } = {}) {
    this.title = title
    if (description) {
      components.unshift(new TextComponent(description))
    } else {
    }
    this.components = components
    if (type == "selector") {
      this.actions = actions
    } else if (type == "none") {
      this.actions = []
    } else if (type == "notice") {
      this.actions = [new Button({ type: 'ok' })]
    } else if (type == "confirmation") {
      this.actions = [new Button({ type: 'ok' }), new Button({ type: 'close' })]
    }
    this.maxheight = height
  }
}

class CadenceNode {
  eventloop = []
  //subdivs = []
  count = 0
  onstart = function() { }
  constructor(length, count, events = [], engine, message = "Cadence called ", parent = null) {
    if (count > 0) {//Is child
      this.maxcount = count
      this.meter = length / count
    } else {//Is the master node
      this.maxcount = 0
      this.meter = length
      //Debugger.log(this.meter+ " METRE")
    }
    this.debugmsg = message
    this.eventloop = [...events]
    this.divide()
    this.parent = parent
    this.engine = engine
    this.isactive = true
  }
  divide() {
    for (var i = 0; i < this.eventloop.length; i++) {
      if (Array.isArray(this.eventloop[i])) {
        this.eventloop[i] = new CadenceNode(this.meter, this.eventloop[i].length, this.eventloop[i]/*subarray*/, this.engine, "-" + this.debugmsg, this)
      } else if (!this.eventloop[i].flag) {
        //Process verse: If current verse modifies sound but not nect, delete this and relace next block
        //Remember to reduce count but kee meter same
      }
    }
  }
  reset() {
    this.count = 0
  }
  run() {
    if(!this.isactive)
      return
    if (this.count >= this.eventloop.length) {
      Debugger.log('songended', "CadenceNode")
      this.engine.finish()
      return
    }
    if (this.maxcount > 0 && this.count >= this.maxcount) {//If a child is done counting
      if (this.parent)
        this.parent.run();
      else
        Debugger.log("cadence ended", "CadenceNode")//End of song, should never run
      return
    }
    Debugger.log(this.debugmsg + this.count + this.eventloop[this.count])
    if (this.eventloop[this.count] instanceof CadenceNode) {
      this.eventloop[this.count].reset()
      this.eventloop[this.count].run()
      this.count++
    }
    else {
      this.onstart()//Send object message to singers
      this.count++
      if (this.maxcount == 0 || this.count < this.maxcount) {
        setTimeout(() => { this.run() }, this.meter)
      } else {
        setTimeout(() => { if (this.parent) this.parent.run(); else Debugger.log("cadence ended", "CadenceNode") }, this.meter)
      }
    }
  }
  /*subdivide(times){
    let ss = new CadenceNode(this.meter, times, "-"+this.debugmsg)
    this.subdivs.push(ss)
    return ss
  }*/
}

class SongEngine {
  strip(res){
    let i = res.length-1
    while(res[i]==0){
      res.pop()
      i--
    }
  }
  formatpos(f){
    return Array.isArray(f)?f:[f]
  }
  addtime(f, s) {
    f = this.formatpos(f)
    s = this.formatpos(s)
    let res = [f[0] + s[0]]
    for (var x = 1; x < Math.max(f.length, s.length); x++) {
      if (x >= f.length) {
        f.push(0)
      } else if (x >= s.length) {
        s.push(0)
      }
      res.push(f[x] + s[x])
      if (res[x] >= this.dat.subdivs[x - 1]) {
        res[x - 1]++
        res[x] -= this.dat.subdivs[x - 1]
      }
    }
    this.strip(res)
    return res
  }
  multtime(p, t){//TODO
    p = this.formatpos(p)
    let res = [p[0]*t]
    for (var x = 1; x < p.length; x++) {
      res.push(p[x]*t)
      if (res[x] >= this.dat.subdivs[x - 1]) {
        let g = res[x]%this.dat.subdivs[x-1]
        res[x - 1]+=g
        res[x] -= this.dat.subdivs[x - 1]*g
      }
    }
    this.strip(res)
    return res
  }
  deshorten(str) {//Compile names using provided templates
    if (str.indexOf('.') == -1) {
      return str
    }
    let shi = str.indexOf('/')
    let rem = this.dat.majorsingers[str.substring(1, shi)]
    return rem + str.substring(shi)
  }
  totrack(str){
    if (str.indexOf('.') == -1) {
      return str
    }
    let shi = str.indexOf('/')
    let rem = ""
    if("I"==str.substring(1, shi)){
      rem = this.island
    }
    return rem + str.substring(shi)
  }
  //Fills out an idle message from the anticipator, recursing until the correct time
  subanticipate(targ, pos = [], ap/*If true, then only modify, don't add to timetable(premade)*/) {
    for (var i = 0; i < targ.length; i++) {
      let cp = [...pos, i]
      let cps = cp.toString()
      let ct = ap[0]
      if(ct==cps){//Note: if [2 TODO
        let t = targ[i]
        for (var x of ap[1]) {
          if(!t.join){t.join = {}}
          t.join[x] = 'idle'
        }
      }else if(ct.indexOf(cps)==0){
        console.log(cps+"Has been identified to efnvowrjgvoiefpvkeroivejrbe in "+ct)
        //Turn element of array into subarray, set first element to old element, add empty objects to fill correct divisions, reprocess the anticipator
        let currel = targ[i]
        let t = []
        targ[i] = t
        t.push(currel)
        for(let d = 0; d < this.dat.subdivs[pos.length]-1; d++){
          t.push({})
        }
        this.subanticipate(t/*sequence to test*/, cp, [ct, ap[1]])
        //continue
      }
    }
  }
  //Fills out the time table based on the event data, turning all reps into joins and leaves
  format(seq = this.events, targ = this.timetable, pos = [], anticipator = {}, ismod = false/*If true, then only modify, don't add to timetable(premade)*/) {
    for (var i = 0; i < seq.length; i++) {
      let cp = [...pos, i]
      let f = seq[i]
      if (Array.isArray(f)) {
        let g = []
        targ.push(g)
        this.format(seq[i], g, cp, anticipator)
        continue
      }
      let t = {}
      targ.push(t)
      if (f.join) {
        t.join = {}
        for (var x in f.join) {
          t.join[this.deshorten(x)] = this.totrack(f.join[x])
        }
      }
      if (f.leave) {
        if (!t.join) {
          t.join = {}
        }
        for (var x of f.leave) {
          t.join[this.deshorten(x)] = 'idle'
        }
      }
      if(f.jointrack){//track contains multiple monsters joining
        if (!t.join) {
          t.join = {}
        }
        for(var x of f.jointrack){
          for(var j in f[x]){
            //t.join[]
          }
        }
      }
      if (f.rep) {
        if (!t.join) {
          t.join = {}
        }
        for (var x in f.rep) {
          let ro = this.deshorten(x)
          t.join[ro] = this.totrack(f.rep[x][0])
          let v = this.dat.tracks[x/*Use RO LATER WHEN TRACKS TRANSLATED TODO*/][f.rep[x][0]]//track length
          let v2 = f.rep[x][1]//times to rep
          let tp = this.addtime(cp, this.multtime(v, v2))//Time to anticipate
          //console.log(tp)
          if(!anticipator[tp.toString()]){
            anticipator[tp.toString()] = []
          }
          anticipator[tp.toString()].push(ro)
          console.log(anticipator)
        }
      }
      for(var ct in anticipator){
        let cps = cp.toString()
        if(ct==cps){//Note: if [2 TODO
          for (var x of anticipator[cps]) {
            if(!t.join){t.join = {}}
            t.join[x] = 'idle'
          }
          delete anticipator[cps]
        }else if(ct.indexOf(cps)==0){
          console.log(cps+"Has been identified to efnvowrjgvoiefpvkeroivejrbe in "+ct)
          //Turn element of array into subarray, set first element to old element, add empty objects to fill correct divisions, reprocess the anticipator
          var currel = t
          t = []
          targ[i] = t
          t.push(currel)
          for(let d = 0; d < this.dat.subdivs[pos.length]-1; d++){
            t.push({})
          }
          this.subanticipate(t/*sequence to test*/, cp, [ct, anticipator[ct]])
          delete anticipator[cps]
        }
      }
    }
  }
  begin(){
    this.cadence.reset()
    this.cadence.run()
  }
  finish(){
    this.begin()
  }
  constructor({ type, env } = {}) {
    this.dat = Resourcer.getmeta(type)
    this.type = type
    this.island = type.includes("Song/")?type.substring(5):""//TODO
    this.events = this.dat.sequence
    this.timetable = []
    this.format()
    this.cadence = new CadenceNode(1000 / (this.dat.bpm / 60) * this.dat.commonverse, -1, this.timetable, this)
  }
}

var cad = new CadenceNode(4000, 4, [0, [0, [0, 0], [0, 0]], 0, [0, [0, 0], [0, 0]]])
//cad.subdivide(4).subdivide(2)
cad.reset()
//cad.run()

/*Legacy Song Engine(Deprecated)
class LegacyCadenceEngine{
  constructor(pace = 120, meter = 4){
    this.setPace(pace)
    this.meter = meter
  }
  setPace = function(bpm){
    this.pace = 1/(bpm/60)
  }
  setMeter = function(meter){
    var total = this.pace*this.meter
    this.meter = meter
    this.pace = total/this.meter
  }
  clocks = [{limit:0,count:0}, {limit:4,count:0}, {limit:4,count:0}]
  clock = function(nums){
    this.clocks = []
    for(var i = 0; i < nums.length; i++){
      this.clocks.push({limit:nums[i],count:0})
    }
  }
  cadence = null
  begin = function(){
    this.cadence = setInterval(this.tick, this.pace*1000, this.clocks)
  }
  end = function(){
    stopInterval(this.cadence)
  }
  tick = function(clocks){
    var g = clocks.length-1
    if(g<0){
      return
    }
    while(g>=0){
      clocks[g].count++
      if(clocks[g].limit==clocks[g].count){
        clocks[g].count = 0
        g--
      }else{
        var t = ""
        for(var i = 0; i < g; i++){
          t+=" "
        }
        //Debugger.log(t+(clocks[g].count+1))
        return
      }
    }
  }
}

var Block = class {
  constructor(length, terms){
    this.terms = terms
    this.length = length
  }
  flag = false
  terms = {}
  length = 2
  setflag = function(){
    this.flag = true
  }
  get = function(item){
    if(this.terms[item])
      return this.terms[item]
    else
      return null
  }
}
var LegacySong = class {
  constructor(dat){
    this.blocks = dat.blocks.map(block => new Block(block.length?block.length:2, block))
  }
  concurrentblocks = []
  flagVerses = function(monsters){
    for(var y of this.blocks){
      this.flagVerse(y, monsters)
    }
  }
  flagVerse = function(block, monsters){
    for(var x of monsters){
      x.vote(block)
    }
  }
  getCurrentActiveVerses = function(){
    return concurrentblocks.map(blockid => blocks[blockid])
  }
}*/
var Island = class {
  constructor(
    { env,
      typemini,
      type
    } = {}) {
    if (!type) {
      type = "Island/" + typemini
    }
    typemini = type.split("/")[1]
    this.local.type = type
    this.local.typemini = typemini
    this.renderer = new Renderer({ env: env, type: type })//Islands do not use the torrent
  }
  place(env, griditem, location) {
    //Insert into griditem list(topto bottom)
    if (this.local.griditems.length == 0 || coordIsoToRect(this.local.griditems[this.local.griditems.length - 1].local.location).y < coordIsoToRect(location).y) {
      this.local.griditems.push(griditem)
    } else if (coordIsoToRect(this.local.griditems[0].local.location).y > coordIsoToRect(location).y) {
      this.local.griditems.unshift(griditem)
    } else {
      let gary = 0
      while (coordIsoToRect(this.local.griditems[gary].local.location).y < coordIsoToRect(location).y) {
        gary++
      }
      this.local.griditems.splice(gary, 0, griditem)
    }
    this.local.monsters.push(griditem)
    griditem.place(this, location)
  }
  local = {
    griditems: [],
    monsters: [],
  }
  go = function(env) {
    env.island = this
  }
  purge = function() {
    this.griditems = []
  }
  generate = function(obstacles) {
    //TODO
  }
  purchase = function(Env) {
    this.generate(Env)
    this.go(Env)
  }
  getbgimage = function() {
    return "gfx/Sky/" + this.local.typemini + ".png"
  }
  render = function(env) {
    this.renderer.render(env, 'idle', 0, { x: 0, y: 0, size: 1, rot: 0 }, { isongrid: true })
  }
}
var Griditem = class {
  gridoccupation = [[1]]
  local = {
    loc: {}
  }
  moveto = function(Env, loc) {
    remove(Env)
    place(Env, loc)
  }
  place = function(Env, loc) {
    this.local.location = loc
  }
  remove = function(Env) {
    local.loc = {}
  }
  render(env) {
    Debugger.log("Griditems currently do not know how to render. Failed render " + this.meta.name + ":" + this.local.name)
  }
}
var Monster = class extends Griditem {
  constructor({ env, type, typemini } = {}) {
    super()
    //this.elements = dat.elements
    /*this.local.type = dat.type
    if(!dat.destined){
      this.generate(dat)
    }*/
    if (!type) {
      type = "Monster/" + typemini
    }
    typemini = type.split("/")[1] + '/' + type.split("/")[2]
    this.local.type = type
    this.local.typemini = typemini
    this.loadparagon(env)
    this.generate(this.paragon.meta)
  }
  loadparagon(env) {
    if (MonsterLoader.hasParagon(this.local.type)) {
      this.paragon = MonsterLoader.downloadParagon(this.local.type)
    } else {
      this.paragon = new MonsterParagon({ env: env, type: this.local.type })
      MonsterLoader.uploadParagon(this.local.type, this.paragon)
    }
  }
  render(env) {
    this.paragon.renderer.render(env, 'idle', 0, { x: this.local.location.x, y: this.local.location.y, size: TSIZE, rot: 0, xs: this.local.orientation }, { isongrid: true })
  }
  generate = function(dat) {
    this.meta = dat
    /*metavars:
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
    /*localvars:
    name(Unique nick)
    location
    bank amount
    type
    Island
    level
    original purchase cost
    mute status
    citizenship
    */
    /*tempvars:
    paragon
    */
    this.local.name = dat.aliases[Math.floor(Math.random() * dat.aliases.length)]
    this.local.citizenship = 2//later based on island data
    this.local.bank = 0
    this.local.functionallocation = "None"
    this.local.level = 1
    this.local.orientation = 1
  }
  vote = function(block) {
    Debugger.log(this.local.type + " voted on " + block)
    switch (this.local.citizenship) {
      case 0:
        block.setFlag()
        break;
      case 1:
        if (block.get(this.local.type)) {
          block.setflag()
        }
        break;
      case 2:
        if (block.get(this.local.type)) {
          block.setflag()
        }
        break;
    }
  }
}
class Env {
  island = null
  menuset = []
  mastermenu = null
  popupset = []
  screenpanner = {
    x: 0,
    y: 0,
    size: 2,
    rot: 0
  }
  resettransform(usepanner) {
    Game.ctx.setTransform(BIGSCALE, 0, 0, BIGSCALE, this.width / 2, this.height / 2)
    if (usepanner) {
      Game.ctx.transform(this.screenpanner.size, 0, 0, this.screenpanner.size, this.screenpanner.x, this.screenpanner.y)
      Game.ctx.rotate((this.screenpanner.rot) * Math.PI / 180)
    }
  }
  gettargetlocation(pos){
    return {x:pos.x*BIGSCALE+this.width/2, y:pos.y*BIGSCALE+this.height/2}
  }
  gettargetlocationfromisland(pos){
    let s = this.gettargetlocation(pos)
    return {x:s.x*this.screenpanner.size+this.screenpanner.x, y:s.y*this.screenpanner.size+this.screenpanner.y}
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
monsbruc2.loadparagon(env)
monsbruc.loadparagon(env)
monsstorrm.loadparagon(env)
monsstorrm2.loadparagon(env)
//Ordering works

/*var song = new Song({blocks:[{
  "snail":"1",
  "blur":"1"
}, {
  "snail":"1",
  "gam":"2"
}, {
  "blur":"2",
  "gam":"3"}]})*/
//song.flagVerses([monsstorrm])

//var cadence = new LegacyCadenceEngine(160)
//cadence.clock([0,8,3])
//cadence.begin()

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
let tbv = arcanesong.cadence.meter
//Current part in a song (circular degrees) is
//(performance.now()%tbv)/tbv*360
let animph = function(){
  Game.render()
  let songslice = (performance.now()%tbv)/tbv*360
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
let interval = setInterval(animph, 20)
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