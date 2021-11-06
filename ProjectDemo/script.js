// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Mock Section
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

let mock_BufferIndex = 0;
let mock_BufferLoader;
let mock_Ended = true;
let mock_Stopped = true;


// TODO: Use these variables instead
let mock_ClipObj = {
  audioCtx: undefined,
  buffers: Array(),
  gainNode1: undefined,
  gainNode2: undefined,
  lowNode: undefined,
  midNode: undefined,
  highNode: undefined,
  volume: undefined,
  isPlaying: false,
  statusLabel: undefined,
  prefix: "Clip",
  sounds: Array()
}

let mock_RainObj = {
  audioCtx: undefined,
  // bufferSources: Array(), // WebAudio instances scheduled to play or playing
  buffers: Array(), // Array of sound data from the files
  gainNode1: undefined, // WebAudio object for this context's gain (volume)
  gainNode2: undefined, // WebAudio object for this context's gain (volume)
  lowNode: undefined, // WebAudio object for this context's low filter
  midNode: undefined, // WebAudio object for this context's mid filter
  highNode: undefined, // WebAudio object for this context's high filter
  volume: undefined,
  isPlaying: false, // Bool to indicate if sound is currently being produced
  statusLabel: undefined, // Text object to show Play/Pause
  prefix: "Rain",
  sounds: Array()
}

let Sound = {
  parentObj: undefined,
  duration: undefined,
  fadeInStart: undefined,
  fadeInEnd: undefined,
  fadeOutStart: undefined,
  fadeOutEnd: undefined,
  buffersIndex: undefined,
  bufferSource: undefined,
  gainNode: undefined,
  isPlaying: false,
}

const mock_CreateBtn = document.querySelector("#mockCreate");
const mock_LoadBtn = document.querySelector("#mockLoad");
const mock_ToggleBtn = document.querySelector("#mockToggle");
const mock_StopBtn = document.querySelector("#mockStop");
const mock_LinBtn = document.querySelector("#mockLin");
const mock_ExpBtn = document.querySelector("#mockExp");

let mock_SoundList = document.querySelector("#mockSoundList");
let mock_ClipList = document.querySelector("#mockClipList");

let mock_ClipsHidden = document.querySelector("#mockClipsHidden");
let mock_ClipsAdvanced = document.querySelector("#mockClipsAdvanced");
let mock_MainSliders = document.querySelector("#mockMainSliders");

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

function mock_InitializeContext(obj) {
  AudioContext = window.AudioContext || window.webkitAudioContext;
  obj.audioCtx = new AudioContext();
  obj.gainNode1 = obj.audioCtx.createGain();
  obj.gainNode2 = obj.audioCtx.createGain();

  obj.lowNode = obj.audioCtx.createBiquadFilter();
  obj.lowNode.type = "lowshelf";
  obj.lowNode.frequency = 440;
  obj.midNode = obj.audioCtx.createBiquadFilter();
  obj.midNode.type = "peaking";
  obj.midNode.frequency = 1000;
  obj.midNode.Q = 1;
  obj.highNode = obj.audioCtx.createBiquadFilter();
  obj.highNode.type = "highshelf";
  obj.highNode.frequency = 6000;

  obj.gainNode1.connect(obj.lowNode);
  obj.gainNode2.connect(obj.lowNode);
  obj.lowNode.connect(obj.midNode);
  obj.midNode.connect(obj.highNode);
  obj.highNode.connect(obj.audioCtx.destination);

  obj.gainNode1.gain.value = 1.0;
  obj.gainNode2.gain.value = 1.0;

  var audio = new Audio('silence/1-second-of-silence.mp3');
  audio.play();

  obj.audioCtx.onstatechange = function() {
    console.log(obj.prefix + " Context: " + obj.audioCtx.state);
  }
}

mock_LinBtn.onclick = function() {
  mock_RainObj.gainNode1.gain.cancelScheduledValues(mock_RainObj.audioCtx.currentTime);
  let gainVal = mock_RainObj.gainNode1.gain.value;
  mock_RainObj.gainNode1.gain.setValueAtTime(gainVal, mock_RainObj.audioCtx.currentTime);
  mock_RainObj.gainNode1.gain.linearRampToValueAtTime(1.0, mock_RainObj.audioCtx.currentTime + 2);
  mock_RainObj.gainNode1.gain.linearRampToValueAtTime(0.0, mock_RainObj.audioCtx.currentTime + 4);
  mock_RainObj.gainNode1.gain.linearRampToValueAtTime(1.0, mock_RainObj.audioCtx.currentTime + 6);
  mock_RainObj.gainNode1.gain.linearRampToValueAtTime(0.0, mock_RainObj.audioCtx.currentTime + 8);
  mock_RainObj.gainNode1.gain.linearRampToValueAtTime(gainVal, mock_RainObj.audioCtx.currentTime + 10);
}

mock_ExpBtn.onclick = function() {
  mock_RainObj.gainNode1.gain.cancelScheduledValues(mock_RainObj.audioCtx.currentTime);
  let gainVal = mock_RainObj.gainNode1.gain.value;
  mock_RainObj.gainNode1.gain.setValueAtTime(gainVal, mock_RainObj.audioCtx.currentTime);
  mock_RainObj.gainNode1.gain.exponentialRampToValueAtTime(1.0, mock_RainObj.audioCtx.currentTime + 2);
  mock_RainObj.gainNode1.gain.exponentialRampToValueAtTime(0.01, mock_RainObj.audioCtx.currentTime + 4);
  mock_RainObj.gainNode1.gain.exponentialRampToValueAtTime(1.0, mock_RainObj.audioCtx.currentTime + 6);
  mock_RainObj.gainNode1.gain.exponentialRampToValueAtTime(0.01, mock_RainObj.audioCtx.currentTime + 8);
  mock_RainObj.gainNode1.gain.exponentialRampToValueAtTime(gainVal, mock_RainObj.audioCtx.currentTime + 10);
}

function PlaySound(obj) {
  if (obj.sounds.length == 0) {
    ScheduleSound(obj, 0, 0, 1);
    ScheduleSound(obj, 1, obj.sounds[0].duration - 1.75, 2);
    // ScheduleSound(obj, 0, obj.buffers[0].duration - (obj.buffers[0].duration / 10));
  }
}
// var currTime = context.currentTime;
// for (var i = 0; i < iterations; i++) {
//   // For each buffer, schedule its playback in the future.
//   for (var j = 0; j < buffers.length; j++) {
//     var buffer = buffers[j];
//     var duration = buffer.duration;
//     var info = createSource(buffer);
//     var source = info.source;
//     var gainNode = info.gainNode;
//     // Fade it in.
//     gainNode.gain.linearRampToValueAtTime(0, currTime);
//     gainNode.gain.linearRampToValueAtTime(1, currTime + fadeTime);
//     // Then fade it out.
//     gainNode.gain.linearRampToValueAtTime(1, currTime + duration-fadeTime);
//     gainNode.gain.linearRampToValueAtTime(0, currTime + duration); // exponentialRampToValueAtTime

//     // Play the track now.
//     source[source.start ? 'start' : 'noteOn'](currTime);

//     // Increment time for the next iteration.
//     currTime += duration - fadeTime;
//   }
// }

// CrossfadeSample.prototype.crossfade = function(element) {
//   var x = parseInt(element.value) / parseInt(element.max);
//   // Use an equal-power crossfading curve:
//   var gain1 = Math.cos(x * 0.5*Math.PI);
//   var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
//   this.ctl1.gainNode.gain.value = gain1;
//   this.ctl2.gainNode.gain.value = gain2;
// };

function ScheduleSound(obj, index, delay = 0, gain = 1) {
  let sound = new Object();
  sound.parentObj = obj;
  sound.bufferSource = obj.audioCtx.createBufferSource();
  // soundSource.buffer = obj.buffers[mock_GetRandomIntInclusive(0,obj.buffers.length-1)];
  sound.bufferSource.buffer = obj.buffers[index];
  sound.buffersIndex = index;
  sound.duration = sound.bufferSource.buffer.duration;
  if (gain == 1) {
    sound.gainNode = obj.gainNode1;
  }
  else {
    sound.gainNode = obj.gainNode2;
  }
  sound.bufferSource.connect(sound.gainNode);

  let currTime = obj.audioCtx.currentTime;
  let fadeTime = 1;

  sound.bufferSource.onended = function() {
    let thisIndex = obj.sounds.indexOf(sound);
    //TODO: Need to use the duration of the other buffer.
    if (thisIndex != -1) {
      obj.sounds.splice(thisIndex, 1);
    }

    let duration = obj.sounds[thisIndex].duration

    var nextIndex = (index >= (obj.buffers.length - 1) ? 0 : index + 1);
    ScheduleSound(obj, nextIndex, obj.sounds[0].duration - (2 * 1.75), gain);
  }

  sound.fadeInStart  = currTime + delay;
  sound.fadeInEnd    = currTime + delay + fadeTime;
  sound.fadeOutStart = currTime + delay + sound.duration - fadeTime;
  sound.fadeOutEnd   = currTime + delay + sound.duration;

  sound.gainNode.gain.cancelScheduledValues(currTime);
  sound.gainNode.gain.setValueAtTime(obj.volume, currTime);
  sound.gainNode.gain.exponentialRampToValueAtTime(0.01, sound.fadeInStart);
  sound.gainNode.gain.exponentialRampToValueAtTime(obj.volume, sound.fadeInEnd);
  sound.gainNode.gain.exponentialRampToValueAtTime(obj.volume, sound.fadeOutStart);
  sound.gainNode.gain.exponentialRampToValueAtTime(0.01, sound.fadeOutEnd);

  sound.bufferSource[sound.bufferSource.start ? 'start' : 'noteOn'](sound.fadeInStart);

  console.log(obj.prefix + " Buf Length: " + (obj.sounds.length + 1) + " GainNode: " + gain + " Vol: " + obj.volume + " Scheduled a sound to play at: " + (sound.fadeInStart));
  console.log("In: " + sound.fadeInStart.toFixed(3) + ", " + sound.fadeInEnd.toFixed(3) + "\nOut: " + sound.fadeOutStart.toFixed(3) + ", " + sound.fadeOutEnd.toFixed(3));

  obj.sounds.push(sound);
}

mock_CreateBtn.onclick = function () {
  if (CheckIfContextExists(mock_RainObj) == false) {
    console.log(mock_RainObj.prefix + " Initializing context");

    mockDisplayTime(mockRainTimeDisplay);
    mock_InitializeContext(mock_RainObj);
    mock_RainObj.isPlaying = false;
    mock_RainObj.statusLabel = mock_CreateBtn;
    mock_RainObj.audioCtx.suspend();
  }
  if (mock_RainObj.buffers.length == 0) {
    console.log(mock_RainObj.prefix + " Gathering files");
    const dir = "sounds";
    mock_ListFiles(dir, mockListOfSoundFiles, "listFiles.php", mock_LoadSounds, mock_RainObj);
  }
  else {
    if (!mock_RainObj.isPlaying) {
      PlaySound(mock_RainObj);
      mock_RainObj.audioCtx.resume().then(function() {
        this.textContent = 'Pause';
      }.bind(this));
      mock_RainObj.isPlaying = true;
    // } else if(mock_ClipObj.audioCtx.state === 'running') {
    } else if(mock_RainObj.isPlaying) {
  
      // !!!!!!!!!!!!!!!!!Find out how to tell if a buffersource has ended!!!!!!!!!!!!!!
      mock_RainObj.audioCtx.suspend().then(function() {
        this.textContent = 'Resume';
      }.bind(this));
      mock_RainObj.isPlaying = false;
    }
  }
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
      console.log(obj.prefix + " ajax success");

      callbackFunc(fileList, obj, mock_BuffersLoaded, mock_FirstBufferLoaded, mock_ShowProgress);
    },
    error: function(xhr){
      alert(obj.prefix + " mock An error occured POSTing '" + phpFile + "': " + xhr.status + " " + xhr.statusText);
    },
    dataType: "json"
  });
};

function mock_LoadSounds(urlArray, obj, loadFunc, firstLoadFunc, progressFunc) {
  console.log(obj.prefix + " loading sounds");

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

function mock_ChangeVolume(sliderElem, gainNodeElem, obj = undefined) {
  // Convert value to a percentage (0, 100)
  let fraction = parseInt(sliderElem.value) / parseInt(sliderElem.max);
  // Let's use an x*x curve (x-squared) since simple linear (x) does not sound as good.
  // gainNodeElem.gain.value = fraction * fraction;

  if (obj && gainNodeElem) {
    gainNodeElem.gain.cancelScheduledValues(obj.audioCtx.currentTime);
    gainNodeElem.gain.exponentialRampToValueAtTime(fraction * fraction, obj.audioCtx.currentTime + 0.050);

    obj.volume = fraction * fraction;
    if (obj === mock_RainObj) {
      obj.sounds.forEach(element => {
        if (element.gainNode === gainNodeElem) {
          gainNodeElem.gain.exponentialRampToValueAtTime(0.01, element.fadeInStart);
          gainNodeElem.gain.exponentialRampToValueAtTime(obj.volume, element.fadeInEnd);
          gainNodeElem.gain.exponentialRampToValueAtTime(obj.volume, element.fadeOutStart);
          gainNodeElem.gain.exponentialRampToValueAtTime(0.01, element.fadeOutEnd);
        }
      });
    }
  }
}

function mock_MakeBuffer(obj) {
  obj.sounds[0].bufferSource = obj.audioCtx.createBufferSource();
  console.log(obj.prefix + " making buffer: " + mock_BufferIndex);
  obj.sounds[0].bufferSource.buffer = obj.buffers[mock_BufferIndex];
  mock_Ended = false;
  obj.sounds[0].bufferSource.connect(obj.gainNode1);
  let time = obj.audioCtx.currentTime;
  let mock_Delay = mock_Rate;
  let delayTime = time + mock_Delay;

  obj.sounds[0].bufferSource[obj.sounds[0].bufferSource.start ? 'start' : 'noteOn'](delayTime);
  console.log(obj.prefix + " Now :" + time);
  console.log(obj.prefix + " Play:" + time + "+" + mock_Delay + "=" + delayTime);
  obj.audioCtx.suspend()
  obj.sounds[0].bufferSource.onended = function() {
    console.log(obj.prefix + " mock ended");
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
  console.log(obj.prefix + " " + index + " Before: " + mock_AudioCtx.currentTime);
  mock_BufferSourceArray[0][mock_BufferSourceArray[0].start ? 'start' : 'noteOn'](mock_AudioCtx.currentTime);
  mock_BufferSourceArray[0].onended = function() {
    console.log(obj.prefix + " " + index + " After: " + mock_AudioCtx.currentTime);
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

const mock_MainLow  = mock_MainSliders.querySelector(".low");
const mock_MainMid  = mock_MainSliders.querySelector(".mid");
const mock_MainHigh = mock_MainSliders.querySelector(".high");
const mock_MainGain = mock_MainSliders.querySelector(".gain");
const mock_MainGain2 = mock_MainSliders.querySelector(".gain2");

mock_MainLow.querySelector(".slider").oninput = function() {
  // mock_MainLow.querySelector(".val").innerHTML = this.value;
  mock_SliderInput(this, mock_MainLow.querySelector(".val"), mock_RainObj.lowNode)
}

mock_MainMid.querySelector(".slider").oninput = function() {
  // mock_MainMid.querySelector(".val").innerHTML = this.value;
  mock_SliderInput(this, mock_MainMid.querySelector(".val"), mock_RainObj.midNode)
}
mock_MainHigh.querySelector(".slider").oninput = function() {
  // mock_MainHigh.querySelector(".val").innerHTML = this.value;
  mock_SliderInput(this, mock_MainHigh.querySelector(".val"), mock_RainObj.highNode)
}

mock_MainGain.querySelector(".slider").oninput = function() {
  mock_MainGain.querySelector(".val").innerHTML = this.value;
  mock_ChangeVolume(this, mock_RainObj.gainNode1, mock_RainObj);
}

mock_MainGain2.querySelector(".slider").oninput = function() {
  mock_MainGain2.querySelector(".val").innerHTML = this.value;
  mock_ChangeVolume(this, mock_RainObj.gainNode2, mock_RainObj);
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
  if (obj.sounds.length == 0) {
    ScheduleClip(obj);
    ScheduleClip(obj, 5);
  }
}

function ScheduleClip(obj, delay = 0) {
  let sound = new Object();
  sound.buffersource = obj.audioCtx.createBufferSource();
  sound.buffersource.buffer = obj.buffers[mock_GetRandomIntInclusive(0,obj.buffers.length-1)];
  sound.buffersource.connect(obj.gainNode1);
  sound.buffersource.onended = function() {
    let thisIndex = obj.sounds.indexOf(sound);
    if (thisIndex != -1) {
      obj.sounds.splice(thisIndex, 1);
    }
    ScheduleClip(obj);
  }
  let time = obj.audioCtx.currentTime + mock_GetRandomIntInclusive(0,mock_ClipsHiddenFreqSldr.value * 1) + delay;
  sound.buffersource[sound.buffersource.start ? 'start' : 'noteOn'](time);

  console.log(obj.prefix + " Buf Length: " + (obj.sounds.length + 1) +" Scheduled a sound to play at: " + time);

  obj.sounds.push(sound);
}

mock_ClipsHiddenToggleBtn.onclick = function () {
  if (CheckIfContextExists(mock_ClipObj) == false) {
    console.log(mock_ClipObj.prefix + " Initializing context");
    mockDisplayTime(mockClipsTimeDisplay);
    mock_InitializeContext(mock_ClipObj);
    mock_ClipObj.isPlaying = false;
    mock_ClipObj.statusLabel = mock_ClipsHiddenToggleBtn;
    mock_ClipObj.audioCtx.suspend();
  }
  if (mock_ClipObj.buffers.length == 0) {
    console.log(mock_ClipObj.prefix + " Gathering clip files");
    const dir = "clips";
    mock_ListFiles(dir, mockListOfClipFiles, "listFiles.php", mock_LoadSounds, mock_ClipObj);
  }
  else {
    if (!mock_ClipObj.isPlaying) {
      // mock_ClipObj.sounds[0].buffersource = mock_ClipObj.audioCtx.createBufferSource();
      // mock_ClipObj.sounds[0].buffersource.buffer = mock_ClipObj.buffers[mock_BufferIndex];
      // mock_ClipObj.sounds[0].buffersource.connect(mock_ClipObj.lowNode);
      // mock_ClipObj.sounds[0].buffersource[mock_ClipObj.sounds[0].buffersource.start ? 'start' : 'noteOn'](0);
      PlayClip(mock_ClipObj);
      mock_ClipObj.audioCtx.resume().then(function() {
        this.textContent = 'Pause';
      }.bind(this));
      mock_ClipObj.isPlaying = true;
    // } else if(mock_ClipObj.audioCtx.state === 'running') {
    } else if(mock_ClipObj.isPlaying) {
  
      // !!!!!!!!!!!!!!!!!Find out how to tell if a buffersource has ended!!!!!!!!!!!!!!
      mock_ClipObj.sounds.forEach(function(e) {
        e.buffersource.onended = null;
        e.buffersource.stop();
      });
      mock_ClipObj.sounds.length = 0;
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
  mock_ChangeVolume(this, mock_ClipObj.gainNode1, mock_ClipObj);
}
