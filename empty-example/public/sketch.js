var mic, sound, fft, amplitude, relative, mtoggle, atoggle, button, stars, time, cache;

function preload(){
    // song = loadSound('assets/snow.mp3');
    song = loadSound('assets/down.mp3');
}

function setup() {
  W = screen.width;
  H = screen.height;


  createCanvas(W,H);

  stars = [];

  var bins = 1024;
  relative = H/Math.log2(bins/2);

  fft = new p5.FFT(0.8, bins);
  fft2 = new p5.FFT(0.9, bins);
  amplitude = new p5.Amplitude(.95);

  mic = new p5.AudioIn(0.8);
  song.play();
  // song.jump(50)
  fft.setInput(song);

  button = createButton('change to mic');
  button.position(10, 10);
  button.mousePressed(setAudioSource);

  time = millis();
}

function draw() {

  var song = fft.analyze();
  // var mic = fft2.analyze();

  var bass = fft.getEnergy("bass");
  var treble = fft.getEnergy("treble");
  var col1 = color(200, bass, 255-bass);
  var col2 = color(bass/3, 255-bass/3, 220);

  var amp = amplitude.getLevel();

  background(12);
  // drawSpectrogram(song, true, col1);
  // drawSpectrogram(mic, false, color(200, bass, 255-bass, 100));
  // strokeWeight();

  drawCircleSpectrogram(song, bass, treble, true);
  drawCircleSpectrogram(song, bass, treble, false);

  // drawStars(stars, 1.004);

  // if(millis() - time > 1000){
  //
  // }


  // getDifference(song, mic);

  //pulse
  // fill(col1);
  // ellipse(W/2, H/2, bass*3 + 50, treble*3 + 50);

}

function getStars(amount){
  var array = [];
  for (var i = 0; i < amount; i++) {

    var x = random(width);
    var y = random(height);
    var z = random(5);

    array[i] = {
      x: x,
      y: y,
      z: z,
      vx: (x - width/2)*0.004,
      vy: (y - height/2)*0.004
    }

    console.log(array[i]);
  }
  return array;
}

function drawStars(speed){
  // noStroke();
  fill(220);
  for (var i = 0; i < stars.length; i++) {
    var star = stars[i];
    if(star.t > 100){
      stars[i] = null;
      // star.x = random(width);
      // star.y = random(height);
      // star.z = random(5);
    }
    // fill(250);
    point(star.x, star.y);
    star.x = (star.x - width/2)*speed;
    star.y = (star.y - height/1.7)*speed;
    // star.z = dist(star.x, star.y, width/2, height/1.7) * 0.01;
    star.t = star.t + 1;
  }
}

function setAudioSource(){
  atoggle = !atoggle;
  if(atoggle){
    song.pause();
    mic.start();
    fft.setInput(mic);
    // button.text('change to audio');
  } else {
    mic.stop();
    song.play();
    fft.setInput(song);
  }
}

function getDifference(a,b){
  var distance = 0;
  for (var i = 0; i < a.length; i++) {
    distance += abs(a[i] - b[i])/a.length;
  }
  textSize(64*(1/distance) + 32);
  text(distance, width/2, 100);
}

function drawSpectrogram(spectrum, fillEnabled, color){
  if(fillEnabled){
    fill(color);
    noStroke();
  } else {
    noFill();
    strokeWeight(2);
    stroke(200,200,0);
  }

  //draws spectrogramright
  beginShape();
  vertex(width/2, height);
  for (i = 0; i<spectrum.length; i++) {
    // vertex(Math.log2(i)*relative, map(spectrum[i], 0, 255, height, 0) );
    vertex(map(spectrum[i], 0, 255, width/2, width), height - Math.log2(i)*relative);
  }
  vertex(width/2, 0);
  // vertex(width/2, height);
  endShape();

  // draws spectrogramleft
  beginShape();
  vertex(width/2, height);
  for (i = 0; i<spectrum.length; i++) {
    // vertex(Math.log2(i)*relative, map(spectrum[i], 10, 255, height, (height/2)) );
    vertex(width/2 - map(spectrum[i], 0, 255, 0, width/2), height - Math.log2(i)*relative);
  }
  vertex(width/2, height);
  endShape();
}

function drawCircleSpectrogram(spectrum, bass, treble, right){
  push();
  translate(width/2, height/1.7);

  var r = height * 0.40;
  var theta = radians(270);
  var max = 0;

  for (i = 0; i<513; i++) {
    // Convert polar to cartesian
    var val = spectrum[i];
    var val_rel = 1 + spectrum[i]/255;

    var x = r * val_rel * cos(theta);
    var y = r * val_rel * sin(theta);

    // strokeWeight(3);
    var c = color(val-bass*0.3, val-bass*0.5, val-treble*0.3);
    stroke(c);
    // point(x,y);
    line(0, 0, x, y);

    if(right){
      theta += radians(0.3515625);
    } else {
      theta -= radians(0.3515625);
    }

  }
  pop();
  // endShape();
}

// function mouseClicked(){
//   mtoggle = !mtoggle;
//   if(mtoggle){
//     song.pause();
//   } else {
//     song.setVolume(0.7);
//     // song.jump(100);
//     song.play();
//   }
// }
