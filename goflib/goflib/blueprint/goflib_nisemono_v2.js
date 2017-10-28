class Novel{/*
	Attr:
		trees: [Array] 世界樹圖結構
		author: [Object] 作者資訊
		intro: [Object] 作品簡介
*/
	constructor(trees, author, intrto){}
}

class Tree extends Array{/*
	Tree = [Branch, Branch, ...] or [undefined]
	Attr:
		Base: [NodeObj('Elastic', 'Origin', 'Split')] 基點(入口節點 or 基節點)
		BaseRoute: [RouteObj] 基冊
		Split: [NodeObj('Split', 'Terminator')] 最初的分歧節點
		layer: [Number] 基點所在層數
		layer_num: [Number] 跨越之層數(恆等於 1)
		territory: [Object] 領地訊息{
			area: [Number] 擁有領地面積
			posi: [Array[2]] 領地位於入口節點領地中的順序座標
			center: [Number] 領地位於從屬分支領地中的中心座標
		}
		power: [Nunber] 總權數
		light: [Boolean] 後面唯一連結結局，世界線結尾
*/
	constructor(...wlBundle){
		let branchBox = [];
		const tree_info = Tree.legal_info(wlBundle); 
			// 檢查 wlBundle 中所有 wl 皆相同位置通過 tree
			// 若上述檢查 非法，傳回錯誤
			// 若上述檢查 合法，傳回所需 Attr 資訊(Object)
		for(const wl of wlBundle){
			branchBox = Tree.buildBranch(branchBox, wl);
				// 若 wl 不存在於 branchBox中 所有已建立的 branch ，創立新 branch
				// 若 wl 存在其中任何一個 branch ，修正該 branch 資訊
				// 最後，傳回 branchBox 。
		}
		Tree.construct_Attr(this, tree_info); // 利用 tree_info ，建立 tree 的 Attrs
		super(...branchBox);
	}
	static legal_info(wlBundle){}
	static buildBranch(branchBox, wl){}
	static construct_Attr(thisTree, tree_info){}
	static arrengeBranch(branchBox){/*
		先排列同一層根據所屬圈的收束，再排列同一圈內的收束
		使收束的 branch 盡量排在一起。無論是否合法。
	*/}
}
class Branch extends Tree{/*
	Branch = [Branch, Branch, ...] or [undefined]
	Attr:
		__parentTree: [TreeObj] 分支所從屬的樹
		__parentBranch: [BranchObj or undefined] 分支所從屬的分支
		isMerged: [Boolean] 分支是否和其他分支收束
		Elastic: [NodeObj, undefined] 分支收束的收束節點
*/
	constructor(tree, ...wlBundle){
		Branch.research_parent(this, tree); // 建立 __parentTree 和 __parentBranch 資訊
		super(...wlBundle);
	}
	modify(newInfo){
		const {treeInfo, branchInfo} = newInfo; 
		Branch.modify_treeInfo(this, treeInfo);
		Branch.modify_branchInfo(this, branchInfo);
			// 修正訊息分成 tree 和 branch 兩部分
		return this; // 傳回新 branch
	}
	static research_parent(thisTree, tree){}
	static modify_treeInfo(thisTree, treeInfo){}
	static modify_branchInfo(thisTree, treeInfo){}
}
class RealityTree extends Tree{/*
	RealityTree = [Branch, Branch, ...] or [undefined]
	Attr:
		__protoTree: [TreeObj] 原型樹
		elastics: [Array] 真實樹中所有收束點
		dis_elastics: [Array] 原型樹裁剪掉的收束點
*/
	constructor(protoTree, cutOrderInfo){
		this = protoTree;
		RealityTree.executeOrder(cutOrderInfo);
			// cutOrderInfo 傳入複數指定裁減 branch 或 tree 資訊
			// 搜索並剪切特定連結，修改原型樹成為能畫在二維平面上的真實樹
	}
	static executeOrder(cutOrderInfo){}
}
class Layer extends Array{/*
	Layer = [Branch(Tree), Branch(Tree), ...]
	Attr: 
		__tree: [TreeObj] 由此出發建立此 Layer 的 tree
		__depth: [Number] 所在深度
*/
	constructor(tree, depth){
		let branchBox = [];
		branchBox = Layer.dig(branchBox, tree, depth, 0);
			// 從 tree 出發，遞迴搜尋相應深度的 branch 或 tree
		Layer.construct_Attr(this, {
			'__tree': tree,
			'__depth': depth
		});
		super(branchBox);
	}
	elasticSubset(size){/*
		傳回此 Layer 中所有子集合
	*/}
	elasticSubset(size){/*
		傳回此 Layer 中所有收束點的集合
	*/}
	evaluate(){
		if ( Layer.elementaryCheck(this) && Layer.allPairCheck(this)){
			return true;
		}else{
			return false;
		}
	}

	static dig(branchBox, branch, depth, nowDepth){
		if (nowDepth < depth){
			for(const bra of branch){
				return Layer.dig(branchBox, bra, depth, nowDepth++);
			}
		}else{
			branchBox.push(branch);
			return branchBox;
		}
	}
	static construct_Attr(thisLayer, construct_Attr_info){}
	static elementaryCheck(thisLayer){/*
		一組位於同 Layer 且同圈的收束點，必須滿足以下初步條件:
			1. 所有收束總數 < Layer.length || 所有收束總數 < Circle.length
			2. 任意一對分支進行收束次數 < 2
			3. 任意一個分支上收束次數 <= 2
		滿足下列條件之分支，不影響此 Layer 是否合法:
			1. 不參與任何收束，或屬於不同圈收束的分支
			2. 位於更深 Layer 之分支
	*/}
	static allPairCheck(thisLayer){
		for ( const ep of thisLayer.elasticPairs()){
			return Tree.pairCheck(ep);
		}
	}
	static pairCheck(ep){/*
		假設有一對 A,B 收束，其基節點為 BN
		任意一對收束合法，必須滿足以下其中一項條件:
			1. 所有 branch 位於 [BN, A) 或 [BN, B) 間，均未曾收束過
			2. A,B 在同 Layer 中相鄰
	*/}
}
class Deposit extends Array{/*
	Deposit = [RealityTree, RealityTree, ...]
*/
	constructor(tree, ...layers){
		let rtBox = [];
		rtBox = Deposit.buildRealityTree(tree, rtBox, layers);
			// 遞迴所有 Layer ，尋找可行解的 RealityTree
	}
	static buildRealityTree(tree, rtBox, layers){
		const orderInfoBox = [];
		orderInfoBox = Deposit.allInfo(orderInfoBox, layers);
			// 暴力搜索所有 Layer 收束點子集合之組合(不影響不收束的 Branch) ，可能需要解決其演算效率問題。
			// 實際上，很少用戶操作涉及輸入複數世界線同時繪圖，僅作為如何解決世界線樹繪製問題之展示。
		orderInfoBox = Deposit.cleanJoke(orderInfoBox);
			// 將不可能的 orderInfo 清除
		for ( const orderInfo of orderInfoBox){
			const rt = new RealityTree(tree, orderInfo);
			rtBox.push(rt);
				// 根據上面得到合理的 orderInfo ，利用原型樹 tree 進行剪裁 ，得到可行解 RealityTree
		}
		super(rtBox);
	}
	static allInfos(orderInfoBox, layers){
		const firstLayer = layers[0];
		for (var size = 1; size <= firstLayer.length; size++){
			for(const subLayer of firstLayer.elasticSubset(size)){
				const orderInfo = [];
				orderInfo.push(subLayer);
				orderInfoBox = gatherSubLayer(orderInfoBox, orderInfo, layers, 0)
			}
		}
		return orderInfoBox;
	}
	static gatherSubLayer(orderInfoBox, orderInfo, layers, nowDepth){
		const nowLayer = layers[nowDepth];
		for (var size = 1; size <= nowLayer.length; size++){
			for(const subLayer of nowLayer.elasticSubset(size)){
				return recordInfo(orderInfoBox, orderInfo, layers, nowDepth, subLayer);
			}
		}
	}
	static recordInfo(orderInfoBox, orderInfo, layers, nowDepth, subLayer){
		const oi = orderInfo;
		oi.push(subLayer);
		if ( nowDepth == layers.length){
			return orderInfoBox.push(oi);
		}else{
			return gatherSubLayer(orderInfoBox, orderInfo, layers, nowDepth++);
		}
	}
	static cleanJoke(orderInfoBox){
		for (const orderInfo of orderInfoBox){
			for (const layer of orderInfo){
				Deposit.judgeJoke(layer, orderInfo, orderInfoBox)
					// 判斷 orderInfo 是否不合理
					// 若 orderInfo 中有 Layer不切實際，清除該 orderInfo
			}
		}
	}
	static judgeJoke(layer, orderInfo, orderInfoBox){
		if ( !layer.evaluate() ){
			Deposit.cleanOrder(orderInfo, orderInfoBox);
				//若 orderInfo 中有 Layer不切實際，清除該 orderInfo
		}
	}
}
class WorldLine extends Array{/*
	
*/}
class Node extends Set{/*
	
*/}
class Route extends Array{/*
	
*/}
class Chap extends String{/*
	
*/}


class NodeAttrException{/*
	
*/}
class TreeException{/*
	
*/}
class WorldLineGraftException{/*
	
*/}