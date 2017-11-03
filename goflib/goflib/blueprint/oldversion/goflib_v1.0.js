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
	grow(...newItems){
		for(const newItem of newItems){
			this.push(newItem);
		}
	}
	graft(newRoute, posi){
		if (newRoute.__proto__ != Route.prototype) {
			throw 'This is not a Route Object...';
		}else{
			const newWorldLine = WorldLine.graftSwitchNowObj(this, newRoute, posi);
			return newWorldLine;
		}
	}
	static graftSwitchNowObj(thisWL, newRoute, posi){
		const nowObj = thisWL[posi];
		switch(nowObj.__proto__){
			case Node.prototype:
				if (nowObj.attr == 'Elastic') {
					throw 'Elastic can\'t not be grafted !!';
				} else {
					const fixedNode = WorldLine.fixNode(thisWL, posi, {
						info_root: thisWL[posi-1],
						info_attr: 'Split',
						info_routes: [newRoute, thisWL[posi+1]]
					});
					const newWorldLine = WorldLine.divergWorldLine(thisWL, posi, newRoute);
					return newWorldLine;
				}
				break;
			case Route.prototype:
				const newNode = WorldLine.addNode(thisWL, posi, {
					info_root: nowObj,
					info_attr: 'Split',
					info_routes: [newRoute, thisWL[posi+1]]
				});
				const newWorldLine = WorldLine.divergWorldLine(thisWL, posi+1, newRoute);
				return newWorldLine;
				break;
			default:
				throw 'This position can not be grafted !';
		}
	}
	static divergWorldLine(thisWL, divergPosi, ...newItems){
		let newWorldLine = thisWL.slice(0, divergPosi + 1);
		newWorldLine.grow(...newItems);
		return newWorldLine;
	}
	static addNode(thisWL, addPosi, NodeInfo){
		const {info_root, info_attr, info_routes} = NodeInfo;
		const newNode = new Node(
			info_root,
			info_attr,
			info_routes
		);
		thisWL.splice(addPosi + 1, 0, newNode);
		return newNode;
	}
	static fixNode(thisWL, nodePosi, NodeInfo){
		const {info_root, info_attr, info_routes} = NodeInfo;
		const fixedNode = new Node(
			info_root,
			info_attr,
			info_routes
		);
		thisWL[nodePosi] = fixedNode;
		return fixedNode;
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