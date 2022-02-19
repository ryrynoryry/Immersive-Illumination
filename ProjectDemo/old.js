let audioCtx;
let gainNode;
let oscillator;
let freq = 100;
let detuneVal = 0;

const createBtn = document.querySelector('#createBtn');
const pauseBtn = document.querySelector('#pauseBtn');
const stopBtn = document.querySelector('#stopBtn');

const timeDisplay = document.querySelector('#timeLbl');

pauseBtn.setAttribute('disabled','disabled');
stopBtn.setAttribute('disabled','disabled');

createBtn.onclick = function() {
  createBtn.setAttribute('disabled','disabled');
  pauseBtn.removeAttribute('disabled');
  stopBtn.removeAttribute('disabled');

  // create web audio api context
  AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  // create Oscillator and gain node
  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();

  // connect oscillator to gain node to speakers
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Make noise, sweet noise
  oscillator.type = 'square';
  oscillator.frequency.value = freq; // value in hertz
  oscillator.start(0);

  changeVolume(volumeSlider)
  // gainNode.gain.value = 0.1;

  // report the state of the audio context to the
  // console, when it changes
  audioCtx.onstatechange = function() {
    console.log(audioCtx.state);
  }
}

// suspend/resume the audiocontex
pauseBtn.onclick = function() {
  if(audioCtx.state === 'running') {
    audioCtx.suspend().then(function() {
      pauseBtn.textContent = 'Resume';
    });
  } else if(audioCtx.state === 'suspended') {
    audioCtx.resume().then(function() {
      pauseBtn.textContent = 'Pause';
    });
  }
}

// close the audiocontext
stopBtn.onclick = function() {
  audioCtx.close().then(function() {
    createBtn.removeAttribute('disabled');
    pauseBtn.setAttribute('disabled','disabled');
    stopBtn.setAttribute('disabled','disabled');
  });
}

function displayTime() {
  if(audioCtx && audioCtx.state !== 'closed') {
    timeDisplay.textContent = 'Current context time: ' + audioCtx.currentTime.toFixed(3);
  } else {
    timeDisplay.textContent = 'Current context time: No context exists.'
  }
  requestAnimationFrame(displayTime);
}

displayTime();

const volumeSlider = document.querySelector('#volumeSldr');
let volumeValue = document.querySelector("#volumeVal");
const volumeSliderLinear = document.querySelector('#volumeSldrLinear');
let volumeValueLinear = document.querySelector("#volumeValLinear");

volumeSlider.oninput = function() {
  if (typeof gainNode !== 'undefined') {
    changeVolume(this);
  }
  volumeValue.innerHTML = this.value;
  WriteValue(this.value, "writeValue.php", "volume.txt", "w+");
}

volumeSliderLinear.oninput = function() {
  gainNode.gain.value = parseInt(this.value) / parseInt(this.max);
  volumeValueLinear.innerHTML = this.value;
}

// VOLUME SLIDER!!
function changeVolume(element) {
  var volume = element.value;
  var fraction = parseInt(volume) / parseInt(element.max);
  // Let's use an x*x curve (x-squared) since simple linear (x) does not
  // sound as good.
  gainNode.gain.value = fraction * fraction;
}

function WriteValue(text, phpFile, fileName, mode) {
  $.ajax({
    type: 'POST',
    url: phpFile,
    data: {value: text, fileName: fileName, fileMode: mode},
    // key value pair created, 'something' is the key, 'foo' is the value
    success: function(result) {
      // console.log( '"' + text + '" was successfully sent to the server');
    }
  });
};

const testSlider = document.querySelector("#testSlider");
var sliderOutput = document.querySelector("#sliderOutput");

testSlider.oninput = function(event) {
  sliderOutput.innerHTML = testSlider.value;
  freq = testSlider.value;
  if (typeof oscillator !== 'undefined') {
    oscillator.frequency.value = freq;
  }
  WriteValue(testSlider.value, "writeValue.php", "Frequency.txt", "a+");
}

const detuneSlider = document.querySelector("#detuneSlider");
var detuneOutput = document.querySelector("#detuneOutput");

detuneSlider.oninput = function(event) {
  detuneOutput.innerHTML = detuneSlider.value;
  detuneVal = detuneSlider.value;
  if (typeof oscillator !== 'undefined') {
    oscillator.detune.value = detuneSlider.value;
  }
  // WriteValue(detuneSlider.value, "writeValue.php", "Frequency.txt", "a+");
}

const musicBtn = document.querySelector("#musicBtn");
musicBtn.setAttribute('disabled','disabled');
musicBtn.onload = function () {
  console.log(musicBtn);
}


// DEMO SECTION
let demoAudioCtx;
let demoBufferSource;
let demoBuffer;
let demoGainNode;
let demoVolume;

// TODO: Use these variables instead
let demoObj = {
  audioCtx: undefined,
  bufferSource: undefined,
  buffer: undefined,
  gainNode: undefined,
  volume: undefined
}

const demoCreateBtn = document.querySelector("#demoCreate");
const demoKickBtn = document.querySelector("#demoKick");
const demoPlayBtn = document.querySelector("#demoPlay");
const demoPauseBtn = document.querySelector("#demoPause");
const demoStopBtn = document.querySelector("#demoStop");
const demoMusicBtn = document.querySelector("#demoMusic");

const demoVolumeSldr = document.querySelector("#demoVolumeSldr");
let demoVolumeVal = document.querySelector("#demoVolumeVal");

demoCreateBtn.onclick = function () {
  // create web audio api context
  title.style.color = "#FF0000";
  this.style.backgroundColor = "#FF0000";
  console.log("clicked");

  AudioContext = window.AudioContext || window.webkitAudioContext;
  demoAudioCtx = new AudioContext();
  console.log("contexted");

  demoLoadSample("rain.wav", demoBuffer);

  demoBufferSource = demoAudioCtx.createBufferSource();
  // demoBufferSource.onended() = function() {
  //   console.log("ended");
  //   demoBufferSource[demoBufferSource.stop ? 'stop' : 'noteOff'](0);
  // }
  // demoBufferSource.buffer = demoBuffer;
  demoGainNode = demoAudioCtx.createGain();

  console.log("Created");

  // connect oscillator to gain node to speakers
  demoBufferSource.connect(demoGainNode);
  demoGainNode.connect(demoAudioCtx.destination);

  console.log("Connected");

  demoGainNode.gain.value = 0.5;
  demoChangeVolume(demoVolumeSldr, demoGainNode);

  console.log("Volumed");

  // report the state of the audio context to the
  // console, when it changes
  demoAudioCtx.onstatechange = function() {
    console.log(demoAudioCtx.state);
  }
}

function demoLoadSample(url, soundVar) {
  console.log("fetching: " + url);
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onloadend = function (event) {
    demoMusicBtn.innerHTML = "Complete";
  };
  request.onprogress = function (event) {
    if (event.lengthComputable) {
        var complete = (event.loaded / event.total * 100 | 0);
        //$('.meter').css('width', complete + '%');
        demoMusicBtn.innerHTML = complete + '%';
    }
    else{
      demoMusicBtn.innerHTML = "Not computable";
    }
  };

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    demoAudioCtx.decodeAudioData(request.response,
      // Function to call on success
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        demoBufferSource.buffer = buffer;
        console.log(buffer.type);
        demoBufferSource.loop = true;
        demoMusicBtn.innerHTML = "Ready";
        demoMusicBtn.removeAttribute('disabled');
        demoBufferSource[demoBufferSource.start ? 'start' : 'noteOn'](0);
        demoAudioCtx.suspend()
        demoCreateBtn.style.backgroundColor = "#00FF00";
      },
      // Function to call on error
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

function demoChangeVolume(sliderElem, gainNodeElem) {
  // Convert value to a percentage (0, 100)
  let fraction = parseInt(sliderElem.value) / parseInt(sliderElem.max);
  // Let's use an x*x curve (x-squared) since simple linear (x) does not sound as good.
  gainNodeElem.gain.value = fraction * fraction;
}

demoPlayBtn.onclick = function () {
  //TODO Check if not currently playing
  demoAudioCtx.resume();
  // demoBufferSource[demoBufferSource.start ? 'start' : 'noteOn'](0);
//   if(demoAudioCtx.state === 'running') {
//     demoAudioCtx.suspend().then(function() {
//     pauseBtn.textContent = 'Resume';
//   });
// } else if(demoAudioCtx.state === 'suspended') {
//   demoAudioCtx.resume().then(function() {
//     pauseBtn.textContent = 'Pause';
//   });
// }
}

demoPauseBtn.onclick = function () {
  demoAudioCtx.suspend();
}

demoStopBtn.onclick = function () {
  demoBufferSource[demoBufferSource.stop ? 'stop' : 'noteOff'](0);
}

demoKickBtn.onclick = function () {
  var audio = new Audio('1-second-of-silence.mp3');
  audio.play();
  demoMusicBtn.innerHTML = 'Kicked';
}

demoVolumeSldr.oninput = function() {
  SliderInput(this, demoVolumeVal, demoVolume);//, "writeValue.php", "/demo/volume.txt", "a+");
  demoChangeVolume(this, demoGainNode);
}

function SliderInput(sliderElem, valueElem, variable, phpFile, outFile, fileMode) {
  valueElem.innerHTML = sliderElem.value;
  variable = sliderElem.value;
  // if (typeof oscillator !== 'undefined') {
  //   oscillator.frequency.value = variable; //freq
  // }
  // WriteValue(sliderElem.value, phpFile, outFile, fileMode);
}


// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Filter Section
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

let filterAudioCtx;
let filterBufferSource;
let filterBuffer;
let filterGainNode;
let filterVolume;

// TODO: Use these variables instead
let filterObj = {
  audioCtx: undefined,
  bufferSource: undefined,
  buffer: undefined,
  gainNode: undefined,
  volume: undefined
}

let filterLowNode;
let filterHighNode;
let filterMidNode;

const filterCreateBtn = document.querySelector("#filterCreate");
const filterPlayBtn = document.querySelector("#filterPlay");
const filterPauseBtn = document.querySelector("#filterPause");
const filterStopBtn = document.querySelector("#filterStop");

const filterLowFreqSldr = document.querySelector("#filterLowFreqSldr");
let filterLowFreqVal = document.querySelector("#filterLowFreqVal");
const filterLowGainSldr = document.querySelector("#filterLowGainSldr");
let filterLowGainVal = document.querySelector("#filterLowGainVal");

const filterHighFreqSldr = document.querySelector("#filterHighFreqSldr");
let filterHighFreqVal = document.querySelector("#filterHighFreqVal");
const filterHighGainSldr = document.querySelector("#filterHighGainSldr");
let filterHighGainVal = document.querySelector("#filterHighGainVal");

const filterThreshFreqSldr = document.querySelector("#filterThreshFreqSldr");
let filterThreshFreqVal = document.querySelector("#filterThreshFreqVal");

const filterMidFreqSldr = document.querySelector("#filterMidFreqSldr");
let filterMidFreqVal = document.querySelector("#filterMidFreqVal");
const filterMidQSldr = document.querySelector("#filterMidQSldr");
let filterMidQVal = document.querySelector("#filterMidQVal");
const filterMidGainSldr = document.querySelector("#filterMidGainSldr");
let filterMidGainVal = document.querySelector("#filterMidGainVal");

const filterVolSldr = document.querySelector("#filterVolSldr");
let filterVolVal = document.querySelector("#filterVolVal");

filterCreateBtn.onclick = function () {
  // create web audio api context
  console.log("filter clicked");

  AudioContext = window.AudioContext || window.webkitAudioContext;
  filterAudioCtx = new AudioContext();
  console.log("filter contexted");
  filterCreateBtn.style.backgroundColor = "#FF0000"
  // filterLoadSample("songs/song_Good4U.mp3", filterBuffer);
  filterLoadSample("sounds/rain.wav", filterBuffer);

  filterBufferSource = filterAudioCtx.createBufferSource();

  // filterBufferSource.onended() = function() {
  //   console.log("filter ended");
  //   filterBufferSource[filterBufferSource.stop ? 'stop' : 'noteOff'](0);
  // }
  // filterBufferSource.buffer = filterBuffer;
  filterGainNode = filterAudioCtx.createGain();

  filterLowNode = filterAudioCtx.createBiquadFilter();
  filterLowNode.type = "lowshelf";
  filterHighNode = filterAudioCtx.createBiquadFilter();
  filterHighNode.type = "highshelf";
  filterMidNode = filterAudioCtx.createBiquadFilter();
  filterMidNode.type = "peaking";

  console.log("filter Created");

  // connect oscillator to gain node to speakers
  filterBufferSource.connect(filterLowNode);
  filterLowNode.connect(filterHighNode);
  // filterMidNode.connect(filterHighNode);
  filterHighNode.connect(filterGainNode);
  filterGainNode.connect(filterAudioCtx.destination);

  console.log("filter Connected");

  filterGainNode.gain.value = 0.5;
  filterChangeVolume(filterVolSldr, filterGainNode);

  console.log("filter Volumed");

  var audio = new Audio('1-second-of-silence.mp3');
  audio.play();
  console.log("filter kicked");

  // report the state of the audio context to the
  // console, when it changes
  filterAudioCtx.onstatechange = function() {
    console.log(filterAudioCtx.state);
  }
}

function filterLoadSample(url, soundVar) {
  console.log("filter fetching: " + url);
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    filterAudioCtx.decodeAudioData(request.response,
      // Function to call on success
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        filterBufferSource.buffer = buffer;
        filterBufferSource.loop = true;
        console.log(buffer.type);
        filterBufferSource[filterBufferSource.start ? 'start' : 'noteOn'](0);
        filterAudioCtx.suspend()
        filterCreateBtn.style.backgroundColor = "#00FF00";
      },
      // Function to call on error
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

function filterChangeVolume(sliderElem, gainNodeElem) {
  // Convert value to a percentage (0, 100)
  let fraction = parseInt(sliderElem.value) / parseInt(sliderElem.max);
  // Let's use an x*x curve (x-squared) since simple linear (x) does not sound as good.
  gainNodeElem.gain.value = fraction * fraction;
}

filterPlayBtn.onclick = function () {
  //TODO Check if not currently playing
  if(filterAudioCtx.state === 'running') {
    filterAudioCtx.suspend().then(function() {
      filterPlayBtn.textContent = 'Resume';
    });
  } else if(filterAudioCtx.state === 'suspended') {
    filterAudioCtx.resume().then(function() {
      filterPlayBtn.textContent = 'Pause';
    });
  }
}

filterPauseBtn.onclick = function () {
  filterAudioCtx.suspend();
}

filterStopBtn.onclick = function () {
  filterBufferSource[filterBufferSource.stop ? 'stop' : 'noteOff'](0);
}


filterVolSldr.oninput = function() {
  // SliderInput(this, filterVolVal, filterVolume);//, "writeValue.php", "/filter/volume.txt", "a+");
  filterVolVal.innerHTML = filterVolSldr.value;
  filterVolume = filterVolSldr.value;
  filterChangeVolume(this, filterGainNode);
}

function SliderInput(sliderElem, valueElem, variable, phpFile, outFile, fileMode) {
  valueElem.innerHTML = sliderElem.value;
  variable = sliderElem.value;
  // if (typeof oscillator !== 'undefined') {
  //   oscillator.frequency.value = variable; //freq
  // }
  // WriteValue(sliderElem.value, phpFile, outFile, fileMode);
}

function FilterSliderInput(sliderElem, valueElem) {
  valueElem.innerHTML = sliderElem.value;
  variable = sliderElem.value;
}

filterLowFreqSldr.oninput = function() {
  filterLowFreqVal.innerHTML = filterLowFreqSldr.value;
  filterLowNode.frequency.value = filterLowFreqSldr.value;
}
filterLowGainSldr.oninput = function() {
  filterLowGainVal.innerHTML = filterLowGainSldr.value;
  filterLowNode.gain.value = filterLowGainSldr.value;
}

filterHighFreqSldr.oninput = function() {
  filterHighFreqVal.innerHTML = filterHighFreqSldr.value;
  filterHighNode.frequency.value = filterHighFreqSldr.value;
}
filterHighGainSldr.oninput = function() {
  filterHighGainVal.innerHTML = filterHighGainSldr.value;
  filterHighNode.gain.value = filterHighGainSldr.value;
}

filterThreshFreqSldr.oninput = function() {
  filterThreshFreqVal.innerHTML = filterThreshFreqSldr.value;
  filterLowFreqSldr.max = filterThreshFreqSldr.value;
  // filterLowFreqSldr.value = Math.min(filterLowFreqSldr.value, filterLowFreqSldr.max);
  filterLowFreqSldr.value = filterThreshFreqSldr.value;
  filterLowFreqVal.innerHTML = filterLowFreqSldr.value;
  filterLowNode.frequency.value = filterLowFreqSldr.value;

  filterHighFreqSldr.min = filterThreshFreqSldr.value;
  // filterHighFreqSldr.value = Math.max(filterHighFreqSldr.value, filterHighFreqSldr.min);
  filterHighFreqSldr.value = filterThreshFreqSldr.value;
  filterHighFreqVal.innerHTML = filterHighFreqSldr.value;
  filterHighNode.frequency.value = filterHighFreqSldr.value;
}

filterMidFreqSldr.oninput = function() {
  filterMidFreqVal.innerHTML = filterMidFreqSldr.value;
  filterMidNode.frequency.value = filterMidFreqSldr.value;
}
filterMidQSldr.oninput = function() {
  filterMidQVal.innerHTML = filterMidQSldr.value;
  filterMidNode.Q.value = filterMidQSldr.value;
}
filterMidGainSldr.oninput = function() {
  filterMidGainVal.innerHTML = filterMidGainSldr.value;
  filterMidNode.gain.value = filterMidGainSldr.value;
}


// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Clips Section
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

let clipAudioCtx;
let clipBufferSourceArray = new Array();
let clipBuffer;
let clipGainNode;
let clipVolume;
let clipBufferList = new Array();
let clipBufferIndex = 0;
let clipBufferLoader;
let clipEnded = true;
let clipRate = 2;
let clipStopped = true;


// TODO: Use these variables instead
let clipObj = {
  audioCtx: undefined,
  bufferSource: undefined,
  buffer: undefined,
  gainNode: undefined,
  volume: undefined
}

let clipLowNode;
let clipHighNode;

const clipCreateBtn = document.querySelector("#clipCreate");
const clipBufferBtn = document.querySelector("#clipBuffer");
const clipToggleBtn = document.querySelector("#clipToggle");
const clipStartBtn = document.querySelector("#clipStart");
const clipStopBtn = document.querySelector("#clipStop");

const clipRateSldr = document.querySelector("#clipRateSldr");
let clipRateVal = document.querySelector("#clipRateVal");

const clipLowFreqSldr = document.querySelector("#clipLowFreqSldr");
let clipLowFreqVal = document.querySelector("#clipLowFreqVal");
const clipLowGainSldr = document.querySelector("#clipLowGainSldr");
let clipLowGainVal = document.querySelector("#clipLowGainVal");

const clipHighFreqSldr = document.querySelector("#clipHighFreqSldr");
let clipHighFreqVal = document.querySelector("#clipHighFreqVal");
const clipHighGainSldr = document.querySelector("#clipHighGainSldr");
let clipHighGainVal = document.querySelector("#clipHighGainVal");

const clipThreshFreqSldr = document.querySelector("#clipThreshFreqSldr");
let clipThreshFreqVal = document.querySelector("#clipThreshFreqVal");

const clipVolSldr = document.querySelector("#clipVolSldr");
let clipVolVal = document.querySelector("#clipVolVal");

function clipBuffersLoaded(listofBuffers) {
  console.log("clip buffers loaded");
  clipBufferList = listofBuffers;
  console.log(clipBufferList);
  // clipBufferCount = clipBufferList.length();
  clipCreateBtn.style.backgroundColor = "#00FF00";
}

clipCreateBtn.onclick = function () {
  // create web audio api context
  console.log("clip clicked");

  const dir = "clips";
  let listOfFiles = new Array();
  clipListFiles(dir, listOfFiles, "listFiles.php", clipLoadSounds);


  // console.log("clip loadsounds");
  // loadSounds(this, {
  //   buffer1: 'techno.wav',
  //   buffer2: 'song.mp3'
  // }, onLoaded);
  // function onLoaded() {
  //   var button = document.querySelector('#toggleButton');
  //   button.removeAttribute('disabled');
  //   button.innerHTML = 'Play/pause';
  // };


  AudioContext = window.AudioContext || window.webkitAudioContext;
  clipAudioCtx = new AudioContext();
  console.log("clip contexted");
  clipCreateBtn.style.backgroundColor = "#FF0000"
  // clipLoadSample("techno.wav", clipBuffer);

  // clipBufferSource = clipAudioCtx.createBufferSource();

  // clipBufferSource.onended() = function() {
  //   console.log("clip ended");
  //   clipBufferSource[clipBufferSource.stop ? 'stop' : 'noteOff'](0);
  // }
  // clipBufferSource.buffer = clipBuffer;
  clipGainNode = clipAudioCtx.createGain();

  clipLowNode = clipAudioCtx.createBiquadFilter();
  clipLowNode.type = "lowshelf";
  clipHighNode = clipAudioCtx.createBiquadFilter();
  clipHighNode.type = "highshelf";

  console.log("clip Created");

  // connect oscillator to gain node to speakers
  // clipBufferSource.connect(clipLowNode);
  clipLowNode.connect(clipHighNode);
  clipHighNode.connect(clipGainNode);
  clipGainNode.connect(clipAudioCtx.destination);

  console.log("clip Connected");

  clipGainNode.gain.value = 0.5;
  clipChangeVolume(clipVolSldr, clipGainNode);

  console.log("clip Volumed");

  var audio = new Audio('1-second-of-silence.mp3');
  audio.play();
  console.log("clip kicked");

  // report the state of the audio context to the
  // console, when it changes
  clipAudioCtx.onstatechange = function() {
    console.log(clipAudioCtx.state);
  }
}

function clipListFiles(directory, fileList, phpFile, callback) {
  $.ajax({
    type: 'POST',
    url: phpFile,
    data: {dir: directory},
    // key value pair created, 'dir' is the key, 'directory' is the value
    success: function(result) {
      // fileList = JSON.parse(result);
      fileList = result;
      console.log(fileList);
      console.log("ajax success");
      callback(fileList, clipBuffersLoaded);
    },
    dataType: "json"
  });
};

function clipLoadSounds(urlArray, callback) {
  console.log("loading sounds");
  clipBufferLoader = new BufferLoader(
    clipAudioCtx,
    urlArray,
    callback
  );

  clipBufferLoader.load();
};

// function clipLoadSample(url, soundVar) {
//   console.log("clip fetching: " + url);
//   var request = new XMLHttpRequest();
//   request.open("GET", url, true);
//   request.responseType = "arraybuffer";

//   request.onload = function() {
//     // Asynchronously decode the audio file data in request.response
//     clipAudioCtx.decodeAudioData(request.response,
//       // Function to call on success
//       function(buffer) {
//         if (!buffer) {
//           alert('error decoding file data: ' + url);
//           return;
//         }
//         clipBufferSource.buffer = buffer;
//         clipBufferSource.loop = true;
//         console.log(buffer.type);
//         clipBufferSource[clipBufferSource.start ? 'start' : 'noteOn'](0);
//         clipAudioCtx.suspend()
//         clipCreateBtn.style.backgroundColor = "#00FF00";
//       },
//       // Function to call on error
//       function(error) {
//         console.error('decodeAudioData error', error);
//       }
//     );
//   }

//   request.onerror = function() {
//     alert('BufferLoader: XHR error');
//   }

//   request.send();
// }

function clipChangeVolume(sliderElem, gainNodeElem) {
  // Convert value to a percentage (0, 100)
  let fraction = parseInt(sliderElem.value) / parseInt(sliderElem.max);
  // Let's use an x*x curve (x-squared) since simple linear (x) does not sound as good.
  gainNodeElem.gain.value = fraction * fraction;
}

function clipMakeBuffer() {
  clipBufferSourceArray[0] = clipAudioCtx.createBufferSource();
  console.log("making buffer: " + clipBufferIndex);
  clipBufferSourceArray[0].buffer = clipBufferList[clipBufferIndex];
  clipEnded = false;
  clipBufferSourceArray[0].connect(clipLowNode);
  let time = clipAudioCtx.currentTime;
  let clipDelay = clipRate;
  let delayTime = time + clipDelay;

  clipBufferSourceArray[0][clipBufferSourceArray[0].start ? 'start' : 'noteOn'](delayTime);
  console.log("Now :" + time);
  console.log("Play:" + time + "+" + clipDelay + "=" + delayTime);
  clipAudioCtx.suspend()
  clipBufferSourceArray[0].onended = function() {
    console.log("clip ended");
    clipAudioCtx.suspend()
    // clipBufferSource[clipBufferSource.stop ? 'stop' : 'noteOff'](0);
    clipEnded = true;
  }
  clipBufferIndex = (clipBufferIndex + 1) % clipBufferList.length;
}

function clipGetRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function clipGetRandom(min, max) {
  return Math.random() * (max - min) + min; //The maximum is inclusive and the minimum is inclusive
}

function clipMakeBufferRand() {
  let index = clipGetRandomIntInclusive(0,clipBufferList.length-1);
  clipAudioCtx.resume();
  clipBufferSourceArray[0] = clipAudioCtx.createBufferSource();

  clipBufferSourceArray[0].buffer = clipBufferList[index];
  clipBufferSourceArray[0].connect(clipLowNode);
  console.log(index + " Before: " + clipAudioCtx.currentTime);
  clipBufferSourceArray[0][clipBufferSourceArray[0].start ? 'start' : 'noteOn'](clipAudioCtx.currentTime);
  clipBufferSourceArray[0].onended = function() {
    console.log(index + " After: " + clipAudioCtx.currentTime);
  }
}

function clipMakeBufferRandLoop() {
  clipAudioCtx.resume();
  for (let iterations = 0; iterations < 100; iterations++) {
    let index = clipGetRandomIntInclusive(0,clipBufferList.length-1);
    let delay = clipGetRandomIntInclusive(0,clipBufferList.length-1);
    // let index = iterations;
    clipBufferSourceArray[iterations] = clipAudioCtx.createBufferSource();

    clipBufferSourceArray[iterations].buffer = clipBufferList[index];
    clipBufferSourceArray[iterations].connect(clipLowNode);
    clipBufferSourceArray[iterations][clipBufferSourceArray[iterations].start ? 'start' : 'noteOn'](clipAudioCtx.currentTime + delay);
  }
  // console.log(clipBufferSourceArray);
}

function clipMakeBufferLoop() {
  for (let index = 0; index < clipBufferList.length; index++) {
    clipBufferSourceArray[index] = clipAudioCtx.createBufferSource();

    clipBufferSourceArray[index].buffer = clipBufferList[index];
    clipBufferSourceArray[index].connect(clipLowNode);
    clipBufferSourceArray[index][clipBufferSourceArray[index].start ? 'start' : 'noteOn'](0);
  }
}


clipBufferBtn.onclick = function () {
  clipMakeBufferRandLoop();
}

clipToggleBtn.onclick = function () {
  //TODO Check if not currently playing
  if(clipEnded)
  {
    clipMakeBuffer();
  }
  if(clipAudioCtx.state === 'running') {
    clipAudioCtx.suspend().then(function() {
      clipToggleBtn.textContent = 'Resume';
    });
  } else if(clipAudioCtx.state === 'suspended') {
    clipAudioCtx.resume().then(function() {
      clipToggleBtn.textContent = 'Pause';
    });
  }
}

function clipStartSounds() {
  let soundIndex = clipGetRandomIntInclusive(0, clipBufferList.length - 1);
  // Create and connect the sound
  clipBufferSourceArray[0] = clipAudioCtx.createBufferSource();
  clipBufferSourceArray[0].buffer = clipBufferList[soundIndex];
  clipBufferSourceArray[0].connect(clipLowNode);
  let delay = clipGetRandom(clipRate/10, clipRate);
  clipBufferSourceArray[0][clipBufferSourceArray[0].start ? 'start' : 'noteOn'](clipAudioCtx.currentTime + delay);
  console.log("Delay: " + delay);
  // console.log("Now:" + clipAudioCtx.currentTime);
  // console.log("Play:" + (clipAudioCtx.currentTime + clipRate));
  clipBufferSourceArray[0].onended = function() {
    if (!clipStopped) {
      clipStartSounds();
    }
  }
}

clipStartBtn.onclick = function () {
  clipStopped = false;
  clipStartSounds();
  this.setAttribute('disabled','disabled');
}

clipStopBtn.onclick = function () {
  clipStopped = true;
  for (const sourceElement of clipBufferSourceArray) {
    sourceElement[sourceElement.stop ? 'stop' : 'noteOff'](0);
  }
  clipStartBtn.removeAttribute('disabled');
}

clipRateSldr.oninput = function() {
  clipRateVal.innerHTML = clipRateSldr.value;
  clipRate = clipRateSldr.value * 1;
}

clipVolSldr.oninput = function() {
  // clipSliderInput(this, clipVolVal, clipVolume);//, "writeValue.php", "/clip/volume.txt", "a+");
  clipVolVal.innerHTML = clipVolSldr.value;
  clipVolume = clipVolSldr.value;
  clipChangeVolume(this, clipGainNode);
}

function clipSliderInput(sliderElem, valueElem, variable, phpFile, outFile, fileMode) {
  valueElem.innerHTML = sliderElem.value;
  variable = sliderElem.value;
  // if (typeof oscillator !== 'undefined') {
  //   oscillator.frequency.value = variable; //freq
  // }
  // WriteValue(sliderElem.value, phpFile, outFile, fileMode);
}

function clipSliderInput(sliderElem, valueElem) {
  valueElem.innerHTML = sliderElem.value;
  variable = sliderElem.value;
}

clipLowFreqSldr.oninput = function() {
  clipLowFreqVal.innerHTML = clipLowFreqSldr.value;
  clipLowNode.frequency.value = clipLowFreqSldr.value;
}
clipLowGainSldr.oninput = function() {
  clipLowGainVal.innerHTML = clipLowGainSldr.value;
  clipLowNode.gain.value = clipLowGainSldr.value;
}

clipHighFreqSldr.oninput = function() {
  clipHighFreqVal.innerHTML = clipHighFreqSldr.value;
  clipHighNode.frequency.value = clipHighFreqSldr.value;
}
clipHighGainSldr.oninput = function() {
  clipHighGainVal.innerHTML = clipHighGainSldr.value;
  clipHighNode.gain.value = clipHighGainSldr.value;
}

clipThreshFreqSldr.oninput = function() {
  clipThreshFreqVal.innerHTML = clipThreshFreqSldr.value;
  clipLowFreqSldr.max = clipThreshFreqSldr.value;
  // clipLowFreqSldr.value = Math.min(clipLowFreqSldr.value, clipLowFreqSldr.max);
  clipLowFreqSldr.value = clipThreshFreqSldr.value;
  clipLowFreqVal.innerHTML = clipLowFreqSldr.value;
  clipLowNode.frequency.value = clipLowFreqSldr.value;

  clipHighFreqSldr.min = clipThreshFreqSldr.value;
  // clipHighFreqSldr.value = Math.max(clipHighFreqSldr.value, clipHighFreqSldr.min);
  clipHighFreqSldr.value = clipThreshFreqSldr.value;
  clipHighFreqVal.innerHTML = clipHighFreqSldr.value;
  clipHighNode.frequency.value = clipHighFreqSldr.value;

  //   // Clamp the frequency between the minimum value (40 Hz) and half of the
  // // sampling rate.
  // var minValue = 40;
  // var maxValue = context.sampleRate / 2;
  // // Logarithm (base 2) to compute how many octaves fall in the range.
  // var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  // // Compute a multiplier from 0 to 1 based on an exponential scale.
  // var multiplier = Math.pow(2, numberOfOctaves * (element.value - 1.0));
  // // Get back to the frequency value between min and max.
  // this.filter.frequency.value = maxValue * multiplier;
}
