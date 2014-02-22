// Detect if the audio context is supported.
window.AudioContext = (
  window.AudioContext ||
  window.webkitAudioContext ||
  null
);

if (!AudioContext) {
  throw new Error("AudioContext not supported!");
}

// Create a new audio context.
var ctx = new AudioContext();

// Create a AudioGainNode to control the main volume.
var mainVolume = ctx.createGain();
// Connect the main volume node to the context destination.
mainVolume.connect(ctx.destination);

// Create an object with a sound source and a volume control.
var sound = {};
sound.source = ctx.createBufferSource();
sound.volume = ctx.createGain();

// Connect the sound source to the volume control.
sound.source.connect(sound.volume);
// Hook up the sound volume control to the main volume.
sound.volume.connect(mainVolume);

// Make the sound source loop.
sound.source.loop = true;

// Load a sound file using an ArrayBuffer XMLHttpRequest.
var request = new XMLHttpRequest();
request.open("GET", soundFileName, true);
request.responseType = "arraybuffer";
request.onload = function(e) {

  // Create a buffer from the response ArrayBuffer.
  var buffer = ctx.createBuffer(this.response, false);
  sound.buffer = buffer;

  // Make the sound source use the buffer and start playing it.
  sound.source.buffer = sound.buffer;
  sound.source.start(ctx.currentTime);
};
request.send();