// npm install @types/node @types/readline-sync 
var readline = require('readline');
var readlinesync = require('readline-sync');
var path = require('path');
var fs = require('fs');
var board;
var players;
var sizex, sizey;
var round;
var wincount = 3;
var pSymbol = "XOABCDEFGHIJKLMNPQRSTUVWYZ";
//IndexOF
function validcoordinate(x, y) {
    if ((x >= 1) && (x <= sizex) && (y >= 1) && (y <= sizey)) {
        return true;
    }
    else {
        return false;
    }
}
function judgerow(x, y) {
    for (var i = 1; i <= sizex - wincount + 1; i++) {
        var w = true;
        for (var j = 0; j < wincount - 1; j++) {
            if ((board[i + j][y] != board[i + j + 1][y]) || (board[i + j][y] == ' ') || (board[i + j + 1][y] == ' ')) {
                w = false;
                break;
            }
        }
        if (w) {
            displayboard();
            console.log('Player ', board[i][y], ' won1!');
            process.exit(0);
        }
    }
}
function judgecolumn(x, y) {
    for (var i = 1; i < sizey - wincount + 1; i++) {
        var w = true;
        for (var j = 0; j < wincount - 1; j++) {
            if ((board[x][i + j] != board[x][i + j + 1]) || (board[x][i + j] == ' ') || (board[x][i + j + 1] == ' ')) {
                w = false;
                break;
            }
        }
        if (w) {
            displayboard();
            console.log('Player ', board[x][i], ' won2!');
            process.exit(0);
        }
    }
}
function judgecross(x, y) {
    var NE = x + y; //Northeast
    var SE = x - y; //Southeast
    //SW-NE
    for (var i = 1; i <= sizey - wincount + 1; i++) {
        var w = true;
        j = NE - i;
        for (var k = 0; k < wincount - 1; k++) {
            if (validcoordinate(i + k + 1, j - k - 1)) {
                if ((board[i + k][j - k] != board[i + k + 1][j - k - 1]) || (board[i + k][j - k] == ' ') || (board[i + k + 1][j - k - 1] == ' ')) {
                    w = false;
                }
            }
            else {
                w = false;
            }
        }
        if (w) {
            displayboard();
            console.log('Player ', board[x][y], ' won3!');
            process.exit(0);
        }
    }
    //NW-SE
    for (var j = 1; j <= sizey - wincount + 1; j++) {
        var w = true;
        i = SE + j;
        for (var k = 0; k < wincount - 1; k++) {
            if ((validcoordinate(i + k + 1, j + k + 1)) && (validcoordinate(i + k, j + k))) {
                if ((board[i + k][j + k] != board[i + k + 1][j + k + 1]) || (board[i + k][j + k] == ' ') || (board[i + k + 1][j + k + 1] == ' ')) {
                    w = false;
                }
            }
            else {
                w = false;
            }
        }
        if (w) {
            displayboard();
            console.log('Player ', board[x][y], ' won4!');
            process.exit(0);
        }
    }
}
function isfull() {
    for (var i = 1; i <= sizex; i++) {
        for (var j = 1; j <= sizey; j++) {
            if (board[i][j] == ' ') {
                return false;
            }
        }
    }
    return true;
}
function judgewin(row, column, player) {
    judgerow(row, column);
    judgecolumn(row, column);
    judgecross(row, column);
    if (isfull()) {
        displayboard();
        console.log("GAME OVER: DRAW");
        process.exit(0);
    }
}
function cls() {
    process.stdout.write('\033c');
}
function displayboard() {
    //https://stackoverflow.com/questions/9006988/node-js-on-windows-how-to-clear-console
    let line = "";
    for (var i = 1; i <= sizex; i++) {
        line += "  ";
        if (i <= 9) {
            line += " ";
        }
        line += i.toString();
    }
    console.log(line);
    for (var i = 1; i <= sizey; i++) {
        line = i.toString() + " ";
        if (i <= 9) {
            line += " ";
        }
        for (var j = 1; j <= sizex - 1; j++) {
            line += " " + board[j][i] + " |";
        }
        line = line + " " + board[j][i];
        console.log(line);
        if (i != sizey) {
            line = "   ---";
            for (var j = 1; j <= sizex - 1; j++) {
                line += "+---";
            }
            console.log(line);
        }
    }
}
function put(row, column, player) {
    if (board[row][column] != ' ') {
        return false;
    }
    else {
        board[row][column] = pSymbol[player];
        judgewin(row, column, player);
        return true;
    }
}
function ask(x) {
    console.log("Current player is ", pSymbol[x]);
    console.log("Press QUIT to Exit");
    console.log("Press SAVE to Save");
    console.log("Press LOAD to load saved game");
    console.log("Else, Press input the row and column you want to put(eg:2 3 for x2y3)");
    let command = readlinesync.question('What is your next step?');
    //https://www.npmjs.com/package/readline-sync
    switch (command) {
        case "QUIT": {
            process.exit(0);
            break;
        }
        //An example of save file:
        //2
        //3
        //3
        // XO
        //XX 
        // O 
        case "SAVE": {
            var oname = readlinesync.question('What is the filename?');
            //The default flag for writing a file is 'w' :(
            fs.writeFileSync(oname, players.toString() + '\n', { flag: 'w' });
            fs.writeFileSync(oname, sizex.toString() + '\n', { flag: 'a' });
            fs.writeFileSync(oname, sizey.toString() + '\n', { flag: 'a' });
            fs.writeFileSync(oname, wincount.toString() + '\n', { flag: 'a' });
            for (var i = 1; i <= sizey; i++) {
                for (var j = 1; j <= sizex; j++) {
                    fs.writeFileSync(oname, board[j][i], { flag: 'a' });
                }
                fs.writeFileSync(oname, '\n', { flag: 'a' });
            }
            ask(x);
            break;
        }
        //https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
        case "LOAD": {
            let filename = readlinesync.question('What is the filename?');
            var file = fs.readFileSync(filename, 'utf8', 'r+');
            var lines = file.split('\n');
            for (var t = 0; t < lines.length; t++) {
                console.log(lines[t]);
                switch (t) {
                    case (0): {
                        players = parseInt(lines[t]);
                        break;
                    }
                    case (1): {
                        sizex = parseInt(lines[t]);
                        break;
                    }
                    case (2): {
                        sizey = parseInt(lines[t]);
                        break;
                    }
                    case (3): {
                        wincount = parseInt(lines[t]);
                        break;
                    }
                    default: {
                        for (i = 0; i < lines[t].length; i++) {
                            if (!board) {
                                board = [];
                            }
                            if (!board[i + 1]) {
                                board[i + 1] = [];
                            }
                            board[i + 1][t - 3] = lines[t][i];
                        }
                    }
                }
            }
            ;
            ask(x);
            break;
        }
        default: {
            var cmd = command.split(' ');
            var success = put(parseInt(cmd[0]), parseInt(cmd[1]), x);
            if (!success) {
                cls();
                displayboard();
                console.log('Please choose a blank position.');
                ask(x);
            }
            else {
                cls();
                displayboard();
            }
            break;
        }
    }
}
do {
    players = readlinesync.questionInt('How many players?(1-26)');
    if (players > 26) {
        console.log("Too many players.");
    }
} while ((!players) || (players > 26) || (players < 1));
do {
    sizex = readlinesync.questionInt('What is the width of the chessboard?');
} while ((!sizex) || (sizex > 999) || (sizex < 1));
do {
    sizey = readlinesync.questionInt('What is the height of the chessboard?');
} while ((!sizey) || (sizey > 999) || (sizey < 1));
do {
    wincount = readlinesync.questionInt('What the win sequence count should be ?(default:3)');
    if (!wincount) {
        wincount = 3;
        break;
    }
} while ((wincount > 999) || (wincount < 1));
for (var i = 1; i <= sizex; i++) {
    for (var j = 1; j <= sizey; j++) {
        if (!board) {
            board = [];
        }
        if (!board[i]) {
            board[i] = [];
        }
        board[i][j] = " ";
    }
}
cls();
displayboard();
while (true) {
    for (var q = 0; q < players; q++) {
        ask(q);
    }
}
