// global variables
let patternFilenames = Array();
let jsonObjs = Array(5);
for (var i = 0; i < jsonObjs.length; i++) {
  jsonObjs[i] = {}
}

const directoryPath = "scripts/Animations/json/";

let layerElements = document.querySelectorAll(".layer");

layerElements.forEach(
  function (elem, i, listObj) {
    // Create a handler when the dropdown is clicked, prompting the list to be populated.

    // Whenever the layer is opened, populate the list and display the active pattern.
    elem.querySelector(".layerCollapse").onclick = function () {
      isOpened = ToggleLayerArea(this);
      if (isOpened) {
        ListPatterns(elem.querySelector(".layerArea > select"));
        Populate("ledlayers/layer" + i + ".json", i + 1, false);
      }
    }

    // Populate div with selected pattern, clearing what was previously there.
    elem.querySelector(".layerArea > select").onchange = function () {
      let filename = this.value;
      // If "None" is selected, send Clear since None is not a pattern.
      if (this.value == "None") {
        filename = "Clear"
      }

      Populate(directoryPath + filename + ".json", i + 1, true);
    }

    // Refresh the list and repopulate the div with the active pattern.
    elem.querySelector(".layerArea > .layerRefresh").onclick = function () {
      ListPatterns(elem.querySelector(".layerArea > select"));
      Populate("ledlayers/layer" + i + ".json", i + 1, false);
    }
  }
);

document.querySelector("#lights > .clearAll").onclick = function () {
  for (let l = 0; l < 5; l++) {
    ClosePattern(layerElements[l].querySelector(".layerArea > .layerPatterns > div > button"),
      l, true);
  }
}

// Update the proper value for the JSON of this pattern, then write the whole JSON string to the server.
function WritePattern(inputObj, patternName, layer) {
  jsonObjs[layer - 1].layer = layer - 1
  jsonObjs[layer - 1].html.every(element => {
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
  UpdateJSONFile(JSON.stringify(jsonObjs[layer - 1], null, 2), patternName + ".json", layer - 1, CopyJSONFileToLayer);
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

function ListPatterns(selectObj) {
  $.get(directoryPath, { _: new Date().getTime() }, function (result) {
    patternFilenames = []
    // Get each filename in the directory.
    $(result).find("td > a").each(function () {
      if (openFile($(this).attr("href"))) {
        patternFilenames.push($(this).attr("href"));
        }
      });
  })
  .done(function () {
    // Request successful. Reset the list options.
    var i, L = selectObj.options.length - 1;
    for (i = L; i >= 0; i--) {
      selectObj.remove(i);
    }

    // Create the default option.
    var noneOption = document.createElement("option");
    noneOption.value = "None";
    noneOption.text = "None";
    selectObj.add(noneOption);

    // Create the other options.
    let name = "";
    $.each(patternFilenames, function (i, p) {
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
function Populate(fileName, layer, doUpdate) {
  var patternName = "";
  // Use time object to prevent caching.
  $.getJSON(fileName, { _: new Date().getTime() }, function (result) {

    // Remove the current div.
    ClosePattern(layerElements[layer - 1].querySelector(".layerArea > .layerPatterns > div > button"),
                  layer - 1, false);

    // Update the current patterns.
    patternName = result.sequence;
    jsonObjs[layer - 1] = result;

    if (patternName != "Clear") {
      // Create outer container for this pattern.
      $(`#layer${layer} > .layerArea > .layerPatterns`).append(`<div class="${patternName} w3-margin-bottom " style="border: grey; border-style: solid; background-color: lightblue;"></div>`);
      // Create inner buttons.
      $(`#layer${layer} > .layerArea > .layerPatterns > .${patternName}`).append(`<button class="fa fa-lg fa-close w3-button w3-right w3-padding-small" onclick="CheckAndClose('${patternName}', this, ${layer - 1}, true)"></button>`); // Close
      // $(`#layer${layer} > .layerArea > .layerPatterns > .${patternName}`).append(`<button class="fa fa-lg fa-eye w3-button w3-right w3-padding-small"></button>`); // Hide
      // Create layer button.
      $(`#layer${layer} > .layerArea > .layerPatterns > .${patternName}`).append(`<div class="w3-left w3-padding-small">
                                                                                    <div class="fa fa-clone w3-padding-small" style="transform: rotate(-135deg); position: absolute;"></div>
                                                                                    <label class="w3-margin-left w3-padding-small">${layer}</label>
                                                                                  </div>`);
      $(`#layer${layer} > .layerArea > .layerPatterns > .${patternName}`).append(`<h3>${result.displayName}</h3>`);
      $.each(result.html, function (i, item) {
        $(`#layer${layer} > .layerArea > .layerPatterns > .${patternName}`).append(`<label for=${item.name}>${item.name}</label> `);
        $(`#layer${layer} > .layerArea > .layerPatterns > .${patternName}`).append(`<input type=${item.element} id=${item.name} value=${item.value} oninput="WritePattern(this, '${patternName}', ${layer})">`);
      })
    }
  })
  .done(function () {
    if (doUpdate) {
      WritePattern(layerElements[layer - 1].querySelector(".layerArea > .layerPatterns > div > button"),
        patternName, layer);
    }
  })
}

// Compares the current pattern against what is used on the server before closing the element (or refreshing if outdated).
function CheckAndClose(patternName, obj, layer0, doClear) {
  let activePattern = "";
  $.getJSON("ledlayers/layer" + layer0 + ".json", { _: new Date().getTime() }, function (result) {
    activePattern = result.sequence;
    // Close/Clear only if the server's pattern matches the pattern in the HTML.
    if (patternName == activePattern) {
      ClosePattern(obj, layer0, doClear);
    }
    else {
      if (doClear) {
        Populate("ledlayers/layer" + layer0 + ".json", layer0 + 1, false);
      }
    }
  });
}

// Handles the closing of the pattern element.
function ClosePattern(obj, layer0, doClear) {
  // Remove the property from the container object.
  delete jsonObjs[layer0];
  // Send "Clear"
  if (doClear) {
    CopyJSONFileToLayer("Clear.json", layer0);
    layerElements[layer0].querySelector(".layerArea > select").value = "None";
  }
  if (obj != null) {
    // Remove the outer container from the HTML.
    obj.parentElement.remove();
  }
}

function ToggleLayerArea(obj) {
  if (obj.lastChild.classList.contains("fa-angle-down")) {
    // Show area.
    obj.closest(".layer").querySelector(".layerArea").hidden = false;
    obj.lastChild.classList.remove("fa-angle-down");
    obj.lastChild.classList.add("fa-angle-up");
    return true
  }
  else {
    // Hide area.
    obj.closest(".layer").querySelector(".layerArea").hidden = true;
    obj.lastChild.classList.remove("fa-angle-up");
    obj.lastChild.classList.add("fa-angle-down");
    return false
  }
}
