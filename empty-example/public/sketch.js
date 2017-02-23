var mic, sound, fft, amplitude, relative, mtoggle;

function preload(){
    // song = loadSound('assets/saved.mp3');
    song = loadSound('assets/runner.mp3');
}

function setup() {
  W = screen.width;
  H = screen.height;
  createCanvas(W,H);

  var bins = 1024;
  relative = H/Math.log2(bins/2);

  fft = new p5.FFT(0.8, bins);
  amplitude = new p5.Amplitude(.95);

  // mic = new p5.AudioIn();
  // mic.start();

  song.play();
  fft.setInput(song);


}

function draw() {
  background(0);

  var spectrum = fft.analyze();


  var bass = fft.getEnergy("bass");
  var treble = fft.getEnergy("treble");
  var col1 = color(200, bass, 255-bass);
  var col2 = color(bass/3, 255-bass/3, 220);

  var amp = amplitude.getLevel();

  fill(col2);
  noStroke();

  //draws spectrogramright
  beginShape();
  vertex(width/2, height);
  for (i = 0; i<spectrum.length; i++) {
    // vertex(Math.log2(i)*relative, map(spectrum[i], 10, 255, height, (height/2)) );
    vertex(map(spectrum[i], 0, 255, width/2, width), height - Math.log2(i)*relative);
  }
  vertex(width/2, 0);
  endShape();

  //draws spectrogramleft
  beginShape();
  vertex(width/2, height);
  for (i = 0; i<spectrum.length; i++) {
    // vertex(Math.log2(i)*relative, map(spectrum[i], 10, 255, height, (height/2)) );
    vertex(width/2 - map(spectrum[i], 0, 255, 0, width/2), height - Math.log2(i)*relative);
  }
  vertex(width/2, 0);
  endShape();

  //pulse
  fill(col1);
  ellipse(W/2, H/2, bass*3 + 50, treble*3 + 50);

}

function checkTempo(amp){

}

function mouseClicked(){

  console.log("clicked");
  mtoggle = !mtoggle;
  if(mtoggle){
    song.pause();
  } else {
    song.setVolume(0.7);
    // song.jump(100);
    song.play();
  }


}
