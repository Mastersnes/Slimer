/*global define */
define(["jquery",
        'underscore',
        "app/utils/utils",
        "text!app/template/game/game.html",
        "text!app/template/game/end.html",
        "app/view/game/cinematiqueView",],
function($, _, Utils, page, endPage, CinematiqueView) {
	'use strict';

	return function(parent, Textes, Mediatheque) {
		this.init = function(parent, Textes, Mediatheque) {
		    this.firstTime = true;
		    this.el = $("#app");
			this.Textes = Textes;
			this.mediatheque = Mediatheque;
			this.point = -1;
			this.nbrSlime = -1;
			this.maxSlime = 1000;
			this.randMax = 100;
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
    		    var rand = Utils.rand(0, this.randMax);
    		    if (this.firstTime) {
    		        rand = parseInt(this.randMax/2);
    		        this.firstTime = false;
    		    }
    		    console.log("rand : ", rand, this.randMax);
    		    if(rand == parseInt(this.randMax/2)) {
    		        var x = Utils.rand(10, 90);
    		        var y = Utils.rand(10, 90);
    		        
    		        if (this.nbrSlime > this.maxSlime) this.gameOver();
    		        
    		        var slime = $("<div></div>")
    		        slime.addClass("slime type"+Utils.rand(1, 7));
    		        slime.attr("life", 3);
    		        slime.css({
    		            left : x + "%",
    		            top : y + "%"
    		        });
    		        
    		        this.addSlime(1);
    		        $(".game").append(slime);
    		        slime.click(function() {
    		            that.randMax = parseInt(that.randMax/2);
    		            if (that.randMax<10) that.randMax = 10;
    		            that.mediatheque.playSound("zouip.mp3");
    		            var life = parseInt($(this).attr("life"));
    		            life--;
    		            $(this).addClass("shake");
    		            var sl = $(this);
    		            setTimeout(function() {
    		                sl.removeClass("shake");
    		            }, 500);
    		            if (life <= 0) {
    		                $(this).remove();
    		                that.addPoint();
    		                that.addSlime(-1);
    		            }else {
    		                $(this).attr("life", life);
    		                var x = Utils.rand(10, 90);
    		                var y = Utils.rand(10, 90);
        		            $(this).css({
        		                left : x + "%",
        	                    top : y + "%",
        		                "transform": "scale("+(life/3)+")"
        		            });
    		            }
    		        });
    		    }
		    }
		    
		    setTimeout(function() {
		        that.loop();
		    }, 100);
		};
		
		this.addPoint = function() {
		  this.point++;
		  $("#hit").html(this.point);
		};
		
		this.addSlime = function(nbr) {
		    this.nbrSlime+=nbr;
		    console.log("display : ", this.nbrSlime);
		    $("#nbrSlime").html(this.nbrSlime);
		};

		this.gameOver = function() {
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