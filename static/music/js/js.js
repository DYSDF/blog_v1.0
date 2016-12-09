// JavaScript Document
// 界面滚动文字
require(["ScrollText"], function (ScrollText) {
    [].forEach.call(document.getElementsByClassName("scroll_text"), function (el) {
        ScrollText(el);
    }.bind(this))
});

// 内容面板自适应
(function () {
    function setContentHeight() {
        document.getElementById("content").style.height = document.documentElement.offsetHeight - 50 + "px";
    }

    window.addEventListener("resize", setContentHeight);
    setContentHeight();
})();

// 控制面板显示控制
require(["DYUtils"], function (DYUtils) {
    var target = document.getElementById("content"),
        maxHeight = document.documentElement.offsetHeight - 50,
        minHeight = maxHeight - 60,
        isDraging,
        isValid,
        startPosition,
        stepX,
        stepY,
        curPanelHeight;

    function setControlPanelHeight(offsetY) {
        var targetHeight = curPanelHeight + offsetY;
        targetHeight = targetHeight > maxHeight ? maxHeight : (targetHeight < minHeight ? minHeight : targetHeight);
        target.style.height = targetHeight + "px";
    }

    function resetControlPanelHeight() {
        curPanelHeight = target.offsetHeight;
        if (maxHeight + minHeight > curPanelHeight * 2) {
            setControlPanelHeight(minHeight - curPanelHeight - 1);
        } else {
            setControlPanelHeight(maxHeight - target.offsetHeight + 1);
        }
    }

    DYUtils.bindEvent(document, "mousedown", function (e) {
        isDraging = true;
        e = e || window.event;
        startPosition = {
            x: e.clientX,
            y: e.clientY
        };
        curPanelHeight = target.offsetHeight;
    });
    DYUtils.bindEvent(document, "mousemove", function (e) {
        if (!isDraging) return;
        e = e || window.event;
        if (isValid) {
            target.style.transition = "height 0ms ease-in-out";
            setControlPanelHeight((e.clientY - startPosition.y) / 2);
        } else {
            stepX = e.clientX - startPosition.x;
            stepY = e.clientY - startPosition.y;
            if (Math.abs(stepX) < 10 && Math.abs(stepY) < 10) return;
            Math.abs(stepX) > Math.abs(stepY) ? (isValid = false) : (isValid = true);
        }
    });
    DYUtils.bindEvent(document, "mouseup", function (e) {
        isValid = false;
        isDraging = false;
        target.style.transition = "";
        resetControlPanelHeight();
    })
});

// 歌曲列表面板显示控制
require(["DYUtils"], function (DYUtils) {
    var songPanel = document.getElementById("songPanel"),
        songPanelBtn = document.getElementById("listopen"),
        maxOffsetX = 1,
        minOffsetX = 0,
        regexp = /matrix\(((\d+\.?\d*),\s){5}\d+\.?\d*\)/,
        isDraging,
        isValid,
        startPosition,
        stepX,
        stepY,
        curTransform;

    function isPanelOpen() {
        return DYUtils.hasClassName(songPanel, "open");
    }

    function setSongPanelTransform(offsetX) {
        var targetOffsetX = (curTransform + offsetX) / songPanel.offsetWidth;
        targetOffsetX = targetOffsetX > maxOffsetX ? maxOffsetX : (targetOffsetX < minOffsetX ? minOffsetX : targetOffsetX);
        songPanel.style.transform = "translate3d(" + targetOffsetX * 100 + "%, 0, 0)";
    }

    function showSongPanel() {
        if (!isPanelOpen()) {
            DYUtils.addClassName(songPanel, "open");
            DYUtils.addClassName(songPanelBtn, "openlist");

            DYUtils.removeEvent(document, "mouseup", hideSongPanel);
            DYUtils.oneEvent(document, "mouseup", hideSongPanel);
        }
    }

    function hideSongPanel() {
        if (isPanelOpen()) {
            DYUtils.removeClassName(songPanel, "open");
            DYUtils.removeClassName(songPanelBtn, "openlist");
        }

    }

    function toggleSongPanel() {
        if (isPanelOpen()) {
            hideSongPanel();
        } else {
            showSongPanel();
        }
    }

    function resetSongPanel() {
        if (Number(DYUtils.getCssValue(songPanel, "transform").match(regexp)[2]) / songPanel.offsetWidth > 0.5) {
            hideSongPanel();
        } else {
            showSongPanel();
        }
        songPanel.style.transform = "";
    }

    DYUtils.bindEvent(document, "mousedown", function (e) {
        isDraging = true;
        e = e || window.event;
        startPosition = {
            x: e.clientX,
            y: e.clientY
        };
        curTransform = Number(DYUtils.getCssValue(songPanel, "transform").match(regexp)[2]);
        hideSongPanel();
    });
    DYUtils.bindEvent(document, "mousemove", function (e) {
        if (!isDraging) return;
        e = e || window.event;
        if (isValid) {
            songPanel.style.transition = "all 0ms linear";
            setSongPanelTransform((e.clientX - startPosition.x) / 2);
        } else {
            stepX = e.clientX - startPosition.x;
            stepY = e.clientY - startPosition.y;
            if (Math.abs(stepX) < 10 && Math.abs(stepY) < 10) return;
            Math.abs(stepX) < Math.abs(stepY) ? (isValid = false) : (isValid = true);
        }
    });
    DYUtils.bindEvent(document, "mouseup", function (e) {
        if (isValid) {
            isValid = false;
            resetSongPanel();
        }
        songPanel.style.transition = "";
        isDraging = false;
    });
    DYUtils.bindEvent(songPanelBtn, "mousedown", function (e) {
        e.stopPropagation();
    });
    DYUtils.bindEvent(songPanelBtn, "mouseup", function (e) {
        e.stopPropagation();
        toggleSongPanel();
    });
    DYUtils.bindEvent(songPanel, "mousedown", function (e) {
        e.stopPropagation();
    })
});

// 音乐播放控制
require(["DYUtils"], function (DYUtils) {
    var musicPlayer = document.createElement("audio"),
        songList = [];

    function init() {
        // 加载预设及历史设置
        for (var i in this._config) {
            if (i == "muted") {
                this._player.muted = $.cookie(i) ? eval($.cookie(i)) : this._config.i;
            } else if (i == "volume") {
                this._player.volume = $.cookie(i) ? eval($.cookie(i)) : this._config.i;
            } else {

            }
        }

        var self = this;
        $(this._player).on("ended", function () {
            self.next();
        });

        if (songlist == undefined) return;
        this._songList = songlist;
        if (!this.loadDate()) {
            if ($.cookie("autoplay") ? eval($.cookie(autoplay)) : this._config["autoplay"]) {
                this.play();
            }
        }
    }
});

$(function () {
    //自定义音乐播放器
    var dymusic = {
        _player: document.createElement("audio"),
        _songList: [],
        _playlistId: 0,
        _curSong: 0,
        _history: [],
        _config: {"autoplay": false, "loop": "repeat", "muted": false, "volume": 0.5},// 默认设置
        init: function (songlist) {
            // 加载预设及历史设置
            for (var i in this._config) {
                if (i == "muted") {
                    this._player.muted = $.cookie(i) ? eval($.cookie(i)) : this._config.i;
                } else if (i == "volume") {
                    this._player.volume = $.cookie(i) ? eval($.cookie(i)) : this._config.i;
                } else {

                }
            }

            var self = this;
            $(this._player).on("ended", function () {
                self.next();
            });

            if (songlist == undefined) return;
            this._songList = songlist;
            if (!this.loadDate()) {
                if ($.cookie("autoplay") ? eval($.cookie(autoplay)) : this._config["autoplay"]) {
                    this.play();
                }
            }

        },
        setConfig: function (name, val) {
            this._config[name] = val;
            $.cookie(name, val, {expires: 365});
        },
        loadDate: function () {
            if (this._songList.length > 0) {
                this._player.src = this._songList[this._playlistId].songs[this._curSong].mp3Url;
                return true;
            } else {

            }
        },
        play: function () {
            if (this._player.paused) {
                this._player.autoplay = true;
                this.setConfig("autoplay", true);
                this._player.play();
            } else {
                this._player.autoplay = false;
                this.setConfig("autoplay", false);
                this._player.pause();
            }
        },
        next: function () {
            if (this._songList.length == 0) return false;
            this._history.push(this._curSong);
            this._curSong += 1;
            if (this._songList[this._playlistId].songs.length < this._curSong) this._curSong = 0;
            this.loadDate();
        },
        prev: function () {
            if (this._songList.length == 0 || this._history.length == 0) return false;
            this._curSong = this._history.pop();
            this.loadDate();
        },
        jump: function (x) {
            if (this._songList.length == 0) return false;
            if (x < 0 || x > this._songList[this._playlistId].songs.length) return false;
            this._history.push(this._curSong);
            this._curSong = x * 1;
            this.loadDate();
        },
        volPlus: function () {
            try {
                this._player.volume = Math.round(this._player.volume * 100) / 100 + 0.02;
            } catch (e) {

            }
            this._player.muted = false;
            this.setConfig("volume", Math.round(this._player.volume * 100) / 100);
        },
        volSub: function () {
            try {
                this._player.volume = Math.round(this._player.volume * 100) / 100 - 0.02;
            } catch (e) {

            }
            this._player.muted = false;
            this.setConfig("volume", Math.round(this._player.volume * 100) / 100);
        },
        mute: function () {
            this._player.muted = this._player.muted ? false : true;
            this.setConfig("muted", this._player.muted);
        }
    };

    // 绑定界面控制按钮
    $("#control_next").on("click", function () {
        dymusic.next();
    });
    $("#control_prev").on("click", function () {
        dymusic.prev();
    });
    $("#control_play").on("click", function () {
        dymusic.play();
    });
    $("#control_vol").on("click", function () {
        dymusic.mute();
    }).on("mousewheel DOMMouseScroll", function (e) {
        var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
        if (delta > 0) {
            //向上滚动
            dymusic.volPlus();
        } else {
            dymusic.volSub();
        }
    });

    // 界面数据展示
    // 播放时间改变时
    $(dymusic._player).on("timeupdate", function () {
        var curT = dymusic._player.currentTime,
            toT = dymusic._player.duration;
        $("#durCurTime").text(function () {
            return [parseInt(curT / 60), Math.round(curT % 60)].join(":").replace(/\b(\d)\b/g, "0$1");
        });
        $("#durprogress .progress").css("width", function () {
            return curT / toT * 100 + "%";
        });

        showLrc(curT);
    });
    // 播放文件准备就绪时
    $(dymusic._player).on("canplay", function () {
        var title = dymusic._songList[dymusic._playlistId].songs[dymusic._curSong].name,
            artists = dymusic._songList[dymusic._playlistId].songs[dymusic._curSong].artists,
            album = dymusic._songList[dymusic._playlistId].songs[dymusic._curSong].album.name,
            tolTime = dymusic._player.duration;

        $("#music_name").text("《" + title + "》");
        $("#music_ablum span").text(album);
        $("#music_art span").text(function () {
            var text = [];
            for (var i in artists) {
                text.push(artists[i].name);
            }
            return text.join("/");
        });

        $("#durprogress .progress").css("width", 0);
        $("#durCurTime").text("00:00");
        $("#durTolTime").text(formatTime(tolTime));

        $("#songlist ol li").each(function () {
            $(this).removeClass("cursong");
        }).eq(dymusic._curSong).addClass("cursong");

        $("#control_ablum").css("background-image", "url(" + dymusic._songList[dymusic._playlistId].songs[dymusic._curSong].album.picUrl + ")");
        $("#blur_img").css("background-image", "url(" + dymusic._songList[dymusic._playlistId].songs[dymusic._curSong].album.blurPicUrl + ")");

        highLight();

        getLyric();
    });
    // 播放器音量改变时
    $(dymusic._player).on("volumechange", function () {
        var vol = dymusic._player.volume;
        if (dymusic._player.muted || vol == 0) {
            $("#control_vol").addClass("muted").attr("data-vol", Math.round(vol * 100));
        } else {
            $("#control_vol").removeClass("muted").attr("data-vol", Math.round(vol * 100));
        }
    });
    // 播放器播放时
    $(dymusic._player).on("play", function () {
        $("#control_ablum").removeClass("rotate_stop");
        $("#control_play").addClass("control_pause");
    });
    // 播放器暂停时
    $(dymusic._player).on("pause", function () {
        $("#control_ablum").addClass("rotate_stop");
        $("#control_play").removeClass("control_pause");
    });


    // 获取歌词
    function getLyric() {
        var playlistId = dymusic._playlistId,
            songId = dymusic._curSong,
            playlist = dymusic._songList,
            id = playlist[playlistId].songs[songId].id;
        $.ajax({
            url: "/music/getLyric",
            method: "POST",
            data: {"songId": id},
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"));
            },
            success: function (data) {
                parseLyric(data);
            },
            error: function () {

            }
        })
    }

    // 歌词解析器
    function parseLyric(lrc) {
        try {
            var lyrics = lrc.split("\n");
            var lrcObj = {};
            for (var i = 0; i < lyrics.length; i++) {
                var lyric = decodeURIComponent(lyrics[i]);
                var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
                var timeRegExpArr = lyric.match(timeReg);
                if (!timeRegExpArr) continue;
                var clause = lyric.replace(timeReg, "");
                if (clause == "" || clause == undefined) continue; // 去除空白行
                for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
                    var t = timeRegExpArr[k];
                    var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                        sec = Number(String(t.match(/\:\d*/i)).slice(1));
                    var time = min * 60 + sec;
                    lrcObj[time] = clause;
                }
            }
        } catch (e) {
            var lrcObj = {0: "暂无歌词"};
        }
        renderLyric(lrcObj);
    }

    // 歌词渲染展示
    function renderLyric(lrcObj) {
        var lrcEl = $("<ul></ul>"),
            stepOffset,
            m = 0,
            n = 0;
        for (var i in lrcObj) {
            var li = $("<li id=" + i + ">" + lrcObj[i] + "</li>");
            lrcEl.append(li);
            m++;
        }
        lrcEl.children("li:first").addClass("on");
        $("#songlrc").html(lrcEl);

        stepOffset = $("#songlrc ul").get(0).offsetHeight / m;

        lrcObj["parsed"] = {};
        for (var i in lrcObj) {
            lrcObj["parsed"][i] = n * stepOffset;
            n++;
            if (n == m) break;
        }
        dymusic._lrcEl = lrcEl;
        dymusic._lyric = lrcObj;
    }

    // 歌词滚动
    function showLrc(time) {
        try {
            var time = parseInt(time),
                top = dymusic._lyric.parsed[time];
            if (top) {
                dymusic._lrcEl.css("margin-top", -top);
                $("#songlrc ul").children("#" + time).prev("li").removeClass("on");
                $("#songlrc ul").children("#" + time).addClass("on");
            }
        } catch (e) {

        }

    }


    // 歌曲跳转
    function jumpSong() {
        var pId = $(this).attr("data-pId"),
            songId = $(this).attr("id");
        dymusic._playlistId = parseInt(pId);
        dymusic.jump(parseInt(songId));
    }

    // 高亮列表已播放歌单及歌曲
    function highLight() {
        // 歌单高亮
        $("#playlist ol li").each(function () {
            $(this).removeClass("cur");
        }).eq(dymusic._playlistId).addClass("cur");

        // 列表高亮
        $("#songlist ol li").each(function () {
            $(this).removeClass("cur");
        });
        $("#" + dymusic._curSong + "[data-pId=" + dymusic._playlistId + "]").addClass("cur");
    }

    // 生成歌曲列表
    function makeSonglist(pId, data) {
        $("#songlist ol").empty();

        // 返回按钮
        var back = $("<div id='back'>返回上一层</div>");
        back.unbind("click").on("click", function (e) {
            e.stopPropagation();
            $("#songContainer").animate({"margin-left": "0"}, 600, "linear");
        });
        $("#songlist ol").append(back);

        for (var i in data) {
            var li = $("<li id=\"" + i + "\" data-pId=\"" + pId + "\"><div class=\"musicName\">" + data[i].name + "</div><div class=\"musicTime\">" + formatTime(data[i].duration / 1000) + "</div></li>");
            li.on("click", jumpSong);
            $("#songlist ol").append(li);
        }

        highLight();
    }

    // 歌单点击跳转
    function changePanel(e) {
        var pId = $(this).attr("data-id");
        if (dymusic._songList[pId].songs == undefined) {
            $.ajax({
                url: "/music/toplist",
                method: "POST",
                data: {
                    "playlistId": pId,
                    "timestamp": new Date().getTime()
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"));
                },
                success: function (data) {
                    dymusic._songList[pId].songs = data;
                    makeSonglist(pId, data);

                    window.localStorage.setItem("playlist", JSON.stringify(dymusic._songList));
                    window.localStorage.setItem("playlistUpdateTime", new Date().getDate());

                    $("#songContainer").animate({"margin-left": "-300px"}, 600, "linear");
                },
                error: function () {
                    alert("获取歌曲列表失败")
                }
            })
        } else {
            makeSonglist(pId, dymusic._songList[pId].songs);
            $("#songContainer").animate({"margin-left": "-300px"}, 600, "linear");
        }
    }

    // 歌单生成
    function makePlaylist(data) {
        $("#songPanel").on("mouseup click", function (e) {
            e.stopPropagation();
            return false;
        });

        $("#playlist ol").empty();

        for (var i in data) {
            var li = $("<li data-id=\"" + data[i].id + "\"><div class=\"playlistName\">《" + data[i].name + "》</div></li>");
            li.on("click", changePanel);
            $("#playlist ol").append(li);
        }
    }

    // 请求数据
    var localPlaylist = window.localStorage.getItem("playlist"),
        updateTime = window.localStorage.getItem("playlistUpdateTime"),
        nowTime = new Date().getDate();
    if (localPlaylist == null || updateTime < nowTime) {
        $.ajax({
            url: "/music/playlist",
            method: "POST",
            data: {"timestamp": new Date().getTime()},
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"));
            },
            success: function (data) {
                dymusic._songList = data;
                makePlaylist(data);
                window.localStorage.setItem("playlist", JSON.stringify(data));
                window.localStorage.setItem("playlistUpdateTime", nowTime);
            },
            error: function () {
                alert("获取歌单列表失败");
            }
        });
    } else {
        dymusic._songList = JSON.parse(localPlaylist);
        makePlaylist(JSON.parse(localPlaylist));
    }
    dymusic.init();
});

// 歌曲时间格式化
function formatTime(t) {
    return [parseInt(t / 60), Math.round(t % 60)].join(":").replace(/\b(\d)\b/g, "0$1")
}

//获取范围随机整数
function getRandom(a, b) {
    var index = Math.min(a, b);  //获取范围偏移
    var rang = Math.max(a, b) - Math.min(a, b);  //获取范围区间
    return Math.floor(Math.random() * (rang + 1)) + index;
}

//阻止事件冒泡
function stopBubble(e) {
    if (e && e.stopPropagation) {
        //非IE浏览器
        e.stopPropagation();
    } else {
        //IE浏览器
        window.event.cancelBubble = true;
    }
}

//登录处理
$(function () {
    var loginli = document.getElementsByClassName("userlogin");
    var logoutli = document.getElementsByClassName("userlogout");
    var regli = document.getElementsByClassName("userjoin");
    for (i = 0; i < loginli.length; i++) {
        if (window.addEventListener) {
            loginli[i].addEventListener("click", login, false);
        } else {
            loginli[i].attachEvent("onclick", login);
        }
    }
    for (var i = 0; i < logoutli.length; i++) {
        if (window.addEventListener) {
            logoutli[i].addEventListener("click", logout, false);
        } else {
            logoutli[i].attachEvent("onclick", logout);
        }
    }
    for (i = 0; i < regli.length; i++) {
        if (window.addEventListener) {
            regli[i].addEventListener("click", join, false);
        } else {
            regli[i].attachEvent("onclick", join);
        }
    }

    function login(e) {
        $.ajax({
            type: 'GET',
            url: '/accounts/login/',
            success: function (data) {
                var html = new DOMParser().parseFromString(data, "text/html"),
                    box = $(html).find(".user_mask").get(0);
                $(box).find(".user_box").get(0).onclick = stopBubble;
                var fli = $(box).find(".form");
                for (i = 0; i < fli.length; i++) {
                    fli[i].onsubmit = function (e) {
                        var func = function (data) {
                            var msg = eval("(" + data + ")");
                            if (msg.error) {
                                $(box).find("msg").eq(0).html(msg.error);
                                if (msg.info) {
                                    for (var i in msg.info) {
                                        e.target[i].style.backgroundColor = "#FFBFBF";
                                    }
                                }
                            } else if (msg.success) {
                                $(box).find("msg").eq(0).html(msg.success);
                                setTimeout("window.location.reload(true)", 3000);
                            } else {
                                $(box).find("msg").eq(0).html("注册失败，请重试");
                                setTimeout("window.location.reload(true)", 3000);
                            }
                        };
                        formpost(func);
                        return false;
                    };
                }
                $(box).click(function () {
                    document.body.removeChild(this)
                });
                document.body.appendChild(box);
            }
        });
    }

    function logout(e) {
        $.ajax({
            type: 'GET',
            url: '/accounts/logout/',
            success: function () {
                alert("注销成功！");
                window.location.reload(true);
            }
        });
    }

    function join(e) {
        $.ajax({
            type: 'GET',
            url: '/accounts/join/',
            success: function (res) {
                var html = new DOMParser().parseFromString(res.responseText, "text/html"),
                    box = html.body.getElementsByClassName("user_mask")[0];
                box.getElementsByClassName("user_box")[0].onclick = stopBubble;
                box.getElementsByClassName("login_box")[0].style.float = "right";
                var fli = box.getElementsByTagName("form");
                for (var i = 0; i < fli.length; i++) {
                    fli[i].onsubmit = function (e) {
                        var func = function (res) {
                            var msg = eval("(" + res.responseText + ")");
                            if (msg.error) {
                                box.getElementsByTagName("msg")[0].innerHTML = msg.error;
                                if (msg.info) {
                                    for (var i in msg.info) {
                                        e.target[i].style.backgroundColor = "#FFBFBF";
                                    }
                                }
                            } else if (msg.success) {
                                box.getElementsByTagName("msg")[0].innerHTML = msg.success;
                                setTimeout("window.location.reload(true)", 3000);
                            } else {
                                box.getElementsByTagName("msg")[0].innerHTML = "注册失败，请重试";
                                setTimeout("window.location.reload(true)", 3000);
                            }
                        };
                        formpost(func);
                    };
                }
                box.onclick = function () {
                    document.body.removeChild(this)
                };
                document.body.appendChild(box);
            }
        });
    }

    function formpost(func) {
        var e = arguments.callee.caller.arguments[0] ? arguments.callee.caller.arguments[0] : window.event;
        e.preventDefault();
        var form = e.target;
        var data = new FormData(form);
        $.ajax({
            url: form.action,
            type: (form.method ? form.method : "GET"),
            data: data,
            success: func
        });
    }
});
