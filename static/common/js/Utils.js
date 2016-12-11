/**
 * Created by 断崖 on 2016/12/9.
 */

define([], function () {
    var DYUtils = {
        // JS 设计模式
        // 单例模式
        Singleton: function (fn) {
            var result;
            return function () {
                return result || (result = fn.apply(this.arguments));
            }
        },
        // DOM 操作类
        hasClassName: function (target, className) {
            return new RegExp(className).test(target.className);
        },
        addClassName: function (target, className) {
            target.className = (" " + className);
        },
        removeClassName: function (target, className) {
            var classArray = target.className.split(" ");
            classArray = classArray.filter(function (item) {
                if(item == className || !item){
                    return false;
                } else {
                    return true;
                }
            });
            target.className = classArray.join(" ");
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

        isChildNode: function (obj, parentObj) {
            while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
                if (obj == parentObj) {
                    return true;
                }
                obj = obj.parentNode;
            }
            return false;
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
        getCookie: function (key) {
            var cookieHash = {};
            document.cookie.split(";").forEach(function (item, index, array) {
                var result = item.trim().split("=");
                cookieHash[result[0]] = result[1];
            });

            if (key) {
                return cookieHash[key.toString()];
            } else {
                return cookieHash;
            }
        },
        setCookie: function (key, value, age, path) {
            var date = new Date();
            date.setTime(Date.now() + age * 1000);
            document.cookie = key + "=" + value + ";expires=" + date.toUTCString() + ";path=" + path;
        },
        delCookie: function (key) {
            document.cookie = key + "=;expires=" + new Date().toUTCString();
        },


        // localStorage 操作
        setLocalStorage: function (key, value) {
            window.localStorage.setItem(key, JSON.stringify(value))
        },
        getLocalStorage: function (key) {
            return JSON.parse(window.localStorage.getItem(key));
        },

        //ajax 操作
        ajax: function (opt) {
            //构造回调函数
            function fn() {
            }

            //初始化参数
            var url = opt.url || "";
            var async = opt.async !== false;
            var method = opt.method || 'GET';
            var data = opt.data || null;
            var beforeSend = opt.beforeSend || fn;
            var success = opt.success || fn;
            var error = opt.error || fn;
            //方法大写
            method = method.toUpperCase();

            //改写data数据结构
            if (data) {
                if (typeof data == 'object') {
                    var arr = [];
                    for (var k in data) {
                        arr.push(k + "=" + data[k]);
                    }
                    data = arr.join("&");
                }

            }
            if (data && method == "GET") {
                url += (url.indexOf('?') == -1 ? '?' : '&') + data;
                data = null;
            }
            //建立xmlhttp实例
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

            //定义响应事件
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var s = xhr.status;
                    if (s >= 200 && s < 300) {
                        success.call(xhr, xhr.responseText);
                    } else {
                        error.call(xhr, xhr.responseText);
                    }
                } else {
                }
            };

            // 建立连接
            xhr.open(method, url, async);

            // 改写请求头
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
            beforeSend.call(this, xhr);

            //发送请求
            xhr.send(data);
            return xhr;
        }
    };

    if (!window.DYUtils) window.DYUtils = DYUtils;

    return DYUtils;
});