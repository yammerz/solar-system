var massObject;
const sun = new Image();
sun.src = "images/sun.png";

const earth = new Image();
earth.src = "images/earth.png";

const mx = innerWidth/2;
const my = innerHeight/2;
var play = true;

function startGame() {

    massObject = new Mass(20, 20, "red", mx-200, my);
    screenArea.start();
    window.addEventListener("click", ()=> {
        if (play) {
                screenArea.stop();
                play = false;
            } else {
                screenArea.start();
                play = true;
            }
    });

 
}

var screenArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(animate, 20);        
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
       
        !+getParam("orbit") &&
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
     
    }
}

class Mass
{
    constructor(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.color = color;
    this.speedX = 0;
    this.speedY = -2;    
    this.gravity = 0.01;
    this.gravityX = 0.01;
    this.gravityY = 0.01;
    this.gravitySpeed = 0;
    this.gravitySpeedX = 0;
    this.gravitySpeedY = 0;
    this.crossX = false;
    this.crossY = false;
    this.last = [[]];
    this.n = 0;

    }

    update(ctx) {
        ctx = screenArea.context;
        ctx.fillStyle = this.color;
        ctx.drawImage(earth, this.x, this.y, this.width, this.height);
        this.last.push([this.x,this.y]);
        if(this.last.length > 2){
            this.last.shift();
        }
    }

    g() {
    
        //REMEMBER THAT y origin in at the top
        //so this.y < midpoint is above that point


        if(this.x >= mx){
            this.gravityX = -0.01;
        }
        else{
            this.gravityX = 0.01;
        }
        

        if(this.y <= my){
            this.gravityY = 0.01;
        }
        else{
            this.gravityY = -0.01;
        }


        this.gravitySpeedX += this.gravityX ;
        this.gravitySpeedY += this.gravityY ;

        if(+getParam("linear")){
    
            this.x += this.speedX + this.gravitySpeedX;
            this.y += this.speedY + this.gravitySpeedY; 
        }
        else{
            this.x += this.speedX + (this.gravitySpeedX**2);
            this.y += this.speedY + (this.gravitySpeedY**2); 

        }

    
    }

}


function animate(){
    screenArea.clear();
    screenArea.context.drawImage(sun, innerWidth/2, innerHeight/2, 30, 30);
    massObject.g();
    massObject.update(screenArea.context);
}