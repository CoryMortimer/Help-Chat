# Help Chat

Help Chat allows visitors of websites to communicate with the people behind the website. For example, a company could add Help Chat to their website to allow visitors to ask questions about their product.

## Installation
This project's only requirement is Docker. You can install Docker [on their website](https://www.docker.com/).

In order to build the frontend component, the settings.json file must first be filled out.

The settings.json file has 2 options
- serverUrl: The url at which the websocket server is present and listening for chat connections
- socketConnectionStrategy: When the frontend should connect to the socket server. As of writing, these strategies exist:
  - onArrival: The frontend should connect to the socket server whenever a user loads the webpage
  - <any_other_string>: The frontend connects to the socket server when the user opens the chat window

  In the root directory, run
  ``` bash
  make run
  ```
A fodler named `dist` will be created in the root directory. Within the dist folder, you will find the `chat.min.js` file. Include this file on any webpage.

## Runing the server
Coming soon
