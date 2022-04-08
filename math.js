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