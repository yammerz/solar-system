/*global SOLARSYSTEMOBJECTS, Planet, Controls*/
const date = new Date();
const options = (function () {
	//The options params to pass into Planet constructor.

	//The size of the sun.
	const size = 20;

	return {
		dateTime: new Date(
			date.getFullYear(), //yyyy
			date.getMonth(), //m
			date.getDate() //d
		).getTime(),
		scale: false, //
		speed: 1,
		size: size,
		dx: window.innerWidth / 2 - size / 2,//middle x
		dy: window.innerHeight / 2 - size / 2,//middle y
		planets: ["MERCURY", "VENUS", "EARTH"],// ? Add remaining planet images 
		controls: new Controls(["KEYS", "AUTO"][0])
	};
})();
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const sun = new Image();
const planets = [];
let animationID;
let play = true;

const init = () => {
	//set canvas to full width and height
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	sun.src = "images/sun.png";

	if (planets.length === 0) {
		for (let p of options.planets) {
			let planet = new Planet(SOLARSYSTEMOBJECTS[p], options);
			planets.push(planet);
		}
	}

	//initialize the animation
	window.requestAnimationFrame(animate);
};

/**
 * Must redraw the canvas each frame (draw) to prevent trails and stacked images.
 */
const refreshCanvas = () => {
	//starts with a clear canvas
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	//overlay to darken stars, because universe image to bright
	ctx.fillStyle = "rgba(0,0,0,0.7)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//draw sun in the center of the canvas
	ctx.drawImage(sun, options.dx, options.dy, options.size, options.size);

};

/**
 * Animate the planets in their respective orbits.
 * Recursively call the window requestAnimationFrame
 * 60/second.
 */
const animate = () => {
	
	//start/stop animation with spacebar
	if(!options.controls.pause){

		refreshCanvas();
		//scale to create a zoom in/out effect
		options.controls.zoomOut && ctx.scale(0.999, 0.999);
		options.controls.zoomIn && ctx.scale(1.001, 1.001);

		//loop planets draw() to animate
		for (let planet of planets) {
			planet.draw(ctx);
		}

		//recursive call to draw to continue animation
		//animationID variable allows us to start stop
		//the current animation with cancelAnimationFrame
		//which is called from the window click eventlistener
	
		animationID = window.requestAnimationFrame(animate);
	}
	else{
		//allow animate() to continue to run with a call limit
		setTimeout(() => {
			animate();
		}, 100);

	}
};


// Attach a click listener to the window to start/stop the animation.
window.addEventListener("click", () => {
	if (play) {
		window.cancelAnimationFrame(animationID);
		play = false;
	} else {
		//call init to restart
		init();
		play = true;
	}
});



console.info("%c Solar system is not shown to scale.", "color:red");
console.info("%c Earth completes 1 ordbit in ~61 seconds with default speed (1).", "color:orange");
console.info("%c Increase/decrease the speed of the orbits with keyboard +/-", "color:green");
console.info("%c Toggle visibility of orbitPaths t or f.", "color:blue");


init();
