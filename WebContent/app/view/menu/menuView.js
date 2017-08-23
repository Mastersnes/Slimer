/*global define */
define(["jquery",
        'underscore',
        "app/utils/utils",
        "app/data/textes",
        "app/utils/mediatheque",
        "text!app/template/menu/menu.html",
        "app/view/game/gameView",
        "app/view/menu/optionView",
        "app/view/menu/creditView",
        "app/view/menu/partenaireView"], 
function($, _, Utils, Textes, Mediatheque, page, GameView, OptionView, CreditView, PartenaireView) {
	'use strict';

	return function() {
		this.init = function() {
		    this.el = $("#app");
            this.mediatheque = new Mediatheque();
            this.render();
		};

		this.render = function() {
			_.templateSettings.variable = "data";
			var template = _.template(page);
			var templateData = {
					text : Textes
			};
			this.el.html(template(templateData));
			
			this.makeEvents();
			
			setTimeout(function() {
				$(".bebel").fadeOut("slow");
			}, 2000);
		};
		
		this.makeEvents = function() {
			var that = this;
			$("#new").click(function() {
				that.newGame();
			});
			$("#option").click(function() {
				new OptionView(that, Textes).show();
			});
			$("#credit").click(function() {
				new CreditView(Textes).show();
			});
			$("#partenaire").click(function() {
				new PartenaireView(Textes).show();
			});
		};
		
		this.newGame = function() {
			new GameView(this, Textes, this.mediatheque);
		};
		
		this.init();
	};
});