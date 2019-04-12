var readline = require('readline');
var readlines = require('readline-sync');
var path = require('path');
var fs = require('fs');
var BNode = /** @class */ (function () {
    function BNode(value, hit) {
        if (hit === void 0) { hit = 0; }
        this.value = value;
        this.hit = hit;
    }
    return BNode;
}());
var HashTable = /** @class */ (function () {
    function HashTable() {
        this.table = new Array(size);
    }
    HashTable.prototype.insertTable = function (company) {
        for (var i = 0; i < size; i++) {
            for (var j_1 = 0; j_1 < company[i].length; j_1++) {
                var node = new BNode(company[i][j_1]);
                if (this.table[i] === undefined) {
                    this.table[i] = [node];
                }
                else {
                    var flag = false;
                    for (var k = 0; k < this.table[i].length; k++) {
                        if (this.table[i][k] === company[i][j_1]) {
                            flag = true;
                            break;
                        }
                    }
                    if (flag === false) {
                        this.table[i].push(node);
                    }
                }
            }
        }
    };
    HashTable.prototype.research = function (arr) {
        var str = '';
        for (var j_2 = 0; j_2 < arr.length; j_2++) {
            str += arr[j_2];
            str += ' ';
        }
        var len = str.length;
        str = str.substring(0, len - 1);
        for (var i = 0; i < this.table.length; i++) {
            for (var j_3 = 0; j_3 < this.table[i].length; j_3++) {
                if (this.table[i][j_3].value === str) {
                    this.table[i][0].hit++;
                }
            }
        }
    };
    return HashTable;
}());
var LNode = /** @class */ (function () {
    function LNode() {
        this.key = new Map();
        this.end = false;
    }
    LNode.prototype.setEnd = function () {
        this.end = true;
    };
    LNode.prototype.isEnd = function () {
        return this.end;
    };
    return LNode;
}());
var Trie = /** @class */ (function () {
    function Trie() {
        this.root = new LNode();
    }
    Trie.prototype.insertTrie = function (input, node) {
        if (node === void 0) { node = this.root; }
        if (input.length === 0) {
            node.end = true;
            return;
        }
        else if (!node.key.has(input[0])) {
            node.key.set(input[0], new LNode());
            var temp = input[0];
            input.splice(0, 1);
            this.insertTrie(input, node.key.get(temp));
        }
        else {
            var temp = input[0];
            input.splice(0, 1);
            this.insertTrie(input, node.key.get(temp));
        }
    };
    Trie.prototype.isWord = function (word) {
        var node = this.root;
        var word1 = new Array();
        for (var i = 0; i < word.length; i++) {
            word1[i] = word[i];
        }
        while (word1.length > 1) {
            if (!node.key.has(word1[0])) {
                return false;
            }
            else {
                node = node.key.get(word1[0]);
                word1.splice(0, 1);
            }
        }
        //return ((node.key.has(word)&&(node.key.get(word).end))? true:false);
        if (node.key.get(word1[0]) === undefined) {
            return false;
        }
        var arr = [];
        arr.push((node.key.has(word1[0]) ? true : false));
        arr.push((node.key.get(word1[0]).end));
        return arr;
    };
    return Trie;
}());
var file1 = fs.readFileSync('companies.dat', 'utf8', 'r+');
var file2 = file1.replace(/\r/g, '');
var file = file2.split('\n');
//console.log(file);
var company = [];
for (var i = 0; i < file.length; i++) {
    company[i] = file[i].split('\t');
}
var maxcompanylen = -1;
var company_primary_name = new Array(company.length);
for (var i = 0; i < company.length; i++) {
    company_primary_name[i] = company[i][0];
    if (company_primary_name[i].length > maxcompanylen) {
        maxcompanylen = company_primary_name[i].length;
    }
}
var size = company.length;
var str = '';
for (var i = 0; i < size; i++) {
    for (var j_4 = 0; j_4 < company[i].length; j_4++) {
        for (var k = 0; k < company[i][j_4].length; k++) {
            if (((company[i][j_4][k].charCodeAt() >= 65) && (company[i][j_4][k].charCodeAt() <= 90)) || ((company[i][j_4][k].charCodeAt() >= 97) && (company[i][j_4][k].charCodeAt() <= 122)) || ((company[i][j_4][k].charCodeAt() >= 48) && (company[i][j_4][k].charCodeAt() <= 57)) || (company[i][j_4][k].charCodeAt() === 32)) {
                str += company[i][j_4][k];
            }
            else if (k !== company[i][j_4].length - 1) {
                str += ' ';
            }
        }
        company[i][j_4] = str;
        str = '';
    }
}
console.log(company);
var hashtable = new HashTable();
hashtable.insertTable(company);
// hashtable.research('Vdusi');
//console.log(hashtable.table);
//var article:string='';
// do{
//     var sentence=readlines.question('Please input the a news article and keep doing this until you input a line that consists entirely of a period symbol (.): ');
//     article+=sentence+' ';
// }while(sentence!=='.');
//console.log(article);
var article = 'Hello Verizon World Microsoft Corporation, Inc, And Vdusi you Wireless can Microsoft Apple Inc have a book Apple Inc or an Inc empty Apple bag. I Microsoft Corporation really Apple like Apple Inc the book and Verizon the bag. but Wireless it is too Microsoft Corporation Inc expensive. But could Apple you help me?';
while (true) {
    var flag = false;
    article = article.replace(/ and |And | a |A | an |An | the |The | or |Or | but |But /g, ' ');
    var arr = article.split(' ');
    for (var i = 0; i < arr.length; i++) {
        if ((arr[i] === 'a') || (arr[i] === 'A') || (arr[i] === 'and') || (arr[i] === 'And') || (arr[i] === 'An') || (arr[i] === 'an') || (arr[i] === 'the') || (arr[i] === 'The') || (arr[i] === 'or') || (arr[i] === 'Or') || (arr[i] === 'but') || (arr[i] === 'But')) {
            flag = true;
        }
    }
    if (flag === false) {
        break;
    }
}
console.log('article: '+article+'\n');
var test = "";
for (var i = 0; i < article.length; i++) {
    if (((article.charCodeAt(i) >= 65) && (article.charCodeAt(i) <= 90)) || ((article.charCodeAt(i) >= 97) && (article.charCodeAt(i) <= 122)) || ((article.charCodeAt(i) >= 48) && (article.charCodeAt(i) <= 57)) || (article.charCodeAt(i) === 32)) {
        test += article[i];
    }
}
console.log('test: '+test+'\n');
var target = test.split(' ');
for (var i = 0; i < target.length; i++) {
    if (target[i] === '') {
        target.splice(i, 1);
        i--;
    }
}
console.log('target: '+target+'\n');
var Total_Words = target.length;
var trie = new Trie();
for (var i = 0; i < company.length; i++) {
    for (var j_5 = 0; j_5 < company[i].length; j_5++) {
        var temp = company[i][j_5].split(' ');
        trie.insertTrie(temp);
    }
}
//console.log(trie);
// var m=['Microsoft','Corporation','Inc','j'];
// console.log(trie.isWord(m)===false);
//console.log(target);
for (var i = 0; i < target.length; i++) {
    var result = [];
    result.push(target[i]);
    if (trie.isWord(result) === false) {
        continue;
    }
    else {
        if ((trie.isWord(result)[0] === true) && (trie.isWord(result)[1] === false)) {
            var j = i + 1;
            result.push(target[j]);
            while (true) {
                if (trie.isWord(result) === false) {
                    break;
                }
                if ((trie.isWord(result)[0] === true) && (trie.isWord(result)[1] === false)) {
                    j++;
                    result.push(target[j]);
                }
                else if ((trie.isWord(result)[0] === true) && (trie.isWord(result)[1] === true)) {
                    hashtable.research(result);
                    break;
                }
            }
        }
        else if ((trie.isWord(result)[0] === true) && (trie.isWord(result)[1] === true)) {
            hashtable.research(result);
        }
    }
}
//console.log(hashtable.table);
var Total_hit_Count = 0;
for (var i = 0; i < hashtable.table.length; i++) {
    Total_hit_Count += hashtable.table[i][0].hit;
}
// console.log(company);
// console.log(hashtable.table);
var relevance = new Array(company.length);
for (var i = 0; i < relevance.length; i++) {
    relevance[i] = ((hashtable.table[i][0].hit / Total_Words) * 100);
    var s = 0;
    var temp1 = relevance[i];
    while (temp1 > 1) {
        temp1 = temp1 / 10;
        s++;
    }
    switch (s) {
        case (0): {
            relevance[i] = relevance[i].toFixed(3);
            break;
        }
        case (1): {
            relevance[i] = relevance[i].toFixed(3);
            break;
        }
        case (2): {
            relevance[i] = relevance[i].toFixed(2);
            break;
        }
        case (3): {
            relevance[i] = relevance[i].toFixed(1);
            break;
        }
    }
    relevance[i] = relevance[i].toString() + '%';
}
var Total_relevance = (Total_hit_Count / Total_Words) * 100;
var m = 0;
var temp2 = Total_relevance;
while (temp2 > 1) {
    temp2 = temp2 / 10;
    m++;
}
switch (m) {
    case (0): {
        relevance.push(Total_relevance.toFixed(3));
        break;
    }
    case (1): {
        relevance.push(Total_relevance.toFixed(3));
        break;
    }
    case (2): {
        relevance.push(Total_relevance.toFixed(2));
        break;
    }
    case (3): {
        relevance.push(Total_relevance.toFixed(1));
        break;
    }
}
relevance[relevance.length - 1] = relevance[relevance.length - 1].toString() + '%';
//console.log(relevance);
var output = '';
output += '\n' + 'output: ';
output += '\n';
output += 'Company' + " ".repeat(maxcompanylen - 7 + 4) + 'Hit Count' + '    ' + 'Relevance' + '\n';
for (var i = 0; i < hashtable.table.length; i++) {
    output += company_primary_name[i] + " ".repeat(maxcompanylen - company_primary_name[i].length + 4) + hashtable.table[i][0].hit.toString() + " ".repeat(9 - hashtable.table[i][0].hit.toString().length + 4) + relevance[i];
    output += '\n';
}
output += 'Total' + " ".repeat(maxcompanylen - 5 + 4) + Total_hit_Count.toString() + " ".repeat(9 - Total_hit_Count.toString().length + 4) + relevance[relevance.length - 1];
output += '\n';
output += 'Total Words' + " ".repeat(maxcompanylen - 11 + 4) + Total_Words.toString();
output += '\n';
console.log(output);
