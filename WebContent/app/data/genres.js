'use strict';
define(["jquery"], function($){
	var data = {
		/**
		 * Genre
		 */
		"1" : {
			type : "classique",
			life : 3
		},
		"2" : {
			type : "army",
			life : 5
		},
		"3" : {
			type : "lunette",
			life : 1
		},
		"4" : {
			type : "livre",
			life : 2
		},
		
		"5" : {
			type : "gold",
			life : 1,
			rarete : 100,
			limit : 10,
			deadAction : function(game) {
				game.kongregateUtils.score("GoldSlime", 1);
				game.addPoint(100);
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