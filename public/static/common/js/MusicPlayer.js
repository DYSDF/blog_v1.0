define(["DYUtils"],function(b){function a(k){k=k||{};var p=new Audio();var s=k.volume||0.5;var j=k.songList||[];var g=k.songIndex||0;var c={};function r(){p.autoplay=false;p.volume=s;if(j[g]){p.src=j[g].mp3Url||""}}function l(v){if(Object.prototype.toString.call(v)==="[object Array]"){j=v;g=0;r()}}function u(v){if(Object.prototype.toString.call(v)==="[object Array]"){j=j.concat(v)}}function t(v){if(v!=undefined||v!=null||v!=""){g=v*1;if(j[g]){p.src=j[g].mp3Url||""}m("change",[v])}p.play()}function f(){p.pause()}function o(){var v=g*1+1>=j.length?0:g*1+1;t(v);m("change",[v])}function n(){var v=g*1-1<0?j.length-1:g*1-1;t(v);m("change",[v])}function d(){try{p.volume=Math.round(p.volume*100)/100+0.02}catch(v){}p.muted=false}function q(){try{p.volume=Math.round(p.volume*100)/100-0.02}catch(v){}p.muted=false}function h(){p.muted=!p.muted}function e(w,v){c[w]=c[w]||[];if(typeof v=="function"){c[w].push(v)}}function m(w,v){c[w]=c[w]||[];c[w].forEach(function(y,x,z){y.apply(p,v)})}function i(){return p.paused}b.bindEvent(p,"canplay",function(){m("canplay")});b.bindEvent(p,"ended",function(){m("ended");o()});b.bindEvent(p,"pause",function(){m("pause")});b.bindEvent(p,"play",function(){m("play")});b.bindEvent(p,"playing",function(){m("playing")});b.bindEvent(p,"onemptied",function(){m("onemptied");o()});b.bindEvent(p,"timeupdate",function(){m("timeupdate")});b.bindEvent(p,"volumechange",function(){m("volumechange")});b.bindEvent(p,"durationchange",function(){m("durationchange")});r();return{isPaused:i,setSongList:l,addSongs:u,play:t,pause:f,next:o,prev:n,volPlus:d,volSub:q,mute:h,listener:e}}if(!window.SimpleMusicPlayer){window.SimpleMusicPlayer=a}return a});