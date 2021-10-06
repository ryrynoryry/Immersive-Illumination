function BufferLoader(obj, urlList, loadFunc = function(){}, firstLoadFunc = function(){}, progressFunc = function(){}) {
  this.obj = obj;
  this.context = obj.audioCtx;
  this.urlList = urlList;
  this.onLoad = loadFunc;
  this.onFirst = firstLoadFunc;
  this.onProgress = progressFunc;
  this.bufferList = obj.buffers;
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onprogress = function (event) {
     loader.onProgress(event, loader.urlList, index);
    }

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(request.response,
      // Function to call on success
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        // Add this audio data to the list for the BufferLoader
        loader.bufferList[index] = buffer;
        // If all of the files have been loaded, call the callback function
        if (++loader.loadCount == loader.urlList.length) {
          loader.onLoad(loader.bufferList, loader.obj);
        }
        else if (loader.loadCount == 1) {
          loader.onFirst(loader.bufferList[index], loader.obj);
        }
      },
      // Function to call on error
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function(func = function(){}, arg1) {
  func(this.urlList, arg1);
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
