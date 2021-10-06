"use strict";
var alpha = 0,   /// current alpha value
  delta = 0.1;
let THREECAMERA = null;
var calqueMesh, calqueMesh1;
var span,vertical;
// callback: launched if a face is detected or lost
function detect_callback(isDetected) {
  // if (isDetected) {
  //   console.log('INFO in detect_callback(): DETECTED');
  // } else {
  //   console.log('INFO in detect_callback(): LOST');
  // }
}
var frame;
$("#alert").modal({backdrop: 'static', keyboard: false});
// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
  var user = JSON.parse(localStorage.getItem('user'));

  const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);


  // CREATE THE VIDEO BACKGROUND
  function create_mat2d(threeTexture, isTransparent) { //MT216 : we put the creation of the video material in a func because we will also use it for the frame
    return new THREE.RawShaderMaterial({
      depthWrite: false,
      depthTest: false,
      transparent: isTransparent,
      vertexShader: "attribute vec2 position;\n\
        varying vec2 vUV;\n\
        void main(void){\n\
          gl_Position=vec4(position, 0., 1.);\n\
          vUV=0.5+0.5*position;\n\
        }",
      fragmentShader: "precision lowp float;\n\
        uniform sampler2D samplerVideo;\n\
        varying vec2 vUV;\n\
        void main(void){\n\
          gl_FragColor=texture2D(samplerVideo, vUV);\n\
        }",
      uniforms: {
        samplerVideo: { value: threeTexture }
      }
    });
  }
 
  //MT216 : create the frame. We reuse the geometry of the video
  calqueMesh = new THREE.Mesh(threeStuffs.videoMesh.geometry, create_mat2d(new THREE.TextureLoader().load('./images/'+frame), true))
  calqueMesh.renderOrder = 999; // render last
  calqueMesh.frustumCulled = false;
  threeStuffs.scene.add(calqueMesh);
  document.getElementById('click').style.display = "block";
  calqueMesh1 = new THREE.Mesh(threeStuffs.videoMesh.geometry, create_mat2d(new THREE.TextureLoader().load('./images/'+frame), true))
  calqueMesh1.renderOrder = 999; // render last
  calqueMesh1.frustumCulled = false;
  calqueMesh1.visible = false;
  threeStuffs.scene.add(calqueMesh1);

  // CREATE THE CAMERA
  THREECAMERA = JeelizThreeHelper.create_camera();
} // end init_threeScene()


function saveFrame(name){
  frame = name;
  $('#alert').modal('toggle');
  main();
}
function main() {
 
  
  var user = localStorage.getItem("user");
  if(!user){
    alert("you have been sucessfully logged out");
    GoHome();
  }else{

    user = JSON.parse(user);
  
    db.collection("users").doc(user.id)
    .onSnapshot((doc) => {
        if(!doc.data().isLogin){
          localStorage.clear();
          GoHome();
        }
    });
  }
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    callback: function (isError, bestVideoSettings) {
      bestVideoSettings['flipX'] = true;
      init_faceFilter(bestVideoSettings);
    }
  });
  // if (window) {
  //   window.console.log = window.console.warn = window.console.info = function () {
  //     // Don't log anything.
  //   };
  // }
  

}

function init_faceFilter(videoSettings) {
  JEEFACEFILTERAPI.init({
    canvasId: 'jeeFaceFilterCanvas',
    NNCPath: './neuralNets/', // path of NN_DEFAULT.json file
    videoSettings: videoSettings,
    callbackReady: function (errCode, spec) {
      if (errCode) {
        console.log('AN ERROR HAPPENS. error =', errCode);
        document.getElementById("Error").innerText = "We can't find your camera. error ="+ errCode;
        return;
      }
      document.getElementById("Error").innerText = ""
      console.log('INFO: JEEFACEFILTERAPI IS READY');

      init_threeScene(spec);
    }, // end callbackReady()

    // called at each render iteration (drawing loop)
    callbackTrack: function (detectState) {
      JeelizThreeHelper.render(detectState, THREECAMERA);
    } // end callbackTrack()
  }); // end JEEFACEFILTERAPI.init call
} // end main()

function takeshot() {
  var user = localStorage.getItem("user");
  if(!user){
    alert("you have been sucessfully logged out");
    window.close();
  }
  
    var audio = new Audio('cam.mp3');
    audio.play();
    //  document.getElementById("fadeIN").style.opacity = 1;
  calqueMesh.visible = false;
  calqueMesh1.visible = true;
  // document.getElementById("fadeIN").classList.add("fade-in");
  setTimeout(() => {
    var mycanvas = document.getElementById('jeeFaceFilterCanvas');
    // var link = document.createElement("a");
    // link.href = mycanvas.toDataURL('image/png');   //function blocks CORS
     mycanvas.style.display = "none";
    document.getElementById("preview").src = mycanvas.toDataURL('image/png');

     document.getElementById("click").style.display = "none";
      // document.getElementById("text1").style.display = "none";
    document.getElementById("buttons").style.display = "block";
    // link.download = 'screenshot.jpg';
    // link.click();
    calqueMesh.visible = true;
    calqueMesh1.visible = false;
     document.getElementById("fadeIN").style.opacity = 0;
//  mycanvas.width = 1280;
//  mycanvas.height = 720;
//  console.log(mycanvas);
//   var link = document.createElement("a");
//   link.href =mycanvas.toDataURL('image/png');   //function blocks CORS

//   link.download = 'MamieYova.png';
  // link.click();
// download1(mycanvas.toDataURL('image/png'));
// $("#Image").modal();

  }, 1001);
 
 
  

}
function sendmail(img){

  var email = localStorage.getItem('RCEmail');
  const msg="<html><p>Hey!</p><p>Here's your click from Royal Canin Virtual Launch</p><img src="+img+" alt='image' width='500' height='500'><br>To know more about us , please visit us on:<br>Website: http://www.mamieyova.com/ <br>Twitter: http://www.twitter.com/mamieyova <br>Facebook: https://www.facebook.com/mamieyovaindia/ <br>Instagram : https://instagram.com/mamieyova?igshid=1pjeyepss54xk <br> </body></html>"
 
    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function() {
    //      if (this.readyState == 4 && this.status == 200) {
    //          console.log(this.responseText);
    //      }
    // };
    // xhttp.open("POST", "https://www.skilliza.com/php/");
    // // xhttp.setRequestHeader("Content-type", "application/json");
    // xhttp.send(userdata);
    $.ajax({type:'POST',
    url:"https://www.skilliza.com/php/mail/",
    data: JSON.stringify({  
      to: email,
    subject: "Greetings from Royal Canin",
    msg: msg
  }),
    success:function(msg)
    {
      document.getElementById("loader").style.display = "none";
      $("#Image").modal();
       console.log(msg);
    },
    error: function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        alert(msg);
    }  
});
    

}
function download1(f) {
    
  // var link = document.createElement("a");
  // link.href = document.getElementById("preview").src;   //function blocks CORS
  
  // link.download = 'MamieYova.jpg';
  // link.click();
  // return;
  var user = localStorage.getItem("user");
  if(!user){
    alert("you have been sucessfully logged out");
    GoHome();
  }

    document.getElementById("preview").style.display = "none";


    document.getElementById("buttons").style.display = "none";
    document.getElementById("loader").style.display = "block";
    
  var link = document.createElement("a");
  link.href = document.getElementById("preview").src;   //function blocks CORS
  
  link.download = 'KENNAMETAL Photobooth';
  // link.click();

  // console.log("image ", link.href);
  var file = link.href; // use the Blob or File API
 
  
  var user = JSON.parse(localStorage.getItem('user'));
  // var blobUrl=dataURLtoBlob(dataurl);
  // console.log("image", blobUrl);
  const date=new Date();
  const dateString=date.getFullYear()+""+date.getMonth()+""+date.getDate()+""+date.getHours()+""+date.getMinutes()+""+date.getSeconds();
  storage.ref().child("UserImages/" + user.email+"_"+user.name+"_"+dateString + ".jpg").putString(file, 'data_url').then(function (snapshot) {
    console.log('Uploaded a blob or file!', snapshot);
    snapshot.ref.getDownloadURL().then(function (downloadURL) {
      console.log('File available at', downloadURL);
      
     
      db.collection("images").add({
        image: downloadURL,
        email:user.email,
        name:user.name
      })
        .then(function (docRef) {
          if(iOS()){
        
            window.open(downloadURL,"_self");
           
          }else{
            link.click();
            location.reload();
          }
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
        // sendmail(downloadURL);

        // db.collection("usersSession").doc(user.sessionId).update({
        //   image: downloadURL
        // })
        //   .then(function (docRef) {
        //     console.log("Document written with ID: ", docRef);
        //   })
        //   .catch(function (error) {
        //     console.error("Error adding document: ", error);
        //   });
    });
  });

}
$("#Image").on("hidden.bs.modal", function () {
  // put your default event here
  location.reload();
});
function download(dataurl, filename) {
  var a = document.createElement("a");
  a.href = dataurl;
  a.setAttribute("download", filename);
  a.click();

}



var countDownDate = new Date("Dec 17, 2020 12:00:00").getTime();

// // Update the count down every 1 second
// var x = setInterval(function() {

//   // Get today's date and time
//   var now = new Date().getTime();
    
//   // Find the distance between now and the count down date
//   var distance = countDownDate - now;
    
//   // Time calculations for days, hours, minutes and seconds
//   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//   var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 *60 )) + days * 24;
//   var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//   var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
//   // Output the result in an element with id="demo"
// //   document.getElementById("coundown").innerHTML = hours + "h "
// //   + minutes + "m " + seconds + "s ";
//     // document.getElementById("countdownTimer").innerHTML ='<td>'+hours+'</td><td>'+ minutes +'</td><td>'+ seconds +'</td>';
//   // If the count down is over, write some text 
//   if (distance < 0) {
//     clearInterval(x);
//     // document.getElementById("coundown").style.display = "none";
//     // document.getElementById("Liveevent").style.display = "block";
//   }
// }, 1000);

function GoHome(){
  window.open(window.location.origin,"_self");
}
function liveEvent(){
  
  localStorage.setItem('GoToliveEvent',"true");
  var base_url = window.location.origin;
  window.location.href = base_url;
}
if(detectMob){
  applyOrientation()
  // chkScreenMode();
}
function resize(){
  if(detectMob){
    // chkScreenMode();
    applyOrientation()
    
  }
}
span = document.getElementById("span");
vertical = document.getElementById("vertical");

function applyOrientation() {

  if (window.innerHeight > window.innerWidth) {

      setTimeout(() => {
  
        span.style.display = "none";
        vertical.style.display = "block";
         $('#alert').modal('toggle');
      })
  } else {
      setTimeout(() => {
        span.style.display = "block";
        vertical.style.display = "none";
        if(detectMob())
        $("#alert").modal({backdrop: 'static', keyboard: false});
      })
  }

}
// function requestFullScreen(element) {
//   // Supports most browsers and their versions.
//   var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

//   if (requestMethod) { // Native full screen.
//       requestMethod.call(element);
//   } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
//       var wscript = new ActiveXObject("WScript.Shell");
//       if (wscript !== null) {
//           wscript.SendKeys("{F11}");
//       }
//   }
// }
// function chkScreenMode(){
 
//   if(document.fullscreenElement){
//     //fullscreen
//     // this.isFullScreen = true;
//     document.getElementById("fullscreen").display="none";
//   }else{
//     //not in full screen
//     // this.isFullScreen = false;
//     console.log("fullscreen",document.fullscreenElement)
//     document.getElementById("fullscreen").display="block";
//   }
// }
// function openFullscreen(){
// var elem = document.body; // Make the body go full screen.
// requestFullScreen(elem);
// }
function detectMob() {
  const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
  ];

  return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
  });
}

function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}