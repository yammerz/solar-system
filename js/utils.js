//true if leapyear
//using for calculating orbits???
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

