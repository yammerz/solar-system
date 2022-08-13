/*global SOLARSYSTEMOBJECTS, SEASONS*/
// eslint-disable-next-line no-unused-vars
class Planet {
	/**
	 * Returns a Planet with draw method.
	 * @param {*} object Planet JSON parameters
	 * @param {*} options
	 */
	constructor(object, options) {
		for (const prop in object) {
			this[prop] = object[prop];
		}

		for (const prop in options) {
			this[prop] = options[prop];
		}
		this.date = new Date();
		this.aphelion = this.#getSeason("july", this.date.getUTCFullYear());
		this.perihelion = this.#getSeason("january", this.date.getUTCFullYear());
		this.offset = this.#getOffset(this.date); //Today date relative to aphelion
		
		this.pi2Milliseconds = this.name.match(/earth/i) ? this.#getOrbitYear() : 1;
		this.frame = this.name.match(/earth/i) ? this.offset : 1;
		this.#init();
	}

	/**
	 * Draw the planet.
	 * @param {*} ctx the canvas 2d context
	 */
	draw(ctx) {
		
		const daysYear = this.date.isLeapYear() ? 366 : 365;
		const millisecondsDay = this.pi2Milliseconds / daysYear;
		const speed = this.controls.speed;

		this.frame += (millisecondsDay / 10) * speed;

		//other planetary orbit speeds are scaled to Earth's relative speed.
		const relativeOrbit =
			SOLARSYSTEMOBJECTS["EARTH"].OrbitalPeriod_days / this.OrbitalPeriod_days;

		//Math.PI * 2 = (6.28...) circle / 61secs = 1 orbit per ~minute
		//[1,0] on the unit circle is aphelion
		//[-1,0] = perihelion
		//orbit in radians
		this.orbit =
			(this.frame / this.pi2Milliseconds) * Math.PI * 2 * speed * relativeOrbit;

		//position in orbit using milliseconds
		//This works bc animationFrame is ~second/60
		const ms = (Math.PI * 2) / this.pi2Milliseconds;

		//get dateTime for display.
		//Accessed from planet object during animation.
		this.newDateTime = new Date(
			this.dateTime + Math.round(this.orbit / ms) - this.offset
		);

		//save the canvas state
		ctx.save();

		//find center
		ctx.translate(window.innerWidth / 2, window.innerHeight / 2);

		//rotate planet around sun in radians
		ctx.rotate(this.orbit);
		ctx.translate(this.a - this.#getB(), 0);

		//image, dx, dy, dWidth, dHeight
		let delta = this.size / -2;
		ctx.drawImage(this.image, delta, delta, this.size, this.size);

		// Moon
		if (Object.prototype.hasOwnProperty.call(this, "moon")) {
			this.#drawMoon(ctx);
			this.#drawDate(ctx);
			this.controls.orbitPath && this.#drawSeasons(ctx);
		}

		//restore the canvas state
		ctx.restore();

		//draw planet orbit line
		//thickness relative to planet size
		ctx.lineWidth = this.size;
		ctx.strokeStyle = this.orbitColor; //orbit color
		ctx.beginPath();
		ctx.ellipse(
			this.xmid,
			this.ymid,
			this.a,
			this.a - this.b,
			0,
			Math.PI * 2,
			false
		); //orbit path

		this.controls.orbitPath && ctx.stroke();

	}

	/**
	 * Draw Earth's orbit date above the sun.
	 * Animation starts on the current date.
	 * @param {*} ctx the canvas context
	 */
	#drawDate(ctx) {

		ctx.fillStyle = "white";
		ctx.font = "small large serif";

		//offset are used to get text into position above the sun.
		const xOffset = this.dx - this.size / 1.3;
		const yOffset = this.dy - this.size / 2;
		ctx.fillText(
			this.newDateTime.toDateString().substring(4, 11),
			xOffset,
			yOffset
		);
	}

	/**
	 * Draw the moon if the planet has moon
	 * nearest = perigee
	 * farthest apogee
	 * @param {*} ctx
	 */
	#drawMoon(ctx) {
		//draw behind existing content
		ctx.globalCompositeOperation = "destination-over";
	
		//earth's shadow is drawn a part of earth and must be set here...
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; //shadow color
		ctx.fillRect(0, -6, 50, 12); // Shadow area
	
			
	
		var moonOrbit = this.orbit * 12.36;
	
		let size =
				(SOLARSYSTEMOBJECTS["MOON"].Diameter_km /
					SOLARSYSTEMOBJECTS["EARTH"].Diameter_km) *
				12;
	
		ctx.rotate(moonOrbit);
		ctx.translate(0, 28.5);
		ctx.drawImage(this.moon, -3.5, -3.5, size, size);
	
		ctx.restore();
	}

	/**
	 * Draw the seasons date and location around Earth's orbit
	 * @param {*} ctx
	 */
	#drawSeasons(ctx) {
		//x,y are used to find center canvas.
		const x = window.innerWidth / 2;
		const y = window.innerHeight / 2;

		//S as an alias to SEASONS for easier object access.
		const S = SEASONS["EARTH"][this.date.getUTCFullYear()];

		for(const month in S){

			//radians = get the date location angle in orbit
			let radians = (this.#getOffset(new Date(S[month].date)) / this.pi2Milliseconds) * Math.PI * 2;

			//recenter the ctx
			ctx.translate(x, y);
			//rotate is next, because rotation happens around the center of ctx.
			ctx.rotate(radians);
			//now translate the x value
			ctx.translate(this.a, 0);

			//default fillText args (text, xx, yy)
			let text = `— ${new Date(S[month].date).toDateString().substring(4, 11)} ${S[month].season}`;
			let xx = 10;
			let yy = 0;

			//conditional args
			if(month.match(/december|january/i)){
				ctx.scale(-1,-1);
				text = `${new Date(S[month].date).toDateString().substring(4, 11)} ${S[month].season} —`;
				xx = month.match(/dec/i) ? -108 : -118;
			}

			//draw the seasons
			ctx.fillText(
				text,
				xx,
				yy
			);
	
			//reset and ready for next one.
			ctx.resetTransform();

		}



	}

	/**
	 * Used to calculate an elliptical orbit.
	 * Returns b (minor radius)
	 * The ellipse amount to subtract from a major radius
	 * */
	#getB() {
		//convert radians to sin
		const elliptical = Math.abs(Math.sin(this.orbit));

		//get amount of offset
		const ellipse = this.b * elliptical;

		return ellipse;
	}

	/**
	 * Orbit date offset from july aphelion in radians.
	 * July aphelion is used because this is 0 radians,
	 * the starting point for the rotate method.
	 * @param {*} date 
	 * @returns the time delta for a given date and aphelion. 
	 */
	#getOffset(date) {
		const yyyy = date.getUTCFullYear();
		const aphelion = new Date(SEASONS["EARTH"][yyyy]["july"].date).getTime();
		const delta = date - aphelion;
		return delta;
	}

	/**
	 * This value is used to calculate the orbit.
	 * This value / 2π
	 * @returns the milliseconds for 1 complete orbit of earth
	 */
	#getOrbitYear() {
		const m = "january";
		const nextPerihelion = this.#getSeason(
			m,
			this.date.getUTCFullYear() + 1
		);
		const currentPerihelion = new Date(SEASONS["EARTH"][this.date.getUTCFullYear()][m].date);
		const delta = nextPerihelion - currentPerihelion;
		return delta;
	}

	/** Seasons are currently for "EARTH" only.
	 * @param {*} month the month pertaining to the apsides and seasons.
	 * @param {*} yyyy the given year.
	 * @returns the date timestamp of the season.
	 */
	#getSeason(month, yyyy) {
		const timestamp = new Date(SEASONS["EARTH"][yyyy][month].date).getTime();
		return timestamp;
	}

	/**
	 * Initiatilize the Planet
	 */
	#init() {
		this.image = new Image();
		this.image.src = `assets/${this.name.toLowerCase()}.png`;

		this.size = (this.Diameter_km / SOLARSYSTEMOBJECTS["EARTH"].Diameter_km) * 12;

		//x middle
		this.xmid = window.innerWidth / 2;
		//y middle
		this.ymid = window.innerHeight / 2;

		//distance from sun (center) in pixels
		//a major radius
		//not using scale values for practicality.
		this.a = 75 * this.PlanetNumber;

		//b minor radius — the amount to subtract from r
		this.b = this.a * 0.0001;

		if (this.name.match(/earth/i)) {
			this.moon = new Image();
			this.moon.src = "assets/moon.png";
			this.b = this.a * 0.04;
		}
	}

}
