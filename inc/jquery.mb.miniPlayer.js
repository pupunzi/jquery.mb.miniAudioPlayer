/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.miniPlayer.js
 *
 *  Copyright (c) 2001-2013. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 07/03/13 23.30
 *  *****************************************************************************
 */

/*Browser detection patch*/
(function(){if(!(8>jQuery.fn.jquery.split(".")[1])){jQuery.browser={};jQuery.browser.mozilla=!1;jQuery.browser.webkit=!1;jQuery.browser.opera=!1;jQuery.browser.msie=!1;var a=navigator.userAgent;jQuery.browser.name=navigator.appName;jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion);jQuery.browser.majorVersion=parseInt(navigator.appVersion,10);var c,b;if(-1!=(b=a.indexOf("Opera"))){if(jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=a.substring(b+6),-1!=(b= a.indexOf("Version")))jQuery.browser.fullVersion=a.substring(b+8)}else if(-1!=(b=a.indexOf("MSIE")))jQuery.browser.msie=!0,jQuery.browser.name="Microsoft Internet Explorer",jQuery.browser.fullVersion=a.substring(b+5);else if(-1!=(b=a.indexOf("Chrome")))jQuery.browser.webkit=!0,jQuery.browser.name="Chrome",jQuery.browser.fullVersion=a.substring(b+7);else if(-1!=(b=a.indexOf("Safari"))){if(jQuery.browser.webkit=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=a.substring(b+7),-1!=(b=a.indexOf("Version")))jQuery.browser.fullVersion= a.substring(b+8)}else if(-1!=(b=a.indexOf("Firefox")))jQuery.browser.mozilla=!0,jQuery.browser.name="Firefox",jQuery.browser.fullVersion=a.substring(b+8);else if((c=a.lastIndexOf(" ")+1)<(b=a.lastIndexOf("/")))jQuery.browser.name=a.substring(c,b),jQuery.browser.fullVersion=a.substring(b+1),jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()&&(jQuery.browser.name=navigator.appName);if(-1!=(a=jQuery.browser.fullVersion.indexOf(";")))jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0, a);if(-1!=(a=jQuery.browser.fullVersion.indexOf(" ")))jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,a);jQuery.browser.majorVersion=parseInt(""+jQuery.browser.fullVersion,10);isNaN(jQuery.browser.majorVersion)&&(jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion),jQuery.browser.majorVersion=parseInt(navigator.appVersion,10));jQuery.browser.version=jQuery.browser.majorVersion}})(jQuery);

/*Metadata.js*/
(function(c){c.extend({metadata:{defaults:{type:"class",name:"metadata",cre:/({.*})/,single:"metadata"},setType:function(b,c){this.defaults.type=b;this.defaults.name=c},get:function(b,f){var d=c.extend({},this.defaults,f);d.single.length||(d.single="metadata");var a=c.data(b,d.single);if(a)return a;a="{}";if("class"==d.type){var e=d.cre.exec(b.className);e&&(a=e[1])}else if("elem"==d.type){if(!b.getElementsByTagName)return;e=b.getElementsByTagName(d.name);e.length&&(a=c.trim(e[0].innerHTML))}else void 0!= b.getAttribute&&(e=b.getAttribute(d.name))&&(a=e);0>a.indexOf("{")&&(a="{"+a+"}");a=eval("("+a+")");c.data(b,d.single,a);return a}}});c.fn.metadata=function(b){return c.metadata.get(this[0],b)}})(jQuery);

(function (jQuery) {

	var map = {};

	jQuery.mbMiniPlayer = {
		author  : "Matteo Bicocchi",
		version : "1.6.6",
		name    : "mb.miniPlayer",
		icon    : {
			play      : "P",
			pause     : "p",
			stop      : "S",
			rewind    : "R",
			volume    : "Vm",
			volumeMute: "Vm"
		},
		defaults: {
			width               : 150,
			skin                : "black", // available: black, blue, orange, red, gray
			volume              : .5,
			autoplay            : false,
			animate             : true,
			playAlone           : true,
			inLine              : false,
			volumeLevels        : 8,
			showVolumeLevel     : true,
			showTime            : true,
			showRew             : true,
			addShadow           : true,
			downloadable        : false,
			downloadablesecurity: false,
			swfPath             : "inc/",
			onPlay              : function () {},
			onEnd               : function () {}
		},

		buildPlayer: function (options) {
			this.each(function (idx) {
				var $master = jQuery(this);
				$master.hide();
				var url = $master.attr("href");
				var ID = "mp_" + ($master.attr("id") ? $master.attr("id") : new Date().getTime());
				var title = $master.html();

				var downloadURL = $master.attr("href").replace(".mp3", "").split("/");
				downloadURL = downloadURL[downloadURL.length - 1];

				var $player = jQuery("<div/>").attr({id: "JPL_" + ID});
				var player = $player.get(0);
				player.opt = {};
				jQuery.extend(player.opt, jQuery.mbMiniPlayer.defaults, options);
				player.idx = idx;
				player.title = title;

				player.opt.isIE9 = jQuery.browser.msie && jQuery.browser.version == 9;

				if (jQuery.metadata) {
					jQuery.metadata.setType("class");
					jQuery.extend(player.opt, $master.metadata());
				}

				if (player.opt.width.toString().indexOf("%") >= 0) {
					var margin = player.opt.downloadable ? 220 : 180;
					var pW = $master.parent().outerWidth() - margin;
					player.opt.width = (pW * (parseFloat(player.opt.width))) / 100;
				}

				if ('ontouchstart' in window) { //'ontouchstart' in window

					player.opt.showVolumeLevel = false;
					player.opt.autoplay = false;
					player.opt.downloadable = false;

				}

				if (!player.opt.mp3)
					player.opt.mp3 = url;

				var skin = player.opt.skin;

				var $controlsBox = jQuery("<div/>").attr({id: ID, isPlaying: false}).addClass("mbMiniPlayer").addClass(skin);
				if (player.opt.inLine)
					$controlsBox.css({display: "inline-block", verticalAlign: "middle"});
				if (player.opt.addShadow)
					$controlsBox.addClass("shadow");
				var $layout = "<table cellpadding='0' cellspacing='0' border='0'><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr></table>";
				jQuery("body").append($player);
				$master.after($controlsBox);
				$controlsBox.html($layout);


				if (typeof map.downloadUrl == "undefined")
					map.downloadUrl = "";

				var download = jQuery("<span/>").addClass("map_download").css({display: "inline-block", cursor: "pointer"}).html("d").on("click",function () {
					window.open(player.opt.mp3, "map_download");
//					location.href = map.downloadUrl + "?filename=" + downloadURL + ".mp3" + "&fileurl=" + encodeURI(player.opt.mp3); //title.asId()
				}).attr("title", "download: " + downloadURL);

				if (typeof map.userCanDownload == "undefined")
					map.userCanDownload = true;

				if (player.opt.downloadable) {
					if (!player.opt.downloadablesecurity || (player.opt.downloadablesecurity && map.userCanDownload))
						$controlsBox.append(download);
				}

				var $tds = $controlsBox.find("td").unselectable();

				var $volumeBox = jQuery("<span/>").addClass("map_volume").html(jQuery.mbMiniPlayer.icon.volume);
				var $volumeLevel = jQuery("<span/>").addClass("map_volumeLevel").html("").hide();
				for (var i = 0; i < player.opt.volumeLevels; i++) {
					$volumeLevel.append("<a/>")
				}
				var $playBox = jQuery("<span/>").addClass("map_play").html(jQuery.mbMiniPlayer.icon.play);
				var $rewBox = jQuery("<span/>").addClass("map_rew").html(jQuery.mbMiniPlayer.icon.rewind).hide();
				var $timeBox = jQuery("<span/>").addClass("map_time").html("").hide();

				var $controls = jQuery("<div/>").addClass("map_controls");
				var $titleBox = jQuery("<span/>").addClass("map_title").html(player.title);
				var $progress = jQuery("<div/>").addClass("jp-progress");

				var $loadBar = jQuery("<div/>").addClass("jp-load-bar").attr("id", "loadBar_" + ID);
				var $playBar = jQuery("<div/>").addClass("jp-play-bar").attr("id", "playBar_" + ID);
				$progress.append($loadBar);
				$loadBar.append($playBar);
				$controls.append($titleBox).append($progress);

				$tds.eq(0).append($volumeBox);
				$tds.eq(1).append($volumeLevel);
				$tds.eq(2).addClass("map_controlsBar").append($controls);
				$tds.eq(3).append($timeBox);
				$tds.eq(4).append($rewBox);
				$tds.eq(5).append($playBox);

				//init jPlayer component (Happyworm Ltd - http://www.jplayer.org)
				$player.jPlayer({
					ready              : function () {
						var el = jQuery(this);
						el.jPlayer("setMedia", {mp3: player.opt.mp3, oga: player.opt.ogg});

						if (typeof ID3 == "object") {
							ID3.loadTags(player.opt.mp3, function () {
								//var data = ID3.getAllTags(player.opt.mp3);
								//console.debug(data);
								var info = {};
								info.title = ID3.getTag(player.opt.mp3, "title");
								info.artist = ID3.getTag(player.opt.mp3, "artist");
								info.album = ID3.getTag(player.opt.mp3, "album");
								info.track = ID3.getTag(player.opt.mp3, "track");

								$titleBox.html(info.title + " - " + info.artist);

								function drawInfoPanel() {
									var getInfo = $("<div/>").addClass("map_info");
									for (var i in info) {
										if (info[i] != null) {
											var str = "<div>" + i + ": " + info[i] + "</div>";
											getInfo.append(str);
										}
									}
									$controlsBox.append(getInfo);
									$titleBox.on("mouseenter",function (e) {
										getInfo.fadeIn(300);
									}).on("mouseleave", function () {
												getInfo.fadeOut(300);
											})

								}

								//drawInfoPanel();
							})
						}

						function animatePlayer(anim) {

							if (anim == undefined)
								anim = true;

							var speed = anim ? 500 : 0;

							var isIE = jQuery.browser.msie && jQuery.browser.version < 9;

							if (!player.isOpen) {
								$controls.css({display: "block", height: 20}).animate({width: player.opt.width}, speed);

								if (player.opt.showRew) {
									if (isIE)
										$rewBox.show().css({width: 20, display: "block"});
									else
										$rewBox.show().animate({width: 20}, speed / 2);
								}
								if (player.opt.showTime) {
									if (isIE)
										$timeBox.show().css({width: 30, display: "block"});
									else
										$timeBox.animate({width: 30}, speed / 2).show();
								}
								if (player.opt.showVolumeLevel) {
									if (isIE)
										$volumeLevel.show().css({width: 40, display: "block"});
									else
										$volumeLevel.show().animate({width: 40}, speed / 2);
								}
							} else {
								$controls.animate({width: 1}, speed, function () {
									jQuery(this).css({display: "none"})
								});
								if (player.opt.showRew) {
									$rewBox.animate({width: 1}, speed / 2, function () {
										jQuery(this).css({display: "none"})
									});
								}
								if (player.opt.showTime) {
									$timeBox.animate({width: 1}, speed / 2, function () {
										jQuery(this).css({display: "none"})
									});
								}
								if (player.opt.showVolumeLevel) {
									$volumeLevel.animate({width: 1}, speed / 2, function () {
										jQuery(this).css({display: "none"})
									});
								}
							}

						}

						if (!player.opt.animate)
							animatePlayer(false)

						$playBox.on("click",
								function () {

									if (!player.isOpen) {

										if (player.opt.animate)
											animatePlayer();

										player.isOpen = true;

										if (player.opt.playAlone) {
											jQuery("[isPlaying=true]").find(".map_play").click();
										}

										jQuery(this).html(jQuery.mbMiniPlayer.icon.pause);

										$controlsBox.attr("isPlaying", "true");

										el.jPlayer("play");

										//add track for Google Analytics
										if (typeof _gaq != "undefined")
											_gaq.push(['_trackEvent', 'Audio', 'Play', player.title]);

										if (typeof player.opt.onPlay == "function")
											player.opt.onPlay(player);

									} else {

										if (player.opt.animate)
											animatePlayer();

										player.isOpen = false;

										jQuery(this).html(jQuery.mbMiniPlayer.icon.play);

										$controlsBox.attr("isPlaying", "false");
										el.jPlayer("pause");
									}
								}).hover(
								function () {
									jQuery(this).css({opacity: .8})
								},
								function () {
									jQuery(this).css({opacity: 1})
								}
						);

						$volumeBox.click(
								function () {
									if (jQuery(this).hasClass("mute")) {
										jQuery(this).removeClass("mute");
										jQuery(this).html(jQuery.mbMiniPlayer.icon.volume);
										el.jPlayer("volume", player.opt.volume);
									} else {
										jQuery(this).addClass("mute");
										jQuery(this).html(jQuery.mbMiniPlayer.icon.volumeMute);
										el.jPlayer("volume", 0);
									}
								}).hover(
								function () {
									jQuery(this).css({opacity: .8})
								},
								function () {
									jQuery(this).css({opacity: 1})
								}
						);

						$rewBox.click(function () {
							el.jPlayer("playHead", 0);
						}).hover(
								function () {
									jQuery(this).css({opacity: .8})
								},
								function () {
									jQuery(this).css({opacity: 1})
								}
						);

						var bars = player.opt.volumeLevels;
						var barVol = 1 / bars;
						$volumeLevel.find("a").each(function (i) {
							jQuery(this).css({opacity: .3, height: 3 + (2 * (i + 1)), width: Math.floor(35 / bars)});

							var IDX = Math.floor(player.opt.volume / barVol) - 1;
							if (player.opt.volume < .1 && player.opt.volume > 0)
								IDX = 0;

							$volumeLevel.find("a").css({opacity: .2}).removeClass("sel");
							for (var x = 0; x <= IDX; x++) {
								$volumeLevel.find("a").eq(x).css({opacity: .8}).addClass("sel");
							}

							jQuery(this).click(function () {
								var vol = (i + 1) * barVol;
								el.jPlayer("volume", vol);
								if (i == 0)el.jPlayer("volume", .1);
								$volumeBox.removeClass("mute");
								player.opt.volume = vol;

								var IDX = Math.floor(vol / barVol) - 1;
								if (vol < .1 && vol > 0)
									IDX = 0;

								$volumeLevel.find("a").css({opacity: .2}).removeClass("sel");
								for (var x = 0; x <= IDX; x++) {
									$volumeLevel.find("a").eq(x).css({opacity: .8}).addClass("sel");
								}

							});

						});
						// autoplay can't work on iOs devices
						if (player.opt.autoplay && ((player.opt.playAlone && jQuery("[isPlaying=true]").length == 0) || !player.opt.playAlone))
							$playBox.click();
					},
					customCssIds       : true,
					volume             : player.opt.volume,
					oggSupport         : player.opt.ogg ? true : false,
					swfPath            : player.opt.swfPath,
					preload            : "none",
				  solution: player.opt.isIE9 ? 'flash' : 'html, flash',
					cssSelectorAncestor: "#" + ID, // Remove the ancestor css selector clause
					cssSelector        : {
						playBar: "#playBar_" + ID,
						seekBar: "#loadBar_" + ID // Set a custom css selector for the play button
						// The other defaults remain unchanged
					}
				})
						.on(jQuery.jPlayer.event.play, function (e) {})
						.on(jQuery.jPlayer.event.ended, function () {
							if (player.opt.loop)
								$player.jPlayer("play");
							else
								$playBox.click();
							if (typeof player.opt.onEnd == "function")
								player.opt.onEnd(player);
						})
						.on(jQuery.jPlayer.event.timeupdate, function (e) {

							player.duration = e.jPlayer.status.duration;
							player.currentTime = e.jPlayer.status.currentTime;
							player.seekPercent = e.jPlayer.status.seekPercent;

							$loadBar.css({width: ((player.opt.width - 5) * player.seekPercent) / 100});
							$playBar.css({width: ((player.opt.width - 5) * player.currentTime) / player.duration});

							/*
							 var volume = player.opt.volume;

							 var barVol = 1 / $volumeLevel.find("a").length;
							 var IDX = Math.floor(volume / barVol) - 1;
							 if (volume < .1 && volume > 0)
							 IDX = 0;

							 $volumeLevel.find("a").css({opacity: .2}).removeClass("sel");
							 for (var i = 0; i <= IDX; i++) {
							 $volumeLevel.find("a").eq(i).css({opacity: .8}).addClass("sel");
							 }
							 */

							$timeBox.html(jQuery.jPlayer.convertTime(e.jPlayer.status.currentTime)).attr("title", jQuery.jPlayer.convertTime(e.jPlayer.status.duration));
						})
			})
		},
		changeFile : function (mp3, ogg, title) {
			var ID = jQuery(this).attr("id");
			var $controlsBox = jQuery("#mp_" + ID);
			var $player = jQuery("#JPL_mp_" + ID);
			var player = $player.get(0);
			var $titleBox = $controlsBox.find(".map_title");
			if (!ogg) ogg = "";
			if (!title) title = "audio file";
			$player.jPlayer("setMedia", {mp3: mp3, oga: ogg});

			if ($controlsBox.attr("isPlaying") == "true")
				$player.jPlayer("play");
			$titleBox.html(player.title)
		},
		play       : function () {
			return this.each(function () {
				var id = jQuery(this).attr("id");
				var player = jQuery("#mp_" + id);
				if (player.attr("isplaying") == "false")
					player.find(".map_play").click();
			})
		},
		stop       : function () {
			return this.each(function () {
				var id = jQuery(this).attr("id");
				var player = jQuery("#mp_" + id);
				if (player.attr("isplaying") == "true")
					player.find(".map_play").click();
			})
		},
		destroy    : function () {
			return this.each(function () {
				var id = this.attr("id");
				var player = jQuery("#mp_" + id);
				player.remove();
			})
		},
		getPlayer  : function () {
			var id = this.attr("id");
			return jQuery("#mp_" + id);
		}
	};

	jQuery.fn.unselectable = function () {
		this.each(function () {
			jQuery(this).css({
				"-moz-user-select"  : "none",
				"-khtml-user-select": "none",
				"user-select"       : "none"
			}).attr("unselectable", "on");
		});
		return jQuery(this);
	};
	//Public method
	jQuery.fn.mb_miniPlayer = jQuery.mbMiniPlayer.buildPlayer;
	jQuery.fn.mb_miniPlayer_changeFile = jQuery.mbMiniPlayer.changeFile;
	jQuery.fn.mb_miniPlayer_play = jQuery.mbMiniPlayer.play;
	jQuery.fn.mb_miniPlayer_stop = jQuery.mbMiniPlayer.stop;
	jQuery.fn.mb_miniPlayer_destroy = jQuery.mbMiniPlayer.destroy;
	jQuery.fn.mb_miniPlayer_getPlayer = jQuery.mbMiniPlayer.getPlayer;

	String.prototype.asId = function () {
		return this.replace(/[^a-zA-Z0-9_]+/g, '');
	};

})(jQuery);
