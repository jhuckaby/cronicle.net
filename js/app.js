// Cronicle Website
// Author: Joseph Huckaby
// Copyright (c) 2016 Joseph Huckaby and PixlCore.com

var app = {
	
	slides: [
		"images/screenshots/job-details-complete.png",
		"images/screenshots/job-live-progress.png",
		"images/screenshots/completed-jobs.png",
		"images/screenshots/event-stats.png",
		"images/screenshots/home.png",
		"images/screenshots/schedule.png",
		"images/screenshots/admin-servers.png",
		"images/screenshots/admin-plugin-edit.png"
	],
	currentSlideIdx: 0,
	
	setHeaderClock: function(when) {
		// move the header clock hands to the selected time
		if (!when) when = time_now();
		var dargs = get_date_args( when );
		
		// hour hand
		var hour = (((dargs.hour + (dargs.min / 60)) % 12) / 12) * 360;
		$('#d_header_clock_hour').css({
			transform: 'rotateZ('+hour+'deg)',
			'-webkit-transform': 'rotateZ('+hour+'deg)'
		});
		
		// minute hand
		var min = ((dargs.min + (dargs.sec / 60)) / 60) * 360;
		$('#d_header_clock_minute').css({
			transform: 'rotateZ('+min+'deg)',
			'-webkit-transform': 'rotateZ('+min+'deg)'
		});
		
		// second hand
		var sec = (dargs.sec / 60) * 360;
		$('#d_header_clock_second').css({
			transform: 'rotateZ('+sec+'deg)',
			'-webkit-transform': 'rotateZ('+sec+'deg)'
		});
		
		// show clock if needed
		if (!this.clock_visible) {
			this.clock_visible = true;
			$('div.header_clock_layer').fadeTo( 1000, 1.0 );
			setInterval( function() { app.setHeaderClock(); }, 1000 );
		}
	},
	
	setupHero: function() {
		// nav bubbles
		var html = '';
		for (var idx = 0, len = this.slides.length; idx < len; idx++) {
			html += '<div class="slider_ball '+(idx ? '' : 'active')+'" onMouseUp="app.changeSlide('+idx+',true)"></div>';
		}
		var w = 17 * this.slides.length;
		
		$('.slider_ball_container').css({
			'width': '' + w + 'px',
			'margin-left': '-' + Math.floor(w / 2) + 'px'
		}).html( html );
		
		$('.slider_ball_underlay').css({
			'width': '' + w + 'px',
			'margin-left': '-' + Math.floor(w / 2) + 'px'
		});
	},
	
	lazyLoad: function() {
		// lazy load remaining slides (first one is loaded in HTML)
		for (var idx = 1, len = this.slides.length; idx < len; idx++) {
			$( $('div.screenshot').get(idx) ).css({
				'background-image': 'url('+this.slides[idx]+')',
				'visibility': 'hidden'
			});
		}
	},
	
	changeSlide: function(newIdx, userRequest) {
		// animate current slide out
		$('div.screenshot.live').removeClass('live').addClass('exit').css('z-index', 0);
		
		// animate next slide in
		$( $('div.screenshot')[newIdx] ).removeClass('exit').addClass('live').css({
			'z-index': 1,
			'visibility': 'visible'
		});
		// $( $('div.blurb')[idx] ).removeClass('exit').addClass('live').css('z-index', 1);
		
		// update nav balls
		var balls = document.querySelectorAll('div.slider_ball');
		for (var idx = 0, len = balls.length; idx < len; idx++) {
			balls[idx].className = 'slider_ball ' + ((idx == newIdx) ? 'active' : '');
		}
		
		// if user request, stop timer
		if (userRequest && app.slideTimer) {
			clearTimeout( app.slideTimer );
			delete app.slideTimer;
		}
		
		this.currentSlideIdx = newIdx;
		
		this.zoomOutSlide();
	},
	
	nextSlide: function(userRequest) {
		// jump to next slide, loop around
		var max_slides = this.slides.length;
		this.currentSlideIdx++;
		if (this.currentSlideIdx >= max_slides) this.currentSlideIdx = 0;
		this.changeSlide( this.currentSlideIdx, userRequest );
	},
	prevSlide: function(userRequest) {
		// jump to prev slide, loop around
		var max_slides = this.slides.length;
		this.currentSlideIdx--;
		if (this.currentSlideIdx < 0) this.currentSlideIdx += max_slides;
		this.changeSlide( this.currentSlideIdx, userRequest );
	},
	
	autoscale: {
		enabled: 1,
		base_width: 960,
		max_width: 960,
		selectors: {
			'.header': {
				'height': { min: 40, base: 60 }
			},
			'#d_header_logo, .header_clock_layer': {
				'width': { min: 40, base: 60 },
				'height': { min: 40, base: 60 },
				'background-size': { min: 35, base: 50 }
			},
			'#d_header_title, #d_header_tagline': {
				'height': { min: 40, base: 60 },
				'line-height': { min: 40, base: 60 },
				'font-size': { min: 28, base: 38 }
			},
			
			/*'.hero_container, .install_container': {
				'padding-top': { min: 15, base: 22 },
				'padding-bottom': { min: 15, base: 22 }
			},*/
			
			'#feat_container': {
				'margin-top': { min: 20, base: 40 }
			},
			'.feat_icon': {
				'width': { min: 75, base: 140 },
				/*'height': { min: 75, base: 110 },
				'line-height': { min: 75, base: 110 },*/
				'font-size': { min: 35, base: 60 }
			},
			'.feat_detail': {
				'margin-left': { min: 75, base: 140 }
				/*'height': { min: 75, base: 110 }*/
			},
			'.feat_title': {
				'font-size': { min: 15, base: 18 }
			},
			'.feat_desc': {
				'font-size': { min: 12, base: 15 },
				'margin-top': { min: 5, base: 10 }
			},
			'.feat_divider': {
				'margin-top': { min: 15, base: 30 },
				'margin-bottom': { min: 15, base: 30 }
			},
			
			'.mini_blurb': {
				'font-size': { min: 14, base: 15 },
				'line-height': { min: 20, base: 25 }
			},
			
			'.install_container': {
				'margin-top': { min: 20, base: 40 }
			},
			'.install_title': {
				'font-size': { min: 18, base: 22 }
			},
			'.install_subtitle': {
				'font-size': { min: 15, base: 18 }
			},
			'.install_command': {
				'margin-top': { min: 15, base: 20 },
				'margin-bottom': { min: 15, base: 20 },
				'padding': { min: 15, base: 20 },
				'font-size': { min: 15, base: 17 }
			},
			'.install_caption': {
				'font-size': { min: 12, base: 14 }
			},
			
			'.footer_container': {
				'margin-top': { min: 10, base: 15 },
				'padding-top': { min: 15, base: 20 },
				'padding-bottom': { min: 15, base: 20 }
			},
			'.footer_text': {
				'font-size': { min: 11, base: 12 }
			}
			
		} // selectors
	}, // autoscale
	
	applyStyles: function() {
		// auto-scale any custom css properties based on width
		if (!this.autoscale.enabled) return;
		
		var size = getInnerWindowSize();
		var base_width = this.autoscale.base_width || 1024;
		var max_width = this.autoscale.max_width || base_width;
		var width = Math.min( size.width, max_width );
		
		for (var selector in this.autoscale.selectors) {
			var css_params = this.autoscale.selectors[selector];
			var css_out = {};
			
			for (var css_key in css_params) {
				var css_opts = css_params[css_key];
				if (!('suffix' in css_opts)) css_opts.suffix = 'px';
				css_out[css_key] = '' + Math.max(css_opts.min || 0, Math.round( (width / base_width) * css_opts.base )) + (css_opts.suffix || '');
			}
			
			$(selector).css(css_out);
		} // foreach param
	},
	
	zoomInSlide: function() {
		// zoom the current slide fullscreen
		var slide = $( $('div.screenshot.live').get(0) );
		var pos = slide.offset();
		var $body = $('body');
		var scroll_y = $body.scrollTop();
		pos.top -= scroll_y;
		
		if ($('#dialog_overlay').length) {
			$('#dialog_overlay').stop().remove();
		}
		
		var overlay = document.createElement('div');
		overlay.id = 'dialog_overlay';
		overlay.style.opacity = 0;
		$body.append(overlay);
		$(overlay).fadeTo( 1000, 0.75 );
		
		if ($('div.zoomshot').length) {
			$('div.zoomshot').stop().remove();
		}
		
		// var zoom = slide.clone();
		var zoom = $('<div></div>').addClass('zoomshot').css({
			'background-image': 'url('+this.slides[this.currentSlideIdx]+')'
		});
		zoom.css({
			position: 'fixed',
			/*left: '' + Math.floor(pos.left) + 'px',
			top: '' + Math.floor(pos.top) + 'px',
			width: '' + Math.floor(slide.width()) + 'px',
			height: '' + Math.floor(slide.height()) + 'px',*/
			opacity: 0,
			'z-index': 1001,
			// 'background-color': 'red'
		});
		$body.append( zoom );
		zoom.fadeTo( 500, 1.0 );
		
		zoom.click(function() {
			app.zoomOutSlide();
		});
		
		this.zoomed = true;
		
		/*setTimeout( function() {
			zoom.removeClass('live').addClass('zoom').css({
				left: 0,
				top: 0,
				width: '100%',
				height: '100%',
				opacity: 1
			});
		}, 1 );*/
		
		if (app.slideTimer) {
			clearTimeout( app.slideTimer );
			delete app.slideTimer;
		}
	},
	
	zoomOutSlide: function() {
		// if a slide is being shown fullscreen, zoom it back out
		if (this.zoomed) {
			$('#dialog_overlay').stop().fadeOut( 250, function() { $(this).remove(); } );
			$('.zoomshot').stop().fadeOut( 500, function() { $(this).remove(); } );
			this.zoomed = false;
		}
	}
	
}; // app

$( function() {
	// DOM ready
	app.setHeaderClock();
	
	// $('div.screenshot, div.blurb').addClass('live');
	app.setupHero();
	app.changeSlide(0);
	$('div.blurb').removeClass('exit').addClass('live').css('z-index', 1);
	
	// auto-rotate slides
	app.slideTimer = setInterval( function() {
		if (!document.hidden) app.nextSlide();
	}, 8000 );
	
	// setup mobile touch
	var div = $('.hero_container')[0];
	div.addEventListener('touchstart', app.touchStart.bind(app));
	div.addEventListener('touchmove', app.touchMove.bind(app));
	div.addEventListener('touchend', app.touchEnd.bind(app));
	
	// setup slide zoom
	$('#hero_column').click( function() {
		app.zoomInSlide();
	} );
} );

window.addEventListener( 'load', function() {
	app.lazyLoad();
}, false );

window.addEventListener( 'resize', function() {
	app.applyStyles();
}, false );

window.addEventListener( 'keyup', function(event) {
	switch (event.keyCode) {
		case 39: app.nextSlide(true); break;
		case 37: app.prevSlide(true); break;
	}
}, false );

app.applyStyles();

//
// Utilities:
//

function time_now() {
	// return the Epoch seconds for like right now
	var now = new Date();
	return Math.floor( now.getTime() / 1000 );
};

function hires_time_now() {
	// return the Epoch seconds for like right now
	var now = new Date();
	return ( now.getTime() / 1000 );
};

function get_date_args(thingy) {
	// return hash containing year, mon, mday, hour, min, sec
	// given epoch seconds
	var date = (typeof(thingy) == 'object') ? thingy : (new Date( (typeof(thingy) == 'number') ? (thingy * 1000) : thingy ));
	var args = {
		epoch: Math.floor( date.getTime() / 1000 ),
		year: date.getFullYear(),
		mon: date.getMonth() + 1,
		mday: date.getDate(),
		hour: date.getHours(),
		min: date.getMinutes(),
		sec: date.getSeconds(),
		msec: date.getMilliseconds(),
		wday: date.getDay(),
		offset: 0 - (date.getTimezoneOffset() / 60)
	};
	
	args.yyyy = '' + args.year;
	if (args.mon < 10) args.mm = "0" + args.mon; else args.mm = '' + args.mon;
	if (args.mday < 10) args.dd = "0" + args.mday; else args.dd = '' + args.mday;
	if (args.hour < 10) args.hh = "0" + args.hour; else args.hh = '' + args.hour;
	if (args.min < 10) args.mi = "0" + args.min; else args.mi = '' + args.min;
	if (args.sec < 10) args.ss = "0" + args.sec; else args.ss = '' + args.sec;
	
	if (args.hour >= 12) {
		args.ampm = 'pm';
		args.hour12 = args.hour - 12;
		if (!args.hour12) args.hour12 = 12;
	}
	else {
		args.ampm = 'am';
		args.hour12 = args.hour;
		if (!args.hour12) args.hour12 = 12;
	}
	
	args.yyyy_mm_dd = args.yyyy + '/' + args.mm + '/' + args.dd;
	args.hh_mi_ss = args.hh + ':' + args.mi + ':' + args.ss;
	args.tz = 'GMT' + (args.offset > 0 ? '+' : '') + args.offset;
	
	return args;
};

function getInnerWindowSize(dom) {
	// get size of inner window
	if (!dom) dom = window;
	var w = 0, h = 0;
	
	if( typeof( dom.innerWidth ) == 'number' ) {
		w = dom.innerWidth;
		h = dom.innerHeight;
	}
	else if( dom.document.documentElement && ( dom.document.documentElement.clientWidth || dom.document.documentElement.clientHeight ) ) {
		w = dom.document.documentElement.clientWidth;
		h = dom.document.documentElement.clientHeight;
	}
	else if( dom.document.body && ( dom.document.body.clientWidth || dom.document.body.clientHeight ) ) {
		w = dom.document.body.clientWidth;
		h = dom.document.body.clientHeight;
	}
	return { width: w, height: h };
};

// Handle mobile touch events
app.touchOrigin = {};
app.touchCurrent = {};

app.touchStart = function(event) {
	// record finger starting position
	var touch = event.touches[0];
	this.touchOrigin.x = touch.screenX;
	this.touchOrigin.y = touch.screenY;
};

app.touchMove = function(event) {
	// track finger movement while dragging
	var touch = event.touches[0];
	this.touchCurrent.x = touch.screenX;
	this.touchCurrent.y = touch.screenY;
};

app.touchEnd = function(event) {
	// finger lifted off the screen, check for swipe
	var pt = this.touchCurrent;
	var dx = Math.abs( pt.x - this.touchOrigin.x );
	var dy = Math.abs( pt.y - this.touchOrigin.y );
	var swipe_threshold = 50;
	
	if (Math.max(dx, dy) >= swipe_threshold) {
		var direction = '';
		if (dx > dy) {
			// horiz swipe
			direction = ((pt.x - this.touchOrigin.x) > 0) ? 'right' : 'left';
		}
		else {
			// vert swipe
			direction = ((pt.y - this.touchOrigin.y) > 0) ? 'down' : 'up';
		}
		
		switch (direction) {
			case 'left': app.prevSlide(true); break;
			case 'right': app.nextSlide(true); break;
		}
	} // swiped
};
