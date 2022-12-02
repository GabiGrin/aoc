import { strictEqual } from "assert";
import { assert } from "chai";
import { isDefined } from "./utils/misc";

export type Cubiod = {
  x: [number, number];
  y: [number, number];
  z: [number, number];
  ins: "on" | "off";
};

export const _intersectDim = (a: Cubiod, b: Cubiod, dim: "x" | "y" | "z") => {
  const [a1, a2] = a[dim];
  const [b1, b2] = b[dim];

  const cond = (a1 >= b1 && a1 < b2) || (a2 > b1 && a2 <= b2);
  // if (cond) {
    
  //   console.log({a1, a2, b1, b2});
  // }
  return cond;
};

export const intersectDim = (a: Cubiod, b: Cubiod, dim: "x" | "y" | "z") => {
  return _intersectDim(a, b, dim) || _intersectDim(b, a, dim);
};

export const intersects = (a: Cubiod, b: Cubiod) => {
  const ix = intersectDim(a, b, "x");
  const iy = intersectDim(a, b, "y");
  const iz = intersectDim(a, b, "z");
  // console.log({ix, iy, iz});

  return ix && iy && iz;
};

export const str = (c: Cubiod) =>
  `${c.x[0]},${c.x[1]}|${c.y[0]},${c.y[1]}|${c.z[0]},${c.z[1]}`;

export const isInside = (smaller: Cubiod, larger: Cubiod) => {
  const [ax1, ax2] = smaller.x;
  const [ay1, ay2] = smaller.y;
  const [az1, az2] = smaller.z;

  const [bx1, bx2] = larger.x;
  const [by1, by2] = larger.y;
  const [bz1, bz2] = larger.z;

  const ix = ax1 >= bx1 && ax1 <= bx2 && ax2 <= bx2;
  const iy = ay1 >= by1 && ay1 <= by2 && ay2 <= by2;
  const iz = az1 >= bz1 && az1 <= bz2 && az2 <= bz2;

  return ix && iy && iz;
};

const getPoints = (a: Cubiod, b: Cubiod, dim) => {
  const [a1, a2] = a[dim];
  const [b1, b2] = b[dim];

  console.log({a1, a2});
  
}

const points = getPoints(
  {x: [0, 5], y: [0, 5], z: [0, 5], ins: 'on'},
  {x: [0, 10], y: [0, 10], z: [0, 10], ins: 'on'},
  'x'
)



export const cuts2 = (a: Cubiod, b: Cubiod) => {
  if (!intersects(a, b)) {
    // console.log('that');
    
    const bob = {
      a: [a],
      b: [b],
      overlap: [],
    };
    return bob;
  }
  const [ax1, ax2] = a.x;
  const [ay1, ay2] = a.y;
  const [az1, az2] = a.z;

  const [bx1, bx2] = b.x;
  const [by1, by2] = b.y;
  const [bz1, bz2] = b.z;

  const [x0, x1, x2, x3] = [ax1, ax2, bx1, bx2]
    .sort((a, b) => a - b)
    .filter((n, i, arr) => arr.indexOf(n) === i);

  const [y0, y1, y2, y3] = [ay1, ay2, by1, by2]
    .sort((a, b) => a - b)
    .filter((n, i, arr) => arr.indexOf(n) === i);

  const [z0, z1, z2, z3] = [az1, az2, bz1, bz2]
    .sort((a, b) => a - b)
    .filter((n, i, arr) => arr.indexOf(n) === i);

  const xp = [
    [x0, x1],
    [x1, x2],
    [x2, x3],
  ].filter((p) => isDefined(p[0]) && isDefined(p[1]));

  const yp = [
    [y0, y1],
    [y1, y2],
    [y2, y3],
  ].filter((p) => isDefined(p[0]) && isDefined(p[1]));

  const zp = [
    [z0, z1],
    [z1, z2],
    [z2, z3],
  ].filter((p) => isDefined(p[0]) && isDefined(p[1]));

  // console.log(42, zp);
  

  const newCubes = xp.reduce<any[]>((acc, px) => {
    return yp.reduce((acc, py) => {
      // acc.push({x: px, y: py});
      // return acc;
      return zp.reduce((acc, pz) => {
        acc.push({
          x: px,
          y: py,
          z: pz,
        });
        return acc;
      }, acc);
    }, acc);
  }, []);

  const insideA = newCubes
    .filter((c) => isInside(c, a) && !isInside(c, b))
    .map((i) => ({ ...i, ins: a.ins }));

  const insideB = newCubes
    .filter((c) => isInside(c, b) && !isInside(c, a))
    .map((i) => ({ ...i, ins: b.ins }));

  const overlap = newCubes.filter((c) => isInside(c, a) && isInside(c, b))

  const bob = {
    a: insideA,
    b: insideB,
    overlap
  };

  if (bob.overlap.length > 1) {
    throw 'wtf'
  }

  if (intersects(a, b) && !bob.overlap.length) {
    console.log(a, b);
    console.log(bob.overlap);
    // throw new Error("bbug");
  }

  if (!intersects(a, b) && bob.overlap.length) {
    console.log(a, b);
    console.log(bob.overlap);

    throw new Error("bbug2");
  }

  return bob;
};

export const cleanDupes = (list: Cubiod[]) => {
  const strs = list.map(s => str(s));
  const unique = strs.map((s1, i, arr) => {
    return arr.indexOf(s1) === i;
  });

  return list.filter((value, index, self) => {
    return unique[index]
  });
};

export const breakOffs = (input: Cubiod[]) => {
  
  
  let cubesOn =  input.reduce((cubesOn, next, i) => {
    
    console.log(`breaking off`, i);
    
    const n = Date.now();
    if (next.ins === "on") {
      
      cubesOn.push(next);
      return cubesOn;
    } else {
      cubesOn = cubesOn.reduce((acc, cube) => {
        const cuts = cuts2(next, cube);

        if (cuts.overlap.length) {
          // console.log(cuts.b);
          // console.log(cuts.overlap.length);
          return [...cuts.b, ...acc];
        } else {
          return [...acc, cube];
        }
      }, []);
    }

    const n2 = Date.now();

    const n3 = Date.now();
    console.log(`reduce: ${n2- n}, cleans: ${n3 - n2}`);
    return cubesOn;
  }, []);

  cubesOn = cleanDupes(cubesOn);
  cubesOn = cleanContained(cubesOn);

  return cubesOn;
};

export const cleanContained = (cubes: Cubiod[]) => {

  cubes.sort((a, b) => {
    return calcArea(a) - calcArea(b);
  });

  return cubes.filter((cube, i, self) => {

    for (let j = i+ 1; j < self.length; j++) {
      const c2 = self[j];
      const isi = isInside(cube, c2); 
      if (isi) {
        return false;
      }     
    }
    return true;
  });
};

export const cleanOverlapping2 = (input: Cubiod[]) => {
    console.log(input.length);
    
  let cubesOn = input.reduce((cubesOn, next, i, arr) => {

    let n = Date.now();
    if (next.ins === "on") {

      // if (!cubesOn.length) {
        cubesOn.push(next);
      // }
      
      cubesOn = cubesOn.reduce((acc, cube) => {
        const cuts = cuts2(next, cube);

        if (cuts.overlap.length) {
          // console.log(cuts.overlap.length);
          acc.push(...cuts.b);
          // acc.push(...cuts.a);
          acc.push(...cuts.overlap);
          return acc;
        } else {
          acc.push(cube);
          // acc.push(next);
          return acc;
        }
      }, []);
      // console.log({co: cubesOn.length});
      

    } else {
      throw 'wat'
    }
    const n2 = Date.now();

    // if (cubesOn.length > 4000) {

      const c1 = cubesOn.length;

      // if ( i % 10 === 0 ) {
        // cubesOn = cleanDupes(cubesOn);

      // }
      const c2 = cubesOn.length;
      const n3 = Date.now();
      // if (i % 100 === 0) {
      cubesOn = cleanContained(cubesOn);
      // }
      const c3 = cubesOn.length;
    // }
  
    const n4 = Date.now();

    if (i % 10 === 0) {
      const total = n4 - n;
      console.log(`breaking overlaps`, i, cubesOn.length, arr.length);
      console.log(`${total}: reduce: ${n2- n}, cleans dedup: ${n3 - n2} clean contain: ${n4- n3} | dupes ${c1-c2}, contained ${c2-c3}`);
      
    }
    return cubesOn;
  }, []);

  cubesOn = cleanDupes(cubesOn);
  cubesOn = cleanContained(cubesOn);

  
  return cubesOn;
};

// return cubes.reduce((acc, cube, i, self) => {

//   const overlapping = self.filter((c2) => {
//     if (c2 === cube) {
//       return false;
//     }
//     return intersects(c2, cube);
//   });

//   console.log(42, overlapping.length, i);

//   // if (larger) {
//   //   console.log({larger, cube, i});
//   //   return acc;
//   // }
//   // return [...acc, cube];
//   return acc;
//
// }, []);
// }

//   const cc1 = cuts2(c1, c2);
//   const cc2 = cuts2(c1, c1b);
//   const cc4 = cuts2(c1, c4);

// //   console.log(cc1.length);

//   	assert.equal(cc4.a.length, 1);
// 	assert.equal(cc4.b.length, 1);
//   	assert.equal(cc1.a.length, 4);
// 	assert.equal(cc1.b.length, 4);

// 	assert.equal(cc2.a.length, 2);
// 	assert.equal(cc2.b.length, 4);

export const calcArea = (curr: Cubiod) => {
  return (Math.abs((curr.x[1]) - curr.x[0]))
   * (Math.abs((curr.y[1]) - curr.y[0]))
   * (Math.abs((curr.z[1]) - curr.z[0]));
}