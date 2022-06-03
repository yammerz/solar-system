const P = Math.PI;
const Px2 = P*2;
const enot = 8.8541878128 * 10 ** -12;// C2/N m2
const munot = 1.25663706212 * 10 ** -6;// T m/A
const h = 6.62607015 * 10 ** -34;
const C = 299792458;
var AC = Math.log10(9) * P * Math.pow(10, 8);

const CP = 4 / 3 * P;

const G = 6.673 * 10 ** -11;
const DAY = 86400;
const V = Math.sqrt(1 / (enot * munot));

class CelestialObject {
	constructor(elem, name) {
		let x = eval(elem.getAttribute('data-mass'));
		this._name = name;
		this._mass = x.toExponential(5);
		this._diameter = elem.getAttribute('data-diameter');
		this._radius = this._diameter / 2;
		this._circumference = this._radius * 2 * P;
		this._volume = (CP * this._radius ** 3).toExponential(3);
		this._KGm3 = this._mass / this._volume;
		this._energy = (this._mass * sol2());//.toExponential(3);
		this._enRadius = Math.cbrt(this._energy / CP);//.toExponential(3);
		this._cubeRoot = (Math.cbrt(this._energy) / 2).toExponential(3);
		this._density = this._mass / this._volume;
		this._distance = Math.cbrt(this._energy) / P;
		this._seconds = this._distance / this.sol();
		this._days = this._seconds / 86400;
		this._schwarzschildRadius = 2 * G * this._mass / sol2();
		this._myFormula = `"diameter/2 x 10^8"`;
		this._myRadius = (this._diameter / 2 * 10 ** 8).toExponential(3);
		this._myVolume = (CP * this._myRadius ** 3).toExponential(3);
		this._myTime = this._myRadius / this.sol() / DAY;
		this._diff = this._energy / this._myVolume;
		this._init = this.build(elem);
	}


	build(elem) {
		let t;
		for (t in this) {
			var li = document.createElement('li');
			li.innerHTML = `${t.replace(/_/, '').wordCaps()}:<u> ${this[t]}</u>`;
			elem.insertAdjacentElement('beforeend', li);
		}

	}

	sol() {
		return getParam('c') ? window[getParam('c')] : C;
	}
	static Sol() {
		return getParam('c') ? window[getParam('c')] : C;
    }



}

/**
 * Returns the requested param value, and is optionally a decodeURIComponent or raw.
 * @param {string } param
 * @param {boolean} bool
 */
function getParam(param, bool) {
	let a, params = location.search.substr(1), arr = params.split('&');

	for (a of arr) {
		//If decoded
		if (a.match(param) && bool) {
			return decodeURIComponent(a.split('=')[1]);
		}
		//if not decoded
		else if (a.match(param)) {
			return a.split('=')[1];
		}
	}
	return null;
}



class Planet {
	constructor(name){
		
		this.name = name.toUpperCase();
		let PLANET = SOLARSYSTEMOBJECTS[this.name];

		for(let prop in PLANET){

		this[prop] = PLANET[prop];

		}

		this.init();

	}


	init(){

		let time = new Date();
		this.image = new Image();
		this.image.src = `images/${this.name.toLowerCase()}.png`; 

		this.size = this.Diameter_km / SOLARSYSTEMOBJECTS['EARTH'].Diameter_km;


		//x middle
		this.xmid = (window.innerWidth / 2);
		//y middle
		this.ymid = (window.innerHeight / 2);

		//distance from sun (center) in pixels
		//a major radius
		this.a = 75 * this.PlanetNumber;
		//b minor radius
		this.b = this.a * .04;

		var speed = getParam("speed") ? +getParam("speed") : 1;
    	speed *= 60;

		//Px2 = (6.28...) circle / 60secs = 1 orbit per minute
		//0 degrees is at the current date
		this.orbit = (Px2 / speed) * time.getSeconds() + (Px2 / (speed * 1000)) * time.getMilliseconds();


		if(this.name.match(/earth/i)){
			this.moon = new Image();
			this.moon.src = 'images/moon.png';
		}


	}

	draw(ctx){
 

		//millisecond of orbit
		var ms = Px2 / (+this.RotationPeriod_hours * 60 * 60 * 1000 * this.OrbitalPeriod_days);
		

		this.newDateTime = new Date(dateTime + Math.round(this.orbit / ms));
		
		ctx.save();


		//find center
		ctx.translate(window.innerWidth / 2, window.innerHeight/2);

		//rotate planet
		ctx.rotate(this.orbit);
		ctx.translate(this.a - this.#getB(), 0);

		
		//image, dx, dy, dWidth, dHeight
		ctx.drawImage(this.image, -6, -6, 12, 12);

		// Moon
		if(Object.prototype.hasOwnProperty.call(this, 'moon')){
			this.#moon(ctx);
		}


		ctx.restore();


		//draw planet orbit line
		//thickness relative to planet size
		ctx.lineWidth = 12*this.size;
		ctx.strokeStyle = ORBITCOLOR[this.PlanetNumber-1];//blue orbit
		ctx.beginPath();
		ctx.ellipse(this.xmid, this.ymid, this.a, this.a-this.b, 0, Math.PI * 2, false); //orbit
		ctx.stroke();
	}

	#moon(ctx){

		//earth's shadow is drawn a part of earth and must be set here...
		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';//shadow color
		ctx.fillRect(0, -6, 40, 12); // Shadow area

		var moonOrbit = this.orbit * 12.36;


		ctx.rotate(moonOrbit);
		ctx.translate(0, 28.5);
		ctx.drawImage(this.moon, -3.5, -3.5,3,3);

		ctx.restore();

	}
	/**
	 * Returns b (minor radius) the ellipse amount to subtract from a major radius
	 * */
	#getB() {

		//convert radians to sin 
		var elliptical = Math.abs(Math.sin(this.orbit)),

		//get amount of offset
		ellipse = this.b * elliptical;


		return ellipse;
	
	}

}