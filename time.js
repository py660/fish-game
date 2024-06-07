let clicks = [];
let speed = 0; //PUBLIC
// Date.now() -> time in ms
document.body.addEventListener("click", ()=>{clicks.push(Date.now())});
setInterval(()=>{
    let newclicks = [];
    for (let i of clicks){
        if (i >= Date.now()-1000){
            newclicks.push(i);
        }
    }
    clicks = newclicks;
    speed = speed + 0.01*(clicks.length - speed);
    //console.log("speed:", speed)
}, 10);