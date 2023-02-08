import bot from './assets/bot.svg';
import user from './assets/user.svg';


const form  = document.querySelector('#form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(el)
{
  el.textContent = '';
  loadInterval = setInterval(()=>{
    el.textContent += '.';
    if(el.textContent === '....' ){
      el.textContent = '';
    }
  }, 300);
}


function typeText(el, text){
  let index = 0;
  
  let interval = setInterval(() =>{
    if(index < text.length){
      el.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }

  },20);

}


function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStrip (isAi, value, uniqueId){
  return(
    `
      <div class = "wrapper ${isAi && 'ai'}">
        <div class= "chat">
          <div class ="profile">
              <img src = "${isAi ? bot : user}" alt = "${isAi ? 'bot' : 'user'}"/>
          </div>
          <div class= "message" id = ${uniqueId}> ${value}</div>
        </div>
      </div>
    
    `
  );

}


const handleSbmt = async(e)=>{
  e.preventDefault();
  const data = new FormData(form);

  //  user's chat chatstrip

  chatContainer.innerHTML += chatStrip(false, data.get('prompt'));
  form.reset();

  // bot's chatstripe

  const uniqueId = generateUniqueId();

  chatContainer.innerHTML += chatStrip(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // fetch data from server

  const apiKey = "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";
  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      
    },
    body : JSON.stringify({
      prompt: data.get('prompt')
    }),
  });
  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
    console.log(parsedData);

  }else{
    const err = await response.text();
    messageDiv.innerHTML = 'Something went Wrong';
    alert(err);
  }


}

form.addEventListener('submit', handleSbmt);
form.addEventListener('keyup', (e)=>{
  if(e.keyCode === 13){
    handleSbmt(e);
  }
});