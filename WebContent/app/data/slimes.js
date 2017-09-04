'use strict';
define(["jquery"], function($){
	var data = {
		/**
		 * Slimes
		 */
		"1" : {
			type : "pink",
			action : function(game) {
				game.delays["one-shot"] = 200;
				game.addBuff("one-shot");
			}
		},
		"2" : {
			type : "orange",
			action : function(game) {
				
			}
		},
		"3" : {
			type : "blue",
			action : function(game) {
			}
		},
		"4" : {
			type : "green",
			action : function(game) {
				
			}
		},
		"5" : {
			type : "violet",
			action : function(game) {
				game.multiplicateur = 2;
				game.delays["bonus-x2"] = 200;
				game.addBuff("bonus-x2");
			}
		},
		"6" : {
			type : "yellow",
			action : function(game) {
				
			}
		},
		"7" : {
			type : "red",
			action : function(game) {
				if (!game.delays["boom"] || game.delays["boom"] <= 0) {
					game.delays["boom"] = 200;
					game.addBuff("boom");
				}
			}
		}
	};
	
	return {
		local : null,
		
		/**
		* Permet d'appeler un WS
		**/
		get : function(key) {
			return $.extend(true, {}, data[key]);
		}
	};
});