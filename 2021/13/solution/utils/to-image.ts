import * as fs from 'fs';
import Tesseract from 'tesseract.js';

import { Grid } from ".";

const jpeg = require('jpeg-js');
const nocr = require('nocr');

const encode = require('image-encode')


export const ocrGrid = (grid: Grid<any>) => {

    
    const w = grid.width();
    const h = grid.height();
    const frameData = new Buffer(w * h * 4);
    var i = 0;

    // i = y * width + x
    // i -x = y * width
    while (i < frameData.length) {
        const p = i / 4;
        const x = p % w;
        const y = (p - x) / w;

        const normPos = {x: grid.minX() + x, y: grid.minY() + y};
        
        frameData[i++] = grid.get(normPos) ? 255 : 0; // red
        frameData[i++] = 0; // green
        frameData[i++] = 0; // blue
        frameData[i++] = 255; // alpha - ignored in JPEGs
    }

    const encoded = Buffer.from(encode(frameData, [w, h], 'png'));
    fs.writeFileSync('image.png', encoded);


    return Tesseract.recognize(
     'image.png',
    'eng')
    // { logger: m => console.log(m) }

    return new Promise((res, rej) => {
        nocr.decodeFile("image.png", function(error, data){
            // fs.unlinkSync('image.png');
            if (error) {
                rej (error)
            } else {
                res(data);
            }
        });
    });

}
