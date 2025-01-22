import { OpenAIStream } from './openai-tiny.js';

function check_key(){
    let key = document.getElementById('openai_key').value;

    if(key.length == 0){
        console.error('No API key provided.');
        return false;
    }

    if(!key.startsWith('sk-proj-')){
        console.error('Invalid API key provided.');
        return false;
    }

    if(key.length < 50){
        console.error('API key too short. Did you accidentally paste the project key?');
        return false;
    }
}

// Basic client declaration; replace key once checks pass
const gippity = new OpenAIStream();

document.getElementById('openai_key').addEventListener('focusout', function() {
    if(check_key()){
        gippity.api_key = document.getElementById('openai_key').value;
    }
  });

async function mk_completion() {
    const messages = [
        { role: 'developer', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'testing to see if this is working!' }
    ];

    try {
        const stream = await gippity.createCompletion(messages);
        let fullResponse = '';
        
        for await (const chunk of stream) {
            fullResponse += chunk;
            // Update UI with each chunk
            console.log('Received chunk:', chunk);
        }
        
        console.log('Full response:', fullResponse);
    } catch (error) {
        console.error('Error:', error);
    }
}