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


  const ovins = a.ins === b.ins ? a.ins : 'n/a';
  const overlap = newCubes
    .filter((c) => isInside(c, a) && isInside(c, b))
    .map(i => ({...i, ins: ovins}))

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
  return list.filter((value, index, self) => {
    return index === self.findIndex((t) => str(t) === str(value));
  });
};

export const breakOffs = (input: Cubiod[]) => {
  
  return input.reduce((cubesOn, next) => {
    if (next.ins === "on") {
      cubesOn = cubesOn.reduce((acc, cube) => {
        const cuts = cuts2(next, cube);

        if (cuts.overlap.length) {
          // console.log(cuts.overlap.length);
          return [...acc, ...cuts.b, ...cuts.a, ...cuts.overlap];
        } else {
          return [...acc, cube];
        }
      }, []);
    //   cubesOn.push(next);
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

    cubesOn = cleanDupes(cubesOn);
    cubesOn = cleanContained(cubesOn);
    return cubesOn;
  }, []);
};

export const cleanContained = (cubes: Cubiod[]) => {
  return cubes.reduce((acc, cube, i, self) => {
    const larger = self.find((c2) => {
      if (c2 === cube) {        
        return false;
      }
      const isi = isInside(cube, c2);
      if (isi) {
        const a1 = calcArea(cube);
        const a2 = calcArea(c2);
        
        console.log(isi, a1, a2);

      }
      
      return isi;
    });

    if (larger) {
      // console.log({larger, cube, i});
      return acc;
    }
    return [...acc, cube];
  }, []);
};

export const cleanOverlapping = (cubes: Cubiod[]) => {
  let newCubes = [...cubes];

  const nextIntersectingCouple = (): [Cubiod, Cubiod, number, number] => {
    for (let c1i = 0; c1i < newCubes.length; c1i++) {
      for (let c2i = c1i + 1; c2i < newCubes.length; c2i++) {
        const c1 = newCubes[c1i];
        const c2 = newCubes[c2i];
        if (intersects(c1, c2)) {
          // console.log(c1, c2, c1i, c2i);

          if (c1i === c2i) {
            throw "up";
          }

          return [c1, c2, c1i, c2i];
        }
      }
    }
    return [] as any;
  };

  let found = true;
  while (found) {
    const [c1, c2, c1i, c2i] = nextIntersectingCouple();


    if (isDefined(c1)) {
      const cuts = cuts2(c1, c2);

      // console.log('removing', c1, 'putting', cuts.a);

      console.log({c1, c2});
      console.log(cuts.a);
      console.log(cuts.b);
      console.log(cuts.overlap);
  
      const beforeInt = newCubes.length;

      if (cuts.overlap.length === 0) {
        const int = intersects(c1, c2);
        console.log({int, c1, c2});
        
        throw 'bob'
      }

      newCubes.splice(c1i, 1);
      newCubes.splice(c2i, 1);
      newCubes.push(...cuts.a);
      newCubes.push(...cuts.b);
      newCubes.push(...cuts.overlap.map(i => ({...i, ins: 'on'})));

      console.log(newCubes.length);
      newCubes = cleanDupes(newCubes);
      console.log(newCubes.length);

      // console.log({c1, c2});
      

      const afterPushes = newCubes.length;
      // newCubes = cleanContained(newCubes);
      const afterClean = newCubes.length;
      console.log({ beforeInt, afterPushes, afterClean });
      // console.log(cuts.a.length, cuts.b.length, cuts.overlap.length);
    } else {
      found = false;
    }
    //
    // found = false
  }

  // const clean = cubes.filter((c1) => {
  //   return cubes.every((c2) => {
  //     return c1 === c2 || !intersects(c1, c2);
  //   })
  // })
  // console.log({clean});
  return newCubes;

};

export const calcArea = (curr: Cubiod) => {
  return (Math.abs((curr.x[1]) - curr.x[0]))
   * (Math.abs((curr.y[1]) - curr.y[0]))
   * (Math.abs((curr.z[1]) - curr.z[0]));
}