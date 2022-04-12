/*
 * Author: jefvaia
 * GitHub Page: https://github.com/jefvaia/FourierSimJS
 * Message: You may use this code however you like. I don't mind people changing the code at all.
 */

function deg2rad(d){
    return d * (Math.PI / 180);
}

function lerp(x, y, m){
    return y + m * (x - y);
}

function clamp(x, min, max){
    return Math.min(Math.max(x, min), max);
}

function invert(x, min, max){
    return max + (min - x);
}

function distanceBetween(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}