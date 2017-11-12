'use strict';
define(["jquery"], function($){
	var data = {
		/**
		 * Slimes
		 */
		"1" : {
			type : "pink",
			action : function(game) {
				game.kongregateUtils.score("OneShot", 1);
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
				game.kongregateUtils.score("Freeze", 1);
				if (!game.delays["freeze"] || game.delays["freeze"] <= 0) {
					game.nextPopDelay *= 10;
					game.delays["freeze"] = 200;
					game.addBuff("freeze");
				}
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
				game.kongregateUtils.score("BonusX2", 1);
				game.multiplicateur = 2;
				game.delays["bonus-x2"] = 200;
				game.addBuff("bonus-x2");
			}
		},
		"6" : {
			type : "yellow",
			action : function(game) {
				game.kongregateUtils.score("Speed", 1);
				if (!game.delays["speed"] || game.delays["speed"] <= 0) {
					game.nextPopDelay /= 10;
					game.delays["speed"] = 200;
					game.addBuff("speed");
				}
			}
		},
		"7" : {
			type : "red",
			action : function(game) {
				game.kongregateUtils.score("Boom", 1);
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