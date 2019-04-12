//const readline=require('readline-sync');
//const fs=require('fs');
//const path=require('path');
import * as readline from 'readline';
var r1 = readline.createInterface(process.stdin, process.stdout);
var state;
// state=readline.question('start a new game or resume a saved game, which do you want?');
r1.question("start a new game or resume a saved game, which do you want?", state => {
    r1.close();
});
//state = readlines.question('start a new game or resume a saved game, which do you want?');
