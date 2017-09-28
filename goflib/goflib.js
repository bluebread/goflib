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
	// Tree = {[hat, pair, pair, ...], [hat, pair, pair, ...],...}
	// pair = [startDiverg(hat), endDiverg]
	// hat = startDiverg
	// 為了輔助畫世界線樹圖，Tree每一個集合的hat表示，集合中接下來所有pair皆由hat出發。
	// 在討論畫世界線樹圖的方法時，Chap並無影響力，只有表示分歧點的Diverg才能影響畫圖
	// 方式。故將所有Chap全數刪除，簡化worldLine，只留下來Diverg。 pair表示一組由Diverg
	// 組成之線段。
	constructor(...worldLineBundle){
		const pairBox = Tree.simplifyWLs(worldLineBundle);
		const tree = Tree.sortDiverg(pairBox);
		super(...tree);
	}
	static simplifyWLs(worldLineBundle){
		// 將所有世界線，先將所有Chap摘除並留下Diverg，
		// Divergs前後一組形成pair，貯存進pairBox([1,2,3,4]=>[[1,2],[2,3],[3,4]])
		// 回傳pairBox
		let pairBox = [];
		for (let wl of worldLineBundle){
			Tree.cutChap(wl, 0);
			Tree.makePairs(wl, pairBox);
		}
		console.log(pairBox);
		return pairBox;
	}
	static cutChap(wl, startPosi){
		// 從startPoint出發，若檢查接下來的物件是否為Diverg.prototype
		// 若非，count + 1；若是Diverg，迴圈檢查結束
		// 接著，從startPoint開始，刪除count個
		// 最後，如果使迴圈檢查結束的Diverg(因為世界線被清理過後，位置為startPoint + 1)
		// 為"EndingPoint"，則清理結束；若非，從startPoint + 1繼續遞迴
		let count = 0;
		while(wl[startPosi+count+1].__proto__ != Diverg.prototype){
			count += 1;
		}
		wl.splice(startPosi+1, count);
		if(wl[startPosi + 1].__proto__ == Diverg.prototype){
			if (wl[startPosi + 1].attr == 'EndingPoint') {
				return wl;
			}else {
				Tree.cutChap(wl, startPosi + 1);
			}	
		}else {
			Tree.cutChap(wl, startPosi + 1);
		}
	}
	static makePairs(wl, pairBox){
		// wl中，前後兩個Diverg為一個pair，並將所有pair貯存進pairBox
		for(var i=0; i < wl.length-1 ; i++){
			let pair = [];
			pair.push(wl[i], wl[i+1]);
			pairBox.push(pair);
		}
	}
	static sortDiverg(pairBox){
		// Tree結構為{[hat, pair, pair, ...], ...}，其中hat宣告此陣列中所有pair
		// 皆由hat出發。
		// 在pairBox中檢查所有pair，若pair出發點(hat)，已在Tree中被建立，創立一個以
		// 所有由新hat出發的pair集合([hat, pair, pair, ...])；若非，尋找此hat在Tree
		// 中帶領的集合，最後將pair加入此集合。
		let tree = [];
		let tree_hats = [];
		for (const pair of pairBox){
			let hat = pair[0];
			if(tree_hats.indexOf(hat) == -1){
				Tree.creatNewHat(tree, hat);
				tree_hats.push(hat);
			}
			Tree.addNewPair(tree, pair);
		}
		return tree
	}
	static creatNewHat(tree, hat){
		// 在Tree中新創立一個由hat領導的集合。
		// 為了防笨，再度檢查此hat在Tree中並無領導的集合。若確實集合不存在，創立新集合。
		let doubleCheck = true;
		for (const arr of tree){
			(arr[0] == hat) && (doubleCheck = false);
		}
		if (doubleCheck) {
			const newArr = [hat];
			tree.push(newArr);
		}else{
			throw "This hat is already existing in the tree !!";
		}
	};
	static addNewPair(tree, pair){
		// 將pair加入Tree中
		// 以hat來搜尋此pair所屬的集合，最後加入此hat所帶領的集合。
		const hat = pair[0];
		for (const arr of tree){
			arr[0] == hat && arr.push(pair);
		}
	};
}


class WorldLine extends Array{
	constructor(...worldLineArray){
		super(...worldLineArray);
		this.nowPosi = 0;
		this.now = this[0];
	}
	/* WorldLine.prototype.now傳回現在WorldLine的檢查點，next()傳回檢查
	點的下一個物件，last()傳回檢查點上一個物件。
	*/ 
	next(){
		this.nowPosi++;
		this.now = this[this.nowPosi];
		return this.now;
	};
	last(){
		this.nowPosi--;
		this.now = this[this.nowPosi];
		return this.now;
	};
	grow(newChap){
		/* 如果最尾端的物件為Coda(Chap.coda==true)，Coda退化為一般Chap，才添加新物件。
		若非，於最尾端可直接添加Chap, Node, Elastic。
		*/
		const finalChap = this[this.length - 1];
		switch(finalChap.__proto__){
			case Chap.prototype:
				finalChap.coda = false;
				this.push(newChap);
				break;
			case Diverg.prototype:
				this.push(newChap);
				break;
			default:
				throw 'WorldLine can\'t grow!!';
		}
	}
	graft(newChap, posi){
		/* WorldLine中，依照傳入posi所表達的位置，如果此位置上為Node，此WorldLine
		不變，將新Chap嫁接上，最後建立並創立新WorldLine;如果此位置上為Elastic，
		函數傳回Error;如果此位置上為Chap，Chap後新建一個Node，再將新Chap嫁接上，
		最後建立並創立新WorldLine;如果此位置上為Coda，Coda退化為一般Chap，再將
		新Chap嫁接上，最後建立並創立新WorldLine。
		*/		
		if (newChap.__proto__ != Chap.prototype) {
			throw 'This is not a Chap Object...';
			return undefined;
		}else{
			const nowObj = this[posi];
			switch(nowObj.__proto__){
				case Diverg.prototype:
					if (nowObj.attr=='Elastic') {
						throw 'Elastic can\'t not be grafted !!';
					} else {
						const commonRoot = this.slice(0, posi + 1);
						const newWorldLine = new WorldLine(...commonRoot);
						newWorldLine.grow(newChap);
						return newWorldLine;
					}
					break;
				case Chap.prototype:
					const commonRoot = this.slice(0, posi + 1);
					const newWorldLine = new WorldLine(...commonRoot);

					const nowChap = this[posi];
					const nextChap = this[posi+1];
					const newDiverg = new Diverg('Node',
												[newChap, nextChap],
												nowChap);
					nowObj.coda = false;
					newWorldLine.grow(newDiverg);
					newWorldLine.grow(newChap);
					this.splice(posi + 1, 0, newDiverg)
					return newWorldLine;

					break;
				default:
					throw 'This position can not be grafted !';
			}
		}
	}
};


class Chap extends String{
	/* 章節。構成Tree物件中的基礎單位*/
	constructor(constent){
		super(constent);
		this.coda = false;
	}
	//graft(newChap){
	//	/* WorldLine中，在此Chap之後插入新的Node分歧點。
	//	然後將新Chap分支嫁接上去，最後創建並回傳一個新WorldLine。
	//	*/
	//}
};


class Diverg extends Set{
	/* 分歧(Divergence)。於WorldLine中表示分歧點，方便判別WorldLines相對關係和Tree結構。
	Intersec中貯存分歧的Chaps，以及分歧前('Node')/收束後('Elastic')"唯一"接續
	的Chap(normalRoot/fateRoot)。
	*/
	constructor(attr='Node',
				onlyChap,
				chaps=undefined){
		super(chaps);
		this.attr = attr;
		switch(attr){
			case 'Node':
				this.normalRoot = onlyChap;
				break;
			case 'Elastic':
				this.fateRoot = onlyChap;
				break;
			case 'StartPoint':
				this.cause = onlyChap;
				break;
			case 'EndingPoint':
				this.coda = onlyChap;
				break;
			default:
				throw new DivergAttrException(attr).message;
		}
	}
	// graft(newChap){
	// 	 /*WorldLine中，然後將新Chap分支嫁接上去此Diverg上。
	// 	若Diverg.attr為'Node'，最後創建並回傳一個新WorldLine。
	//	*/
	// }
};
class DivergAttrException{
	constructor(attr){
		this.attr = attr;
		this.message = `${attr} is a invalid attribution of Diverg Object`;
	}
}
// Example 1
var chapA = new Chap("有一天，老蘿遇到一個蘿莉。");
var chapB = new Chap("老羅正準備衝上去舔那個蘿莉的時候，");
var chapC = new Chap("他被警察發現了！");
var chapD = new Chap('可憐的老羅，就這樣被帶回警局，在監獄中渡過他悲慘的一生。');
var chapE = new Chap('他被老漢發現了！');
var chapF = new Chap('他們兩個人最後一起舔那個蘿莉。Happy Ending ~')

var divergK = new Diverg('Node', [chapC, chapE], chapB);



/*A - B - C - D
	  |
	  E - F
*/

var wlA = new WorldLine(chapA, chapB, chapC, chapD);
var wlB = wlA.graft(chapE, 1);
// Example 2
/*
		c ----- P - E
		|		|
S - a - A - b - B - e - K - E
				| 		|
				f-------|
*/
const a = new Chap("a");
const b = new Chap("b");
const c = new Chap("c");
const d = new Chap("d");
const e = new Chap("e");
const f = new Chap("f");
const g = new Chap('g');
const h = new Chap('h');
const S = new Diverg('StartPoint', a);
const A = new Diverg('Node', a, [b,c]);
const B = new Diverg('Node', b, [d,e,f]);
const P = new Diverg('Elastic', g, [c,d]);
const K = new Diverg('Elastic', h, [e,f]);
const E1 = new Diverg('EndingPoint', g);
const E2 = new Diverg('EndingPoint', h);
const wl1 = new WorldLine(S,a,A,c,P,g,E1);
const wl2 = new WorldLine(S,a,A,b,B,d,P,g,E1);
const wl3 = new WorldLine(S,a,A,b,B,e,K,h,E2);
const wl4 = new WorldLine(S,a,A,b,B,f,K,h,E2);
const tree = new Tree(wl1,wl2,wl3,wl4);

console.log(tree);