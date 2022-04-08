let ThunderObj = {
  audioCtx: undefined,
  buffers: Array(), // Array of sound data from the files
  gainNode1: undefined, // WebAudio object for this context's gain (volume)
  gainNode2: undefined, // WebAudio object for this context's gain (volume)
  lowNode: undefined, // WebAudio object for this context's low filter
  midNode: undefined, // WebAudio object for this context's mid filter
  highNode: undefined, // WebAudio object for this context's high filter
  volume: undefined,
  isPlaying: false, // Bool to indicate if sound is currently being produced
  statusLabel: undefined, // Text object to show Play/Pause
  prefix: "Thunder",
  sounds: Array() // Array of "Sound" objects.
}

let RainObj = {
  audioCtx: undefined,
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
  sounds: Array() // Array of "Sound" objects.
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

const controllerBtn = document.querySelector("#controllerButton");
const soundResetBtn = document.querySelector("#resetSounds");
const thunderToggleBtn = document.querySelector("#thunderToggle");

let rainSoundList = document.querySelector("#rainSoundList");
let thunderSoundList = document.querySelector("#thunderSoundList");

let rainPrimarySliders = document.querySelector("#rainPrimarySliders");
let rainSettings = document.querySelector("#rainSettings");
let thunderPrimarySliders = document.querySelector("#thunderPrimarySliders");
let thunderSettings = document.querySelector("#thunderSettings");

let listOfRainFiles = {array: new Array()};
let listOfThunderFiles = {array: new Array()};

const rainContextDisplay = {
  label: document.querySelector('#rainContextLabel'),
  obj: RainObj
}

const thunderContextDisplay = {
  label: document.querySelector('#thunderContextLabel'),
  obj: ThunderObj
}

// Shows the context time, updated each frame.
function UpdateContextDisplay(contextDisplay) {
  if(contextDisplay.obj.audioCtx && contextDisplay.obj.audioCtx.state !== 'closed') {
    contextDisplay.label.textContent = 'Current context time: ' + contextDisplay.obj.audioCtx.currentTime.toFixed(3);
  } else {
    contextDisplay.label.textContent = 'Current context time: No context exists.'
    // return;
  }

  // Repeatedly call this function each frame.
  requestAnimationFrame(function() {
    UpdateContextDisplay(contextDisplay);
  });
}

// ------------------------------------------------------------------------------------------
// Buffer Loader functions
// ------------------------------------------------------------------------------------------
// Function to be called after all files were successfully loaded.
function AllBuffersLoaded(listofBuffers, obj) {
  if (obj === RainObj) {
    controllerBtn.lastElementChild.classList.remove("fa-spinner");
    controllerBtn.lastElementChild.classList.remove("fa-pulse");
    controllerBtn.lastElementChild.classList.add("fa-play-circle-o");
  }
  else if (obj === ThunderObj) {
    thunderToggleBtn.lastElementChild.classList.remove("fa-bolt");
    thunderToggleBtn.lastElementChild.classList.remove("fa-spin");
    thunderToggleBtn.lastElementChild.classList.add("fa-toggle-on");
    thunderToggleBtn.removeAttribute("disabled");

    document.querySelector("#thunderControls").hidden = false;
    thunderEnabled = true;
  }
}

// Called by BufferLoader before the buffers are loaded.
function createSoundHTMLList(urlArray, listElement) {
    // Create numbered list.
    var innerList = document.createElement('ol');
    // innerList.setAttribute("id", "soundInnerList");

    // Create a list item for each sound file to be loaded.
    for (let i = 0; i < urlArray.length; i++) {
      var listItem = document.createElement('li');
      listItem.setAttribute("id", urlArray[i])

      var listItemName = document.createTextNode(urlArray[i]);
      var listItemPercent = document.createTextNode("-");

      // Add components to each list item then add it to the list.
      listItem.appendChild(listItemName);
      listItem.appendChild(listItemPercent);
      innerList.appendChild(listItem);
    }
    // Add the list to the specified html container.
    listElement.list.appendChild(innerList);
}

// Called on each reported progress step of the ajax call loading the buffers.
// Will populate the respective list item with the download progress of the current sound.
function MarkBufferLoadProgress(event, urlArray, index) {
  if (event.lengthComputable) {
    var complete = (event.loaded / event.total * 100 | 0);
    document.getElementById(urlArray[index]).lastChild.nodeValue = " - " + complete + '% (' + event.loaded / 1000 + '/' + event.total / 1000 + "KB)";
  }
  else {
    document.getElementById(urlArray[index]).lastChild.nodeValue = "?";
  }
}

// Called when the first buffer is loaded and ready to be played.
// TODO: Set this up to begin playing the first buffer while the rest finish downloading.
function FirstBufferLoaded(myBuffer, obj) {
  console.log("first buffer loaded: ");
  console.log(myBuffer);
}

// Create the WebAudio API Audio Context object, configure all related nodes, and kick the webpage.
function InitializeWebAudioContext(obj) {
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

  // Kick the webpage to recognize audio by playing a blank HTML5 audio object.
  var audio = new Audio('silence/1-second-of-silence.mp3');
  audio.play();

  // Log when the context changes state.
  obj.audioCtx.onstatechange = function() {
    console.log(obj.prefix + " Context: " + obj.audioCtx.state);
  }
}

function CheckIfContextExists(obj) {
  return obj.audioCtx != undefined;
}

// Start a rain sound now and shedule the next one to fade in 1.75 seconds before the first ends.
function PlayRainSound(obj) {
  if (obj.sounds.length == 0) {
    ScheduleSound(obj, 0, 0, 1);
    ScheduleSound(obj, 1, obj.sounds[0].duration - 1.75, 2);
    // ScheduleSound(obj, 0, obj.buffers[0].duration - (obj.buffers[0].duration / 10));
  }
  // TODO: START RAIN LIGHTS HERE!
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
  // Populate a new Sound object.
  let sound = new Object();
  sound.parentObj = obj;
  sound.bufferSource = obj.audioCtx.createBufferSource();
  sound.bufferSource.buffer = obj.buffers[index];
  sound.buffersIndex = index;
  sound.duration = sound.bufferSource.buffer.duration;
  // Connect the proper gain node.
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

    // Increment to the next sound index in the list.
    var nextIndex = (index >= (obj.buffers.length - 1) ? 0 : index + 1);
    // Schedule the next sound to start 3.5 seconds before the current one ends.
    ScheduleSound(obj, nextIndex, obj.sounds[0].duration - (2 * 1.75), gain);
  }

  // Calculate the bounding times for fading the sounds.
  sound.fadeInStart  = currTime + delay;
  sound.fadeInEnd    = currTime + delay + fadeTime;
  sound.fadeOutStart = currTime + delay + sound.duration - fadeTime;
  sound.fadeOutEnd   = currTime + delay + sound.duration;

  // Cancel any active volume changes.
  sound.gainNode.gain.cancelScheduledValues(currTime);
  // Immediately set the volume to the current value to prep before the ramps.
  sound.gainNode.gain.setValueAtTime(obj.volume, currTime);
  // Start the fade at the current volume to end at the lowest non-zero value at the scheduled time.
  sound.gainNode.gain.exponentialRampToValueAtTime(0.01, sound.fadeInStart);
  // Slowly fade in the sound to the set volume.
  sound.gainNode.gain.exponentialRampToValueAtTime(obj.volume, sound.fadeInEnd);
  // Stay at the same volume until fade out begins.
  sound.gainNode.gain.exponentialRampToValueAtTime(obj.volume, sound.fadeOutStart);
  // Slowly fade out the sound to the lowest value.
  sound.gainNode.gain.exponentialRampToValueAtTime(0.01, sound.fadeOutEnd);

  // Start the buffer at the correct time.
  sound.bufferSource[sound.bufferSource.start ? 'start' : 'noteOn'](sound.fadeInStart);

  console.log(obj.prefix + " Buf Length: " + (obj.sounds.length + 1) + " GainNode: " + gain + " Vol: " + obj.volume + " Scheduled a sound to play at: " + (sound.fadeInStart));
  console.log("In: " + sound.fadeInStart.toFixed(3) + ", " + sound.fadeInEnd.toFixed(3) + "\nOut: " + sound.fadeOutStart.toFixed(3) + ", " + sound.fadeOutEnd.toFixed(3));

  // Push this sound to the list to keep track of active sounds.
  obj.sounds.push(sound);
}


// Set the click handler for the main button.
controllerBtn.onclick = function () {

  // Create the audio context if this is the first time.
  if (CheckIfContextExists(RainObj) == false) {
    console.log(RainObj.prefix + " Initializing context");
    // Add loading icon.
    controllerBtn.lastElementChild.classList.remove("fa-play-circle-o");
    controllerBtn.lastElementChild.classList.add("fa-spinner");
    controllerBtn.lastElementChild.classList.add("fa-pulse");

    // Update the context display now that the context exists.
    UpdateContextDisplay(rainContextDisplay);
    InitializeWebAudioContext(RainObj);
    // Set the volume nodes.
    ChangeVolume(rainGain.querySelector(".slider"), RainObj.gainNode1, RainObj);
    ChangeVolume(rainGain.querySelector(".slider"), RainObj.gainNode2, RainObj);
    // Context created, but don't play yet.
    RainObj.isPlaying = false;
    RainObj.audioCtx.suspend();
  }

  // Get sound files if needed.
  if (RainObj.buffers.length == 0) {
    console.log(RainObj.prefix + " Gathering files");
    const dir = "sounds";
    GetFileNames(dir, listOfRainFiles, "listFiles.php", LoadSounds, RainObj);
  }
  else {
    if (!RainObj.isPlaying) {
      PlayRainSound(RainObj);
      RainObj.audioCtx.resume().then(function() {
        this.lastElementChild.classList.remove("fa-play-circle-o");
        this.lastElementChild.classList.add("fa-pause-circle-o");
      }.bind(this));
      RainObj.isPlaying = true;
      if (rainLightsEnabled) {
        StartRainLights();
      }

      if (CheckIfContextExists(ThunderObj) == true && thunderEnabled) {
        if (!ThunderObj.isPlaying) {
          PlayThunder(ThunderObj);
          ThunderObj.audioCtx.resume();
          ThunderObj.isPlaying = true;
        }
      }
    } else { // Rain is currently playing.
  
      // !!!!!!!!!!!!!!!!!Find out how to tell if a buffersource has ended!!!!!!!!!!!!!!
      RainObj.audioCtx.suspend().then(function() {
        this.lastElementChild.classList.remove("fa-pause-circle-o");
        this.lastElementChild.classList.add("fa-play-circle-o");
      }.bind(this));
      RainObj.isPlaying = false;
      if (rainLightsEnabled) {
        StopRainLights();
      }
      StopThunder(ThunderObj);
    }
  }
}

// List the file names of the files in the specified directory.
function GetFileNames(directory, fileList, phpFile, callbackFunc, obj) {
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

      callbackFunc(fileList, obj, AllBuffersLoaded, FirstBufferLoaded, MarkBufferLoadProgress);
    },
    error: function(xhr){
      alert(obj.prefix + " An error occured while getting file names: '" + phpFile + "': " + xhr.status + " " + xhr.statusText);
    },
    dataType: "json"
  });
};

// Function to call after the file names have successfully been listed.
// Creates a buffer loader to load each of the sound files and create a buffer for each.
function LoadSounds(urlArray, obj, loadFunc, firstLoadFunc, progressFunc) {
  // Create BufferLoader from BufferLoader.js.
  bufferLoader = new BufferLoader(
    obj,
    urlArray.array,
    loadFunc,
    firstLoadFunc,
    progressFunc
  );

  // Create a container for the sound lists.
  var listElement = {
    list: rainSoundList
  }
  if (obj === ThunderObj) {
    listElement.list = thunderSoundList;
  }

  // Start the load process by calling "createSoundHTMLList" once before loading the buffers.
  bufferLoader.load(createSoundHTMLList, listElement);
};

// Change the volume of the specified object.
function ChangeVolume(sliderElem, gainNodeElem, obj = undefined) {
  // Convert value to a percentage (0, 100)
  let fraction = parseInt(sliderElem.value) / parseInt(sliderElem.max);
  // Let's use an x*x curve (x-squared) since simple linear (x) does not sound as good.
  // gainNodeElem.gain.value = fraction * fraction;

  if (obj && gainNodeElem) {
    gainNodeElem.gain.cancelScheduledValues(obj.audioCtx.currentTime);
    gainNodeElem.gain.exponentialRampToValueAtTime(fraction * fraction, obj.audioCtx.currentTime + 0.050);

    obj.volume = fraction * fraction;
    if (obj === RainObj) {
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


function GetRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function GetRandom(min, max) {
  return Math.random() * (max - min) + min; //The maximum is inclusive and the minimum is inclusive
}

function SliderInput(sliderElem, valueElem, gainNode) {
  valueElem.innerHTML = sliderElem.value;
  gainNode.gain.value = sliderElem.value;
}

const rainLow  = rainSettings.querySelector(".low");
const rainMid = rainSettings.querySelector(".mid");
const rainHigh = rainSettings.querySelector(".high");
const rainGain = rainPrimarySliders.querySelector(".gain");

rainLow.querySelector(".slider").oninput = function() {
  SliderInput(this, rainLow.querySelector(".val"), RainObj.lowNode)
}

rainMid.querySelector(".slider").oninput = function() {
  SliderInput(this, rainMid.querySelector(".val"), RainObj.midNode)
}
rainHigh.querySelector(".slider").oninput = function() {
  SliderInput(this, rainHigh.querySelector(".val"), RainObj.highNode)
}

rainGain.querySelector(".slider").oninput = function() {
  rainGain.querySelector(".val").innerHTML = this.value;
  ChangeVolume(this, RainObj.gainNode1, RainObj);
  ChangeVolume(this, RainObj.gainNode2, RainObj);
}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Timer Section
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

let timerContainer = document.querySelector("#timer");
let remainingTimeLabel = timerContainer.querySelector(".timerLabel");
const timerStartBtn = timerContainer.querySelector(".timerStart");
const timerInputContainer = timerContainer.querySelector(".timerInput");
let timerHours = timerInputContainer.querySelector(".hourIn");
let timerMins = timerInputContainer.querySelector(".minuteIn");

let timerRunning = false;
let timeInSeconds = 0;
let tickInterval = null;

timerStartBtn.onclick = function () {
  console.log("Timer clicked");
  if (!timerRunning) {
    // Start Timer
    timerRunning = !timerRunning;
    timeInSeconds = (timerHours.value * 60 * 60) + // Hours
                    (timerMins.value * 60) + // Minutes
                    0; // Seconds
    DisplayTime(timeInSeconds);
    remainingTimeLabel.hidden = false;
    timerInputContainer.hidden = true;
    tickInterval = setInterval(TimerTick, 1000);
    this.innerHTML = "Stop Timer";
  }
  else {
    // Stop Timer
    timerRunning = !timerRunning;
    clearInterval(tickInterval);
    DisplayTime(0);
    remainingTimeLabel.hidden = true;
    timerInputContainer.hidden = false;
    this.innerHTML = "Start Timer";
  }

}

function TimerTick() {
  DisplayTime(timeInSeconds)
  timeInSeconds -= 1;
  if (timeInSeconds < 0) {
    clearInterval(tickInterval);
    EndTimer();
  }
}

function DisplayTime(seconds){
  var displayHours = Math.floor(seconds / (60 * 60));
  var remainder = seconds - (displayHours * 60 * 60);
  var displayMinutes = Math.floor(remainder / 60);
  var displaySeconds = remainder - (displayMinutes * 60);
  // TODO: Make each field be two characters. (hh : mm : ss)
  remainingTimeLabel.innerHTML = displayHours + " : " +
                                 displayMinutes + " : " + displaySeconds;
};

function EndTimer() {
  // TODO convert this to fade out
  if (CheckIfContextExists(RainObj)) {
    RainObj.audioCtx.suspend().then(function () {
      controllerBtn.lastElementChild.classList.remove("fa-pause-circle-o");
      controllerBtn.lastElementChild.classList.add("fa-play-circle-o");
    });
    RainObj.isPlaying = false;
    if (rainLightsEnabled) {
      StopRainLights();
    }
  }
  if (CheckIfContextExists(ThunderObj)) {
    StopThunder(ThunderObj);
  }
}

// Set the handler for the thunder slider.
const thunderFrequencySldr = thunderPrimarySliders.querySelector(".freq").querySelector(".slider");
thunderFrequencySldr.oninput = function() {
  this.parentElement.querySelector(".val").innerHTML = this.value;
}

// Starts a thunder clip within the next period and schedules the one after.
function PlayThunder(obj) {
  if (obj.sounds.length == 0) {
    ScheduleThunder(obj);
    ScheduleThunder(obj, 5);
  }
}

// Schedules a random sound clip up to the frequency value from now plus whatever delay was passed.
// When the sound ends, the next one will be scheduled.
function ScheduleThunder(obj, extraDelay = 0, now = false) {
  let sound = new Object();
  sound.buffersource = obj.audioCtx.createBufferSource();
  sound.buffersource.buffer = obj.buffers[GetRandomIntInclusive(0,obj.buffers.length-1)];
  sound.buffersource.connect(obj.gainNode1);
  if (!now) {
    sound.buffersource.onended = function() {
      let thisIndex = obj.sounds.indexOf(sound);
      if (thisIndex != -1) {
        obj.sounds.splice(thisIndex, 1);
      }
      ScheduleThunder(obj);
    }
  }
  let clearRandom = (now == true ? 0 : 1);
  let delay = GetRandomIntInclusive(0, thunderFrequencySldr.value * clearRandom) + extraDelay;
  let time = obj.audioCtx.currentTime + delay;
  sound.buffersource[sound.buffersource.start ? 'start' : 'noteOn'](time);
  ScheduleLightning(delay);

  console.log(obj.prefix + " Buf Length: " + (obj.sounds.length + 1) + ". Scheduled a sound to play at: " + time + "(" + delay+")");

  if (!now) {
    obj.sounds.push(sound);
  }
  else {
    sound.buffersource.onended = function () {
      if (!obj.isPlaying) {
        obj.audioCtx.suspend();
      }
    }
    obj.audioCtx.resume();
  }
}

let thunderEnabled = false;

// Handler for the main thunder switch.
thunderToggleBtn.onclick = function () {
  if (!thunderEnabled) {
    if (CheckIfContextExists(ThunderObj) == false) {
      this.lastElementChild.classList.remove("fa-toggle-off");
      this.lastElementChild.classList.add("fa-bolt");
      this.lastElementChild.classList.add("fa-spin");
      this.setAttribute("disabled","disabled");

      UpdateContextDisplay(thunderContextDisplay);
      InitializeWebAudioContext(ThunderObj);
      ChangeVolume(thunderGain.querySelector(".slider"), ThunderObj.gainNode1, ThunderObj);
      ChangeVolume(thunderGain.querySelector(".slider"), ThunderObj.gainNode2, ThunderObj);
      ThunderObj.isPlaying = false;
      ThunderObj.statusLabel = thunderToggleBtn;
      ThunderObj.audioCtx.suspend();

      CreateSilenceContext();
    }
    if (ThunderObj.buffers.length == 0) {
      const dir = "clips";
      GetFileNames(dir, listOfThunderFiles, "listFiles.php", LoadSounds, ThunderObj);
    }
    else {
      this.lastElementChild.classList.remove("fa-toggle-off");
      this.lastElementChild.classList.add("fa-toggle-on");
      thunderEnabled = true;
      document.querySelector("#thunderControls").hidden = false;
    }
  }
  else { // Thunder IS enabled.
    StopThunder(ThunderObj);
    this.lastElementChild.classList.remove("fa-toggle-on");
    this.lastElementChild.classList.add("fa-toggle-off");
    thunderEnabled = false;
    document.querySelector("#thunderControls").hidden = true;
  }
}

function StopThunder(obj) {
  if (obj.isPlaying && CheckIfContextExists(obj)) {
    obj.sounds.forEach(function (e) {
      e.buffersource.onended = null;
      e.buffersource.stop();
    });
    obj.sounds.length = 0;
    obj.audioCtx.suspend();
    obj.isPlaying = false;
  }
  SuspendLightning();
}

const thunderLow = thunderSettings.querySelector(".low");
const thunderMid = thunderSettings.querySelector(".mid");
const thunderHigh = thunderSettings.querySelector(".high");
const thunderGain = thunderSettings.querySelector(".gain");

thunderLow.querySelector(".slider").oninput = function() {
  SliderInput(this, thunderLow.querySelector(".val"), ThunderObj.lowNode)
}

thunderMid.querySelector(".slider").oninput = function() {
  SliderInput(this, thunderMid.querySelector(".val"), ThunderObj.midNode)
}

thunderHigh.querySelector(".slider").oninput = function() {
  SliderInput(this, thunderHigh.querySelector(".val"), ThunderObj.highNode)
}

thunderGain.querySelector(".slider").oninput = function() {
  thunderGain.querySelector(".val").innerHTML = this.value;
  ChangeVolume(this, ThunderObj.gainNode1, ThunderObj);
  ChangeVolume(this, ThunderObj.gainNode2, ThunderObj);
}

thunderSettings.querySelector("#triggerThunder").onclick = function() {
  if (CheckIfContextExists(ThunderObj) && ThunderObj.buffers.length > 0) {
    ScheduleThunder(ThunderObj,0,true);
  }
}

function FlashThunder() {
  // console.log("Thunder at: " + ThunderObj.audioCtx.currentTime);
  // for (let time = 0; time < 3; time++) {
  //   setTimeout(function () {
  //     document.querySelector("#thunderSection").style.backgroundColor = "#FFFFFF";
  //   }, time * 100);

  //   setTimeout(function () {
  //     document.querySelector("#thunderSection").style.backgroundColor = "#FFFFFF00";
  //   }, time * 100 + 50);
  // }
  // Copy lightning json file for Python to catch and display.
  $.post("copyFile.php", { originalName: "Lightning.json", source: "scripts/Animations/json/", destination: "ledlayers/", newName: "layer4.json"},
    function (result) {
      console.log(result);
      setTimeout(function() {
        $.post("copyFile.php", { originalName: "Clear.json", source: "scripts/Animations/json/", destination: "ledlayers/", newName: "layer4.json" },
          function (result) {
            console.log(result);
          })
      }, 2000)

  })
  .fail(function(xhr) {
    console.log("Error: '" + "copyFile.php" + "': " + xhr.status + " " + xhr.statusText);
  })
}

let SilenceSound = {
  audioCtx: undefined,
  gainNode: undefined,
  bufferSource: undefined,
  buffer: undefined,
  instances: 0 // Number of active lightning events
}

function CreateSilenceContext() {
  if (CheckIfContextExists(SilenceSound) == false) {
    AudioContext = window.AudioContext || window.webkitAudioContext;
    SilenceSound.audioCtx = new AudioContext();
    SilenceSound.gainNode = SilenceSound.audioCtx.createGain();
    SilenceSound.gainNode.connect(SilenceSound.audioCtx.destination);
    SilenceSound.gainNode.gain.value = 0.0;
    SilenceSound.audioCtx.suspend();
    var audio = new Audio('silence/10-milliseconds-of-silence.mp3');
    audio.play();

    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", "silence/10-milliseconds-of-silence.mp3", true);
    request.responseType = "arraybuffer";

    request.onload = function () {
      // Asynchronously decode the audio file data in request.response
      SilenceSound.audioCtx.decodeAudioData(request.response,
        // Function to call on success
        function (buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          SilenceSound.buffer = buffer
          console.log("Silence loaded.");
        },
        // Function to call on error
        function (error) {
          console.error('decodeAudioData error', error);
        }
      );
    }

    request.onerror = function () {
      alert('BufferLoader: XHR error');
    }

    request.send();
  }
}

function ScheduleLightning(delay = 0) {
  SilenceSound.instances++;
  SilenceSound.bufferSource = SilenceSound.audioCtx.createBufferSource();
  SilenceSound.bufferSource.buffer = SilenceSound.buffer;
  SilenceSound.bufferSource.connect(SilenceSound.gainNode);

  SilenceSound.bufferSource.onended = function () {
    if (lightningLightsEnabled) {
      FlashThunder();
    }
    SilenceSound.instances--;
    if (SilenceSound.instances == 0) {
      SilenceSound.audioCtx.suspend();
    }
  }

  let time = SilenceSound.audioCtx.currentTime + delay;
  SilenceSound.audioCtx.resume();
  SilenceSound.bufferSource[SilenceSound.bufferSource.start ? 'start' : 'noteOn'](time);
}

function SuspendLightning()
{
  if (CheckIfContextExists(SilenceSound)) {
    if (SilenceSound.bufferSource)
    {
      SilenceSound.bufferSource.onended = null;
      SilenceSound.bufferSource.stop();
    }
    SilenceSound.instances = 0;
    SilenceSound.audioCtx.suspend();
  }
}

let debugClicks = 0;
let debugMode = false;
document.querySelector("#signoff").onclick = function() {
  // Increment the click count.
  ++debugClicks;

  // Reset the click count back to 0 if not done correctly.
  setTimeout(() => {
    debugClicks = 0;
  }, 1000);

  // Triggered debug mode toggle.
  if (debugClicks >= 5) {
    // Toggle debug mode
    debugMode = !debugMode;
    // Keep subsequent clicks from re-triggering the toggle.
    debugClicks = 0;

    // Perform debug mode actions.
    if (debugMode) {
      //Unhide all debug elements.
      document.querySelectorAll(".debug").forEach(function (el) {
        el.hidden = false;
      });
      document.querySelector("#navBar").style.backgroundColor = "#FF0000";
    }
    else { // Reset back to normal operation.
      document.querySelectorAll(".debug").forEach(function (el) {
        el.hidden = true;
      });
      document.querySelector("#navBar").style.backgroundColor = "#000000";
    }
  }

}

document.querySelectorAll(".darkenedBackground").forEach(function (el) {
  el.onclick = function () {
    this.parentElement.hidden = true;
    document.querySelector(".lightsButton").style.zIndex = "auto";
    document.querySelector(".lightningButton").style.zIndex = "auto";
  }
});

let rainLightsEnabled = false;
let rainJSON = {};

document.querySelector(".lightsButton").onclick = function () {
  rainLightsEnabled = !rainLightsEnabled;
  this.style.zIndex = "4";
  document.querySelector("#sound .lightsBrightness").parentElement.querySelector(".val").innerHTML = document.querySelector("#sound .lightsBrightness").value;
  document.querySelector("#sound .lightsSpeed").parentElement.querySelector(".val").innerHTML = document.querySelector("#sound .lightsSpeed").value;
  if (rainLightsEnabled) {
    this.firstChild.style.color = "#C0C090";

    $.getJSON("scripts/Animations/json/Rain.json", { _: new Date().getTime() }, function (result) {
      rainJSON = result;
      rainJSON.html[0].value = document.querySelector("#sound .lightsBrightness").value.toString();
      rainJSON.html[1].value = document.querySelector("#sound .lightsSpeed").value.toString();
      let text = JSON.stringify(rainJSON);
      $.post("writeValue.php", { value: text, fileName: "scripts/Animations/json/Rain.json", fileMode: "w+" },
        function (result) {
        })
        .fail(function (xhr) {
          console.log("Error: '" + "writeValue.php" + "': " + xhr.status + " " + xhr.statusText);
        })
    }.bind(this));

    // Enable rain
    if (RainObj.isPlaying) {
      StartRainLights();
    }
  }
  else {
    this.firstChild.style.color = "lightblue";
  }
  this.nextElementSibling.hidden = false;
}

document.querySelector("#sound .lightsBrightness").oninput = function () {
  this.parentElement.querySelector(".val").innerHTML = this.value;
  rainJSON.html[0].value = this.value.toString();
  // Write to the layer
  if (rainLightsEnabled) {
    $.post("writeValue.php", { value: JSON.stringify(rainJSON), fileName: "ledlayers/layer3.json", fileMode: "w+" },
      function (result) {
      })
      .fail(function (xhr) {
        console.log("Error: '" + "writeValue.php" + "': " + xhr.status + " " + xhr.statusText);
      })
  }
}

document.querySelector("#sound .lightsSpeed").oninput = function () {
  this.parentElement.querySelector(".val").innerHTML = this.value;
  rainJSON.html[1].value = this.value.toString();
  // Write to the layer
  if (rainLightsEnabled) {
    $.post("writeValue.php", { value: JSON.stringify(rainJSON), fileName: "ledlayers/layer3.json", fileMode: "w+" },
      function (result) {
      })
      .fail(function (xhr) {
        console.log("Error: '" + "writeValue.php" + "': " + xhr.status + " " + xhr.statusText);
      })
  }
}

function StartRainLights() {
  $.post("copyFile.php", { originalName: "Rain.json", source: "scripts/Animations/json/", destination: "ledlayers/", newName: "layer3.json" },
    function (result) {
      console.log(result);
    })
    .fail(function (xhr) {
      console.log("Error: '" + "copyFile.php" + "': " + xhr.status + " " + xhr.statusText);
    })
}

function StopRainLights() {
  $.post("copyFile.php", { originalName: "Clear.json", source: "scripts/Animations/json/", destination: "ledlayers/", newName: "layer3.json" },
    function (result) {
      console.log(result);
    })
    .fail(function (xhr) {
      console.log("Error: '" + "copyFile.php" + "': " + xhr.status + " " + xhr.statusText);
    })
}

let lightningLightsEnabled = false;
let lightningJSON = {};
document.querySelector(".lightningButton").onclick = function () {
  lightningLightsEnabled = !lightningLightsEnabled;
  this.style.zIndex = "4";
  document.querySelector("#thunderControls .lightsBrightness").parentElement.querySelector(".val").innerHTML = document.querySelector("#thunderControls .lightsBrightness").value;
  if (lightningLightsEnabled) {
    this.firstChild.style.color = "#C0C090";

    $.getJSON("scripts/Animations/json/Lightning.json", { _: new Date().getTime() }, function (result) {
      lightningJSON = result;
      lightningJSON.html[0].value = document.querySelector("#thunderControls .lightsBrightness").value.toString();
      let text = JSON.stringify(lightningJSON);
      $.post("writeValue.php", { value: text, fileName: "scripts/Animations/json/Lightning.json", fileMode: "w+" },
        function (result) {
        })
        .fail(function (xhr) {
          console.log("Error: '" + "writeValue.php" + "': " + xhr.status + " " + xhr.statusText);
        })
    }.bind(this));
  }
  else {
    this.firstChild.style.color = "lightblue";
  }
  this.nextElementSibling.hidden = false;
}

document.querySelector("#thunderControls .lightsBrightness").oninput = function () {
  this.parentElement.querySelector(".val").innerHTML = this.value;
  lightningJSON.html[0].value = this.value.toString();
  // Write to the layer
  if (lightningLightsEnabled) {
    $.post("writeValue.php", { value: JSON.stringify(lightningJSON), fileName: "ledlayers/layer4.json", fileMode: "w+" },
      function (result) {
      })
      .fail(function (xhr) {
        console.log("Error: '" + "writeValue.php" + "': " + xhr.status + " " + xhr.statusText);
      })
  }
}