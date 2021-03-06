const readline=require('readline');
const readlines=require('readline-sync');
const path=require('path');
const fs=require('fs');

class BNode{
    value:string;
    hit:number;
    constructor(value,hit=0){
        this.value=value;
        this.hit=hit;
    }
}

class HashTable{
    table=new Array(size);

    insertTable(company:Array<string>){
        for(let i=0;i<size;i++){
            for(let j=0;j<company[i].length;j++){
                var node=new BNode(company[i][j]);
                if(this.table[i]===undefined){
                    this.table[i]=[node];
                }
                else{
                    var flag=false;
                    for(let k=0;k<this.table[i].length;k++){
                        if(this.table[i][k]===company[i][j]){
                            flag=true;
                            break;
                        }
                    }
                    if(flag===false){
                        this.table[i].push(node);
                    }
                }
            }
        }
    }

    research(arr:Array<string>){
        var str:string='';
        for(let j=0;j<arr.length;j++){
            str+=arr[j];
            str+=' ';
        }
        var len=str.length;
        str=str.substring(0,len-1);
        for(let i=0;i<this.table.length;i++){
            for(let j=0;j<this.table[i].length;j++){
                if(this.table[i][j].value===str){
                    this.table[i][0].hit++;
                }
            }
        }
    }
}

class LNode{
    key=new Map();
    end=false;
    setEnd(){
        this.end=true;
    }
    isEnd(){
        return this.end;
    }
}

class Trie{
    root=new LNode();

    insertTrie(input:Array<string>,node=this.root){
        if(input.length===0){
            node.end=true;
            return;
        }
        else if(!node.key.has(input[0])){
            node.key.set(input[0],new LNode());
            var temp=input[0];
            input.splice(0,1);
            this.insertTrie(input,node.key.get(temp));
        }
        else{
            var temp=input[0];
            input.splice(0,1);
            this.insertTrie(input,node.key.get(temp));
        }
    }

    isWord(word:Array<string>){
        var node=this.root;
        var word1=new Array();
        for(let i=0;i<word.length;i++){
            word1[i]=word[i];
        }
        while(word1.length>1){
            if(!node.key.has(word1[0])){
                return false;
            }
            else{
                node=node.key.get(word1[0]);
                word1.splice(0,1);
            }
        }
        //return ((node.key.has(word)&&(node.key.get(word).end))? true:false);
        if(node.key.get(word1[0])===undefined){
            return false;
        }
        var arr=[];
        arr.push((node.key.has(word1[0])? true:false));
        arr.push((node.key.get(word1[0]).end));
        return arr;
    }
}

var file1:string=fs.readFileSync('companies.dat','utf8','r+');
var file2=file1.replace(/\r/g,'');
var file=file2.split('\n');
//console.log(file);
var company=[];
for(let i=0;i<file.length;i++){
    company[i]=file[i].split('\t');
}
var maxcompanylen=-1;
var company_primary_name=new Array(company.length);
for(let i=0;i<company.length;i++){
    company_primary_name[i]=company[i][0];
    if(company_primary_name[i].length>maxcompanylen){
        maxcompanylen=company_primary_name[i].length;
    }
}
var size=company.length;
var str='';
for(let i=0;i<size;i++){
    for(let j=0;j<company[i].length;j++){
        for(let k=0;k<company[i][j].length;k++){
            if(((company[i][j][k].charCodeAt()>=65)&&(company[i][j][k].charCodeAt()<=90))||((company[i][j][k].charCodeAt()>=97)&&(company[i][j][k].charCodeAt()<=122))||((company[i][j][k].charCodeAt()>=48)&&(company[i][j][k].charCodeAt()<=57))||(company[i][j][k].charCodeAt()===32)){
                str+=company[i][j][k];
            }
            else if(k!==company[i][j].length-1){
                str+=' ';
            }
        }
        company[i][j]=str;
        str='';
    }
}
console.log(company);

var hashtable=new HashTable();
hashtable.insertTable(company);
// hashtable.research('Vdusi');
//console.log(hashtable.table);

//var article:string='';
// do{
//     var sentence=readlines.question('Please input the a news article and keep doing this until you input a line that consists entirely of a period symbol (.): ');
//     article+=sentence+' ';
// }while(sentence!=='.');
//console.log(article);

var article='Hello Verizon World Microsoft Corporation, Inc, And Vdusi you Wireless can Microsoft Apple Inc have a book Apple Inc or an Inc empty Apple bag. I Microsoft Corporation really Apple like Apple Inc the book and Verizon the bag. but Wireless it is too Microsoft Corporation Inc expensive. But could Apple you help me?'
while(true){
    var flag=false;
    article=article.replace(/ and |And | a |A | an |An | the |The | or |Or | but |But /g,' ');
    var arr=article.split(' ');
    for(let i=0;i<arr.length;i++){
        if((arr[i]==='a')||(arr[i]==='A')||(arr[i]==='and')||(arr[i]==='And')||(arr[i]==='An')||(arr[i]==='an')||(arr[i]==='the')||(arr[i]==='The')||(arr[i]==='or')||(arr[i]==='Or')||(arr[i]==='but')||(arr[i]==='But')){
            flag=true;
        }
    }
    if(flag===false){
        break;
    }
}
var test="";
for(let i=0;i<article.length;i++){
    if(((article.charCodeAt(i)>=65)&&(article.charCodeAt(i)<=90))||((article.charCodeAt(i)>=97)&&(article.charCodeAt(i)<=122))||((article.charCodeAt(i)>=48)&&(article.charCodeAt(i)<=57))||(article.charCodeAt(i)===32)){
        test+=article[i];
    }
}
var target=test.split(' ');
for(let i=0;i<target.length;i++){
    if(target[i]===''){
        target.splice(i,1);
        i--;
    }
}
var Total_Words=target.length;

var trie=new Trie();
for(let i=0;i<company.length;i++){
    for(let j=0;j<company[i].length;j++){
        var temp=company[i][j].split(' ');
        trie.insertTrie(temp);
    }
}
//console.log(trie);
// var m=['Microsoft','Corporation','Inc','j'];
// console.log(trie.isWord(m)===false);
//console.log(target);
for(let i=0;i<target.length;i++){
    var result=[];
    result.push(target[i]);
    if(trie.isWord(result)===false){
        continue;
    }
    else{
        if((trie.isWord(result)[0]===true)&&(trie.isWord(result)[1]===false)){
            var j=i+1;
            result.push(target[j]);
            while(true){
                if(trie.isWord(result)===false){
                    break;
                }
                if((trie.isWord(result)[0]===true)&&(trie.isWord(result)[1]===false)){
                    j++;
                    result.push(target[j]);
                }
                else if((trie.isWord(result)[0]===true)&&(trie.isWord(result)[1]===true)){
                    hashtable.research(result);
                    break;
                }
            }
        }
        else if((trie.isWord(result)[0]===true)&&(trie.isWord(result)[1]===true)){
            hashtable.research(result);
        }
    }
}
//console.log(hashtable.table);

var Total_hit_Count=0;
for(let i=0;i<hashtable.table.length;i++){
    Total_hit_Count+=hashtable.table[i][0].hit;
}
// console.log(company);
// console.log(hashtable.table);
var relevance=new Array(company.length);
for(let i=0;i<relevance.length;i++){
    relevance[i]=((hashtable.table[i][0].hit/Total_Words)*100);
    var s=0;
    var temp1=relevance[i];
    while(temp1>1){
        temp1=temp1/10;
        s++;
    }
    switch(s){
        case(0):{
            relevance[i]=relevance[i].toFixed(3);
            break;
        }
        case(1):{
            relevance[i]=relevance[i].toFixed(3);
            break;
        }
        case(2):{
            relevance[i]=relevance[i].toFixed(2);
            break;
        }
        case(3):{
            relevance[i]=relevance[i].toFixed(1);
            break;
        }
    }
    relevance[i]=relevance[i].toString()+'%';
}
var Total_relevance=(Total_hit_Count/Total_Words)*100;
var m=0;
var temp2=Total_relevance;
while(temp2>1){
    temp2=temp2/10;
    m++;
}
switch(m){
    case(0):{
        relevance.push(Total_relevance.toFixed(3));
        break;
    }
    case(1):{
        relevance.push(Total_relevance.toFixed(3));
        break;
    }
    case(2):{
        relevance.push(Total_relevance.toFixed(2));
        break;
    }
    case(3):{
        relevance.push(Total_relevance.toFixed(1));
        break;
    }
}
relevance[relevance.length-1]=relevance[relevance.length-1].toString()+'%';
//console.log(relevance);

var output='';
output+='\n'+'output: ';
output+='\n';
output+='Company'+" ".repeat(maxcompanylen-7+4)+'Hit Count'+'    '+'Relevance'+'\n';
for(let i=0;i<hashtable.table.length;i++){
    output+=company_primary_name[i]+" ".repeat(maxcompanylen-company_primary_name[i].length+4)+hashtable.table[i][0].hit.toString()+" ".repeat(9-hashtable.table[i][0].hit.toString().length+4)+relevance[i];
    output+='\n';
}
output+='Total'+" ".repeat(maxcompanylen-5+4)+Total_hit_Count.toString()+" ".repeat(9-Total_hit_Count.toString().length+4)+relevance[relevance.length-1];
output+='\n';
output+='Total Words'+" ".repeat(maxcompanylen-11+4)+Total_Words.toString();
output+='\n';
console.log(output);




