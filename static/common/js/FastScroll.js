/**
 * Created by 断崖 on 2016/12/8.
 *
 * 一个快速滚动指定位置的插件，原生JS
 */

define([], function () {
    function FastScroll(ev) {
        if (!(ev instanceof HTMLElement)) {
            throw "传入参数不是有效的HTMLElement";
        }
        this.target = ev;

        // 定义变量
        var scrollMax = this.target.scrollHeight - this.target.parentElement.clientHeight,
            step,
            targetScroll;

        // 初始化
        this.onScrollEnd = function () {
        };
        this.onScroll = function (scrollTop) {
        };

        // 添加监听事件
        this.target.addEventListener("scroll", function () {
            this.onScroll(this.target.scrollTop);
        }.bind(this));

        // 定义公共方法
        if (typeof this.goTop) {
            window.requestAnimationFrame = (function () {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();

            FastScroll.prototype.goTop = function () {
                this.goTo(0);
            };

            FastScroll.prototype.goBottom = function () {
                this.goTo(scrollMax);
            };

            FastScroll.prototype.goTo = function (t) {
                targetScroll = t > scrollMax ? scrollMax : (t < 0 ? 0 : t);
                requestAnimationFrame(function () {
                    var distance = targetScroll * 1 - this.target.scrollTop;
                    if (parseInt(distance) == 0) return;
                    var step = distance / 5;
                    if (Math.abs(step) < 1) step = Math.abs(step) / step;
                    this.target.scrollTop += step;
                    if (this.target.scrollTop != targetScroll) {
                        requestAnimationFrame(arguments.callee.bind(this));
                    } else {
                        this.onScrollEnd();
                    }
                }.bind(this));
            }
        }
    }

    if (!window.FastScroll) window.FastScroll = FastScroll;

    return FastScroll;
});

