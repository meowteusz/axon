# AXON

## What?
Conversations are rarely linear. It is in our nature and best interests to go on tagents. Naturally, a linear chat interface will steer conversation in one direction; going on a tangent feels clunky. Axon aims to provide an interface that more closely mirrors organic conversation flow.

## TODOs
#### Base function that needs to be implemented
- [x] Implement a lightweight version of the OpenAI client (streaming only)
- [x] Converge on a consistent style
- [x] Clean up code into logical blocks
- [x] API key ingest mechanism and module link
- [x] Single question/answer function test
- [x] Make arrows gray initially, black on hover and when the path is chosen
- [x] Remove click functionality from arrows after a path is chosen
- [x] Conversation chain parsing and passing to completion API
- [ ] Programatically create in-thread completions with correct checks
- [ ] Tangent chat interface breakouts
- [ ] Add markdown support to system completion messages
- [ ] Smart expanding text area: 10? lines then scroll

#### Fun TODOs that should get done but aren't crucial to main function
- [ ] Import/Export feature
    - [ ] JSON conversation object store
- [ ] Alternate API key memory storage or functionality
- [ ] Add a model selector (this is just a call to https://api.openai.com/v1/models)