//var firebug=document.createElement('script');firebug.setAttribute('src','https://py660.github.io/firebug-lite-debug.js');document.body.appendChild(firebug);(function(){if(window.firebug.version){firebug.init();}else{setTimeout(arguments.callee);}})();void(firebug);
//setInterval(()=>{console.log(speed);document.getElementById("cps").innerText = Math.round(speed*100)/100}, 5);
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const img = {
    big: document.getElementById("big"),
    eat: document.getElementById("eat"),
    normal: document.getElementById("normal"),
    shark: document.getElementById("shark"),
    tiny: document.getElementById("tiny")
}

const width = innerWidth - 4;
const height = innerHeight - 4;
canvas.width = window.devicePixelRatio*width;
canvas.height = window.devicePixelRatio*height;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
ctx.imageSmoothingEnabled = false;
ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

// speed = 0-6
// power = 0-1
let power = 0;

let y = 0;
let size = 75;
let leftmargin = 10;

let eating = false;
let eatTimeout;

let sprites = [];
let x = 0;

setInterval(()=>{
    power = Math.min(10, power + (speed/6 - power)*0.03);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgb(108, 108, 118)";
    //ctx.fillRect(0, height - height*power, width, height*power);

    y = Math.min(height-10-size/2, Math.max(10+size/2, height - height*power)) - size/2

    let newsprites = [];
    for (let sprite of sprites){
        /*ctx.fillStyle = "red";
        ctx.fillRect(sprite.dest[0]-x, sprite.dest[1], 5, 5);
        ctx.fillRect(10+size, y + size, 5, 5);
        ctx.fillStyle = "green";
        ctx.fillRect(sprite.dest[0]-x, sprite.dest[1]+sprite.dest[3], 5, 5);
        ctx.fillRect(10+size, y, 5, 5);*/

        if (! (sprite.dest[0]-x < 10+size && 10+size < sprite.dest[0]-x+20 && sprite.dest[1] < y + size && sprite.dest[1] + sprite.dest[3] > y)){
            newsprites.push(sprite);
            ctx.drawImage([img.tiny, img.big, img.shark][sprite.type], ...sprite.source, sprite.dest[0]-x, ...sprite.dest.slice(1));
            ctx.beginPath();
            //ctx.rect(sprite.dest[0]-x, ...sprite.dest.slice(1));
            ctx.stroke();
            if (sprite.type == 2){
                sprite.dest[0] -= 1;
            }
        }
        else if (sprite.type == 2){
            console.log("Ohno there goes -45pts");
        }
        else{
            eating = true;
            
            clearTimeout(eatTimeout);
            setTimeout(()=>{eating = false}, 500);
        }
    }
    sprites = newsprites;

    ctx.drawImage(eating ? img.eat : img.normal, 2, 7, 29, 20, 10, y, 30/25*size, size);
    ctx.beginPath();
    //ctx.rect(10, y, 30/25*size, size);
    ctx.stroke();
    x += 2;
}, 10);

function spawn(){
    if (document.hasFocus()){
        let rand = Math.random()*3;
        if (rand < 1.5){ //Tiny fish
            let y = Math.min(height-10-size/5, Math.max(10+size/5, height - height*Math.random())) - size/5;
            sprites.push({
                type: 0,
                dest: [x+width, y, 4/5 * size, 3/5 * size],
                source: [0, 3, 16, 10]
            });
        }
        else if (rand < 2.25){ //Big fish
            let y = Math.min(height-10-size/2, Math.max(10+size/2, height - height*Math.random())) - size/2;
            sprites.push({
                type: 1,
                dest: [x+width, y, 6*size/5, 4*size/5],
                source: [2, 6, 29, 20]
            });
        }
        else{ //Shark
            let y = Math.min(height-10-size, Math.max(10+size, height - height*Math.random())) - size;
            sprites.push({
                type: 2,
                dest: [x+width, y, 2*size, 5*size/3],
                source: [4, 10, 58, 48]
            });
        }
    }
    setTimeout(spawn, 300 + Math.random() * 800);
}
setTimeout(spawn, 700);