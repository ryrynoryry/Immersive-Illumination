// const AudioContext = window.AudioContext || window.webkitAudioContext;
// const context = new AudioContext();

function loadSampleOld(url) {
  console.log("fetching: " + url);
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => context.decodeAudioData(buffer));
}

AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
let soundSample;

// function loadSample(url) {

//   console.log("fetching: " + url);

//   var request = new XMLHttpRequest();
//   request.open("GET", url, true);
//   request.responseType = "arraybuffer";

//   request.onload = function() {
//     // Asynchronously decode the audio file data in request.response
//     context.decodeAudioData(request.response,
//       // Function to call on success
//       function(buffer) {
//         if (!buffer) {
//           alert('error decoding file data: ' + url);
//           return;
//         }
//         soundSample = buffer;
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
// };

function playSample(sample, rate) {
  const source = context.createBufferSource();
  source.buffer = sample;
  source.loop = true;
  source.connect(context.destination);
  source.detune.value = rate; //playbackRate
  source.start(0);
}

// let pitchLoadBtn = document.querySelector("#pitchLoad");
// pitchLoadBtn.onclick = function() {loadSample("bark.mp3");
// }

// let pitchRate = document.querySelector("#pitchRate");

// let pitchPlayBtn = document.querySelector("#pitchPlay");
// pitchPlayBtn.onclick = function() {
//   // if (pitchRate.checkValidity()) {
//     playSample(soundSample, pitchRate.value);
//   // }
//   // else
//   // {
//   //   console.error("Invalid rate: " + pitchRate)
//   // }
// };

loadSampleOld('techno.wav')
  .then(sample => {
    const $rate = document.querySelector("#pitchRate");

    document.querySelector("#pitchPlay").addEventListener("click",
    event => {
      if ($rate.checkValidity()) {
        playSample(sample, $rate.value);
      }
    });
  });

