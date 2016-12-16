/**
 * Created by 断崖 on 2016/12/9.
 */

define([], function () {
    // 基本方法
    var DYUtils = {
        // 浏览器检测
        browser: {
            ie: function () {
                var b = document.createElement('b');
                for (var i = 6; i < 20; i++) {
                    b.innerHTML += '<!--[if IE ' + i + ']><i></i><![endif]-->';
                }
                document.body.appendChild(b);
                return b.getElementsByTagName('i').length;
            }
        },

        // JS 设计模式
        // 转换成object
        toObject: function (str) {
            var obj = JSON.parse(str);
            if (typeof obj != "object") {
                return arguments.callee(obj);
            }
            return obj;
        },

        // 阻止高频触发
        deBounce: function (func, wait, immediate) {
            var timeout;
            return function () {
                var context = this,
                    args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },

        // 降低触发频率
        deFrames: function (func, wait, immediate) {
            var lastTime;
            return function () {
                var context = this,
                    args = arguments;
                var later = function () {
                    lastTime = Date.now();
                    func.apply(context, args);
                };
                if (immediate && !lastTime) lastTime = Date.now() - wait;
                lastTime = lastTime || Date.now();
                if (lastTime + wait <= Date.now()) {
                    later.call(context)
                }
            };
        },

        // 单例模式
        Singleton: function (fn) {
            var result;
            return function () {
                return result || (result = fn.apply(this.arguments));
            }
        },

        // DOM 操作类
        // CSS选择器先用别人的，后期自己写
        querySelector: function (cssPath) {
            return this.querySelectors(cssPath)[0];
        },
        querySelectors: (function () {
            if (document.querySelectorAll) {
                return function (cssPath) {
                    if (typeof cssPath != "string") return;
                    return document.querySelectorAll(cssPath);
                };
            } else {
                require(["QuerySelector"], function (QuerySelector) {
                    DYUtils.querySelectors = QuerySelector;
                });
            }
        })(),
        hasClassName: function (target, className) {
            if (target.className) {
                return target.className.split(" ").some(function (item) {
                    return item == className;
                });
            } else {
                return false;
            }
        },
        addClassName: function (target, className) {
            if (Object.prototype.toString.call(target) === "[object HTMLCollection]") {
                [].slice.call(target).forEach(function (item) {
                    this.addClassName(item, className);
                }.bind(this))
            } else {
                if (!this.hasClassName(target, className)) {
                    target.className = (target.className + " " + className).trim();
                }
            }
        },
        removeClassName: function (target, className) {
            if (Object.prototype.toString.call(target) === "[object HTMLCollection]") {
                [].slice.call(target).forEach(function (item) {
                    this.removeClassName(item, className);
                }.bind(this))
            } else {
                var classArray = target.className.split(" ");
                classArray = classArray.filter(function (item) {
                    return !(item == className || !item);
                });
                target.className = classArray.join(" ");
            }
        },
        toggleClassName: function (target, className) {
            if (Object.prototype.toString.call(target) === "[object HTMLCollection]") {
                [].slice.call(target).forEach(function (item) {
                    this.toggleClassName(item, className);
                }.bind(this))
            } else {
                if (this.hasClassName(target, className)) {
                    this.removeClassName(target, className);
                } else {
                    this.addClassName(target, className);
                }
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
            var cookie = [];
            if (value != null && value != undefined) {
                cookie.push(key + "=" + value);
            }
            if (age != null && age != undefined) {
                var date = new Date();
                date.setTime(Date.now() + age * 1000);
                cookie.push("expires=" + date.toUTCString());
            }
            if (path != null && path != undefined) {
                cookie.push("path=" + path);
            }
            document.cookie = cookie.join(";");
        },
        delCookie: function (key) {
            document.cookie = key + "=;expires=" + new Date().toUTCString();
        },

        // localStorage 操作
        setLocalStorage: function (key, value) {
            window.localStorage.setItem(key, JSON.stringify(value));
        },
        getLocalStorage: function (key) {
            return window.localStorage.getItem(key);
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
            xhr.setRequestHeader('Request-type', 'ajax');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
            beforeSend.call(this, xhr);

            //发送请求
            xhr.send(data);
            return xhr;
        },

        // 动画操作
        // 高速动画
        fastAnimation: function (fn) {
            var requestAnimation = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
            requestAnimation(fn);
        }

    };

    // 增加方法
    DYUtils.DOMReady = (function () {
        var isDOMReady = false;
        var domReadyMonitorId;
        var domReadyMonitorRunTimes = 0;
        var readyFuncArray = [];

        function DOMReadyMonitor() {
            domReadyMonitorRunTimes++;
            //对于ie6,7,8浏览器, 使用doScroll判断Dom Ready
            if (DYUtils.browser.ie() && DYUtils.browser.ie() < 9) {
                try {
                    document.documentElement.doScroll("left");
                    DOMContentLoadedHandler();
                } catch (e) {
                }
            }
            else if (document.readyState === "complete") {
                DOMContentLoadedHandler();
            }
            //对于某些特殊页面, 如果readyState永远不能为complete, 设置了一个最大运行时间5分钟. 超过了最大运行时间则销毁定时器.
            else {
                if (domReadyMonitorRunTimes > 300000) {
                    if (domReadyMonitorId) {
                        DOMContentLoadedHandler();
                    }
                }
            }
        }

        function DOMContentLoadedHandler() {
            if (isDOMReady) return;
            try {
                if (readyFuncArray && readyFuncArray.length) {
                    readyFuncArray.forEach(function (item) {
                        if (item && item.func && !item.done) {
                            if (item.delay) {
                                item.done = true;
                                window.setTimeout(item.func, item.delay);
                            } else {
                                item.done = true;
                                item.func();
                            }
                        }
                    });
                }
            } catch (ex) {
                throw ex;
            }
            isDOMReady = true;
            window.clearInterval(domReadyMonitorId);
        }

        //启动DOMReady监控进程
        domReadyMonitorId = window.setInterval(DOMReadyMonitor, 50);
        DYUtils.bindEvent(document, "DOMContentLoaded", DOMContentLoadedHandler);
        DYUtils.bindEvent(window, "load", DOMContentLoadedHandler, false);

        return function (callback, delay) {
            readyFuncArray.push({func: callback, delay: delay, done: false});
        };
    })();

    if (!window.DYUtils) window.DYUtils = DYUtils;
    return DYUtils;
});