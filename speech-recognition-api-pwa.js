function toggleSpeechRecognition(){
  if (!window.webkitSpeechRecognition && ! window.SpeechRecognition){
    alert("Your browser does not support the SpeechRecognition API");
  }
  else if (window.transcriptionInProgress){
    window.transcriptionInProgress.stop();
  }
  else {
    let btn = document.getElementById("transcribe-now");
    window.transcriptionInProgress = window.webkitSpeechRecognition ? new webkitSpeechRecognition() : new SpeechRecognition();
    window.transcriptionInProgress.lang = document.getElementById("language-selector").value || "en-US";
    window.transcriptionInProgress.interimResults = true;
    window.transcriptionInProgress.addEventListener("result", function(e){
      document.getElementById("results").innerHTML = e.results[0][0].transcript;
    });
    window.transcriptionInProgress.addEventListener("end", function(e){
       window.transcriptionInProgress = null;
       btn.innerHTML = '<i class="fa fa-circle"></i>Start';
    });
    window.transcriptionInProgress.addEventListener("start", function(e){
       btn.innerHTML = '<i class="fa fa-square"></i>Stop';
    });
    window.transcriptionInProgress.start();
  }
};

function createSelectorForLanguageCodes(){
  //this is not an exhaustive list. Check https://en.wikipedia.org/wiki/IETF_language_tag for all available codes.
  let commonLanguageLocales = ["ar-SA", "bg-BG", "bn-BD", "cs-CZ", "da-DK", "de-DE", "el-GR", "en-AU", "en-CA", "en-GB", "en-IE", "en-NZ", "en-US", "en-ZA", "es-AR", "es-BO", "es-CL", "es-CO", "es-CR", "es-CU", "es-DO", "es-EC", "es-ES", "es-GT", "es-HN", "es-MX", "es-NI", "es-PA", "es-PE", "es-PR", "es-PY", "es-SV", "es-UY", "es-VE", "et-EE", "fa-IR", "fi-FI", "fr-CA", "fr-CH", "fr-BE", "fr-FR", "gu-IN", "hi-IN", "hr-HR", "hu-HU", "id-ID", "it-IT", "ja-JP", "jv-ID", "km-KH", "kn-IN", "ko-KR", "lt-LT", "lv-LV", "ml-IN", "mr-IN", "mt-MT", "my-MM", "nl-NL", "no-NO", "or-IN", "pa-IN", "pl-PL", "pt-BR", "ro-RO", "ru-RU", "sk-SK", "sl-SI", "sr-RS", "sv-SE", "ta-IN", "te-IN", "th-TH", "tr-TR", "uk-UA", "ur-PK", "vi-VN", "zh-CN", "zh-TW"];
  let container = document.getElementById("language-selector");
  commonLanguageLocales.forEach(function(code){
     let opt = document.createElement("option");
     opt.innerHTML = code;
     opt.setAttribute("value", code);
     container.appendChild(opt);
  });
};

window.addEventListener("load", createSelectorForLanguageCodes);
