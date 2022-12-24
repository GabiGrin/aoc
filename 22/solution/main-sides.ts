import {Range} from './solve';

export const sides: Array<{range: Range, mapsTo: number, num: number, transform: 1 | -1, dir: 'R' | 'B' | 'L' | 'T', orientation: 'H' | 'V'}> = [
    {
        range: { x: [50, 99], y: 0 },
        num: 0,
        mapsTo: 9,
        dir: 'B',
        orientation: 'H',
        transform: 1
      },
      {
        range: { x: [100, 149], y: 0 },
        num: 1,
        mapsTo: 8,
        dir: 'B',
        orientation: 'H',
        transform: 1,
      },
      {
        range: { x: 149, y: [0, 49] },
        num: 2,
        mapsTo: 5,
        dir: 'L',
        orientation: 'V',
        transform: -1
      },
      {
        range: { x: [100, 149], y: 49 },
        num: 3,
        mapsTo: 4,
        dir: 'T',
        orientation: 'H',
        transform: 1
      },
      {
        range: { x: 99, y: [50, 99] },
        num: 4,
        mapsTo: 3,
        dir: 'L',
        orientation: 'V',
        transform: 1
      },
      {
        range: { x: 99, y: [100, 149] },
        num: 5,
        mapsTo: 2,
        dir: 'L',
        orientation: 'V',
        transform: -1
      },
      {
        range: { x: [50, 99], y: 149 },
        num: 6,
        mapsTo: 7,
        dir: 'T',
        orientation: 'H',
        transform: 1
      },
      {
        range: { x: 49, y: [150, 199] },
        num: 7,
        mapsTo: 6,
        dir: 'L',
        orientation: 'V',
        transform: 1
      },
      {
        range: { x: [0, 49], y: 199 },
        num: 8,
        mapsTo: 1,
        dir: 'T',
        orientation: 'H',
        transform: 1
      },
      {
        range: { x: 0, y: [150, 199] },
        num: 9,
        mapsTo: 0,
        dir: 'R',
        orientation: 'V',
        transform: 1
      },
      {
        range: { x: 0, y: [100, 149] },
        num: 10,
        mapsTo: 13,
        dir: 'R',
        orientation: 'V',
        transform: -1
      },
      {
        range: { x: [0, 49], y: 100 },
        num: 11,
        mapsTo: 12,
        dir: 'B',
        orientation: 'H',
        transform: 1
      },
      {
        range: { x: 50, y: [50, 99] },
        num: 12,
        mapsTo: 11,
        dir: 'R',
        orientation: 'V',
        transform: 1
      },
      {
        range: { x: 50, y: [0, 49] },
        num: 13,
        mapsTo: 10,
        dir: 'R',
        orientation: 'V',
        transform: -1
      },
    ];