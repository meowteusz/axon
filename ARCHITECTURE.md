## Continue the main coversation thread

1. Get the current message
2. If it is empty, yell at user
3. Else, make the arrow not clickable
4. Apply shadow effect to user message denoting it sent
5. Append a system message to the chat window
6. Call the completion function and stream the reply
7. Remove the .stream_here class to prepare for next reply
