// global variable
var data;
let sequenceFilenames = Array();
let sequenceObjects = {}
let displayedSequences = Array();

// Create a handler for when an option is selected from the dropdown.
document.getElementById("selectSequence").onchange = function () {
  populate(this.value);
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

  UpdateJSONFile(JSON.stringify(sequenceObjects[fileName]), "sequences/" + sequenceName + ".json");
}

// Overwrite the contents of the specified file with the given text.
function UpdateJSONFile(text, name) {
  $.post("writeValue.php", { value: text, fileName: name, fileMode: "w+"},
    function (result) {
      // console.log('File: ' + name + ' updated to: "' + text + '" Response: ' + result);
  })
  .fail(function(xhr) {
    console.log("Error: '" + phpFile + "': " + xhr.status + " " + xhr.statusText);
  })
};

function listSequences() {
  $.get("sequences/", { _: new Date().getTime() }, function (result) {
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
    $.each(sequenceFilenames, function (i, p) {
      $('#selectSequence').append($('<option></option>').val(p).html(p));
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
    $.getJSON("sequences/" + fileName, { _: new Date().getTime() }, function (result) {
      sequenceObjects[result.sequence] = result;
      console.log(result);
      $("#sequenceArea").append(`<div id=${result.sequence}></div>`);
      $(`#${result.sequence}`).append(`<h2>${result.displayName}</h2>`);
      $.each(result.html, function (i, item) {
        $(`#${result.sequence}`).append(`<label for=${item.name}>${item.name}</label>`);
        $(`#${result.sequence}`).append(`<input type=${item.element} id=${item.name} value=${item.value} oninput="writeSequence(this, '${result.sequence}')">`);
      })
    })
    .done(function () {
      displayedSequences.push(fileName)
    })
  }
}