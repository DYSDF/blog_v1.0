/**
 * Created by 断崖 on 2016/12/9.
 */

define([], function () {
    var DYUtils = {
        // DOM 操作类
        hasClassName: function (target, className) {
            return new RegExp(className).test(target.className);
        },
        addClassName: function (target, className) {
            target.className = target.className.replace(new RegExp(className), " ") + " " + className;
        },
        removeClassName: function (target, className) {
            target.className = target.className.replace(new RegExp(className), " ");
        },
        toggleClassName: function (target, className) {
            if (new RegExp(className).test(target.className)) {
                this.removeClassName(target, className);
            } else {
                this.addClassName(target, className);
            }
        },
        getCss: function (target) {
            return document.defaultView.getComputedStyle(target);
        },

        getCssValue: function (target, cssName) {
            return this.getCss(target).getPropertyValue(cssName);
        },

        // 事件操作类
        stopBubble: function (e) {
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }
        },
        bindEvent: function (target, eventTypes, fnObj) {
            eventTypes.split(" ").forEach(function (eventType) {
                if (target.addEventListener) {
                    target.addEventListener(eventType, fnObj, false);
                } else if (target.attachEvent) {
                    target.attachEvent("on" + eventType, fnObj);
                } else {
                    target["on" + eventType] = fnObj;
                }
            });
            return target;
        },
        removeEvent: function (target, eventTypes, fnObj) {
            eventTypes.split(" ").forEach(function (eventType) {
                if (target.removeEventListener) {
                    target.removeEventListener(eventType, fnObj);
                } else if (target.detachEvent) {
                    target.detachEvent("on" + eventType, fnObj);
                } else {
                    target["on" + eventType] = null;
                }
            });
            return target;
        },
        oneEvent: function (target, eventTypes, fnObj) {
            var bindEvent = this.bindEvent,
                removeEvent = this.removeEvent;
            eventTypes.split(" ").forEach(function (eventType) {
                bindEvent(target, eventType, fnObj);
                bindEvent(document, eventType, function () {
                    removeEvent(target, eventType, fnObj);
                    removeEvent(document, eventType, arguments.callee);
                })
            });
            return target;
        },

        // Cookie 操作
        getCookies: function () {
            var cookieHash = {};
            document.cookie.split(";").forEach(function (item, index, array) {
                var result = item.trim().split("=");
                cookieHash[result[0]] = result[1];
            });
            return cookieHash;
        },
        getCookie: function (key) {
            return this.getCookies()[key.toString()];
        },
        setCookie: function (key, value, age, path) {
            document.cookie = key + "=" + value + ""
        },
        delCookie: function () {

        }
    };

    if (!window.DYUtils) window.DYUtils = DYUtils;

    return DYUtils;
});