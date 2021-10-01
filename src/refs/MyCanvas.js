export class MyCanvas {
	constructor(options) {
		var default_args = {
			'vars': null,
			'consts': null,
			'simulate': () => { },
			'render': () => { },
			'init': () => { },
			'delete': () => { },
		}
		for (var index in default_args) {
			if (typeof options[index] == "undefined") options[index] = default_args[index];
		}
		this.vars = options.vars;
		this.consts = options.consts;
		this.simulate = options.simulate;
		this.render = options.render;
		this.init = options.init;
		this._delete = options.delete;
		this.simulResult = null;
		this._prevSResult = null;
		this.lastReq = null;
		this.canAnimRun = true;
		this.canRender = true;
	}

	animStart(_canvas) {
		this._init(_canvas);
		this.renderFrame();
	}
	_init(_canvas) {
		this.canvas = _canvas;
		this.context = _canvas.getContext('2d');
		this.init();
	}
	renderFrame(timestamp) {
		this.lastReq = requestAnimationFrame(this.renderFrame.bind(this));
		if (!this.canAnimRun) return;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this._simulate(timestamp);
		if (!this.canRender) return;
		this.render(timestamp);

	}
	renderPicture(_canvas) {
		this._init(_canvas);
		if (!this.canRender) return;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.render();
	}
	_simulate(timestamp) {
		this.simulate(timestamp);
	}
	delete() {
		cancelAnimationFrame(this.lastReq);
		this._delete();
	}
	drawPolygon(param) {
		console.assert(param && param.length > 2, "다각형을 구성하는 점이 너무 작습니다.");
		this.context.beginPath();
		this.context.moveTo(param[0][0], param[0][1]);
		param.forEach(element => {
			this.context.lineTo(element[0], element[1]);
		});
		this.context.closePath();
	}
	fill(style) {
		this.context.fillStyle = style;
		this.context.fill();
	}
	static rgb2hsv(rgb) {
		let v = Math.max(rgb[0], rgb[1], rgb[2]), c = v - Math.min(rgb[0], rgb[1], rgb[2]);
		let h = c && ((v === rgb[0]) ? (rgb[1] - rgb[2]) / c : ((v === rgb[1]) ? 2 + (rgb[2] - rgb[0]) / c : 4 + (rgb[0] - rgb[1]) / c));
		return [Math.round(60 * (h < 0 ? h + 6 : h)), v && c / v, v];
	}
	static hsv2rgb(hsv) {
		let f = (n, k = (n + hsv[0] / 60) % 6) => hsv[2] - hsv[2] * hsv[1] * Math.max(Math.min(k, 4 - k, 1), 0);
		return [f(5), f(3), f(1)];
	}
	static getGreyScale(imgData) {
		let array = imgData;
		if (array.data) array = array.data;
		return parseInt((3 * array[0] + 4 * array[1] + array[2]) >>> 3);
	}
	static lightnessMul(imgData, k) {
		let res = new ImageData(imgData.width, imgData.height);
		var pixels = new Uint8ClampedArray(imgData.data);
		for (var i = 0; i < pixels.length; i += 4) {
			pixels[i] *= k;
			pixels[i + 1] *= k;
			pixels[i + 2] *= k;
		}
		res.data.set(pixels);
		return res;
	}
	static lightnessAdd(imgData, k) {
		let res = new ImageData(imgData.width, imgData.height);
		var pixels = new Uint8ClampedArray(imgData.data);
		for (var i = 0; i < pixels.length; i += 4) {
			pixels[i] += k;
			pixels[i + 1] += k;
			pixels[i + 2] += k;
		}
		res.data.set(pixels);
		return res;
	}
	static img2greyScale(imgData) {
		let pixels = imgData.data;
		for (var i = 0; i < pixels.length; i += 4) {
			let lightness = parseInt((3 * pixels[i] + 4 * pixels[i + 1] + pixels[i + 2]) >>> 3);
			pixels[i] = lightness;
			pixels[i + 1] = lightness;
			pixels[i + 2] = lightness;
		}
		return imgData;
	}

	static getSafeRect(image, sx, sy, sw, sh, dx, dy, dw, dh) {
		const { width, height } = image;
		if (sw < 0) {
			sx += sw;
			sw = Math.abs(sw);
		}
		if (sh < 0) {
			sy += sh;
			sh = Math.abs(sh);
		}
		if (dw < 0) {
			dx += dw;
			dw = Math.abs(dw);
		}
		if (dh < 0) {
			dy += dh;
			dh = Math.abs(dh);
		}
		const x1 = Math.max(sx, 0);
		const x2 = Math.min(sx + sw, width);
		const y1 = Math.max(sy, 0);
		const y2 = Math.min(sy + sh, height);
		const w_ratio = dw / sw;
		const h_ratio = dh / sh;

		return [
			image,
			x1,
			y1,
			x2 - x1,
			y2 - y1,
			sx < 0 ? dx - (sx * w_ratio) : dx,
			sy < 0 ? dy - (sy * h_ratio) : dy,
			(x2 - x1) * w_ratio,
			(y2 - y1) * h_ratio
		];
	}
}