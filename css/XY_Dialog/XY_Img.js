/*
 	@Name: 图片加载与缩放
	@Author: Await[http://leotheme.cn]
	@Mail: yltfy2008@gmail.com
	@Update：2012/02/14 15:15
 */
;(function($){
Util.Img = {
	/** @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
			alert('size ready: width=' + this.width + '; height=' + this.height);
		});
	 */
	ready : (function () {
		var list = [],intervalId = null,
		// 用来执行队列
		tick = function () {
			var i = 0;
			for (; i < list.length; i++) {
				list[i].end ? list.splice(i--, 1) : list[i]();
			};
			!list.length && stop();
		},
		// 停止所有定时器队列
		stop = function () {
			clearInterval(intervalId);
			intervalId = null;
		};

		return function (url, ready, load, error) {
			var onready, width, height, newWidth, newHeight,
				img = new Image();
			img.src = url;
			// 如果图片被缓存，则直接返回缓存数据
			if (img.complete) {
				ready.call(img);
				load && load.call(img);
				return;
			};
			width = img.width;
			height = img.height;
			// 加载错误后的事件
			img.onerror = function () {
				error && error.call(img);
				onready.end = true;
				img = img.onload = img.onerror = null;
			};
			// 图片尺寸就绪
			onready = function () {
				newWidth = img.width;
				newHeight = img.height;
				if (newWidth !== width || newHeight !== height ||newWidth * newHeight > 1024) {
					ready.call(img);
					onready.end = true;
				};
			};
			onready();
			// 完全加载完毕的事件
			img.onload = function () {
				// onload在定时器时间差范围内可能比onready快
				// 这里进行检查并保证onready优先执行
				!onready.end && onready();
				load && load.call(img);
				// IE gif动画会循环执行onload，置空onload即可
				img = img.onload = img.onerror = null;
			};
			// 加入队列中定期执行
			if (!onready.end) {
				list.push(onready);
				// 无论何时只允许出现一个定时器，减少浏览器性能损耗
				if (intervalId === null) intervalId = setInterval(tick, 40);
			};
		};
	})(),
	rotate: function(id,container) {
		var obj = Util.getID(id); 
		var _w = container != undefined ? $("#"+container).width() : $("#"+id).parent().width();
		var _h = container != undefined ? $("#"+container).height() : $("#"+id).parent().height();
		var _x = _y = 1; //水平/垂直变换参数
		var _radian = 0;  //旋转变换参数
		var _zoom = .1;
		var mousewheel = Util.Browser.isFirefox ? "DOMMouseScroll" : "mousewheel";
		$("#"+id).bind(mousewheel,function(e){Util.Img.rotate.zoommouse(e);show();});
		//获取变换参数函数
		getMatrix = function(radian, x, y) {
			var Cos = Math.cos(radian), Sin = Math.sin(radian);
			return {
				M11: Cos * x, M12:-Sin * y,
				M21: Sin * x, M22: Cos * y
			};
		};
		show = function() {
			if (Util.Browser.isIE){
				//设置滤镜
				obj.style.filter = "progid:DXImageTransform.Microsoft.Matrix(SizingMethod='auto expand')";
				$.extend(
					obj.filters.item("DXImageTransform.Microsoft.Matrix"),
					getMatrix( _radian, _y, _x )
				);
				//保持居中
				$("#"+id).css({
					position: "absolute",
					left: ( _w - obj.offsetWidth ) / 2 + "px",
					top: ( _h - obj.offsetHeight ) / 2 + "px"
				});
			
			}else{
				var matrix = getMatrix( _radian, _y, _x );
				var css3Transform = Util.Browser.isSafari ? "webkitTransform" : "MozTransform" ;//ccs3变换样式
				//设置变形样式
				obj.style[ css3Transform ] = "matrix("+ matrix.M11.toFixed(16) + "," + matrix.M21.toFixed(16) + ","+ matrix.M12.toFixed(16) + "," + matrix.M22.toFixed(16) + ", 0, 0)";
			}
		};
		$.extend(Util.Img.rotate,{
			//垂直翻转
			vertical: function() {
				_radian = Math.PI - _radian; _y *= -1; show();
			},
			//水平翻转
			horizontal: function() {
				_radian = Math.PI - _radian; _x *= -1; show();
			},
			//根据弧度旋转
			rotate: function(radian) { 
				_radian = radian; show();
			},
			//向左转90度
			left: function() { 
				_radian -= Math.PI/2; show();
			},
			//向右转90度
			right: function() { 
				_radian += Math.PI/2; 
				show();
			},
			//根据角度旋转
			rotatebydegress: function(degress) { 
				_radian = degress * Math.PI/180; 
				show();
			},
			//重置
			reset: function() {
				_radian = 0; 
				_x = _y = 1; 
				show();
			},
			//缩放
			scale: function () {
				function getZoom(scale, zoom) {
					return	 scale > 0 && scale >-zoom ? zoom :
							scale < 0 && scale < zoom ?-zoom : 0;
				}
				return function(zoom) { if( zoom ){
					var hZoom = getZoom( _y, zoom ), vZoom = getZoom(_x, zoom );
					if ( hZoom && vZoom ) {
						_y += hZoom; _x += vZoom;
					}
				}}
			}(),
			//放大
			zoomin: function() { Util.Img.rotate.scale( Math.abs(_zoom) ); show();},
			//缩小
			zoomout: function() { Util.Img.rotate.scale( -Math.abs(_zoom) );show(); },
			//鼠标滚轮缩放
			zoommouse: function(e){
				e = e || window.event;
				Util.Img.rotate.scale((e.wheelDelta ? e.wheelDelta / (120) : (e.detail || 0) / -3) * Math.abs(_zoom));
				e.preventDefault();
			}
		});
	}
}
})(jQuery)