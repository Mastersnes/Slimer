/*global define */
define(["jquery",
        'underscore',
        "app/utils/utils",
        "text!app/template/game/game.html",
        "text!app/template/game/end.html",
        "app/view/game/cinematiqueView",
        "app/data/slimes"],
function($, _, Utils, page, endPage, CinematiqueView, Slimes) {
	'use strict';

	return function(parent, Textes, Mediatheque) {
		this.init = function(parent, Textes, Mediatheque) {
			this.didactitiel = 1;
		    this.forcePop = "1";
		    this.randomPop = false;
		    
		    this.el = $("#app");
			this.Textes = Textes;
			this.mediatheque = Mediatheque;
			this.point = -1;
			this.nbrSlime = -1;
			this.maxSlime = 1000;
			this.randMax = 100;
			this.multiplicateur = 1;
			this.degats = 1;
			this.delays = [];
			this.endGame = false;
			
			this.maxType = 8;
			
			this.combo = {
					type : null,
					time : 0
			};
			
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
			this.addPoint();
			this.addSlime(1);
			this.loop();
		};
		
		this.loop = function() {
		    var that = this;
		    
		    if (this.cinematique.isEmpty()) {
		    	var rand = 0;
		    	if (this.randomPop) rand = Utils.rand(0, this.randMax);
    		    if (this.forcePop) {
    		    	rand = parseInt(this.randMax/2);
    		    }
    		    //console.log("rand : ", rand, this.randMax, parseInt(this.randMax/2));
    		    if(rand == parseInt(this.randMax/2)) {
    		        var x = Utils.rand(10, 90);
    		        var y = Utils.rand(10, 90);
    		        
    		        if (this.nbrSlime > this.maxSlime) this.gameOver();
    		        
    		        var slime = $("<div></div>");
    		        
    		        var type = Utils.rand(1, this.maxType);
    		        if (this.forcePop) {
    		        	type = this.forcePop;
    		        	this.forcePop = null;
    		        }
    		        slime.addClass("slime type"+type);
    		        slime.attr("type", type);
    		        slime.attr("life", 3);
    		        slime.css({
    		            left : x + "%",
    		            top : y + "%"
    		        });
    		        
    		        this.addSlime(1);
    		        $(".game").append(slime);
    		        
    		        if (this.didactitiel > 0) $(".cible").css({
    		    		left: (x-0.3) + "%",
		        		top : (y-0.3) + "%"
		        	});
    		        
    		        slime.click(function(e) {
    		        	e.preventDefault();
    		        	if (!slime.attr("type")) return
    		        	if (that.didactitiel > 0) that.didactitiel++;
    		        	if (that.didactitiel > 5) that.didactitiel = 0;
    		        	
    		        	if (that.randomPop) that.randMax -= 5;
    		        	if (that.randMax < 10) that.randMax = 10;
    		        	
    		        	that.mediatheque.playSound("zouip.mp3");
    		        	if (that.delays["boom"]>0 && type == 7) that.explodeSlime($(this));
    		        	else that.hurtSlime($(this));
    		        });
    		    }
    		    
    		    if (this.didactitiel > 0) {
    		    	$(".cible").show();
		        	$(".didactitiel").show();
		        	$(".didactitiel .text").html(this.Textes.get("didactitiel"+this.didactitiel));
		        	if (this.didactitiel >= 4) $(".cible").hide();
		        }else {
		        	$(".cible").hide();
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
		    		$(".buffs ."+index).remove();
		    		//L'action a délais se termine
		    		this.delays[index] = -1;
		    		switch(index) {
		    			case "bonus-x2":
		    				this.multiplicateur = 1;
		    				break;
		    		}
		    	}
		    }
		};
		
		this.addBuff = function(index) {
			$(".buffMessage").attr("class", "buffMessage h-center v-center "+index);
			$(".buffMessage").css({
				transform: "scale(1)"
			});
			setTimeout(function() {
				$(".buffMessage").css({
					transform: "scale(0)"
				});
				setTimeout(function() {
					$(".buffMessage").attr("class", "buffMessage h-center v-center");
				}, 500);
			}, 600);
			
			if ($(".buffs ."+index).length == 0) {
				var li = $("<li></li>");
				li.addClass(index);
				li.attr("title", Textes.get(index));
				$(".buffs").append(li);
			}
		};
		
		this.hurtSlime = function(element, killClass) {
			var life = parseInt(element.attr("life"));
            life -= this.degats;
            
            if (this.delays["one-shot"]>0) life = 0;
            
            if (killClass) {
            	life = 0;
            	element.attr("class", "slime "+killClass+element.attr("type"));
            }else {
	            element.addClass("shake");
	            setTimeout(function() {
	            	element.removeClass("shake");
	            }, 500);
            }
            if (life <= 0) {
                this.addPoint();
                this.addSlime(-1);
                this.checkCombo(element);
                
                if (this.didactitiel) this.randomPop = true;
            	if (this.nbrSlime == 0) this.forcePop = Utils.rand(1, this.maxType);
            	
            	element.removeClass("type" + element.attr("type"));
            	element.removeAttr("type");
            	element.addClass("dead");
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
	                "transform": "scale("+(life/3)+")"
	            });
	            if (this.didactitiel > 0) $(".cible").css({
		    		left: (x-0.3) + "%",
	        		top : (y-0.3) + "%"
	        	});
            }
		};
		
		this.explodeSlime = function(slime) {
			var x1 = slime.position().left; var y1 = slime.position().top;
			var w = slime.width(); var h = slime.height();
			
			var that = this;
			$(".slime").each(function() {
				var x2 = $(this).position().left; var y2 = $(this).position().top;
				if (x2 + w > x1 - w && 
					x2 < x1 + w && 
					y2 + h > y1 - h && 
					y2 < y1 + h) {
					that.hurtSlime($(this), "explode");
				}
			});
			
			slime.hurtSlime(element, "explode");
		};
		
		this.checkCombo = function(element) {
			var typeNumber = element.attr("type");
			
			var slime = Slimes.get(typeNumber);
			if (this.combo.type == slime.type) {
				this.combo.time++;
				if (this.combo.time >= 0) {
					slime.action(this, element);
					this.combo.type = null;
					this.combo.time = 0;
				}
			}else {
				this.combo.type = slime.type;
				this.combo.time = 1;
			}
		};
		
		this.addPoint = function() {
			this.point += this.multiplicateur;
			$("#hit").html(this.point);
		};
		
		this.addSlime = function(nbr) {
		    this.nbrSlime+=nbr;
		    $("#nbrSlime").html(this.nbrSlime);
		};

		this.gameOver = function() {
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