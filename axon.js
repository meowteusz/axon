import { OpenAIStream } from "./openai-tiny.js";

// Grab references to important DOM components
const key_input = document.getElementById("apikey_input");
const chat_window = document.getElementById("chat");

// Grab references to the templates. Storing these as functions means we're not
// writing huge structs to memory. Instead, they get fetched when needed and
// promptly go out of scope when their initiator function returns.
const user_message =
    () => (document.getElementById("user_message_template").content);
const system_message =
    () => (document.getElementById("system_message_template").content);

// Instantiate main objects
const gippity = new OpenAIStream();

// Utility Functions
function check_key() {
    let api_key = key_input.value;

    if (api_key.length == 0) {
        console.error("No API key provided.");
        key_input.style.setProperty("border-bottom-color", "#DADADA");
        return false;
    }

    if (!api_key.startsWith("sk-proj-")) {
        console.error("Invalid API key provided.");
        key_input.style.setProperty("border-bottom-color", "#CB444A");
        return false;
    }

    if (api_key.length < 50) {
        console.error(
            "API key too short. Did you accidentally paste the project key?",
        );
        key_input.style.setProperty("border-bottom-color", "#CB444A");
        return false;
    }

    key_input.style.setProperty("border-bottom-color", "#408558");
    gippity.api_key = api_key;
}

async function mk_completion(query) {
    const messages = [
        { role: "user", content: query },
    ];

    // Should only ever be the one element with this class active
    let stream_here = document.querySelector(".stream_here");

    try {
        const stream = await gippity.createCompletion(messages);
        let full_response = "";

        for await (const chunk of stream) {
            full_response += chunk;
            stream_here.value = full_response;
        }

        stream_here.classList.remove("stream_here");

        return full_response;
    } catch (error) {
        console.error("Error:", error);
    }
}

// Continue the main coversation thread
async function continue_main() {
    let textarea = document.querySelector(".context");
    let context = textarea.value;

    if (context.length == 0) {
        console.error("Write something");
        return false;
    }

    textarea.classList.add("sent");
    document.querySelector(".current").classList.remove("current");
    textarea.classList.remove("context");

    chat_window.appendChild(system_message().cloneNode(true));

    if (context != "test") {
        await mk_completion(context);
    }

    return true;
}

// Expose functions to the window object
// lest ye suffer reference errors
window.continue_main = continue_main;

// Event Listeners
key_input.addEventListener("input", check_key);

// Main
check_key();
