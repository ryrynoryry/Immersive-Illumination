// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Mock Section
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

let mock_AudioCtx;
let mock_BufferSourceArray = new Array();
let mock_Buffer;
let mock_GainNode;
let mock_Volume;
let mock_BufferList = new Array();
let mock_BufferIndex = 0;
let mock_BufferLoader;
let mock_Ended = true;
let mock_Rate = 2;
let mock_Stopped = true;


// TODO: Use these variables instead
let mock_ClipObj = {
  audioCtx: undefined,
  bufferSources: Array(),
  buffers: Array(),
  gainNode: undefined,
  lowNode: undefined,
  midNode: undefined,
  highNode: undefined,
  volume: undefined,
  isPlaying: false,
  statusLabel: undefined
}

let mock_RainObj = {
  audioCtx: undefined,
  bufferSources: Array(),
  buffers: Array(),
  gainNode: undefined,
  lowNode: undefined,
  midNode: undefined,
  highNode: undefined,
  volume: undefined,
  isPlaying: false,
  statusLabel: undefined
}

let mock_LowNode;
let mock_HighNode;

const mock_CreateBtn = document.querySelector("#mockCreate");
const mock_LoadBtn = document.querySelector("#mockLoad");
const mock_ToggleBtn = document.querySelector("#mockToggle");
const mock_StopBtn = document.querySelector("#mockStop");

const mock_RateSldr = document.querySelector("#mockRateSldr");
let mock_RateVal = document.querySelector("#mockRateVal");

const mock_LowFreqSldr = document.querySelector("#mockLowFreqSldr");
let mock_LowFreqVal = document.querySelector("#mockLowFreqVal");
const mock_LowGainSldr = document.querySelector("#mockLowGainSldr");
let mock_LowGainVal = document.querySelector("#mockLowGainVal");

const mock_HighFreqSldr = document.querySelector("#mockHighFreqSldr");
let mock_HighFreqVal = document.querySelector("#mockHighFreqVal");
const mock_HighGainSldr = document.querySelector("#mockHighGainSldr");
let mock_HighGainVal = document.querySelector("#mockHighGainVal");

const mock_ThreshFreqSldr = document.querySelector("#mockThreshFreqSldr");
let mock_ThreshFreqVal = document.querySelector("#mockThreshFreqVal");

const mock_VolSldr = document.querySelector("#mockVolSldr");
let mock_VolVal = document.querySelector("#mockVolVal");

let mock_SoundList = document.querySelector("#mockSoundList");
let mock_ClipList = document.querySelector("#mockClipList");

let mock_ClipsHidden = document.querySelector("#mockClipsHidden");
let mock_ClipsAdvanced = document.querySelector("#mockClipsAdvanced");

let mockListOfSoundFiles = {array: new Array()};
let mockListOfClipFiles = {array: new Array()};

const mockRainTimeDisplay = {
  label: document.querySelector('#mockTimeLabel'),
  obj: mock_RainObj
}

const mockClipsTimeDisplay = {
  label: document.querySelector('#mockClipsTimeLabel'),
  obj: mock_ClipObj
}

function mockDisplayTime(timeDisplay) {
  if(timeDisplay.obj.audioCtx && timeDisplay.obj.audioCtx.state !== 'closed') {
    timeDisplay.label.textContent = 'Current context time: ' + timeDisplay.obj.audioCtx.currentTime.toFixed(3);
  } else {
    timeDisplay.label.textContent = 'Current context time: No context exists.'
  }
  requestAnimationFrame(function() {
    mockDisplayTime(timeDisplay);
  });
}

function mock_BuffersLoaded(listofBuffers, obj) {
  console.log("mock buffers loaded");
  // mock_BufferList = listofBuffers;
  // console.log(listofBuffers);
  // console.log(mock_RainObj.buffers);
  // mock_BufferCount = mock_BufferList.length();
  // mock_ToggleBtn.removeAttribute('disabled');
  // mock_StopBtn.removeAttribute('disabled');
  obj.statusLabel.textContent = "Play";
}

function mock_CreateList(urlArray, listElement) {
    var innerList = document.createElement('ol');
    innerList.setAttribute("id", "mockInnerList");

    for (let i = 0; i < urlArray.length; i++) {
      var listItem = document.createElement('li');
      listItem.setAttribute("id", urlArray[i])

      var listItemName = document.createTextNode(urlArray[i]);
      var listItemPercent = document.createTextNode("-");

      listItem.appendChild(listItemName);
      listItem.appendChild(listItemPercent);
      innerList.appendChild(listItem);
    }
    listElement.list.appendChild(innerList);
}

function mock_ShowProgress(event, urlArray, index) {
  if (event.lengthComputable) {
    var complete = (event.loaded / event.total * 100 | 0);
    document.getElementById(urlArray[index]).lastChild.nodeValue = " - " + complete + '% (' + event.loaded / 1000 + '/' + event.total / 1000 + "KB)";
  }
  else {
    document.getElementById(urlArray[index]).lastChild.nodeValue = "?";
  }
}

function mock_FirstBufferLoaded(myBuffer, obj) {
  console.log("mock first buffer loaded: " + myBuffer);
}

mock_LoadBtn.onclick = function () {
  // create web audio api context
  console.log("mock load clicked");

  const dir = "sounds";
  mock_ListFiles(dir, mockListOfSoundFiles, "listFiles.php", mock_LoadSounds);


  // console.log("mock loadsounds");
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
  mock_AudioCtx = new AudioContext();
  console.log("mock contexted");
  mock_CreateBtn.style.backgroundColor = "#FF0000"
  // mock_LoadSample("techno.wav", mock_Buffer);

  // mock_BufferSource = mock_AudioCtx.createBufferSource();

  // mock_BufferSource.onended = function() {
  //   console.log("mock ended");
  //   mock_BufferSource[mock_BufferSource.stop ? 'stop' : 'noteOff'](0);
  // }
  // mock_BufferSource.buffer = mock_Buffer;
  mock_GainNode = mock_AudioCtx.createGain();

  mock_LowNode = mock_AudioCtx.createBiquadFilter();
  mock_LowNode.type = "lowshelf";
  mock_HighNode = mock_AudioCtx.createBiquadFilter();
  mock_HighNode.type = "highshelf";

  console.log("mock Created");

  // connect oscillator to gain node to speakers
  // mock_BufferSource.connect(mock_LowNode);
  mock_LowNode.connect(mock_HighNode);
  mock_HighNode.connect(mock_GainNode);
  mock_GainNode.connect(mock_AudioCtx.destination);

  console.log("mock Connected");

  mock_GainNode.gain.value = 0.5;
  mock_ChangeVolume(mock_VolSldr, mock_GainNode);

  console.log("mock Volumed");

  var audio = new Audio('1-second-of-silence.mp3');
  audio.play();
  console.log("mock kicked");

  // report the state of the audio context to the
  // console, when it changes
  mock_AudioCtx.onstatechange = function() {
    console.log(mock_AudioCtx.state);
  }
}

// let mock_ClipObj = {
//   audioCtx: undefined,
//   bufferSources: Array(),
//   buffers: Array(),
//   gainNode: undefined,
//   lowNode: undefined,
//   highNode: undefined,
//   volume: undefined
// }
function mock_InitializeContext(obj) {
  AudioContext = window.AudioContext || window.webkitAudioContext;
  obj.audioCtx = new AudioContext();
  obj.gainNode = obj.audioCtx.createGain();

  obj.lowNode = obj.audioCtx.createBiquadFilter();
  obj.lowNode.type = "lowshelf";
  obj.midNode = obj.audioCtx.createBiquadFilter();
  obj.midNode.type = "peaking";
  obj.highNode = obj.audioCtx.createBiquadFilter();
  obj.highNode.type = "highshelf";

  obj.lowNode.connect(obj.midNode);
  obj.midNode.connect(obj.highNode);
  obj.highNode.connect(obj.gainNode);
  obj.gainNode.connect(obj.audioCtx.destination);

  obj.gainNode.gain.value = 0.5;

  var audio = new Audio('1-second-of-silence.mp3');
  audio.play();

  obj.audioCtx.onstatechange = function() {
    console.log(obj.audioCtx.state);
  }
}


mock_CreateBtn.onclick = function () {
  // create web audio api context
  console.log("mock clicked");

  const dir = "sounds";
  mock_ListFiles(dir, mockListOfSoundFiles, "listFiles.php", mock_LoadSounds, mock_RainObj);
  mockDisplayTime(mockRainTimeDisplay);
  mock_InitializeContext(mock_RainObj);

  mock_RainObj.statusLabel = mock_CreateBtn;
}

function mock_ListFiles(directory, fileList, phpFile, callbackFunc, obj) {
  $.ajax({
    type: 'POST',
    url: phpFile,
    data: {dir: directory},
    // key value pair created, 'dir' is the key, 'directory' is the value
    success: function(result) {
      if (result == null) {
        alert("No files found in directory: '" + directory + "'");
      }
      fileList.array = result;
      console.log("mock ajax success");
      callbackFunc(fileList, obj, mock_BuffersLoaded, mock_FirstBufferLoaded, mock_ShowProgress);
    },
    error: function(xhr){
      alert("mock An error occured POSTing '" + phpFile + "': " + xhr.status + " " + xhr.statusText);
    },
    dataType: "json"
  });
};

function mock_LoadSounds(urlArray, obj, loadFunc, firstLoadFunc, progressFunc) {
  console.log("mock loading sounds");

  mock_BufferLoader = new BufferLoader(
    obj,
    urlArray.array,
    loadFunc,
    firstLoadFunc,
    progressFunc
  );

  var listElement = {
    list: mock_SoundList
  }
  if (obj === mock_ClipObj) {
    listElement.list = mock_ClipList;
  }


  mock_BufferLoader.load(mock_CreateList, listElement);
};

// function mock_LoadSample(url, soundVar) {
//   console.log("mock fetching: " + url);
//   var request = new XMLHttpRequest();
//   request.open("GET", url, true);
//   request.responseType = "arraybuffer";

//   request.onload = function() {
//     // Asynchronously decode the audio file data in request.response
//     mock_AudioCtx.decodeAudioData(request.response,
//       // Function to call on success
//       function(buffer) {
//         if (!buffer) {
//           alert('error decoding file data: ' + url);
//           return;
//         }
//         mock_BufferSource.buffer = buffer;
//         mock_BufferSource.loop = true;
//         console.log(buffer.type);
//         mock_BufferSource[mock_BufferSource.start ? 'start' : 'noteOn'](0);
//         mock_AudioCtx.suspend()
//         mock_CreateBtn.style.backgroundColor = "#00FF00";
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

function mock_ChangeVolume(sliderElem, gainNodeElem) {
  // Convert value to a percentage (0, 100)
  let fraction = parseInt(sliderElem.value) / parseInt(sliderElem.max);
  // Let's use an x*x curve (x-squared) since simple linear (x) does not sound as good.
  gainNodeElem.gain.value = fraction * fraction;
}

function mock_MakeBuffer(obj) {
  obj.bufferSources[0] = obj.audioCtx.createBufferSource();
  console.log("making buffer: " + mock_BufferIndex);
  obj.bufferSources[0].buffer = obj.buffers[mock_BufferIndex];
  mock_Ended = false;
  obj.bufferSources[0].connect(obj.lowNode);
  let time = obj.audioCtx.currentTime;
  let mock_Delay = mock_Rate;
  let delayTime = time + mock_Delay;

  obj.bufferSources[0][obj.bufferSources[0].start ? 'start' : 'noteOn'](delayTime);
  console.log("Now :" + time);
  console.log("Play:" + time + "+" + mock_Delay + "=" + delayTime);
  obj.audioCtx.suspend()
  obj.bufferSources[0].onended = function() {
    console.log("mock ended");
    obj.audioCtx.suspend()
    // mock_BufferSource[mock_BufferSource.stop ? 'stop' : 'noteOff'](0);
    mock_Ended = true;
  }
  mock_BufferIndex = (mock_BufferIndex + 1) % obj.buffers.length;
}

function mock_GetRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function mock_GetRandom(min, max) {
  return Math.random() * (max - min) + min; //The maximum is inclusive and the minimum is inclusive
}

function mock_MakeBufferRand() {
  let index = mock_GetRandomIntInclusive(0,mock_BufferList.length-1);
  mock_AudioCtx.resume();
  mock_BufferSourceArray[0] = mock_AudioCtx.createBufferSource();

  mock_BufferSourceArray[0].buffer = mock_BufferList[index];
  mock_BufferSourceArray[0].connect(mock_LowNode);
  console.log(index + " Before: " + mock_AudioCtx.currentTime);
  mock_BufferSourceArray[0][mock_BufferSourceArray[0].start ? 'start' : 'noteOn'](mock_AudioCtx.currentTime);
  mock_BufferSourceArray[0].onended = function() {
    console.log(index + " After: " + mock_AudioCtx.currentTime);
  }
}

function mock_MakeBufferRandLoop() {
  mock_AudioCtx.resume();
  for (let iterations = 0; iterations < 100; iterations++) {
    let index = mock_GetRandomIntInclusive(0,mock_BufferList.length-1);
    let delay = mock_GetRandomIntInclusive(0,mock_BufferList.length-1);
    // let index = iterations;
    mock_BufferSourceArray[iterations] = mock_AudioCtx.createBufferSource();

    mock_BufferSourceArray[iterations].buffer = mock_BufferList[index];
    mock_BufferSourceArray[iterations].connect(mock_LowNode);
    mock_BufferSourceArray[iterations][mock_BufferSourceArray[iterations].start ? 'start' : 'noteOn'](mock_AudioCtx.currentTime + delay);
  }
  // console.log(mock_BufferSourceArray);
}

function mock_MakeBufferLoop() {
  for (let index = 0; index < mock_BufferList.length; index++) {
    mock_BufferSourceArray[index] = mock_AudioCtx.createBufferSource();

    mock_BufferSourceArray[index].buffer = mock_BufferList[index];
    mock_BufferSourceArray[index].connect(mock_LowNode);
    mock_BufferSourceArray[index][mock_BufferSourceArray[index].start ? 'start' : 'noteOn'](0);
  }
}


// mock_BufferBtn.onclick = function () {
//   MakeBufferRandLoop();
// }

mock_ToggleBtn.onclick = function () {
  //TODO Check if not currently playing
  if(mock_Ended)
  {
    mock_MakeBuffer(mock_RainObj);
  }
  if(mock_RainObj.audioCtx.state === 'running') {
    mock_RainObj.audioCtx.suspend().then(function() {
      mock_ToggleBtn.textContent = 'Resume';
    });
  } else if(mock_RainObj.audioCtx.state === 'suspended') {
    mock_RainObj.audioCtx.resume().then(function() {
      mock_ToggleBtn.textContent = 'Pause';
    });
  }
}

function mock_StartSounds() {
  let soundIndex = mock_GetRandomIntInclusive(0, mock_BufferList.length - 1);
  // Create and connect the sound
  mock_BufferSourceArray[0] = mock_AudioCtx.createBufferSource();
  mock_BufferSourceArray[0].buffer = mock_BufferList[soundIndex];
  mock_BufferSourceArray[0].connect(mock_LowNode);
  let delay = mock_GetRandom(mock_Rate/10, mock_Rate);
  mock_BufferSourceArray[0][mock_BufferSourceArray[0].start ? 'start' : 'noteOn'](mock_AudioCtx.currentTime + delay);
  console.log("Delay: " + delay);
  // console.log("Now:" + mock_AudioCtx.currentTime);
  // console.log("Play:" + (mock_AudioCtx.currentTime + mock_Rate));
  mock_BufferSourceArray[0].onended = function() {
    if (!mock_Stopped) {
      mock_StartSounds();
    }
  }
}

// mock_StartBtn.onclick = function () {
//   mock_Stopped = false;
//   StartSounds();
//   this.setAttribute('disabled','disabled');
// }

mock_StopBtn.onclick = function () {
  mock_Stopped = true;
  for (const sourceElement of mock_BufferSourceArray) {
    sourceElement[sourceElement.stop ? 'stop' : 'noteOff'](0);
  }
  mock_StartBtn.removeAttribute('disabled');
}

// mock_RateSldr.oninput = function() {
//   mock_RateVal.innerHTML = mock_RateSldr.value;
//   mock_Rate = mock_RateSldr.value * 1;
// }

mock_VolSldr.oninput = function() {
  // SliderInput(this, mock_VolVal, mock_Volume);//, "writeValue.php", "/mock/volume.txt", "a+");
  mock_VolVal.innerHTML = mock_VolSldr.value;
  mock_RainObj.volume = mock_VolSldr.value;
  mock_ChangeVolume(this, mock_RainObj.gainNode);
}

// function mock_SliderInput(sliderElem, valueElem, variable, phpFile, outFile, fileMode) {
//   valueElem.innerHTML = sliderElem.value;
//   variable = sliderElem.value;
//   // if (typeof oscillator !== 'undefined') {
//   //   oscillator.frequency.value = variable; //freq
//   // }
//   // WriteValue(sliderElem.value, phpFile, outFile, fileMode);
// }

function mock_SliderInput(sliderElem, valueElem, gainNode) {
  valueElem.innerHTML = sliderElem.value;
  gainNode.gain.value = sliderElem.value;
}


mock_LowGainSldr.oninput = function() {
  mock_SliderInput(this, mock_LowGainVal, mock_RainObj.lowNode)
  // mock_LowGainVal.innerHTML = mock_LowGainSldr.value;
  // mock_RainObj.lowNode.gain.value = mock_LowGainSldr.value;
}

mock_HighGainSldr.oninput = function() {
  mock_SliderInput(this, mock_HighGainVal, mock_RainObj.highNode)
  // mock_HighGainVal.innerHTML = mock_HighGainSldr.value;
  // mock_RainObj.highNode.gain.value = mock_HighGainSldr.value;
}

mock_ThreshFreqSldr.oninput = function() {
  mock_ThreshFreqVal.innerHTML = mock_ThreshFreqSldr.value;
  mock_RainObj.lowNode.frequency.value = mock_ThreshFreqSldr.value;
  mock_RainObj.highNode.frequency.value = mock_ThreshFreqSldr.value;
}

const mock_ScriptRainBtn = document.querySelector("#mockScriptRAIN");
const mock_ScriptStopBtn = document.querySelector("#mockScriptSTOP");
const mock_ScriptLabelBtn = document.querySelector("#mockScriptLabel");

function mockWriteValue(text, phpFile, fileName, mode) {
  $.ajax({
    type: 'POST',
    url: phpFile,
    data: {value: text, fileName: fileName, fileMode: mode},
    // key value pair created, 'something' is the key, 'foo' is the value
    success: function(result) {
      console.log( '"' + text + '" was successfully sent to the server:' + result);
      mock_ScriptLabelBtn.innerHTML = text;
      mock_ScriptLabelBtn.style.backgroundColor = "#0000FF";
    }
  });
};

mock_ScriptRainBtn.onclick = function () {
  this.innerHTML = "RAIN1";
  mock_ScriptLabelBtn.style.backgroundColor = "#00FF00";
  WriteValue("test rain", "writeValue.php", "rain", "w+");
}

mock_ScriptStopBtn.onclick = function () {
  this.innerHTML = "STOP1";
  mock_ScriptLabelBtn.style.backgroundColor = "#FF0000";
  WriteValue("test stop", "writeValue.php", "stop", "w+");
}

console.log(mock_ClipsHidden.querySelector(".freq"));

const mock_ClipsHiddenFreqSldr = mock_ClipsHidden.querySelector(".freq").querySelector(".slider");

mock_ClipsHiddenFreqSldr.oninput = function() {
  mock_ClipsHidden.querySelector(".freq").querySelector(".val").innerHTML = this.value;
}

const mock_ClipsHiddenToggleBtn = mock_ClipsHidden.querySelector(".toggle");

// let mock_ClipObj = {
//   audioCtx: undefined,
//   bufferSources: Array(),
//   buffers: Array(),
//   gainNode: undefined,
//   lowNode: undefined,
//   highNode: undefined,
//   volume: undefined
// }
function CheckIfContextExists(obj) {
  return obj.audioCtx != undefined;
}

function PlayClip(obj) {
  console.log(obj.bufferSources);
  if (obj.bufferSources.length == 0) {
    ScheduleClip(obj);
    ScheduleClip(obj, 5);
  }
}

function ScheduleClip(obj, delay = 0) {
  let soundSource = obj.audioCtx.createBufferSource();
  soundSource.buffer = obj.buffers[mock_GetRandomIntInclusive(0,obj.buffers.length-1)];
  soundSource.connect(obj.lowNode);
  soundSource.onended = function() {
    let thisIndex = obj.bufferSources.indexOf(this);
    if (thisIndex != -1) {
      obj.bufferSources.splice(thisIndex, 1);
    }
    ScheduleClip(obj);
  }
  let time = obj.audioCtx.currentTime + mock_GetRandomIntInclusive(0,mock_ClipsHiddenFreqSldr.value * 1) + delay;
  soundSource[soundSource.start ? 'start' : 'noteOn'](time);

  console.log((obj.bufferSources.length + 1) +" Scheduled a sound to play at: " + time);

  obj.bufferSources.push(soundSource);
}

mock_ClipsHiddenToggleBtn.onclick = function () {
  if (CheckIfContextExists(mock_ClipObj) == false) {
    console.log("Initializing context");
    mockDisplayTime(mockClipsTimeDisplay);
    mock_InitializeContext(mock_ClipObj);
    mock_ClipObj.lowNode.frequency = 440;
    mock_ClipObj.midNode.frequency = 1000;
    mock_ClipObj.midNode.Q = 1;
    mock_ClipObj.highNode.frequency = 6000;
    mock_ClipObj.isPlaying = false;
    mock_ClipObj.statusLabel = mock_ClipsHiddenToggleBtn;
    mock_ClipObj.audioCtx.suspend();
  }
  if (mock_ClipObj.buffers.length == 0) {
    console.log("Gathering clip files");
    const dir = "clips";
    mock_ListFiles(dir, mockListOfClipFiles, "listFiles.php", mock_LoadSounds, mock_ClipObj);
  }
  else {
    if (!mock_ClipObj.isPlaying) {
      // mock_ClipObj.bufferSources[0] = mock_ClipObj.audioCtx.createBufferSource();
      // mock_ClipObj.bufferSources[0].buffer = mock_ClipObj.buffers[mock_BufferIndex];
      // mock_ClipObj.bufferSources[0].connect(mock_ClipObj.lowNode);
      // mock_ClipObj.bufferSources[0][mock_ClipObj.bufferSources[0].start ? 'start' : 'noteOn'](0);
      PlayClip(mock_ClipObj);
      mock_ClipObj.audioCtx.resume().then(function() {
        this.textContent = 'Pause';
      }.bind(this));
      mock_ClipObj.isPlaying = true;
    // } else if(mock_ClipObj.audioCtx.state === 'running') {
    } else if(mock_ClipObj.isPlaying) {
  
      // !!!!!!!!!!!!!!!!!Find out how to tell if a buffersource has ended!!!!!!!!!!!!!!
      mock_ClipObj.bufferSources.forEach(function(e) {
        e.onended = null;
        e.stop();
      });
      mock_ClipObj.bufferSources.length = 0;
      mock_ClipObj.audioCtx.suspend().then(function() {
        this.textContent = 'Resume';
      }.bind(this));
      mock_ClipObj.isPlaying = false;
    }
  }
}


const mock_AdvancedLow = mock_ClipsAdvanced.querySelector(".low");
const mock_AdvancedMid = mock_ClipsAdvanced.querySelector(".mid");
const mock_AdvancedHigh = mock_ClipsAdvanced.querySelector(".high");
const mock_AdvancedGain = mock_ClipsAdvanced.querySelector(".gain");
mock_AdvancedLow.querySelector(".slider").oninput = function() {
  // mock_AdvancedLow.querySelector(".val").innerHTML = this.value;
  mock_SliderInput(this, mock_AdvancedLow.querySelector(".val"), mock_ClipObj.lowNode)
}

mock_AdvancedMid.querySelector(".slider").oninput = function() {
  // mock_AdvancedHigh.querySelector(".val").innerHTML = this.value;
  mock_SliderInput(this, mock_AdvancedMid.querySelector(".val"), mock_ClipObj.midNode)
}
mock_AdvancedHigh.querySelector(".slider").oninput = function() {
  // mock_AdvancedHigh.querySelector(".val").innerHTML = this.value;
  mock_SliderInput(this, mock_AdvancedHigh.querySelector(".val"), mock_ClipObj.highNode)
}

// mock_AdvancedThresh.querySelector(".slider").oninput = function() {
//   mock_AdvancedThresh.querySelector(".val").innerHTML = this.value;
// }

mock_AdvancedGain.querySelector(".slider").oninput = function() {
  mock_AdvancedGain.querySelector(".val").innerHTML = this.value;
  mock_ChangeVolume(this, mock_ClipObj.gainNode);
}
