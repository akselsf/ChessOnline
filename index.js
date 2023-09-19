const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {
  Server
} = require("socket.io");
const io = new Server(server);

const PORT = 8080;

app.use(express.static('public'));
app.set('port', PORT);
var rooms = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/index.html');
});
io.on('connection', (socket) => {
 // console.log("User connected: " + socket.id);
  socket.on('createroom', (info) => {
    var r;
    rooms.forEach(room => {
      if (room.name == info.name && room.pass == info.pass) {
        r = room;
      }
    })
    if (r == undefined) {
      socket.join(info.name);
      var r = {
        name: info.name,
        pass: info.pass,
        users: [socket.id],
        blackandwhite: {
          white: socket.id,
          black: 0
        },
        turn: 'white',
        board: [
          [{
              type: 'rook',
              color: 'black'
            },
            {
              type: 'knight',
              color: 'black'
            },
            {
              type: 'bishop',
              color: 'black'
            },
            {
              type: 'queen',
              color: 'black'
            },
            {
              type: 'king',
              color: 'black'
            },
            {
              type: 'bishop',
              color: 'black'
            },
            {
              type: 'knight',
              color: 'black'
            },
            {
              type: 'rook',
              color: 'black'
            }
          ],
          [{
              type: 'pawn',
              color: 'black'
            },
            {
              type: 'pawn',
              color: 'black'
            },
            {
              type: 'pawn',
              color: 'black'
            },
            {
              type: 'pawn',
              color: 'black'
            },
            {
              type: 'pawn',
              color: 'black'
            },
            {
              type: 'pawn',
              color: 'black'
            },
            {
              type: 'pawn',
              color: 'black'
            },
            {
              type: 'pawn',
              color: 'black'
            }
          ],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [{
              type: 'pawn',
              color: 'white'
            },
            {
              type: 'pawn',
              color: 'white'
            },
            {
              type: 'pawn',
              color: 'white'
            },
            {
              type: 'pawn',
              color: 'white'
            },
            {
              type: 'pawn',
              color: 'white'
            },
            {
              type: 'pawn',
              color: 'white'
            },
            {
              type: 'pawn',
              color: 'white'
            },
            {
              type: 'pawn',
              color: 'white'
            }
          ],
          [{
              type: 'rook',
              color: 'white'
            },
            {
              type: 'knight',
              color: 'white'
            },
            {
              type: 'bishop',
              color: 'white'
            },
            {
              type: 'king',
              color: 'white'
            },
            {
              type: 'queen',
              color: 'white'
            },
            {
              type: 'bishop',
              color: 'white'
            },
            {
              type: 'knight',
              color: 'white'
            },
            {
              type: 'rook',
              color: 'white'
            }
          ]
        ]
      }
      rooms.push(r);
      io.to(socket.id).emit('createdroom', r);
    } else if (r.users.length == 1) {
      io.to(socket.id).emit("roomcreate_error", "Room already created");
    } else {
      io.to(socket.id).emit("roomcreate_error", "Room is full");
    }
  });

  socket.on('joinroom', (info) => {
    var r;
    rooms.forEach(room => {
      if (room.name == info.name && room.pass == info.pass) {
        r = room;
      }
    });
    if (r == undefined) {
      io.to(socket.id).emit("roomjoin_error", "Room doesnt exist");
    } else if (r.users.length == 1) {
      socket.join(info.name);
      r.users.push(socket.id);
      if (r.blackandwhite.white == 0) {
        r.blackandwhite.white = socket.id;
      } else {
        r.blackandwhite.black = socket.id;
      }
      io.to(socket.id).emit('joinedroom', r);
    } else {

      io.to(socket.id).emit("roomjoin_error", "Room is full");
    }
  })

  socket.on('updateroom_request', (info) => {
    var room;
    rooms.forEach(r => {
      if (r.name == info.name && r.pass == info.pass) {
        room = r;
      }
    })
    if (room) {
      io.to(room.name).emit('updateroom_members', room);
    }
  });


  socket.on('getboard', () => {
    var board;
    var turn;
    rooms.forEach(r => {
      if (r.users.includes(socket.id)) {
        board = r.board;
        turn = r.turn;
      }
    });

    io.to(socket.id).emit('boardrecieved', {board: board, turn: turn});
  })


  socket.on('disconnect', () => {

    rooms.forEach(r => {
      var i = r.users.indexOf(socket.id);
      if (i != -1) {
        r.users.splice(i, 1);
        if (r.blackandwhite.white == socket.id) {
          r.blackandwhite.white = 0;
        } else {
          r.blackandwhite.black = 0;
        }
        if (r.users.length == 0) {
          rooms.splice(rooms.indexOf(r), 1);
        } else {

          io.to(r.name).emit('updateroom_members', r);
        }
      }
    })

  });

  socket.on('chosemove', (positions) => {
    var r = getRoom(socket.id);
    if (r) {
    if ((r.turn == "white" && r.blackandwhite.white == socket.id) || (r.turn == "black" && r.blackandwhite.black == socket.id)) {
      var type = r.board[positions.old.y][positions.old.x].type;
      var available = moves[type].validMove(r.board, positions.old);

      available.forEach(m => {
        if (m[1] == positions.new.x && m[0] == positions.new.y) {
          r.board[positions.new.y][positions.new.x] = r.board[positions.old.y][positions.old.x];
          r.board[positions.old.y][positions.old.x] = 0;
          r.turn = (r.turn == "white") ? "black" : "white";
          
          io.to(r.name).emit('boardrecieved', {board: r.board, turn: r.turn});
          
        }
      })
    }
  }
  })
});

server.listen(PORT, () => {
  console.log('listening on *:'+PORT);
  
});

function getRoom(socketid) {
  var ro;
  rooms.forEach(r => {
    if (r.users.includes(socketid)) {
      ro = r;
    }
  });
  return ro;
}

const moves = {
  // push [y, x];
  rook: {
    validMove(board, org) {
      let possible = [];
      // down
      try {
      for (let i = org.y + 1; i < 8; i++) {
        if (board[i][org.x]) {
          if (board[i][org.x].color != board[org.y][org.x].color) {
            possible.push([i, org.x]);
          }
          break;
        }
        possible.push([i, org.x]);
      }
      // up
      for (let i = org.y - 1; i >= 0; i--) {
        if (board[i][org.x]) {
          if (board[i][org.x].color != board[org.y][org.x].color) {
            possible.push([i, org.x]);
          }
          break;
        }
        possible.push([i, org.x]);
      }
      // right
      for (let j = org.x + 1; j < 8; j++) {
        if (board[org.y][j]) {
          if (board[org.y][j].color != board[org.y][org.x].color) {
            possible.push([org.y, j]);
          }
          break;
        }
        possible.push([org.y, j]);
      }
      // left
      for (let j = org.x - 1; j >= 0; j--) {
        if (board[org.y][j]) {
          if (board[org.y][j].color != board[org.y][org.x].color) {
            possible.push([org.y, j]);
          };
          break;
        }
        possible.push([org.y, j]);
      }
    } catch (e) { 
      
    }
      return possible;
    }
  },
  knight: {
    validMove(board, org) {
      let possible = [];
      //t r
     try{
      if (org.x < 7 && org.y > 1) {
        if (board[org.y - 2][org.x + 1]) {
          if (board[org.y - 2][org.x + 1].color != board[org.y][org.x].color) {
            possible.push([org.y - 2, org.x + 1])
          }
        } else {
          possible.push([org.y - 2, org.x + 1])
        }
      }
      //t l
      if (org.x > 0 && org.y > 1) {
        if (board[org.y - 2][org.x - 1]) {
          if (board[org.y - 2][org.x - 1].color != board[org.y][org.x].color) {
            possible.push([org.y - 2, org.x - 1])
          }
        } else {
          possible.push([org.y - 2, org.x - 1])
        }

      }
      //b r
      if (org.x < 7 && org.y < 6) {
        if (board[org.y + 2][org.x + 1]) {
          if (board[org.y + 2][org.x + 1].color != board[org.y][org.x].color) {
            possible.push([org.y + 2, org.x + 1])
          }
        } else {
          possible.push([org.y + 2, org.x + 1])
        }

      }
      //b l
      if (org.x > 0 && org.y < 6) {
        if (board[org.y + 2][org.x - 1]) {
          if (board[org.y + 2][org.x - 1].color != board[org.y][org.x].color) {
            possible.push([org.y + 2, org.x - 1])
          }
        } else {
          possible.push([org.y + 2, org.x - 1])
        }

      }
      //l t 
      if (org.x > 1 && org.y > 0) {
        if (board[org.y - 1][org.x - 2]) {
          if (board[org.y - 1][org.x - 2].color != board[org.y][org.x].color) {
            possible.push([org.y - 1, org.x - 2])
          }
        } else {
          possible.push([org.y - 1, org.x - 2])
        }

      }
      //l b 
      if (org.x > 1 && org.y < 7) {
        if (board[org.y + 1][org.x - 2]) {
          if (board[org.y + 1][org.x - 2].color != board[org.y][org.x].color) {
            possible.push([org.y + 1, org.x - 2])
          }
        } else {
          possible.push([org.y + 1, org.x - 2])
        }
      }
      //r t 
      if (org.x < 6 && org.y > 0) {

        if (board[org.y - 1][org.x + 2]) {
          if (board[org.y - 1][org.x + 2].color != board[org.y][org.x].color) {
            possible.push([org.y - 1, org.x + 2])
          }
        } else {
          possible.push([org.y - 1, org.x + 2])
        }
      }
      //r b 
      if (org.x < 6 && org.y < 7) {
        if (board[org.y + 1][org.x + 2]) {
          if (board[org.y + 1][org.x + 2].color != board[org.y][org.x].color) {
            possible.push([org.y + 1, org.x + 2])
          }
        } else {
          possible.push([org.y + 1, org.x + 2])
        }

      }
    } catch (e) {
      
      
    }
      return possible;
    }
  },
  bishop: {
    validMove(board, org) {
      let possible = [];
      // d r
      try {
      for (let i = 1; i <= ((org.y > org.x) ? 7 - org.y : 7 - org.x); i++) {
        if (board[org.y + i][org.x + i]) {
          if (board[org.y + i][org.x + i].color != board[org.y][org.x].color) {
            possible.push([org.y + i, org.x + i]);
          };
          break;
        }
        possible.push([org.y + i, org.x + i]);
      }
      // d l
      for (let i = 1; i <= ((7 - org.y < org.x) ? 7 - org.y : org.x); i++) {
        if (board[org.y + i][org.x - i]) {
          if (board[org.y + i][org.x - i].color != board[org.y][org.x].color) {
            possible.push([org.y + i, org.x - i]);
          };
          break;
        }
        possible.push([org.y + i, org.x - i]);
      }
      // u r
      for (let i = 1; i <= ((org.y < 7 - org.x) ? org.y : 7 - org.x); i++) {

        if (board[org.y - i][org.x + i]) {
          if (board[org.y - i][org.x + i].color != board[org.y][org.x].color) {
            possible.push([org.y - i, org.x + i]);
          };
          break;
        }
        possible.push([org.y - i, org.x + i]);
      }
      // u l
      for (let i = 1; i <= ((7 - org.y > 7 - org.x) ? org.y : org.x); i++) {
        if (board[org.y - i][org.x - i]) {
          if (board[org.y - i][org.x - i].color != board[org.y][org.x].color) {
            possible.push([org.y - i, org.x - i]);
          };
          break;
        }
        possible.push([org.y - i, org.x - i]);
      }
    } catch (e) { 
      
    }
      return possible;
    }
  },
  king: {
    validMove(board, org) {
      let possible = [];
      try {

      

      if (org.x > 0) {
        if (board[org.y][org.x - 1]) {
          if (board[org.y][org.x - 1].color != board[org.y][org.x].color) {
            possible.push([org.y, org.x - 1]);
          }
        } else {
          possible.push([org.y, org.x - 1]);
        }
      }
      if (org.x < 7) {
        if (board[org.y][org.x + 1]) {
          if (board[org.y][org.x + 1].color != board[org.y][org.x].color) {
            possible.push([org.y, org.x + 1]);
          }
        } else {
          possible.push([org.y, org.x + 1]);
        }
      }
      if (org.y > 0) {
        if (board[org.y - 1][org.x]) {
          if (board[org.y - 1][org.x].color != board[org.y][org.x].color) {
            possible.push([org.y - 1, org.x]);
          }
        } else {
          possible.push([org.y - 1, org.x]);
        }
      }
      if (org.y < 7) {
        if (board[org.y + 1][org.x]) {
          if (board[org.y + 1][org.x].color != board[org.y][org.x].color) {
            possible.push([org.y + 1, org.x]);
          }
        } else {
          possible.push([org.y + 1, org.x]);
        }
      }
      if (org.x > 0 && org.y > 0) {
        if (board[org.y - 1][org.x - 1]) {
          if (board[org.y - 1][org.x - 1].color != board[org.y][org.x].color) {
            possible.push([org.y - 1, org.x - 1]);
          }
        } else {
          possible.push([org.y - 1, org.x - 1]);
        }
      }
      if (org.x < 7 && org.y < 7) {
        if (board[org.y + 1][org.x + 1]) {
          if (board[org.y + 1][org.x + 1].color != board[org.y][org.x].color) {
            possible.push([org.y + 1, org.x + 1]);
          }
        } else {
          possible.push([org.y + 1, org.x + 1]);
        }
      }
      if (org.x > 0 && org.y < 7) {
        if (board[org.y + 1][org.x - 1]) {
          if (board[org.y + 1][org.x - 1].color != board[org.y][org.x].color) {
            possible.push([org.y + 1, org.x - 1]);
          }
        } else {
          possible.push([org.y + 1, org.x - 1]);
        }
      }
      if (org.x < 7 && org.y > 0) {
        if (board[org.y - 1][org.x + 1]) {
          if (board[org.y - 1][org.x + 1].color != board[org.y][org.x].color) {
            possible.push([org.y - 1, org.x + 1]);
          }
        } else {
          possible.push([org.y - 1, org.x + 1]);
        }
      }
    } catch (e) { 
      
    }
      return possible
    }
  },
  queen: {
    validMove(board, org) {
      let possible = [];

      try {
      // d r
      for (let i = 1; i <= ((org.y > org.x) ? 7 - org.y : 7 - org.x); i++) {
        if (board[org.y + i][org.x + i]) {
          if (board[org.y + i][org.x + i].color != board[org.y][org.x].color) {
            possible.push([org.y + i, org.x + i]);
          };
          break;
        }
        possible.push([org.y + i, org.x + i]);
      }
      // d l
      for (let i = 1; i <= ((7 - org.y < org.x) ? 7 - org.y : org.x); i++) {
        if (board[org.y + i][org.x - i]) {
          if (board[org.y + i][org.x - i].color != board[org.y][org.x].color) {
            possible.push([org.y + i, org.x - i]);
          };
          break;
        }
        possible.push([org.y + i, org.x - i]);
      }
      // u r
      for (let i = 1; i <= ((org.y < 7 - org.x) ? org.y : 7 - org.x); i++) {

        if (board[org.y - i][org.x + i]) {
          if (board[org.y - i][org.x + i].color != board[org.y][org.x].color) {
            possible.push([org.y - i, org.x + i]);
          };
          break;
        }
        possible.push([org.y - i, org.x + i]);
      }
      // u l
      for (let i = 1; i <= ((7 - org.y > 7 - org.x) ? org.y : org.x); i++) {
        if (board[org.y - i][org.x - i]) {
          if (board[org.y - i][org.x - i].color != board[org.y][org.x].color) {
            possible.push([org.y - i, org.x - i]);
          };
          break;
        }
        possible.push([org.y - i, org.x - i]);
      }
      for (let i = org.y + 1; i < 8; i++) {
        if (board[i][org.x]) {
          if (board[i][org.x].color != board[org.y][org.x].color) {
            possible.push([i, org.x]);
          }
          break;
        }
        possible.push([i, org.x]);
      }
      // up
      for (let i = org.y - 1; i >= 0; i--) {
        if (board[i][org.x]) {
          if (board[i][org.x].color != board[org.y][org.x].color) {
            possible.push([i, org.x]);
          }
          break;
        }
        possible.push([i, org.x]);
      }
      // right
      for (let j = org.x + 1; j < 8; j++) {
        if (board[org.y][j]) {
          if (board[org.y][j].color != board[org.y][org.x].color) {
            possible.push([org.y, j]);
          }
          break;
        }
        possible.push([org.y, j]);
      }
      // left
      for (let j = org.x - 1; j >= 0; j--) {
        if (board[org.y][j]) {
          if (board[org.y][j].color != board[org.y][org.x].color) {
            possible.push([org.y, j]);
          };
          break;
        }
        possible.push([org.y, j]);
      }
    } catch (e) { 
      
    }
      return possible;
    }
  },
  pawn: {
    validMove(board, org) {
      let possible = [];
      try {
      if (board[org.y][org.x].color == 'white') {
        if (org.y == 6 && !(board[org.y - 2][org.x]) && !(board[org.y - 1][org.x])) {
          possible.push([org.y - 2, org.x]);
        }
        if (org.y > 0 && !(board[org.y - 1][org.x])) {
          possible.push([org.y - 1, org.x]);
        }
        if (org.x > 0) {
          if (board[org.y - 1][org.x - 1]) {
            if (board[org.y - 1][org.x - 1].color == 'black') {
              possible.push([org.y - 1, org.x - 1]);
            }
          }
        }
        if (org.x < 7) {
          if (board[org.y - 1][org.x + 1]) {
            if (board[org.y - 1][org.x + 1].color == 'black') {
              possible.push([org.y - 1, org.x + 1]);
            }
          }
        }
      } else {
        if (org.y == 1 && !(board[org.y + 2][org.x]) && !(board[org.y + 1][org.x])) {
          possible.push([org.y + 2, org.x]);
        }
        if (org.y < 7 && !(board[org.y + 1][org.x])) {
          possible.push([org.y + 1, org.x]);
        }
        if (org.x > 0) {
          if (board[org.y + 1][org.x - 1]) {
            if (board[org.y + 1][org.x - 1].color == 'white') {
              possible.push([org.y + 1, org.x - 1]);
            }
          }
        }
        if (org.x < 7) {
          if (board[org.y + 1][org.x + 1]) {
            if (board[org.y + 1][org.x + 1].color == 'white') {
              possible.push([org.y + 1, org.x + 1]);
            }
          }
        }
      }
    } catch (e) { 
      
    }
      return possible;
    }
  }
}