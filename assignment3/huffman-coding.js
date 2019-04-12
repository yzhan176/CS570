const readline = require('readline');
const readlines = require('readline-sync');
const path = require('path');
const fs = require('fs');
class LNode {
    constructor(value, freq, size) {
        this.value = value;
        this.freq = freq;
        this.size = size;
    }
}
class BNode {
    constructor(data, left, right) {
        this.data = data;
        this.left = left;
        this.right = right;
    }
}
class Minheap {
    constructor() {
        this.arr = [null];
    }
    insertHeap(data) {
        this.arr.push(data);
        var idx = this.arr.length - 1;
        if ((Math.floor(idx)) === 1) {
            return;
        }
        while ((Math.floor(idx / 2)) >= 1) {
            if (this.arr[(Math.floor(idx))].data.freq < this.arr[Math.floor(idx / 2)].data.freq) {
                [this.arr[(Math.floor(idx / 2))], this.arr[(Math.floor(idx))]] = [this.arr[(Math.floor(idx))], this.arr[(Math.floor(idx / 2))]];
            }
            idx = Math.floor(idx / 2);
        }
    }
    remove() {
        if (this.arr.length === 1) {
            return null;
        }
        else if (this.arr.length === 2) {
            var temp = this.arr.splice(1, 1);
            return temp[0];
        }
        else {
            var min = this.arr[1];
            this.arr[1] = this.arr[this.arr.length - 1];
            this.arr.splice(this.arr.length - 1, 1);
            let idx = 1;
            while (true) {
                if ((this.arr[2 * idx] === undefined) && (this.arr[2 * idx + 1] === undefined)) {
                    return min;
                }
                else if (this.arr[2 * idx + 1] === undefined) {
                    if (this.arr[idx].data.freq > this.arr[2 * idx].data.freq) {
                        [this.arr[idx], this.arr[2 * idx]] = [this.arr[2 * idx], this.arr[idx]];
                    }
                    return min;
                }
                else {
                    if (this.arr[idx].data.freq > Math.min(this.arr[2 * idx].data.freq, this.arr[2 * idx + 1].data.freq)) {
                        if (this.arr[2 * idx].data.freq > this.arr[2 * idx + 1].data.freq) {
                            [this.arr[idx], this.arr[2 * idx + 1]] = [this.arr[2 * idx + 1], this.arr[idx]];
                            idx = 2 * idx + 1;
                        }
                        else {
                            [this.arr[idx], this.arr[2 * idx]] = [this.arr[2 * idx], this.arr[idx]];
                            idx = 2 * idx;
                        }
                    }
                    else {
                        return min;
                    }
                }
            }
        }
    }
    isSizeOne() {
        if (this.arr.length === 2) {
            return true;
        }
        else {
            return false;
        }
    }
}
class HuffmanTree {
    isLeaf(data) {
        if ((data.left === null) && (data.right === null)) {
            return true;
        }
        else {
            return false;
        }
    }
    insertHuffT(minheap) {
        while (!minheap.isSizeOne()) {
            var left = minheap.remove();
            var right = minheap.remove();
            var data = new LNode(null, left.data.freq + right.data.freq, size);
            var top = new BNode(data, left, right);
            minheap.insertHeap(top);
        }
        this.root = minheap.remove();
        return this.root;
    }
    HuffmanCode(root, arr, top) {
        if (root.left) {
            arr[top] = 0;
            top++;
            this.HuffmanCode(root.left, arr, top);
            top--;
        }
        if (root.right) {
            arr[top] = 1;
            top++;
            this.HuffmanCode(root.right, arr, top);
            top--;
        }
        if (this.isLeaf(root)) {
            var str1 = "";
            output.push(root.data);
            for (let i = 0; i < top; i++) {
                str1 += arr[i];
            }
            code.push(str1);
        }
    }
}
function TotalBits(output, code) {
    var result = 0;
    for (let i = 0; i < output.length; i++) {
        result += output[i].freq * code[i].length;
    }
    return result;
}
class MaxHeap {
    constructor() {
        this.arr = [null];
    }
    insertHeap(data) {
        this.arr.push(data);
        var idx = this.arr.length - 1;
        if ((Math.floor(idx)) === 1) {
            return;
        }
        while ((Math.floor(idx / 2)) >= 1) {
            if (this.arr[(Math.floor(idx / 2))].freq < this.arr[idx].freq) {
                [this.arr[(Math.floor(idx / 2))], this.arr[idx]] = [this.arr[idx], this.arr[(Math.floor(idx / 2))]];
            }
            idx = Math.floor(idx / 2);
        }
    }
    remove() {
        if (this.arr.length === 1) {
            return null;
        }
        else if (this.arr.length === 2) {
            var temp = this.arr.splice(1, 1);
            return temp[0];
        }
        else {
            var max = this.arr[1];
            this.arr[1] = this.arr[this.arr.length - 1];
            this.arr.splice(this.arr.length - 1, 1);
            let idx = 1;
            while (true) {
                if ((this.arr[2 * idx] === undefined) && (this.arr[2 * idx + 1] === undefined)) {
                    return max;
                }
                else if (this.arr[2 * idx + 1] === undefined) {
                    if (this.arr[idx].freq < this.arr[2 * idx].freq) {
                        [this.arr[idx], this.arr[2 * idx]] = [this.arr[2 * idx], this.arr[idx]];
                    }
                    return max;
                }
                else {
                    if (this.arr[idx].freq < Math.max(this.arr[2 * idx].freq, this.arr[2 * idx + 1].freq)) {
                        if (this.arr[2 * idx].freq > this.arr[2 * idx + 1].freq) {
                            [this.arr[idx], this.arr[2 * idx]] = [this.arr[2 * idx], this.arr[idx]];
                            idx = idx * 2;
                        }
                        else {
                            [this.arr[idx], this.arr[2 * idx + 1]] = [this.arr[2 * idx + 1], this.arr[idx]];
                            idx = idx * 2 + 1;
                        }
                    }
                    else {
                        return max;
                    }
                }
            }
        }
    }
}
var file = fs.readFileSync('infile.dat', 'utf8', 'r+');
var str = '';
for (let i = 0; i < file.length; i++) {
    if (((file.charCodeAt(i) >= 48) && (file.charCodeAt(i) <= 57)) || ((file.charCodeAt(i) >= 65) && (file.charCodeAt(i) <= 90)) || ((file.charCodeAt(i) >= 97) && (file.charCodeAt(i) <= 122))) {
        str += file[i];
    }
}
var symbol = [];
var frequency = [1];
symbol.push(str[0]);
for (let i = 1; i < str.length; i++) {
    var flag = false;
    for (let j = 0; j < symbol.length; j++) {
        if (str[i] === symbol[j]) {
            frequency[j]++;
            flag = true;
        }
    }
    if (flag === false) {
        symbol.push(str[i]);
        frequency.push(1);
    }
}
var size = symbol.length;
var minheap = new Minheap();
for (let i = 0; i < size; i++) {
    var Ldata = new LNode(symbol[i], frequency[i], size);
    var Bdata = new BNode(Ldata, null, null);
    minheap.insertHeap(Bdata);
}
var huffmantree = new HuffmanTree();
//huffmantree.insertHuffT(minheap);
var output = [];
var code = [];
var arr = [];
var start = 0;
huffmantree.HuffmanCode(huffmantree.insertHuffT(minheap), arr, start);
var Totalbit = TotalBits(output, code);
for (let k = 0; k < size; k++) {
    output[k].size = code[k];
}
var result = "\n";
result += '  Final Output\n';
result += '\n';
result += 'Symbol\tfrequency\n';
var maxheap = new MaxHeap();
var Toatlfreq = 0;
for (let i = 0; i < output.length; i++) {
    maxheap.insertHeap(output[i]);
    Toatlfreq += output[i].freq;
}
for (let j = 0; j < output.length; j++) {
    var temp1 = maxheap.remove();
    result += '   ' + temp1.value + '\t' + ' ' + (temp1.freq * 100 / Toatlfreq).toFixed(3).toString() + '%\n';
}
result += '\n';
result += 'Symbol\tHuffman Codes\n';
for (let i = 0; i < output.length; i++) {
    maxheap.insertHeap(output[i]);
}
for (let j = 0; j < output.length; j++) {
    var temp1 = maxheap.remove();
    result += '   ' + temp1.value + '\t' + '   ' + temp1.size + '\n';
}
result += '\n';
result += '   Total Bits: ' + Totalbit.toString() + '\n';
fs.writeFileSync('outfile.dat', result, { flag: 'w' });
