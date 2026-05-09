const chatbox =
document.getElementById("chatbox");

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

const languages = {

    hindi:'hi',
    english:'en',
    french:'fr',
    german:'de',
    spanish:'es',
    japanese:'ja',
    chinese:'zh',
    arabic:'ar',
    korean:'ko',
    russian:'ru'
};



// ADD MESSAGE
function addMessage(text, type){

    const div =
    document.createElement("div");

    div.className =
    type + "-message";

    div.innerHTML = text;

    chatbox.appendChild(div);

    chatbox.scrollTop =
    chatbox.scrollHeight;
}



// SPEAK
function speak(text, lang='en-US'){

    const utterance =
    new SpeechSynthesisUtterance(text);

    utterance.lang = lang;

    speechSynthesis.speak(utterance);
}



// START APP
window.onload = () => {

    setTimeout(()=>{

        speak(
        "Hello. Please speak something."
        );

        listenMessage();

    },1500);
};



// LISTEN USER
function listenMessage(){

    const recognition =
    new SpeechRecognition();

    recognition.lang = 'auto';

    recognition.start();

    addMessage(
    "🎤 Listening...",
    "bot"
    );



    recognition.onresult = (event)=>{

        const text =
        event.results[0][0]
        .transcript;

        addMessage(text,"user");

        askLanguage(text);
    };



    recognition.onerror = ()=>{

        restart();
    };
}



// ASK TARGET LANGUAGE
function askLanguage(originalText){

    const ask =
    "Which language should I translate to?";

    addMessage(ask,"bot");

    speak(ask);

    const recognition2 =
    new SpeechRecognition();

    recognition2.lang='en-US';

    recognition2.start();



    recognition2.onresult = (event)=>{

        const targetLanguage =
        event.results[0][0]
        .transcript
        .toLowerCase();

        addMessage(
        targetLanguage,
        "user"
        );

        translateText(
        originalText,
        targetLanguage
        );
    };



    recognition2.onerror = ()=>{

        restart();
    };
}



// TRANSLATE
async function translateText(
text,
targetLanguage
){

    const targetCode =
    languages[targetLanguage];



    if(!targetCode){

        addMessage(
        "❌ Language not supported",
        "bot"
        );

        speak(
        "Language not supported"
        );

        restart();

        return;
    }



    addMessage(
    "🔄 Translating...",
    "bot"
    );



    try{

        const response =
        await fetch(
        "https://libretranslate.de/translate",
        {

            method:"POST",

            headers:{
              "Content-Type":"application/json"
            },

            body:JSON.stringify({

                q:text,

                source:"auto",

                target:targetCode,

                format:"text"
            })
        });



        const data =
        await response.json();

        const translated =
        data.translatedText;



        addMessage(
        "✅ " + translated,
        "bot"
        );



        speak(
        translated,
        targetCode
        );



        setTimeout(()=>{

            restart();

        },5000);

    }

    catch(error){

        addMessage(
        "Translation Failed",
        "bot"
        );

        restart();
    }
}



// RESTART
function restart(){

    setTimeout(()=>{

        listenMessage();

    },2000);
}