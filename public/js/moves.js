const moves = {
    // push [y, x];
    rook: {
      validMove(board, org) {
        let possible = [];
        // down
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
          console.log(board[i][org.x].color)
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
        return possible;
      }
    },
    knight: {
      validMove(board, org) {
        let possible = [];
        //t r
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
        return possible;
      }
    },
    bishop: {
      validMove(board, org) {
        let possible = [];
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
        return possible;
      }
    },
    king: {
      validMove(board, org) {
        let possible = [];

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
        return possible
      }
    },
    queen: {
      validMove(board, org) {
        let possible = [];
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
          console.log(board[i][org.x].color)
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
        return possible;
      }
    },
    pawn: {
      validMove(board, org) {
        let possible = [];
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
        return possible;
      }
    }
  }
