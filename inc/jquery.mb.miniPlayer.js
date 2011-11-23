/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2011. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: mbicocchi@open-lab.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/

/*
 * jQuery.mb.components: jquery.mb.miniPlayer
 * version: 1.5
 * © 2001 - 2011 Matteo Bicocchi (pupunzi), Open Lab
 *
 *
 * jquery.mb.miniPlayer is a GUI implementation
 * of the jquery.jPlayer plug-in realized by ©Happyworm LTD.
 * http://www.jplayer.org
 * (many thanks to Mark Boas)
 */

(function($){

    $.mbMiniPlayer={
        author:"Matteo Bicocchi",
        version:"1.5",
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
            autoPlay:false,
            playAlone:true,
            inLine:false,
            volumeLevels:8,
            showVolumeLevel:true,
            showTime:true,
            showRew:true,
            addShadow:true,

            swfPath:"inc/",
            onPlay:function(){},
            onEnd:function(){}
        },

        buildPlayer:function(options){
            this.each(function(idx){
                var $master=$(this);
                $master.hide();
                var url = $master.attr("href");
                var ID= $master.attr("id")?$master.attr("id"):"mb_"+ new Date().getTime();
                var title= $master.html();
                var $player=$("<div/>").attr({id:"JPL_"+ID});
                var player=$player.get(0);
                player.opt={};
                $.extend(player.opt,$.mbMiniPlayer.defaults,options);

                if ($.metadata){
                    $.extend(player.opt,$master.metadata());
                }

                if (navigator && navigator.platform && navigator.platform.match(/^(iPad|iPod|iPhone)$/)) {
                    $.mbMiniPlayer.icon.play="<img src='"+$.mbMiniPlayer.defaults.swfPath+"img/play.png'/>";
                    $.mbMiniPlayer.icon.pause="<img src='"+$.mbMiniPlayer.defaults.swfPath+"img/pause.png'/>";
                    $.mbMiniPlayer.icon.stop="<img src='"+$.mbMiniPlayer.defaults.swfPath+"img/stop.png'/>";
                    $.mbMiniPlayer.icon.rewind="<img src='"+$.mbMiniPlayer.defaults.swfPath+"img/rewind.png'/>";
                    $.mbMiniPlayer.icon.volume="<img src='"+$.mbMiniPlayer.defaults.swfPath+"img/volume.png'/>";
                    $.mbMiniPlayer.icon.volumeMute="<img src='"+$.mbMiniPlayer.defaults.swfPath+"img/volume.png'/>";
                    $.mbMiniPlayer.defaults.showVolumeLevel=false;
                }

                if(!player.opt.mp3)
                    player.opt.mp3=url;

                var skin= player.opt.skin;

                var $controlsBox=$("<div/>").attr({id:"mp_"+ID, isPlaying:false}).addClass("mbMiniPlayer").addClass(skin);
                if(player.opt.inLine)
                    $controlsBox.css({display:"inline-block", verticalAlign:"middle"});
                if(player.opt.addShadow)
                    $controlsBox.addClass("shadow");
                var $layout="<table cellpadding='0' cellspacing='0' border='0'><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr></table>";
                $("body").append($player);
                $master.after($controlsBox);
                $controlsBox.html($layout);
                var $tds= $controlsBox.find("td").unselectable();

                var $volumeBox= $("<span/>").addClass("volume").html($.mbMiniPlayer.icon.volume);
                var $volumeLevel= $("<span/>").addClass("volumeLevel").html("").hide();
                for (var i=0;i<player.opt.volumeLevels;i++){$volumeLevel.append("<a/>")}
                var $playBox=$("<span/>").addClass("play").html($.mbMiniPlayer.icon.play);
                var $rewBox=$("<span/>").addClass("rew").html($.mbMiniPlayer.icon.rewind).hide();
                var $timeBox=$("<span/>").addClass("time").html("").hide();

                var $controls=$("<div/>").addClass("controls");
                var $titleBox=$("<span/>").addClass("title").html(title);
                var $progress=$("<div/>").addClass("jp-progress");

                var $loadBar=$("<div/>").addClass("jp-load-bar").attr("id","loadBar_"+ID);
                var $playBar=$("<div/>").addClass("jp-play-bar").attr("id","playBar_"+ID);
                $progress.append($loadBar);
                $loadBar.append($playBar);
                $controls.append($titleBox).append($progress);

                $tds.eq(0).append($volumeBox);
                $tds.eq(1).append($volumeLevel);
                $tds.eq(2).addClass("controlsBar").append($controls);
                $tds.eq(3).append($timeBox);
                $tds.eq(4).append($rewBox);
                $tds.eq(5).append($playBox);

                if($.browser.safari){
                    $tds.eq(1).hide();
                    $tds.eq(3).hide();
                    $tds.eq(4).hide();
                    $progress.css({top:-4});
                }

                //init jPlayer component (Happyworm Ltd - http://www.happyworm.com/jquery/jplayer/)
                $player.jPlayer({
                    ready: function () {

                        var el=$(this);

                        el.jPlayer("setMedia",{mp3: player.opt.mp3, oga: player.opt.ogg});

                        $playBox.toggle(
                            function(){

                                if(player.opt.playAlone){
                                    $("[isPlaying=true]").find(".play").click();
                                }

                                var isIE=$.browser.msie && $.browser.version<9;

                                $(this).html($.mbMiniPlayer.icon.pause);

                                $controls.css({display:"block",height:20}).animate({width:player.opt.width},500);
                                if(player.opt.showRew) {
                                    if(isIE)
                                        $rewBox.show().css({width:20,display:"block"});
                                    else
                                        $rewBox.show().animate({width:20},100);
                                    if($.browser.safari)$rewBox.parent().css({width:20}).show();
                                }
                                if(player.opt.showTime) {
                                    if(isIE)
                                        $timeBox.show().css({width:30,display:"block"});
                                    else
                                        $timeBox.animate({width:30},100).show();
                                    if($.browser.safari)$timeBox.parent().css({width:30}).show();
                                }
                                if(player.opt.showVolumeLevel) {
                                    if(isIE)
                                        $volumeLevel.show().css({width:40,display:"block"});
                                    else
                                        $volumeLevel.show().animate({width:40},100,function(){
                                            if($.browser.safari)
                                                $volumeLevel.parent().animate({width:40}).show();
                                        });
                                }
                                $controlsBox.attr("isPlaying","true");
                                el.jPlayer("play");

                                if(typeof player.opt.onPlay == "function" )
                                    player.opt.onPlay(idx);

                            },
                            function(){
                                $(this).html($.mbMiniPlayer.icon.play);
                                $controls.animate({width:1},500,function(){$(this).css({display:"none"})});
                                if(player.opt.showRew) {
                                    $rewBox.animate({width:1},100,function(){$(this).css({display:"none"})});
                                    if($.browser.safari)$rewBox.parent().hide();
                                }
                                if(player.opt.showTime) {
                                    $timeBox.animate({width:1},100,function(){$(this).css({display:"none"})});
                                    if($.browser.safari)$timeBox.parent().hide();
                                }
                                if(player.opt.showVolumeLevel) {
                                    $volumeLevel.animate({width:1},100,function(){$(this).css({display:"none"})});
                                    if($.browser.safari)$volumeLevel.parent().hide();
                                }
                                $controlsBox.attr("isPlaying","false");
                                el.jPlayer("pause");
                            }).hover(
                            function(){$(this).css({opacity:.8})},
                            function(){$(this).css({opacity:1})}
                        );

                        $volumeBox.click(
                            function(){
                                if($(this).hasClass("mute")){
                                    $(this).removeClass("mute");
                                    $(this).html($.mbMiniPlayer.icon.volume);
                                    el.jPlayer("volume",player.opt.volume);
                                }else{
                                    $(this).addClass("mute");
                                    $(this).html($.mbMiniPlayer.icon.volumeMute);
                                    el.jPlayer("volume",0);
                                }
                            }).hover(
                            function(){$(this).css({opacity:.8})},
                            function(){$(this).css({opacity:1})}
                        );

                        $rewBox.click(function(){
                            el.jPlayer("playHead", 0);
                        }).hover(
                            function(){$(this).css({opacity:.8})},
                            function(){$(this).css({opacity:1})}
                        );

                        var bars=player.opt.volumeLevels;
                        var barVol= 1/bars;
                        $volumeLevel.find("a").each(function(i){
                            $(this).css({opacity:.3, height:3+2*(i+1), width:Math.floor(35/bars)});

                            $(this).click(function(){
                                var vol=(i+1)*barVol;
                                el.jPlayer("volume",vol);
                                if(i==0)el.jPlayer("volume",.1);
                                $volumeBox.removeClass("mute");
                                player.opt.volume=vol;
                            });

                        });
                        // autoPlay can't work on iOs devices
                        if (player.opt.autoPlay && ((player.opt.playAlone && $("[isPlaying=true]").length==0) || !player.opt.playAlone))
                            $playBox.click();
                    },
                    customCssIds: true,
                    volume: player.opt.volume,
                    oggSupport: player.opt.ogg?true:false,
                    swfPath: player.opt.swfPath,
                    cssSelectorAncestor: "", // Remove the ancestor css selector clause
                    cssSelector: {
                        playBar:"#playBar_"+ID, // Set a custom css selector for the play button
                        seekBar:"#loadBar_"+ID // Set a custom css selector for the play button
                        // The other defaults remain unchanged
                    }
                })
                    .bind($.jPlayer.event.ended, function() {
                        if(player.opt.loop)
                            $player.jPlayer("play");
                        else
                            $playBox.click();

                        if(typeof player.opt.onEnd == "function" )
                            player.opt.onEnd(idx);
                    })
                    .bind($.jPlayer.event.timeupdate, function(e) {

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

                        $timeBox.html($.jPlayer.convertTime(e.jPlayer.status.currentTime)).attr("title",$.jPlayer.convertTime(e.jPlayer.status.duration));
                    })
            })
        },
        changeFile:function(mp3,ogg,title){
            var ID= $(this).attr("id");
            var $controlsBox=$("#mp_"+ID);
            var $player=$("#JPL_"+ID);
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
                var id=$(this).attr("id");
                var player=$("#mp_"+id);
                if (player.attr("isplaying")=="false")
                    player.find(".play").click();
            })
        },
        stop:function(){
            return this.each(function(){
                var id=$(this).attr("id");
                var player=$("#mp_"+id);
                if (player.attr("isplaying")=="true")
                    player.find(".play").click();
            })
        },
        destroy:function(){
            return this.each(function(){
                var id=this.attr("id");
                var player=$("#mp_"+id);
                player.remove();
            })
        }
    };

    $.fn.unselectable=function(){
        this.each(function(){
            $(this).css({
                "-moz-user-select": "none",
                "-khtml-user-select": "none",
                "user-select": "none"
            }).attr("unselectable","on");
        });
        return $(this);
    };
    //Public method
    $.fn.mb_miniPlayer= $.mbMiniPlayer.buildPlayer;
    $.fn.mb_miniPlayer_changeFile= $.mbMiniPlayer.changeFile;
    $.fn.mb_miniPlayer_play= $.mbMiniPlayer.play;
    $.fn.mb_miniPlayer_stop= $.mbMiniPlayer.stop;
    $.fn.mb_miniPlayer_destroy= $.mbMiniPlayer.destroy;


})(jQuery);