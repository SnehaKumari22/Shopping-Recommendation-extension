var imgData = null;
var IsUploadFinished = false;
var success = false;
var info = null;
var token_imgur = null;
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.name == 'background.takeScreenShot.currentView') {
    chrome.tabs.captureVisibleTab(
      null,
      {
        format: request.settings.type.trim(),
        quality: request.settings.quality
      },
      function(dataUrl) {
        openViewPage(dataUrl, request.coords);
        sendResponse({ screenshotUrl: dataUrl });
      }
    );
  }
  // handling Imgur OAuth and Uploading
  else if (request.name == 'msg.imgur.oauth') {
    token_imgur = request.auth_token;
  } else if (request.name == 'msg.imgur.hasToken') {
    var status = {
      hasToken: token_imgur != null,
      token: token_imgur
    };
    sendResponse(status);
    //clear the token from the background script
    token_imgur = null;
  } else {
    console.log(
      sender.tab
        ? 'from a content script:' + sender.tab.url
        : 'from the extension'
    );
  }

  return true;
});

var contentURL = '';
function openViewPage(dataURI, coords) {
  //sendLogMessage("opening URL page..."); 
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // create a blob for writing to a file
  var blob = new Blob([ab], { type: mimeString });

  // come up with file-system size with a little buffer
  var size = blob.size + 1024 / 2;

  // come up with a filename
  var name = contentURL.split('?')[0].split('#')[0];
  if (name) {
    name = name
      .replace(/^https?:\/\//, '')
      .replace(/[^A-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^[_\-]+/, '')
      .replace(/[_\-]+$/, '');
    name = '-' + name;
  } else {
    name = '';
  }
  name = 'screencapture' + name + '-' + Date.now() + '.png';

  function onwriteend() {
    // open the file that now contains the blob
    var filesString =
      'filesystem:chrome-extension://' +
      chrome.i18n.getMessage('@@extension_id') +
      '/temporary/' +
      name;
    var resp1='hiyo'
    // helloo();

    new Promise(function(resolve, reject) {
        setTimeout(() => resolve(1), 100); // (*)
      }).then( function(){return makeRequest(blob)}).then(function(result) { // (***)
        // alert('prom')
        // alert(result)
        setTimeout(() => editory(result), 1000);
        
      }).then(function(result) {
        setTimeout(() => window.open(
      '../editor/editor.html'
    ), 1000);
      }).catch(e => {
        console.log(e);
    });;


       // upload(blob).done(editory)
       // editory("new fata gfkjjkk")
       // var edit_file=chrome.extension.getURL('../editor/editor.html')
       // alert(edit_file)
    
  }

// function helloo() {
    
//     alert('in hello');
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", "http://10.0.0.199:5000/hello", true);
//     xhr.onload = function() {
//         if(this.status = 200) {
//             console.log(this.response);
//             alert(this.response)
//         } else {
//             console.error(xhr);
//         }
//     };
    // xhr.send();
    // create AJAX requests POST with file
    // fetch('http://10.0.0.199:5000/hello')
    // .then(res => {
    //     console.log(res);
    //     alert(res.json())
    // })
    // .then(data => {
    //     console.log(data.json());
    // })
// }



function makeRequest(file) {
    return new Promise(function (resolve, reject) {
        var formdata =  new FormData();
      formdata.append("snap", file);
      var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://group7ebs1-env.eba-8w4zmbhw.us-west-2.elasticbeanstalk.com/upload", true);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
              // alert('suc')
              // alert(this.response)
                resolve(this.response);
            } else {
              // alert('nooo')
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.send(formdata);
        xhr.onerror = function () {
          // alert('aaaaa')
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        
    });
}

function upload(file) {
  // alert('upload')
    var formdata =  new FormData();
    formdata.append("snap", file);
//http://group7ebs1-env.eba-8w4zmbhw.us-west-2.elasticbeanstalk.com/upload
    // create AJAX requests POST with file


    var xhr = new XMLHttpRequest();
    // alert('files')
    xhr.open("POST", "http://10.0.0.199:5000/upload", true);
    xhr.onload = function() {
        if(this.status = 200) {
          // alert(this.response)
          // return 'success'
          return this.response;
          // alert('sucesss')
          //   console.log(this.response);
          //   alert(this.response)
          //   var resp1=this.response
            // resp = this.response.json()
            // alert(resp)
            // alert(this.response)
        } else {
          return 'errorj'
          // alert('un ho')
          //   console.error(xhr);
        }
    };
    xhr.send(formdata);
}

function editory(resp){
  // alert('edit')
  // alert(resp)

 chrome.storage.sync.set({'foo': resp, 'bar': 'hi'}, function() {
      // console.log('Settings saved');
      // alert('saved setting')
   });


}


  function errorHandler() {
    show('uh-oh');
  }

  // create a blob for writing to a file
  window.webkitRequestFileSystem(
    window.TEMPORARY,
    size,
    function(fs) {
      fs.root.getFile(
        name,
        { create: true },
        function(fileEntry) {
          fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = onwriteend;
            fileWriter.write(blob);
          }, errorHandler);
        },
        errorHandler
      );
    },
    errorHandler
  );
  return true;
}
