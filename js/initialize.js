var invaders = [];
var numLives = 3;
var canvas;
var context;

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    context = canvas.getContext("2d");
    //canvas.onmousedown = animate;
    animate();
};

function Invader(x, y) {
    this.x = x;
    this.y = y;
}

function animate() {
    var dirx = 1;
    var diry = 1;
    var invader = new Invader(10, 10);
    var chX = 10;
    //context.fillRect(100, 100, 40, 40);
    invaders.push(new Invader(20, 20));
    //invaders.push(new Invader(30, 30));
    //invaders.push(new Invader(300, 300));
    while (numLives > 0) {
        for (var i = 0; i<40; i++) {
            setTimeout(function () {move(dirx, chX);}, 4000);
        }
        for (var invader in invaders) {
            invaders[invader].y += diry*10;
        }
        dirx *= -1;
        numLives--;
    }
}

function move(dirx, chX) {
    for (var invader in invaders) {
        invaders[invader].x += dirx*chX;
        console.log("x: " + invaders[invader].x)
        context.fillRect(invaders[invader].x, invaders[invader].y, 20, 20);
    }
}    
