class Novel{
	constructor(tree,
				author={},
				intro={}){
		this.tree = tree;
		this.author = author;
		this.intro = intro;
	}
};
class Tree extends Array{
	constructor(...worldLineBundle){
		const twigBox = Tree.simplifyWLs(worldLineBundle);
		const seedling = Tree.sortNode(twigBox);
		super(...seedling);
	}
	static simplifyWLs(worldLineBundle){
		let twigBox = [];
		for (let wl of worldLineBundle){
			Tree.cutRoute(wl, 0);
			Tree.makeTwigs(wl, twigBox);
		}
		console.log(twigBox);
		return twigBox;
	}
	static cutRoute(wl, startPosi){
		let count = 0;
		while(wl[startPosi+count+1].__proto__ != Node.prototype){
			count += 1;
		}
		wl.splice(startPosi+1, count);
		if(wl[startPosi + 1].__proto__ == Node.prototype){
			if (wl[startPosi + 1].attr == 'Terminator') {
				return wl;
			}else {
				Tree.cutRoute(wl, startPosi + 1);
			}	
		}else {
			Tree.cutRoute(wl, startPosi + 1);
		}
	}
	static makeTwigs(wl, twigBox){
		for(var i=0; i < wl.length-1 ; i++){
			let twig = [];
			twig.push(wl[i], wl[i+1]);
			twigBox.push(twig);
		}
	}
	static sortNode(twigBox){
		let seedling = [];
		let seedling_labels = [];
		for (const twig of twigBox){
			let label = twig[0];
			if(seedling_labels.indexOf(label) == -1){
				Tree.createNewLabel(seedling, label);
				seedling_labels.push(label);
			}
			Tree.addNewTwig(seedling, twig);
		}
		return seedling
	}
	static createNewLabel(seedling, label){
		let doubleCheck = true;
		for (const branch of seedling){
			(branch[0] == label) && (doubleCheck = false);
		}
		if (doubleCheck) {
			const newBranch = [label];
			seedling.push(newBranch);
		}else{
			throw "This label is already existing in the seedling !!";
		}
	};
	static addNewTwig(seedling, twig){
		const label = twig[0];
		for (const branch of seedling){
			branch[0] == label && branch.push(twig);
		}
	};
}


class WorldLine extends Array{
	constructor(...worldLineArray){
		super(...worldLineArray);
		this.posiProgress = 0;
		this.progress = this[0];
	}
	next(){
		this.posiProgress++;
		this.progress = this[this.posiProgress];
		return this.progress;
	};
	last(){
		this.posiProgress--;
		this.progress = this[this.posiProgress];
		return this.progress;
	};
	grow(newRoute){
		const finalRoute = this[this.length - 1];
		switch(finalRoute.__proto__){
			case Route.prototype:
				this.push(newRoute);
				break;
			case Node.prototype:
				this.push(newRoute);
				break;
			default:
				throw 'WorldLine can\'t grow!!';
		}
	}
	graft(newRoute, posi){
		if (newRoute.__proto__ != Route.prototype) {
			throw 'This is not a Route Object...';
			return undefined;
		}else{
			const nowObj = this[posi];
			switch(nowObj.__proto__){
				case Node.prototype:
					if (nowObj.attr == 'Elastic') {
						throw 'Elastic can\'t not be grafted !!';
					} else {
						const commonRoot = this.slice(0, posi + 1);
						const newWorldLine = new WorldLine(...commonRoot);
						newWorldLine.grow(newRoute);
						return newWorldLine;
					}
					break;
				case Route.prototype:
					const commonRoot = this.slice(0, posi + 1);
					const newWorldLine = new WorldLine(...commonRoot);

					const nowRoute = this[posi];
					const nextRoute = this[posi+1];
					const newDiverg = new Node( nowRoute, 
												'Split',
												[newRoute, nextRoute]);
					newWorldLine.grow(newDiverg);
					newWorldLine.grow(newRoute);
					this.splice(posi + 1, 0, newDiverg)
					return newWorldLine;
					break;
				default:
					throw 'This position can not be grafted !';
			}
		}
	}
};
class Route extends Array{
	constructor(...chaps){
		super(...chaps);
	}
};

class Chap extends String{
	constructor(content){
		super(content);
	}
};


class Node extends Set{
	constructor(root,
				attr='Split',
				routes=undefined){
		const definedAttrList = ["Split", "Elastic", "Origin", "Terminator"];
		super(routes);
		if(definedAttrList.indexOf(attr) != -1){
			this.attr = attr;
			this.root = root;
		}else{
			throw new NodeAttrException(attr).message;
		}
	}
};
class NodeAttrException{
	constructor(attr){
		this.attr = attr;
		this.message = `${attr} is a invalid attribution of Node Object`;
	}
}


// Example 1
var chapA = new Chap("有一天，老蘿遇到一個蘿莉。");
var chapB = new Chap("老羅正準備衝上去舔那個蘿莉的時候，");
var chapC = new Chap("他被警察發現了！");
var chapD = new Chap('可憐的老羅，就這樣被帶回警局，在監獄中渡過他悲慘的一生。');
var chapE = new Chap('他被老漢發現了！');
var chapF = new Chap('他們兩個人最後一起舔那個蘿莉。Happy Ending ~')

var routeZ = new Route(chapA, chapB);
var routeY = new Route(chapC, chapD);
var routeX = new Route(chapE, chapF);

var divergK = new Node(chapB, 'Split');



/*
  A - B - K - C - D
		  |
		  E - F

	Z - K - Y
		|
		X
*/

var wlA = new WorldLine(routeZ, divergK, routeY);
var wlB = wlA.graft(routeX, 2);


// Example 2
/*
		c ----- P - g - E1
		|       |
		|       d
 		|		|
S - a - A - b - B - e - K - E2
				| 		|
				f-------|
						   c ----- P - g - E1
						   |
						   |
						   |
worldLine 1 (wl1): S - a - A
								   P - g - E1
								   |
								   d
								   |
worldLine 2 (wl2): S - a - A - b - B

|

worldLine 3 (wl3): S - a - A - b - B - e - K - h - E2

worldLine 4 (wl4): S - a - A - b - B       K - E2
								   | 	   |
								   f-------|
*/
const a = new Route(new Chap("a"));
const b = new Route(new Chap("b"));
const c = new Route(new Chap("c"));
const d = new Route(new Chap("d"));
const e = new Route(new Chap("e"));
const f = new Route(new Chap("f"));
const g = new Route(new Chap('g'));
const h = new Route(new Chap('h'));

const S = new Node(a, 'Origin');
const A = new Node(a, 'Split', [b,c]);
const B = new Node(b, 'Split', [d,e,f]);
const P = new Node(g, 'Elastic', [c,d]);
const K = new Node(h, 'Elastic', [e,f]);
const E1 = new Node(g, 'Terminator');
const E2 = new Node(h, 'Terminator');

const wl1 = new WorldLine(S,a,A,c,P,g,E1);
const wl2 = new WorldLine(S,a,A,b,B,d,P,g,E1);
const wl3 = new WorldLine(S,a,A,b,B,e,K,h,E2);
const wl4 = new WorldLine(S,a,A,b,B,f,K,h,E2);
const tree = new Tree(wl1,wl2,wl3,wl4);

console.log(tree);