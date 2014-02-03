var invaders;
var canvas;
var context;
var direction = 0; //0 = right, 1 = left
var paddle;
var descend =false;

function Invader(x, y) {
    this.x = x;
    this.y = y;
}

function Paddle(x, y) {
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
    paddle = new Paddle(250, 370);
    invaders = new Array(10);
    for (var i = 0; i < invaders.length; i++) {
        invaders[i] = new Array(13);
    }
    initializeInvaders();
    draw();
}

function initializeInvaders(){
    var x = 45;
    var y = 45;
    for(var i = 0; i < invaders.length; i++){
        for(var j = 0; j < invaders[i].length; j++){
            invaders[i][j] = new Invader(x, y);
            x += 30;
        }
        x = 45;
        y += 15;
    }
}

function draw(){
    context.clear(true);
    for(var i = 0; i < invaders.length; i++){
        for(var j = 0; j < invaders[i].length; j++){
            context.fillStyle = "#000000";
            context.fillRect(invaders[i][j].x, invaders[i][j].y, 25, 10);
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
        if(invaders[0][12].x > (canvas.width * 0.92)){
            direction = 1;
            descend = true;
        } else if (invaders[0][0].x < (canvas.width * 0.03)) {
            direction = 0;
            descend = true;
        }
    }
    setTimeout(function() {draw();}, 800);
}    
