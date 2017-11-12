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
		this.load = function(key) {
			var sound = new Audio("app/"+key);
			if (key.indexOf("music") > -1) {
				sound.volume=0.5;
				sound.addEventListener('ended', function() {
					this.currentTime = 0;
				    this.play();
				}, false);
			}
			
			this.sounds[key] = sound;
		};
		
		/**
		 * Joue le son et le creer s'il n'existe pas
		 */
		this.play = function(key) {
			if (!key) return;
			if (!this.sounds[key]) {
				console.log("Never pass!");
				this.load(key);
			}
			try {
				this.sounds[key].play();
			}catch (e) {
				this.load(key);
			}
		};

		/**
		 * Joue le son et le creer s'il n'existe pas
		 */
		this.playSound = function(key) {
			if (!key) return;
			console.log("playSound : ", key);
			this.play("sounds/"+key);
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