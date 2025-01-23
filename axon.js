import { OpenAIStream } from "./openai-tiny.js";

// Grab references to important DOM components
const key_input = document.getElementById("openai_key");
const send_button = document.getElementById("send_button");
const chat_window = document.getElementById("chat");

// Grab references to the templates. Storing these as functions means we're not
// writing huge structs to memory. Instead, they get fetched when needed and
// promptly go out of scope when their initiator function returns.
const user_bubble =
    () => (document.getElementById("user_bubble_template").content);
const system_bubble =
    () => (document.getElementById("system_bubble_template").content);

// Instantiate main objects
const gippity = new OpenAIStream();
const api_key = key_input.value;

// Utility Functions
function check_key() {
    if (api_key.length == 0) {
        console.error("No API key provided.");
        return false;
    }

    if (!api_key.startsWith("sk-proj-")) {
        console.error("Invalid API key provided.");
        return false;
    }

    if (api_key.length < 50) {
        console.error(
            "API key too short. Did you accidentally paste the project key?",
        );
        return false;
    }

    gippity.api_key = api_key;
}

async function mk_completion() {
    chat_window.appendChild(system_bubble().cloneNode(true));

    let question =
        send_button.parentElement.parentElement.querySelector("textarea").value;

    const messages = [
        { role: "developer", content: "You are a helpful assistant." },
        { role: "user", content: question },
    ];

    // Should only ever be the one element with this class active
    let stream_here = document.getElementsByClassName("stream_here")[0];

    try {
        const stream = await gippity.createCompletion(messages);
        let full_response = "";

        for await (const chunk of stream) {
            full_response += chunk;
            // Update UI with each chunk
            stream_here.innerText += chunk;
        }

        stream_here.classList.remove("stream_here");

        return full_response;
    } catch (error) {
        console.error("Error:", error);
    }
}

// Event Listeners
key_input.addEventListener("focusout", check_key);
send_button.addEventListener("click", mk_completion);

// Main
check_key();
