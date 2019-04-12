const readlines = require('readline-sync');
const readline = require('readline');
class ArrayStack {
    constructor() {
        this.arr = [];
    }
    Top() {
        return this.arr[this.arr.length - 1];
    }
    Push(value) {
        this.arr.push(value);
    }
    Pop() {
        this.arr.pop();
    }
    IsEmpty() {
        if (this.arr.length === 0) {
            return true;
        }
        else
            return false;
    }
}
class ArrayQueue {
    constructor() {
        this.arr = [];
    }
    Front() {
        return this.arr[0];
    }
    Enqueue(value) {
        this.arr.push(value);
    }
    Dequeue() {
        this.arr.shift();
    }
    IsEmpty() {
        if (this.arr.length === 0) {
            return true;
        }
        else
            return false;
    }
    outputPostQ(queue) {
        console.log("The output postfix expession is: ");
        var output = "";
        for (let i = 0; i < queue.arr.length; i++) {
            output += queue.arr[i];
            output += "  ";
        }
        console.log(output);
    }
}
function precedence(char) {
    switch (char) {
        case ("("): {
            return 4;
            break;
        }
        case (")"): {
            return 4;
            break;
        }
        case ("^"): {
            return 3;
            break;
        }
        case ("%"): {
            return 2;
            break;
        }
        case ("/"): {
            return 2;
            break;
        }
        case ("*"): {
            return 2;
            break;
        }
        case ("+"): {
            return 1;
            break;
        }
        case ("-"): {
            return 1;
            break;
        }
    }
}
//http://www.w3school.com.cn/jsref/jsref_replace.asp
function conversion(infix_expresssion) {
    var len = infix_expresssion.length;
    var infixQ = new ArrayQueue();
    var opStack = new ArrayStack();
    var postQ = new ArrayQueue();
    var str = "";
    for (let i = 0; i < len; i++) {
        if (infix_expresssion[i] !== " ") {
            str += infix_expresssion[i];
            //infixQ.Enqueue(infix_expresssion[i]);
        }
    }
    str = str.replace(/POW/, "^");
    for (let j = 0; j < str.length; j++) {
        if ((isNaN(Number(str[j]))) && (str[j] !== "(") && (str[j] !== ")") && (str[j] !== "+") && (str[j] !== "-") && (str[j] !== "*") && (str[j] !== "/") && (str[j] !== "%") && (str[j] !== "^") && ((str[j] !== "."))) {
            console.log("The input cannot be valid");
            //process.exit(0);
            ask();
        }
        else {
            infixQ.Enqueue(str[j]);
        }
    }
    var t, t1, temp;
    if (infixQ.Front() === "-") {
        console.log("The input cannot contain negative numbers");
        //process.exit(0);
        ask();
    }
    while (!infixQ.IsEmpty()) {
        t = infixQ.Front();
        infixQ.Dequeue();
        t1 = infixQ.Front();
        if ((t1 === "-") && (isNaN(Number(t))) && (t !== "^")) {
            console.log("The input cannot contain negetive numbers");
            //process.exit(0);
            ask();
        }
        if ((t1 === ".") && (isNaN(Number(t)))) {
            console.log("The input cannot be valid");
            //process.exit(0);
            ask();
        }
        if ((t === "-") && (temp === "^") && (!isNaN(Number(t1)))) {
            t += t1;
            infixQ.Dequeue();
            while (true) {
                if (infixQ.Front() !== undefined) {
                    var t2 = infixQ.Front();
                    if ((t2.charCodeAt(0) >= 48) && (t2.charCodeAt(0) <= 57)) {
                        t += t2;
                        infixQ.Dequeue();
                    }
                    else if (t2 === ".") {
                        t += t2;
                        infixQ.Dequeue();
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            postQ.Enqueue(t);
        }
        else if ((t.charCodeAt(0) >= 48) && (t.charCodeAt(0) <= 57)) {
            while (true) {
                if (infixQ.Front() !== undefined) {
                    var t2 = infixQ.Front();
                    if ((t2.charCodeAt(0) >= 48) && (t2.charCodeAt(0) <= 57)) {
                        t += t2;
                        infixQ.Dequeue();
                    }
                    else if (t2 === ".") {
                        t += t2;
                        infixQ.Dequeue();
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            postQ.Enqueue(t);
            //console.log("t2: ",infixQ.Front());
        }
        else if (opStack.IsEmpty()) {
            opStack.Push(t);
        }
        else if (t === "(") {
            opStack.Push(t);
        }
        else if (t === ")") {
            while (opStack.Top() !== "(") {
                postQ.Enqueue(opStack.Top());
                opStack.Pop();
            }
            opStack.Pop();
        }
        else {
            while ((opStack.IsEmpty() !== true) && (opStack.Top() !== "(") && (precedence(t) <= precedence(opStack.Top()))) {
                postQ.Enqueue(opStack.Top());
                opStack.Pop();
            }
            opStack.Push(t);
        }
        temp = t;
    }
    while (!opStack.IsEmpty()) {
        postQ.Enqueue(opStack.Top());
        opStack.Pop();
    }
    return postQ;
}
//https://blog.csdn.net/lamyuqingcsdn/article/details/51897048
function calculator(postQ) {
    var eval = new ArrayStack();
    var t;
    var topNum, nextNum, answer;
    while (!postQ.IsEmpty()) {
        t = postQ.Front();
        postQ.Dequeue();
        if (!isNaN(Number(t))) {
            eval.Push(Number(t));
        }
        else {
            topNum = eval.Top();
            eval.Pop();
            nextNum = eval.Top();
            eval.Pop();
            switch (t) {
                case ("+"): {
                    answer = nextNum + topNum;
                    break;
                }
                case ("-"): {
                    answer = nextNum - topNum;
                    break;
                }
                case ("*"): {
                    answer = nextNum * topNum;
                    break;
                }
                case ("/"): {
                    if (topNum === 0) {
                        console.log("Divide-by-zero exception, NaN exception");
                        //process.exit(0);
                        ask();
                    }
                    else {
                        answer = nextNum / topNum;
                        break;
                    }
                }
                case ("%"): {
                    if (topNum === 0) {
                        console.log("Modulo-divide-by-zero exception, NaN exception");
                        //process.exit(0);
                        ask();
                    }
                    else {
                        answer = nextNum % topNum;
                        break;
                    }
                }
                //http://www.w3school.com.cn/jsref/jsref_obj_math.asp
                case ("^"): {
                    answer = Math.pow(nextNum, topNum);
                }
            }
            eval.Push(answer);
        }
    }
    return eval.Top();
}
function ask() {
    var infix;
    do {
        infix = readlines.question("Please input the infix expression or press QUIT to exit: ");
        if (infix === "quit") {
            process.exit(0);
        }
        var postfix = new ArrayQueue();
        postfix = conversion(infix);
        postfix.outputPostQ(postfix);
        var result;
        //console.log(postfix);
        //http://www.w3school.com.cn/js/jsref_tofixed.asp
        result = calculator(postfix);
        console.log("The result in the calculation is: ", result.toFixed(5));
    } while (true);
}
var infix;
do {
    infix = readlines.question("Please input the infix expression or press quit to exit: ");
    if (infix === "quit") {
        process.exit(0);
    }
    var postfix = new ArrayQueue();
    postfix = conversion(infix);
    postfix.outputPostQ(postfix);
    var result;
    //console.log(postfix);
    //http://www.w3school.com.cn/js/jsref_tofixed.asp
    result = calculator(postfix);
    console.log("!result=", !result);
    if (!result) {
        console.log("The input cannot be valid");
    }
    else {
        console.log("The result in the calculation is: ", result.toFixed(5));
    }
} while (true);
