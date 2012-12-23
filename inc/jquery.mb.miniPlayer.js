/*
 * mb.components: jquery.mb.miniPlayer.js
 * Last modified: 22/12/12 19.01
 *
 * Copyright (c) 2001-2012. Matteo Bicocchi (Pupunzi)
 * Open Lab, Florence - Italy
 * ---------------------------------------------------------
 * http://pupunzi.com
 * mbicocchi@open-lab.com
 * ---------------------------------------------------------
 */

/*
 * jQuery.mb.components: jquery.mb.miniPlayer
 * version: 1.6
 *
 * jquery.mb.miniPlayer is a GUI implementation
 * of the jquery.jPlayer plug-in realized by ©Happyworm LTD.
 * http://www.jplayer.org
 * (many thanks to Mark Boas)
 */

(function(jQuery){

  jQuery.mbMiniPlayer={
    author:"Matteo Bicocchi",
    version:"1.6",
    name:"mb.miniPlayer",
    icon:{
      play:"P",
      pause:"p",
      stop:"S",
      rewind:"R",
      volume:"Vm",
      volumeMute:"Vm"
    },
    defaults:{
      width:150,
      skin:"black", // available: black, blue, orange, red, gray
      volume:.5,
      autoplay:false,
      playAlone:true,
      inLine:false,
      volumeLevels:8,
      showVolumeLevel:true,
      showTime:true,
      showRew:true,
      addShadow:true,
      downloadable:false,
      swfPath:"inc/",
      onPlay:function(){},
      onEnd:function(){}
    },

    buildPlayer:function(options){
      this.each(function(idx){
        var $master=jQuery(this);
        $master.hide();
        var url = $master.attr("href");
        var ID= $master.attr("id")?$master.attr("id"):"mb_"+ new Date().getTime();
        var title= $master.html();
        var $player=jQuery("<div/>").attr({id:"JPL_"+ID});
        var player=$player.get(0);
        player.opt={};
        jQuery.extend(player.opt,jQuery.mbMiniPlayer.defaults,options);

        player.opt.isIE9 = jQuery.browser.msie && jQuery.browser.version == 9;

        if (jQuery.metadata){
          jQuery.metadata.setType("class");
          jQuery.extend(player.opt,$master.metadata());
        }

        if (navigator && navigator.platform && navigator.platform.match(/^(iPad|iPod|iPhone)jQuery/)) {
          jQuery.mbMiniPlayer.icon.play="<img src='"+jQuery.mbMiniPlayer.defaults.swfPath+"img/play.png'/>";
          jQuery.mbMiniPlayer.icon.pause="<img src='"+jQuery.mbMiniPlayer.defaults.swfPath+"img/pause.png'/>";
          jQuery.mbMiniPlayer.icon.stop="<img src='"+jQuery.mbMiniPlayer.defaults.swfPath+"img/stop.png'/>";
          jQuery.mbMiniPlayer.icon.rewind="<img src='"+jQuery.mbMiniPlayer.defaults.swfPath+"img/rewind.png'/>";
          jQuery.mbMiniPlayer.icon.volume="<img src='"+jQuery.mbMiniPlayer.defaults.swfPath+"img/volume.png'/>";
          jQuery.mbMiniPlayer.icon.volumeMute="<img src='"+jQuery.mbMiniPlayer.defaults.swfPath+"img/volume.png'/>";
          jQuery.mbMiniPlayer.defaults.showVolumeLevel=false;
        }

        if(!player.opt.mp3)
          player.opt.mp3=url;

        var skin= player.opt.skin;

        var $controlsBox=jQuery("<div/>").attr({id:"mp_"+ID, isPlaying:false}).addClass("mbMiniPlayer").addClass(skin);
        if(player.opt.inLine)
          $controlsBox.css({display:"inline-block", verticalAlign:"middle"});
        if(player.opt.addShadow)
          $controlsBox.addClass("shadow");
        var $layout="<table cellpadding='0' cellspacing='0' border='0'><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr></table>";
        jQuery("body").append($player);
        $master.after($controlsBox);
        $controlsBox.html($layout);

        var download = jQuery("<p/>").addClass("map_download").css({display:"inline-block", cursor:"pointer"}).html("d").on("click",function(){
          window.open(player.opt.mp3,"map_download");
//					location.href = map.downloadUrl+"?filename="+title.asId()+".mp3"+"&fileurl="+player.opt.mp3;
        }).attr("title","download: "+title);
        if(player.opt.downloadable){
          $controlsBox.append(download);
        }
        var cc = jQuery("<div/>").addClass("copy").html("made by Pupunzi");
        $controlsBox.append(cc);
        var $tds= $controlsBox.find("td").unselectable();

        var $volumeBox= jQuery("<span/>").addClass("volume").html(jQuery.mbMiniPlayer.icon.volume);
        var $volumeLevel= jQuery("<span/>").addClass("volumeLevel").html("").hide();
        for (var i=0;i<player.opt.volumeLevels;i++){$volumeLevel.append("<a/>")}
        var $playBox=jQuery("<span/>").addClass("play").html(jQuery.mbMiniPlayer.icon.play);
        var $rewBox=jQuery("<span/>").addClass("rew").html(jQuery.mbMiniPlayer.icon.rewind).hide();
        var $timeBox=jQuery("<span/>").addClass("time").html("").hide();

        var $controls=jQuery("<div/>").addClass("controls");
        var $titleBox=jQuery("<span/>").addClass("title").html(title);
        var $progress=jQuery("<div/>").addClass("jp-progress");

        var $loadBar=jQuery("<div/>").addClass("jp-load-bar").attr("id","loadBar_"+ID);
        var $playBar=jQuery("<div/>").addClass("jp-play-bar").attr("id","playBar_"+ID);
        $progress.append($loadBar);
        $loadBar.append($playBar);
        $controls.append($titleBox).append($progress);

        $tds.eq(0).append($volumeBox);
        $tds.eq(1).append($volumeLevel);
        $tds.eq(2).addClass("controlsBar").append($controls);
        $tds.eq(3).append($timeBox);
        $tds.eq(4).append($rewBox);
        $tds.eq(5).append($playBox);

        if(jQuery.browser.safari){
          $tds.eq(1).hide();
          $tds.eq(3).hide();
          $tds.eq(4).hide();
          $progress.css({top:-4});
        }

        //init jPlayer component (Happyworm Ltd - http://www.jplayer.org)
        $player.jPlayer({
          ready: function () {

            var el=jQuery(this);
            el.jPlayer("setMedia",{mp3: player.opt.mp3, oga: player.opt.ogg});
            $playBox.toggle(
              function(){

                if(player.opt.playAlone){
                  jQuery("[isPlaying=true]").find(".play").click();
                }

                var isIE=jQuery.browser.msie && jQuery.browser.version<9;

                jQuery(this).html(jQuery.mbMiniPlayer.icon.pause);

                $controls.css({display:"block",height:20}).animate({width:player.opt.width},500);
                if(player.opt.showRew) {
                  if(isIE)
                    $rewBox.show().css({width:20,display:"block"});
                  else
                    $rewBox.show().animate({width:20},100);
                  if(jQuery.browser.safari)$rewBox.parent().css({width:20}).show();
                }
                if(player.opt.showTime) {
                  if(isIE)
                    $timeBox.show().css({width:30,display:"block"});
                  else
                    $timeBox.animate({width:30},100).show();
                  if(jQuery.browser.safari)$timeBox.parent().css({width:30}).show();
                }
                if(player.opt.showVolumeLevel) {
                  if(isIE)
                    $volumeLevel.show().css({width:40,display:"block"});
                  else
                    $volumeLevel.show().animate({width:40},100,function(){
                      if(jQuery.browser.safari)
                        $volumeLevel.parent().animate({width:40}).show();
                    });
                }
                $controlsBox.attr("isPlaying","true");
                el.jPlayer("play");

                if(typeof player.opt.onPlay == "function" )
                  player.opt.onPlay(idx);

              },
              function(){
                jQuery(this).html(jQuery.mbMiniPlayer.icon.play);
                $controls.animate({width:1},500,function(){jQuery(this).css({display:"none"})});
                if(player.opt.showRew) {
                  $rewBox.animate({width:1},100,function(){jQuery(this).css({display:"none"})});
                  if(jQuery.browser.safari)$rewBox.parent().hide();
                }
                if(player.opt.showTime) {
                  $timeBox.animate({width:1},100,function(){jQuery(this).css({display:"none"})});
                  if(jQuery.browser.safari)$timeBox.parent().hide();
                }
                if(player.opt.showVolumeLevel) {
                  $volumeLevel.animate({width:1},100,function(){jQuery(this).css({display:"none"})});
                  if(jQuery.browser.safari)$volumeLevel.parent().hide();
                }
                $controlsBox.attr("isPlaying","false");
                el.jPlayer("pause");
              }).hover(
              function(){jQuery(this).css({opacity:.8})},
              function(){jQuery(this).css({opacity:1})}
            );

            $volumeBox.click(
              function(){
                if(jQuery(this).hasClass("mute")){
                  jQuery(this).removeClass("mute");
                  jQuery(this).html(jQuery.mbMiniPlayer.icon.volume);
                  el.jPlayer("volume",player.opt.volume);
                }else{
                  jQuery(this).addClass("mute");
                  jQuery(this).html(jQuery.mbMiniPlayer.icon.volumeMute);
                  el.jPlayer("volume",0);
                }
              }).hover(
              function(){jQuery(this).css({opacity:.8})},
              function(){jQuery(this).css({opacity:1})}
            );

            $rewBox.click(function(){
              el.jPlayer("playHead", 0);
            }).hover(
              function(){jQuery(this).css({opacity:.8})},
              function(){jQuery(this).css({opacity:1})}
            );

            var bars=player.opt.volumeLevels;
            var barVol= 1/bars;
            $volumeLevel.find("a").each(function(i){
              jQuery(this).css({opacity:.3, height:3+2*(i+1), width:Math.floor(35/bars)});

              jQuery(this).click(function(){
                var vol=(i+1)*barVol;
                el.jPlayer("volume",vol);
                if(i==0)el.jPlayer("volume",.1);
                $volumeBox.removeClass("mute");
                player.opt.volume=vol;
              });

            });
            // autoplay can't work on iOs devices


            if (player.opt.autoplay && ((player.opt.playAlone && jQuery("[isPlaying=true]").length==0) || !player.opt.playAlone))
              $playBox.click();
          },
          customCssIds: true,
          volume: player.opt.volume,
          oggSupport: player.opt.ogg? true : false,
          swfPath: player.opt.swfPath,
          // solution: player.opt.isIE9 ? 'flash' : 'html, flash',
          cssSelectorAncestor: "mbAudio", // Remove the ancestor css selector clause
          cssSelector: {
            playBar:"#playBar_"+ID,
            seekBar:"#loadBar_"+ID // Set a custom css selector for the play button
            // The other defaults remain unchanged
          }
        })
          .bind(jQuery.jPlayer.event.play, function(e) {
            //console.debug(e.jPlayer.status.src);
          })
          .bind(jQuery.jPlayer.event.ended, function() {
            if(player.opt.loop)
              $player.jPlayer("play");
            else
              $playBox.click();

            if(typeof player.opt.onEnd == "function" )
              player.opt.onEnd(idx);
          })
          .bind(jQuery.jPlayer.event.timeupdate, function(e) {

            $loadBar.css({width:((player.opt.width-5)*e.jPlayer.status.seekPercent)/100});
            $playBar.css({width:((player.opt.width-5)*e.jPlayer.status.currentTime)/e.jPlayer.status.duration});

            var volume=player.opt.volume;

            var barVol= 1/$volumeLevel.find("a").length;
            var IDX=Math.floor(volume/barVol)-1;
            if (volume<.1 && volume>0)
              IDX=0;

            $volumeLevel.find("a").css({opacity:.2}).removeClass("sel");
            for (var i=0;i<=IDX;i++){
              $volumeLevel.find("a").eq(i).css({opacity:.8}).addClass("sel");
            }

            $timeBox.html(jQuery.jPlayer.convertTime(e.jPlayer.status.currentTime)).attr("title",jQuery.jPlayer.convertTime(e.jPlayer.status.duration));
          })
      })
    },
    changeFile:function(mp3,ogg,title){
      var ID= jQuery(this).attr("id");
      var $controlsBox=jQuery("#mp_"+ID);
      var $player=jQuery("#JPL_"+ID);
      var $titleBox=$controlsBox.find(".title");
      if(!ogg) ogg="";
      if(!title) title="audio file";
      $player.jPlayer("setMedia", {mp3: mp3, oga: ogg});
      if ($controlsBox.attr("isPlaying")=="true")
        $player.jPlayer("play");
      $titleBox.html(title)
    },
    play:function(){
      return this.each(function(){
        var id=jQuery(this).attr("id");
        var player=jQuery("#mp_"+id);
        if (player.attr("isplaying")=="false")
          player.find(".play").click();
      })
    },
    stop:function(){
      return this.each(function(){
        var id=jQuery(this).attr("id");
        var player=jQuery("#mp_"+id);
        if (player.attr("isplaying")=="true")
          player.find(".play").click();
      })
    },
    destroy:function(){
      return this.each(function(){
        var id=this.attr("id");
        var player=jQuery("#mp_"+id);
        player.remove();
      })
    },
    getPlayer:function(){
      var id=this.attr("id");
      return jQuery("#mp_"+id);
    }
  };

  jQuery.fn.unselectable=function(){
    this.each(function(){
      jQuery(this).css({
        "-moz-user-select": "none",
        "-khtml-user-select": "none",
        "user-select": "none"
      }).attr("unselectable","on");
    });
    return jQuery(this);
  };
  //Public method
  jQuery.fn.mb_miniPlayer= jQuery.mbMiniPlayer.buildPlayer;
  jQuery.fn.mb_miniPlayer_changeFile= jQuery.mbMiniPlayer.changeFile;
  jQuery.fn.mb_miniPlayer_play= jQuery.mbMiniPlayer.play;
  jQuery.fn.mb_miniPlayer_stop= jQuery.mbMiniPlayer.stop;
  jQuery.fn.mb_miniPlayer_destroy= jQuery.mbMiniPlayer.destroy;
  jQuery.fn.mb_miniPlayer_getPlayer= jQuery.mbMiniPlayer.getPlayer;

  String.prototype.asId = function () {
    return this.replace(/[^a-zA-Z0-9_]+/g, '');
  };

})(jQuery);