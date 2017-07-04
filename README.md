# Help Chat

Help Chat allows visitors of websites to communicate with the people behind the website. For example, a company could add Help Chat to their website to allow visitors to ask questions about their product.

This project's only requirement is Docker. You can install Docker [from their website](https://www.docker.com/).

## Building the frontend chat client
In order to build the frontend component, the `settings.json` file must first be filled out.

The `settings.json` file has 2 options
- serverUrl: The url at which the websocket server is present and listening for chat connections
- socketConnectionStrategy: When the frontend should connect to the socket server. As of writing, these strategies exist:
  - onArrival: The frontend should connect to the socket server whenever a user loads the webpage
  - <any_other_string>: The frontend connects to the socket server when the user opens the chat window

After configuration the `settings.json` file, in the root directory, run
``` bash
make generate
```
A folder named `dist` will be created in the root directory. Within the dist folder, you will find the `chat.min.js` file. Include this file on any webpage.

## Running the server
In a terminal in the root directory of the project, run
``` bash
make run
```

### Authentication

Some endpoints require authentication. Currently, there is one set of API Key and API Secret values. These values are printed to the log when the server is started.

`<auth_field>` will refer to the `base64` encoded value of `<api_key>:<api_secret>`.

To make authenticated http request, attach the header
```
Authorization: Basic <auth_field>
```

To authenticate with the socket server using socket.io:
``` javascript
socket = io("localhost:3001", {query: {auth: '<auth_field>'}});
```

### Exposed socket ports

By default, ports 3000 and 3001 are exposed over http. **Note**: An example with https will be coming soon. The example will use a reverse proxy.

The chat websocket client connects to port 3000. Values that the client can listen are:
- message: A message from the company in JSON format
  - from: The name of the person or company who sent the message
  - msg: The contents of the message for the user using the chat

The websocket on port 3001 gives information about users on the chat. Users must be authenticated to listen to these values. In order to connect with socket.io. Values that a client can listen to are:
- info: A JSON object with
  - respondingClients: The number of responding clients connected to the server
  - connectedToChat: The number of chat clients connected to the server
- message: A JSON object that is a message from a chat client
  - from: The socket ID in which the message is from
  - msg: The message from the chat client
- error: A string containing an error message (most likely because of invalid credentials)

### Endpoints
The following http endpoints are available over the 3000 port with valid authentication:
- GET /chats - Returns a JSON object with the parameter
  - chats: An array of all the chat ids stored in the database
- GET /chats?connected=true - Returns a JSON object with the parameter
  - connectedChats: A list of ids that are currently connected to the server
- GET /chats/:id - Returns a JSON object with the parameter
  - rows: Contains an array of JSON chat objects chronological order
    - speaker: The speaker of the message
    - message: The message that the speaker sent
- POST /chats/:id - Creates a new message for the client at :id. A successful post will notify the chat client at :id via websocket. Required JSON body params:
  - name: The name of the individual sending the message
  - message: The message to be sent to the chat client

## Building the client
Coming soon

## Todo
- [ ] Make database persistent
- [ ] Make frontend client
- [ ] Example with a proxy served over https
- [ ] Better authentication
