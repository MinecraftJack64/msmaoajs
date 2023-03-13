var sound = new Howl({
  src: ['st/tracks/cloud/storrm.mp3'],
  sprite: {
    track1: [0, 4750],
    track2: [4800, 9600],
    track3: [14400, 2000]
  },
  //html5: true,
  preload: true
});

function conjunction(){
  sound.play('track3');
}
setTimeout(conjunction, 5000)