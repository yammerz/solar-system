// eslint-disable-next-line no-unused-vars
class SpaceObject {
    constructor(elem, name, constants) {
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
        this._myFormula = '"diameter/2 x 10^8"';
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