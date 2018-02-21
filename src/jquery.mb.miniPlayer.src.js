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
		author   : "Matteo Bicocchi",
		"version": "{{ version }}",
		name     : "mb.miniPlayer",
		isMobile : false,

		icon: {
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
			allowMute           : true,
			showControls        : true,
			showVolumeLevel     : true,
			showTime            : true,
			showRew             : true,
			addShadow           : false,
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

			return this.each(function (idx) {

				var master = this;

				if (master.isInit || jQuery(master).is(".map_download"))
					return;

				master.isInit = true;

				var $master = jQuery(master);
				$master.hide();
				$master.addClass("mb_map_master");
				var url = $master.attr("href");

				$master.attr("id", ($master.attr("id") ? $master.attr("id") : new Date().getTime()));

				var playerID = "mp_" + $master.attr("id");
				var title = $master.html();

				var $player = jQuery("<div/>").attr({id: "JPL_" + playerID});
				var player = $player.get(0);
				master.player = player;

				master.player.opt = {};
				jQuery.extend(master.player.opt, jQuery.mbMiniPlayer.defaults, options);
				jQuery.mbMiniPlayer.eventEnd = jQuery.isMobile ? "touchend" : "mouseup";

				master.player.idx = idx + 1;
				master.player.title = title;

				master.player.opt.isIE = jQuery.browser.msie; //&& jQuery.browser.version === 9;

				if (jQuery.metadata) {
					jQuery.metadata.setType("class");
					jQuery.extend(master.player.opt, $master.metadata());
				}

				if (jQuery.isMobile) { //'ontouchstart' in window
					master.player.opt.showVolumeLevel = false;
					master.player.opt.autoplay = false;
					master.player.opt.downloadable = false;
				}

				if (!master.player.opt.mp3 && url.indexOf("mp3") > 0)
					master.player.opt.mp3 = url;
				if (!master.player.opt.m4a && url.indexOf("m4a") > 0)
					master.player.opt.m4a = url;
				if (typeof master.player.opt.mp3 == "undefined")
					master.player.opt.mp3 = null;
				if (typeof master.player.opt.m4a == "undefined")
					master.player.opt.m4a = null;

				var skin = master.player.opt.skin;

				var $controlsBox = jQuery("<div/>").attr({id: playerID, isPlaying: false, tabIndex: master.player.idx}).addClass("mbMiniPlayer").addClass(skin);
				master.player.controlBox = $controlsBox;

				if (master.player.opt.inLine)
					$controlsBox.css({display: "inline-block", verticalAlign: "middle"});
				if (master.player.opt.addShadow)
					$controlsBox.addClass("shadow");

				if (master.player.opt.addGradientOverlay)
					$controlsBox.addClass("gradientOverlay");

				var $layout = jQuery("<div class='playerTable'><div></div><div></div><div></div><div></div><div></div><div></div></div>");

				if (!jQuery("#JPLContainer").length) {
					var JPLContainer = jQuery("<div/>").attr({id: "JPLContainer"});
					jQuery("body").append(JPLContainer);
				}
				jQuery("#JPLContainer").append($player);

				$master.after($controlsBox);
				$controlsBox.html($layout);

				master.player.fileUrl = encodeURI(master.player.opt.mp3 || master.player.opt.m4a || master.player.opt.ogg);
				var fileExtension = master.player.fileUrl.substr((Math.max(0, master.player.fileUrl.lastIndexOf(".")) || Infinity) + 1);

				//if there's a querystring remove it
				if (fileExtension.indexOf("?") >= 0) {
					fileExtension = fileExtension.split("?")[0];
				}

				master.player.fileName = encodeURI(master.player.fileUrl.replace("." + fileExtension, "").split("/").pop());

				master.player.createDownload = function (fileUrl, fileName) {

					fileUrl = fileUrl || master.player.fileUrl;
					fileName = fileName || master.player.fileName;

					var host = location.hostname.split(".");
					host = host.length == 3 ? host[1] : host[0];
					var isSameDomain = (fileUrl.indexOf(host) >= 0) || fileUrl.indexOf("http") < 0;

					var a = document.createElement('a');

					if (!master.player.opt.downloadPage) {
						//if not use downloadPage, download html5Way
						//if can download HTML5 way
						if (typeof a.download != "undefined") { //isSameDomain &&

							master.player.download = jQuery("<a/>")
									.addClass("map_download")
									.attr({href: fileUrl, download: fileName + "." + fileExtension})
									.css({display: "inline-block", cursor: "pointer"})
									.html("d")
									.attr("title", "download: " + fileName)
									.on("mouseover", function () {
										jQuery(this).attr("title", "download: " + fileName);
									});
						}

						//if not open a new page with the audio file
						else

							master.player.download = jQuery("<span/>")
									.addClass("map_download")
									.css({display: "inline-block", cursor: "pointer"})
									.html("d")
									.on(jQuery.mbMiniPlayer.eventEnd, function () {
										window.open(fileUrl, "map_download");
									})
									.attr("title", "open: " + fileName);

					} else {

						// use the PHP page
						master.player.download = jQuery("<span/>")
								.addClass("map_download")
								.css({display: "inline-block", cursor: "pointer"})
								.html("d")
								.on(jQuery.mbMiniPlayer.eventEnd, function (e) {

									e.preventDefault();
									e.stopPropagation();

									var cleanFileUrl = fileUrl.split("?")[0];

									expires = "";
									document.cookie = "mapdownload=true" + expires + "; path=/";
									location.href = master.player.opt.downloadPage + "?filename=" + fileName + "." + fileExtension + "&fileurl=" + cleanFileUrl;
								}).on("mouseover", function () {
									jQuery(this).attr("title", "download: " + fileName);
								}).on("click", function (e) {
									e.preventDefault();
									e.stopPropagation();
								})
								.attr("title", "download: " + fileName);
					}

					master.player.download.on(jQuery.mbMiniPlayer.eventEnd, function () {
						//add track for Google Analytics
						if (typeof _gaq != "undefined" && eval(master.player.opt.gaTrack))
							_gaq.push(['_trackEvent', 'Audio', 'map_Download', fileName + " - " + self.location.href]);

						if (typeof ga != "undefined" && eval(master.player.opt.gaTrack))
							ga('send', 'event', 'Audio', 'map_Download', fileName + " - " + self.location.href);

						if (typeof master.player.opt.onDownload == "function")
							master.player.opt.onDownload(master.player);
					});

					return master.player.download;

				};

				if (master.player.opt.downloadable) {
					$controlsBox.append(master.player.createDownload());
				}

				var $parts = $controlsBox.find("div").not('.playerTable').unselectable();

				var $muteBox = jQuery("<span/>").addClass("map_volume").html(jQuery.mbMiniPlayer.icon.volume);
				var $volumeLevel = jQuery("<span/>").addClass("map_volumeLevel").html("").hide();
				for (var i = 0; i < master.player.opt.volumeLevels; i++) {
					$volumeLevel.append("<a/>")
				}
				var $playBox = jQuery("<span/>").addClass("map_play").html(jQuery.mbMiniPlayer.icon.play);
				var $rewBox = jQuery("<span/>").addClass("map_rew").html(jQuery.mbMiniPlayer.icon.rewind).hide();
				var $timeBox = jQuery("<span/>").addClass("map_time").html("").hide();

				var $controls = jQuery("<div/>").addClass("map_controls");
				var titleText = master.player.title;
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

				master.player.opt.media = {};
				master.player.opt.supplied = [];

				if (master.player.opt.mp3) {
					master.player.opt.media.mp3 = master.player.opt.mp3;
					master.player.opt.supplied.push("mp3");
				}
				if (master.player.opt.m4a) {
					master.player.opt.media.m4a = master.player.opt.m4a;
					master.player.opt.supplied.push("m4a");
				}
				if (master.player.opt.ogg) {
					master.player.opt.media.oga = master.player.opt.ogg;
					master.player.opt.supplied.push("oga");
				}

				master.player.opt.supplied = master.player.opt.supplied.toString();

				//init jPlayer component (Happyworm Ltd - http://www.jplayer.org)

				if (jQuery.browser.android) {
					var opt = {
						supplied           : master.player.opt.supplied,
						wmode              : "transparent",
						smoothPlayBar      : true,
						volume             : master.player.opt.volume,
						swfPath            : master.player.opt.swfPath,
						solution           : 'html, flash',
						preload            : 'none',
						cssSelectorAncestor: "#" + playerID, // Remove the ancestor css selector clause
						cssSelector        : {
							playBar: "#playBar_" + playerID,
							seekBar: "#loadBar_" + playerID
						}
					}

					var androidPlayer = new jPlayerAndroidFix($player.attr("id"), master.player.opt.media, opt);
				}

				$player.jPlayer({

					ready              : function () {
						var el = jQuery(this);

						el.jPlayer("setMedia", master.player.opt.media);

						if (master.player.opt.mp3)
							jQuery.mbMiniPlayer.getID3(master.player);

						if (typeof master.player.opt.onReady == "function") {
							master.player.opt.onReady(master.player, $controlsBox);
						}

						function animatePlayer(anim) {

							master.player.width = master.player.opt.width;
							if (master.player.opt.width.toString().indexOf("%") >= 0) {
								/*
								 var m = $playBox.outerWidth() < 40 ? 40 : $playBox.outerWidth();
								 var margin = player.opt.downloadable ? (m) * 2 : 40;
								 */
								var margin = master.player.opt.downloadable ? 60 : 0;
								var pW = $master.parent().outerWidth() - margin;
								master.player.width = (pW * (parseFloat(master.player.opt.width))) / 100;

							} else if (master.player.opt.width == 0) {
								master.player.opt.showControls = false;
							}

							if (anim == undefined)
								anim = true;

							var speed = anim ? 500 : 0;

							var isIE = jQuery.browser.msie && jQuery.browser.version < 9;

							if (!master.player.isOpen) { // Open the player

								var widthToRemove = 0;

								if (master.player.opt.showRew) {
									$rewBox.parent("div").show();
									if (isIE)
										$rewBox.show().css({width: 20, display: "block"});
									else
										$rewBox.show().animate({width: 20}, speed / 2);

									widthToRemove += 30;
								}

								if (master.player.opt.showTime) {
									$timeBox.parent("div").show();
									if (isIE)
										$timeBox.show().css({width: 34, display: "block"});
									else
										$timeBox.animate({width: 34}, speed / 2).show();

									widthToRemove += 45;

								}

								if (master.player.opt.showVolumeLevel) {
									$volumeLevel.parent("div").show();
									jQuery("a", $volumeLevel).show();

									if (isIE)
										$volumeLevel.show().css({width: 40, display: "block"});
									else
										$volumeLevel.show().animate({width: 40}, speed / 2);

									widthToRemove += 50;

								}

								if (master.player.opt.showControls) {
									$controls.parent("div").show();

									var w = master.player.width - ($muteBox.outerWidth() + $playBox.outerWidth() + widthToRemove);

									w = w < 60 ? 60 : w;
									$controls.css({display: "block", height: 20}).animate({width: w}, speed);
								}


							} else { // Close the player

								$controls.animate({width: 1}, speed, function () {
									jQuery(this).parent("div").css({display: "none"})
								});
								if (master.player.opt.showRew) {
									$rewBox.animate({width: 1}, speed / 2, function () {
										jQuery(this).parent("div").css({display: "none"})
									});
								}
								if (master.player.opt.showTime) {
									$timeBox.animate({width: 1}, speed / 2, function () {
										jQuery(this).parent("div").css({display: "none"})
									});
								}
								if (master.player.opt.showVolumeLevel) {
									jQuery("a", $volumeLevel).hide();

									$volumeLevel.animate({width: 1}, speed / 2, function () {
										jQuery(this).parent("div").css({display: "none"})
									});
								}
							}
						}

						if (!master.player.opt.animate)
							animatePlayer(false);

						$playBox.on(jQuery.mbMiniPlayer.eventEnd, function (e) {

							if (!master.player.isOpen) {

								if (master.player.opt.animate)
									animatePlayer();

								master.player.isOpen = true;

								jQuery.mbMiniPlayer.actualPlayer = $master;

								if (master.player.opt.playAlone) {
									jQuery("[isPlaying='true']").find(".map_play").trigger(jQuery.mbMiniPlayer.eventEnd);
								}

								jQuery(this).html(jQuery.mbMiniPlayer.icon.pause);

								el.jPlayer("play");
								$controlsBox.attr("isPlaying", "true");

								//add track for Google Analytics
								if (typeof _gaq != "undefined" && master.player.opt.gaTrack)
									_gaq.push(['_trackEvent', 'Audio', 'Play', master.player.title + " - " + self.location.href]);

								if (typeof ga != "undefined" && eval(master.player.opt.gaTrack))
									ga('send', 'event', 'Audio', 'Play', master.player.title + " - " + self.location.href);

								if (typeof master.player.opt.onPlay == "function")
									master.player.opt.onPlay(master.player);

							} else {

								if (master.player.opt.animate)
									animatePlayer();

								master.player.isOpen = false;

								jQuery(this).html(jQuery.mbMiniPlayer.icon.play);

								$controlsBox.attr("isPlaying", "false");
								el.jPlayer("pause");
							}

							e.stopPropagation();
							return false;

						});

						if (!jQuery.browser.mobile)
							$playBox.hover(
									function () {
										jQuery(this).css({opacity: .8})
									},
									function () {
										jQuery(this).css({opacity: 1})
									}
							);

						$muteBox.on(jQuery.mbMiniPlayer.eventEnd,
								function () {

									if (jQuery.isMobile || !master.player.opt.allowMute) {
										$playBox.trigger(jQuery.mbMiniPlayer.eventEnd);
										return;
									}

									if (jQuery(this).hasClass("mute")) {
										jQuery(this).removeClass("mute");
										jQuery(this).html(jQuery.mbMiniPlayer.icon.volume);
										el.jPlayer("volume", master.player.opt.vol);
									} else {
										jQuery(this).addClass("mute");
										jQuery(this).html(jQuery.mbMiniPlayer.icon.volumeMute);
										master.player.opt.vol = master.player.opt.volume;
										el.jPlayer("volume", 0);

										if (master.player.opt.onMute == "function")
											master.player.opt.onMute(master.player);

									}
								});

						if (!jQuery.browser.mobile)
							$muteBox.hover(
									function () {
										jQuery(this).css({opacity: .8})
									},
									function () {
										jQuery(this).css({opacity: 1})
									}
							);

						$rewBox.on(jQuery.mbMiniPlayer.eventEnd, function () {
							el.jPlayer("playHead", 0);
						});

						if (!jQuery.browser.mobile)
							$rewBox.hover(
									function () {
										jQuery(this).css({opacity: .8})
									},
									function () {
										jQuery(this).css({opacity: 1})
									}
							);

						var bars = master.player.opt.volumeLevels;
						var barVol = 1 / bars;
						$volumeLevel.find("a").each(function (i) {
							jQuery(this).css({opacity: .3, height: "80%", width: Math.floor(35 / bars)});
							var IDX = Math.floor(master.player.opt.volume / barVol) - 1;
							if (master.player.opt.volume < .1 && master.player.opt.volume > 0)
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
						if (!jQuery.isMobile && master.player.opt.autoplay && ((master.player.opt.playAlone && jQuery("[isPlaying=true]").length == 0) || !master.player.opt.playAlone))
							$playBox.trigger(jQuery.mbMiniPlayer.eventEnd);
					},
					supplied           : master.player.opt.supplied,
					wmode              : "transparent",
					smoothPlayBar      : true,
					volume             : master.player.opt.volume,
					swfPath            : master.player.opt.swfPath,
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

							/*
															if (jQuery.isAndroidDefault)
																return;
							*/

							if (master.player.opt.onEnd == "function")
								master.player.opt.onEnd(master.player);

							if (master.player.opt.loop)
								$player.jPlayer("play");

							else
								$playBox.trigger(jQuery.mbMiniPlayer.eventEnd);
							if (typeof master.player.opt.onPause == "function") {
								master.player.opt.onPause(player);
							}

						})
						.on(jQuery.jPlayer.event.timeupdate, function (e) {
							master.player.duration = e.jPlayer.status.duration;
							master.player.currentTime = e.jPlayer.status.currentTime;
							master.player.seekPercent = e.jPlayer.status.seekPercent;
							$timeBox.html(jQuery.jPlayer.convertTime(e.jPlayer.status.currentTime)).attr("title", jQuery.jPlayer.convertTime(e.jPlayer.status.duration));
						})
						.on(jQuery.jPlayer.event.volumechange, function (event) {
							var bars = master.player.opt.volumeLevels;
							var barVol = 1 / bars;
							master.player.opt.volume = event.jPlayer.options.volume;
							var IDX = Math.floor(master.player.opt.volume / barVol) - 1;
							if (master.player.opt.volume < .1 && master.player.opt.volume > 0)
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
						var bars = master.player.opt.volumeLevels;
						var barVol = 1 / bars;
						var vol = master.player.opt.volume + barVol;
						if (vol > 1)
							vol = 1;
						$player.jPlayer("volume", vol);
						$muteBox.removeClass("mute");
						e.preventDefault();
						e.stopPropagation();
					}

					if (e.charCode == 45) { //volume -
						var bars = master.player.opt.volumeLevels;
						var barVol = 1 / bars;
						var vol = master.player.opt.volume - barVol;
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

			var fileExtension = player.fileUrl.substr((Math.max(0, player.fileUrl.lastIndexOf(".")) || Infinity) + 1);

			player.fileUrl = encodeURI(media.mp3 || media.m4a);
			player.fileName = encodeURI(player.fileUrl.replace("." + fileExtension, "").split("/").pop());

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
		},

		getMaster: function () {
			var id = this.attr("id").replace("mp_", "");
			console.debug(id);

			return jQuery("#" + id);
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
	jQuery.fn.mb_miniPlayer_getMaster = jQuery.mbMiniPlayer.getMaster;

})(jQuery);


var jPlayerAndroidFix = (function ($) {
	var fix = function (id, media, options) {
		this.playFix = false;
		this.init(id, media, options);
	};
	fix.prototype = {
		init        : function (id, media, options) {
			var self = this;

			// Store the params
			this.id = id;
			this.media = media;
			this.options = options;

			// Make a jQuery selector of the id, for use by the jPlayer instance.
			this.player = $(this.id);

			// Make the ready event to set the media to initiate.
			this.player.bind($.jPlayer.event.ready, function (event) {
				// Use this fix's setMedia() method.
				self.setMedia(self.media);
			});

			// Apply Android fixes
			if ($.jPlayer.platform.android) {

				// Fix playing new media immediately after setMedia.
				this.player.bind($.jPlayer.event.progress, function (event) {
					if (self.playFixRequired) {
						self.playFixRequired = false;

						// Enable the contols again
						// self.player.jPlayer('option', 'cssSelectorAncestor', self.cssSelectorAncestor);

						// Play if required, otherwise it will wait for the normal GUI input.
						if (self.playFix) {
							self.playFix = false;
							$(this).jPlayer("play");
						}
					}
				});
				// Fix missing ended events.
				this.player.bind($.jPlayer.event.ended, function (event) {
					if (self.endedFix) {
						self.endedFix = false;
						setTimeout(function () {
							self.setMedia(self.media);
						}, 0);
						// what if it was looping?
					}
				});
				this.player.bind($.jPlayer.event.pause, function (event) {
					if (self.endedFix) {
						var remaining = event.jPlayer.status.duration - event.jPlayer.status.currentTime;
						if (event.jPlayer.status.currentTime === 0 || remaining < 1) {
							// Trigger the ended event from inside jplayer instance.
							setTimeout(function () {
								self.jPlayer._trigger($.jPlayer.event.ended);
							}, 0);
						}
					}
				});
			}

			// Instance jPlayer
			this.player.jPlayer(this.options);

			// Store a local copy of the jPlayer instance's object
			this.jPlayer = this.player.data('jPlayer');

			// Store the real cssSelectorAncestor being used.
			this.cssSelectorAncestor = this.player.jPlayer('option', 'cssSelectorAncestor');

			// Apply Android fixes
			this.resetAndroid();

			return this;
		},
		setMedia    : function (media) {
			this.media = media;

			// Apply Android fixes
			this.resetAndroid();

			// Set the media
			this.player.jPlayer("setMedia", this.media);
			return this;
		},
		play        : function () {
			// Apply Android fixes
			if ($.jPlayer.platform.android && this.playFixRequired) {
				// Apply Android play fix, if it is required.
				this.playFix = true;
			} else {
				// Other browsers play it, as does Android if the fix is no longer required.
				this.player.jPlayer("play");
			}
		},
		resetAndroid: function () {
			// Apply Android fixes
			if ($.jPlayer.platform.android) {
				this.playFix = false;
				this.playFixRequired = true;
				this.endedFix = true;
				// Disable the controls
				// this.player.jPlayer('option', 'cssSelectorAncestor', '#NeverFoundDisabled');
			}
		}
	};
	return fix;
})(jQuery);

