// global variable
var data;
let sequenceFilenames = Array();
let sequenceObjects = {}
let displayedSequences = Array();
const directoryPath = "scripts/Animations/json/";

// Create a handler for when an option is selected from the dropdown.
document.getElementById("selectSequence").onchange = function () {
  populate(this.value + ".json");
}

// Create a handler when the dropdown is clicked, prompting the list to be populated.
$('#selectSequence').mousedown(function () {
  listSequences();
});


// Update the proper value for the JSON of this sequence, then write the whole JSON string to the server.
function writeSequence(inputObj, sequenceName) {
  sequenceObjects[sequenceName].html.every(element => {
    if (element.name == inputObj.id) {
      element.value = inputObj.value;
      return false;
    }
    return true;
  });

  UpdateJSONFile(JSON.stringify(sequenceObjects[sequenceName]), directoryPath + sequenceName + ".json");
}

// Overwrite the contents of the specified file with the given text.
function UpdateJSONFile(text, name) {
  $.post("writeValue.php", { value: text, fileName: name, fileMode: "w+"},
    function (result) {
      // console.log('File: ' + name + ' updated to: "' + text + '" Response: ' + result);
  })
  .fail(function(xhr) {
    console.log("Error: '" + "writeValue.php" + "': " + xhr.status + " " + xhr.statusText);
  })
};

function listSequences() {
  $.get(directoryPath, { _: new Date().getTime() }, function (result) {
    // console.log(result + "\nRESULT END");
    sequenceFilenames = []
    $(result).find("td > a").each(function () {
      if (openFile($(this).attr("href"))) {
        sequenceFilenames.push($(this).attr("href"));
        }
      });
      console.log(sequenceFilenames);
  })
  .done(function () {
    $('#selectSequence').empty();
    $('#selectSequence').append($("<option>No sequence</option>"));
    let name = "";
    $.each(sequenceFilenames, function (i, p) {
      name = p.substr(0, p.length - 5);
      $('#selectSequence').append($('<option></option>').val(name).html(name));
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

// Create div's for all sequences in the list.
function populateAll() {
  listSequences();
  sequenceFilenames.forEach(fileName => {
    populate(fileName);
  });
}

// Get the contents of the JSON file and display them in their own div.
function populate(fileName) {
  if (!displayedSequences.includes(fileName)) {
    // Use time object to prevent caching.
    $.getJSON(directoryPath + fileName, { _: new Date().getTime() }, function (result) {
      sequenceObjects[result.sequence] = result;
      console.log(result);
      // Create outer container for this sequence.
      $("#sequenceArea").append(`<div id=${result.sequence} class="w3-margin-bottom " style="border: grey; border-style: solid; background-color: lightblue;"></div>`);
      // Create inner buttons.
      $(`#${result.sequence}`).append(`<button class="fa fa-lg fa-close w3-button w3-right w3-padding-small" onclick="CloseSequence('${fileName}', this)"></button>`); // Close
      $(`#${result.sequence}`).append(`<button class="fa fa-lg fa-eye w3-button w3-right w3-padding-small"></button>`); // Hide
      // Create layer button.
      $(`#${result.sequence}`).append(`<div class="w3-left w3-padding-small w3-button" onclick="">
                                        <div class="fa fa-clone w3-padding-small" style="transform: rotate(-135deg); position: absolute;"></div>
                                        <label class="w3-margin-left w3-padding-small">1</label>
                                       </div>`);
      $(`#${result.sequence}`).append(`<h3>${result.displayName}</h3>`);
      $.each(result.html, function (i, item) {
        $(`#${result.sequence}`).append(`<label for=${item.name}>${item.name}</label> `);
        $(`#${result.sequence}`).append(`<input type=${item.element} id=${item.name} value=${item.value} oninput="writeSequence(this, '${result.sequence}')">`);
      })
    })
    .done(function () {
      displayedSequences.push(fileName)
    })
  }
}

// Handles the closing of the sequence element.
function CloseSequence(fileName, obj) {
  let thisIndex = displayedSequences.indexOf(fileName);
  if (thisIndex != -1) {
    // Remove from the array.
    displayedSequences.splice(thisIndex, 1);
    // Remove the property from the container object.
    delete sequenceObjects[obj.parentElement.id];
    // Send "Clear"
    //TODO: Send to the current layer.
    $.post("copyFile.php", { originalName: "Clear.json", source: "scripts/Animations/json/", destination: "transfer/", newName: "LED_Sequence" },
      function (result) {
        console.log(result);
      })
      .fail(function (xhr) {
        console.log("Error: '" + "copyFile.php" + "': " + xhr.status + " " + xhr.statusText);
      })
    // Remove the outer container from the HTML.
    obj.parentElement.remove();
  }
  else {
    console.log(fileName + " is not displayed.")
  }
}
