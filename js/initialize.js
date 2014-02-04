var invaders;
var canvas;
var context;
var direction = 0; //0 = right, 1 = left
var tank;
var descend =false;
var laser = null;

//constants
var numColInvaders = 8;
var numRowInvaders = 10;
var invaderHeight;
var invaderWidth;
var laserWidth = 1;
var laserHeight = 8;


function Invader(x, y) {
    this.x = x;
    this.y = y;
    this.hit = false;
}

function Tank(x, y) {
    this.x = x;
    this.y = y;
}

function Laser(x, y){
    this.x = x;
    this.y = y;
}

//Override clear, one would be the regular clear used by canvas, the other is 
//our own implementation, in which we can choose to or not to preserve the
//transformation matrix of the canvas.
CanvasRenderingContext2D.prototype.clear =
    CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
        if (preserveTransform) {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
        }

        this.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (preserveTransform) {
            this.restore();
        }
    };

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    context = canvas.getContext("2d");

    canvas.focus();

    invaderHeight = Math.round(canvas.width/40);
    invaderWidth = Math.round(canvas.width/11);

    tank = new Tank(canvas.width/2, canvas.height * 0.95);

    invaders = new Array(numRowInvaders);
    for (var i = 0; i < invaders.length; i++) {
        invaders[i] = new Array(numColInvaders);
    }

    initializeInvaders();

    draw();

    canvas.onkeydown= function(event){
        var keyCode;
        if (event == null){
            keyCode = window.event.keyode;
        } else{
            keyCode = event.keyCode;
        }

        switch(keyCode){
            //left key
            case 37:
                moveTankLeft();
                break;
            //right key
            case 39:
                moveTankRight();
                break;
            //up key
            case 38:
                fire();
                break;
            //space key
            case 32:
                fire();
                break;
            //down key
            case 40:
                break;
            default:
                break;
        }
    }

}

function initializeInvaders(){
    var x = 45;
    var y = 20;
    for(var i = 0; i < invaders.length; i++){
        for(var j = 0; j < invaders[i].length; j++){
            invaders[i][j] = new Invader(x, y);
            x += invaderWidth + 10;
        }
        x = 45;
        y += invaderHeight + 10;
    }
}

function fire(){
    if (laser != null) return;
    laser = new Laser(tank.x + invaderWidth/2, tank.y - invaderHeight);
    drawLaser();
}

function moveTankLeft(){
    context.clearRect(tank.x, tank.y, 30,12);
    if (tank.x - 5 > 0){
        tank.x -= 5;
    }
    context.fillStyle = "#000000";
    context.fillRect(tank.x, tank.y, 30, 12);
}

function moveTankRight(){
    context.clearRect(tank.x, tank.y, 30,12);
    if (tank.x + 35 < canvas.width){
        tank.x += 5;
    }
    context.fillStyle = "#000000";
    context.fillRect(tank.x, tank.y, 30, 12);
}

function drawLaser() {
    if(laser != null) {
        context.clearRect(laser.x - 1, laser.y, laserWidth + 2, laserHeight);
        laser.y -=10;
        context.fillStyle = "#000000";
        context.fillRect(laser.x, laser.y, laserWidth, laserHeight);
    }
    if (laser.y < 0) laser = null;
    for(var i = invaders.length - 1; i > 0; i--){
        for(var j = 0; j < invaders[i].length; j++){
            if (!invaders[i][j].hit) {
                checkLaserHit(i, j);
            }
        }
    }
    setTimeout(function() {drawLaser()}, 100);
}

function checkLaserHit(i, j) {
    if (((laser.x > invaders[i][j].x || (laser.x + laserWidth) > invaders[i][j].x)
        && (laser.x < (invaders[i][j].x + invaderWidth) || (laser.x + laserWidth) < (invaders[i][j].x + invaderWidth))
        )
        && ((laser.y > invaders[i][j].y || (laser.y + laserHeight) > invaders[i][j].y)
        && (laser.y < (invaders[i][j].y + invaderHeight) || (laser.y + laserHeight) < (invaders[i][j].y + invaderHeight))
        ))
    {
        invaders[i][j].hit = true;
        laser = null;
    }
}


function draw(){
    context.clear(true);
    for(var i = 0; i < invaders.length; i++){
        for(var j = 0; j < invaders[i].length; j++){
            if (invaders[i][j].hit == false){
                if(invaders[i][j].y + invaderHeight > canvas.height * 0.95){
                    alert("game over");
                    return;
                }
                context.fillStyle = "#0B5FA5";
                context.fillRect(invaders[i][j].x, invaders[i][j].y, invaderWidth, invaderHeight);
            }
            if (descend){
                invaders[i][j].y += 10;
            } else{
                if (direction == 0){
                    invaders[i][j].x += 10;
                } else {
                    invaders[i][j].x -= 10;
                }
            }
        }
    }
    if (descend){
        descend = false;
    } else{
        if(invaders[0][numColInvaders - 1].x + invaderWidth > (canvas.width * 0.98)){
            direction = 1;
        } else if (invaders[0][0].x < (canvas.width * 0.03)) {
            direction = 0;
        }
        descend = true;
    }
    context.fillStyle = "#000000";
    context.fillRect(tank.x, tank.y, 30, 12);
    if (laser != null) {
        context.fillStyle = "#000000";
        context.fillRect(laser.x, laser.y, laserWidth, laserHeight);
    }
    setTimeout(function() {draw();}, 800);
}    
