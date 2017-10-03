class Novel extends Object{
	/* tree: (TreeObj) 作品世界線樹物件
	author: (Object) 作者資訊
	intro: (Object) 作品簡介與其他敘述
	*/
	constructor(tree,
				author={},
				intro={}){
		this.tree = tree;
		this.author = author;
		this.intro = intro;
	}
};
class Tree extends Array{
	// Tree = [[label, twig, twig, ...], [label, twig, twig, ...],...]
	// twig = [startNode(label), endNode]
	// label = startNode
	// 為了輔助畫世界線樹圖，Tree每一個集合的label表示，集合中接下來所有twig皆由label出發。
	// 在討論畫世界線樹圖的方法時，Route並無影響力，只有表示分歧點的Node才能影響畫圖
	// 方式。故將所有Route全數刪除，簡化worldLine，只留下Node。 twig表示一組由Node
	// 組成之線段。
	constructor(...worldLineBundle){
		const twigBox = Tree.simplifyWLs(worldLineBundle);
		const seedling = Tree.sortNode(twigBox);
		super(...seedling);
	}
	static simplifyWLs(worldLineBundle){
		// 將所有世界線，先將所有Route摘除並留下Node，
		// wl前後一組形成twig，貯存進twigBox([1,2,3,4]=>[[1,2],[2,3],[3,4]])
		// 回傳twigBox
		let twigBox = [];
		for (let wl of worldLineBundle){
			Tree.cutRoute(wl, 0);
			Tree.makeTwigs(wl, twigBox);
		}
		console.log(twigBox);
		return twigBox;
	}
	static cutRoute(wl, startPosi){
		// 從startPoint出發，若檢查接下來的物件是否為Node.prototype
		// 若非，count + 1；若是Node，迴圈檢查結束
		// 接著，從startPoint開始，刪除count個
		// 最後，如果使迴圈檢查結束的Node(因為世界線被清理過後，位置為startPoint + 1)
		// 為"Terminator"，則清理結束；若非，從startPoint + 1繼續遞迴
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
		// wl中，前後兩個Diverg拆成一個twig，並將所有twig貯存進twigBox
		for(var i=0; i < wl.length-1 ; i++){
			let twig = [];
			twig.push(wl[i], wl[i+1]);
			twigBox.push(twig);
		}
	}
	static sortNode(twigBox){
		// Tree結構為[[label, twig, twig, ...], ...]，其中label宣告此陣列中所有twig
		// 皆由label出發。
		// 在twigBox中檢查所有twig，若twig出發點(label)，已在Tree中被建立，創立一個以
		// 所有由新label出發的twig集合([label, twig, twig, ...])；若非，尋找此label在Tree
		// 中帶領的集合，最後將twig加入此集合。
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
		// 在Tree中新創立一個由label領導的集合。
		// 為了防笨，再度檢查此label在Tree中並無領導的集合。若確實集合不存在，創立新集合。
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
		// 將twig加入Tree中
		// 以label來搜尋此twig所屬的集合，最後加入此label所帶領的集合。
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
	/* WorldLine.prototype.progress傳回現在WorldLine的檢查點，next()傳回檢查
	點的下一個物件，last()傳回檢查點上一個物件。
	*/ 
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
		/* WorldLine中，依照傳入posi所表達的位置，如果此位置上為Node，此WorldLine
		不變，將新Route嫁接上，最後建立並創立新WorldLine; 如果此位置上為Elastic，
		函數傳回Error; 如果此位置上為Route，Route後新建一個Node，再將新Route嫁接上，
		最後建立並創立新WorldLine。
		*/		
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
  	// pre(){};
  	// next(){};
  	// grow(){};
  	// graft(){};
};

class Chap extends String{
	/* 章節。構成Tree物件中的基礎單位*/
	constructor(content){
		super(content);
	}
	//graft(newChap){
	//	/* WorldLine中，在此Chap之後插入新的Node分歧點。
	//	然後將新Chap分支嫁接上去，最後創建並回傳一個新WorldLine。
	//	*/
	//}
};


class Node extends Set{
	/* 分歧。於WorldLine中表示節點，方便判別WorldLines相對關係和Tree結構。
	Node中貯存分歧的Routes，以及分歧前('Split')/收束後('Elastic')"唯一"接續
	的root。
	*/
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
	// graft(newChap){
	// 	 /*WorldLine中，然後將新Chap分支嫁接上去此Diverg上。
	// 	若Diverg.attr為'Split'，最後創建並回傳一個新WorldLine。
	//	*/
	// }
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