var firebug=document.createElement('script');firebug.setAttribute('src','https://py660.github.io/firebug-lite-debug.js');document.body.appendChild(firebug);(function(){if(window.firebug.version){firebug.init();}else{setTimeout(arguments.callee);}})();void(firebug);
//setInterval(()=>{console.log(speed);document.getElementById("cps").innerText = Math.round(speed*100)/100}, 5);
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const img = {
    big: document.getElementById("big"),
    eat: document.getElementById("eat"),
    normal: document.getElementById("normal"),
    shark: document.getElementById("shark"),
    tiny: document.getElementById("tiny"),
    p30: document.getElementById("30"),
    p45: document.getElementById("45"),
    p60: document.getElementById("60"),
    eaten: ((gif = GIF()).load("img/eaten-dashed.gif") || true) ? gif : false // Cool ternary operators hack
}

setTimeout(()=>{console.log(img.eaten.image)}, 1000);

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
let started = false;

let y = 0;
let size = 75;
let leftmargin = 10;

let eaten = false;
let eatenTimeout;
let eating = false;
let eatTimeout;
let modifiers = []; // 1 = 30, 2 = -45, 3 = 60

let sprites = [];
let x = 0;
let lives = 3;
let points = 0;
let countdown = 240;

let mainloop = setInterval(()=>{
    power = Math.min(1, power + (speed/6 - power)*0.03);
    if (!started){
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.font = "100px Courier New, monospace";
        let gameovertext = "Start clicking";
        ctx.fillText(gameovertext, width/2 - ctx.measureText(gameovertext).width/2, height/2 - 50);
        ctx.strokeText(gameovertext, width/2 - ctx.measureText(gameovertext).width/2, height/2 - 50);
        if (power>0.15){
            setInterval(()=>{
                if (countdown <= 0){
                    clearInterval(mainloop); 
                    ctx.fillStyle = "red";
                    ctx.strokeStyle = "black";
                    ctx.font = "100px Courier New, monospace";
                    let gameovertext = "GAME OVER";
                    ctx.fillText(gameovertext, width/2 - ctx.measureText(gameovertext).width/2, height/2 - 50);
                    ctx.strokeText(gameovertext, width/2 - ctx.measureText(gameovertext).width/2, height/2 - 50);
                }
                else{
                    countdown--;
                }
            }, 1000);
            setTimeout(spawn, 700);
            started = true;
        }
    }
    else{
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "rgb(108, 108, 118)";
        //ctx.fillRect(0, height - height*power, width, height*power);

        y = Math.min(height-10-size/2, Math.max(10+size/2, height - height*power)) - size/2

        let newsprites = [];
        for (let sprite of sprites){
            if (sprite.dest[0]-x+sprite.dest[2] < 0){
                continue;
            }
            /*ctx.fillStyle = "red";
            ctx.fillRect(sprite.dest[0]-x, sprite.dest[1], 5, 5);
            ctx.fillRect(10+size, y + size, 5, 5);
            ctx.fillStyle = "green";
            ctx.fillRect(sprite.dest[0]-x, sprite.dest[1]+sprite.dest[3], 5, 5);
            ctx.fillRect(10+size, y, 5, 5);*/
            if (sprite.type == 2){
                sprite.dest[0] -= 1;
            }
            if (sprite.type == 1){
                sprite.dest[0] -= 0.5;
            }
            if (eaten || ! (sprite.dest[0]-x < 10+size && 10+size < sprite.dest[0]-x+20 && sprite.dest[1] < y + size && sprite.dest[1] + sprite.dest[3] > y)){
                newsprites.push(sprite);
                ctx.drawImage([img.tiny, img.big, img.shark][sprite.type], ...sprite.source, sprite.dest[0]-x, ...sprite.dest.slice(1));
            }
            else if (sprite.type == 2){
                eaten = true;
                clearTimeout(eatenTimeout);
                eatenTimeout = setTimeout(()=>{eaten = false}, 2000);
                points -= 45;
                modifiers.push({type: 2, x: x, y: sprite.dest[1]});
            }
            else{
                eating = true;

                if (sprite.type == 1){
                    points += 60;
                    modifiers.push({type: 3, x: x, y: sprite.dest[1]});
                }
                if (sprite.type == 0){
                    points += 30;
                    modifiers.push({type: 1, x: x, y: sprite.dest[1]});
                }
                
                clearTimeout(eatTimeout);
                eatingTimeout = setTimeout(()=>{eating = false}, 500);
            }
        }
        sprites = newsprites;

        newmodifiers = [];
        for (let modifier of modifiers){
            if (modifier.x > x - 100){
                newmodifiers.push(modifier);
                ctx.drawImage([0, img.p30, img.p45, img.p60][modifier.type], 100, modifier.y, 70, 70)
            }
        }
        modifiers = newmodifiers;

        ctx.drawImage(eaten ? img.eaten.image : eating ? img.eat : img.normal, 2, 7, 29, 20, 10, y, 30/25*size, size);
        x += 2;

        points = Math.max(0, points);
        ctx.fillStyle = "black";
        ctx.font = "50px Courier New, monospace";
        ctx.fillText(points + " pts",10,60);

        ctx.fillStyle = "black";
        ctx.font = "50px Courier New, monospace";
        let timeString = `${Math.floor(countdown/60).toString().padStart(2, "0")}:${(countdown%60).toString().padStart(2, "0")}`;
        ctx.fillText(timeString, width - ctx.measureText(timeString).width - 10, 60);
    }
}, 10);

function spawn(){
    if (document.hasFocus()){
        let rand = Math.random()*3;
        if (rand < 1.5){ //Tiny fish
            let y = Math.min(height-10-size/5, Math.max(10+size/5, height - height*Math.random())) - size/5;
            let conflict = false;
            for (let sprite of sprites){
                if (x+width-sprite.dest[0] < size){
                    if (Math.abs(sprite.dest[1]-y < size)){
                        conflict = true;
                    }
                }
            }
            if (!conflict){
                sprites.push({
                    type: 0,
                    dest: [x+width, y, 4/5 * size, 3/5 * size],
                    source: [0, 3, 16, 10]
                });
            }
        }
        else if (rand < 2.25){ //Big fish
            let y = Math.min(height-10-size/2, Math.max(10+size/2, height - height*Math.random())) - size/2;
            let conflict = false;
            for (let sprite of sprites){
                if (x+width-sprite.dest[0] < size){
                    if (Math.abs(sprite.dest[1]-y < size)){
                        conflict = true;
                    }
                }
            }
            if (!conflict){
                sprites.push({
                    type: 1,
                    dest: [x+width, y, 6*size/5, 4*size/5],
                    source: [2, 6, 29, 20]
                });
            }
        }
        else{ //Shark
            let y = Math.min(height-10-size, Math.max(10+size, height - height*Math.random())) - size;
            let conflict = false;
            for (let sprite of sprites){
                if (x+width-sprite.dest[0] < size){
                    if (Math.abs(sprite.dest[1]-y < size)){
                        conflict = true;
                    }
                }
            }
            if (!conflict){
                sprites.push({
                    type: 2,
                    dest: [x+width, y, 2*size, 5*size/3],
                    source: [4, 10, 58, 48]
                });
            };
        }
    }
    setTimeout(spawn, 300 + Math.random() * 800);
}