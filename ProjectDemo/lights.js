//JS file to control the setting of the lights and select colors

const lightsSection = document.querySelector("#lightsSection");
const colorDiv = lightsSection.querySelector(".color");
const buttonsDiv = lightsSection.querySelector(".buttons");

const selector = colorDiv.querySelector(".selector");
let circle = colorDiv.querySelector(".circle");
let square = colorDiv.querySelector(".square");
selector.oninput = function() {
  circle.style.backgroundColor = selector.value;
}

selector.onchange = function() {
  square.style.backgroundColor = selector.value;
  square.innerHTML = selector.value;
  LightsWriteValue(selector.value, "writeValue.php", "color.txt", "w+");
}

function LightsWriteValue(text, phpFile, fileName, mode) {
  $.ajax({
    type: 'POST',
    url: phpFile,
    data: {value: text, fileName: fileName, fileMode: mode},
    // key value pair created, 'something' is the key, 'foo' is the value
    success: function(result) {
      console.log( '"' + text + '" was successfully sent to the server');
    }
  });
};