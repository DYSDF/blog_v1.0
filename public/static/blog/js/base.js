require(["jquery"],function(a){function b(){var b=window.location.pathname,c=window.location.href,e=a(".nav_menu li");e.each(function(b,c,e){a(c).removeClass("cur")});if(0<e.length)for(var f=null,g=null,g=0===e.eq(0).children("a").attr("href").indexOf("http")?c:b,h=g.length;0<h;h--)if(e.each(function(b,c,e){a(c).children("a").attr("href")==g.substring(0,h)&&(f=c)}),null!=f){a(f).addClass("cur");break}}0<a(".nav_menu li").length?b():a(document).ready(b)});
require(["DYUtils"],function(a){a.bindEvent(document.getElementById("header_nav"),"click",a.stopBubble);a.bindEvent(document,"click",function(b){if(document.getElementById("nav_menu_checkbox").checked)return document.getElementById("nav_menu_checkbox").checked=!1,a.stopBubble(b),!1})});
require(["DYUtils","FastScroll"],function(a,b){var d=new b(document.getElementsByClassName("body")[0]);d.onScroll=function(b){var c=document.getElementById("go_to_top");b>window.screen.availHeight/2?a.addClassName(c,"show"):a.removeClassName(c,"show")};a.bindEvent(document,"click",function(a){a=a||window.event;"go_to_top"==a.target.id&&d.goTop()})});
require(["DYUtils","SpiderWeb"],function(a,b){a.DOMReady(function(){(new b(document.getElementById("background_canvas"),{radius:2.5,color:"#4c4c4c",count:200,scale:2,maxDistance:200})).start()})});require(["PictureBurst","DYUtils"],function(a,b){b.DOMReady(function(){if(!b.getCookie("hasVisited")){var d=document.getElementById("header_img"),c=a(d,{countX:40,countY:5,rotate:0,onEnd:function(){d.style.opacity=""}});d.style.opacity="0";c.gather();b.setCookie("hasVisited",!0)}})});
