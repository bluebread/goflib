
function Paint(...trees){/*
	loop const tree of trees{
		if(tree.Base.attr == 'Elatic'){
			DrawElasic(tree);
		}
		Draw(tree);
	}
*/};
function DrawElastic(tree){/*
	const entry = tree.Base;
	const merged_routes_posi = [];
	loop const route of entry{
		const center_route_posi = route.__parentBranch.territory_posi[0 + 1] / 2;
		merged_routes_posi.push(center_route_posi);
	}
	const startPosi = max(merged_routes_posi);
	const endPosi = min(merged_routes_posi);
	DrawStraightLine([tree.layer, startPosi], [tree.layer, endPosi]);
*/};
function Draw(wood){/*
	const baseRoute = wood.BaseRoute;
	DrawStraightLine([wood.layer, wood.territory.center], [wood.layer + 1, wood.territory.center]);
	LinkRoute(wood.BaseRoute);

	if(wood.values exist){
		const entry = wood.Base;
		const merged_routes_posi = [];
		loop const route of entry{
			const center_route_posi = route.__parentBranch.territory_posi[0 + 1] / 2;
			merged_routes_posi.push(center_route_posi);
		}
		const startPosi = max(merged_routes_posi);
		const endPosi = min(merged_routes_posi);
		DrawStraightLine([wood.EntryLayer + 1, startPosi], [wood.EntryLayer + 1, endPosi]);

		for bra of wood{
			Draw(bra);
		}
	}else{
		Recursive End;
	}
*/};