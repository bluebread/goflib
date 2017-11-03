class Work{/* (作品)
	Attributions:
		reference: [Number] 資料庫編號
		graph: [Graph] 樹圖矩陣
		style: [Style] 作圖風格資訊
*/}
class Style{/* (風格)
	Attributions:
		type: [String] 作圖方法
*/}
class Graph{/* (樹圖)
	Attributions:
		matrix: [Array[][]] 儲存節點之間連結路線編號的矩陣
		entry: [Number] 入口節點編號，默認值為 0 
	Methods:
		maxPoint(...WorldLine): [Number] 計算樹圖最大節點數
*/}
class WorldLine{/* (世界線)
	Attributions:
		reference: [Number] 資料庫編號
		chain: [Array] 儲存路線和節點排序狀態的陣列
*/}
class Node{/* (節點)
	Attributions:
		reference: [Number] 資料庫編號
		attr: [String] 節點性質
		root: [Number] 節點根源路線編號
		routes: [Array] 節點分裂路線編號
*/}
class Route{/* (路線)
	Attributions:
		reference: [Number] 資料庫編號
		chapters: [Array] 路線包含之章節
*/}
class Chapter{/* (章節)
	Attributions:
		reference: [Number] 資料庫編號
		__parantRoute: [Number](Private) 章節所在路線編號
	Methods:
		pre(): [Number] 回傳上一章節編號
		next(): [Number] 回傳下一章節編號
*/}