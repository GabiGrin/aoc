


// const strengths = input.map(({s, b}) => {
//     const distance = manDis(s, b);
//     return {s, b, d: distance};
// })

import { Vector, manDis } from "./utils";

export const calc = (curr: Vector, s: Vector, distance: number) => {
    const delta = manDis(curr, s);
    return delta - distance;
}

export const findBestCandidate = (fromX, toX, fromY, toY, scale: number, strengths) => {
    let max = -Infinity;
    let pos = null;

    
    for (let x = fromX; x < toX; x+= scale) {
        for (let y = fromY; y < toY; y+=scale) {
            const p = {x, y};
            const s1 = strengths.map((i) => calc(p, i.s, i.d));
            const mn = Math.min(...s1);

        
            if (max < mn) {
                max = mn;
                pos = p
            }
        }

    }
    // console.log(max, pos);
    
    return {pos,  cand: max};
}

export const calcBorders = (input, mul) => {

	const borders = input.map(({s, b}) => {
		const dis = manDis(s, b) + 1;

		const bs = [];
		const top = {x: s.x, y: s.y - dis }
		const left = {x: s.x - dis, y: s.y}

		const bottom = {x: s.x, y: s.y + dis }
		const right = {x: s.x + dis, y: s.y}


		const maybePush = (pos) => {
			if (pos.x >= 0 && pos.x<=mul && pos.y >=0 && pos.y <= mul) {
				bs.push(pos);
			}
		}
		for (let d = 0; d < dis; d++) {
			// top going to the right
			maybePush({x: top.x + d, y: top.y + d})

			// right going to bottom
			maybePush({x: right.x - d, y: right.y + d})

			// bottom going to left
			maybePush({x: bottom.x - d, y: bottom.y - d})

			// left going to top
			maybePush({x: left.x + d, y: left.y - d})

		}
		return {bs, s, dis};
	})

    return borders;
}

export const getBlockedCount = (input, targetY) => {
	const set = new Set();
	const becons = new Set();

	const inRange = x => x >= 0 && x <= 4000000;

	input.forEach((item) => {
		if (item.b.y === targetY && inRange(item.b.x)) {
			becons.add(item.b.x);
		}

		if (item.s.y === targetY && inRange(item.s.x)) {
			set.add(item.s.x);
		}
	})

	input.forEach((item) => {
		const {s, b} = item;

		if (s.y === targetY) {
			set.add(s.x)
		}

		const distance = manDis(s, b);

		const distanceFromTarget = manDis(s, {x: s.x, y: targetY})
		const extra = distance - distanceFromTarget;

		for (let d = 0; d <= extra; d++) {
			const p1 = {x: s.x + d, y: targetY};
			const p2 = {x: s.x - d, y: targetY};

			if (inRange(p1.x)) {
				if (!becons.has(p1.x)) {
					set.add(p1.x)
				}
			} 

			if (inRange(p2.x)) {
				if (!becons.has(p2.x)) {
					set.add(p2.x)
				}
			}
		}	
	});

	return {set, becons}
}