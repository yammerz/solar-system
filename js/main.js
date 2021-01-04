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


var sun = new Image();
var moon = new Image();
var earth = new Image();
var dateTime = new Date(2021, 0, 2).getTime();
var animationID; var play = true; var canvas;


function init() {
    sun.src = 'images/sun.png';
    moon.src = 'images/moon.png';
    earth.src = 'images/earth.png';
    window.requestAnimationFrame(draw);

    canvas = document.querySelector('#canvas');
    canvas.setAttribute("width", window.innerWidth);
    canvas.setAttribute("height", window.innerHeight);
    
}




var time;
function draw() {
    var ctx = document.getElementById('canvas').getContext('2d');
    var speed = getParam("speed") ? +getParam("speed") : 1;
    speed *= 60;

    var xs = (window.innerWidth / 2) - (36 / 2);
    var ys = (window.innerHeight / 2) - (36 / 2);

    //x middle
    var xmid = (window.innerWidth / 2);
    //y middle
    var ymid = (window.innerHeight / 2);
    //get time
    time = new Date();

    //distance from sun (center) in pixels
    //a major radius
    var a = 400;
    //b minor radius
    var b = a * .04;


    //twoPi = circle / 60secs = 1 orbit per minute
    var pi = Math.PI;
    var twoPi = 2 * pi;

    //millisecond of orbit
    var ms = twoPi / (24 * 60 * 60 * 1000 * 366);
    //console.log(ms);

    var earthOrbit = (twoPi / speed) * time.getSeconds() + (twoPi / (speed * 1000)) * time.getMilliseconds();


    //var moonOrbit = earthOrbit * 3;
    var moonOrbit = earthOrbit * 12.36;

    var newDateTime = new Date(dateTime + Math.round(earthOrbit / ms));


    // Return the current x value
    function getXPos(val) {

        return canvas.width / (this.getMaxX()) * val + yPadding * yOffset;
    }

    // Return the current y value
    function getYPos() {
        return earth.offsetTop;
    }


    /**
     * Returns b (minor radius) the ellipse amount to subtract from a major radius
     * */
    function getB() {

        //convert radians to sin 
        var elliptical = Math.abs(Math.sin(earthOrbit)),

        //get amount of offset
        ellipse = b * elliptical;


        return ellipse;

    }


    ctx.globalCompositeOperation = 'destination-over';

    // clear canvas
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); 

    
    ctx.lineWidth = 12;
    ctx.strokeStyle = 'rgba(0, 153, 255, 0.3)';//blue orbit
    ctx.save();

    //find center
    ctx.translate(window.innerWidth / 2, window.innerHeight/2);

    // Earth
    ctx.rotate(earthOrbit);

    ctx.translate(a - getB(), 0);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';//shadow
    ctx.fillRect(0, -6, 40, 12); // Shadow

    //image, dx, dy, dWidth, dHeight
    ctx.drawImage(earth, -6, -6, 12, 12);

    // Moon
    ctx.save();
    ctx.rotate(moonOrbit);
    ctx.translate(0, 28.5);
    ctx.drawImage(moon, -3.5, -3.5,3,3);
    ctx.restore();


    ctx.restore();


    //draw orbit line
    ctx.beginPath();
    ctx.ellipse(xmid, ymid, a, a-b, 0, Math.PI * 2, false); // Earth orbit
    ctx.stroke();

    //sun
    ctx.drawImage(sun, xs, ys, 36, 36);
    ctx.fillStyle = 'white';
    ctx.font = `large serif`;
    ctx.fillText(newDateTime.toDateString().substr(4,11), xs - 30, ys - 50);

    //recursive call to draw to continue animation
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
