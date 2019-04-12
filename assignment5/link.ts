//https://www.youtube.com/watch?v=V5-sqVTB49g

var readline = require('readline');
var readlinesync = require('readline-sync');
var path = require('path');
var fs = require('fs');
var TIME = 0;

let maxsize: number = 100;
let idtoname:string[];

//the record used in router.routingtable
class record {
	network:string;
	outlink:number;
	cost:number = Infinity;
	timer:number = 0;
}

//the smaller record used in packets.reachable, like iPhone5C :)
class recordC {
	network:string;
	cost:number;
}

class packets{
	originID:number;
	SEQ:number;
	TTL:number = 10;
	reachable:recordC[];
}

class router{
	public id:number;
	public routingtable:record[];
	public power:boolean;
	public maxseq = -1;
	public receivePacket(packet, SourceID) {
		var inbox = packet;
		inbox.TTL -= 1;
		// check the TTL and the SEQ
		if ((inbox.TTL == 0)||(inbox.SEQ<=this.maxseq)){
			return
		}
		this.maxseq = inbox.SEQ;
		// not discarded
		// update the reachable information: D(v) = min (D(v),D(w)+C(w,v))
		for (var i=0;i<packet.reachable.length;i++) {
			//look for the router id J of the network
			for (var j=0;j<routercount;j++) {
				if (idtoname[j]==packet.reachable[i].network) {
					break;
				}
			}
			if (!this.routingtable[j]) {
				this.routingtable[j] = new record();
			}
			if (!this.routingtable[SourceID]) {
				this.routingtable[SourceID] = new record();
			}
			// compare This-J and This-SourceID+SourceID-J
			if (this.routingtable[j].cost > this.routingtable[SourceID].cost+packet.reachable[i].cost) {
				this.routingtable[j].cost = this.routingtable[SourceID].cost+packet.reachable[i].cost;
				this.routingtable[j].network = idtoname[j];
				this.routingtable[j].outlink = SourceID;
			}
		}

		//forward the packet to all the nearby routers
		for (var j=0;j<routercount;j++) {
			if (!this.routingtable[j]) {
				this.routingtable[j] = new record();
			}
			if ((routers[j].power)&&(this.routingtable[j].outlink == this.id)) 
				routers[j].receivePacket(inbox,SourceID);

			//If the packet can not reach the Router J because power is off, add the timer
			if ((!routers[j].power)&&(this.routingtable[j].outlink == this.id))
				this.routingtable[j].timer += 1;
				//If the timer has reached 2, remove this record(the road is broken)
				if (this.routingtable[j].timer == 2) {
					this.routingtable[j].cost = Infinity;
					this.routingtable[j].timer = 0;
					this.routingtable[j].outlink = 0;
				}
		}
	}
	public originatePacket() {
		// if the router is on, send the packet
		if (this.power) {
			var temp = new packets();
			//make a maillist containing all the connected routers
			var maillist:number[];
			if (!maillist)
				maillist = [];
			//count the connected routers
			var t = 0;
			//scan all
			for (var j=0;j<routercount;j++) {
				if (!this.routingtable[j]) {
					this.routingtable[j] = new record();
				}
				if ((this.routingtable[j].cost<Infinity)&&(routers[j].power)&&(this.routingtable[j].outlink==this.id)) {
					// Router j is on and directly connected to the current router, send the packet
					temp.originID = this.id;
					temp.SEQ = TIME;
					if (!temp.reachable) {
						temp.reachable = [];
					}
					if (!temp.reachable[t])
						temp.reachable[t] = new recordC();
					temp.reachable[t].network = idtoname[j];
					temp.reachable[t].cost = this.routingtable[j].cost;
					maillist.push(j);
					t++;
				}
			}
			for (var j=0;j<maillist.length;j++) {
				routers[maillist[j]].receivePacket(temp,this.id);
			}
		}
	}
}

function ask(){
	console.log("Press C to continue");
	console.log("Press Q to quit");
	console.log("Press P followed by the router's id number to print the routing table of a router(eg:P 2)");
	console.log("Press S followed by the id number to shut down a router")
	console.log("Press T followed by the id to start up a router");
	let command: string= readlinesync.question('What is your next step?');
	var cmd = command.split(' ')
	switch (cmd[0]) {
		case "C": {
			for (var i=0;i<routercount;i++) {
				if (routers[i].power)
					routers[i].originatePacket();
				TIME++;
			}
			break;
		}
		case "Q": {
			console.log('BYE')
			process.exit(0);
			break;
		}
		case "P": {
			console.log(routers[parseInt(cmd[1])].routingtable);
			break;
		}
		case "S": {
			console.log('Router '+cmd[1]+' was shut down')
			routers[parseInt(cmd[1])].power = false;
			init_Shut(parseInt(cmd[1]));
			//console.log(routers[0].routingtable);
			break;
		}
		case "T": {
			//console.log('Router '+cmd[1]+' was turned on')
			routers[parseInt(cmd[1])].power = true;
			init_Start(parseInt(cmd[1]));
			break;
		}
	}
}

//main

//init
var routers :router[];
var file: string = fs.readFileSync('infile.dat','utf8','r+');
var lines = file.split('\n');
//First, read the network names
var pos = 0;
while (pos<lines.length) {
	if (lines[pos][0]!=' ') {
		var line = lines[pos].split(' ');
		//line[0] = 0 line[1] = '155.246.80'
		//router.id = 0 router.routingtable = [] router.power = True
		var temprouter = new router();
		temprouter.id = parseInt(line[0]);
		temprouter.power = true;
		if (!idtoname)
			idtoname = [];
		//idtoname[0] = '155.246.80'
		if (!idtoname[temprouter.id]) {
			idtoname[temprouter.id] = line[1];
		}
		if (!routers) {
			routers = []
		}
		if (!routers[temprouter.id]) {
			routers[temprouter.id] = new router();
		}
		routers[temprouter.id] = temprouter;
	}
	pos += 1;
}
var routercount = routers.length;
//Read again to init the routing table
pos = 0;
while (pos<lines.length) {
	if (lines[pos][0]!=' ') {
		var line = lines[pos].split(' ');
		//thisid = 0
		var thisid = parseInt(line[0]);
		pos += 1;
		if (pos==lines.length)
			break;
		// lines[pos]=' 1'
		while (lines[pos][0]==' ') {
			line = lines[pos].split(' ');
			//line[0] = null line[1] = 1 line[2] = null -> dest = 1
			var dest = parseInt(line[1]);
			if (!line[2]) {
				var cost = 1;
				//console.log(thisid+" "+cost);
			}
			else {
					var cost = parseInt(line[2]);
			}
			//add a record to routers[thisid]: {network = idtoname[dest], outlink = thisid, cost = 1}
			//make it the 1st row because destination is 1
			if (!routers[thisid].routingtable)
				routers[thisid].routingtable = []
			if (!routers[thisid].routingtable[dest])
				routers[thisid].routingtable[dest] = new record();
			routers[thisid].routingtable[dest].network = idtoname[dest];
			routers[thisid].routingtable[dest].cost = cost;
			
			routers[thisid].routingtable[dest].outlink = thisid;
			pos += 1;
		}
		if (!routers[thisid].routingtable[thisid])
			routers[thisid].routingtable[thisid] = new record();
		routers[thisid].routingtable[thisid].network = idtoname[thisid];
		routers[thisid].routingtable[thisid].cost = 0;
	}
}
while (true) {
	ask();
}

function init_Shut(Shut_number:number){
	
	pos = 0;
	while (pos<lines.length) {
		var arr=[];
		for(let i=0;i<routercount;i++){
			arr.push(i);
		}
		if (lines[pos][0]!=' ') {
			var line = lines[pos].split(' ');
			//thisid = 0
			var thisid = parseInt(line[0]);
			if(thisid===Shut_number){
					pos += 1;
				if (pos==lines.length)
					break;
				// lines[pos]=' 1'
				while (lines[pos][0]==' ') {
					line = lines[pos].split(' ');
					//line[0] = null line[1] = 1 line[2] = null -> dest = 1
					var dest = parseInt(line[1]);
					
					var idx=arr.indexOf(dest);
					if(idx!==-1){
						arr.splice(idx,1);
					}

					if (!line[2]) {
						var cost = Infinity;
					}
					else {
						var cost = Infinity;
					}
					//add a record to routers[thisid]: {network = idtoname[dest], outlink = thisid, cost = 1}
					//make it the 1st row because destination is 1
					if (!routers[thisid].routingtable)
						routers[thisid].routingtable = []
					if (!routers[thisid].routingtable[dest])
						routers[thisid].routingtable[dest] = new record();
					routers[thisid].routingtable[dest].network = idtoname[dest];
					routers[thisid].routingtable[dest].cost = cost;
					routers[thisid].routingtable[dest].outlink = thisid;
					pos += 1;
				}
				if (!routers[thisid].routingtable[thisid])
					routers[thisid].routingtable[thisid] = new record();
				routers[thisid].routingtable[thisid].network = idtoname[thisid];
				routers[thisid].routingtable[thisid].cost = Infinity;
			}


			else{
				pos += 1;
				if (pos==lines.length)
					break;
				// lines[pos]=' 1'
				while (lines[pos][0]==' ') {
					line = lines[pos].split(' ');
					//line[0] = null line[1] = 1 line[2] = null -> dest = 1
					var dest = parseInt(line[1]);


					var idx1=arr.indexOf(dest);
					if(idx1!==-1){
						arr.splice(idx1,1);
					}

					if (!line[2]) {
						var cost = 1;
					}
					else {
						var cost = parseInt(line[2]);
					}
					//add a record to routers[thisid]: {network = idtoname[dest], outlink = thisid, cost = 1}
					//make it the 1st row because destination is 1
					if (!routers[thisid].routingtable)
						routers[thisid].routingtable = []
					if (!routers[thisid].routingtable[dest])
						routers[thisid].routingtable[dest] = new record();
					
					if(dest===Shut_number){
						routers[thisid].routingtable[dest].cost = Infinity;
						routers[thisid].routingtable[dest].network = idtoname[dest];
						routers[thisid].routingtable[dest].outlink = thisid;
					}
					else if(routers[dest].power){
						routers[thisid].routingtable[dest].cost = cost;
						routers[thisid].routingtable[dest].network = idtoname[dest];
						routers[thisid].routingtable[dest].outlink = thisid;
					}
					pos += 1;
				}
				if (!routers[thisid].routingtable[thisid])
					routers[thisid].routingtable[thisid] = new record();
				routers[thisid].routingtable[thisid].network = idtoname[thisid];
				routers[thisid].routingtable[thisid].cost = 0;
			}
			//console.log(arr);
			for(let i=0;i<arr.length;i++){
				if(arr[i]!==thisid)
					delete routers[thisid].routingtable[arr[i]];
					
				//console.log(routers[thisid].routingtable[i]);
			}

		}
	}
}

function init_Start(start_number:number){
	pos = 0;
	while (pos<lines.length) {
		if (lines[pos][0]!=' ') {
			var line = lines[pos].split(' ');
			//thisid = 0
			var thisid = parseInt(line[0]);
			if(thisid===start_number){
					pos += 1;
				if (pos==lines.length)
					break;
				// lines[pos]=' 1'
				while (lines[pos][0]==' ') {
					line = lines[pos].split(' ');
					//line[0] = null line[1] = 1 line[2] = null -> dest = 1
					var dest = parseInt(line[1]);
					
					if (!line[2]) {
						var cost = 1;
					}
					else {
						var cost = parseInt(line[2]);
					}
					//add a record to routers[thisid]: {network = idtoname[dest], outlink = thisid, cost = 1}
					//make it the 1st row because destination is 1
					if (!routers[thisid].routingtable)
						routers[thisid].routingtable = []
					if (!routers[thisid].routingtable[dest])
						routers[thisid].routingtable[dest] = new record();
					routers[thisid].routingtable[dest].network = idtoname[dest];
					routers[thisid].routingtable[dest].cost = cost;
					routers[thisid].routingtable[dest].outlink = thisid;
					pos += 1;
				}
				if (!routers[thisid].routingtable[thisid])
					routers[thisid].routingtable[thisid] = new record();
				routers[thisid].routingtable[thisid].network = idtoname[thisid];
				routers[thisid].routingtable[thisid].cost = 0;
			}


			else{
				pos += 1;
				if (pos==lines.length)
					break;
				// lines[pos]=' 1'
				while (lines[pos][0]==' ') {
					line = lines[pos].split(' ');
					//line[0] = null line[1] = 1 line[2] = null -> dest = 1
					var dest = parseInt(line[1]);

					if (!line[2]) {
						var cost = 1;
					}
					else {
						var cost = parseInt(line[2]);
					}
					//add a record to routers[thisid]: {network = idtoname[dest], outlink = thisid, cost = 1}
					//make it the 1st row because destination is 1
					if (!routers[thisid].routingtable)
						routers[thisid].routingtable = []
					if (!routers[thisid].routingtable[dest])
						routers[thisid].routingtable[dest] = new record();
					if((dest===start_number)&&(routers[start_number].power)){
						routers[thisid].routingtable[dest].cost = cost;
						routers[thisid].routingtable[dest].network = idtoname[dest];
						routers[thisid].routingtable[dest].outlink = thisid;
					}
					else if(routers[dest].power){
						routers[thisid].routingtable[dest].cost = cost;
						routers[thisid].routingtable[dest].network = idtoname[dest];
						routers[thisid].routingtable[dest].outlink = thisid;
					}
					pos += 1;
				}
				if (!routers[thisid].routingtable[thisid])
					routers[thisid].routingtable[thisid] = new record();
				routers[thisid].routingtable[thisid].network = idtoname[thisid];
				routers[thisid].routingtable[thisid].cost = 0;
			}
		}
	}
}