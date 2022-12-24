export const calc = (start, largerSet) => {
  const queue = [start];

  const all = [];
  const vis = new Set();

  vis.add(start.join(","));

  console.log('starting with', start);
  

  let i = 0;

  while (queue.length) {
    const curr = queue.shift();

    all.push(curr);
    // console.log(curr);
    if (i++ % 100 === 0 && i >10){
      console.log(i, queue.length);
     
    }

    const next = neigh(curr)
      .filter((p) => {
        const isNotInLarger = largerSet.every((air) => !isSame(air, p));

        const hasAdj = largerSet.some((air) => distance(air, p) <= 2);

        // console.log({isNotInLarger, hasAdj}, p);
        
        
        return isNotInLarger && hasAdj;
      })
      .filter((p) => {
        return !vis.has(p.join(","));
      });

    // console.log(next);
    // throw 'bb'

    next.forEach((p) => vis.add(p.join(",")));

    queue.push(...next);
    // break;
    if (queue.length === 0) {
      return all;
    }
  }
};

export const distance = (v1, v2) => {
    return v1.reduce((acc, v, i) => Math.abs(v - v2[i]) + acc, 0)
}

export const adj = (c1, c2) => {
  const dis = distance(c1, c2);
  if (dis === 1) {
    return true;
  } else {
    return false;
  }
    // return distance(c1, c2) === 1;
  const diffs = c1.map((v, i) => Math.abs(v - c2[i]));

  const zeros = diffs.filter((d) => d === 0);
  const ones = diffs.filter((d) => d === 1);

  if (zeros.length === 2 && ones.length === 1) {
    return diffs.indexOf(1);
  }
  return -1;
};

export const isSame = (a1, a2) => JSON.stringify(a1) === JSON.stringify(a2);

export const neigh = (vec) => {
  return [
    [0, 0, 1],
    [0, 0, -1],
    [0, 1, 0],
    [0, -1, 0],
    [1, 0, 0],
    [-1, 0, 0],
  ].map((dir) => {
    return dir.map((p, i) => vec[i] + p);
  });
};

export const neighDiag = (vector) => {
  const adjacentVectors = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Don't include the original vector itself
        if (x === 0 && y === 0 && z === 0) continue;
        if (Math.abs(x) + Math.abs(y) + Math.abs(z) === 3) {
            // console.log(x, y, z);
            continue;
        }
        adjacentVectors.push([vector[0] + x, vector[1] + y, vector[2] + z]);
      }
    }
  }
  return adjacentVectors;
};
