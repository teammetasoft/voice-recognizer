// set up

var language = "en-US";
showInfo("info_start");

var final_transcript = "";
var recognizing = false;
var ignore_onend;
var start_timestamp;

var recognition;

setUp();

function setUp() {
  if (!("webkitSpeechRecognition" in window)) {
    upgrade();
  } else {
    start_button.style.display = "inline-block";
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
      recognizing = true;
      showInfo("info_speak_now");
      start_img.src =
        "//google.com/intl/en/chrome/assets/common/images/content/mic-animate.gif";
    };

    recognition.onerror = function (event) {
      if (event.error == "no-speech") {
        start_img.src =
          "//google.com/intl/en/chrome/assets/common/images/content/mic.gif";
        showInfo("info_no_speech");
        ignore_onend = true;
      }
      if (event.error == "audio-capture") {
        start_img.src =
          "//google.com/intl/en/chrome/assets/common/images/content/mic.gif";
        showInfo("info_no_microphone");
        ignore_onend = true;
      }
      if (event.error == "not-allowed") {
        if (event.timeStamp - start_timestamp < 100) {
          showInfo("info_blocked");
        } else {
          showInfo("info_denied");
        }
        ignore_onend = true;
      }
    };

    recognition.onend = function () {
      recognizing = false;
      if (ignore_onend) {
        return;
      }
      start_img.src =
        "//google.com/intl/en/chrome/assets/common/images/content/mic.gif";
      if (!final_transcript) {
        showInfo("info_start");
        return;
      }
      showInfo("");
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        // range.selectNode(document.getElementById("final_span"));
        window.getSelection().addRange(range);
      }
    };

    recognition.onresult = function (event) {
        var inputElement = document.getElementById('input-search');
      var interim_transcript = "";
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript = event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
    //   final_span.innerHTML = final_transcript;
    //   interim_span.innerHTML = interim_transcript;
      inputElement.placeholder =final_transcript 
      
    };
  }
}

function upgrade() {
  // tell user to upgrade &/or use Chrome
  start_button.style.visibility = "hidden";
  showInfo("info_upgrade");
}

// var two_line = /\n\n/g;
// var one_line = /\n/g;
// function linebreak(s) {
//   return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
// }

// var first_char = /\S/;
// function capitalize(s) {
//   return s.replace(first_char, function(m) { return m.toUpperCase(); });
// }

// start listening right away, so it's completely hands-free
startButton(event);

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = "";
  recognition.lang = language;
  recognition.start();
  ignore_onend = false;
//   final_span.innerHTML = "";
//   interim_span.innerHTML = "";
  start_img.src =
    "//google.com/intl/en/chrome/assets/common/images/content/mic-slash.gif";
  showInfo("info_allow");
  start_timestamp = event.timeStamp;
}

function showInfo(info_id) {
  // try: comment out the contents of this function

  if (info_id) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == info_id ? "inline" : "none";
      }
    }
    info.style.visibility = "visible";
  } else {
    info.style.visibility = "hidden";
  }
}
