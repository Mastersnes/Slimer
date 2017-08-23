/*global define */
define(["jquery",
        'underscore',
        "app/utils/utils",
        "text!app/template/menu/popup/partenaire.html"], 
function($, _, Utils, page) {
	'use strict';

	return function() {
		this.init = function() {
			this.el = "#partenaire-popup";
			this.render();
		};

		this.render = function() {
			_.templateSettings.variable = "data";
			var template = _.template(page);
			var templateData = {};
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
		
		this.init();
	};
});