//date is used to calculate the ordbit
const date = new Date();
const params = new URLSearchParams(location.search);
const options = {
	dateTime: new Date(
		date.getFullYear(), //yyyy
		date.getMonth(), //m
		date.getDate() //d
	).getTime(),

	orbitPath: +params.get("orbitPath"), //show the orbitPath boolean 1 or 0
	scale: +params.get("scale"), //
	speed: +params.get("speed"),
	size: 20
};
const sun = new Image();
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let animationID;
let play = true;

function init() {
	//set canvas to full width and height
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	sun.src = "images/sun.png";

	//initialize the animation
	window.requestAnimationFrame(animate);
}

function animate() {
	const PLANETS = ["MERCURY", "VENUS", "EARTH"];
	const size = 20;
	const xs = window.innerWidth / 2 - size / 2;
	const ys = window.innerHeight / 2 - size / 2;

	//starts with a clear canvas
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	//overlay to darken stars
	ctx.fillStyle = "rgba(0,0,0,0.7)";
	ctx.fillRect(0, 0, innerWidth, innerHeight);

	//draw sun
	ctx.drawImage(sun, xs, ys, size, size);

	//scale to create a zoom out/away effect
	+params.get("scale") && ctx.scale(0.999, 0.999);

	for (let p of PLANETS) {
		// eslint-disable-next-line no-undef
		let planet = new Planet(SOLARSYSTEMOBJECTS[p], options);
		planet.draw(ctx);
		if (planet.name.match(/earth/i)) {
			//draw date
			ctx.fillStyle = "white";
			ctx.font = "small large serif";
			const xOffset = xs - size / 2;
			const yOffset = ys - size / 2;
			ctx.fillText(
				planet.newDateTime.toDateString().substring(4, 11),
				xOffset,
				yOffset
			);
		}
	}

	//recursive call to draw to continue animation
	//animationID variable allows us to start stop
	//the current animation with cancelAnimationFrame
	//which is called from the window click eventlistener
	animationID = window.requestAnimationFrame(animate);
}

init();

window.addEventListener("click", () => {
	if (play) {
		window.cancelAnimationFrame(animationID);
		play = false;
	} else {
		init();
		play = true;
	}
});

// eslint-disable-next-line no-console
console.info(
	`Earth completes 1 ordbit in 60 seconds with speed param set to 1.\n
	Speed == minutes per orbit. \n
	The planetary motion animation is using Date object milliseconds`
);
