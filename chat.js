
// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// Connection object;
var connection;
var msgStatus = "OPEN";
var premsgStatus="OPEN";
var flag=0;
var count=0;
var countLimit=3;
// UI Peer helper methods
function step1 () {
    	frameFade(false, function(){
							$( "#link" ).show(1700);
						});
  // Get audio/video stream
  navigator.getUserMedia({audio: true, video: true}, function(stream){
    // Set your video displays
    $('#my-video').prop('src', URL.createObjectURL(stream));

    window.localStream = stream;
    step2();
  }, function(){ $('#step1-error').show(); });
}

function step2 () {
  $('#step1, #step3').hide();
  $('#step2').show();
}

function step3 (call) {
  // Hang up on an existing call if present
  if (window.existingCall) {
    window.existingCall.close();
  }

  // Wait for stream on the call, then set peer video display
  call.on('stream', function(stream){
    $('#their-video').prop('src', URL.createObjectURL(stream));
  });

  // UI stuff
  window.existingCall = call;
  $('#their-id').text(call.peer);
  call.on('close', step2);
  $('#step1, #step2').hide();
  $('#step3').show();
}


// PeerJS object
// Insert your own key here!
var peer = new Peer({ key: 'lwjd5qra8257b9', debug: 3, config: {'iceServers': [
  { url: 'stun:stun.l.google.com:19302' } // Pass in optional STUN and TURN server for maximum network compatibility
]}});

peer.on('open', function(){
  $('#my-id').text(peer.id);
});

// Receiving a call
peer.on('call', function(call){
  // Answer the call automatically (instead of prompting user) for demo purposes
  call.answer(window.localStream);
  step3(call);
});

// Receiving a data connection
peer.on('connection', function(conn) { 
  connection = conn;
  attachConnListeners();
});

peer.on('error', function(err){
  alert(err.message);
  // Return to step 2 if error occurs
  step2();
});

function attachConnListeners() {
  connection.on('open', function() {
    console.log("CONNECTION OPENEED");
    // Receive messages
    connection.on('data', function(data) {
      //console.log('Received', data);
    });

    // Send messages
    connection.send('Hello!');
  });
}

// Button cick handlers setup
$(function(){
  $('#make-call').click(function(){
    // Initiate a call!
    var id = $('#callto-id').val();
    var call = peer.call(id, window.localStream);
    connection = peer.connect(id);
    attachConnListeners();
    step3(call);
  });

  $('#end-call').click(function(){
    window.existingCall.close();
    step2();
  });

  // Retry if getUserMedia fails
  $('#step1-retry').click(function(){
    $('#step1-error').hide();
    step1();
  });

  // Send message over data connection
  $('#send-data').click(function(){
    var msg = $('#data-msg').val();
    //console.log("sent ");
    connection.send(msg);
  });


  // Start speech
  $('#start-speech').click(function(){
    console.log("starting speech");
    startSpeech();
    $('#start-speech').hide();
  });

  // Start facetracking
  $('#start-tracking').click(function(){
    console.log("starting tracking");
    startTracking();
    $('#start-tracking').hide();
  });

  // Get things started
  step1();
});




// Chrome speech to text
// See github.com/yyx990803/Speech.js for more.
function startSpeech() {

  var speech = new Speech({
      // lang: 'cmn-Hans-CN', // Mandarin Chinese, default is English.
      // all boolean options default to false
      debugging: false, // true, - will console.log all results
      continuous: true, // will not stop after one sentence
      interimResults: true, // trigger events on iterim results
      autoRestart: true, // recommended when using continuous:true
                        // because the API sometimes stops itself
                        // possibly due to network error.
  });

  // simply listen to events
  // chainable API
  speech
      .on('start', function () {
          console.log('started')
      })
      .on('end', function () {
          console.log('ended')
      })
      .on('error', function (event) {
          console.log(event.error)
      })
      .on('interimResult', function (msg) {
      })
      .on('finalResult', function (msg) {
        // if (connection) connection.send(msg);
        console.log("sent: " + msg);
      })
      .start()
}


// CLM Facetracking 
// See github.com/auduno/clmtrackr for more.

function startTracking() {

  var vid = document.getElementById('my-video');
  var overlay = document.getElementById('overlay');
  var overlayCC = overlay.getContext('2d');
  
  var ctrack = new clm.tracker({useWebGL : true});
  ctrack.init(pModel);

  startVideo();

  function startVideo() {

    // start video
    vid.play();
    // start tracking
    ctrack.start(vid);
    // start loop to draw face
    drawLoop();
  }
  
    function sendTrackerData(msg) {
        //console.log("send :"+msg+" flag:"+flag);
        // Send messages
        connection.send(msg);
        //flag++;
    }
        
    function receiveTrackerData() {     
        // Receive messages
        connection.on('data', function(data) { 
            // close
            if (data == "CLOSE") {
                //console.log("recv: CLOSE");   
                frameFade(true, function(){
                $( "#link" ).show(1700);});
            }
            else if (data == "OPEN") {
                // open
                //console.log("recv: OPEN");
                frameFade(false, function(){                    
                $( "#link" ).show(1700);});
            }
        });
    }                  
    
  function drawLoop() {
    requestAnimationFrame(drawLoop);
    overlayCC.clearRect(0, 0, overlay.width, overlay.height);
    //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
    if (ctrack.getCurrentPosition()) {
        ///////////////////////////
        // calculate distance
        // 58,59
        var positions = ctrack.getCurrentPosition();
        var ax1 = positions[58][0].toFixed();
        var ay1 = positions[58][1].toFixed();
    
        var bx1 = positions[59][0].toFixed();
        var by1 = positions[59][1].toFixed();

        // 57,60
        var ax2 = positions[57][0].toFixed();
        var ay2 = positions[57][1].toFixed();
    
        var bx2 = positions[60][0].toFixed();
        var by2 = positions[60][1].toFixed();
    
        // 56,61
        var ax3 = positions[56][0].toFixed();
        var ay3 = positions[56][1].toFixed();
    
        var bx3 = positions[61][0].toFixed();
        var by3 = positions[61][1].toFixed();
        
        //x = Math.abs(ax-bx);
        var y1 = Math.abs(ay1-by1);
        var y2 = Math.abs(ay2-by2);
        var y3 = Math.abs(ay3-by3);
        
        if ((y1>0 && y1<3) && (y2>0 && y2<3) && (y3>0 && y3<3)){
            msgStatus="CLOSE";
             if(premsgStatus!=msgStatus){
                
                 //alert("a");   
                count++;
                //console.log("CLOSE count:"+count);
                if(count>countLimit){
                  //console.log("CLOSE y1=%d, y2=%d, y3=%d", y1, y2, y3);
                  sendTrackerData(msgStatus);
                  premsgStatus=msgStatus;
                  count=0;
                }
               
             }else{
                 count=0;
             }
           
        }else if ((y1>3 && y1<7) && (y2>3 && y2<7) && (y3>3 && y3<7)){
             msgStatus = "OPEN";
            if(premsgStatus!=msgStatus){   
               // alert("b"); 
                 count++;
                 //console.log("OPEN count:"+count);
                 if(count>countLimit){
                   //  console.log("OPEN y1=%d, y2=%d, y3=%d", y1, y2, y3);
                     sendTrackerData(msgStatus);
                     premsgStatus=msgStatus;
                     count=0;
                 }
            }else{
                count=0;
            }
        }   
       
        receiveTrackerData();
        ctrack.draw(overlay);
    }
  }
    
}


