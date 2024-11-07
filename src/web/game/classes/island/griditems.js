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
      this.meta = {...Resourcer.getmeta(type), ...Resourcer.getlang(type)}//Combine lang and meta
      this.renderer.showskelly = true
    }
    render(env, anim, frame, pos, ops) {
      this.renderer.render(env, anim, frame, pos, ops)
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