import { OpenAIStream } from './openai-tiny.js';

document.getElementById('openai_key').addEventListener('blur', function() {
    document.querySelector('#content pre').textContent = this.value;
  });

function get_key() {
    return document.getElementById('openai_key').value;
}

document.getElementById('go').addEventListener('click', function() {
    test();
});

async function test() {
    const client = new OpenAIStream(get_key());
    
    const messages = [
        { role: 'developer', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'testing to see if this is working!' }
    ];

    try {
        const stream = await client.createCompletion(messages);
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