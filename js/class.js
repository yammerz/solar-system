const P = Math.PI;
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