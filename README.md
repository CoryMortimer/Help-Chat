# Help Chat

Help Chat allows visitors of websites to communicate with the people behind the website. For example, a company could add Help Chat to their website to allow visitors to ask questions about their product.

This project's only requirement is Docker. You can install Docker [from their website](https://www.docker.com/).

## Running the whole system (read here if you don't care about the details)
To generate the frontend javascript file to insert into your website, run
``` bash
make generate
```
a `dist` folder will appear in the root directory. Add the `chat.min.js` file to your webpage. This file will only work if you run everything locally. Refer to the [Building the frontend chat client](#building-the-frontend-chat-client) section to configure for deployment.

In a terminal in the root directory of the project, run
``` bash
make up
```
The responding client website will be run at http://localhost. Use the API key and secret to sign into the website. This can be found by typing the following into the terminal (after `make up` has been run)
``` bash
docker logs helpchat_server_1
```
The name of your service could vary. Check the name of your helpchat server service by running
``` bash
docker ps
```
if the before command did not work.

## Building the frontend chat client
In order to build the frontend component, the `settings.json` file must first be filled out.

The `settings.json` file has 3 options
- serverDomain: The domain at which the websocket server is present and listening for chat connections
  - Example: "http://localhost"
- serverPath: The path on the domain where the socket is present
  - Example: "/socket/client" to access the socket at http://localhost/socket/client
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
socket = io("localhost", {query: {auth: '<auth_field>'}});
```

### Exposed socket ports

The chat websocket client connects to url at /socket/client. Values that the client can listen are:
- message: A message from the company in JSON format
  - from: The name of the person or company who sent the message
  - msg: The contents of the message for the user using the chat

The websocket at /socket/responding gives information about users on the chat. Users must be authenticated to listen to these values. In order to connect with socket.io. Values that a client can listen to are:
- info: A JSON object with
  - respondingClients: The number of responding clients connected to the server
  - connectedToChat: The number of chat clients connected to the server
- message: A JSON object that is a message from a chat client
  - from: The socket ID in which the message is from
  - msg: The message from a user of the chat
  - id: The chat id
- error: A string containing an error message (most likely because of invalid credentials)

### Endpoints
The following http endpoints are available with valid authentication:
- GET /api/chats - Returns a JSON object with the parameter
  - chats: An array of all the chat ids stored in the database
- GET /api/chats?connected=true - Returns a JSON object with the parameter
  - connectedChats: A list of ids that are currently connected to the server
- GET /api/chats/:id - Returns a JSON object with the parameter
  - rows: Contains an array of JSON chat objects chronological order
    - speaker: The speaker of the message
    - message: The message that the speaker sent
- POST /api/chats/:id - Creates a new message for the client at :id. A successful post will notify the chat client at :id via websocket. Required JSON body params:
  - name: The name of the individual sending the message
  - message: The message to be sent to the chat client

## Building the client
In a terminal in the root directory of the project, run
``` bash
make dev
```
This will run a development server at localhost:4200. In order to hit the server endpoints, you must first do
``` bash
make up
make dev
```
The development server has a proxy to the API server that is ran when the `make run` command is launched.

## Todo
- [X] Make database persistent
- [X] Make frontend client
- [ ] Example with a proxy served over https
- [ ] Better authentication
