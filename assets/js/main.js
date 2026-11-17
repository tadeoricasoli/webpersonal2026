/*
	Multiverse by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Breakpoints.
	breakpoints({
		xlarge:  [ '1281px',  '1680px' ],
		large:   [ '981px',   '1280px' ],
		medium:  [ '737px',   '980px'  ],
		small:   [ '481px',   '736px'  ],
		xsmall:  [ null,      '480px'  ]
	});

	// Hack: Enable IE workarounds.
	if (browser.name == 'ie')
		$body.addClass('ie');

	// Touch?
	if (browser.mobile)
		$body.addClass('touch');

	// Transitions supported?
	if (browser.canUse('transition')) {

		// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

		// Prevent transitions/animations on resize.
		var resizeTimeout;

		$window.on('resize', function() {

			window.clearTimeout(resizeTimeout);

			$body.addClass('is-resizing');

			resizeTimeout = window.setTimeout(function() {
				$body.removeClass('is-resizing');
			}, 100);

		});

	}

	// Scroll back to top.
	$window.scrollTop(0);


	// Menú ☰ en celular
	(function() {
		var $nav = $('#header nav'), $btn = $nav.find('.nav-toggle');
		function setOpen(v) { $nav.toggleClass('open', v); $btn.attr('aria-expanded', v ? 'true' : 'false'); }
		$btn.on('click', function(e) { e.preventDefault(); e.stopPropagation(); setOpen(!$nav.hasClass('open')); });
		$nav.find('ul a').on('click', function() { setOpen(false); });
		$(document).on('click touchstart', function(e) { if (!$(e.target).closest('#header nav').length) setOpen(false); });
	})();

	// Panels.
	var $panels = $('.panel');

	$panels.each(function() {

		var $this = $(this),
			$toggles = $('[href="#' + $this.attr('id') + '"]'),
			$closer = $('<div class="closer" />').appendTo($this);

		// Closer.
		$closer
			.on('click', function(event) {
				$this.trigger('---hide');
			});

		// Events.
		$this
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('---toggle', function() {

				if ($this.hasClass('active'))
					$this.triggerHandler('---hide');
				else
					$this.triggerHandler('---show');

			})
			.on('---show', function() {

				// Hide other content.
				if ($body.hasClass('content-active'))
					$panels.trigger('---hide');

				// Activate content, toggles.
				$this.addClass('active');
				$toggles.addClass('active');

				// Activate body.
				$body.addClass('content-active');

			})
			.on('---hide', function() {

				// Deactivate content, toggles.
				$this.removeClass('active');
				$toggles.removeClass('active');

				// Deactivate body.
				$body.removeClass('content-active');

			});

		// Toggles.
		$toggles
			.removeAttr('href')
			.css('cursor', 'pointer')
			.on('click', function(event) {

				event.preventDefault();
				event.stopPropagation();

				$this.trigger('---toggle');

			});

	});

	// Global events.
	$body
		.on('click', function(event) {

			if ($body.hasClass('content-active')) {

				event.preventDefault();
				event.stopPropagation();

				$panels.trigger('---hide');

			}

		});

	$window
		.on('keyup', function(event) {

			if (event.keyCode == 27
			&&	$body.hasClass('content-active')) {

				event.preventDefault();
				event.stopPropagation();

				$panels.trigger('---hide');

			}

		});

	// Header.
	var $header = $('#header');

	// Links.
	$header.find('a').each(function() {

		var $this = $(this),
			href = $this.attr('href');

		// Internal link? Skip.
		if (!href
		||	href.charAt(0) == '#')
			return;

		// Redirect on click.
		$this
			.removeAttr('href')
			.css('cursor', 'pointer')
			.on('click', function(event) {

				event.preventDefault();
				event.stopPropagation();

				window.location.href = href;

			});

	});

	// Footer.
	var $footer = $('#footer');

	// Copyright.
	// This basically just moves the copyright line to the end of the *last* sibling of its current parent
	// when the "medium" breakpoint activates, and moves it back when it deactivates.
	$footer.find('.copyright').each(function() {

		var $this = $(this),
			$parent = $this.parent(),
			$lastParent = $parent.parent().children().last();

		breakpoints.on('<=medium', function() {
			$this.appendTo($lastParent);
		});

		breakpoints.on('>medium', function() {
			$this.appendTo($parent);
		});

	});

	// Main.
	var $main = $('#main');

	// Thumbs.
	$main.children('.thumb').each(function() {

		var	$this = $(this),
			$image = $this.find('.image'), $image_img = $image.children('img'),
			x;

		// No image? Bail.
		if ($image.length == 0)
			return;

		// Image.
		// This sets the background of the "image" <span> to the image pointed to by its child
		// <img> (which is then hidden). Gives us way more flexibility.

		// Set background (si el navegador lo permite, se pone recién cuando la miniatura se acerca a la pantalla; ver más abajo)
		if (!('IntersectionObserver' in window))
			$image.css('background-image', 'url(' + $image_img.attr('src') + ')');

		// Set background position.
		if (x = $image_img.data('position'))
			$image.css('background-position', x);

		// Hide original img.
		$image_img.hide();

	});

	// En el celular, la foto ampliada se pide más liviana (1800 px en lugar de 2560): carga bastante más rápido
	if (window.matchMedia('(max-width: 736px)').matches)
		$('.thumb > a.image').each(function() {
			this.setAttribute('href', this.getAttribute('href').replace('c_limit,w_2560', 'c_limit,w_1800'));
		});

	// Lista de fotos ampliadas (se guarda antes de iniciar Poptrox, que quita los href de los enlaces)
	var ptHrefs = $('.thumb > a.image').map(function() {
		return new URL(this.getAttribute('href'), location.href).href;
	}).get();

	// Poptrox.
	$main.poptrox({
		baseZIndex: 20000,
		caption: function($a) {

			var s = '';

			$a.nextAll().each(function() {
				s += this.outerHTML;
			});

			return s;

		},
		fadeSpeed: 300,
		onPopupClose: function() { $body.removeClass('modal-active'); },
		onPopupOpen: function() { $body.addClass('modal-active'); },
		overlayOpacity: 0,
		popupCloserText: '',
		popupHeight: 150,
		popupLoaderText: '',
		popupSpeed: 300,
		popupWidth: 150,
		selector: '.thumb > a.image',
		usePopupCaption: true,
		usePopupCloser: true,
		usePopupDefaultStyling: false,
		usePopupForceClose: true,
		usePopupLoader: true,
		usePopupNav: true,
		windowMargin: (window.matchMedia('(max-width: 736px)').matches ? 0 : 50)
	});

	// ===== Foto ampliada: deslizar, cerrar hacia abajo, zoom con dos dedos (vuelve al soltar), contador y precarga =====
	// Izquierda = siguiente, derecha = anterior (después de la última viene la primera), abajo = cerrar.
	(function() {
		var popup = document.querySelector('.poptrox-popup');
		if (!popup) return;

		// Lista de fotos ampliadas, para el contador y la precarga
		var hrefs = ptHrefs;
		var total = hrefs.length, current = -1, preloaded = {};

		// Empezar a descargar la foto ampliada apenas el dedo toca la miniatura (o el mouse pasa por encima)
		$('.thumb > a.image').each(function(i) {
			this.addEventListener('touchstart', function() { preload(i); }, { passive: true });
			this.addEventListener('mouseenter', function() { preload(i); });
		});

		// Red de seguridad: si al tocar una miniatura la foto no se abre (pasaba a veces en el primer toque
		// en iPhone), se vuelve a intentar sola, sin que haya que tocar de nuevo.
		$('.thumb > a.image').each(function() {
			var a = this;
			a.addEventListener('click', function() {
				if (a.dataset.retry === '1') { a.dataset.retry = ''; return; }
				setTimeout(function() {
					if (!document.body.classList.contains('modal-active') && !document.body.classList.contains('content-active')) {
						a.dataset.retry = '1';
						$(a).trigger('click');
						a.dataset.retry = '';
					}
				}, 500);
			});
		});

		// Si la foto ya terminó de descargarse pero la galería no se enteró, avisarle
		setInterval(function() {
			if (!document.body.classList.contains('modal-active') || !popup.classList.contains('loading')) return;
			var img = popup.querySelector('.pic img');
			if (img && img.getAttribute('src') && img.complete && img.naturalWidth > 0) {
				if (!img.dataset.stuck) { img.dataset.stuck = String(Date.now()); return; }
				if (Date.now() - Number(img.dataset.stuck) > 400) { delete img.dataset.stuck; $(img).trigger('load'); }
			} else if (img) delete img.dataset.stuck;
		}, 200);

		var counter = document.createElement('div');
		counter.className = 'pt-counter';
		popup.appendChild(counter);

		function preload(i) {
			var u = hrefs[(i + total) % total];
			if (!u || preloaded[u]) return;
			preloaded[u] = new Image();
			preloaded[u].src = u;
		}

		// Cuando carga una foto: actualizar contador, reiniciar zoom y precargar la anterior y la siguiente
		popup.addEventListener('load', function(e) {
			if (e.target.tagName !== 'IMG') return;
			var i = hrefs.indexOf(e.target.src);
			if (i < 0) return;
			current = i;
			counter.textContent = (i + 1) + ' / ' + total;
			resetZoom(false);
			preload(i + 1); preload(i - 1);
		}, true);

		// --- estado de los gestos ---
		var mode = null;            // 'swipe' | 'pan' | 'pinch'
		var startX = 0, startY = 0, dx = 0, dy = 0, horizontal = null, suppressClick = false;
		var scale = 1, tx = 0, ty = 0;                       // zoom actual
		var pinch = null, pan = null;

		function parts() { return { img: popup.querySelector('.pic img'), cap: popup.querySelector('.caption') }; }
		function apply(img, anim) {
			if (!img) return;
			img.style.transition = anim ? 'transform 0.25s ease-out' : 'none';
			img.style.transform = (scale === 1 && tx === 0 && ty === 0) ? '' : 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
		}
		function resetZoom(anim) {
			scale = 1; tx = 0; ty = 0;
			var p = parts();
			apply(p.img, anim);
			if (p.cap) p.cap.style.opacity = '';
			counter.style.opacity = '';
			popup.style.opacity = ''; popup.style.transition = '';
		}
		function dist(t) { return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); }
		function mid(t) { return { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 }; }
		function clampPan(img) {
			if (!img) return;
			var w = img.offsetWidth, h = img.offsetHeight;
			var mx = Math.max(0, (w * scale - window.innerWidth) / 2 + w * 0.1);
			var my = Math.max(0, (h * scale - window.innerHeight) / 2 + h * 0.1);
			tx = Math.max(-mx, Math.min(mx, tx));
			ty = Math.max(-my, Math.min(my, ty));
		}

		popup.addEventListener('touchstart', function(e) {
			var p = parts();
			if (e.touches.length === 2) {
				// Zoom con dos dedos
				mode = 'pinch';
				var m = mid(e.touches), r = p.img ? p.img.getBoundingClientRect() : null;
				pinch = { d0: dist(e.touches), s0: scale, tx0: tx, ty0: ty, m0: m,
					cx: r ? r.left + r.width / 2 - tx : window.innerWidth / 2,
					cy: r ? r.top + r.height / 2 - ty : window.innerHeight / 2 };
				if (p.img) p.img.style.transition = 'none';
				return;
			}
			if (e.touches.length !== 1) return;
			startX = e.touches[0].clientX; startY = e.touches[0].clientY;
			dx = 0; dy = 0; horizontal = null;
			if (mode === 'ignore') return;
			mode = 'swipe';
			if (p.img) p.img.style.transition = 'none';
		}, { passive: true });

		popup.addEventListener('touchmove', function(e) {
			var p = parts();
			if (mode === 'pinch' && e.touches.length === 2) {
				e.preventDefault();
				var s = Math.max(1, Math.min(4, pinch.s0 * dist(e.touches) / pinch.d0));
				var m = mid(e.touches);
				// mantener bajo los dedos el mismo punto de la foto
				var px = (pinch.m0.x - pinch.cx - pinch.tx0) / pinch.s0;
				var py = (pinch.m0.y - pinch.cy - pinch.ty0) / pinch.s0;
				scale = s;
				tx = m.x - pinch.cx - px * s;
				ty = m.y - pinch.cy - py * s;
				apply(p.img, false);
				if (p.cap) p.cap.style.opacity = '0';
				counter.style.opacity = '0';
				return;
			}
			if (e.touches.length !== 1) return;
			dx = e.touches[0].clientX - startX;
			dy = e.touches[0].clientY - startY;
			if (mode === 'pan') {
				e.preventDefault();
				tx = pan.tx0 + dx; ty = pan.ty0 + dy;
				clampPan(p.img);
				apply(p.img, false);
				return;
			}
			if (mode !== 'swipe') return;
			if (horizontal === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) horizontal = Math.abs(dx) > Math.abs(dy);
			if (horizontal === null) return;
			if (horizontal) {
				e.preventDefault();
				if (p.img) p.img.style.transform = 'translateX(' + dx + 'px)';
				if (p.cap) p.cap.style.opacity = String(1 - Math.min(Math.abs(dx) / 200, 1));
			} else if (dy > 0) {
				// Deslizar hacia abajo: la foto baja, se achica un poco y se desvanece
				e.preventDefault();
				var k = Math.min(dy / 400, 1);
				if (p.img) p.img.style.transform = 'translateY(' + dy + 'px) scale(' + (1 - 0.15 * k) + ')';
				if (p.cap) p.cap.style.opacity = String(1 - Math.min(dy / 150, 1));
				counter.style.opacity = String(1 - Math.min(dy / 150, 1));
				popup.style.opacity = String(1 - 0.5 * k);
			}
		}, { passive: false });

		function end(e) {
			var p = parts();
			if (mode === 'pinch') {
				// Al soltar los dedos, la foto vuelve sola a su tamaño normal (como en Instagram)
				suppressClick = true;
				setTimeout(function() { suppressClick = false; }, 400);
				resetZoom(true);
				// esperar a que se levanten todos los dedos antes de aceptar otro gesto
				mode = (e.touches && e.touches.length) ? 'ignore' : null;
				return;
			}
			if (mode === 'ignore') { if (!e.touches || !e.touches.length) mode = null; return; }
			if (mode === 'pan') {
				if (Math.abs(dx) > 5 || Math.abs(dy) > 5) suppressClick = true;
				mode = null;
				return;
			}
			if (mode !== 'swipe') return;
			mode = null;
			if (horizontal && Math.abs(dx) > 50) {
				suppressClick = true;
				if (p.img) {
					p.img.style.transition = 'transform 0.18s ease-out';
					p.img.style.transform = 'translateX(' + (dx < 0 ? -1 : 1) * window.innerWidth + 'px)';
				}
				setTimeout(function() {
					resetZoom(false);
					$(popup).trigger(dx < 0 ? 'poptrox_next' : 'poptrox_previous');
				}, 170);
			} else if (horizontal === false && dy > 90) {
				// Cerrar la foto
				suppressClick = true;
				if (p.img) {
					p.img.style.transition = 'transform 0.2s ease-out';
					p.img.style.transform = 'translateY(' + window.innerHeight + 'px) scale(0.8)';
				}
				popup.style.transition = 'opacity 0.2s ease-out';
				popup.style.opacity = '0';
				setTimeout(function() {
					$(popup).trigger('poptrox_close');
					setTimeout(function() { resetZoom(false); }, 350);
				}, 190);
			} else {
				if (p.img) { p.img.style.transition = 'transform 0.2s ease-out'; p.img.style.transform = ''; }
				if (p.cap) p.cap.style.opacity = '';
				counter.style.opacity = '';
				popup.style.transition = 'opacity 0.2s ease-out'; popup.style.opacity = '';
			}
		}
		popup.addEventListener('touchend', end);
		popup.addEventListener('touchcancel', end);

		// Tocar la foto la cierra, salvo justo después de deslizar o mientras está ampliada con zoom
		popup.addEventListener('click', function(e) {
			// mientras la foto está cargando, un toque no la cierra (antes parecía que "no cargaba")
			if (suppressClick || scale > 1.01 || popup.classList.contains('loading')) {
				e.stopPropagation(); e.preventDefault();
				suppressClick = false;
			}
		}, true);
	})();

	// ===== Miniaturas: vista previa difuminada mientras carga la foto =====
	$main.children('.thumb').each(function() {
		var thumb = this, a = thumb.querySelector('a.image'), img = a && a.querySelector('img');
		if (!img) return;
		var src = img.getAttribute('src');
		if (src.indexOf('/f_auto,q_auto,c_fill,w_800/') < 0) return;
		var blur = src.replace('/f_auto,q_auto,c_fill,w_800/', '/f_auto,q_auto,w_40,e_blur:400/');
		thumb.style.backgroundImage = 'url(' + blur + ')';
		thumb.classList.add('lqip');
		a.classList.add('lqip-loading');
		thumb._ptLoad = function() {
			a.style.backgroundImage = 'url(' + src + ')';
			var full = new Image();
			full.onload = full.onerror = function() { a.classList.remove('lqip-loading'); };
			full.src = src;
			if (full.complete) a.classList.remove('lqip-loading');
		};
		if (!('IntersectionObserver' in window)) thumb._ptLoad();
	});

	// ===== Miniaturas: se descargan a medida que bajás (las visibles + las que están por aparecer) =====
	if ('IntersectionObserver' in window) {
		var thumbIO = new IntersectionObserver(function(entries) {
			entries.forEach(function(en) {
				if (!en.isIntersecting) return;
				var th = en.target, a = th.querySelector('a.image'), img = a && a.querySelector('img');
				thumbIO.unobserve(th);
				if (th._ptLoad) th._ptLoad();
				else if (a && img) a.style.backgroundImage = 'url(' + img.getAttribute('src') + ')';
			});
		}, { rootMargin: '600px 0px' });
		$main.children('.thumb').each(function() { thumbIO.observe(this); });
	}


	// Panel Map (Leaflet se carga recién la primera vez que se abre)
	(function() {
		// PROVISORIO: lugares de ejemplo con fotos de la galería. Reemplazar por las stories.
		var places = [
			{ name: 'GLACIAR PERITO MORENO', place: 'Santa Cruz', lat: -50.496, lng: -73.137, photo: 0 },
			{ name: 'MENDOZA', place: 'Mendoza', lat: -32.889, lng: -68.845, photo: 3 },
			{ name: 'ENTRE RÍOS', place: 'Entre Ríos', lat: -31.732, lng: -60.529, photo: 5 },
			{ name: 'YUNGAS', place: 'Jujuy', lat: -23.70, lng: -64.85, photo: 8 },
			{ name: 'JUJUY', place: 'Purmamarca, Jujuy', lat: -23.745, lng: -65.498, photo: 12 }
		];
		var CARTO_KEY = 'cb1_5azb_1_96d0d2b2a535a109a73f7879';
		var $panel = $('#places'), el = document.getElementById('places-map'), map = null, loading = false;
		if (!el) return;

		function thumbOf(i) {
			var img = $('.thumb').eq(i).find('img').attr('src') || '';
			return img.replace('c_fill,w_800', 'c_fill,w_400,h_280,g_auto');
		}
		function openPhoto(i) {
			$panel.trigger('---hide');
			setTimeout(function() { $('.thumb').eq(i).find('a.image').trigger('click'); }, 550);
		}
		function build() {
			map = L.map(el, { zoomControl: true, attributionControl: true, scrollWheelZoom: true, worldCopyJump: false, minZoom: 3 });
			L.tileLayer('https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=' + CARTO_KEY, {
				maxZoom: 18,
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>'
			}).addTo(map);
			var icon = L.divIcon({ className: 'pt-pin', iconSize: [24, 24] });
			var bounds = [];
			places.forEach(function(p) {
				var html = '<a class="pt-pop" data-i="' + p.photo + '"><img src="' + thumbOf(p.photo) + '" alt="" loading="lazy" /><strong>' + p.name + '</strong><span>' + p.place + '</span></a>';
				L.marker([p.lat, p.lng], { icon: icon, title: p.name }).addTo(map).bindPopup(html, { closeButton: true, autoPanPadding: [20, 20] });
				bounds.push([p.lat, p.lng]);
			});
			map.fitBounds(bounds, { padding: [40, 40] });
			$(el).on('click', '.pt-pop', function(e) { e.preventDefault(); openPhoto(+this.getAttribute('data-i')); });
		}
		function load() {
			if (map) { setTimeout(function() { map.invalidateSize(); }, 550); return; }
			if (loading) return;
			loading = true;
			var css = document.createElement('link');
			css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
			document.head.appendChild(css);
			var js = document.createElement('script');
			js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
			js.onload = function() { setTimeout(function() { build(); map.invalidateSize(); }, 550); };
			js.onerror = function() { loading = false; el.innerHTML = '<div class="map-msg">No se pudo cargar el mapa. Probá de nuevo en un rato.</div>'; };
			document.head.appendChild(js);
		}
		$panel.on('---show', load);
	})();

	// Desactivar clic en imágenes cuando está abierto el panel #footer (formulario de contacto)
	var $images = $('.thumb > a.image');

	$panels.on('---show', function() {
		console.log('Footer abierto - desactivando clic en imágenes');
		$images.each(function() {
			var $this = $(this);
			$this.data('href', $this.attr('href'));  // Guardar href
			$this.removeAttr('href');                 // Remover href para desactivar poptrox
		});
	});

	$panels.on('---hide', function() {
		if ($panels.filter('.active').not(this).length) return;
		console.log('Footer cerrado - activando clic en imágenes');
		$images.each(function() {
			var $this = $(this);
			var href = $this.data('href');
			if (href) $this.attr('href', href);      // Restaurar href
		});
	});

	var $body = $('body');
var $images = $('.thumb > a.image');

$images.on('click', function(e) {
  if ($('.panel.active').length && $body.hasClass('content-active')) {
    e.preventDefault();
    e.stopImmediatePropagation();
    console.log('Clic bloqueado en imagen porque el panel contacto está abierto');
    return false;
  }
});


})(jQuery);
