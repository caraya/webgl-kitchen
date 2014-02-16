// Code by Eric Bidelman
// http://ericbidelman.tumblr.com/post/13471195250/web-audio-api-how-to-playing-audio-based-on-user
// Load file from a URL as an ArrayBuffer.
// Code by Eric Bidelman
// http://ericbidelman.tumblr.com/post/13471195250/web-audio-api-how-to-playing-audio-based-on-user
var context = new window.webkitAudioContext() || new window.AudioContext;
var source = null;
var audioBuffer = null;

/**
 Stop playing the current sound. Note that this will not pause the sound.
 It&#x27;ll stop and move to the beginning of the clip
 */
function stopSound() {
  if (source) {
    source.noteOff(0);
  }
}

/**
  Called from initSound to play the specified sound.
*/
function playSound() {
  // source is global so we can call .noteOff() later.
  source = context.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = false;
  source.connect(context.destination);
  source.noteOn(0); // Play immediately.
}

/**
  Called from loadSoundFile to decode the data downloaded
*/
function initSound(arrayBuffer) {
  context.decodeAudioData(arrayBuffer, function(buffer) {
    // audioBuffer is global to reuse the decoded audio later.
    audioBuffer = buffer;
  }, function(e) {
    console.log(&#x27;Error decoding file&#x27;, e);
  });
}


/**
  Load file from a URL as an ArrayBuffer.

  @param {string} url - File to load
*/
function loadSoundFile(url) {
  var xhr = new XMLHttpRequest();
  xhr.open(&#x27;GET&#x27;, url, true);
  xhr.responseType = &#x27;arraybuffer&#x27;;
  xhr.onload = function(e) {
    initSound(this.response); // this.response is an ArrayBuffer.
  };
  xhr.send();
}