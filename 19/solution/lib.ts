import { BP } from "./parse";

export type State = {
  ore: number;
  obsidian: number;
  clay: number;
  geode: number;
};

export type Type = keyof State;

export const empty = {
  ore: 0,
  obsidian: 0,
  clay: 0,
  geode: 0,
};
export const itemKey = (item: State) => {
  const rk = Object.entries(item)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((a) => a[1])
    .join(",");
  return rk;
};

export const addItems = (a: State, b: State) => {
  const n = { ...empty };
  for (const i in a) {
    n[i] = a[i] + b[i];
  }
  return n;
};

export const subtractItems = (a: State, b: State) => {
  const n = { ...empty };
  for (const i in a) {
    n[i] = a[i] - b[i];
  }
  return n;
};

export const largerEqual = (a: State, b: State): boolean => {
  return Object.keys(a).every((k) => a[k] >= b[k]);
};

export const canAfford = (bp: BP, rs: State): Type[] => {
  return Object.keys(bp).filter((k) => largerEqual(rs, bp[k])) as Type[];
};

export const robotsPrice = (bp: BP, item: State) => {
  const price = { ...empty };

  for (const t in item) {
    const count = item[t];

    for (const k in bp[t]) {
      const p = bp[t][k];
      price[k] += p * count;
    }
  }
  return price;
};

export const calcOpts = (bp: BP, rs: State): State[] => {

    const ca = canAfford(bp, rs);
    if (ca.includes('geode')) {
        return [{...empty, geode: 1}];
    } else {
        return [{...empty}, ...canAfford(bp, rs).map(opt => {
            return { ...empty, [opt]: 1 };
        })];
    }
};

