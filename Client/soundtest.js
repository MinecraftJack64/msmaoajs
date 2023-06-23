var bruc = new Howl({
  src: ['st/tracks/cloud/bruc.mp3'],
  sprite: {
    track1: [0, 9600],
    track2: [9600, 9600]
  },
  //html5: true,
  preload: true
});
var storrm = new Howl({
  src: ['st/tracks/cloud/storrm.mp3'],
  sprite: {
    track1: [0, 4800],
    track2: [4800, 9600],
    track3: [14400, 2400]
  },
  //html5: true,
  preload: true
});
var pizci = new Howl({
  src: ['st/tracks/cloud/pizci.mp3'],
  sprite: {
    track1: [0, 9600],
    track2: [9600, 9600],
    track3: [19200, 9600]
  },
  //html5: true,
  preload: true
});
var mistikal = new Howl({
  src: ['st/tracks/cloud/mistikal.mp3'],
  sprite: {
    track1: [0, 4800],
    track3: [4800, 9600],
    track2: [14400, 9600]
  },
  //html5: true,
  preload: true
});
var durt = new Howl({
  src: ['st/tracks/cloud/durt.mp3'],
  sprite: {
    track1: [0, 9600],
    track3: [0, 4800],
    track2: [9600, 9600]
  },
  //html5: true,
  preload: true
});

function verse1(){
  pizci.stereo(1)
  durt.play('track1')
  pizci.play('track1')
  mistikal.play('track3')
  setTimeout(verse2, 9600)
}
function verse2(){
  bruc.play('track1');
  storrm.play('track1');
  pizci.play('track2')
  durt.play('track2')
  setTimeout(verse2_2, 4800)
  setTimeout(verse3, 9600)
}
function verse2_2(){
  storrm.play('track1');
  durt.play('track2')
}
function verse3(){
  bruc.play('track2')
  storrm.play('track2')
  pizci.play('track3')
  mistikal.play('track1')
  durt.play('track2')
  setTimeout(verse3_2, 4800)
  setTimeout(verse4, 9600)
}
function verse3_2(){
  durt.play('track2')
  mistikal.play('track1')
}
function verse4(){
  storrm.play('track3')
  mistikal.play('track1')
  durt.play('track2')
}
Howler.volume(0.1);
setTimeout(verse1, 4800)