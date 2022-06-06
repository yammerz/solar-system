var massObject;
const sun = new Image();
sun.src = "images/sun.png";

const earth = new Image();
earth.src = "images/earth.png";

const mx = innerWidth/2;
const my = innerHeight/2;

function startGame() {

    massObject = new Mass(20, 20, "red", mx-200, my);
    screenArea.start();
    window.addEventListener("click", ()=> screenArea.stop());

 
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
    this.speedX = 0.0;
    this.speedY = -2.00;    
    this.gravity = 0.01;
    this.gravityX = 0.01;
    this.gravityY = -0.01;
    this.gravitySpeed = 0;
    this.gravitySpeedX = 0;
    this.gravitySpeedY = 0;

    }
    update(ctx) {
        ctx = screenArea.context;
        ctx.fillStyle = this.color;
        ctx.drawImage(earth, this.x, this.y, this.width, this.height);
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        //console.log(this.x, this.y);
    }
    newPos() {
        this.gravitySpeed += this.gravity;

        this.gravitySpeedX += this.gravityX;
        this.gravitySpeedY += this.gravityY;

        if(this.x > mx){
            this.gravityX = -0.01;
            //this.x += this.speedX + (this.gravitySpeedX**2)*-1;
        }
        else{
            this.gravityX = 0.01;
            //this.x += this.speedX + this.gravitySpeedX**2;
        }

        if(this.y < my){
            this.gravityY = 0.01;
            //this.y += this.speedY + this.gravitySpeedY**2; 
        }
        else{
            this.gravityY = -0.01;
            //this.y += this.speedY + (this.gravitySpeedY**2)*-1; 
        }
 

        //console.log(this.speedX, this.speedY, this.gravityX, this.gravitySpeedX);

        this.x += this.speedX + this.gravitySpeedX;
        this.y += this.speedY + this.gravitySpeedY; 

        //this.y += this.speedY + this.gravitySpeed**2; 

        //console.log(this.speedY + this.gravitySpeedY, this.y, my);


    }
}


function animate(){
    screenArea.clear();
    screenArea.context.drawImage(sun, innerWidth/2, innerHeight/2, 30, 30);
    massObject.newPos();
    massObject.update(screenArea.context);
}