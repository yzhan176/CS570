const fs = require('fs');

class MinHeap {
  constructor() {
    this.heap = new Array();
  }

  lessThan(arr1, arr2) {
    if (!arr1 || !arr2) {
      return false;
    } else {
      return arr1[0] < arr2[0];
    }
  }

  insert(val) {
    this.heap.push(val);
    this.up(this.heap.length-1);
  }

  up(i) {
    let parentIndex = Math.floor((i-1) / 2);
    if (this.lessThan(this.heap[i], this.heap[parentIndex])) {
      this.swap(i, parentIndex);
      this.up(parentIndex);
    } 
  }

  delete() {
    if (this.heap.length == 1) {
      return this.heap.pop()
    } else if (this.heap.length > 1) {
      let maxVal = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.down(0);
      return maxVal;
    }
  }

  down(i) {
    // Number compare undefined always == false
    let rightLesser = this.lessThan(this.heap[i*2+2], this.heap[i*2+1]);
    let childIndex = rightLesser ? i*2+2 : i*2+1;
        
    if (this.lessThan(this.heap[childIndex], this.heap[i])) {
      this.swap(i, childIndex);
      this.down(childIndex);
    }
  }

  swap(i, j) {
    let tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;
  }

  output() {
    while (this.heap.length > 0) {
      console.log(this.delete());
      // console.log(this.heap);
    }
  }
}

class MaxHeap {
  constructor() {
    this.heap = new Array();
  }

  greaterThan(arr1, arr2) {
    if (!arr1 || !arr2) {
      return false;
    } else {
      return arr1[0] > arr2[0];
    }
  }

  insert(val) {
    this.heap.push(val);
    this.up(this.heap.length-1);
  }

  up(i) {
    let parentIndex = Math.floor((i-1) / 2);
    if (this.greaterThan(this.heap[i], this.heap[parentIndex])) {
      this.swap(i, parentIndex);
      this.up(parentIndex);
    } 
  }

  delete() {
    if (this.heap.length == 1) {
      return this.heap.pop()
    } else if (this.heap.length > 1) {
      let maxVal = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.down(0);
      return maxVal;
    }
  }

  down(i) {
    // Number compare undefined always == false
    let rightBigger = this.greaterThan(this.heap[i*2+2], this.heap[i*2+1]);
    let childIndex = rightBigger ? i*2+2 : i*2+1;
        
    if (this.greaterThan(this.heap[childIndex], this.heap[i])) {
      this.swap(i, childIndex);
      this.down(childIndex);
    }
  }
  swap(i, j) {
    let tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;
  }

  output() {
    let arr = new Array();
    while (this.heap.length > 0) {
      arr.push(this.delete());
      // console.log(this.heap);
    }
    return arr;
  }
}

// Test MinHeap 
// let mh = new MinHeap();
// console.log(mh.lessThan([0.074, 'z' ], [0.095, 'q' ]));
// for (let i=1.1; i<=10; i++) {
//   mh.insert([i, String.fromCharCode(96+i)]);
// }
// console.log(mh.heap);
// mh.output();


class HuffmanNode {
  constructor(left=null, right=null) {
    this.left = left;
    this.right = right;
  }
}

class HuffmanCode {
  constructor() {
    this.code = {};
  }
  
  encoding(node, prefix=''){
    console.log(node[1]);
    if(node[1].left == null && node[1].right == null){
      this.code[node[1]] = prefix;
    } else if(node[1].left !==null && node[1].right == null){
      this.encoding(node[1].left, prefix + '0');
    } else if(node[1].left == null && node[1].right !== null){
      this.encoding(node[1].right, prefix + '1');
    } else{
      this.encoding(node[1].left, prefix + '0');
      this.encoding(node[1].right, prefix + '1');
    }
    return this.code;
  }
}
class passage{
  constructor(fileName){
    this.hash = readfile(fileName);
    this.arr =new Array();
    this.total = 0;
    for (let key in this.hash) {
      this.arr.push([this.hash[key],key]);
      this.total = this.total + this.hash[key];
    }
  }
}
function readfile(fileName){
  if(!fileName)
    fileName = "infile.dat";
  content = fs.readFileSync(fileName, 'utf8');
  content = content.match(/[a-zA-Z0-9]/g);
  let hash ={};
  let fluence ={};
  for (var i = 0; i < content.length; i++) {
    if(content[i] in hash)
      hash[content[i]]++;
    else
      hash[content[i]] = 1;
  }
  return hash;

}

function createHuffmanTree(freq) {
  let minHeap = new MinHeap();
  for (let element of freq) {
    minHeap.insert(element);
  }
   //console.log(minHeap);
  // minHeap.output();
  while (minHeap.heap.length > 1) {
    let left = minHeap.delete();
    let right = minHeap.delete();
    let node = new HuffmanNode(left, right);
    minHeap.insert([left[0]+right[0], node]);
  }
  return minHeap.heap[0];
}

function orderFreq(freq) {
  let maxHeap = new MaxHeap();
  for (let element of freq) {
    maxHeap.insert(element);
  }
  // console.log(maxHeap);
  return maxHeap.output();
}
function out(rows,total){
  let fileName = "outfile.dat"
  let content ="Symbol frequency  \n";
  let totalbit =0;
  for( i of rows) {
    content = content +"  " + i[0] +"     "+(i[1]*100/total).toFixed(5) +"%\n";
    totalbit = totalbit + i[1]* i[2].length;
  }
  content = content +"\n\n\n"+ "Symbol  Huffman Code \n";
  for( i of rows) {
    content = content +"  " + i[0] +"     "+i[2] +"\n";
  }
  content = content +"\n\n\n" + "   Total Bits: " + totalbit;
  fs.writeFileSync(fileName, content, 'utf8');
}

freq = [
  [8.167, 'a'], [1.492, 'b'], [2.782, 'c'], [4.253, 'd'],
  [12.702, 'e'],[2.228, 'f'], [2.015, 'g'], [6.094, 'h'],
  [6.966, 'i'], [0.153, 'j'], [0.747, 'k'], [4.025, 'l'],
  [2.406, 'm'], [6.749, 'n'], [7.507, 'o'], [1.929, 'p'], 
  [0.095, 'q'], [5.987, 'r'], [6.327, 's'], [9.056, 't'], 
  [2.758, 'u'], [1.037, 'v'], [2.365, 'w'], [0.150, 'x'],
  [1.974, 'y'], [0.074, 'z'], [100, '0'], [200, '1'],
  [300, '2'], [400, '3'], [500, '4'], [600, '5'],
  [700, '6'], [800, '7'], [900, '8'], [10, '9']
];
let p = new passage();
freq = p.arr;
let root = createHuffmanTree(freq);
let orderedFreq = orderFreq(freq);
console.log(root.left);
let codeMap = new HuffmanCode().encoding(root);
console.log(codeMap);
let rows = [];
for (let element of orderedFreq) {
  rows.push([element[1], element[0], codeMap[element[1]]]);
}
out(rows,p.total);
// console.log(rows);
// console.log(p);