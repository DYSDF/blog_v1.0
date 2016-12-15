/**
 * Created by 断崖 on 2016/12/14.
 */

define(["DYUtils", "Tween"], function (DYUtils, Tween) {
    function getRandom(index, rang) {
        return Math.floor(Math.random() * rang) + (index - rang / 2);
    }

    function image2canvas(imgEl) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.width = imgEl.width;
        canvas.height = imgEl.height;
        context.drawImage(imgEl, 0, 0, imgEl.width, imgEl.height);

        return canvas;
    }

    function pictureRandomPoint(imgEl, countX, countY) {
        var imgWidth = imgEl.width;
        var imgHeight = imgEl.height;
        var pointArray = [];
        var stepX = imgWidth / countX;
        var stepY = imgHeight / countY;

        for (var i = 0; i <= countX; i++) {
            pointArray[i] = [];
            for (var j = 0; j <= countY; j++) {
                pointArray[i].push({
                    x: i * stepX,
                    y: j * stepY
                });
            }
        }

        pointArray.forEach(function (xArray, xIndex) {
            xArray.forEach(function (point, yIndex) {
                var x = getRandom(point.x, stepX);
                var y = getRandom(point.y, stepY);
                if (xIndex > 0 && xIndex < countX) point.x = x;
                if (yIndex > 0 && yIndex < countY) point.y = y;
            })
        });

        return pointArray;
    }

    function pictureRandomCut(imgEl, countX, countY, expand) {
        countX = countX || 1;
        countY = countY || 1;
        expand = expand || 1;

        var imgDataArray = [];
        var pointArray = pictureRandomPoint(imgEl, countX, countY);
        var imgContext = image2canvas(imgEl).getContext("2d");

        var tmpCanvas = document.createElement("canvas");
        var tmpContext = tmpCanvas.getContext("2d");
        for (var i = 0; i < pointArray.length - 1; i++) {
            imgDataArray[i] = [];
            for (var j = 0; j < pointArray[i].length - 1; j++) {
                var minX = Math.min(pointArray[i][j].x, pointArray[i][j + 1].x, pointArray[i + 1][j].x, pointArray[i + 1][j + 1].x);
                var minY = Math.min(pointArray[i][j].y, pointArray[i][j + 1].y, pointArray[i + 1][j].y, pointArray[i + 1][j + 1].y);
                var maxX = Math.max(pointArray[i][j].x, pointArray[i][j + 1].x, pointArray[i + 1][j].x, pointArray[i + 1][j + 1].x);
                var maxY = Math.max(pointArray[i][j].y, pointArray[i][j + 1].y, pointArray[i + 1][j].y, pointArray[i + 1][j + 1].y);

                tmpCanvas.width = maxX - minX + 2 * expand;
                tmpCanvas.height = maxY - minY + 2 * expand;

                tmpContext.save();
                tmpContext.fillStyle = "black";
                tmpContext.strokeStyle = "black";
                tmpContext.lineWidth = 1 + expand;
                tmpContext.lineCap = "round";
                tmpContext.lineJoin = "round";
                tmpContext.translate(expand - minX, expand - minY);
                tmpContext.beginPath();
                tmpContext.moveTo(pointArray[i][j].x, pointArray[i][j].y);
                tmpContext.lineTo(pointArray[i + 1][j].x, pointArray[i + 1][j].y);
                tmpContext.lineTo(pointArray[i + 1][j + 1].x, pointArray[i + 1][j + 1].y);
                tmpContext.lineTo(pointArray[i][j + 1].x, pointArray[i][j + 1].y);
                tmpContext.closePath();
                tmpContext.stroke();
                tmpContext.fill();
                tmpContext.restore();

                var imgData = imgContext.getImageData(minX - expand, minY - expand, maxX - minX + 2 * expand, maxY - minY + 2 * expand);
                var tmpCa = document.createElement("canvas");
                var tmpCo = tmpCa.getContext("2d");
                tmpCa.width = maxX - minX + 2 * expand;
                tmpCa.height = maxY - minY + 2 * expand;
                tmpCo.putImageData(imgData, 0, 0);
                var img = new Image();
                img.src = tmpCa.toDataURL();
                tmpContext.globalCompositeOperation = "source-in";
                tmpContext.save();
                tmpContext.translate(-expand, -expand);
                tmpContext.drawImage(img, 0, 0);
                tmpContext.restore();

                imgDataArray[i][j] = {
                    sX: getRandom(minX - expand, window.screen.availWidth * 2),
                    sY: getRandom(minY - expand, window.screen.availHeight * 2),
                    eX: minX,
                    eY: minY,
                    imgData: tmpCanvas.toDataURL()
                };
            }
        }
        return imgDataArray;
    }

    var createFullScreenCanvas = (function () {
        var canvas;
        return function (el) {
            if (!canvas) {
                canvas = document.createElement("canvas");
                canvas.width = window.screen.availWidth;
                canvas.style.width = window.screen.availWidth + "px";
                canvas.height = window.screen.availHeight;
                canvas.style.height = window.screen.availHeight + "px";
                canvas.style.position = "fixed";
                canvas.style.top = "0";
                canvas.style.left = "0";
                canvas.style.zIndex = DYUtils.getCssValue(el, "z-index");
                el.parentElement.appendChild(canvas);
            }
            return canvas;
        }
    })();

    function PictureBurst(el, opts) {
        if (Object.prototype.toString.call(el) !== "[object HTMLImageElement]") throw "非 img 元素";

        opts = opts || {};

        var onEndFn = opts.onEnd || function () {
            };

        var isEnd = false,
            canvas = createFullScreenCanvas(el),
            context = canvas.getContext("2d"),

            imgDataArray = pictureRandomCut(el, opts["countX"], opts["countY"], opts["expand"]),

            offsetTop = el.getBoundingClientRect().top,
            offsetLeft = el.getBoundingClientRect().left,
            offsetWidth = el.getBoundingClientRect().width / 2,
            offsetHeight = el.getBoundingClientRect().height / 2,
            centerX = offsetLeft + offsetWidth,
            centerY = offsetTop + offsetHeight;

        var rotate = opts["rotate"] != undefined ? opts["rotate"] : Math.PI;
        var startTime;
        var totalTime;

        function burstRender() {
            var curTime = Date.now() - startTime;
            if (curTime >= totalTime) {
                curTime = totalTime;
                isEnd = true;
                setTimeout(function () {
                    canvas.style.display = "none";
                    onEndFn();
                }, 0);
            }

            // 清空画布
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.save();
            context.translate(centerX, centerY);
            context.rotate(Tween.Sine.easeIn(curTime, 0, rotate, totalTime));

            // 画小球
            context.save();
            context.translate(-offsetWidth, -offsetHeight);
            imgDataArray.forEach(function (xArray) {
                xArray.forEach(function (imgData) {
                    var imgObj = document.createElement("img");
                    imgObj.src = imgData.imgData;
                    context.drawImage(
                        imgObj,
                        Tween.Sine.easeIn(curTime, imgData.eX, imgData.sX - imgData.eX, totalTime),
                        Tween.Sine.easeIn(curTime, imgData.eY, imgData.sY - imgData.eY, totalTime)
                    );
                })
            });
            context.restore();
            context.restore();

            if (!isEnd) {
                DYUtils.fastAnimation(arguments.callee);
            }
        }

        function gatherRender() {
            var curTime = Date.now() - startTime;
            if (curTime >= totalTime) {
                curTime = totalTime;
                isEnd = true;
                setTimeout(function () {
                    canvas.style.display = "none";
                    onEndFn();
                }, 0);
            }

            // 清空画布
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.save();
            context.translate(centerX, centerY);
            context.rotate(Tween.Cubic.easeOut(curTime, rotate, 0 - rotate, totalTime));

            context.save();
            context.translate(-offsetWidth, -offsetHeight);
            imgDataArray.forEach(function (xArray) {
                xArray.forEach(function (imgData) {
                    var imgObj = document.createElement("img");
                    imgObj.src = imgData.imgData;
                    context.drawImage(
                        imgObj,
                        Tween.Cubic.easeOut(curTime, imgData.sX, imgData.eX - imgData.sX, totalTime),
                        Tween.Cubic.easeOut(curTime, imgData.sY, imgData.eY - imgData.sY, totalTime)
                    );
                })
            });
            context.restore();
            context.restore();

            if (!isEnd) {
                DYUtils.fastAnimation(arguments.callee);
            }
        }

        function burst(durTime) {
            canvas.style.display = "";
            isEnd = false;
            startTime = Date.now();
            totalTime = durTime || 800;
            burstRender();
        }

        function gather(durTime) {
            canvas.style.display = "";
            isEnd = false;
            startTime = Date.now();
            totalTime = durTime || 800;
            gatherRender();
        }

        return {
            burst: burst,
            gather: gather
        }
    }

    if (!window.PictureBurst) window.PictureBurst = PictureBurst;
    return PictureBurst;
});