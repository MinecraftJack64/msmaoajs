class CadenceNode {
    eventloop = []
    //subdivs = []
    count = 0
    onstart = function(joindata) {
      Debugger.log(joindata, "CadenceNode")
    }
    constructor(length, count, events = [], engine, event = null, message = "Cadence called ", parent = null) {
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
      this.engine = engine
      this.divide()
      this.parent = parent
      if(event){
        this.onstart = event
      }
    }
    divide() {
      for (var i = 0; i < this.eventloop.length; i++) {
        if (Array.isArray(this.eventloop[i])) {
          this.eventloop[i] = new CadenceNode(this.meter, this.eventloop[i].length, this.eventloop[i]/*subarray*/, this.engine, null/*event*/, "-" + this.debugmsg, this)
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
      if(!this.engine.isactive)
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
        this.onstart(this.eventloop[this.count])//Send object message to singers
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
      this.isactive = true
      this.cadence.reset()
      this.cadence.run()
    }
    isactive = true
    end(){
      this.isactive = false
    }
    finish(){//runs when song finishes
      this.begin()
    }
    constructor({ type, env } = {}) {
      this.dat = Resourcer.getlang(type)
      this.type = type
      this.island = type.includes("Song/")?type.substring(5):""//ex: Song/Island1 -> Island1
      this.events = this.dat.sequence
      this.timetable = []
      this.format()
      this.cadence = new CadenceNode(1000 / (this.dat.bpm / 60) * this.dat.commonverse, -1, this.timetable, this, null)
    }
  }
  
  var cad = new CadenceNode(4000, 4, [0, [0, [0, 0], [0, 0]], 0, [0, [0, 0], [0, 0]]])
  //cad.subdivide(4).subdivide(2)
  cad.reset()
class SingerEvents{//process events when called by cadence. This will send messages to monster paragons to set their animation and play a sound.
  //
}
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