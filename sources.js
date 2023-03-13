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
var AnimMeta = {
  Island: {
    arcanic: {
      mode: 'island-generic',
      centreheight: 240
    }
  }
}
var UniversalMetadata = {
  Island: {
    arcanic: {
      name: "Arcanic Anthem",
      description: {
        global: "The land of creation and innocence"
      },
      defaultshopdata: {
        cost: [new Currency.coin(2000000)],
        levelreq: 20
      },
      nativeshop: {
        cats: ['Monster'],
        Monsterclass: 'Monster/cc',
        Monster: ['./storrm', './bruc']
      }
    },
    future: {
      name: "Euphoric Utopia",
      description: {
        global: "Truly Futuristic!"
      },
      defaultshopdata: {
        cost: [new Currency.coin(1000000)],
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
        name: 'Storrm',
        aliases: ['Thunderer', 'Batton', 'Zappies'],
        elements: new Sigilset(['charge']),
        gridsize: new Gridsize({h:2, k:2}),
        defaultshopdata: {
          cost: [new Currency.coin(330)],
          levelreq: 10
        },
        defaultbankdata: {
          
        },
        nativeislands: ['Island/arcanic', 'Island/fdc', 'Island/future'],
        description: {
          global: "Storrm is my favorite monster yay!",
          'Island/fdc': "Storrm finds the ancient grounds of harmony!"
        }
      },
      bruc: {
        name: 'Bruc',
        aliases: ['Dolbot', 'Skreech'],
        elements: new Sigilset(['wave', 'tonic']),
        gridsize: new Gridsize({h:1, k:1}),
        defaultshopdata: {
          cost: [new Currency.gem(50)],
          levelreq: 10
        },
        nativeislands: ['Island/arcanic', 'Island/fdc', 'Island/future'],
        defaultbankdata: {
          
        },
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
        elements: new Sigilset(['life']),
        gridsize: new Gridsize({h:2, k:2}),
        defaultshopdata: {
          cost: [new Currency.coin(250)],
          levelreq: 1
        },
        nativeislands: ['Island/life', 'Island/carnival'],
        defaultbankdata: {
          
        },
        description: {
          global: "THe og from the first game"
        }
      },
      gam: {
        name: 'Gam',
        aliases: ['name1', 'name2'],
        elements: new Sigilset(['life', 'shade']),
        gridsize: new Gridsize({h:1, k:1}),
        defaultshopdata: {
          cost: [new Currency.gem(30)],
          levelreq: 7
        },
        nativeislands: ['Island/life', 'Island/jungle'],
        defaultbankdata: {
          
        },
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
class Resourcer{
  static grab(source, type){
    console.log(type.split('/'))
    var tp = type.split("/")
    var obj = source
    for(var i = 0; i < tp.length; i++){
      obj = obj[tp[i]]
      //console.log(tp[i]+" "+obj)
    }
    //console.log(obj)
    return obj
  }
  static getanims(env, type){
    console.log("Grabbing anims")
    var obj = Resourcer.grab(AnimMeta, type)

    //Handle mode templates
    if(obj.hasOwnProperty('mode')){
      if(obj.mode=='island-generic'){
        return {
          srcext: '', //'.CENTER'
          srcs: [{src: '.svg', defaultposition: {rot: 0, size: 1, x: '.CENTER', y: obj.centreheight}}],
          config: [{name: 'main', srcmeta: [{id: 0}]}],
          defaulttree: [],
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

  static getmeta(env, type){
    console.log("Grabbing dat")
    var obj = Resourcer.grab(UniversalMetadata, type)
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
  valu = 0
}