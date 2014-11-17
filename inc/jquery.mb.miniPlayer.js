/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: jquery.mb.miniPlayer.new.js                                                                                                                _
 _ last modified: 02/11/14 18.11                                                                                                                    _
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

	/*Browser detection patch*/
	var nAgt=navigator.userAgent; if(!jQuery.browser){jQuery.browser={};jQuery.browser.mozilla=!1;jQuery.browser.webkit=!1;jQuery.browser.opera=!1;jQuery.browser.safari=!1;jQuery.browser.chrome=!1;jQuery.browser.msie=!1;jQuery.browser.ua=nAgt;jQuery.browser.name=navigator.appName;jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion);jQuery.browser.majorVersion=parseInt(navigator.appVersion,10);var nameOffset,verOffset,ix;if(-1!=(verOffset=nAgt.indexOf("Opera")))jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion= nAgt.substring(verOffset+6),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8));else if(-1!=(verOffset=nAgt.indexOf("OPR")))jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=nAgt.substring(verOffset+4);else if(-1!=(verOffset=nAgt.indexOf("MSIE")))jQuery.browser.msie=!0,jQuery.browser.name="Microsoft Internet Explorer",jQuery.browser.fullVersion=nAgt.substring(verOffset+5);else if(-1!=nAgt.indexOf("Trident")){jQuery.browser.msie= !0;jQuery.browser.name="Microsoft Internet Explorer";var start=nAgt.indexOf("rv:")+3,end=start+4;jQuery.browser.fullVersion=nAgt.substring(start,end)}else-1!=(verOffset=nAgt.indexOf("Chrome"))?(jQuery.browser.webkit=!0,jQuery.browser.chrome=!0,jQuery.browser.name="Chrome",jQuery.browser.fullVersion=nAgt.substring(verOffset+7)):-1!=(verOffset=nAgt.indexOf("Safari"))?(jQuery.browser.webkit=!0,jQuery.browser.safari=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=nAgt.substring(verOffset+7), -1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8))):-1!=(verOffset=nAgt.indexOf("AppleWebkit"))?(jQuery.browser.webkit=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=nAgt.substring(verOffset+7),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8))):-1!=(verOffset=nAgt.indexOf("Firefox"))?(jQuery.browser.mozilla=!0,jQuery.browser.name="Firefox",jQuery.browser.fullVersion=nAgt.substring(verOffset+ 8)):(nameOffset=nAgt.lastIndexOf(" ")+1)<(verOffset=nAgt.lastIndexOf("/"))&&(jQuery.browser.name=nAgt.substring(nameOffset,verOffset),jQuery.browser.fullVersion=nAgt.substring(verOffset+1),jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()&&(jQuery.browser.name=navigator.appName));-1!=(ix=jQuery.browser.fullVersion.indexOf(";"))&&(jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix));-1!=(ix=jQuery.browser.fullVersion.indexOf(" "))&&(jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0, ix));jQuery.browser.majorVersion=parseInt(""+jQuery.browser.fullVersion,10);isNaN(jQuery.browser.majorVersion)&&(jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion),jQuery.browser.majorVersion=parseInt(navigator.appVersion,10));jQuery.browser.version=jQuery.browser.majorVersion}jQuery.browser.android=/Android/i.test(nAgt);jQuery.browser.blackberry=/BlackBerry|BB|PlayBook/i.test(nAgt);jQuery.browser.ios=/iPhone|iPad|iPod|webOS/i.test(nAgt);jQuery.browser.operaMobile=/Opera Mini/i.test(nAgt); jQuery.browser.windowsMobile=/IEMobile|Windows Phone/i.test(nAgt);jQuery.browser.kindle=/Kindle|Silk/i.test(nAgt);jQuery.browser.mobile=jQuery.browser.android||jQuery.browser.blackberry||jQuery.browser.ios||jQuery.browser.windowsMobile||jQuery.browser.operaMobile||jQuery.browser.kindle;

	jQuery.isMobile = jQuery.browser.mobile;

	var isAndroidDefault = jQuery.browser.android && !(/chrome/i).test(nAgt);


	/*******************************************************************************
	 * jQuery.mb.components: jquery.mb.CSSAnimate
	 ******************************************************************************/

	jQuery.fn.CSSAnimate=function(a,b,c,d,e){function f(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}function g(a,b){return"string"!=typeof a||a.match(/^[\-0-9\.]+$/)?""+a+b:a}return jQuery.support.transition=function(){var a=document.body||document.documentElement,b=a.style;return void 0!==b.transition||void 0!==b.WebkitTransition||void 0!==b.MozTransition||void 0!==b.MsTransition||void 0!==b.OTransition}(),this.each(function(){var h=this,i=jQuery(this);h.id=h.id||"CSSA_"+(new Date).getTime();var j=j||{type:"noEvent"};if(h.CSSAIsRunning&&h.eventType==j.type)return h.CSSqueue=function(){i.CSSAnimate(a,b,c,d,e)},void 0;if(h.CSSqueue=null,h.eventType=j.type,0!==i.length&&a){if(h.CSSAIsRunning=!0,"function"==typeof b&&(e=b,b=jQuery.fx.speeds._default),"function"==typeof c&&(e=c,c=0),"function"==typeof d&&(e=d,d="cubic-bezier(0.65,0.03,0.36,0.72)"),"string"==typeof b)for(var k in jQuery.fx.speeds){if(b==k){b=jQuery.fx.speeds[k];break}b=jQuery.fx.speeds._default}if(b||(b=jQuery.fx.speeds._default),!jQuery.support.transition){for(var l in a)"transform"===l&&delete a[l],"filter"===l&&delete a[l],"transform-origin"===l&&delete a[l],"auto"===a[l]&&delete a[l];return e&&"string"!=typeof e||(e="linear"),i.animate(a,b,e),void 0}var m={"default":"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};m[d]&&(d=m[d]);var n="",o="transitionEnd";jQuery.browser.webkit?(n="-webkit-",o="webkitTransitionEnd"):jQuery.browser.mozilla?(n="-moz-",o="transitionend"):jQuery.browser.opera?(n="-o-",o="otransitionend"):jQuery.browser.msie&&(n="-ms-",o="msTransitionEnd");var p=[];for(var l in a){var q=l;"transform"===q&&(q=n+"transform",a[q]=a[l],delete a[l]),"filter"===q&&(q=n+"filter",a[q]=a[l],delete a[l]),("transform-origin"===q||"origin"===q)&&(q=n+"transform-origin",a[q]=a[l],delete a[l]),"x"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" translateX("+g(a[l],"px")+")",delete a[l]),"y"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" translateY("+g(a[l],"px")+")",delete a[l]),"z"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" translateZ("+g(a[l],"px")+")",delete a[l]),"rotate"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" rotate("+g(a[l],"deg")+")",delete a[l]),"rotateX"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" rotateX("+g(a[l],"deg")+")",delete a[l]),"rotateY"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" rotateY("+g(a[l],"deg")+")",delete a[l]),"rotateZ"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" rotateZ("+g(a[l],"deg")+")",delete a[l]),"scale"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" scale("+g(a[l],"")+")",delete a[l]),"scaleX"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" scaleX("+g(a[l],"")+")",delete a[l]),"scaleY"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" scaleY("+g(a[l],"")+")",delete a[l]),"scaleZ"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" scaleZ("+g(a[l],"")+")",delete a[l]),"skew"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" skew("+g(a[l],"deg")+")",delete a[l]),"skewX"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" skewX("+g(a[l],"deg")+")",delete a[l]),"skewY"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" skewY("+g(a[l],"deg")+")",delete a[l]),"perspective"===q&&(q=n+"transform",a[q]=a[q]||"",a[q]+=" perspective("+g(a[l],"px")+")",delete a[l]),p.indexOf(q)<0&&p.push(f(q))}var r=p.join(","),s=function(){i.off(o+"."+h.id),clearTimeout(h.timeout),i.css(n+"transition",""),"function"==typeof e&&e(i),h.called=!0,h.CSSAIsRunning=!1,"function"==typeof h.CSSqueue&&(h.CSSqueue(),h.CSSqueue=null)},t={};jQuery.extend(t,a),t[n+"transition-property"]=r,t[n+"transition-duration"]=b+"ms",t[n+"transition-delay"]=c+"ms",t[n+"transition-style"]="preserve-3d",t[n+"transition-timing-function"]=d,setTimeout(function(){i.one(o+"."+h.id,s),i.css(t)},1),h.timeout=setTimeout(function(){return i.called||!e?(i.called=!1,h.CSSAIsRunning=!1,void 0):(i.css(n+"transition",""),e(i),h.CSSAIsRunning=!1,"function"==typeof h.CSSqueue&&(h.CSSqueue(),h.CSSqueue=null),void 0)},b+c+100)}})},jQuery.fn.css3=function(a){return this.each(function(){jQuery(this).CSSAnimate(a,1,0,null)})};
	/*
	 * Metadata - jQuery plugin for parsing metadata from elements
	 * Copyright (c) 2006 John Resig, Yehuda Katz, Jörn Zaefferer, Paul McLanahan
	 * Dual licensed under the MIT and GPL licenses:
	 *   http://www.opensource.org/licenses/mit-license.php
	 *   http://www.gnu.org/licenses/gpl.html
	 */

	(function(c){c.extend({metadata:{defaults:{type:"class",name:"metadata",cre:/({.*})/,single:"metadata"},setType:function(b,c){this.defaults.type=b;this.defaults.name=c},get:function(b,f){var d=c.extend({},this.defaults,f);d.single.length||(d.single="metadata");var a=c.data(b,d.single);if(a)return a;a="{}";if("class"==d.type){var e=d.cre.exec(b.className);e&&(a=e[1])}else if("elem"==d.type){if(!b.getElementsByTagName)return;e=b.getElementsByTagName(d.name);e.length&&(a=c.trim(e[0].innerHTML))}else void 0!= b.getAttribute&&(e=b.getAttribute(d.name))&&(a=e);0>a.indexOf("{")&&(a="{"+a+"}");a=eval("("+a+")");c.data(b,d.single,a);return a}}});c.fn.metadata=function(b){return c.metadata.get(this[0],b)}})(jQuery);

//ID3

	function y(h,g,b){var c=g||0,d=0;"string"==typeof h?(d=b||h.length,this.a=function(a){return h.charCodeAt(a+c)&255}):"unknown"==typeof h&&(d=b||IEBinary_getLength(h),this.a=function(a){return IEBinary_getByteAt(h,a+c)});this.l=function(a,f){for(var v=Array(f),b=0;b<f;b++)v[b]=this.a(a+b);return v};this.h=function(){return d};this.d=function(a,f){return 0!=(this.a(a)&1<<f)};this.w=function(a){a=(this.a(a+1)<<8)+this.a(a);0>a&&(a+=65536);return a};this.i=function(a){var f=this.a(a),b=this.a(a+1),d=
			this.a(a+2);a=this.a(a+3);f=(((f<<8)+b<<8)+d<<8)+a;0>f&&(f+=4294967296);return f};this.o=function(a){var f=this.a(a),b=this.a(a+1);a=this.a(a+2);f=((f<<8)+b<<8)+a;0>f&&(f+=16777216);return f};this.c=function(a,f){for(var b=[],d=a,e=0;d<a+f;d++,e++)b[e]=String.fromCharCode(this.a(d));return b.join("")};this.e=function(a,b,d){a=this.l(a,b);switch(d.toLowerCase()){case "utf-16":case "utf-16le":case "utf-16be":b=d;var l,e=0,c=1;d=0;l=Math.min(l||a.length,a.length);254==a[0]&&255==a[1]?(b=!0,e=2):255==
			a[0]&&254==a[1]&&(b=!1,e=2);b&&(c=0,d=1);b=[];for(var m=0;e<l;m++){var g=a[e+c],k=(g<<8)+a[e+d],e=e+2;if(0==k)break;else 216>g||224<=g?b[m]=String.fromCharCode(k):(g=(a[e+c]<<8)+a[e+d],e+=2,b[m]=String.fromCharCode(k,g))}a=new String(b.join(""));a.g=e;break;case "utf-8":l=0;e=Math.min(e||a.length,a.length);239==a[0]&&187==a[1]&&191==a[2]&&(l=3);c=[];for(d=0;l<e&&(b=a[l++],0!=b);d++)128>b?c[d]=String.fromCharCode(b):194<=b&&224>b?(m=a[l++],c[d]=String.fromCharCode(((b&31)<<6)+(m&63))):224<=b&&240>
			b?(m=a[l++],k=a[l++],c[d]=String.fromCharCode(((b&255)<<12)+((m&63)<<6)+(k&63))):240<=b&&245>b&&(m=a[l++],k=a[l++],g=a[l++],b=((b&7)<<18)+((m&63)<<12)+((k&63)<<6)+(g&63)-65536,c[d]=String.fromCharCode((b>>10)+55296,(b&1023)+56320));a=new String(c.join(""));a.g=l;break;default:e=[];c=c||a.length;for(l=0;l<c;){d=a[l++];if(0==d)break;e[l-1]=String.fromCharCode(d)}a=new String(e.join(""));a.g=l}return a};this.f=function(a,b){b()}}var B=document.createElement("script");B.type="text/vbscript";
	B.textContent="Function IEBinary_getByteAt(strBinary, iOffset)\r\n\tIEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\nEnd Function\r\nFunction IEBinary_getLength(strBinary)\r\n\tIEBinary_getLength = LenB(strBinary)\r\nEnd Function\r\n";document.getElementsByTagName("head")[0].appendChild(B);function C(h,g,b){function c(a,b,e,c,f,g){var k=d();k?("undefined"===typeof g&&(g=!0),b&&("undefined"!=typeof k.onload?(k.onload=function(){"200"==k.status||"206"==k.status?(k.fileSize=f||k.getResponseHeader("Content-Length"),b(k)):e&&e({error:"xhr",xhr:k});k=null},e&&(k.onerror=function(){e({error:"xhr",xhr:k});k=null})):k.onreadystatechange=function(){4==k.readyState&&("200"==k.status||"206"==k.status?(k.fileSize=f||k.getResponseHeader("Content-Length"),b(k)):e&&e({error:"xhr",xhr:k}),k=null)}),
			k.open("GET",a,g),k.overrideMimeType&&k.overrideMimeType("text/plain; charset=x-user-defined"),c&&k.setRequestHeader("Range","bytes="+c[0]+"-"+c[1]),k.setRequestHeader("If-Modified-Since","Sat, 1 Jan 1970 00:00:00 GMT"),k.send(null)):e&&e({error:"Unable to create XHR object"})}function d(){var a=null;window.XMLHttpRequest?a=new XMLHttpRequest:window.ActiveXObject&&(a=new ActiveXObject("Microsoft.XMLHTTP"));return a}function a(a,b,e){var c=d();c?(b&&("undefined"!=typeof c.onload?(c.onload=function(){"200"==
	c.status||"206"==c.status?b(this):e&&e({error:"xhr",xhr:c});c=null},e&&(c.onerror=function(){e({error:"xhr",xhr:c});c=null})):c.onreadystatechange=function(){4==c.readyState&&("200"==c.status||"206"==c.status?b(this):e&&e({error:"xhr",xhr:c}),c=null)}),c.open("HEAD",a,!0),c.send(null)):e&&e({error:"Unable to create XHR object"})}function f(a,d){var e,f;function g(a){var b=~~(a[0]/e)-f;a=~~(a[1]/e)+1+f;0>b&&(b=0);a>=blockTotal&&(a=blockTotal-1);return[b,a]}function h(f,g){for(;n[f[0]];)if(f[0]++,f[0]>
			f[1]){g&&g();return}for(;n[f[1]];)if(f[1]--,f[0]>f[1]){g&&g();return}var m=[f[0]*e,(f[1]+1)*e-1];c(a,function(a){parseInt(a.getResponseHeader("Content-Length"),10)==d&&(f[0]=0,f[1]=blockTotal-1,m[0]=0,m[1]=d-1);a={data:a.N||a.responseText,offset:m[0]};for(var b=f[0];b<=f[1];b++)n[b]=a;g&&g()},b,m,k,!!g)}var k,r=new y("",0,d),n=[];e=e||2048;f="undefined"===typeof f?0:f;blockTotal=~~((d-1)/e)+1;for(var q in r)r.hasOwnProperty(q)&&"function"===typeof r[q]&&(this[q]=r[q]);this.a=function(a){var b;h(g([a,
		a]));b=n[~~(a/e)];if("string"==typeof b.data)return b.data.charCodeAt(a-b.offset)&255;if("unknown"==typeof b.data)return IEBinary_getByteAt(b.data,a-b.offset)};this.f=function(a,b){h(g(a),b)}}(function(){a(h,function(a){a=parseInt(a.getResponseHeader("Content-Length"),10)||-1;g(new f(h,a))},b)})()};(function(h){h.FileAPIReader=function(g,b){return function(c,d){var a=b||new FileReader;a.onload=function(a){d(new y(a.target.result))};a.readAsBinaryString(g)}}})(this);(function(h){var g=h.p={},b={},c=[0,7];g.t=function(d){delete b[d]};g.s=function(){b={}};g.B=function(d,a,f){f=f||{};(f.dataReader||C)(d,function(g){g.f(c,function(){var c="ftypM4A"==g.c(4,7)?ID4:"ID3"==g.c(0,3)?ID3v2:ID3v1;c.m(g,function(){var e=f.tags,h=c.n(g,e),e=b[d]||{},m;for(m in h)h.hasOwnProperty(m)&&(e[m]=h[m]);b[d]=e;a&&a()})})},f.onError)};g.v=function(d){if(!b[d])return null;var a={},c;for(c in b[d])b[d].hasOwnProperty(c)&&(a[c]=b[d][c]);return a};g.A=function(d,a){return b[d]?b[d][a]:
			null};h.ID3=h.p;g.loadTags=g.B;g.getAllTags=g.v;g.getTag=g.A;g.clearTags=g.t;g.clearAll=g.s})(this);(function(h){var g=h.q={},b="Blues;Classic Rock;Country;Dance;Disco;Funk;Grunge;Hip-Hop;Jazz;Metal;New Age;Oldies;Other;Pop;R&B;Rap;Reggae;Rock;Techno;Industrial;Alternative;Ska;Death Metal;Pranks;Soundtrack;Euro-Techno;Ambient;Trip-Hop;Vocal;Jazz+Funk;Fusion;Trance;Classical;Instrumental;Acid;House;Game;Sound Clip;Gospel;Noise;AlternRock;Bass;Soul;Punk;Space;Meditative;Instrumental Pop;Instrumental Rock;Ethnic;Gothic;Darkwave;Techno-Industrial;Electronic;Pop-Folk;Eurodance;Dream;Southern Rock;Comedy;Cult;Gangsta;Top 40;Christian Rap;Pop/Funk;Jungle;Native American;Cabaret;New Wave;Psychadelic;Rave;Showtunes;Trailer;Lo-Fi;Tribal;Acid Punk;Acid Jazz;Polka;Retro;Musical;Rock & Roll;Hard Rock;Folk;Folk-Rock;National Folk;Swing;Fast Fusion;Bebob;Latin;Revival;Celtic;Bluegrass;Avantgarde;Gothic Rock;Progressive Rock;Psychedelic Rock;Symphonic Rock;Slow Rock;Big Band;Chorus;Easy Listening;Acoustic;Humour;Speech;Chanson;Opera;Chamber Music;Sonata;Symphony;Booty Bass;Primus;Porn Groove;Satire;Slow Jam;Club;Tango;Samba;Folklore;Ballad;Power Ballad;Rhythmic Soul;Freestyle;Duet;Punk Rock;Drum Solo;Acapella;Euro-House;Dance Hall".split(";");
		g.m=function(b,d){var a=b.h();b.f([a-128-1,a],d)};g.n=function(c){var d=c.h()-128;if("TAG"==c.c(d,3)){var a=c.c(d+3,30).replace(/\0/g,""),f=c.c(d+33,30).replace(/\0/g,""),g=c.c(d+63,30).replace(/\0/g,""),l=c.c(d+93,4).replace(/\0/g,"");if(0==c.a(d+97+28))var e=c.c(d+97,28).replace(/\0/g,""),h=c.a(d+97+29);else e="",h=0;c=c.a(d+97+30);return{version:"1.1",title:a,artist:f,album:g,year:l,comment:e,track:h,genre:255>c?b[c]:""}}return{}};h.ID3v1=h.q})(this);(function(h){function g(a,b){var d=b.a(a),c=b.a(a+1),e=b.a(a+2);return b.a(a+3)&127|(e&127)<<7|(c&127)<<14|(d&127)<<21}var b=h.D={};b.b={};b.frames={BUF:"Recommended buffer size",CNT:"Play counter",COM:"Comments",CRA:"Audio encryption",CRM:"Encrypted meta frame",ETC:"Event timing codes",EQU:"Equalization",GEO:"General encapsulated object",IPL:"Involved people list",LNK:"Linked information",MCI:"Music CD Identifier",MLL:"MPEG location lookup table",PIC:"Attached picture",POP:"Popularimeter",REV:"Reverb",
		RVA:"Relative volume adjustment",SLT:"Synchronized lyric/text",STC:"Synced tempo codes",TAL:"Album/Movie/Show title",TBP:"BPM (Beats Per Minute)",TCM:"Composer",TCO:"Content type",TCR:"Copyright message",TDA:"Date",TDY:"Playlist delay",TEN:"Encoded by",TFT:"File type",TIM:"Time",TKE:"Initial key",TLA:"Language(s)",TLE:"Length",TMT:"Media type",TOA:"Original artist(s)/performer(s)",TOF:"Original filename",TOL:"Original Lyricist(s)/text writer(s)",TOR:"Original release year",TOT:"Original album/Movie/Show title",
		TP1:"Lead artist(s)/Lead performer(s)/Soloist(s)/Performing group",TP2:"Band/Orchestra/Accompaniment",TP3:"Conductor/Performer refinement",TP4:"Interpreted, remixed, or otherwise modified by",TPA:"Part of a set",TPB:"Publisher",TRC:"ISRC (International Standard Recording Code)",TRD:"Recording dates",TRK:"Track number/Position in set",TSI:"Size",TSS:"Software/hardware and settings used for encoding",TT1:"Content group description",TT2:"Title/Songname/Content description",TT3:"Subtitle/Description refinement",
		TXT:"Lyricist/text writer",TXX:"User defined text information frame",TYE:"Year",UFI:"Unique file identifier",ULT:"Unsychronized lyric/text transcription",WAF:"Official audio file webpage",WAR:"Official artist/performer webpage",WAS:"Official audio source webpage",WCM:"Commercial information",WCP:"Copyright/Legal information",WPB:"Publishers official webpage",WXX:"User defined URL link frame",AENC:"Audio encryption",APIC:"Attached picture",COMM:"Comments",COMR:"Commercial frame",ENCR:"Encryption method registration",
		EQUA:"Equalization",ETCO:"Event timing codes",GEOB:"General encapsulated object",GRID:"Group identification registration",IPLS:"Involved people list",LINK:"Linked information",MCDI:"Music CD identifier",MLLT:"MPEG location lookup table",OWNE:"Ownership frame",PRIV:"Private frame",PCNT:"Play counter",POPM:"Popularimeter",POSS:"Position synchronisation frame",RBUF:"Recommended buffer size",RVAD:"Relative volume adjustment",RVRB:"Reverb",SYLT:"Synchronized lyric/text",SYTC:"Synchronized tempo codes",
		TALB:"Album/Movie/Show title",TBPM:"BPM (beats per minute)",TCOM:"Composer",TCON:"Content type",TCOP:"Copyright message",TDAT:"Date",TDLY:"Playlist delay",TENC:"Encoded by",TEXT:"Lyricist/Text writer",TFLT:"File type",TIME:"Time",TIT1:"Content group description",TIT2:"Title/songname/content description",TIT3:"Subtitle/Description refinement",TKEY:"Initial key",TLAN:"Language(s)",TLEN:"Length",TMED:"Media type",TOAL:"Original album/movie/show title",TOFN:"Original filename",TOLY:"Original lyricist(s)/text writer(s)",
		TOPE:"Original artist(s)/performer(s)",TORY:"Original release year",TOWN:"File owner/licensee",TPE1:"Lead performer(s)/Soloist(s)",TPE2:"Band/orchestra/accompaniment",TPE3:"Conductor/performer refinement",TPE4:"Interpreted, remixed, or otherwise modified by",TPOS:"Part of a set",TPUB:"Publisher",TRCK:"Track number/Position in set",TRDA:"Recording dates",TRSN:"Internet radio station name",TRSO:"Internet radio station owner",TSIZ:"Size",TSRC:"ISRC (international standard recording code)",TSSE:"Software/Hardware and settings used for encoding",
		TYER:"Year",TXXX:"User defined text information frame",UFID:"Unique file identifier",USER:"Terms of use",USLT:"Unsychronized lyric/text transcription",WCOM:"Commercial information",WCOP:"Copyright/Legal information",WOAF:"Official audio file webpage",WOAR:"Official artist/performer webpage",WOAS:"Official audio source webpage",WORS:"Official internet radio station homepage",WPAY:"Payment",WPUB:"Publishers official webpage",WXXX:"User defined URL link frame"};var c={title:["TIT2","TT2"],artist:["TPE1",
		"TP1"],album:["TALB","TAL"],year:["TYER","TYE"],comment:["COMM","COM"],track:["TRCK","TRK"],genre:["TCON","TCO"],picture:["APIC","PIC"],lyrics:["USLT","ULT"]},d=["title","artist","album","track"];b.m=function(a,b){a.f([0,g(6,a)],b)};b.n=function(a,f){var h=0,l=a.a(h+3);if(4<l)return{version:">2.4"};var e=a.a(h+4),t=a.d(h+5,7),m=a.d(h+5,6),u=a.d(h+5,5),k=g(h+6,a),h=h+10;if(m)var r=a.i(h),h=h+(r+4);var l={version:"2."+l+"."+e,major:l,revision:e,flags:{unsynchronisation:t,extended_header:m,experimental_indicator:u},
		size:k},n;if(t)n={};else{for(var k=k-10,t=a,e=f,m={},u=l.major,r=[],q=0,p;p=(e||d)[q];q++)r=r.concat(c[p]||[p]);for(e=r;h<k;){r=null;q=t;p=h;var x=null;switch(u){case 2:n=q.c(p,3);var s=q.o(p+3),w=6;break;case 3:n=q.c(p,4);s=q.i(p+4);w=10;break;case 4:n=q.c(p,4),s=g(p+4,q),w=10}if(""==n)break;h+=w+s;0>e.indexOf(n)||(2<u&&(x={message:{P:q.d(p+8,6),I:q.d(p+8,5),M:q.d(p+8,4)},k:{K:q.d(p+8+1,7),F:q.d(p+8+1,3),H:q.d(p+8+1,2),C:q.d(p+8+1,1),u:q.d(p+8+1,0)}}),p+=w,x&&x.k.u&&(g(p,q),p+=4,s-=4),x&&x.k.C||
			(n in b.b?r=b.b[n]:"T"==n[0]&&(r=b.b["T*"]),r=r?r(p,s,q,x):void 0,r={id:n,size:s,description:n in b.frames?b.frames[n]:"Unknown",data:r},n in m?(m[n].id&&(m[n]=[m[n]]),m[n].push(r)):m[n]=r))}n=m}for(var z in c)if(c.hasOwnProperty(z)){a:{s=c[z];"string"==typeof s&&(s=[s]);w=0;for(h=void 0;h=s[w];w++)if(h in n){a=n[h].data;break a}a=void 0}a&&(l[z]=a)}for(var A in n)n.hasOwnProperty(A)&&(l[A]=n[A]);return l};h.ID3v2=b})(this);(function(){function h(b){var c;switch(b){case 0:c="iso-8859-1";break;case 1:c="utf-16";break;case 2:c="utf-16be";break;case 3:c="utf-8"}return c}var g="32x32 pixels 'file icon' (PNG only);Other file icon;Cover (front);Cover (back);Leaflet page;Media (e.g. lable side of CD);Lead artist/lead performer/soloist;Artist/performer;Conductor;Band/Orchestra;Composer;Lyricist/text writer;Recording Location;During recording;During performance;Movie/video screen capture;A bright coloured fish;Illustration;Band/artist logotype;Publisher/Studio logotype".split(";");
		ID3v2.b.APIC=function(b,c,d,a,f){f=f||"3";a=b;var v=h(d.a(b));switch(f){case "2":var l=d.c(b+1,3);b+=4;break;case "3":case "4":l=d.e(b+1,c-(b-a),""),b+=1+l.g}f=d.a(b,1);f=g[f];v=d.e(b+1,c-(b-a),v);b+=1+v.g;return{format:l.toString(),type:f,description:v.toString(),data:d.l(b,a+c-b)}};ID3v2.b.COMM=function(b,c,d){var a=b,f=h(d.a(b)),g=d.c(b+1,3),l=d.e(b+4,c-4,f);b+=4+l.g;b=d.e(b,a+c-b,f);return{language:g,O:l.toString(),text:b.toString()}};ID3v2.b.COM=ID3v2.b.COMM;ID3v2.b.PIC=function(b,c,d,a){return ID3v2.b.APIC(b,
				c,d,a,"2")};ID3v2.b.PCNT=function(b,c,d){return d.J(b)};ID3v2.b.CNT=ID3v2.b.PCNT;ID3v2.b["T*"]=function(b,c,d){var a=h(d.a(b));return d.e(b+1,c-1,a).toString()};ID3v2.b.TCON=function(b,c,d){return ID3v2.b["T*"].apply(this,arguments).replace(/^\(\d+\)/,"")};ID3v2.b.TCO=ID3v2.b.TCON;ID3v2.b.USLT=function(b,c,d){var a=b,f=h(d.a(b)),g=d.c(b+1,3),l=d.e(b+4,c-4,f);b+=4+l.g;b=d.e(b,a+c-b,f);return{language:g,G:l.toString(),L:b.toString()}};ID3v2.b.ULT=ID3v2.b.USLT})();(function(h){function g(b,a,f,h){var l=b.i(a);if(0==l)h();else{var e=b.c(a+4,4);-1<["moov","udta","meta","ilst"].indexOf(e)?("meta"==e&&(a+=4),b.f([a+8,a+8+8],function(){g(b,a+8,l-8,h)})):b.f([a+(e in c.j?0:l),a+l+8],function(){g(b,a+l,f,h)})}}function b(d,a,f,g,h){h=void 0===h?"":h+"  ";for(var e=f;e<f+g;){var t=a.i(e);if(0==t)break;var m=a.c(e+4,4);if(-1<["moov","udta","meta","ilst"].indexOf(m)){"meta"==m&&(e+=4);b(d,a,e+8,t-8,h);break}if(c.j[m]){var u=a.o(e+16+1),k=c.j[m],u=c.types[u];if("trkn"==
			m)d[k[0]]=a.a(e+16+11),d.count=a.a(e+16+13);else{var m=e+16+4+4,r=t-16-4-4,n;switch(u){case "text":n=a.e(m,r,"UTF-8");break;case "uint8":n=a.w(m);break;case "jpeg":case "png":n={k:"image/"+u,data:a.l(m,r)}}d[k[0]]="comment"===k[0]?{text:n}:n}}e+=t}}var c=h.r={};c.types={0:"uint8",1:"text",13:"jpeg",14:"png",21:"uint8"};c.j={"\u00a9alb":["album"],"\u00a9art":["artist"],"\u00a9ART":["artist"],aART:["artist"],"\u00a9day":["year"],"\u00a9nam":["title"],"\u00a9gen":["genre"],trkn:["track"],"\u00a9wrt":["composer"],
		"\u00a9too":["encoder"],cprt:["copyright"],covr:["picture"],"\u00a9grp":["grouping"],keyw:["keyword"],"\u00a9lyr":["lyrics"],"\u00a9cmt":["comment"],tmpo:["tempo"],cpil:["compilation"],disk:["disc"]};c.m=function(b,a){b.f([0,7],function(){g(b,0,b.h(),a)})};c.n=function(c){var a={};b(a,c,0,c.h());return a};h.ID4=h.r})(this);

	var map = map || {};

	jQuery.mbMiniPlayer = {
		author  : "Matteo Bicocchi",
		version : "1.8.1",
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
			swfPath             : "inc/",
			pauseOnWindowBlur   : false,
			onReady             : function (player, $controlsBox) {},
			onPlay              : function (player) {},
			onEnd               : function (player) {},
			onDownload          : function (player) {}
		},

		getID3: function (player) {

			if (!player.opt.id3 && !player.opt.m4a)
				return;

			var $titleBox = player.controlBox.find(".map_title");
			var url = (player.opt.mp3 || player.opt.m4a);

			if (url) {
				ID3.loadTags(url, function() {
					player.info = ID3.getAllTags(url);
					if (typeof player.info.title != "undefined" && player.info.title != "null") {
						$titleBox.html(player.info.title + " - " + player.info.artist);
					}
				},{
					tags: ["artist", "title", "album", "year", "comment", "track", "genre", "lyrics", "picture"],
					onError: function(reason) {
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
				if (isAndroidDefault) {
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

				var $layout = $("<div class='playerTable'> <div></div><div></div><div></div><div></div><div></div><div></div> </div>");

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

				var download = jQuery("<span/>").addClass("map_download").css({display: "inline-block", cursor: "pointer"}).html("d").on(jQuery.mbMiniPlayer.eventEnd, function () {
					jQuery.mbMiniPlayer.saveFile(player, fileUrl, fileName, fileExtension);

					//add track for Google Analytics
					if (typeof _gaq != "undefined" && player.opt.gaTrack)
						_gaq.push(['_trackEvent', 'Audio', 'map_Download', player.title + " - " + self.location.href]);

					if (typeof ga != "undefined" && eval(player.opt.gaTrack))
						ga('send', 'event', 'Audio', 'map_Download', player.title + " - " + self.location.href);


					if (typeof player.opt.onDownload == "function")
						player.opt.onDownload(player);


				}).attr("title", "download: " + fileName);

				if (player.opt.downloadable) {
					$controlsBox.append(download);
				}

				var $tds = $controlsBox.find("div").not('.playerTable').unselectable();

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

				$tds.eq(0).addClass("muteBox").append($muteBox);
				$tds.eq(1).addClass("volumeLevel").append($volumeLevel).hide();
				$tds.eq(2).addClass("map_controlsBar").append($controls).hide();
				$tds.eq(3).addClass("timeBox").append($timeBox).hide();
				$tds.eq(4).addClass("rewBox").append($rewBox).hide();
				$tds.eq(5).append($playBox);

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
								var margin = player.opt.downloadable ? (m+10) * 3 : 40;
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

									widthToRemove +=30;
								}

								if (player.opt.showTime) {
									$timeBox.parent("div").show();
									if (isIE)
										$timeBox.show().css({width: 34, display: "block"});
									else
										$timeBox.animate({width: 34}, speed / 2).show();

									widthToRemove +=45;

								}

								if (player.opt.showVolumeLevel) {
									$volumeLevel.parent("div").show();
									jQuery("a",$volumeLevel).show();

									if (isIE)
										$volumeLevel.show().css({width: 40, display: "block"});
									else
										$volumeLevel.show().animate({width: 40}, speed / 2);

									widthToRemove +=50;

								}

								if (player.opt.showControls) {
									$controls.parent("div").show();

									var w =  player.width - ($muteBox.outerWidth() + $playBox.outerWidth()+ widthToRemove);

									console.debug(player.width)

								  //w = w<40 ? 40 : w;
									$controls.css({display: "block", height: 20}).animate({width:w}, speed);
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
									jQuery("a",$volumeLevel).hide();

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
					preload            : jQuery.isMobile ? 'none' : 'metadata',
					cssSelectorAncestor: "#" + playerID, // Remove the ancestor css selector clause
					cssSelector        : {
						playBar: "#playBar_" + playerID,
						seekBar: "#loadBar_" + playerID
						// The other defaults remain unchanged
					}
				})
						.on(jQuery.jPlayer.event.play, function (e) {})
						.on(jQuery.jPlayer.event.loadedmetadata, function(){})
						.on(jQuery.jPlayer.event.ended, function () {

							if (isAndroidDefault)
								return;

							if (player.opt.loop)
								$player.jPlayer("play");
							else
								$playBox.trigger(jQuery.mbMiniPlayer.eventEnd);
							if (typeof player.opt.onEnd == "function")
								player.opt.onEnd(player);

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

		saveFile: function (player, fileUrl, fileName, fileExtension) {
			var host = location.hostname.split(".");
			host = host.length == 3 ? host[1] : host[0];
			var isSameDomain = (fileUrl.indexOf(host) >= 0) || fileUrl.indexOf("http") < 0;

			var a = document.createElement('a');
			if (!player.opt.downloadPage && isSameDomain && typeof a.download != "undefined") {

				var downloadA = jQuery("<a/>").attr({id: "mb_dwnl", href: fileUrl, download: fileName + "." + fileExtension}).html("dwnload")//.hide();
				jQuery("body").append(downloadA);

				function fakeClick(anchorObj) {
					if (anchorObj.click) {
						anchorObj.click()
					} else if (document.createEvent) {
						var evt = document.createEvent("MouseEvents");
						evt.initMouseEvent("click", true, true, window,
								0, 0, 0, 0, 0, false, false, false, false, 0, null);
						var allowDefault = anchorObj.dispatchEvent(evt);
					}
				}

				fakeClick(downloadA.get(0));
				downloadA.remove();

			} else if (!player.opt.downloadPage) {
				window.open(fileUrl, "map_download");
			} else {
				/* player.opt.downloadPage = path to the PHP page that stream the file and download it.*/
				location.href = player.opt.downloadPage + "?filename=" + fileName + "." + fileExtension + "&fileurl=" + fileUrl;
			}
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
		this.each(function () {
			jQuery(this).css({
				"-webkit-user-select": "none",
				"-moz-user-select": "none",
				"-ms-user-select": "none",
				"-o-user-select": "none",
				"user-select": "none"
			}).attr("unselectable", "on");
		});
		return jQuery(this);
	};

	//Public method
	jQuery.fn.mb_miniPlayer = jQuery.mbMiniPlayer.buildPlayer;
	jQuery.fn.mb_miniPlayer_changeFile = jQuery.mbMiniPlayer.changeFile;
	jQuery.fn.mb_miniPlayer_play = jQuery.mbMiniPlayer.play;
	jQuery.fn.mb_miniPlayer_stop = jQuery.mbMiniPlayer.stop;
	jQuery.fn.mb_miniPlayer_toggle = jQuery.mbMiniPlayer.toggle;
	jQuery.fn.mb_miniPlayer_destroy = jQuery.mbMiniPlayer.destroy;
	jQuery.fn.mb_miniPlayer_getPlayer = jQuery.mbMiniPlayer.getPlayer;

})(jQuery);
