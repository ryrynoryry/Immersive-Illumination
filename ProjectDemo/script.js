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
  highNode: undefined,
  volume: undefined
}

let mock_RainObj = {
  audioCtx: undefined,
  bufferSources: Array(),
  buffers: Array(),
  gainNode: undefined,
  lowNode: undefined,
  highNode: undefined,
  volume: undefined
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

let mockListOfSoundFiles = {array: new Array()};
let mockListOfClipFiles = {array: new Array()};

function mock_BuffersLoaded(listofBuffers) {
  console.log("mock buffers loaded");
  mock_BufferList = listofBuffers;
  console.log(mock_BufferList);
  // mock_BufferCount = mock_BufferList.length();
  mock_CreateBtn.style.backgroundColor = "#00FF00";
  mock_ToggleBtn.removeAttribute('disabled');
  mock_StopBtn.removeAttribute('disabled');
}

function mock_CreateList(urlArray) {
  var innerList = document.getElementById("mockInnerList");
  if (innerList == null) {
    innerList = document.createElement('ol');
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
    mock_ClipList.appendChild(innerList);
  }
}

function mock_ShowProgress(event, urlArray, index) {
  if (event.lengthComputable) {
    var complete = (event.loaded / event.total * 100 | 0);
    document.getElementById(urlArray[index]).lastChild.nodeValue = " - " + complete + '% (' + event.loaded + '/' + event.total + "KB)";
  }
  else {
    document.getElementById(urlArray[index]).lastChild.nodeValue = "?";
  }
}

function mock_FirstBufferLoaded(myBuffer) {
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

  // mock_BufferSource.onended() = function() {
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
  obj.highNode = obj.audioCtx.createBiquadFilter();
  obj.highNode.type = "highshelf";

  obj.lowNode.connect(obj.highNode);
  obj.highNode.connect(obj.gainNode);
  obj.gainNode.connect(obj.audioCtx.destination);

  mock_GainNode.gain.value = 0.5;
}


mock_CreateBtn.onclick = function () {
  // create web audio api context
  console.log("mock clicked");

  const dir = "clips";
  mock_ListFiles(dir, mockListOfClipFiles, "listFiles.php", mock_LoadSounds);

  mock_InitializeContext(mock_ClipObj);

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

  console.log("mock contexted");
  mock_CreateBtn.style.backgroundColor = "#FF0000"
  // mock_LoadSample("techno.wav", mock_Buffer);

  // mock_BufferSource = mock_AudioCtx.createBufferSource();

  // mock_BufferSource.onended() = function() {
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

function mock_ListFiles(directory, fileList, phpFile, callbackFunc) {
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
      callbackFunc(fileList, mock_BuffersLoaded, mock_FirstBufferLoaded, mock_ShowProgress);
    },
    error: function(xhr){
      alert("mock An error occured POSTing '" + phpFile + "': " + xhr.status + " " + xhr.statusText);
    },
    dataType: "json"
  });
};

function mock_LoadSounds(urlArray, loadFunc, firstLoadFunc, progressFunc) {
  console.log("mock loading sounds");
  console.log(mockListOfClipFiles);

  mock_BufferLoader = new BufferLoader(
    mock_AudioCtx,
    urlArray.array,
    loadFunc,
    firstLoadFunc,
    progressFunc
  );

  mock_BufferLoader.load(mock_CreateList);
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

function mock_MakeBuffer() {
  mock_BufferSourceArray[0] = mock_AudioCtx.createBufferSource();
  console.log("making buffer: " + mock_BufferIndex);
  mock_BufferSourceArray[0].buffer = mock_BufferList[mock_BufferIndex];
  mock_Ended = false;
  mock_BufferSourceArray[0].connect(mock_LowNode);
  let time = mock_AudioCtx.currentTime;
  let mock_Delay = mock_Rate;
  let delayTime = time + mock_Delay;

  mock_BufferSourceArray[0][mock_BufferSourceArray[0].start ? 'start' : 'noteOn'](delayTime);
  console.log("Now :" + time);
  console.log("Play:" + time + "+" + mock_Delay + "=" + delayTime);
  mock_AudioCtx.suspend()
  mock_BufferSourceArray[0].onended = function() {
    console.log("mock ended");
    mock_AudioCtx.suspend()
    // mock_BufferSource[mock_BufferSource.stop ? 'stop' : 'noteOff'](0);
    mock_Ended = true;
  }
  mock_BufferIndex = (mock_BufferIndex + 1) % mock_BufferList.length;
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
    mock_MakeBuffer();
  }
  if(mock_AudioCtx.state === 'running') {
    mock_AudioCtx.suspend().then(function() {
      mock_ToggleBtn.textContent = 'Resume';
    });
  } else if(mock_AudioCtx.state === 'suspended') {
    mock_AudioCtx.resume().then(function() {
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
  mock_Volume = mock_VolSldr.value;
  mock_ChangeVolume(this, mock_GainNode);
}

function mock_SliderInput(sliderElem, valueElem, variable, phpFile, outFile, fileMode) {
  valueElem.innerHTML = sliderElem.value;
  variable = sliderElem.value;
  // if (typeof oscillator !== 'undefined') {
  //   oscillator.frequency.value = variable; //freq
  // }
  // WriteValue(sliderElem.value, phpFile, outFile, fileMode);
}

function mock_SliderInput(sliderElem, valueElem) {
  valueElem.innerHTML = sliderElem.value;
  variable = sliderElem.value;
}

// mock_LowFreqSldr.oninput = function() {
//   mock_LowFreqVal.innerHTML = mock_LowFreqSldr.value;
//   mock_LowNode.frequency.value = mock_LowFreqSldr.value;
// }
mock_LowGainSldr.oninput = function() {
  mock_LowGainVal.innerHTML = mock_LowGainSldr.value;
  mock_LowNode.gain.value = mock_LowGainSldr.value;
}

// mock_HighFreqSldr.oninput = function() {
//   mock_HighFreqVal.innerHTML = mock_HighFreqSldr.value;
//   mock_HighNode.frequency.value = mock_HighFreqSldr.value;
// }
mock_HighGainSldr.oninput = function() {
  mock_HighGainVal.innerHTML = mock_HighGainSldr.value;
  mock_HighNode.gain.value = mock_HighGainSldr.value;
}

mock_ThreshFreqSldr.oninput = function() {
  mock_ThreshFreqVal.innerHTML = mock_ThreshFreqSldr.value;
  mock_LowNode.frequency.value = mock_ThreshFreqSldr.value;
  mock_HighNode.frequency.value = mock_ThreshFreqSldr.value;
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
