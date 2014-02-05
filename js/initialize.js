var invaders;
var canvas;
var context;
var direction = 0; //0 = right, 1 = left
var tank;
var defenderImg;
var invaderImg;
var descend =false;
var laser = null;
var invaderSpeed;
var totalScore;

//constants
var numColInvaders = 12;
var numRowInvaders = 5;
var invaderHeight;
var invaderWidth;
var laserWidth = 1;
var laserHeight = 8;
var defenderHeight = 30;
var defenderWidth = 30;
var tankHeightRatio = 0.92;


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
    keySetup("menu");
    menuSetup();
}

function menuSetup(){
    context.clear(true);
    context.font = '20pt Arial';
    context.textAlign = "center";
    context.fillStyle = "#000000";
    context.fillText("AppInvaders", canvas.width/2, canvas.height/5);

    context.font = '15pt Arial';
    context.textAlign = "center";
    context.fillStyle = "#000000";
    context.fillText("Press 1 to begin Level 1", canvas.width/2, canvas.height/3.5);
    context.fillText("Press 2 to begin Level 2", canvas.width/2, canvas.height/2.9);
    context.fillText("Press 3 to begin Level 3", canvas.width/2, canvas.height/2.5);
    totalScore = 0;
}

function keySetup(type){
    switch(type){
        case "menu":
            canvas.onkeyup = function(event){
                var keyCode;
                if(event == null){
                    keyCode = window.event.keyCode;
                } else {
                    keyCode = event.keyCode;
                }
                switch(keyCode){
                    case 49:
                        initializeGame(1);
                        invaderSpeed = 800;
                        break;
                    case 50:
                        initializeGame(2);
                        invaderSpeed = 500;
                        break;
                    case 51:
                        initializeGame(3);
                        invaderSpeed = 300;
                        break;
                    default:
                        break;
                }
            }
            break;
        case "game":
            canvas.onkeydown = function(event){
                var keyCode;
                if (event == null){
                    keyCode = window.event.keyCode;
                } else{
                    keyCode = event.keyCode;
                }

                switch(keyCode){
                    //left key
                    case 37:
                        moveTankLeft();
                        break;
                    //up key
                    case 32:
                        fire();
                        break;
                    //right key
                    case 38:
                        fire();
                        break;
                    case 39:
                        moveTankRight();
                        break;
                    //down key
                    case 40:
                        break;
                    default:
                        break;
                }
            }
            break;
        default:
            canvas.onkeyup = null;
            canvas.onkeydown = null;
    }
}

function initializeGame(level){
    canvas.onkeyup = null;
    context.clear(true);

    invaderHeight = Math.round(canvas.width/18);
    invaderWidth = Math.round(canvas.width/18); //11

    tank = new Tank(canvas.width/2, canvas.height * tankHeightRatio);

    invaders = new Array(numRowInvaders);
    for (var i = 0; i < invaders.length; i++) {
        invaders[i] = new Array(numColInvaders);
    }

    defenderImg = new Image();
    defenderImg.onload = function() {
        context.drawImage(tank.x, tank.y, defenderWidth, defenderHeight);
    };
    defenderImg.src = 'images/robot.png';

    invaderImg = new Image();
    invaderImg.onload = function() {
        for(var i = invaders.length - 1; i >= 0; i--){
            for(var j = 0; j < invaders[i].length; j++){
                context.drawImage(invaders[i][j].x, invaders[i][j].y, invaderWidth, invaderHeight);
            }
        }
    };
    invaderImg.src = 'images/apple.png';


    initializeInvaders();
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

    draw();
    keySetup("game");
}

function fire(){
    if (laser != null) return;
    laser = new Laser(tank.x + invaderWidth/2, tank.y - invaderHeight);
    drawLaser();
}

function moveTankLeft(){
    context.clearRect(tank.x, tank.y, defenderWidth, defenderHeight);
    context.clear
    if (tank.x - 8 > 0){
        tank.x -= 8;
    }
    context.drawImage(defenderImg, tank.x, tank.y, defenderWidth, defenderHeight);
    //context.fillStyle = "#000000";
    //context.fillRect(tank.x, tank.y, 30, 12);
}

function moveTankRight(){
    context.clearRect(tank.x, tank.y, defenderWidth, defenderHeight);
    if (tank.x + 38 < canvas.width){
        tank.x += 8;
    }
    context.drawImage(defenderImg, tank.x, tank.y, defenderWidth, defenderHeight);
    //context.fillStyle = "#000000";
    //context.fillRect(tank.x, tank.y, 30, 12);
}

function drawLaser() {
    if(invaders[0][0].y > laser.y) laser = null;
    if (laser.y < 0) laser = null;
    if(laser == null) return;

    context.clearRect(laser.x - 1, laser.y, laserWidth + 2, laserHeight);
    laser.y -=10;
    context.fillStyle = "#000000";
    context.fillRect(laser.x, laser.y, laserWidth, laserHeight);

    for(var i = invaders.length - 1; i >= 0; i--){
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
        totalScore += 1;
    }
}


function draw(){
    context.clear(true);
    context.font = '15pt Arial';
    context.textAlign = "center";
    context.fillStyle = "#000000";
    context.fillText("Score: " + totalScore, 50, 20);
    for(var i = 0; i < invaders.length; i++){
        for(var j = 0; j < invaders[i].length; j++){
            if (invaders[i][j].hit == false){
                if(invaders[i][j].y + invaderHeight > canvas.height * tankHeightRatio){
                    alert("game over");
                    return;
                }
                context.drawImage(invaderImg, invaders[i][j].x, invaders[i][j].y, invaderWidth, invaderHeight);
                //context.fillStyle = "#0B5FA5";
                //context.fillRect(invaders[i][j].x, invaders[i][j].y, invaderWidth, invaderHeight);
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
            descend = true;
        } else if (invaders[0][0].x < (canvas.width * 0.03)) {
            direction = 0;
            descend = true;
        }
    }
    //context.fillStyle = "#000000";
    //context.fillRect(tank.x, tank.y, 30, 12);
    context.drawImage(defenderImg, tank.x, tank.y, defenderWidth, defenderHeight);
    if (laser != null) {
        context.fillStyle = "#000000";
        context.fillRect(laser.x, laser.y, laserWidth, laserHeight);
    }
    setTimeout(function() {draw();}, invaderSpeed);
}    
