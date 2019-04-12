//const readline=require('readline-sync');
//const fs=require('fs');
//const path=require('path');
import * as readline from 'readline';
import * as readlines from 'readline-sync';
import * as fs from 'fs';
import * as path from 'path';

var r1=readline.createInterface(process.stdin,process.stdout);
var state;
// state=readline.question('start a new game or resume a saved game, which do you want?');
r1.question("start a new game or resume a saved game, which do you want?",state => {
    r1.close();
});

//state = readlines.question('start a new game or resume a saved game, which do you want?');
