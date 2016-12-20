/**
 * Created by 断崖 on 2016/12/8.
 *
 * 一个快速滚动指定位置的插件，原生JS
 */

define(["DYUtils", "Tween"], function (DYUtils, Tween) {
    function FastScroll(ev, dur) {
        if (!(ev instanceof HTMLElement)) {
            throw "传入参数不是有效的HTMLElement";
        }
        this.target = ev;
        this.scrollMax = this.target.scrollHeight - this.target.parentElement.clientHeight;
        this.totalTime = dur || 600;

        // 定义变量
        var isUserScroll;
        var startTime;
        var startScroll;
        var durScroll;

        // 初始化
        this.onScrollEnd = function () {
        };
        this.onScroll = function (scrollTop) {
        };

        // 添加监听事件
        DYUtils.bindEvent(this.target, "scroll", function () {
            this.onScroll(this.target.scrollTop);
        }.bind(this));
        DYUtils.bindEvent(document, "DOMMouseScroll mousewheel", function () {
            isUserScroll = true;
        });

        // 定义公共方法
        if (typeof this.goTop) {
            FastScroll.prototype.goTop = function () {
                this.goTo(0);
            };

            FastScroll.prototype.goBottom = function () {
                this.goTo(this.scrollMax);
            };

            FastScroll.prototype.goTo = function (t) {
                isUserScroll = false;
                startTime = Date.now();
                startScroll = this.target.scrollTop;
                durScroll = (t > this.scrollMax ? this.scrollMax : (t < 0 ? 0 : t)) - startScroll;
                DYUtils.fastAnimation(function () {
                    if (isUserScroll) return;
                    var durTime = Date.now() - startTime;
                    this.target.scrollTop = Tween.Cubic.easeOut(durTime, startScroll, durScroll, this.totalTime);
                    if (durTime <= this.totalTime) {
                        DYUtils.fastAnimation(arguments.callee.bind(this));
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

