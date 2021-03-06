function Swipe(o) {
    var container = o.container;
    var param = {
        startX: 0,
        endX: 0,
        startY: 0,
        endY: 0,
        disX: 0,
        disY: 0,
        direction: '',
        startTime: 0,
        endTime: 0,
        distance: 0,
        getAngle: function (x, y) {     // 旋转角度，x，y是圆心坐标~
            x = x || 0;
            y = y || 0;
            var startDx = this.startX - x;
            var startDy = y - this.startY;
            var dx = this.endX - x;
            var dy = y - this.endY;
            return getangle(dx, dy) - getangle(startDx, startDy);
        }
    };

    container.addEventListener('touchstart', touchStart, false);

    function touchStart(e) {
        var touch = e.touches[0];
        param.disX = 0;
        param.disY = 0;
        param.endX = 0;
        param.endY = 0;
        param.direction = '';
        param.startX = touch.pageX;
        param.startY = touch.pageY;
        param.startTime = e.timeStamp;
        param.endTime = 0;
        param.distance = 0;

        if (o.start) o.start.call(container, param);

        container.addEventListener('touchmove', touchMove, false);
        container.addEventListener('touchend', touchEnd, false);
    }

    function touchMove(e) {
        var touch = e.changedTouches[0];
        var angle;

        param.endX = touch.pageX;
        param.endY = touch.pageY;
        param.disX = param.endX - param.startX;
        param.disY = param.startY - param.endY;
        angle = getangle(param.disX, param.disY);
        param.direction = getDirection(angle);
        param.distance = Math.sqrt(param.disX * param.disX + param.disY * param.disY);

        if (o.move) o.move.call(container, param, e);
    }

    function touchEnd(e) {
        param.endTime = e.timeStamp;
        if (o.end) o.end.call(container, param, e);

        container.removeEventListener('touchmove', touchMove, false);
        container.removeEventListener('touchend', touchEnd, false);
    }
}

function getDirection(angle) {
    var direction;
    if (angle < 45 && angle > -45) {
        direction = 'right';
    } else if (angle > 45 && angle < 135) {
        direction = 'up';
    } else if (angle > 135 || angle < -135) {
        direction = 'left';
    } else if (angle < -45 && angle > -135) {
        direction = 'down';
    }
    return direction;
}

function getangle(dx, dy) {
    return Math.atan2(dy, dx) * 180 / Math.PI;
}

!function (e, n) {
    "function" == typeof define && (define.amd || define.cmd) ? define(function () {
        return n(e)
    }) : n(e, !0)
}(window, function (e, n) {
    /*
     *   obj传参说明
     *
     *   obj.autoMs 自动播放时间 毫秒 不传默认2000；
     *   obj.autoPlay 布尔值 true为自动播放 false不自动播放
     *   obj.iHeight number型 容器高度 不设置的情况下，根据CSS情况默认
     *   obj.iWidth number型 容器宽度 不设置的情况下，根据CSS情况默认
     *   obj.container DOM对象 存放各个item的容器
     *   obj.item DOM对象 容器下得各个item 是个类数组对象
     *   obj.isVertical 布尔值 决定播放方向是横向还是纵向
     *
     * */
    function Slider(obj) {
        if (!obj) obj = {};
        var that = obj.ele;
        var container = that.children[0];
        var item = container.children;
        var len = item.length;
        var iNow = 0;
        var iw = obj.w || obj.ele.offsetWidth;
        var ih = obj.h || item[0].offsetHeight;
        var i, timer;
        var isVertical = obj.isVertical;
        var loop = typeof obj.loop === 'undefined' ? true : obj.loop;

        initPosition();

        var flag = false;
        Swipe({
            container: container,
            start: function (o, e) {
                clearInterval(timer);
                readyMove();
                obj.start && obj.start(o, e);
            },
            move: function (o, e) {
                if (!flag && (isVertical || o.direction === 'left' || o.direction === 'right')) {
                    disabledY = 1;
                }
                flag = true;

                if (disabledY !== 0) {
                    obj.move && obj.move(o, e);
                    setPosition(o);
                }
            },
            end: function (o, e) {
                disabledY = 0;
                flag = false;
                endMove(o, e);
            }
        });

        function readyMove() {
            container.style.transition = 'all 0s ease-in-out';
            if (iNow == len) {
                iNow = 0;
                !isVertical ? item[0].style.left = '0px' : item[0].style.top = '0px';
                sport();
            } else if (iNow == -1) {
                iNow = len - 1;
                !isVertical ? item[len - 1].style.left = (len - 1) * iw + 'px' : item[len - 1].style.top = (len - 1) * ih + 'px';
                sport();
            }
        }

        function sport() {
            if (isVertical) {
                container.style.transform = 'translateY(' + -iNow * ih + 'px) translateZ(0)';
                container.style.webkitTransform = 'translateY(' + -iNow * ih + 'px) translateZ(0)';
            } else {
                container.style.transform = 'translateX(' + -iNow * iw + 'px) translateZ(0)';
                container.style.webkitTransform = 'translateX(' + -iNow * iw + 'px) translateZ(0)';
            }

            obj.end && obj.end(iNow);
        }

        function setPosition(o) {
            if (loop) {
                if (iNow == 0 && o.direction == 'right' && !isVertical) {
                    item[len - 1].style.left = '-' + iw + 'px';
                } else if (iNow == 0 && o.direction == 'left' && !isVertical) {
                    item[len - 1].style.left = (len - 1) * iw + 'px';
                } else if (iNow == len - 1 && o.direction == 'left' && !isVertical) {
                    item[0].style.left = len * iw + 'px';
                } else if (iNow == len - 1 && o.direction == 'right' && !isVertical) {
                    item[0].style.left = '0';
                } else if (iNow == 0 && o.direction == 'down' && isVertical) {
                    item[len - 1].style.top = '-' + ih + 'px';
                } else if (iNow == 0 && o.direction == 'up' && isVertical) {
                    item[len - 1].style.top = (len - 1) * ih + 'px';
                } else if (iNow == len - 1 && o.direction == 'up' && isVertical) {
                    item[0].style.top = len * ih + 'px';
                } else if (iNow == len - 1 && o.direction == 'down' && isVertical) {
                    item[0].style.top = '0';
                }
            }

            if (isVertical) {
                var baseY = -iNow * ih;
                container.style.transform = 'translateY(' + (baseY - o.disY) + 'px) translateZ(0)';
                container.style.webkitTransform = 'translateY(' + (baseY - o.disY) + 'px) translateZ(0)';
            } else {
                var baseX = -iNow * iw;
                container.style.transform = 'translateX(' + (baseX + o.disX) + 'px) translateZ(0)';
                container.style.webkitTransform = 'translateX(' + (baseX + o.disX) + 'px) translateZ(0)';
            }
        }

        function endMove(o) {
            var disTime = o.endTime - o.startTime;
            container.style.transition = 'all 0.3s ease-in-out';

            if (!isVertical && o.disX < -20 && (disTime < 500 || o.disX < iw * -.5)) {
                (loop || iNow !== len - 1) && iNow++;
            } else if (!isVertical && o.disX > 20 && (disTime < 500 || o.disX > iw * .5)) {
                (loop || iNow !== 0) && iNow--;
            } else if (isVertical && o.disY > 20 && (disTime < 500 || o.disY > ih * .5)) {
                (loop || iNow !== len - 1) && iNow++;
            } else if (isVertical && o.disY < -20 && (disTime < 500 || o.disY < ih * -.5)) {
                (loop || iNow !== 0) && iNow--;
            }

            sport();
            timer = setTimeout(function () {
                (obj.autoPlay || obj.autoMs) && (timer = autoPlay());
            }, 300)
        }

        function next() {
            initPosition();
            container.style.transition = 'all 0.3s ease-in-out';
            if (iNow == len - 1) {
                iNow = -1;
            }
            iNow++;
            sport();
        }

        function prev() {
            initPosition();
            container.style.transition = 'all 0.3s ease-in-out';
            if (iNow == 0) {
                iNow = len;
            }
            iNow--;
            sport();
        }

        function autoPlay() {
            if (obj.autoMs || obj.autoPlay) {
                obj.autoMs = obj.autoMs || 2000;
                if (obj.autoMs < 1000) {
                    throw Error('auto play time is must greater than 1000');
                }
                readyMove();
                return setInterval(next, obj.autoMs || 2000);
            } else {
                return null;
            }
        }

        function initPosition() {
            that.style.padding = 0;
            that.style.margon = 0;
            that.style.overflow = 'hidden';
            container.style.width = len + '00%';
            container.style.height = ih + 'px';
            container.style.position = 'relative';
            container.style.boxSizing = 'border-box';
            for (i = 0; i < len; i++) {
                if (isVertical) {
                    item[i].style.top = i * ih + 'px';
                } else {
                    item[i].style.left = i * iw + 'px';
                }
                item[i].style.width = 100 / (len) + '%';
                item[i].style.position = 'absolute';
            }
        }

        timer = autoPlay();

        return {
            next: next,
            prev: prev,
            setPosition: function (n) {
                initPosition();
                container.style.transition = 'all 0.3s ease-in-out';
                if (n >= 0 && n <= len - 1) {
                    iNow = n;
                    sport();
                } else {
                    throw TypeError();
                }
            },
            getCurrentIndex: function () {
                return iNow;
            }
        };
    }

    return n && (e.Slider = Slider), Slider;
});

var disabledY = 0;
document.addEventListener('touchmove', function (e) {
    if (disabledY) {
        e.preventDefault();
    }
}, { passive: false });