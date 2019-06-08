(function () {
    function swipe(o) {
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
            getAngle: function (x,y) {     // 旋转角度，x，y是圆心坐标~
                var startDx = this.startX - x;
                var startDy = y - this.startY;
                var dx = this.endX - x;
                var dy = y - this.endY;
                return getangle(dx,dy) - getangle(startDx, startDy);
            }
        };
        var _this = this;

        this.addEventListener('touchstart', touchStart, false);

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

            if (o.start) o.start.call(_this, param);

            _this.addEventListener('touchmove', touchMove, false);
            _this.addEventListener('touchend', touchEnd, false);

            // e.stopPropagation();
            e.preventDefault();
        }

        function touchMove(e) {
            var touch = e.changedTouches[0];
            var angle;
            var r = 50;

            param.endX = touch.pageX;
            param.endY = touch.pageY;
            param.disX = param.endX - param.startX;
            param.disY = param.startY - param.endY;
            angle = getangle(param.disX, param.disY);
            param.direction = getDirection(angle);
            param.distance = Math.sqrt(param.disX * param.disX + param.disY * param.disY);

            if (o.move) o.move.call(_this, param);

            e.stopPropagation();
            e.preventDefault();
        }

        function touchEnd(e) {
            param.endTime = e.timeStamp;
            if (o.end) o.end.call(_this, param);

            _this.removeEventListener('touchmove', touchMove, false);
            _this.removeEventListener('touchend', touchEnd, false);

            e.stopPropagation();
            e.preventDefault();
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
        return direction
    }

    function getangle(dx, dy) {
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }

    Element.prototype._swipe = swipe;
    document._swipe = swipe.bind(document);
})();

