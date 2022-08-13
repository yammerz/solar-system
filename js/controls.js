/**
 *A class to control optional parameters of the solar system.
 *ie, speed of orbital rotation, orbitPaths, zoom-in/out
 * @class Controls
 */
class Controls {
	/**
	 *Creates an instance of Controls.
	 * @param {*} type options property to select auto
	 * or keyboard.
	 * @memberof Controls
	 */
	constructor(type) {
		this.type = type;
		this.faster = false;
		this.slower = false;
		this.pause = false;
		this.zoomOut = false;
		this.zoomIn = false;
		this.speed = 1;
		this.orbitPath = true;

		switch (type) {
		case "KEYS":
			this.#addKeyboardListeners();
			break;
		case "AUTO":
			break;
		}
	}

	#addKeyboardListeners() {
		document.onkeydown = (event) => {
			switch (event.key) {
			case "ArrowLeft":
				this.zoomOut = true;
				this.zoomIn = false;
				break;
			case "ArrowRight":
				this.zoomOut = false;
				this.zoomIn = true;
				break;

			case "1":
				this.speed = 1;
				break;
			case "+":
				this.speed *= 1.1;
				break;
			case "-":
				this.speed /= 1.1;
				break;
			case "t":
				this.orbitPath = true;
				break;
			case "f":
				this.orbitPath = false;
				break;
			case " ":
				this.pause = this.pause ? false : true;
				break;

			}
		};

		document.onkeyup = (event) => {
			switch (event.key) {
			case "ArrowLeft":
				this.zoomOut = false;
				break;
			case "ArrowRight":
				this.zoomIn = false;
				break;
			}
		};
	}
}
