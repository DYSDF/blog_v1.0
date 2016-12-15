define([],function(){var a={toObject:function(c){var b=JSON.parse(c);if(typeof b!="object"){return arguments.callee(b)}return b},deBounce:function(c,e,b){var d;return function(){var i=this,h=arguments;var g=function(){d=null;if(!b){c.apply(i,h)}};var f=b&&!d;clearTimeout(d);d=setTimeout(g,e);if(f){c.apply(i,h)}}},deFrames:function(c,e,b){var d;return function(){var h=this,g=arguments;var f=function(){d=Date.now();c.apply(h,g)};if(b&&!d){d=Date.now()-e}d=d||Date.now();if(d+e<=Date.now()){f.call(h)}}},Singleton:function(c){var b;return function(){return b||(b=c.apply(this.arguments))}},hasClassName:function(c,b){if(c.className){return c.className.split(" ").some(function(d){return d==b})}else{return false}},addClassName:function(c,b){if(Object.prototype.toString.call(c)==="[object HTMLCollection]"){[].slice.call(c).forEach(function(d){this.addClassName(d,b)}.bind(this))}else{if(!this.hasClassName(c,b)){c.className=(c.className+" "+b).trim()}}},removeClassName:function(d,c){if(Object.prototype.toString.call(d)==="[object HTMLCollection]"){[].slice.call(d).forEach(function(e){this.removeClassName(e,c)}.bind(this))}else{var b=d.className.split(" ");b=b.filter(function(e){return !(e==c||!e)});d.className=b.join(" ")}},toggleClassName:function(c,b){if(Object.prototype.toString.call(c)==="[object HTMLCollection]"){[].slice.call(c).forEach(function(d){this.toggleClassName(d,b)}.bind(this))}else{if(this.hasClassName(c,b)){this.removeClassName(c,b)}else{this.addClassName(c,b)}}},getCss:function(b){return document.defaultView.getComputedStyle(b)},getCssValue:function(b,c){return this.getCss(b).getPropertyValue(c)},isChildNode:function(c,b){while(c!=undefined&&c!=null&&c.tagName.toUpperCase()!="BODY"){if(c==b){return true}c=c.parentNode}return false},stopBubble:function(b){if(b&&b.stopPropagation){b.stopPropagation()}else{window.event.cancelBubble=true}},bindEvent:function(d,c,b){c.split(" ").forEach(function(e){if(d.addEventListener){d.addEventListener(e,b,false)}else{if(d.attachEvent){d.attachEvent("on"+e,b)}else{d["on"+e]=b}}});return d},removeEvent:function(d,c,b){c.split(" ").forEach(function(e){if(d.removeEventListener){d.removeEventListener(e,b)}else{if(d.detachEvent){d.detachEvent("on"+e,b)}else{d["on"+e]=null}}});return d},oneEvent:function(f,c,b){var e=this.bindEvent,d=this.removeEvent;c.split(" ").forEach(function(g){e(f,g,b);e(document,g,function(){d(f,g,b);d(document,g,arguments.callee)})});return f},getCookie:function(c){var b={};document.cookie.split(";").forEach(function(f,e,g){var d=f.trim().split("=");b[d[0]]=d[1]});if(c){return b[c.toString()]}else{return b}},setCookie:function(d,e,b,f){var c=new Date();c.setTime(Date.now()+b*1000);document.cookie=d+"="+e+";expires="+c.toUTCString()+";path="+f},delCookie:function(b){document.cookie=b+"=;expires="+new Date().toUTCString()},setLocalStorage:function(b,c){window.localStorage.setItem(b,JSON.stringify(c))},getLocalStorage:function(b){return window.localStorage.getItem(b)},ajax:function(d){function j(){}var c=d.url||"";var e=d.async!==false;var b=d.method||"GET";var g=d.data||null;var l=d.beforeSend||j;var m=d.success||j;var i=d.error||j;b=b.toUpperCase();if(g){if(typeof g=="object"){var h=[];for(var f in g){h.push(f+"="+g[f])}g=h.join("&")}}if(g&&b=="GET"){c+=(c.indexOf("?")==-1?"?":"&")+g;g=null}var n=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");n.onreadystatechange=function(){if(n.readyState==4){var k=n.status;if(k>=200&&k<300){m.call(n,n.responseText)}else{i.call(n,n.responseText)}}else{}};n.open(b,c,e);n.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");l.call(this,n);n.send(g);return n},fastAnimation:function(c){var b=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(d){window.setTimeout(d,1000/60)};b(c)}};if(!window.DYUtils){window.DYUtils=a}return a});