window.addEventListener("DOMContentLoaded",() => {
	const c = new Clock22(".clock");
});

class Clock22 {
	debug = false;
	extraTime = 0;

	constructor(el) {
		this.el = document.querySelector(el);

		this.init();
	}
	init() {
		this.timeUpdate();

		if (this.debug === true) {
			document.body.addEventListener("click",this.addTime.bind(this,60000));
		}
	}
	get timeAsObject() {
		let date = new Date();
		date = new Date(date.getTime() + this.extraTime);
		const h = date.getHours();
		const m = date.getMinutes();

		return { h, m };
	}
	get timeAsString() {
		let { h, m } = this.timeAsObject;
		// prepend 0s if single digits
//		if (h === 0) h = 12;      // comment out for 24 hours
//		else if (h > 12) h -= 12; // comment out for 24 hours
		if (h < 10) h = `0${h}`;
		if (m < 10) m = `0${m}`;

		return `${h}:${m}`;
	}
	get timeDigits() {
		return this.timeAsString.replaceAll(":","").split("");
	}
	addTime(amount = 0) {
		this.extraTime += amount;
		this.timeUpdate();
	}
	timeUpdate() {
		// update the `aria-label`
		this.el?.setAttribute("aria-label", this.timeAsString);
		// update the digits
		this.timeDigits.forEach((digit,i) => {
			const digitEl = this.el.querySelectorAll("[data-digit]")[i];
			if (!digitEl) return;

			digitEl.setAttribute("data-digit",digit);
		});
		// loop
		clearTimeout(this.timeUpdateLoop);
		this.timeUpdateLoop = setTimeout(this.timeUpdate.bind(this),1e3);
	}
}