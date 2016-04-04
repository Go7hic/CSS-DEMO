/*
	@Name：公共组件
	@Author: Await[http://leotheme.cn]
	@Mail: yltfy2008@gmail.com
	@Update：2013/03/05 16:06
*/
var Util = typeof $ === "function" ? window.$ : {};
Util.config = {
	JSfile: ""	//设置JS文件夹路径
};
$("head").find("script").each(function(){
	var src = $(this).attr("src");
	if(src.indexOf("XY_Base")!= -1){
		src = src.substring(0, src.lastIndexOf("/")+1);
		Util.config.JSfile = src;
	};
});
Util.getName = function(a) {
	return document.getElementsByName(a);
};
Util.getID = function(id) {
	return document.getElementById(id);
};
Util.getTag = function(ele, oParent) {
	return(oParent || document).getElementsByTagName(ele);
};
Util.ct = function(txt) {
	return document.createTextNode(txt);
};
Util.ce = function(name) {
	return document.createElement(name);
};
// 阻止事件冒泡
Util.stopBubble = function(e) {
	e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
}
// 阻止浏览器默认行为
Util.stopDefault = function(e) {
	e.preventDefault ? e.preventDefault() : e.returnValue = false;
}
// 清除文本选择
Util.clSelect = function() {
	try {
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
	} catch(_) {};
};
//获取当前样式
Util.getStyle = function(element) {
	return element.currentStyle || document.defaultView.getComputedStyle(element, null);
};
//清除IFrame
Util.clearIframe = function() {　　
	if(Util.Browser.isIE) {　　　　CollectGarbage();　　　　setTimeout("CollectGarbage()", 1);　　
	}
};

//判断ID是否存在
Util.exid = function(id) {
	return document.getElementById(id) ? true : false;
};



/*
	判断 a , b 两元素是否有包含关系
	a		要查询的对像
	b		当前点击的对像
	2012年08月04日 17:05
*/
Util.contains = function(a, b) {
	if(a.compareDocumentPosition) {
		return a === b || !! (a.compareDocumentPosition(b) & 16);
	};
	if(a.contains && b.nodeType === 1) {
		return a.contains(b) && a !== b;
	};
	while((b = b.parentNode)) {
		if(b === a) return true;
		return false;
	};
};
/*
	绑定事件
	obj	 对像
	type  事件名称
	fn    回调函数
	2011年10月27日 17:02

*/
Util.bind = function(obj, type, fn) {
	if(obj.attachEvent) {
		obj['e' + type + fn] = fn;
		obj[type + fn] = function() {
			obj['e' + type + fn](window.event);
		}
		obj.attachEvent('on' + type, obj[type + fn]);
	} else {
		obj.addEventListener(type, fn, false);
	};
}

/*
	移除事件
	obj	 对像
	type   事件名称
	fn     回调函数
	2011年10月27日 17:05
*/
Util.unbind = function(obj, type, fn) {
	if(obj.detachEvent) {
		try {
			obj.detachEvent('on' + type, obj[type + fn]);
			obj[type + fn] = null;
		} catch(_) {};
	} else {
		obj.removeEventListener(type, fn, false);
	};
}
/*
	判断浏览器及版本
	2011年5月20日 17:01
*/
Util.Browser = function() {
	var a = navigator.userAgent.toLowerCase();
	var b = {};
	b.isStrict = document.compatMode == "CSS1Compat";
	b.isFirefox = a.indexOf("firefox") > -1;
	b.isOpera = a.indexOf("opera") > -1;
	b.isSafari = (/webkit|khtml/).test(a);
	b.isSafari3 = b.isSafari && a.indexOf("webkit/5") != -1;
	b.isIE = !b.isOpera && a.indexOf("msie") > -1;
	b.isIE6 = !b.isOpera && a.indexOf("msie 6") > -1;
	b.isIE7 = !b.isOpera && a.indexOf("msie 7") > -1;
	b.isIE8 = !b.isOpera && a.indexOf("msie 8") > -1;
	b.isGecko = !b.isSafari && a.indexOf("gecko") > -1;
	b.isMozilla = document.all != undefined && document.getElementById != undefined && !window.opera != undefined;
	return b
}();

/*
	获取页面大小相关信息
	2011年5月25日 17:01
*/
Util.pageSize = function() {
	var a = Util.Browser.isStrict ? document.documentElement : document.body;
	var b = ["clientWidth", "clientHeight", "scrollWidth", "scrollHeight"];
	var c = {};
	for(var d in b) c[b[d]] = a[b[d]];
	c.scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
	c.scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	return c
};

/*
	获取DOM位置信息
	obj		对像
	parent	父级节点
	2011年5月20日17:01
*/
Util.getPosition = function(obj) {
	if(typeof(obj) === "string") obj = Util.getID(obj);
	var c = 0;
	var d = 0;
	var w = obj.offsetWidth;
	var h = obj.offsetHeight;
	do {
		d += obj.offsetTop || 0;
		c += obj.offsetLeft || 0;
		obj = obj.offsetParent
	}
	while (obj) return {
		x: c,
		y: d,
		width: w,
		height: h
	}
};

/*
	计算安全范围
	obj	对像
	2011年5月20日 17:01
*/
Util.safeRange = function(obj) {
	if(typeof(obj) === "string") {
		b = Util.getID(obj);
	} else {
		b = obj;
	}
	var c, d, e, f, g, h, j, k;
	j = b.offsetWidth;
	k = b.offsetHeight;
	p = Util.pageSize();
	c = 0;
	e = p.clientWidth - j;
	g = e / 2;
	d = 0;
	f = p.clientHeight - k;
	var hc = p.clientHeight * 0.382 - k / 2;
	h = (k < p.clientHeight / 2) ? hc : f / 2;
	if(g < 0) g = 0;
	if(h < 0) h = 0;
	return {
		width: j,
		height: k,
		minX: c,
		minY: d,
		maxX: e,
		maxY: f,
		centerX: g,
		centerY: h
	};
};

/*
	设定对像位置
	obj		对像
	position	位置
	follow	对像
	fixed:
	callback
	2012年3月5日 9:27:43
*/
Util.setPosition = function(obj, o) {
	var a, b = Util.pageSize(), c = Util.safeRange(obj), d = o.position,
		t = o.fixed === true ? 0 : b.scrollTop;
	if(typeof(obj) === "string") {
		a = Util.getID(obj);
	} else {
		a = obj;
	}
	if(o.follow != undefined && o.follow != "") {
		s = Util.safeRange(o.follow);
		r = Util.getPosition(o.follow);
		var left = !d.right ? parseInt(d.left) : b.clientWidth - s.width - parseInt(d.right);
		var top = !d.bottom ? parseInt(d.top) : b.clientHeight - s.height - parseInt(d.bottom);
		left1 = r.x + parseInt(d.left); //inside
		left2 = r.x + parseInt(d.left) + s.width; //outside
		right1 = r.x + s.width - c.width - parseInt(d.right); //inside
		right2 = r.x - c.width - parseInt(d.right); //outside
		top1 = r.y + parseInt(d.top); //inside
		top2 = r.y + parseInt(d.top) + s.height; //outside
		bottom1 = r.y + s.height - c.height - parseInt(d.bottom); //inside
		bottom2 = r.y - c.height - parseInt(d.bottom); //outside
		left = !d.right ? (d.lin ? left1 : left2) : (d.rin ? right1 : right2);
		top = !d.bottom ? (d.tin ? top1 : top2) : (d.bin ? bottom1 : bottom2);
		a.style.left = left + "px";
		a.style.top = top + "px";
	} else {
		if(!d.left && !d.right) {
			a.style.left = c.centerX + "px";
		} else {
			if(!d.right) {
				a.style.left = parseInt(d.left) + "px";
			} else {
				a.style.right = parseInt(d.right) + "px";
			};
		};
		if(!d.top && !d.bottom) {
			a.style.top = c.centerY + t + "px";
		} else {
			if(!d.bottom) {
				a.style.top = parseInt(d.top) + t + "px";
			} else {
				a.style.top = b.clientHeight - a.offsetHeight - parseInt(d.bottom) + "px";
			};
		};
	};
	if(o.callback != "" && $.isFunction(o.callback)) o.callback(this);
};

/*
	iframe自适应高度
	obj	对像
	2011年10月28日 17:01
*/
Util.setIframHeight = function(obj) {
	var fun = function(obj) {
			var o = document.getElementById(obj);
			try {
				var a = o.contentWindow.document.body.scrollHeight;
				var b = o.contentWindow.document.documentElement.scrollHeight;
				var h = Math.max(a, b);
				o.height = h;
			} catch(ex) {}
		}
	window.setInterval(fun, 200);
};

/*
	将"Date"转化为指定格式的String
	fmt	日期时间
		"yyyy-MM-dd hh:mm:ss.S"		==> 2006-07-02 08:09:04.423
		"yyyy-MM-dd E HH:mm:ss"	==> 2009-03-10 二 20:09:04
		"yyyy-MM-dd EE hh:mm:ss"	==> 2009-03-10 周二 08:09:04
		"yyyy-MM-dd EEE hh:mm:ss"	==> 2009-03-10 星期二 08:09:04
		"yyyy-M-d h:m:s.S"			==> 2006-7-2 8:9:4.18
*/
Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1,
		//月份
		"d+": this.getDate(),
		//日
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
		//小时
		"H+": this.getHours(),
		//小时
		"m+": this.getMinutes(),
		//分
		"s+": this.getSeconds(),
		//秒
		"q+": Math.floor((this.getMonth() + 3) / 3),
		//季度
		"S": this.getMilliseconds() //毫秒
	};
	var week = {
		"0": "\u65e5",
		"1": "\u4e00",
		"2": "\u4e8c",
		"3": "\u4e09",
		"4": "\u56db",
		"5": "\u4e94",
		"6": "\u516d"
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	};
	if(/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
	};
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		};
	};
	return fmt;
};
//数组原型扩展
Array.prototype.min = function() {
	return Math.min.apply({}, this);
};
Array.prototype.max = function() {
	return Math.max.apply({}, this);
};
Array.prototype.inArray = function(str){
	var k = this.length;
	while(k--){
		if(this[k]==str) return true;
	};
	return false;
};
Array.prototype.removeRepeat = function() {
	var t, b = [],
		_i = this.length;
	for(var i = 0; i < _i - 1; i++) {
		for(var j = i + 1; j < _i; j++) {
			if(this[j] === this[i]) {
				this.splice(j, 1);
				if(this[i] !== t) t = this[i], b.push(this[i]);
				i--, _i--;
			};
		};
	};
	return b;
};
Array.prototype.indexOf = function(val) {
	for(var i = 0; i < this.length; i++) {
		if(this[i] == val) return i;
	};
	return -1;
};
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if(index > -1) {
		this.splice(index, 1);
	};
};
String.prototype.len = function() {
	return this.replace(/[^\x00-\xff]/g, "**").length;
};
String.prototype.trim = function(site) {
	switch(site) {
	case "left":
		return this.replace(/(^\s*)/g, "");
	case "right":
		return this.replace(/(\s*$)/g, "");
	case "all":
		return this.replace(/\s/g, "");
	default:
		return this.replace(/(^\s*)|(\s*$)/g, "");
	}
};
String.prototype.sub = function(n) {
	var r = /[^\x00-\xff]/g;
	if(this.replace(r, "mm").length <= n) return this;
	// n = n - 3;
	var m = Math.floor(n / 2);
	for(var i = m; i < this.length; i++) {
		if(this.substr(0, i).replace(r, "mm").length >= n) {
			return this.substr(0, i) + "...";
		}
	}
	return this;
};

/*
	写入CSS样式
	str	css内容
	2011年5月20日 16:57:30
*/
Util.addStyle = function(str) {
	var b = window.style;
	if(!b) {
		b = window.style = document.createElement('style');
		b.setAttribute('type', 'text/css');
		document.getElementsByTagName('head')[0].appendChild(b);
	};
	b.styleSheet && (b.styleSheet.cssText += str) || b.appendChild(document.createTextNode(str));
};

/*
	载入CSS文件
	path		路径
	name		文件名称
	2011年5月20日 16:57:00
*/
Util.loadCSS = function(path, name) {
	if(!path) return;
	var b = Util.getTag('link');
	for(var c in b) {
		if(b[c].href == path) return
	}
	var link = document.createElement("link");
	link.id = name;
	link.rel = "stylesheet";
	link.media = "screen";
	link.type = "text/css";
	link.href = path;
	Util.getTag("HEAD").item(0).appendChild(link);
};
Util.loadCSS(Util.config.JSfile + "core.css", "core");

/*
	载入JS文件
	url		文件路径||object
	callback	加载成功后执行函数
	async 		异步执行
	cache		是否缓存
	chartset	文件编码
	success	回调函数
	2012年08月30日 12:40:52
*/
Util.loadJS = function(url, callback, ecall) {
	var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
		script, options, o,
	scriptsArray = [];
	if(typeof url === "object") {
		options = url;
		url = undefined;
	}
	o = options || {};
	url = url || o.url;
	var path = url.split(",");
	callback = callback || o.success;
	for(var i = 0; i < path.length; i++) {
		str = path[i].slice(path[i].lastIndexOf('/') + 1);
		name = str.substring(0, str.indexOf("."));
		script = document.createElement("script");
		script.async = o.async || false;
		script.type = "text/javascript";
		//script.id = name;
		if(o.charset) script.charset = o.charset;
		if(o.cache === false) {
			path[i] = path[i] + (/\?/.test(path[i]) ? "&" : "?") + "time=" + (new Date()).getTime();
		}
		script.src = (path[i].indexOf("/") == '-1' ? true : false) === true ? Util.config.JSfile + path[i] : path[i];
		head.appendChild(script);
	};
	if('function' == typeof callback) {
		document.addEventListener ? script.addEventListener("load", function() {
			callback();
			script.onload = null;
			script.parentNode.removeChild(script);
		}, false) : script.onreadystatechange = function() {
			if(/loaded|complete/.test(script.readyState)) {
				callback();
				script.onreadystatechange = null;
			}
		}
	}
	if(ecall) {
		script.onerror = function() {
			script = null;
			if('function' == typeof ecall) ecall();
		};
	}
};

/*
	获取随机字符
	length		长度
	upper		是否允许大写字母
	lower		是否允许小写字母
	number	是否允许数字
	2011年9月30日 16:40:52
*/
Util.random = function(length, upper, lower, number) {
	if(!upper && !lower && !number) {
		upper = lower = number = true;
	}
	var a = [
		["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
		["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
		["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
	];
	//临时数组
	var b = [];
	//临时字串
	var c = "";
	b = upper ? b.concat(a[0]) : b;
	b = lower ? b.concat(a[1]) : b;
	b = number ? b.concat(a[2]) : b;
	for(var i = 0; i < length; i++) {
		c += b[Math.round(Math.random() * (b.length - 1))];
	}
	return c;
};

/*
	获取URL参数
	key	参数名称
	url	URL链接，默认为当前URL
	2011年9月30日 16:21:22
*/
Util.getUrlKey = function(key, url) {
	var url = url ? url : location.href;
	var v = '';
	var o = url.indexOf(key + "=");
	if(o != -1) {
		o += key.length + 1;
		e = url.indexOf("&", o);
		if(e == -1) {
			e = url.length;
		}
		//v = decodeURIComponent(url.substring(o, e));
		v = url.substring(o, e);
	}
	return v;
};


/*
	固定定位
	obj	对象名称
	2013年03月11日 12:49:25
*/
Util.fixed = function(obj) {
	var o = Util.getID(obj);
	if(!Util.Browser.isIE6) {
		o.style.position = "fixed";
	} else {
		var p = Util.pageSize();
		o.style.position = "absolute";
		o.style.top = Util.getStyle(Util.getID(obj))["top"] != "auto" ? parseInt(Util.getStyle(Util.getID(obj))["top"]) + "px" : p.clientHeight - o.offsetHeight - parseInt(Util.getStyle(Util.getID(obj))["bottom"]) + "px";
		Util.addStyle(".ui_fixed{position:absolute; width:100%; height:1px; z-index: 891201; left:expression(documentElement.scrollLeft+documentElement.clientWidth-this.offsetWidth);top:expression(documentElement.scrollTop)}.body-fixed{background-attachment:fixed;background-image:url(about:blank);}");
		var fixed = $(".ui_dialog_fixed");
		if(fixed.length == 0) {
			var wrap = Util.ce("div");
			wrap.className = 'ui_fixed';
			wrap.appendChild(o);
			document.body.appendChild(wrap);
			$("html").addClass("body-fixed");
		}else{
			$(fixed).append(o)
		};
	};
};


/*
	返回信息类型
	ok		成功
	error		出错
	tips		警告
	2011年5月20日 16:57:05
*/
Util.callBack = {
	ok: function(text) {
		return "<div class='ui_box_callback clearfix'><span class='ui_box_callback_ok'></span><span class='ui_box_callback_text'>" + text + "</span></div>";
	},
	error: function(text) {
		return "<div class='ui_box_callback clearfix'><span class='ui_box_callback_error'></span><span class='ui_box_callback_text'>" + text + "</span></div>";
	},
	tips: function(text) {
		return "<div class='ui_box_callback clearfix'><span class='ui_box_callback_tips'></span><span class='ui_box_callback_text'>" + text + "</span></div>";
	}
};

/*
	Cookie操作
	2012年2月14日 15:10:20
*/
Util.cookie = {
	get: function(a) {
		var b = "";
		var c = a + "=";
		var d = document.cookie;
		if(d.length > 0) {
			g = d.indexOf(c);
			if(g != -1) {
				g += c.length;
				f = d.indexOf(";", g);
				if(f == -1) f = d.length;
				b = unescape(d.substring(g, f));
			};
		};
		return b;
	},
	set: function(a, b, t, d, e) {
		var c = "";
		var h = t || 24 * 30;
		if(h != null) {
			c = new Date((new Date()).getTime() + h * 3600000);
			c = "; expires=" + c.toGMTString();
		};
		document.cookie = a + "=" + escape(b) + c + (d ? "; path=" + d : "; path=/") + (e ? ";domain=" + e : "")
	},
	del: function(a) {
		document.cookie = a + "=;path=/;" + "expires=" + (new Date(0)).toGMTString();
	}
};