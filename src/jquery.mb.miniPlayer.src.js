/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: jquery.mb.miniPlayer.js                                                                                                                    _
 _ last modified: 18/11/14 0.40                                                                                                                     _
 _                                                                                                                                                  _
 _ Open Lab s.r.l., Florence - Italy                                                                                                                _
 _                                                                                                                                                  _
 _ email: matteo@open-lab.com                                                                                                                       _
 _ site: http://pupunzi.com                                                                                                                         _
 _       http://open-lab.com                                                                                                                        _
 _ blog: http://pupunzi.open-lab.com                                                                                                                _
 _ Q&A:  http://jquery.pupunzi.com                                                                                                                  _
 _                                                                                                                                                  _
 _ Licences: MIT, GPL                                                                                                                               _
 _    http://www.opensource.org/licenses/mit-license.php                                                                                            _
 _    http://www.gnu.org/licenses/gpl.html                                                                                                          _
 _                                                                                                                                                  _
 _ Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);                                                                                              _
 ___________________________________________________________________________________________________________________________________________________*/

(function (jQuery) {

	jQuery.support.cors = true;

	var map = map || {};

	jQuery.mbMiniPlayer = {
		author  : "Matteo Bicocchi",
		version : "{{ version }}",
		name    : "mb.miniPlayer",
		isMobile: false,

		icon    : {
			play      : "P",
			pause     : "p",
			stop      : "S",
			rewind    : "R",
			volume    : "Vm",
			volumeMute: "Vm"
		},

		defaults: {
			ogg                 : null,
			m4a                 : null,
			width               : 150,
			skin                : "black", // available: black, blue, orange, red, gray or use the skinMaker tool to create your.
			volume              : .5,
			autoplay            : false,
			animate             : true,
			id3                 : false,
			playAlone           : true,
			loop                : false,
			inLine              : false,
			volumeLevels        : 12,
			showControls        : true,
			showVolumeLevel     : true,
			showTime            : true,
			showRew             : true,
			addShadow           : true,
			addGradientOverlay  : false,
			gaTrack             : true,
			downloadable        : false,
			downloadablesecurity: false,
			downloadPage        : null,
			swfPath             : "swf/",
			pauseOnWindowBlur   : false,
			onReady             : function (player, $controlsBox) {},
			onPlay              : function (player) {},
			onEnd               : function (player) {},
			onPause             : function (player) {},
			onMute              : function (player) {},
			onDownload          : function (player) {}
		},

		getID3: function (player) {

			if (!player.opt.id3 && !player.opt.m4a)
				return;

			var $titleBox = player.controlBox.find(".map_title");
			var url = (player.opt.mp3 || player.opt.m4a);

			if (url) {
				ID3.loadTags(url, function () {
					player.info = ID3.getAllTags(url);
					if (typeof player.info.title != "undefined" && player.info.title != "null") {
						$titleBox.html(player.info.title + " - " + player.info.artist);
					}
				}, {
					tags   : ["artist", "title", "album", "year", "comment", "track", "genre", "lyrics", "picture"],
					onError: function (reason) {
						if (reason.error === "xhr") {
							console.log("There was a network error: ", reason.xhr);
						}
					}
				});
			}
		},

		buildPlayer: function (options) {

			this.each(function (idx) {

				if (this.isInit)
					return;

				this.isInit = true;

				var $master = jQuery(this);
				$master.hide();
				var url = $master.attr("href");
				var playerID = "mp_" + ($master.attr("id") ? $master.attr("id") : new Date().getTime());
				var title = $master.html();

				// There are serious problems with the player events and Android default browser.
				// the default HTML5 player is used on that case.
				if (jQuery.isAndroidDefault) {
					var androidPlayer = jQuery("<audio/>").attr({src: url, controls: "controls"}).css({display: "block"});
					$master.after(androidPlayer);
					return;
				}

				var $player = jQuery("<div/>").attr({id: "JPL_" + playerID});
				var player = $player.get(0);
				player.opt = {};
				jQuery.extend(player.opt, jQuery.mbMiniPlayer.defaults, options);
				jQuery.mbMiniPlayer.eventEnd = jQuery.isMobile ? "touchend" : "mouseup";

				player.idx = idx + 1;
				player.title = title;

				player.opt.isIE = jQuery.browser.msie;//&& jQuery.browser.version === 9;

				this.player = player;

				if (jQuery.metadata) {
					jQuery.metadata.setType("class");
					jQuery.extend(player.opt, $master.metadata());
				}

				if (jQuery.isMobile) { //'ontouchstart' in window
					player.opt.showVolumeLevel = false;
					player.opt.autoplay = false;
					player.opt.downloadable = false;
				}

				if (!player.opt.mp3 && url.indexOf("mp3") > 0)
					player.opt.mp3 = url;
				if (!player.opt.m4a && url.indexOf("m4a") > 0)
					player.opt.m4a = url;
				if (typeof player.opt.mp3 == "undefined")
					player.opt.mp3 = null;
				if (typeof player.opt.m4a == "undefined")
					player.opt.m4a = null;

				var skin = player.opt.skin;

				var $controlsBox = jQuery("<div/>").attr({id: playerID, isPlaying: false, tabIndex: player.idx }).addClass("mbMiniPlayer").addClass(skin);
				player.controlBox = $controlsBox;

				if (player.opt.inLine)
					$controlsBox.css({display: "inline-block", verticalAlign: "middle"});
				if (player.opt.addShadow)
					$controlsBox.addClass("shadow");

				if (player.opt.addGradientOverlay)
					$controlsBox.addClass("gradientOverlay");

				var $layout = jQuery("<div class='playerTable'> <div></div><div></div><div></div><div></div><div></div><div></div> </div>");

				if (!jQuery("#JPLContainer").length) {
					var JPLContainer = jQuery("<div/>").attr({id: "JPLContainer"});
					jQuery("body").append(JPLContainer);
				}
				jQuery("#JPLContainer").append($player);

				$master.after($controlsBox);
				$controlsBox.html($layout);

				var fileUrl = encodeURI(player.opt.mp3 || player.opt.m4a);
				var fileExtension = fileUrl.substr((Math.max(0, fileUrl.lastIndexOf(".")) || Infinity) + 1);

				//if there's a querystring remove it
				if (fileExtension.indexOf("?") >= 0) {
					fileExtension = fileExtension.split("?")[0];
				}

				var fileName = encodeURI(fileUrl.replace("." + fileExtension, "").split("/").pop());

				if (player.opt.downloadable) {
					var download;
					var host = location.hostname.split(".");
					host = host.length == 3 ? host[1] : host[0];
					var isSameDomain = (fileUrl.indexOf(host) >= 0) || fileUrl.indexOf("http") < 0;
					var a = document.createElement('a');

					if (!player.opt.downloadPage) {
						//if not use downloadPage, download html5Way

						//if can download HTML5 way
						if (isSameDomain && typeof a.download != "undefined")

							download = jQuery("<a/>")
									.addClass("map_download")
									.attr({href: fileUrl, download: fileName + "." + fileExtension})
									.css({display: "inline-block", cursor: "pointer"})
									.html("d")
									.attr("title", "download: " + fileName);

						//if not open a new page with the audio file
						else

							download = jQuery("<span/>")
									.addClass("map_download")
									.css({display: "inline-block", cursor: "pointer"})
									.html("d")
									.on(jQuery.mbMiniPlayer.eventEnd, function () {
										window.open(fileUrl, "map_download");
									})
									.attr("title", "open: " + fileName);

					} else {

						// use the PHP page
						download = jQuery("<span/>")
								.addClass("map_download")
								.css({display: "inline-block", cursor: "pointer"})
								.html("d")
								.on(jQuery.mbMiniPlayer.eventEnd, function () {
									location.href = player.opt.downloadPage + "?filename=" + fileName + "." + fileExtension + "&fileurl=" + fileUrl;
								})
								.attr("title", "download: " + fileName);
					}

					download.on(jQuery.mbMiniPlayer.eventEnd, function () {
						//add track for Google Analytics
						if (typeof _gaq != "undefined" && eval(player.opt.gaTrack))
							_gaq.push(['_trackEvent', 'Audio', 'map_Download', player.title + " - " + self.location.href]);

						if (typeof ga != "undefined" && eval(player.opt.gaTrack))
							ga('send', 'event', 'Audio', 'map_Download', player.title + " - " + self.location.href);

						if (typeof player.opt.onDownload == "function")
							player.opt.onDownload(player);
					});

					$controlsBox.append(download);
				}

				var $parts = $controlsBox.find("div").not('.playerTable').unselectable();

				var $muteBox = jQuery("<span/>").addClass("map_volume").html(jQuery.mbMiniPlayer.icon.volume);
				var $volumeLevel = jQuery("<span/>").addClass("map_volumeLevel").html("").hide();
				for (var i = 0; i < player.opt.volumeLevels; i++) {
					$volumeLevel.append("<a/>")
				}
				var $playBox = jQuery("<span/>").addClass("map_play").html(jQuery.mbMiniPlayer.icon.play);
				var $rewBox = jQuery("<span/>").addClass("map_rew").html(jQuery.mbMiniPlayer.icon.rewind).hide();
				var $timeBox = jQuery("<span/>").addClass("map_time").html("").hide();

				var $controls = jQuery("<div/>").addClass("map_controls");
				var titleText = player.title;
				var $titleBox = jQuery("<span/>").addClass("map_title").html(titleText);
				var $progress = jQuery("<div/>").addClass("jp-progress");

				var $loadBar = jQuery("<div/>").addClass("jp-load-bar").attr("id", "loadBar_" + playerID);
				var $playBar = jQuery("<div/>").addClass("jp-play-bar").attr("id", "playBar_" + playerID);
				$progress.append($loadBar);
				$loadBar.append($playBar);
				$controls.append($titleBox).append($progress);

				$parts.eq(0).addClass("muteBox").append($muteBox);
				$parts.eq(1).addClass("volumeLevel").append($volumeLevel).hide();
				$parts.eq(2).addClass("map_controlsBar").append($controls).hide();
				$parts.eq(3).addClass("timeBox").append($timeBox).hide();
				$parts.eq(4).addClass("rewBox").append($rewBox).hide();
				$parts.eq(5).append($playBox);

				player.opt.media = {};
				player.opt.supplied = [];

				if (player.opt.mp3) {
					player.opt.media.mp3 = player.opt.mp3;
					player.opt.supplied.push("mp3");
				}
				if (player.opt.m4a) {
					player.opt.media.m4a = player.opt.m4a;
					player.opt.supplied.push("m4a");
				}
				if (player.opt.ogg) {
					player.opt.media.oga = player.opt.ogg;
					player.opt.supplied.push("oga");
				}

				player.opt.supplied = player.opt.supplied.toString();


				//init jPlayer component (Happyworm Ltd - http://www.jplayer.org)
				$player.jPlayer({

					ready              : function () {
						var el = jQuery(this);

						el.jPlayer("setMedia", player.opt.media);

						if (player.opt.mp3)
							jQuery.mbMiniPlayer.getID3(player);

						if (typeof player.opt.onReady == "function") {
							player.opt.onReady(player, $controlsBox);
						}

						function animatePlayer(anim) {

							player.width = player.opt.width;
							if (player.opt.width.toString().indexOf("%") >= 0) {

								var m = $playBox.outerWidth() < 40 ? 40 : $playBox.outerWidth();
								var margin = player.opt.downloadable ? (m + 10) * 3 : 40;
								var pW = $master.parent().outerWidth() - margin;
								player.width = (pW * (parseFloat(player.opt.width))) / 100;

							} else if (player.opt.width == 0) {
								player.opt.showControls = false;
							}

							if (anim == undefined)
								anim = true;

							var speed = anim ? 500 : 0;

							var isIE = jQuery.browser.msie && jQuery.browser.version < 9;

							if (!player.isOpen) { // Open the player

								var widthToRemove = 0;

								if (player.opt.showRew) {
									$rewBox.parent("div").show();
									if (isIE)
										$rewBox.show().css({width: 20, display: "block"});
									else
										$rewBox.show().animate({width: 20}, speed / 2);

									widthToRemove += 30;
								}

								if (player.opt.showTime) {
									$timeBox.parent("div").show();
									if (isIE)
										$timeBox.show().css({width: 34, display: "block"});
									else
										$timeBox.animate({width: 34}, speed / 2).show();

									widthToRemove += 45;

								}

								if (player.opt.showVolumeLevel) {
									$volumeLevel.parent("div").show();
									jQuery("a", $volumeLevel).show();

									if (isIE)
										$volumeLevel.show().css({width: 40, display: "block"});
									else
										$volumeLevel.show().animate({width: 40}, speed / 2);

									widthToRemove += 50;

								}

								if (player.opt.showControls) {
									$controls.parent("div").show();

									var w = player.width - ($muteBox.outerWidth() + $playBox.outerWidth() + widthToRemove);

									w = w < 60 ? 60 : w;
									$controls.css({display: "block", height: 20}).animate({width: w}, speed);
								}


							} else { // Close the player

								$controls.animate({width: 1}, speed, function () {
									jQuery(this).parent("div").css({display: "none"})
								});
								if (player.opt.showRew) {
									$rewBox.animate({width: 1}, speed / 2, function () {
										jQuery(this).parent("div").css({display: "none"})
									});
								}
								if (player.opt.showTime) {
									$timeBox.animate({width: 1}, speed / 2, function () {
										jQuery(this).parent("div").css({display: "none"})
									});
								}
								if (player.opt.showVolumeLevel) {
									jQuery("a", $volumeLevel).hide();

									$volumeLevel.animate({width: 1}, speed / 2, function () {
										jQuery(this).parent("div").css({display: "none"})
									});
								}
							}
						}

						if (!player.opt.animate)
							animatePlayer(false);

						$playBox.on(jQuery.mbMiniPlayer.eventEnd, function (e) {

							if (!player.isOpen) {

								if (player.opt.animate)
									animatePlayer();

								player.isOpen = true;

								jQuery.mbMiniPlayer.actualPlayer = $master;

								if (player.opt.playAlone) {
									jQuery("[isPlaying='true']").find(".map_play").trigger(jQuery.mbMiniPlayer.eventEnd);
								}

								jQuery(this).html(jQuery.mbMiniPlayer.icon.pause);

								el.jPlayer("play");
								$controlsBox.attr("isPlaying", "true");

								//add track for Google Analytics
								if (typeof _gaq != "undefined" && player.opt.gaTrack)
									_gaq.push(['_trackEvent', 'Audio', 'Play', player.title + " - " + self.location.href]);

								if (typeof ga != "undefined" && eval(player.opt.gaTrack))
									ga('send', 'event', 'Audio', 'Play', player.title + " - " + self.location.href);

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

							e.stopPropagation();
							return false;

						}).hover(
								function () {
									jQuery(this).css({opacity: .8})
								},
								function () {
									jQuery(this).css({opacity: 1})
								}
						);

						$muteBox.on(jQuery.mbMiniPlayer.eventEnd,
								function () {
									if (jQuery(this).hasClass("mute")) {
										jQuery(this).removeClass("mute");
										jQuery(this).html(jQuery.mbMiniPlayer.icon.volume);
										el.jPlayer("volume", player.opt.vol);
									} else {
										jQuery(this).addClass("mute");
										jQuery(this).html(jQuery.mbMiniPlayer.icon.volumeMute);
										player.opt.vol = player.opt.volume;
										el.jPlayer("volume", 0);

										if (player.opt.onMute == "function")
											player.opt.onMute(player);

									}
								}).hover(
								function () {
									jQuery(this).css({opacity: .8})
								},
								function () {
									jQuery(this).css({opacity: 1})
								}
						);

						$rewBox.on(jQuery.mbMiniPlayer.eventEnd, function () {
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
							jQuery(this).css({opacity: .3, height: "80%", width: Math.floor(35 / bars)});
							var IDX = Math.floor(player.opt.volume / barVol) - 1;
							if (player.opt.volume < .1 && player.opt.volume > 0)
								IDX = 0;

							$volumeLevel.find("a").css({opacity: .1}).removeClass("sel");
							for (var x = 0; x <= IDX; x++) {
								$volumeLevel.find("a").eq(x).css({opacity: .4}).addClass("sel");
							}

							jQuery(this).on(jQuery.mbMiniPlayer.eventEnd, function () {
								var vol = (i + 1) * barVol;
								el.jPlayer("volume", vol);
								if (i == 0) el.jPlayer("volume", .1);
								$muteBox.removeClass("mute");
							});
						});

						// autoplay can't work on devices
						if (!jQuery.isMobile && player.opt.autoplay && ((player.opt.playAlone && jQuery("[isPlaying=true]").length == 0) || !player.opt.playAlone))
							$playBox.trigger(jQuery.mbMiniPlayer.eventEnd);
					},
					supplied           : player.opt.supplied,
					wmode              : "transparent",
					smoothPlayBar      : true,
					volume             : player.opt.volume,
					swfPath            : player.opt.swfPath,
					solution           : 'html, flash',
//					solution           : player.opt.isIE && $.browser.version<11 ? 'flash' : 'html, flash',
//					preload            : jQuery.isMobile ? 'none' : 'metadata',
					preload            : 'none',
					cssSelectorAncestor: "#" + playerID, // Remove the ancestor css selector clause
					cssSelector        : {
						playBar: "#playBar_" + playerID,
						seekBar: "#loadBar_" + playerID
						// The other defaults remain unchanged
					}
				})
						.on(jQuery.jPlayer.event.play, function (e) {})
						.on(jQuery.jPlayer.event.loadedmetadata, function () {})
						.on(jQuery.jPlayer.event.ended, function () {

							if (isAndroidDefault)
								return;

							if (player.opt.onEnd == "function")
								player.opt.onEnd(player);

							if (player.opt.loop)
								$player.jPlayer("play");
							else
								$playBox.trigger(jQuery.mbMiniPlayer.eventEnd);
							if (typeof player.opt.onPause == "function") {
								player.opt.onPause(player);
							}

						})
						.on(jQuery.jPlayer.event.timeupdate, function (e) {
							player.duration = e.jPlayer.status.duration;
							player.currentTime = e.jPlayer.status.currentTime;
							player.seekPercent = e.jPlayer.status.seekPercent;
							$timeBox.html(jQuery.jPlayer.convertTime(e.jPlayer.status.currentTime)).attr("title", jQuery.jPlayer.convertTime(e.jPlayer.status.duration));
						})
						.on(jQuery.jPlayer.event.volumechange, function (event) {
							var bars = player.opt.volumeLevels;
							var barVol = 1 / bars;
							player.opt.volume = event.jPlayer.options.volume;
							var IDX = Math.floor(player.opt.volume / barVol) - 1;
							if (player.opt.volume < .1 && player.opt.volume > 0)
								IDX = 0;
							$volumeLevel.find("a").css({opacity: .1}).removeClass("sel");
							for (var x = 0; x <= IDX; x++) {
								$volumeLevel.find("a").eq(x).css({opacity: .4}).addClass("sel");
							}
						});

				$controlsBox.on("keypress", function (e) {

					if (e.charCode == 32) { //toggle play
						$master.mb_miniPlayer_toggle();
						e.preventDefault();
						e.stopPropagation();
					}

					if (e.charCode == 43) { // volume +
						var bars = player.opt.volumeLevels;
						var barVol = 1 / bars;
						var vol = player.opt.volume + barVol;
						if (vol > 1)
							vol = 1;
						$player.jPlayer("volume", vol);
						$muteBox.removeClass("mute");
						e.preventDefault();
						e.stopPropagation();
					}

					if (e.charCode == 45) { //volume -
						var bars = player.opt.volumeLevels;
						var barVol = 1 / bars;
						var vol = player.opt.volume - barVol;
						if (vol < 0)
							vol = 0;
						$player.jPlayer("volume", vol);
						if (vol <= 0)
							$muteBox.addClass("mute");
						e.preventDefault();
						e.stopPropagation();
					}
				})
			})
		},

		changeFile: function (media, title) {
			var ID = jQuery(this).attr("id");
			var $controlsBox = jQuery("#mp_" + ID);
			var $player = jQuery("#JPL_mp_" + ID);
			var player = $player.get(0);
			var $titleBox = $controlsBox.find(".map_title");

			if (!media.ogg) media.ogg = null;
			if (!media.mp3) media.mp3 = null;
			if (!media.m4a) media.m4a = null;

			jQuery.extend(player.opt, media);

			if (!title) title = "audio file";

			$player.jPlayer("setMedia", media);
			$player.jPlayer("load");

			if ($controlsBox.attr("isPlaying") == "true")
				$player.jPlayer("play");

			$titleBox.html(title);

			jQuery.mbMiniPlayer.getID3(player);

		},

		play: function () {
			return this.each(function () {
				var id = jQuery(this).attr("id");
				var $playerController = jQuery("#mp_" + id);

				if ($playerController.attr("isplaying") === "false")
					$playerController.find(".map_play").trigger(jQuery.mbMiniPlayer.eventEnd);
			})
		},

		stop: function () {
			return this.each(function () {
				var id = jQuery(this).attr("id");
				var $playerController = jQuery("#mp_" + id);
				if ($playerController.attr("isplaying") === "true")
					$playerController.find(".map_play").trigger(jQuery.mbMiniPlayer.eventEnd);

				$playerController.attr("wasPlaying", false)

			})
		},

		toggle: function () {
			return this.each(function () {
				var id = jQuery(this).attr("id");
				var $playerController = jQuery("#mp_" + id);
				$playerController.find(".map_play").trigger(jQuery.mbMiniPlayer.eventEnd);
			})
		},

		destroy: function () {
			return this.each(function () {
				var id = this.attr("id");
				var $player = jQuery("#mp_" + id);
				$player.remove();
			})
		},

		getPlayer: function () {
			var id = this.attr("id");
			return jQuery("#mp_" + id);
		}
	};

	jQuery(document).on("keypress.mbMiniPlayer", function (e) {
		if (e.keyCode == 32) {
			if (jQuery(e.target).is("textarea, input, [contenteditable]") || jQuery(e.target).parents().is("[contenteditable]"))
				return;
			if (jQuery.mbMiniPlayer.actualPlayer) {
				jQuery.mbMiniPlayer.actualPlayer.mb_miniPlayer_toggle();
				e.preventDefault();
			}
		}
	});

	jQuery(window).on("blur", function () {
		var $actualPlayer = jQuery.mbMiniPlayer.actualPlayer || undefined;
		if (!$actualPlayer)
			return;
		var actualPlayer = $actualPlayer.get(0);
		var $player = jQuery(actualPlayer.player);
		var player = $player.get(0);
		if (!player.opt.pauseOnWindowBlur)
			return;
		if ($actualPlayer.mb_miniPlayer_getPlayer().attr("isplaying") == "true") {
			$actualPlayer.mb_miniPlayer_stop();
			$player.attr("wasPlaying", true);
		}
	});

	jQuery(window).on("focus", function () {
		var $actualPlayer = jQuery.mbMiniPlayer.actualPlayer || undefined;
		if (!$actualPlayer)
			return;
		var actualPlayer = $actualPlayer.get(0);
		var $player = jQuery(actualPlayer.player);
		var player = $player.get(0);
		if (!player.opt.pauseOnWindowBlur)
			return;
		if ($player.attr("wasPlaying") == "true")
			$actualPlayer.mb_miniPlayer_play();
		$player.attr("wasPlaying", false);
	});

	jQuery.fn.unselectable = function () {
		return this.each(function () {
			jQuery(this).css({
				"-webkit-user-select": "none",
				"-moz-user-select"   : "none",
				"-ms-user-select"    : "none",
				"-o-user-select"     : "none",
				"user-select"        : "none"
			}).attr("unselectable", "on");
		});
	};

	//Public methods
	jQuery.fn.mb_miniPlayer = jQuery.mbMiniPlayer.buildPlayer;
	jQuery.fn.mb_miniPlayer_changeFile = jQuery.mbMiniPlayer.changeFile;
	jQuery.fn.mb_miniPlayer_play = jQuery.mbMiniPlayer.play;
	jQuery.fn.mb_miniPlayer_stop = jQuery.mbMiniPlayer.stop;
	jQuery.fn.mb_miniPlayer_toggle = jQuery.mbMiniPlayer.toggle;
	jQuery.fn.mb_miniPlayer_destroy = jQuery.mbMiniPlayer.destroy;
	jQuery.fn.mb_miniPlayer_getPlayer = jQuery.mbMiniPlayer.getPlayer;

})(jQuery);
