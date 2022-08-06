// eslint-disable-next-line no-unused-vars
const constants = {
	C: 299792458, //celeritas — speed of light.
	AC: Math.log10(9) * Math.PI * Math.pow(10, 8), //speed of light alt
	G: 6.673 * 10 ** -11, //Gravity
	h: 6.62607015 * 10 ** -34, //planck's const
	m0: 1.25663706212 * 10 ** -6, //μ0 munot vacuum magnetic permeability
	e0: 8.8541878128 * 10 ** -12, //ε0 vacuum electric permittivity
	V: Math.sqrt(1 / (this.e0 * this.m0)),
};
