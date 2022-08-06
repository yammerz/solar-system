/*global SOLARSYSTEMOBJECTS*/
// eslint-disable-next-line no-unused-vars
class Planet {
	constructor(object, options){
		
		for(const prop in object){
			this[prop] = object[prop];
		}

		for(const prop in options){
			this[prop] = options[prop];
		}

		this.init();
	}


	init(){
		let time = new Date();
		this.image = new Image();
		this.image.src = `images/${this.name.toLowerCase()}.png`; 

		this.size = (
			this.Diameter_km / 
			SOLARSYSTEMOBJECTS['EARTH'].Diameter_km
		)*12;


		//x middle
		this.xmid = (window.innerWidth / 2);
		//y middle
		this.ymid = (window.innerHeight / 2);

		//distance from sun (center) in pixels
		//a major radius
		this.a = 75 * this.PlanetNumber;
		//b minor radius
		this.b = this.a * .04;

		var speed = this.speed;
		speed *= 60;

		let relativeOrbit =  SOLARSYSTEMOBJECTS['EARTH'].OrbitalPeriod_days /
		this.OrbitalPeriod_days;

		//Math.PI * 2 = (6.28...) circle / 60secs = 1 orbit per minute
		//0 degrees is at the current date
		this.orbit = (
			(Math.PI * 2 / speed) * time.getSeconds() + 
			(Math.PI * 2 / (speed * 1000)
			) * time.getMilliseconds()) * relativeOrbit;


		if(this.name.match(/earth/i)){
			this.moon = new Image();
			this.moon.src = 'images/moon.png';
		}


	}

	draw(ctx){
		
		//millisecond of orbit
		var ms = Math.PI * 2 / 
		(+this.RotationPeriod_hours * 60 * 60 * 1000 * this.OrbitalPeriod_days);

		//get dateTime for display. 
		//Accessed from planet object during animation.
		this.newDateTime = new Date(
			this.dateTime + Math.round(this.orbit / ms)
		);
		
		//save the canvas state
		ctx.save();
		//find center
		ctx.translate(window.innerWidth / 2, window.innerHeight/2);

		//rotate planet
		ctx.rotate(this.orbit);
		ctx.translate(this.a - this.#getB(), 0);
		//ctx.save();

		
		//image, dx, dy, dWidth, dHeight
		let offset = this.size/-2;
		ctx.drawImage(this.image, offset, offset, this.size, this.size);


		// Moon
		if(Object.prototype.hasOwnProperty.call(this, 'moon')){
			this.#moon(ctx);
		}


		//restore the canvas state
		ctx.restore();


		//draw planet orbit line
		//thickness relative to planet size
		ctx.lineWidth = this.size;
		ctx.strokeStyle = this.orbitColor;//orbit color
		ctx.beginPath();
		ctx.ellipse(
			this.xmid, this.ymid, this.a, this.a-this.b, 0, Math.PI * 2, false
		); //orbit path
		
		this.orbitPath && ctx.stroke();
	}

	#moon(ctx){

		//draw behind existing content
		ctx.globalCompositeOperation = 'destination-over';

		//earth's shadow is drawn a part of earth and must be set here...
		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';//shadow color
		ctx.fillRect(0, -6, 50, 12); // Shadow area

		var moonOrbit = this.orbit * 12.36;

		let size = (
			SOLARSYSTEMOBJECTS['MOON'].Diameter_km / 
			SOLARSYSTEMOBJECTS['EARTH'].Diameter_km
		)*12;


		ctx.rotate(moonOrbit);
		ctx.translate(0, 28.5);
		ctx.drawImage(this.moon, -3.5, -3.5,size,size);

		ctx.restore();

	}

	/**
	 * Returns b (minor radius) 
	 * The ellipse amount to subtract from a major radius
	 * */
	#getB(){

		//convert radians to sin 
		const elliptical = Math.abs(Math.sin(this.orbit));

		//get amount of offset
		const ellipse = this.b * elliptical;

		return ellipse;
	
	}

}
