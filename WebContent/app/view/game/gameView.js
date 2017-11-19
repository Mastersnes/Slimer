/*global define */
define(["jquery",
        'underscore',
        "app/utils/utils",
        "text!app/template/game/game.html",
        "text!app/template/game/end.html",
        "app/view/game/cinematiqueView",
        "app/data/slimes",
        "app/data/genres"],
function($, _, Utils, page, endPage, CinematiqueView, Slimes, Genres) {
	'use strict';

	return function(parent, Textes, Mediatheque) {
		this.init = function(parent, Textes, Mediatheque) {
			this.didactitiel = 1;
			this.endGame = false;
		    
			this.forcePop = "1";
		    this.randomPop = false;
		    this.firstTime = true;
		    this.nextPopDelay = 100;
			this.nextPop = 0;
		    
		    this.soundTick = 1;
		    
		    this.el = $("#app");
			this.Textes = Textes;
			this.mediatheque = Mediatheque;
			this.kongregateUtils = parent.kongregateUtils;
			
			this.point = -1;
			this.nbrSlime = -1;
			this.maxSlime = 1000;
			
			this.multiplicateur = 1;
			this.degats = 1;
			this.slimeKilled = 0;
			this.delays = [];
			
			this.maxType = 8;
			this.maxGenre = 6;
			
			this.combo = {
					type : null,
					time : 0,
					nbTotal : 0
			};
			
			this.bossNumber = 0;
			
			this.render();
		};

		this.render = function() {
			_.templateSettings.variable = "data";
			var template = _.template(page);
			var templateData = {
					text : this.Textes
			};
			this.el.html(template(templateData));
			
			this.cinematique = new CinematiqueView();
			this.cinematique.load();
			
			$("#maxSlime").html(this.maxSlime);
			this.addPoint(1);
			this.addSlime(1);
			this.loop();
		};
		
		this.loop = function() {
		    var that = this;
		    
		    if (this.cinematique.isEmpty()) {
		    	if (this.firstTime) {
		    		this.mediatheque.play("/music/slimer.mp3");
		    		this.firstTime = false;
		    	}
		    	this.checkLimit();
		    	
		    	var rand = 0;
		    	if (this.randomPop) {
		    		if (this.nextPop > 0) this.nextPop--;
		    		else  {
		    			var rander = Utils.rand(2, 6);
		    			rand = Utils.rand(0, rander);
		    		}
		    	}
    		    if(rand == 1 || this.forcePop) {
    		    	var type = Utils.rand(1, this.maxType);
    		        var genre = Utils.rand(1, this.maxGenre);
    		        var genreData = Genres.get(genre);
    		        
    		        var chance = 0;
    		        if (genreData.rarete) {
    		        	chance = Utils.rand(0, genreData.rarete);
    		        }
    		        if (genreData.boss == this.bossNumber) {
    		        	
    		        }
    		    	
    		        if (chance == 0) {
	    		    	if (!this.forcePop) {
	    		    		this.addPoint(-1);
	    		    		this.nextPop = this.nextPopDelay;
	    		    	}
	    		        var x = Utils.rand(10, 90);
	    		        var y = Utils.rand(10, 90);
	    		        
	    		        if (this.nbrSlime > this.maxSlime) this.gameOver();
	    		        
	    		        var slime = $("<div></div>");
	    		        
	    		        if (this.forcePop) {
	    		        	type = this.forcePop;
	    		        	genre = 1;
	    		        	genreData = Genres.get(genre);
	    		        	this.forcePop = null;
	    		        }
	    		        slime.addClass("slime");
	    		        slime.addClass("type"+type);
	    		        slime.addClass("genre"+genre);
	    		        
	    		        slime.attr("type", type);
	    		        slime.attr("genre", genre);
	    		        
	    		        var maxLife = 3;
	    		        if (genreData.life) maxLife = genreData.life;
	    		        if (genreData.limit) {
	    		        	slime.attr("limit", genreData.limit);
	    		        }
	    		        
	    		        slime.attr("maxLife", maxLife);
	    		        slime.attr("life", maxLife);
	    		        slime.css({
	    		            left : x + "%",
	    		            top : y + "%"
	    		        });
	    		        
	    		        this.addSlime(1);
	    		        $(".game").append(slime);
	    		        
	    		        if (this.didactitiel > 0) $(".game .cible").css({
	    		    		left: (x-0.3) + "%",
			        		top : (y-0.3) + "%"
			        	});
	    		        
	    		        slime.click(function(e) {
	    		        	e.preventDefault();
	    		        	if (!slime.attr("type")) return
	    		        	if (that.didactitiel > 0) that.didactitiel++;
	    		        	if (that.didactitiel > 5) that.didactitiel = 0;
	    		        	
	    		        	if (that.nextPopDelay > 50) that.nextPopDelay-=5;
	    		        	else if (that.nextPopDelay > 30) that.nextPopDelay-=20;
	    		        	else if (that.nextPopDelay > 10) that.nextPopDelay-=2;
	    		        	else if (that.nextPopDelay > 5) that.nextPopDelay-=1;
	    		        	
	    		        	that.mediatheque.playSound("zouip.mp3", that.soundTick);
	    		        	that.soundTick++; if (that.soundTick > 3) that.soundTick = 1;
	    		        	
	    		        	if (that.delays["boom"]>0 && type == 7) that.explodeSlime($(this));
	    		        	else that.hurtSlime($(this));
	    		        });
    		        }
    		    }
    		    
    		    if (this.didactitiel > 0) {
    		    	$(".game .cible").show();
		        	$(".didactitiel").show();
		        	$(".didactitiel .text").html(this.Textes.get("didactitiel"+this.didactitiel));
		        	if (this.didactitiel >= 4) $(".game .cible").hide();
		        }else {
		        	$(".game .cible").hide();
		        	$(".didactitiel").hide();
		        }
    		    
    		    this.checkDelays();
		    }
		    
		    if (!this.endGame) {
			    setTimeout(function() {
			        that.loop();
			    }, 100);
		    }
		};
		
		this.checkDelays = function() {
			for (var index in this.delays) {
		    	if (this.delays[index] > 0) {
		    		this.delays[index]--;
		    	}else if (this.delays[index] ==0) {
		    		$(".game .buffs ."+index).remove();
		    		$(".background").removeClass(index);
		    		//L'action a délais se termine
		    		this.delays[index] = -1;
		    		switch(index) {
		    			case "bonus-x2":
		    				this.multiplicateur = 1;
		    				break;
		    			case "freeze":
		    				this.nextPopDelay /= 10;
		    				break;
		    			case "speed":
		    				this.nextPopDelay *= 10;
		    				if (this.nextPopDelay <=0) this.nextPopDelay = 5;
		    				break;
		    		}
		    	}
		    }
		};
		
		this.addBuff = function(index) {
			$(".game .buffMessage").attr("class", "buffMessage h-center v-center "+index);
			$(".game .buffMessage").css({
				transform: "scale(1)"
			});
			setTimeout(function() {
				$(".game .buffMessage").css({
					transform: "scale(0)"
				});
				setTimeout(function() {
					$(".game .buffMessage").attr("class", "buffMessage h-center v-center");
				}, 500);
			}, 600);
			
			if ($(".game .buffs ."+index).length == 0) {
				var li = $("<li></li>");
				li.addClass(index);
				li.attr("title", Textes.get(index));
				$(".game .buffs").append(li);
			}
			
			if (!$(".game .background").hasClass(index)) {
				$(".game .background").addClass(index);
			}
		};
		
		this.hurtSlime = function(element, killClass) {
			var life = parseInt(element.attr("life"));
			var maxLife = parseInt(element.attr("maxLife"));
            life -= this.degats;
            
            if (this.delays["one-shot"]>0) life = 0;
            
            if (killClass) {
            	life = 0;
            	element.attr("class", "slime " + killClass+element.attr("type"));
            }else {
	            element.addClass("shake");
	            setTimeout(function() {
	            	element.removeClass("shake");
	            }, 500);
            }
            if (life <= 0) {
            	this.slimeKilled++;
            	this.kongregateUtils.score("SlimeKill", this.slimeKilled);
                this.addPoint(maxLife);
                this.addSlime(-1);
                this.checkCombo(element);
                
                var genre = Genres.get(element.attr("genre"));
                if (genre.deadAction) genre.deadAction(this, element);
                
                if (this.didactitiel) this.randomPop = true;
            	if (this.nbrSlime == 0) this.forcePop = Utils.rand(1, this.maxType);
            	
            	element.removeClass("type" + element.attr("type"));
            	element.removeAttr("type");
            	element.addClass("dead"+maxLife);
            	element.css({
	                "transform": "scale(1)"
	            });
            	element.fadeOut(1000, function() {
            		element.remove();
            	});
            }else {
            	element.attr("life", life);
                var x = Utils.rand(10, 90);
                var y = Utils.rand(10, 90);
                element.css({
	                left : x + "%",
                    top : y + "%",
	                "transform": "scale("+(life/maxLife)+")"
	            });
	            if (this.didactitiel > 0) $(".game .cible").css({
		    		left: (x-0.3) + "%",
	        		top : (y-0.3) + "%"
	        	});
            }
		};
		
		this.explodeSlime = function(slime) {
			var x1 = slime.position().left; var y1 = slime.position().top;
			var w = slime.width(); var h = slime.height();
			
			var that = this;
			$(".game .slime").each(function() {
				var x2 = $(this).position().left; var y2 = $(this).position().top;
				if (x2 + w > x1 - w && 
					x2 < x1 + w && 
					y2 + h > y1 - h && 
					y2 < y1 + h) {
					that.hurtSlime($(this), "explode");
				}
			});
			
			this.hurtSlime(slime, "explode");
		};
		
		this.checkLimit = function() {
			var that = this;
			$(".game .slime[limit]").each(function() {
				var limit = parseInt($(this).attr("limit"));
				limit--;
				if (limit == 0) {
					var element = $(this);
					element.fadeOut(1000, function() {
						that.addSlime(-1);
						element.remove();
	            	});
				}else {
					$(this).attr("limit", limit);
				}
			});
		};
		
		this.checkCombo = function(element) {
			var typeNumber = element.attr("type");
			
			var slime = Slimes.get(typeNumber);
			if (this.combo.type == slime.type) {
				this.combo.time++;
				this.combo.nbTotal++;
				this.kongregateUtils.score("NbCombo", this.combo.nbTotal);
				if (this.combo.time >= 3) {
					slime.action(this, element);
					this.combo.type = null;
					this.combo.time = 0;
				}
			}else {
				this.combo.nbTotal = 0;
				this.combo.type = slime.type;
				this.combo.time = 1;
			}
		};
		
		this.addPoint = function(incr) {
			if (!incr) incr = 1;
			if (incr < 0) this.point += incr;
			else this.point += incr*this.multiplicateur;
			
			if (this.point < 0) this.point = 0;
			this.kongregateUtils.score("Point", this.point);
			$("#hit").html(this.point);
		};
		
		this.addSlime = function(nbr) {
		    this.nbrSlime+=nbr;
		    this.kongregateUtils.score("SlimeMax", this.nbrSlime);
		    $("#nbrSlime").html(this.nbrSlime);
		};

		this.gameOver = function() {
			this.kongregateUtils.score("GameOver", 1);
			this.endGame = true;
			$(".game").empty();
		    
		    _.templateSettings.variable = "data";
            var template = _.template(endPage);
            var templateData = {
                    text : this.Textes
            };
            $(".game").html(template(templateData));
            $("#point").html(this.point);
		};
				
		this.init(parent, Textes, Mediatheque);
	};
});