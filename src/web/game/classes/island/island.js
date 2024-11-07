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