/**
 * Created by 断崖 on 2016/12/8.
 */

define(["DYUtils"], function (DYUtils) {
    function SimpleMusicPlayer(opts) {
        opts = opts || {};

        var player = new Audio();
        var volume = opts.volume || 0.5;
        var songList = opts.songList || [];
        var songIndex = opts.songIndex || 0;

        var events = {};


        function init() {
            player.autoplay = false;
            player.volume = volume;
            if (songList[songIndex]) {
                player.src = songList[songIndex].mp3Url || "";
            }
        }

        function setSongList(songs) {
            if (Object.prototype.toString.call(songs) === "[object Array]") {
                songList = songs;
                songIndex = 0;
                init();
            }
        }

        function addSongs(songs) {
            if (Object.prototype.toString.call(songs) === "[object Array]") {
                songList = songList.concat(songs);
            }
        }

        function play(index) {
            if (index != undefined || index != null || index != "") {
                songIndex = index * 1;
                if (songList[songIndex]) {
                    player.src = songList[songIndex].mp3Url || "";
                }
                trigger("change", [index]);
            }
            player.play();
        }

        function pause() {
            player.pause();
        }

        function next() {
            var index = songIndex * 1 + 1 >= songList.length ? 0 : songIndex * 1 + 1;
            play(index);
            trigger("change", [index]);
        }

        function prev() {
            var index = songIndex * 1 - 1 < 0 ? songList.length - 1 : songIndex * 1 - 1;
            play(index);
            trigger("change", [index]);
        }

        function volPlus() {
            try {
                player.volume = Math.round(player.volume * 100) / 100 + 0.02;
            } catch (e) {

            }
            player.muted = false;
        }

        function volSub() {
            try {
                player.volume = Math.round(player.volume * 100) / 100 - 0.02;
            } catch (e) {

            }
            player.muted = false;
        }

        function mute() {
            player.muted = !player.muted;
        }

        function listener(type, fn) {
            events[type] = events[type] || [];
            if (typeof fn == "function") {
                events[type].push(fn);
            }
        }

        function trigger(type, args) {
            events[type] = events[type] || [];
            events[type].forEach(function (fn, index, array) {
                fn.apply(player, args);
            })
        }

        // 获取状态
        function isPaused() {
            return player.paused;
        }

        // 事件监听
        // 当音频可以播放时
        DYUtils.bindEvent(player, "canplay", function () {
            trigger("canplay");
        });

        // 当播放结束时
        DYUtils.bindEvent(player, "ended", function () {
            trigger("ended");
            next();
        });

        // 当音频播放暂停时
        DYUtils.bindEvent(player, "pause", function () {
            trigger("pause");
        });

        // 当音频播放进行时
        DYUtils.bindEvent(player, "play", function () {
            trigger("play");
        });

        // 当音频数据不可用时
        DYUtils.bindEvent(player, "stalled", function () {
            trigger("stalled");
            next();
        });

        // 当音频播放位置变化时
        DYUtils.bindEvent(player, "timeupdate", function () {
            trigger("timeupdate");
        });

        // 当音频音量变化时
        DYUtils.bindEvent(player, "volumechange", function () {
            trigger("volumechange");
        });

        // 当音频长度变化时
        DYUtils.bindEvent(player, "durationchange", function () {
            trigger("durationchange");
        });

        // 初始化必要参数
        init();

        return {
            isPaused: isPaused,
            setSongList: setSongList,
            addSongs: addSongs,
            play: play,
            pause: pause,
            next: next,
            prev: prev,
            volPlus: volPlus,
            volSub: volSub,
            mute: mute,
            listener: listener
        }

    }

    if (!window.SimpleMusicPlayer) window.SimpleMusicPlayer = SimpleMusicPlayer;

    return SimpleMusicPlayer;
});