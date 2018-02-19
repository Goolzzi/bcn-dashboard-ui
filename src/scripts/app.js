import ReactDOM from 'react-dom';
import router from './router';

// Google maps API (Google maps key needs to be specified here)
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBRcj1z9jHcqmiyJdj5GIj6JlJXCBthr7w';
document.getElementsByTagName('head')[0].appendChild(script);

/** Bootstraps application **/
function bootstrap() {
	// Render components
	ReactDOM.render(router, document.getElementById('bcn'));
}
if (window.addEventListener) {
	window.addEventListener('DOMContentLoaded', bootstrap);
} else {
	window.attachEvent('onload', bootstrap);
}

/*! modernizr 3.3.1 (Custom Build) | MIT *
 * http://modernizr.com/download/?-hiddenscroll-setclasses !*/
! function (e, n, t) {
	function o(e, n) {
		return typeof e === n
	}

	function s() {
		var e, n, t, s, a, i, r;
		for (var l in f)
			if (f.hasOwnProperty(l)) {
				if (e = [], n = f[l], n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length))
					for (t = 0; t < n.options.aliases.length; t++) e.push(n.options.aliases[t].toLowerCase());
				for (s = o(n.fn, 'function') ? n.fn() : n.fn, a = 0; a < e.length; a++) i = e[a], r = i.split('.'), 1 === r.length ? Modernizr[r[0]] = s : (!Modernizr[r[0]] || Modernizr[r[0]] instanceof Boolean || (Modernizr[r[0]] = new Boolean(Modernizr[r[0]])), Modernizr[r[0]][r[1]] = s), c.push((s ? '' : 'no-') + r.join('-'))
			}
	}

	function a(e) {
		var n = p.className,
			t = Modernizr._config.classPrefix || '';
		if (u && (n = n.baseVal), Modernizr._config.enableJSClass) {
			var o = new RegExp('(^|\\s)' + t + 'no-js(\\s|$)');
			n = n.replace(o, '$1' + t + 'js$2')
		}
		Modernizr._config.enableClasses && (n += ' ' + t + e.join(' ' + t), u ? p.className.baseVal = n : p.className = n)
	}

	function i() {
		return 'function' != typeof n.createElement ? n.createElement(arguments[0]) : u ? n.createElementNS.call(n, 'http://www.w3.org/2000/svg', arguments[0]) : n.createElement.apply(n, arguments)
	}

	function r() {
		var e = n.body;
		return e || (e = i(u ? 'svg' : 'body'), e.fake = !0), e
	}

	function l(e, t, o, s) {
		var a, l, f, d, c = 'modernizr',
			u = i('div'),
			h = r();
		if (parseInt(o, 10))
			for (; o--;) f = i('div'), f.id = s ? s[o] : c + (o + 1), u.appendChild(f);
		return a = i('style'), a.type = 'text/css', a.id = 's' + c, (h.fake ? h : u)
			.appendChild(a), h.appendChild(u), a.styleSheet ? a.styleSheet.cssText = e : a.appendChild(n.createTextNode(e)), u.id = c, h.fake && (h.style.background = '', h.style.overflow = 'hidden', d = p.style.overflow, p.style.overflow = 'hidden', p.appendChild(h)), l = t(u, e), h.fake ? (h.parentNode.removeChild(h), p.style.overflow = d, p.offsetHeight) : u.parentNode.removeChild(u), !!l
	}
	var f = [],
		d = {
			_version: '3.3.1',
			_config: {
				classPrefix: '',
				enableClasses: !0,
				enableJSClass: !0,
				usePrefixes: !0
			},
			_q: [],
			on: function (e, n) {
				var t = this;
				setTimeout(function () {
					n(t[e])
				}, 0)
			},
			addTest: function (e, n, t) {
				f.push({
					name: e,
					fn: n,
					options: t
				})
			},
			addAsyncTest: function (e) {
				f.push({
					name: null,
					fn: e
				})
			}
		},
		Modernizr = function () {};
	Modernizr.prototype = d, Modernizr = new Modernizr;
	var c = [],
		p = n.documentElement,
		u = 'svg' === p.nodeName.toLowerCase(),
		h = d.testStyles = l;
	Modernizr.addTest('hiddenscroll', function () {
		return h('#modernizr {width:100px;height:100px;overflow:scroll}', function (e) {
			return e.offsetWidth === e.clientWidth
		})
	}), s(), a(c), delete d.addTest, delete d.addAsyncTest;
	for (var m = 0; m < Modernizr._q.length; m++) Modernizr._q[m]();
	e.Modernizr = Modernizr
}(window, document);
