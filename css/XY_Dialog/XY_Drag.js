/*
 	@Name:拖拽
	@Author: Await[http://leotheme.cn]
	@Mail: yltfy2008@gmail.com
	@Update：2012/07/13 17:15
 */
;(function($){
Util.drag = function (o) {
	var defaults = {
		obj: "",
		handle: "",
		lock: true,
		lockX: false,
		lockY: false,
		fixed: false,
		parent: "",
		temp:"",
		dstar: function () {},
		dmove: function () {},
		dstop: function () {}
	};
	var o = $.extend(defaults, o);
	var _x, _y, _d, otemp,
	mx = my = 0,
	_this = $("#" + o.obj);
	Util.config.drag = true;
	_d = o.handle != "" ? $(o.handle, _this) : _this;
	_d.css("cursor", "move");
	_d.mousedown(function (ev) {
		if (!Util.config.drag) return;
		safe = Util.safeRange(o.obj);
		tempBox = _this.parent().find(o.temp);
		s = Util.pageSize();
		otemp = o.temp!="" ? tempBox : _this;
		star(ev);
		if(o.obj.setCapture){
			o.obj.setCapture();
		}else if(window.captureEvents){
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		};
		$(document).bind("mousemove", function(ev){move(ev);});
		$(document).bind("mouseup", function(ev){stop(ev);});
	});
	if (o.fixed) o.parent = "";
	if (o.parent != "")$("#" + o.parent).css("position", "relative");
	var	star = function (ev) {
		ev = ev || window.event;
		ev.preventDefault();
		p = Util.getPosition(o.obj);
		ny = o.fixed ? Util.Browser.isIE6 ? s.scrollTop : 0 : 0;
		mx = ev.clientX - p.x;
		my = ev.clientY - p.y + ny;
		if (o.temp!=""){
			otemp.css({
				left : p.x + "px",
				top: p.y + ny + "px",
				width: safe.width + "px",
				height: safe.height + "px",
				display: "block"
			});
		};
		if (o.dstar != "" && $.isFunction(o.dstar)) o.dstar(this);
		_this.addClass("ui_drag_start").removeClass("ui_drag_move ui_drag_stop");
	},
	move = function(ev){
		var parent;
		ev = ev || window.event;
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		Util.clSelect();
		_x = ev.clientX - mx;
		_y = ev.clientY - my;
		if (o.parent != "") {
			parent = Util.getPosition(o.parent);
			op = Util.getPosition(o.obj);
			_x = ev.clientX - mx - parent.x ;
			_y = ev.clientY - my - parent.y ;
		};
		maxX = o.parent != "" ? parent.width - op.width : safe.maxX;
		maxY = o.parent != "" ? parent.height - op.height : safe.maxY;
		if (o.lockX) _y = p.y;
		if (o.lockY) _x = p.x;
		if (o.lock) {
			if (_x <= 0) _x = safe.minX;
			if (_x >= maxX) _x = maxX;
			if (o.fixed){
				if (_y <= 0) _y = safe.minY;
				if (_y >= maxY)_y = maxY;
			}else{
				if ( _y > maxY+s.scrollTop) _y = maxY+s.scrollTop;
				if ( _y < s.scrollTop)_y = s.scrollTop;
			};
		};
		otemp.css({
			left: _x  + "px",
			top: _y  + "px"
		});
		_this.addClass("ui_drag_move").removeClass("ui_drag_start ui_drag_stop");
		if (o.dmove != "" && $.isFunction(o.dmove)) o.dmove(this);
	},
	stop = function(ev){
		if (o.temp !="" && Util.config.drag){
			otemp.css("display","none");
			_this.css({
				left: _x + "px",
				top: _y + "px"
			});
		};
		_this.addClass("ui_drag_stop").removeClass("ui_drag_start ui_drag_move");
		$(document).unbind("mousemove");
		if(o.obj.releaseCapture) {
			o.obj.releaseCapture();
        } else if(window.captureEvents) {
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
        }
		if (o.dstop != "" && $.isFunction(o.dstop)) o.dstop(this);
	};
};
})(jQuery);