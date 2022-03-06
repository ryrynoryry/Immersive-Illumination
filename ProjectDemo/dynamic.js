// global variables
let sequenceFilenames = Array();
let jsonObjs = Array(5);
for (var i = 0; i < jsonObjs.length; i++) {
  jsonObjs[i] = {}
}
let displayedSequences = Array(5);
for (var i = 0; i < displayedSequences.length; i++) {
  displayedSequences[i] = Array();
}

const directoryPath = "scripts/Animations/json/";

let layerElements = document.querySelectorAll(".layer");

layerElements.forEach(
  function (elem, i, listObj) {
    // Create a handler when the dropdown is clicked, prompting the list to be populated.
    $(`#layer${i + 1} > .layerArea > select`).mousedown(function () {
      ListSequences(this);
    });
    
    // Populate div with selected pattern.
    elem.querySelector(".layerArea > select").onchange = function () {
      if (this.value == "None") {
        this.value = "Clear";
      }
      Populate(this.value + ".json", i + 1);
    }
  }
);

// Update the proper value for the JSON of this sequence, then write the whole JSON string to the server.
function WriteSequence(inputObj, sequenceName, layer) {
  jsonObjs[layer - 1][sequenceName].layer = layer - 1
  jsonObjs[layer - 1][sequenceName].html.every(element => {
    if (element.name == inputObj.id) {
      if (inputObj.value != "") {
        element.value = inputObj.value;
      }
      else {
        element.value = '0';
      }
      return false;
    }
    return true;
  });
  UpdateJSONFile(JSON.stringify(jsonObjs[layer - 1][sequenceName]), sequenceName + ".json", layer - 1, CopyJSONFileToLayer);

}

// Overwrite the contents of the specified file with the given text.
function UpdateJSONFile(text, name, layer0, callback) {
  $.post("writeValue.php", { value: text, fileName: directoryPath + name, fileMode: "w+"},
    function (result) {
      console.log('File: ' + name + ' updated to: ' + text);
      callback(name, layer0)
  })
  .fail(function(xhr) {
    console.log("Error: '" + "writeValue.php" + "': " + xhr.status + " " + xhr.statusText);
  })
};

function CopyJSONFileToLayer(name, layer0) {
  $.post("copyFile.php", { originalName: name, source: directoryPath, destination: "ledlayers/", newName: "layer" + layer0 + ".json" },
    function (result) {
      console.log(result);
    }
  )
  .fail(function (xhr) {
    console.log("Error: '" + "copyFile.php" + "': " + xhr.status + " " + xhr.statusText);
  })
}

function ListSequences(selectObj) {
  $.get(directoryPath, { _: new Date().getTime() }, function (result) {
    sequenceFilenames = []
    // Get each filename in the directory.
    $(result).find("td > a").each(function () {
      if (openFile($(this).attr("href"))) {
        sequenceFilenames.push($(this).attr("href"));
        }
      });
  })
  .done(function () {
    // Request successful. Reset the list options.
    var i, L = selectObj.options.length - 1;
    for (i = L; i >= 0; i--) {
      selectObj.remove(i);
    }

    // For some reason, the first option doesnt trigger a change event. Add a blank.
    selectObj.add(document.createElement("option"));

    // Create the default option.
    var noneOption = document.createElement("option");
    noneOption.value = "None";
    noneOption.text = "None";
    selectObj.add(noneOption);

    // Create the other options.
    let name = "";
    $.each(sequenceFilenames, function (i, p) {
      // Remove ".json" from the name
      name = p.substr(0, p.length - 5);
      var opt = document.createElement("option");
      opt.value = name;
      opt.text = name;
      selectObj.add(opt);
    });
  })
}

// Verify that the file is a file and not a directory.
function openFile(file) {
  var extension = file.substr((file.lastIndexOf('.') + 1));
  switch (extension) {
    case 'jpg':
    case 'png':
    case 'gif':   // the alert ended with pdf instead of gif.
    case 'zip':
    case 'rar':
    case 'pdf':
    case 'php':
    case 'doc':
    case 'docx':
    case 'xls':
    case 'xlsx':
    case 'json':
      return true;
    default:
      return false;
  }
};

// Get the contents of the JSON file and display them in their own div.
function Populate(fileName, layer) {
  var sequenceName = "";
  if (!displayedSequences[layer - 1].includes(fileName)) {
    // Use time object to prevent caching.
    $.getJSON(directoryPath + fileName, { _: new Date().getTime() }, function (result) {

      CloseSequence(displayedSequences[layer - 1][0],
                    layerElements[layer - 1].querySelector(".layerArea > .layerPatterns > div > button"),
                    layer - 1, false);

      jsonObjs[layer - 1][result.sequence] = result;
      sequenceName = result.sequence;
      // Create outer container for this sequence.
      $(`#layer${layer} > .layerArea > .layerPatterns`).append(`<div class="${result.sequence} w3-margin-bottom " style="border: grey; border-style: solid; background-color: lightblue;"></div>`);
      // Create inner buttons.
      $(`#layer${layer} > .layerArea > .layerPatterns > .${result.sequence}`).append(`<button class="fa fa-lg fa-close w3-button w3-right w3-padding-small" onclick="CloseSequence('${fileName}', this, ${layer - 1}, true)"></button>`); // Close
      // $(`#layer${layer} > .layerArea > .layerPatterns > .${result.sequence}`).append(`<button class="fa fa-lg fa-eye w3-button w3-right w3-padding-small"></button>`); // Hide
      // Create layer button.
      $(`#layer${layer} > .layerArea > .layerPatterns > .${result.sequence}`).append(`<div class="w3-left w3-padding-small w3-button" onclick="">
                                        <div class="fa fa-clone w3-padding-small" style="transform: rotate(-135deg); position: absolute;"></div>
                                        <label class="w3-margin-left w3-padding-small">${layer}</label>
                                       </div>`);
      $(`#layer${layer} > .layerArea > .layerPatterns > .${result.sequence}`).append(`<h3>${result.displayName}</h3>`);
      $.each(result.html, function (i, item) {
        $(`#layer${layer} > .layerArea > .layerPatterns > .${result.sequence}`).append(`<label for=${item.name}>${item.name}</label> `);
        $(`#layer${layer} > .layerArea > .layerPatterns > .${result.sequence}`).append(`<input type=${item.element} id=${item.name} value=${item.value} oninput="WriteSequence(this, '${result.sequence}', ${layer})">`);
      })
    })
    .done(function () {
      displayedSequences[layer - 1].push(fileName);
      WriteSequence(layerElements[layer - 1].querySelector(".layerArea > .layerPatterns > div > button"),
                    sequenceName, layer);
    })
  }
}

// Handles the closing of the sequence element.
function CloseSequence(fileName, obj, layer0, doClear) {
  let thisIndex = displayedSequences[layer0].indexOf(fileName);
  if (thisIndex != -1) {
    // Remove from the array.
    displayedSequences[layer0].splice(thisIndex, 1);
    // Remove the property from the container object.
    delete jsonObjs[layer0][obj.parentElement.id];
    // Send "Clear"
    if (doClear) {
      CopyJSONFileToLayer("Clear.json", layer0);
    }
    // Remove the outer container from the HTML.
    obj.parentElement.remove();
  }
  else if (displayedSequences[layer0].length > 0) {
    console.log(fileName + " is not displayed.")
  }
}

document.querySelectorAll(".layerCollapse").forEach(btn => {
  btn.onclick = function() {
    ToggleLayerArea(this);
  }
});

function ToggleLayerArea(obj) {
  if (obj.lastChild.classList.contains("fa-angle-down")) {
    // Show area.
    obj.closest(".layer").querySelector(".layerArea").hidden = false;
    obj.lastChild.classList.remove("fa-angle-down");
    obj.lastChild.classList.add("fa-angle-up");
  }
  else {
    // Hide area.
    obj.closest(".layer").querySelector(".layerArea").hidden = true;
    obj.lastChild.classList.remove("fa-angle-up");
    obj.lastChild.classList.add("fa-angle-down");
  }
}
