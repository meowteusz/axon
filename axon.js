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
let messages = [];

// Utility Functions
function check_key() {
    let api_key = key_input.value;
    console.log(api_key)

    if (api_key == "test") {
        console.log("dev mode on");
        key_input.style.setProperty("border-bottom-color", "#39FF77");
        gippity.api_key = api_key;
        return true;
    }

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

// Attached to the arrows on user messages ONLY
async function respond(arrow) {
    // Don't do anything unless the key is valid
    if (gippity.api_key == "" || gippity.api_key == "CHANGE_ME") {
        console.error("No API key provided.");
        return false;
    }

    // Mark this arrow's path as taken
    arrow.classList.add("active");
    arrow.onclick = null;

    // Apply sent styling to the textarea
    let textarea = arrow.parentElement.parentElement.querySelector("textarea");
    textarea.classList.add("sent");

    // Get the text from the user message
    let query =
        arrow.parentElement.parentElement.querySelector("textarea").value;

    // Append the user message to the messages array
    messages.push({ role: "user", content: query });

    // Append a blank system response message
    let thread = arrow.parentElement.parentElement.parentElement;
    thread.appendChild(system_message().cloneNode(true));

    // Should only ever be the one element with this class active
    let stream_here = document.querySelector(".stream_here");

    try {
        if (gippity.api_key == "test") {
            stream_here.value = "This is a test response.";
            stream_here.classList.remove("stream_here");
            return true;
        }

        const stream = await gippity.createCompletion(messages);
        let full_response = "";

        for await (const chunk of stream) {
            full_response += chunk;
            stream_here.value = full_response;
        }

        stream_here.classList.remove("stream_here");

        messages.push({ role: "assistant", content: full_response });

        return full_response;
    } catch (error) {
        console.error("Error:", error);
    }
}

// Attached to the arrows on system messages ONLY
function new_message(arrow) {
    // Mark this arrow's path as taken
    arrow.classList.add("active");
    arrow.onclick = null;

    // The parent of the parent of the arrow is
    // the thread in question (be that a tangent
    // or linear thread). This is an invariant.
    let thread = arrow.parentElement.parentElement;

    // Button clicks only ever instantiate a new
    // *user* message. This is another invariant.
    thread.appendChild(user_message().cloneNode(true));
}

// Expose functions to the window object
// lest ye suffer reference errors
window.respond = respond;
window.new_message = new_message;
window.messages = messages;

// Event Listeners
key_input.addEventListener("input", check_key);

// Main
check_key();
