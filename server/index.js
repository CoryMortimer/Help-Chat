const express = require('express');
const app = express();
const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/chat.db');
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {path: '/socket/client'});
const uuidv4 = require('uuid/v4');
const atob = require('atob');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const respondingClientsSocket = require('socket.io')(3001, {path: '/socket/responding'});
const API = '/api'

let connectedChatSockets = {};
let connectedRespondingClientSockets = {};

db.serialize(function () {
  db.run('CREATE TABLE if not exists message (chatID TEXT, speaker TEXT, message TEXT, date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)');
  db.run('CREATE TABLE if not exists apikeys (key TEXT, secret TEXT)');
  db.all('SELECT * FROM apikeys', function(err, rows) {
    if (err) {
      console.log('err', err);
    } else {
      if (!rows.length) {
        const keyPair = createApiKeyAndSecret();
        addAPIKeysToDatabase(keyPair.key, keyPair.secret);
      }
      db.all('SELECT * FROM apikeys', function(err, rows) {
        console.log('apikeys and secret rows', rows);
      });
    }
  });
});

function errorResponse(res, statusCode, msg) {
  return res.status(statusCode).send({error: msg});
}

function createApiKeyAndSecret() {
  return {
    key: uuidv4(),
    secret: uuidv4()
  };
}

function addAPIKeysToDatabase(key, secret) {
  db.prepare('INSERT into apikeys(key, secret) VALUES(?, ?)').run(key, secret);
}

io.on('connection', function(socket) {
  connectedChatSockets[socket.id] = socket;
  respondWithInfo();

  socket.on('disconnect', function () {
    delete connectedChatSockets[socket.id];
    respondWithInfo();
  });

  socket.on('message', function(msg) {
    respondingClientsSocket.emit('message', {from: socket.id, msg: msg, id: socket.id});
    insertNewChat(socket.id, socket.id, msg);
  });
});

function respondWithInfo() {
  respondingClientsSocket.emit('info', {respondingClients: Object.keys(connectedRespondingClientSockets).length, connectedToChat: Object.keys(connectedChatSockets).length});
}
respondingClientsSocket.use(function(socket, next) {
  if (socket.handshake.query && socket.handshake.query.auth) {
    checkAuthorization(socket.handshake.query.auth)
      .then(function() {
        return next();
      })
      .catch(function(e) {
        return next(new Error(e.msg));
      });
  } else {
    return next(new Error('Authentication error'));
  }
})
.on('connection', function(socket) {
  connectedRespondingClientSockets[socket.id] = socket;
  respondWithInfo();

  socket.on('disconnect', function () {
    delete connectedRespondingClientSockets[socket.id];
    respondWithInfo();
  });
});

function checkAuthorization(keyAndSecret) {
  return new Promise(function(resolve, reject) {
    let keySecretSplit = [];
    try {
      keySecretSplit = atob(keyAndSecret).split(':');
    } catch(e) {
      reject({msg: '<auth_field> is in wrong format', code: 401});
    }
    if (keySecretSplit.length) {
      db.prepare('SELECT * FROM apikeys WHERE key=?').all(keySecretSplit[0], function(err, rows) {
        if (err) {
          reject({msg: 'An unexpected error occured', code: 400});
        } else {
          let unauthorizedMsg = 'Unauthorized';
          if (rows.length === 0) {
            reject({msg: unauthorizedMsg, code: 401});
          } else if (rows[0].secret !== keySecretSplit[1]) {
            reject({msg: unauthorizedMsg, code: 401});
          } else {
            resolve();
          }
        }
      });
    }
  });
}

function handleAuthorization(req, res, callback) {
  let authorizationHeader = req.get('authorization');
  let formatErrorMsg = 'Authorization header is in wrong format. Needs to be Authorization: Basic <auth_field>';
  if (!authorizationHeader) {
    return errorResponse(res, 401, formatErrorMsg);
  }
  let authSplit = authorizationHeader.split('Basic ');
  if (authSplit.length !== 2) {
    return errorResponse(res, 401, formatErrorMsg);
  }
  checkAuthorization(authSplit[1])
    .then(function() {
      callback();
    })
    .catch(function(e) {
      return errorResponse(res, e.code, e.msg);
    });
}

app.get(API + '/chats', function (req, res) {
  handleAuthorization(req, res, function() {
    let query = req.query
    if (query && query.connected) {
      res.send({'connectedChats': Object.keys(connectedChatSockets)})
    } else {
      db.all('SELECT DISTINCT chatID FROM message', function(err, rows) {
        if (err) {
          return errorResponse(res, 400, 'Unexpected error')
        } else {
          rows = rows.map(r => r.chatID)
          res.send({'chats': rows})
        }
      })
    }
  })
})

app.get(API + '/chats/:id', function (req, res) {
  handleAuthorization(req, res, function() {
    db.prepare('SELECT speaker, message FROM message WHERE chatid=? ORDER BY date(date)').all(req.params.id, function(err, rows) {
      if (err) {
        return errorResponse(res, 400, 'Unexpected error');
      } else {
        if (rows.length) {
          res.send({'rows': rows});
        } else {
          return errorResponse(res, 404, 'Chat does not exist');
        }
      }
    })
  })
});

app.post(API + '/chats/:id', function (req, res) {
  handleAuthorization(req, res, function() {
    let formatMsg = 'Request body must have name and message';
    let socket = connectedChatSockets[req.params.id];
    if (socket) {
      let requestBody = req.body;
      if (requestBody) {
        let name = requestBody.name;
        let message = requestBody.message;
        if (name && message) {
          insertNewChat(socket.id, name, message);
          socket.emit('message', {from: name, msg: message});
          respondingClientsSocket.emit('message', {from: name, msg: message, id: socket.id});
        } else {
          return errorResponse(res, 400, formatMsg);
        }
      } else {
        return errorResponse(res, 400, formatMsg);
      }
    } else {
      return errorResponse(res, 404, 'Chat does not exist or is not connected');
    }
    res.send();
  });
});

httpServer.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

function insertNewChat(chatID, from, msg) {
  var statement = db.prepare('INSERT into message(chatID, speaker, message) VALUES(?, ?, ?)');
  statement.run(chatID, from, msg);
}
