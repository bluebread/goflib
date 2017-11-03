class Novel{/* (作品)
	Attributions:
		tree: [TreeObj] 世界樹圖結構
		author: [Object] 作者資訊
		intro: [Object] 作品簡介
*/
	constructor(tree, author, intrto){}
}
class Tree{/* (樹圖)
	Attributions:
		layers: [Array] 樹圖之層狀結構
		connectors: [Array] 樹圖中節點連結狀態
*/
	constructor(...BranchBundle){
		this.layer = Tree.createLayers(...BranchBundle);
		this.connector = Tree.createConnectors(...BranchBundle);
	}
	static createLayers(){}
		// 回傳樹圖全部的層
	static createConnectors(){}
		// 回傳樹圖全部的連結
}
class Layer{/* (層)
	Attributions:
		depth: [Number] 層位於樹圖中的深度
		components: [Array] 位於層中的節點
*/
	constructor(...components, attrInfo){}
}
class Connector{/* (連結)
	Attributions:
		start: [Node] 連結起始節點
		end: [Node] 連結終止節點
		start_layer: [Number] 連結起始節點所在之層
		end_layer: [Number] 連結終止節點所在之層
		direction: [Number] 連結之方向。 0 指向同層，1 指向下層，-1 指向上層。
*/
	constructor(start, end, attrInfo){}
}
class Branch{/* (分支)
	Attributions:
		root: [Node] 分支根源節點
		base: [Route] 分支主枝幹路線
		split: [Array] 分支接續的其他分支
*/
	constructor(...wlBundle){}
}
class WorldLine{/* (世界線)
	Attributions:
		chains: [Array] 世界線成員陣列
*/
	constructor(...members){}
}
class Node{/* (節點)
	Attributions:
		attr: [String] 節點性質
		root: [Route] 節點根源路線
		routes: [Array] 節點分支路線
*/
	constructor(root, attr='split', routes=undefined)
}
class Route{/* (路線)
	Attributions:
		chapters: [Array] 路線包含的章節
*/
	constructor(...chapters){}
}
class Chapter{/* (章節)
	Attributions:
		content: [String] 章節內容
		__parantRoute: [Route] (Private) 章節所在路線
	Methods:
		pre(): [Chapter] 回傳上一章節
		next(): [Chapter] 回傳下一章節
*/
	constructor(content){}
}