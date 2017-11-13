'use strict';
define(["jquery"], function($){
	return function(){
		this.sounds = [];
		
		this.loadAll = function() {
			var list = [];
			for (var index in list) {
				var key = list[index];
				this.load(key);
			}
		};
		
		/**
		* Permet de charger les sons
		**/
		this.load = function(key, id) {
		    if (!id) id = "";
			var sound = new Audio("app/"+key);
			if (key.indexOf("music") > -1) {
				sound.volume=0.5;
				sound.addEventListener('ended', function() {
					this.currentTime = 0;
				    this.play();
				}, false);
			}
			
			this.sounds[key+id] = sound;
		};
		
		/**
		 * Joue le son et le creer s'il n'existe pas
		 */
		this.play = function(key, id) {
			if (!key) return;
			if (!id) id = "";
			if (!this.sounds[key+id]) {
				console.log("Never pass!");
				this.load(key, id);
			}
			try {
				this.sounds[key+id].play();
			}catch (e) {
				this.load(key, id);
			}
		};

		/**
		 * Joue le son et le creer s'il n'existe pas
		 */
		this.playSound = function(key, id) {
			if (!key) return;
			console.log("playSound : ", key);
			this.play("sounds/"+key, id);
		};
		
		this.stopSound = function(key) {
			if (!key) return;
			this.stop("sounds/"+key);
		};
		
		this.stop = function(key) {
			if (!key) return;
			try {
				this.sounds[key].pause();
				this.sounds[key].currentTime = 0;
			}catch (e) {
				this.load(key);
			}
		};
		
		this.stopAllMusic = function() {
			for (var index in this.sounds) {
				if (index.indexOf("music") > -1) {
					var sound = this.sounds[index];
					try {
						sound.pause();
					}catch (e) {
						this.load(index);
					}
				}
			}
		};
		
		this.loadAll();
	};
});