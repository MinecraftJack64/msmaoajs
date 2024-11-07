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
  class Sounder {
    ready = false
    constructor({ env, type } = {}) {
      this.mode = 'sprite'
      this.dat = { srcs: [{ src: 'st/tracks/arcanic_legacy/storrm.mp3', tracks: { track1: [0, 3], track2: [6, 4] } }, { src: 'st/tracks/arcanic/bruc.mp3', tracks: { track1: [0, 3], track2: [6, 4] } }] }
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