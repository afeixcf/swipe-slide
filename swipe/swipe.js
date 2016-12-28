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
            startTime:0,
            endTime:0
        };
        var _this = this;

        this.addEventListener('touchstart', touchStart, false);

        function touchStart(e) {
            var touch = e.touches[0];
            param = {
                startX: 0,
                endX: 0,
                startY: 0,
                endY: 0,
                disX: 0,
                disY: 0,
                direction: ''
            };
            param.startX = touch.pageX;
            param.startY = touch.pageY;
            param.startTime = e.timeStamp;

            if (o.start) o.start.call(_this, param);

            _this.addEventListener('touchmove', touchMove, false);
            _this.addEventListener('touchend', touchEnd, false);

            e.stopPropagation();
            e.preventDefault();
        }

        function touchMove(e) {
            var touch = e.changedTouches[0];
            var angel;

            param.endX = touch.pageX;
            param.endY = touch.pageY;
            param.disX = param.endX - param.startX;
            param.disY = param.startY - param.endY;
            angel = getAngel(param.disX,param.disY);
            param.direction = getDirection(angel);

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

    function getDirection(angel) {
        var direction;
        if (angel < 45 && angel > -45) {
            direction = 'right';
        } else if (angel > 45 && angel < 135) {
            direction = 'up';
        } else if (angel > 135 || angel < -135) {
            direction = 'left';
        } else if (angel < -45 && angel > -135) {
            direction = 'down';
        }
        return direction
    }
    function getAngel(dx,dy){
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }

    Element.prototype._swipe = swipe;
    document._swipe = swipe.bind(document);
})();

