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
var wlB = wlA.graft(routeX, 1);


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