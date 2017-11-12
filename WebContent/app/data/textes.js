'use strict';
define(["jquery"], function($){
	var data = {
		/**
		 * Textes
		 */
		"bienvenue" : {
			fr : "Bienvenue",
			en : "Wellcome"
		},
		"guest" : {
			fr : "Invité",
			en : "Guest"
		},
		"newGame" : {
			fr : "Nouvelle partie",
			en : "New Game"
		},
		"options" : {
			fr : "Options",
			en : "Options"
		},
		"langage" : {
			fr : "Langage :",
			en : "Language :"
		},
		"fullscreen" : {
			fr : "Plein &eacutecran (appuyez sur echap pour revenir)",
			en : "Fullscreen (press escape for return)"
		},
		"credits" : {
			fr : "Credits",
			en : "Credits"
		},
		"illustration" : {
			fr : "Illustrations",
			en : "Illustrations"
		},
		"developpement" : {
			fr : "D&eacuteveloppement",
			en : "Development"
		},
		"music" : {
			fr : "Musiques",
			en : "Musics"
		},
		"skip" : {
			fr : "Passer >>>",
			en : "Skip >>>"
		},
		"followUs" : {
            fr : "Suivez-nous sur <a target='_blank' alt='Facebook' href='https://www.facebook.com/lesjeuxdebebel/'>Facebook</a> ou <a target='_blank' alt='Twitter' href='http://twitter.com/lesjeuxdebebel'>Twitter</a>.",
            en : "Follow us on <a target='_blank' alt='Facebook' href='https://www.facebook.com/lesjeuxdebebel/'>Facebook</a> or <a target='_blank' alt='Twitter' href='http://twitter.com/lesjeuxdebebel'>Twitter</a>."
        },
        "followUs2" : {
            fr : "Soutenez-nous sur <a target='_blank' alt='Tipeee' href='https://www.tipeee.com/les-jeux-de-bebel/'>Tipeee</a>.",
            en : "Support us on <a target='_blank' alt='Tipeee' href='https://www.tipeee.com/les-jeux-de-bebel/'>Tipeee</a>."
        },
        "followUs3" : {
            fr : "Nos autres jeux sur <a target='_blank' alt='Kongregate' href='http://www.kongregate.com/games/JeuxBebel'>Kongregate</a>.",
            en : "Our other games on <a target='_blank' alt='Kongregate' href='http://www.kongregate.com/games/JeuxBebel'>Kongregate</a>."
        },
		"partenaires" : {
			fr : "Partenaires",
			en : "Partners"
		},
		"copyright-licence" : {
			fr : "Cette oeuvre est sous license ",
			en : "This work is licensed by "
		},
		"copyright-donot" : {
			fr : "Merci de ne pas la modifier ou la partager de fa&ccedil;on commerciale sans notre accord.",
			en : "Please don't modify and share it commercially without our consent."
		},
		"point" : {
			fr : "Point",
			en : "Point"
		},
		"nbrSlime" : {
		    fr : "Nombre de slime",
		    en : "Slime number"
		},
		"bonus-x2" : {
			fr : "Bonus x2, avez-vous encore faim ?",
			en : "Bonus x2, are you still hungry ?"
		},
		"one-shot" : {
			fr : "One Shot ! Un tir, un mort !",
			en : "One Shot, One Die ! "
		},
		"boom" : {
			fr : "Boom ! les rouges explosent !",
			en : "Boom ! The reds explode !"
		},
		"freeze" : {
			fr : "Freeze ! les slimes apparaissent moins vite !",
			en : "Freeze ! Slimes appear slower !"
		},
		"speed" : {
			fr : "Speed ! les slimes apparaissent plus vite !",
			en : "Speed ! Slimes appear faster !"
		},
		"end0" : {
			fr : "F&eacute;licitation, vous avez termin&eacute; le jeu avec : <span id='point'></span> Points",
			en : "Congratulations, you won with : <span id='point'></span> Points"
		},
		"end1" : {
			fr : "N&apos;h&eacute;sitez pas &agrave; donner votre avis sur notre page <a target='_blank' alt='Les jeux de Bebel' href='https://www.facebook.com/lesjeuxdebebel/'>Les jeux de Bebel</a>.",
			en : "Give us your opinion about the game on our page : <a target='_blank' alt='Les jeux de Bebel' href='https://www.facebook.com/lesjeuxdebebel/'>Les jeux de Bebel</a>."
		},
		"end2" : {
			fr : "Ou bien sur <a target='_blank' alt='Diaspora' href='https://framasphere.org/tags/bebel'>Diaspora</a>.",
			en : "Or on <a target='_blank' alt='Diaspora' href='https://framasphere.org/tags/bebel'>Diaspora</a>."
		},
		"end3" : {
			fr : "Vous pouvez aussi retenter votre chance en lancant une nouvelle partie.",
			en : "You can also retry by launching a new game."
		},
		"end4" : {
			fr : "D&eacute;couvrez nos autres jeux sur notre <a target='_blank' alt='Site internet' href='http://lesjeuxdebebel.fr.nf/Bebel'>Site internet</a>.",
			en : "Discover our other games on our <a target='_blank' alt='Website' href='http://lesjeuxdebebel.fr.nf/Bebel'>Website</a>."
		},
		"didactitiel1" : {
			fr : "Ça, là, c'est une glaire. Essayez de cliquer dessus.",
			en : "There, here, is a slime. Try to click on it."
		},
		"didactitiel2" : {
			fr : "C'est un peu gluant, hein ? Elle est réapparue à un autre endroit ! Cliquez dessus de nouveau.",
			en : "It's a little sticky, huh ? It reappeared somewhere else ! Click on it again."
		},
		"didactitiel3" : {
			fr : "Si vous tuez le petit slime restant, vous gagnerez un point ! Essayez pour voir. =)",
			en : "If you kill the little one remaining, you'll earn a point ! Try it to see. =)"
		},
		"didactitiel4" : {
			fr : "Le début de la fortune ! Tuez 3 petites glaires de même couleur pour déclencher un combo !",
			en : "The beginning of fortune ! Kill 3 little same color slime to trigger a combo !"
		},
		"didactitiel5" : {
			fr : "Maintenant, vous pouvez stopper l'invasion ! Le monde compte sur vous !",
			en : "Now you can stop the invasion ! The world relies on you !"
		}
	};
	
	return {
		local : null,
		
		/**
		* Permet d'appeler un WS
		**/
		get : function(key) {
			if (!this.local) {
				this.local = navigator.language || navigator.userLanguage;
			}
			var text = $.extend(true, {}, data[key]);
			if (!text[this.local]) return text.en;
			return text[this.local];
		}
	};
});