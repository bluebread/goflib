class Novel{/*
	Attr:
		tree: [TreeObj] 世界樹圖結構
		author: [Object] 作者資訊
		intro: [Object] 作品簡介
*/
	constructor(tree, author, intrto){}
};
class Tree extends Array{/*
	Tree = [[label, twig, twig, ...], [label, twig, ...], ...]
	Aux:
		(Main Purpose):
			將多條鍊(worldLine)拆成數段邊，以利於作圖
		label: [NodeObj] 表示後面所有twig皆由此label出發
		twig: [Array] 貯存一段有向邊的兩端點
	Attr: (Undefined)
	Unfinished:
		Attr:
			twigs
			labels
		inquiry(){};
		graft(){};
		cut();
*/
	constructor(...worldLineBundle){/*
		將數條worldLine拆成twig，傳回twig集合twigBox。(simplifyWLs)
		按照label歸類twigBox中twig，傳回seedling。(sortNode)
		呼叫Array.constructor，傳入seedling。完成。
	*/}
	static simplifyWLs(worldLineBundle){/*
		loop worldLineBundle{
			清理worldLine中所有Route。(cutRoute)
			收集worldLine中剩下的twig。(makeTwigs)
		}
		傳回twigBox。
	*/}
	static cutRoute(wl, startPosi){/*
		loop wl{
			檢查點是否為Node:
				是: 迴圈結束
				否: cout ++
		}
		刪除wl中從startPosi後cout個點。
		檢查startPosi下一個點是否為Node且為Terminator:
			是: 遞迴結束
			否: 從(startPosi + 1)開始繼續遞迴
	*/}
	static makeTwigs(wl, twigBox){/*
		loop (i=0; i < wl.length-1; i++){
			wl第i點和第(i+1)點，組成一個twig。
			將twig放入twigBox。
		}
	*/}
	static sortNode(twigBox){/*
		loop twigBox{
			檢查twig中label是否在seedling中建立分類:
				是: 創造一個新twig分類。(createNewLabel)
				否: (pass)
			將此twig分類進seedling中。(addNewTwig)
		}
	*/}
	static createNewLabel(seedling, label){/*
		檢查label是否在seedling中已有分類:
			是: 丟出錯誤訊息。
			否: seedling中建立新label分類
	*/}
	static addNewTwig(seedling, twig){/*
		loop seedling{
			尋找branch匹配的label。將twig加入匹配的branch。
		}
	*/}

};
class WorldLine extends Array{/*
	WorldLine = [Node(Route), Node(Route), ...]
	Attr:
		posiProgress: [Number] 表示現在WorldLine的檢查點位置。初始為0。
		progress: [Node or Route] 表示現在WorldLine的檢查點。初始為首項。
	Unfinished:
	  	wither(){};
	  	cut(){};
*/
	constructor(...worldLineArray){}
	next(){/*
		WorldLine檢查點和位置向前移一格
	*/};
	last(){/* => pre()(?)
		WorldLine檢查點和位置向後移一格
	*/};
	grow(...newItems){/*
		loop newItems{
			將newItem加到此worldLine最後。
		}
	*/}
	graft(newRoute, posi){/*
		檢查newRoute是否為Route:
			是: 依據posi上的點(nowObj)類型作不同處理。(graftSwitchNowObj)
			否: 傳回錯誤訊息
	*/}

	static graftSwitchNowObj(thisWL, newRoute, posi){/*
		檢查nowObj(thisWL[posi])為:
			Node: 檢查nowObj是否為Elastic:
					  是: 傳回錯誤訊息
					  否: 修正nowObj上Node資訊。(fixNode)
					  	  從nowObj分裂worldLine。(divergWorldLine)
					  	  傳回新worldLine。
			Route: 在nowObj後插入新Node。(addNode)
				   從新Node分裂worldLine。(divergWorldLine)
				   傳回新worldLine。
			Other: 傳回錯誤訊息
	*/}
	static divergWorldLine(thisWL, divergPosi, ...newItems){/*
		複製此worldLine於divergPosi前的部分至newWorldLine
		將newItems加至newWorldLine最後。(grow)
		傳回newWorldLine
	*/}
	static addNode(thisWL, addPosi, NodeInfo){/*
		以NodeInfo創造newNode
		將newNode加在此WorldLine於addPosi後的位置上。
		傳回newNode
	*/}
	static fixNode(thisWL, nodePosi, NodeInfo){/*
		以NodeInfo創造fixedNode
		將fixedNode取代nodePosi位置上的Node。
		傳回fixedNode
	*/}
};
class Route extends Array{/*
	Route = [Chap, Chap, ...]
	Unfinished:
	  	next(){};
	  	pre(){};
	  	grow(){};
	  	graft(){};
	  	wither(){};
	  	cut(){};
*/
	constructor(chaps){};
};
class Chap extends String{/*
	Chap = content: [String] 作品內容
	Unfinished: 
		Attr:
			Route
			WorldLines
			Nodes
		next(){};
		pre(){};
		graft(){};
		cut(){};
*/
	constructor(content){};
};
class Node extends Set{/*
	Node = (Route, Route, ...)
	Attr:
		attr: [String] 表示Node的性質
		root: [RouteObj] 分歧前 or 收束後唯一與Node連接的Route
		routes : [Array] 分歧後 or 收束前與Node連接的Route。
	definedAttrList: [Array] 定義目前被認可Node的性質
	Unfinished:
		Attr:
			rootEntry
			routesEntry
		next(){};
		pre(){};
		graft(){};
		cut(){};
*/
	constructor(root,
				attr='Split',
				routes=undefined){/*
		檢查attr是否存在於definedAttrList:
			是: 建立新Node
			否: 傳回錯誤訊息。
	*/}
};
class NodeAttrException{/*
	Attr: 
		attr: [String] Node性質
		message: [String] 傳入錯誤attr時傳回的錯誤訊息
*/
	constructor(attr){};
};
