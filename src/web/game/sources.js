var Currency = {
  coin: function(amount){
    this.amount = amount
    this.exchangerate = 500000
  },
  gem: function(amount){
    this.amount = amount
    this.exchangerate = 2
  }
}
function Sigilset(listez) {
  this.elements = listez
  this.combine = function(list2){
    console.log("Sigil combine function deprecated")
  }
}
function Gridsize({h,k,ls}={}){
  if(ls){
    this.x = ls.length
    this.y = ls[0].length
    this.grid = ls
  }else{
    this.y = k
    this.x = h
    let s = []
    for(var x = 0; x < h; x++){
      let p = []
      for(var y = 0; y < k; y++){
        p.push(true)
      }
      s.push(p)
    }
    this.grid = s
  }
}
var SongMeta = {
  Tracks: {
    //stuf
  }
}
var AnimMeta = {
  Island: {
    arcanic: {
      mode: 'island-generic',
      centreheight: 240
    }
  },
  Monster: {
    cc: {
      bruc: {
        srcext: '.svg', //'.CENTER'
        srcs: [{src: 'body', defaultposition: {rot: 0, size: 1, x: 35, y: 50}},
              {src: 'head', defaultposition: {rot: 0, size: 1, x: 50, y: 60}},
              {src: 'mouth1', defaultposition: {rot: 0, size: 1, x: '.CENTER', y: '.CENTER'}}, {src: 'mouth2', defaultposition: {rot: 0, size: 1, x: '.CENTER', y: '.CENTER'}}],
        config: [{name: 'main', srcmeta: [{id: 0}]},
                {name: 'head', srcmeta: [{id: 1}]},
                {name: 'mouth', srcmeta: [{id: 2}, {id: 3}]}],
        defaulttree: {name: 'BodyBone', length: 16, deg: -90, children: [{mode:'ligament', name: 'NeckLigament', x: 0, y: 0, children: [{name: 'Headbone', length: 10, deg: 0}]}]},
        bindingmagic: [{target: 'Headbone', subject: 'head', binddata: {bindtype: 'at'}},{target: 'BodyBone', subject: 'main', binddata: {bindtype: 'at'}},{target: 'Headbone', subject: 'mouth', binddata: {bindtype: 'at', offsetx: 0.7, offsety: 2.5}}],
        scalefactor: 0.3,
        anims: {
          defaultstate: {
            'main': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'head': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'mouth': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            '.INDEXES': ['main', 'head', 'mouth']
          },
          idle: {
            mode:'skeletal',
            state:'.DEFAULTSTATE'
          },
          config: ['idle']
        }
      },
      keyral: {
        srcext: '.svg', //'.CENTER'
        srcs: [{src: 'main', defaultposition: {rot: 0, size: 1, x: '.CENTER', y: 0}},
              {src: 'eye', defaultposition: {rot: 0, size: 1, x: '.CENTER', y: '.CENTER'}},
              {src: 'leg', defaultposition: {rot: 0, size: 1, x: 10, y: '.CENTER'}},
              {src: 'foreleg', defaultposition: {rot: 0, size: 1, x: 10, y: '.CENTER'}},
              {src: 'foot', defaultposition: {rot: 0, size: 1, x: 3, y: '.CENTER'}}],
        config: [{name: 'main', srcmeta: [{id: 0}]},
                {name: 'leye', srcmeta: [{id: 1}]},
                {name: 'reye', srcmeta: [{id: 1}]},
                {name: 'meye', srcmeta: [{id: 1}]},
                {name: 'rightfrontleg', srcmeta: [{id: 2}]},
                {name: 'leftfrontleg', srcmeta: [{id: 2}]},
                {name: 'rightbackleg', srcmeta: [{id: 2}]},
                {name: 'leftbackleg', srcmeta: [{id: 2}]},
                {name: 'rightfrontforeleg', srcmeta: [{id: 3}]},
                {name: 'leftfrontforeleg', srcmeta: [{id: 3}]},
                {name: 'rightbackforeleg', srcmeta: [{id: 3}]},
                {name: 'leftbackforeleg', srcmeta: [{id: 3}]},
                {name: 'rightfrontfoot', srcmeta: [{id: 4}]},
                {name: 'leftfrontfoot', srcmeta: [{id: 4}]},
                {name: 'rightbackfoot', srcmeta: [{id: 4}]},
                {name: 'leftbackfoot', srcmeta: [{id: 4}]}],
        defaulttree: {name: 'BaseBone', length: 0, deg: -90, children: [
          {mode:'ligament', name: 'BodyLigament', x: 0, y: 10, children: [
            {name: 'Headbone', length: 10, deg: 0}
          ]}
        ]},
        bindingmagic: [],
        scalefactor: 0.3,
        anims: {
          defaultstate: {
            'main': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'leye': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'reye': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'meye': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'rightfrontleg': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'leftfrontleg': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'rightbackleg': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'leftbackleg': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'rightfrontforeleg': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'leftfrontforeleg': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'rightbackforeleg': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'leftbackforeleg': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'rightfrontfoot': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'leftfrontfoot': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'rightbackfoot': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'leftbackfoot': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0}
          },
          idle: {
            mode:'skeletal',
            state:'.DEFAULTSTATE'
          },
          config: ['idle']
        }
      },
      storrm: {
        srcext: '.svg', //'.CENTER'
        srcs: [{src: 'body', defaultposition: {rot: 0, size: 1, x: '.CENTER', y: '.CENTER'}},
              {src: 'leftarm', defaultposition: {rot: 0, size: 1, x: 35, y: 12}},
              {src: 'mouth', defaultposition: {rot: 0, size: 1, x: '.CENTER', y: '.CENTER'}},
              {src: 'eye1', defaultposition: {rot: 0, size: 0.9, x: '.CENTER', y: '.CENTER'}},
              {src: 'lightning', defaultposition: {rot: 0, size: 1, x: '.CENTER', y: 0}},
              {src: 'lefthorn', defaultposition: {rot: 0, size: 1, x: 20, y: 20}},
              {src: 'righthorn', defaultposition: {rot: 0, size: 1, x: 8, y: 20}}],
        config: [{name: 'main', srcmeta: [{id: 0}]},
                {name: 'leftarm', srcmeta: [{id: 1}]},
                {name: 'rightarm', srcmeta: [{id: 1}]},
                {name: 'mouth', srcmeta: [{id: 2}]},
                {name: 'leye', srcmeta: [{id: 3}]}, {name: 'reye', srcmeta: [{id: 3}]}, {name: 'meye', srcmeta: [{id: 3}]}, 
                {name: 'lightning', srcmeta: [{id: 4}]},
                {name: 'lefthorn', srcmeta: [{id: 5}]},
                 {name: 'righthorn', srcmeta: [{id: 6}]}
                ],
        //defaulttree: {name: 'BodyBone', length: 16, deg: -90, children: [{mode:'ligament', name: 'NeckLigament', x: 0, y: 0, children: [{name: 'Headbone', length: 10, deg: 0}]}]},
        defaulttree: {name: 'BaseBone', length: 0, deg: -90, children: [{mode:'ligament', name: 'BodyLigament', x: 0, y: 35, children: [{name: 'BodyBone', length: 0, deg: 0, children: [{mode:'ligament', name: 'Leftmount', x: -19, y: -2, children: [{name: 'Leftstub', length: 0, deg: 0}]},{mode:'ligament', name: 'Rightmount', x: 19, y: -2, children: [{name: 'Rightstub', length: 0, deg: 0}]},{mode:'ligament', name: 'Rightheadmount', x: 13, y: 4.7, children: [{name: 'Rightheadstub', length: 0, deg: 0}]},{mode:'ligament', name: 'Leftheadmount', x: -11, y: 5, children: [{name: 'Leftheadstub', length: 0, deg: 0}]}]}]}]},
        //bindingmagic: [],
        bindingmagic: [{target: 'BodyBone', subject: 'main', binddata: {bindtype: 'at'}},{target: 'BodyBone', subject: 'meye', binddata: {bindtype: 'at', offsetx: 0.7, offsety: 3.4}},{target: 'BodyBone', subject: 'leye', binddata: {bindtype: 'at', offsetx: -4.5, offsety: 0.9}},{target: 'BodyBone', subject: 'reye', binddata: {bindtype: 'at', offsetx: 5.8, offsety: 0.9}}, {target: 'BodyBone', subject: 'mouth', binddata: {bindtype: 'at', offsetx: 1, offsety: -4}},{target: 'Rightstub', subject: 'rightarm', binddata: {bindtype: 'at'}},{target: 'Leftstub', subject: 'leftarm', binddata: {bindtype: 'at'}},{target: 'Leftheadstub', subject: 'lefthorn', binddata: {bindtype: 'at'}},{target: 'Rightheadstub', subject: 'righthorn', binddata: {bindtype: 'at'}},{target:'BodyBone', subject: 'lightning', binddata:{bindtype: 'at', offsety:-5}}],
        scalefactor: 0.3,
        anims: {
          defaultstate: {
            'mouth': {rot: 0, size: 1, x: 1, y: 4, visible: true, index: 0},
            'meye': {rot: 0, size: 1, x: 0.7, y: -3.4, visible: true, index: 0},
            'leye': {rot: 0, size: 1, x: -4.5, y: -0.9, visible: true, index: 0},
            'reye': {rot: 0, size: 1, x: 5.8, y: -0.9, visible: true, index: 0},
            'main': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
            'lightning': {rot: 0, size: 1, x: 0, y: 5, visible: true, index: 0},
            'lefthorn': {rot: 0, size: 1, x: -11, y: -5, visible: true, index: 0},
            'righthorn': {rot: 0, size: 1, x: 13, y: -4.7, visible: true, index: 0},
            'leftarm': {rot: 0, size: 1, x: -19, y: 2, visible: true, index: 0},
            'rightarm': {rot: 0, size: 1, x: 19, y: 2, xs: -1, visible: true, index: 0},
            '.INDEXES': ['rightarm','righthorn','lightning','main','mouth','meye','leye','reye','leftarm','lefthorn']
          },
          idle: {
            mode:'skeletal',
            state:'.DEFAULTSTATE'
          },
          config: ['idle']
        }
      }
    }
  },
  gui: {
    Button: {
      square: {
        //
      }
    }
  }
}
var UniversalMetadata = {
  Island: {
    arcanic: {
      defaultshopdata: {
        cost: {coin:2000000},
        levelreq: 20
      },
      includeglobalshop: true,
      nativeshop: {
        cats: ['Monster'],
        Monsterclass: 'Monster/cc',
        Monster: ['./storrm', './bruc']
      }
    },
    future: {
      defaultshopdata: {
        cost: {coin:1000000},
        levelreq: 10
      },
      nativeshop: {
        cats: ['Monster'],
        Monsterclass: 'Monster/cc',
        Monster: ['./storrm', './bruc']
      }
    }
  },
  Monster: {
    cc: {
      storrm: {
        elements: ['charge'],
        gridsize: {h:2, k:2},
        defaultshopdata: {
          cost: {"coin": 330},
          levelreq: 10
        },
        defaultbankdata: {
          
        },
        nativeislands: ['Island/arcanic', 'Island/club', 'Island/future']
      },
      bruc: {
        elements: ['wave', 'tonic'],
        gridsize: {h:1, k:1},
        defaultshopdata: {
          cost: {"gem": 50},
          levelreq: 10
        },
        nativeislands: ['Island/arcanic', 'Island/club', 'Island/future'],
        defaultbankdata: {
          
        }
      }
    },
    nn: {
      snail: {
        elements: ['life'],
        gridsize: {h:2, k:2},
        defaultshopdata: {
          cost: [new Currency.coin(250)],
          levelreq: 1
        },
        nativeislands: ['Island/life', 'Island/glacier', 'Island/carnival', 'Island/mineshaft', 'Island/reef', 'Island/plains', 'Island/club'],
        defaultbankdata: {
          
        }
      },
      gam: {
        elements: ['life', 'shade'],
        gridsize: {h:1, k:1},
        defaultshopdata: {
          cost: [new Currency.gem(30)],
          levelreq: 7
        },
        nativeislands: ['Island/life', 'Island/jungle', 'Island/reef'],
        defaultbankdata: {
          
        }
      }
    }
  }
}
var LangMeta = {
  Song: {
    arcanic:{
      majorsingers: {'C':'Monster/cc', 'I':'Island/arcanic'},
      format: 'lobby',
      subdivs: [2,2],
      /*Song formatting examples
      Each element of the sequence array lasts commonverse beats at bpm beats per minute
      Each further subarray is divided into equal parts of its own length.
      for example, [1,[1,1,1],1,[1,1]]
      is basically a quarter note, then a triplet, then another quarter note, and 2 eighths
      If an element of an array is an object, it is assumed to be a message block
      Everything under the property "rep" will have their track repeated a specified amount of times
      Everything under the property "join" will repeatedly play their track for the remainder of the song
      or until "leave" calls them which will instantly abort any track they were playing.
      format example
      {rep:{'monster1':['.I/track1',3], 'monster2':['.I/track1',4]}, leave:{'monster3':'.I/track1'}}
      will make monster1 play its first track 3 times, monster2 4 times, and make monster3 return to idle
      Monster names can be abbreviated using major singers
      */
      sequence: [{rep: {'.C/storrm':['.I/track1',2],'.C/bruc':['.I/track1',1]}, join: {'.C/staremin':'.I/track1'}},
                 {},
                 {rep:{'.C/storrm':['.I/track2',1]}},
{}, {leave:['.C/staremin']}, {}]/*Each element is one track unit*/,
      bpm: 100,//beats per minute
      commonverse: 8,//beats per track unit
      tracks:{
        '.C/storrm':{
          '.I/track1':1,
          '.I/track2':[2,1]//length of this track is 2+1*subdivs[0] track units
        },
        '.C/bruc':{
          '.I/track1':4
        },
        '.C/staremin':{
          '.I/track1':1
        }
      }
    }
  },
  Island: {
    arcanic: {
      name: "Arcanic Anthem",
      startingsong: 'Song/arcanic',
      description: {
        global: "The land of creation and innocence"
      }
    },
    future: {
      name: "Euphoric Utopia",
      startingsong: 'Song/future',
      description: {
        global: "Truly Futuristic!"
      }
    }
  },
  Monster: {
    cc: {
      storrm: {
        name: 'Storrm',
        aliases: ['Thunderer', 'Batton', 'Zappies'],
        description: {
          global: "Storrm is my favorite monster yay!",
          'Island/fdc': "Storrm finds the ancient grounds of harmony!"
        }
      },
      bruc: {
        name: 'Bruc',
        aliases: ['Dolbot', 'Skreech'],
        description: {
          global: "Bruce aided in Bruc's design",
          'Island/fdc': "Bruc is ready to party"
        }
      }
    },
    nn: {
      snail: {
        name: 'Snaily',
        aliases: ['name1', 'name2'],
        description: {
          global: "The OG from the first game"
        }
      },
      gam: {
        name: 'Gam',
        aliases: ['name1', 'name2'],
        description: {
          global: "cute pickle"
        }
      }
    }
  }
}
monsteranimex = {
  srcs: ["body", "tuner", "pupil", "eyelid1", "eyelid2", "eyelid3", "chin", "lip", "stringarm", "stringhand1", "stringhand2", "upperarm", "lowerarm", "hand1", "hand2", "string"],
  config: [{name: 'main', srcmeta: [{src: 0, defaultposition: {rot: 0, size: 1, x: '.CENTER', y: -100}}]}, {name: 'tuner1', srcmeta: [{src: 0, defaultposition: {rot: 0, size: 1, x: '.CENTER', y: -100}}]}],
  defaulttree: [],
  anims: {
    idle: {
      mode:'stillframe',
      state: {
        'main': {rot: 0, size: 1, x: 0, y: 0}
      }
    }
  }
}
/*islandgenericexample = {
  srcs = ["arcanic"],
  config = [{name: 'main', srcmeta: [{src: 0, defaultposition: {rot: 0, size: 1, x: '.CENTER', y: -100}}]}],
  defaulttree = [],
  anims = {
    idle: {
      mode:'stillframe',
      state: {
        'main': {rot: 0, size: 1, x: 0, y: 0}
      }
    }
  }
}*/
async function getsrc(origin, type){
  if(origin==="client"){
    return await (await fetch(type+".json")).json()
  }
  return await PostOffice.fetchAndParse(type+".json")
}
class Resourcer{
  static grab(source, type){
    console.log(type.split('/'))
    var tp = type.split("/")
    var obj = source
    console.log(source)
    for(var i = 0; i < tp.length; i++){
      obj = obj[tp[i]]
      console.log(tp[i])
      console.log(obj)
    }
    //console.log(obj)
    return obj
  }
  static getanims(env, type){
    console.log("Grabbing anims for "+type)
    var obj = Resourcer.grab(AnimMeta, type)
    console.log("Dat to be processed")
    console.log(obj)
    if(type=="Island/arcanic"){
      console.log("HORRIFIC")
      console.log(obj)
    }
    //Handle mode templates
    if(obj.hasOwnProperty('mode')){
      if(obj.mode=='island-generic'){
        return {
          srcext: '', //'.CENTER'
          srcs: [{src: '.svg', defaultposition: {rot: 0, size: 1, x: '.CENTER', y: obj.centreheight}}],
          config: [{name: 'main', srcmeta: [{id: 0}]}],
          defaulttree: null,
          anims: {
            defaultstate: {
              'main': {rot: 0, size: 1, x: 0, y: 0, visible: true, index: 0},
              '.INDEXES': ['main']
            },
            idle: {
              mode:'stillframe',
              state:'.DEFAULTSTATE'
            },
            config: ['idle']
          }
        }
      }
      else if(obj.mode=='monster-facade'){}
    }

    //Return result
    return obj
  }

  static getmeta(type){
    console.log("Grabbing dat for "+type)
    var obj = Resourcer.grab(UniversalMetadata, type)//await Resourcer.fetch('gamedata/gfxdat', type)
    //Handle mode templates
    if(obj.hasOwnProperty('mode')){
      if(obj.mode=='island-generic'){
      }
      else if(obj.mode=='monster-facade'){}
    }

    //Return result
    return obj
  }
  static getlang(type){
    console.log("Grabbing dat for "+type)
    var obj = Resourcer.grab(LangMeta, type)//await Resourcer.fetch('gamedata/gfxdat', type)
    //Handle mode templates
    if(obj.hasOwnProperty('mode')){
      if(obj.mode=='island-generic'){
      }
      else if(obj.mode=='monster-facade'){}
    }

    //Return result
    return obj
  }

  
  static getdanims(env, type){
    return env
  }
}
//set UniversalMetadata to fetch download list from http://localhost:3000/api/gamedata/downloadlist
//Recursively go through UniversalMetadata and all nested objects and for each object if it has a 'files' property, fetch all files in that property and store them by filename in the object
async function loadDownloadList(){
  UniversalMetadata = await (await fetch("http://localhost:3000/api/gamedata/downloadlist")).json()
  console.log(UniversalMetadata)
  async function loadfiles(a){
    for(var i in a){
      if(i=='files'){
        for(var j of a.files){
          console.log(j)
          //a.files[j] = await (await fetch(a.files[j])).json()
        }
      }else{
        await loadfiles(a[i])
      }
    }
  }
  await loadfiles(UniversalMetadata)
  console.log(UniversalMetadata)
}