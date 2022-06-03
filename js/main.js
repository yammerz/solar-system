//credits
//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations


//true if is leapyear
Date.prototype.isLeapYear = function () {
    var year = this.getFullYear();
    if ((year & 3) != 0) return false;
    return ((year % 100) != 0 || (year % 400) == 0);
};

// Get Day of Year
Date.prototype.getDayOfYear = function () {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if (mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
};

const PLANETS = [
    'MERCURY',
    'VENUS',
    'EARTH'
]; 

var sun = new Image();
var date = new Date();
var yyyy = date.getFullYear();
var m = date.getMonth();
var d = date.getDate();
var dateTime = new Date(yyyy, m, d).getTime();
var animationID; var play = true; var canvas;


function init() {
    sun.src = 'images/sun.png';
    //moon.src = 'images/moon.png';
    //earth.src = 'images/earth.png';
    window.requestAnimationFrame(draw);

    canvas = document.querySelector('#canvas');
    canvas.setAttribute("width", window.innerWidth);
    canvas.setAttribute("height", window.innerHeight);
    
}




var time;
function draw() {
    var ctx = document.getElementById('canvas').getContext('2d');
    var xs = (window.innerWidth / 2) - (36 / 2);
    var ys = (window.innerHeight / 2) - (36 / 2);

    //draw behind existing content
    //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    ctx.globalCompositeOperation = 'destination-over';

     //starts with a clear canvas
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); 



    ctx.drawImage(sun, xs, ys, 36, 36);

    // var earth = new Planet('EARTH');
    // var mercury = new Planet('MERCURY');
    // mercury.draw(ctx);
    // earth.draw(ctx);
    for(let p of PLANETS){
        let planet = new Planet(p);
        planet.draw(ctx);
    }
    


    //draw sun
    //ctx.drawImage(sun, xs, ys, 36, 36);


    //recursive call to draw to continue animation
    //animationID variable allows us to start stop
    //the current animation with cancelAnimationFrame
    animationID = window.requestAnimationFrame(draw);


    

}

function draw1() {
    var ctx = document.getElementById('canvas').getContext('2d');
    var xs = (window.innerWidth / 2) - (36 / 2);
    var ys = (window.innerHeight / 2) - (36 / 2);

    //draw behind existing content
    //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    ctx.globalCompositeOperation = 'destination-over';



    //draw earth
    var earth = new Planet('EARTH');
    earth.draw(ctx);
    
    //var mercury = new Planet('MERCURY');
    //mercury.draw(ctx);
    //ctx.save();
    
    //draw date
    ctx.fillStyle = 'white';
    ctx.font = `small large serif`;
   
    ctx.fillText(earth.newDateTime.toDateString().substr(4,11), xs - 16, ys - 10);
    //ctx.fillText(mercury.newDateTime.toDateString().substr(4,11), xs - 30, ys - 50);

    //draw sun
    ctx.drawImage(sun, xs, ys, 36, 36);
    //ctx.save();
 


    //recursive call to draw to continue animation
    //animationID variable allows us to start stop
    //the current animation with cancelAnimationFrame
    animationID = window.requestAnimationFrame(draw);


    

}


init();

window.addEventListener('click', () => {
    if (play) {
        window.cancelAnimationFrame(animationID);
        play = false;
    } else {
        init();
        play = true;
    }
});

console.info("Earth's orbit is set for 60 seconds with speed param set to 1.\nSpeed == minutes per orbit");
