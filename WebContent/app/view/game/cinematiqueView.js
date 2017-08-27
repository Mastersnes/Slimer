/*global define */
define(["jquery",
        'underscore',
        "app/utils/utils"],
function($, _, Utils) {
	'use strict';

	return function() {
		this.init = function() {
			this.el = "#cinematique";
			this.max = 8;
			this.current = 0;
			this.portrait = $("#portrait").is(":visible");
			this.makeEvents();
		};

		this.load = function() {
			$(this.el).fadeIn();
			this.current = 1;
			this.show();
		};
		
		this.next = function() {
			this.current++;
			if (this.isEmpty()) {
				$(this.el).fadeOut("slow");
			}else {
				this.show();
			}
		};
		
		this.show = function() {
		    var currentCase = $(this.el).find(".case#c"+this.current);
		    //Si on est en mode portrait, on affiche en ligne
		    if (this.portrait) {
		        currentCase.show();
		    }else {
		        currentCase.addClass("visible");
		    }
		    
		    if (this.current > 3) {
                $(this.el).find(".case#c1").hide();
                $(this.el).find(".case#c2").hide();
                $(this.el).find(".case#c3").hide();
            }
		    if (this.current == 6) {
		        currentCase.addClass("drama");
		    }
            if (this.current > 6) {
                $(this.el).find(".case#c4").hide();
                $(this.el).find(".case#c5").hide();
                $(this.el).find(".case#c6").hide();
            }
		};
		
		this.makeEvents = function() {
			var that = this;
			$(this.el).click(function() {
				that.next();
			});
		};
		
		this.isEmpty = function() {
			return this.current > this.max;
		};
		
		this.init();
	};
});