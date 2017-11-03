class Work{
	constructor(refer, graph, style){}
}
class Style{
	constructor(type){}
}
class Graph{
	constructor(wlBundle){
		const maxNum = Graph.maxPoint(wlBundle);
			// 得到樹圖中點的最大數量
		this.matrix = Graph.squareMatrix(maxNum);
			// 創造 maxNum x maxNum 方矩陣
		this.matrix = Graph.fillRoute(this.matrix, wlBundle);
			// 填入相互連結的 Route
	}
	static maxPoint(wlBundle){
		let pointSet = new Set();
		for(const wl of wlBundle){
			for(let i = 0; i < wl.length ; i+=2){
				pointSet.add(wl[i]);
			}
		}
		return pointSet.size;
	}
	static squareMatrix(maxNum){
		let matrix = new Array();
		for (let i = 0; i < maxNum; i++){
			matrix[i] = new Array();
			for (let j = 0; j < maxNum; j++){
				matrix[i][j] = null;
			}
		}
		return matrix;
	}
	static fillRoute(matrix, wlBundle){
		for (const wl of wlBundle){
			for (let i = 0; i < wl.length - 2; i+=2){
				const nowNode = wl[i];
				const connectRoute = wl[i + 1];
				const nextNode = wl[i + 2];
				matrix[nowNode][nextNode] = connectRoute;
			}
		}
		return matrix;
	}
}
class WorldLine{
	constructor(refer, chain)
}
class Node{
	constructor(refer, attr, root, routes)
}
class Route{
	constructor(refer, chaps)
}
class Chapter{
	constructor(refer, parantRoute)
	pre(){}
	next(){}
}