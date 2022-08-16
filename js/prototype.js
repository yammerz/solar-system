//true if leapyear
//using for calculating orbits
Date.prototype.isLeapYear = function () {
	const year = this.getFullYear();
	if ((year & 3) !== 0) return false;
	return year % 100 !== 0 || year % 400 === 0;
};

// Get Day of Year
Date.prototype.getDayOfYear = function () {
	const dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	const mn = this.getMonth();
	const dn = this.getDate();
	let dayOfYear = dayCount[mn] + dn;
	if (mn > 1 && this.isLeapYear()) dayOfYear++;
	return dayOfYear;
};
