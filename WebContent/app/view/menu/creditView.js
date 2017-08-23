/*global define */
define(["jquery",
        'underscore',
        "app/utils/utils",
        "text!app/template/menu/popup/credit.html"], 
function($, _, Utils, page) {
	'use strict';

	return function(Textes) {
		this.init = function(Textes) {
			this.el = "#credit-popup";
			this.Textes = Textes;
			this.render();
		};

		this.render = function() {
			_.templateSettings.variable = "data";
			var template = _.template(page);
			var templateData = {
					text : this.Textes
			};
			$(this.el).html(template(templateData));
			
			this.makeEvents();
		};
		
		this.makeEvents = function() {
			var that = this;
			$(this.el).click(function() {
				$(that.el).hide("slow");
			});
		};
		
		this.show = function() {
			$(this.el).show("slow");
		};
		
		this.init(Textes);
	};
});