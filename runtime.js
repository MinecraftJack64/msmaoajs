function coordRectToIso(obj){
  return obj
}
function coordIsoToRect(obj){
  return obj
}
class MonsterLoader{
  static meta = {}
  static anims = {}
  static hasMeta(type){
    return MonsterLoader.meta.hasOwnProperty(type)
  }
  static downloadMeta(type){
    return MonsterLoader.meta[type]
  }
  static uploadMeta(type, dat){
    MonsterLoader.meta[type] = dat
  }
}
class Input{
  static keys = []
  static touches = {}
  static mousedown = false
  static updatedevpane(){
    document.getElementById("Devout").innerHTML = "Mouse position: ("+Input.mousex+", "+Input.mousey+"); Mouse down? "+Input.mousedown+"; Keys currently pressed down: "+Input.keys
  }
  static getmousepos(evt) {
    //console.log(this.canvas)
    var rect = document.getElementById("game").getBoundingClientRect();
    this.mousex = evt.clientX - rect.left;
    this.mousey = evt.clientY - rect.top;
    Input.updatedevpane()
  }
  static keydown(evt){
    console.log("Keysdown")
    if(this.keys.indexOf(evt.key)==-1){
      this.keys.push(evt.key)
    }
    Input.updatedevpane()
    //console.log(evt.key+" "+this.keys)
  }
  static keyup(evt){
    //console.log("Keysup")
    if(this.keys.indexOf(evt.key)>=0){
      this.keys.splice(this.keys.indexOf(evt.key), 1)
    }
    Input.updatedevpane()
    //console.log(evt.key+" "+this.keys)
  }
  static touchstart(evt){
    Input.updatedevpane()
  }
  static init(){
    //Init key detection
    document.addEventListener('keydown', this.keydown.bind(this))
    document.addEventListener('keyup', this.keyup.bind(this))
    
    //Init mouse detection
    document.addEventListener("mousemove", this.getmousepos.bind(this))
    document.addEventListener("mousedown", (function(e){this.mousedown = true;Input.updatedevpane()}).bind(this))
    document.addEventListener("mouseup", (function(e){this.mousedown = false;Input.updatedevpane()}).bind(this))

    //Init touch detection
  }
}
class Game{
  static start () {
    //Get context
    this.canvas = document.getElementById("game")
    this.ctx = this.canvas.getContext("2d");
    this.canvas.height = 270;
    this.canvas.width = 480;
    
    Input.init()
  }
  static render(env){
    env.resettransform(false)
    console.log("Attempting render")
    //background
    this.ctx.drawImage(env.bgimage, 0, 0, env.bgimage.width, env.bgimage.height, -1*this.canvas.width/2, -1*this.canvas.height/2, this.canvas.width, this.canvas.height)
    //focal island
    env.island.render(env)
    //griditems
    for(var i = 0; i < env.island.local.griditems.length; i++){
      env.island.local.griditems[i].render(env)
    }
    /*env.menuset[env.menuset.length-1].render(env)
    for(var i = 0; i < env.popupset.length; i++){
      env.popupset[i].render(env)
    }
    env.mastermenu.render(env)*/
  }
}
class Renderer{
  static getanimtree(obj, list, path = ''){
    if(path!='')
      path+='/'
    for(var i = 0; i < obj.config.length; i++){
      let x = obj.config[i]
      //console.log(obj+'im'+x)
      if(obj[x].hasOwnProperty('config')){
        Renderer.getanimtree(obj[x], list, path+x)
      }else{
        list.push({name: path+x, dat: obj[x]})
      }
    }
  }
  static getexpandedpos(val, saltrange){
    if(!val){
      return 0
    }else{
      switch(val){
        case '.CENTER':
          return saltrange/2
        case '.UPPER':
          return saltrange
        default:
          return val
      }
    }
  }
  static addpos(pos1, pos2){
    pos1.x = (pos1.x||0)+(pos2.x||0)
    pos1.y = (pos1.y||0)+(pos2.y||0)
    pos1.rot = ((pos1.rot||0)+(pos2.rot||0))%360
    pos1.size = (pos1.size||1)*(pos2.size||1)
    return pos1
  }
  ready = false
  constructor({
    env,
    type,//ex Monster/nn/snail/rare ex Decoration/pt/bubblerite/small
  }={}){
    //FETCH METADATA
    this.dat = Resourcer.getanims(env,type)
    
    //LOAD ALL RESOURCES
    Promise.all(
      this.dat.srcs.map(async (t, i) => {
        const tmpImage = new Image();
        const syncPromise = new Promise((resolve) => {
          tmpImage.onload = (e) => {
            //Handle image
            console.log("Finished loading image: ", i);
            //resolve final image
            resolve(tmpImage); 
          };
          //Begin loading each image
          tmpImage.src = 'gfx/'+type+(this.dat.srcext==''?'':'/')+t.src+this.dat.srcext;
          tmpImage.pos = t.defaultposition
        });
        // Wait for syncPromise (image loaded)
        return await syncPromise;
      })//Slack systems
    ).then((values) => {
      this.resources = values
      //PROCESS RESOURCES
      for(var i = 0; i < this.resources.length; i++){
        let img = this.resources[i]
        img.pos.x = Renderer.getexpandedpos(img.pos.x, img.width)*-1
        img.pos.y = Renderer.getexpandedpos(img.pos.y, img.height)*-1
        img.pos.rot = (img.pos.rot||0)
        img.pos.size = (img.pos.size||1)
        console.log(img.pos)
      }

      this.components = {}
      
      //CONFIGURE ALL RENDERER COMPONENTS
      for(var i = 0; i < this.dat.config.length; i++){
        let currcomponent = this.dat.config[i]
        let cdat = {}
        
        //Get srcs
        let srcs = []
        for(var d = 0; d < currcomponent.srcmeta.length; d++){
          srcs.push(this.resources[currcomponent.srcmeta[d].id])
        }
        cdat.srcs = srcs
        
        //Push final component
        this.components[currcomponent.name] = cdat
      }
      //CONFIGURE ANIMATION CHANNELS
      this.defaultpos = this.dat.anims.defaultstate
      this.animationset = {}
      var biglist = []
      console.log(this.dat.anims)
      Renderer.getanimtree(this.dat.anims, biglist)

      for(var key of biglist){
        this.animationset[key.name] = key.dat
      }
      
      console.log(this)
      
      this.ready = true
      console.log("This renderer has been loaded")
    });
  }
  plot(env, state, pos, ops){
    for(var x of state['.INDEXES']){
      var image = this.components[x].srcs[state[x].index]
      var finalpos = Renderer.addpos(pos, state[x])//Component pos relative to canvas center
      env.resettransform(ops.isongrid)//Center canvas
      Game.ctx.transform(finalpos.size, 0, 0, finalpos.size, finalpos.x, finalpos.y)//Srite entity
      Game.ctx.rotate(finalpos.rot)
      console.log(image.pos)
      console.log([finalpos.x, finalpos.y])
      console.log([image.pos.x, image.pos.y, image.width, image.height])
      Game.ctx.drawImage(image, 0, 0, image.width, image.height, image.pos.x, image.pos.y, image.width, image.height)
      console.log("Plotted component")
      console.log(image)
    }
  }
  render(env,channel,frame,pos,ops){
    if(!this.ready)
      return false
    if(!this.animationset[channel])
      return false
    switch(this.animationset[channel].mode){
      case "stillframe":
        this.plot(env, this.defaultpos, pos, ops)
      break;
      /*case "skeletal":
        nothing
      break;
      case "framed":
        nothing
      break;
      case "motile":
        nothing
      break;*/
    }
  }
}

//import * as mypaths from './st/tracks/cloud/loader.js'
class Popup{
  //creating a popup
  constructor({
    title="LISTEN UP!",
    description=null,
    components = [],
    type="notice",
    actions=null,
    height=null
  }={}){
    this.title = title
    if(description){
      components.unshift(new TextComponent(description))
    }else{
    }
    this.components = components
    if(type=="selector"){
      this.actions = actions
    }else if(type=="none"){
      this.actions = []
    }else if(type=="notice"){
      this.actions = [new Button({type:'ok'})]
    }else if(type=="confirmation"){
      this.actions = [new Button({type:'ok'}), new Button({type:'close'})]
    }
    this.maxheight = height
  }
}

class CadenceEngine{
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
        console.log(t+(clocks[g].count+1))
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
var Song = class {
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
}
var Island = class {
  constructor(
    {env,
    typemini,
    type
    }={}){
    if(!type){
      type = "Island/"+typemini
    }
    typemini = type.split("/")[1]
    this.local.type = type
    this.local.typemini = typemini
    this.renderer = new Renderer({env:env, type:type})//Islands do not use the torrent
  }
  place(env, griditem, location){
    //Insert into griditem list(topto bottom)
    if(this.local.griditems.length==0||coordIsoToRect(this.local.griditems[this.local.griditems.length-1].local.location).y<coordIsoToRect(location).y){
      this.local.griditems.push(griditem)
    }else if(coordIsoToRect(this.local.griditems[0].local.location).y>coordIsoToRect(location).y){
      this.local.griditems.unshift(griditem)
    }else{
      let gary = 0
      while(coordIsoToRect(this.local.griditems[gary].local.location).y<coordIsoToRect(location).y){
        gary++
      }
      this.local.griditems.splice(gary, 0, griditem)
    }
    this.local.monsters.push(griditem)
    griditem.place(this, location)
  }
  local = {
    griditems:[],
    monsters:[],
  }
  go = function(env){
    env.island = this
  }
  purge = function(){
    this.griditems = []
  }
  generate = function(obstacles){
    console.log("NOOOOOOOO")
  }
  purchase = function(Env){
    this.generate(Env)
    this.go(Env)
  }
  getbgimage = function(){
    //var img = new Image()
    //img.src = 
    return "gfx/Sky/"+this.local.typemini+".png"
  }
  render = function(env){
    this.renderer.render(env, 'idle', 0, {x:0,y:0,size:1, rot:0}, {isongrid:true})
  }
}
var Griditem = class{
  gridoccupation = [[1]]
  local = {
    loc:{}
  }
  moveto = function(Env, loc){
    remove(Env)
    place(Env,loc)
  }
  place = function(Env,loc){
    this.local.location = loc
  }
  remove = function(Env){
    local.loc = {}
  }
  render(env){
    console.log("Griditems currently do not know how to render. Failed render "+this.meta.name+":"+this.local.name)
  }
}
var Monster = class extends Griditem{
  constructor({env, type, typemini}={}){
    super()
    //this.elements = dat.elements
    /*this.local.type = dat.type
    if(!dat.destined){
      this.generate(dat)
    }*/
    if(!type){
      type = "Monster/"+typemini
    }
    typemini = type.split("/")[1]+'/'+type.split("/")[2]
    if(MonsterLoader.hasMeta(type)){
      var meta = MonsterLoader.downloadMeta(type)
    }else{
      var meta = Resourcer.getmeta(env, type)
      MonsterLoader.uploadMeta(type, meta)
    }
    this.local.type = type
    this.local.typemini = typemini
    this.generate(meta)
  }
  loadrenderer(env){
    this.renderer = new Renderer({env:env, type:this.local.type})
  }
  generate = function(dat){
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
    renderer
    */
    this.local.name = dat.aliases[Math.floor(Math.random()*dat.aliases.length)]
    this.local.citizenship = 2//later based on island data
    this.local.bank = 0
    this.local.functionallocation = "None"
    this.local.level = 1
  }
  vote = function(block){
    console.log(this.local.type+" voted on "+block)
    switch(this.local.citizenship){
      case 0:
        block.setFlag()
      break;
      case 1:
        if(block.get(this.local.type)){
          block.setflag()
        }
      break;
      case 2:
        if(block.get(this.local.type)){
          block.setflag()
        }
      break;
    }
  }
}
class Env{
  island = null
  menuset = []
  mastermenu = null
  popupset = []
  screenpanner = {
    x: 0,
    y: 0,
    size: 1,
    rot: 0
  }
  resettransform(usepanner){
    if(usepanner){
      Game.ctx.setTransform(this.screenpanner.size, 0, 0, this.screenpanner.size, this.width/2+this.screenpanner.x, this.height/2+this.screenpanner.y)
    }else{
      Game.ctx.setTransform(1, 0, 0, 1, this.width/2, this.height/2)
    }
  }
  constructor(){
    this.width = Game.canvas.width
    this.height = Game.canvas.height
  }
}
Game.start()
var env = new Env()
env.island = new Island({env: env, type: 'Island/arcanic'})

env.bgimage = new Image()
env.bgimage.onload = (e) => {
  Game.render(env)
}
env.bgimage.src = env.island.getbgimage()
console.log(env.bgimage)

var monsstorrm = new Monster({typemini:"cc/storrm",env:env})
var monsbruc = new Monster({typemini:"cc/bruc",env:env})
var monssnail = new Monster({typemini:"nn/snail",env:env})
var monsgam = new Monster({typemini:"nn/gam",env:env})
env.island.place(env, monsstorrm, {x:0,y:1})
env.island.place(env, monsbruc, {x:0,y:3})
env.island.place(env, monssnail, {x:0,y:0})
env.island.place(env, monsgam, {x:0,y:2})
//Ordering works
console.log(env.island.local.griditems)

var song = new Song({blocks:[{
  "snail":"1",
  "blur":"1"
}, {
  "snail":"1",
  "gam":"2"
}, {
  "blur":"2",
  "gam":"3"}]})
song.flagVerses([monsstorrm])
console.log(song)

var cadence = new CadenceEngine(120)
cadence.clock([0,4,4])
//cadence.begin()



function doGET(path, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        callback(xhr.responseText);
      } else {
        callback(null);
      }
    }
  };
  xhr.open("GET", path);
  xhr.send();
}
function handleFileData(fileData) {
  if (!fileData) {
    return;
  }
  console.log(fileData)
} // Do the request
doGET("./test.txt", handleFileData);
