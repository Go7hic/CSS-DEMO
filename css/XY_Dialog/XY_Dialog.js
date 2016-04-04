/*
 	@Name:弹出层
	@Author: Await[http://leotheme.cn]
	@Mail: yltfy2008@gmail.com
	@Update：2013/03/05 16:15
 */
;(function($) {
	Util.Dialog = function(o) {
		defaults = $.extend({
			type: "dialog",
			//弹窗类型
			theme: "defaults",
			//主题
			title: "标题",
			//窗口标题文字;
			className: "",
			//样式
			boxID: Util.random(10),
			//弹出层ID;
			referID: "",
			//相对于这个ID的位置进行定位
			content: "text:内容",
			//内容(可选内容为){ text | img | grally | swf | url | iframe};
			width: "",
			//窗口宽度;
			height: "",
			//窗口高度;
			time: "",
			//自动关闭等待时间;(单位秒);
			drag: true,
			//是否启用拖动( 默认为启用);
			lock: true,
			//是否限制拖动范围；
			fixed: false,
			//是否开启固定定位;
			showbg: false,
			//是否显示遮罩层( 默认为false);
			showborder: false,
			//是否显示透明边框
			showtitle: true,
			//是否显示弹出层标题( 默认为显示);
			position: "",
			//设定弹出层位置,默认居中;
			arrow: "left",
			//箭头方向
			tips: "",
			//提示层设置（val => 箭头偏移量 | style => 提示层风格 | auto => 提示层位置自适应）
			yesBtn: null,
			noBtn: null,
			minBtn: false,
			maxBtn: false,
			cfns: "",
			//弹出窗关闭后执行的函数;
			ofns: "" //弹出窗打开后执行的函数;
		}, o);
		Util.Dialog.init(defaults);
	};
	$.extend(Util.Dialog, {
		data: {
			box: null,
			winarr: [],
			contentType: "",
			zindex: 870618
		},
		init: function(o) {
			if(Util.getID(o.boxID)) return;
			Util.Dialog.create(o);
			Util.Dialog.loadContent(o);
			Util.Dialog.min(o);
			Util.Dialog.max(o);
			Util.Dialog.restore(o);
			if(o.yesBtn) Util.Dialog.yesBtn(o);
			if(o.noBtn) Util.Dialog.noBtn(o);
			if(o.fixed) {
				Util.fixed(o.boxID);
				Util.fixed(o.boxID + "_move_temp");
			}
			if(typeof o.time === "number") {
				setTimeout(function() {
					Util.Dialog.close(o.boxID, o.cfns);
				}, o.time);
			};
			if(!Util.Browser.isIE) {
				$(window).resize(function() {
					Util.setPosition(o.boxID, o.position, o.referID, o.fixed);
				});
			};
			$(".ui_btn_close", Util.Dialog.box).live("click", function() {
				Util.Dialog.close(o.boxID, o.cfns);
				return false;
			});

			var winarr = Util.Dialog.data.winarr;
			Util.Dialog.box.die().live("mousedown", function() {
				this.style.zIndex = Util.Dialog.data.zindex += 1;
				for(var i = 0; i < winarr.length; i++) {
					if(winarr[i][0] == o.boxID) winarr[i][1] = this.style.zIndex;
				};
			});
			document.onkeydown = function(e) {
				e = e || window.event;
				if(e.keyCode == 27) {
					var zindex = [];
					for(var i = 0; i < winarr.length; i++) {
						zindex.push(winarr[i][1]);
					};
					for(var j = 0; j < zindex.length; j++) {
						if(winarr[j][1] == zindex.max()) {
							Util.Dialog.close(winarr[j][0], o.cfns);
							zindex.remove(zindex.max());
							winarr.remove(winarr[j]);
						};
					};
					//console.log(winarr)
				};
			};
			$("#XYTipsWindowBg").bind("dblclick", function(e) {
				e = e || window.event;
				var ele = e.srcElement ? e.srcElement : e.target;
				if(!Util.contains(Util.getID(o.boxID), ele)) Util.Dialog.close(o.boxID, o.cfns);
			});
		},
		create: function(o) {
			var boxDom = "<div class=\"ui_dialog_wrap\"><div id=\"" + o.boxID + "\" class=\"ui_dialog\">";
			boxDom += "<table class=\"ui_table_wrap\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>";
			boxDom += "<tr><td class=\"ui_border ui_td_00\"></td><td class=\"ui_border ui_td_01\"></td><td class=\"ui_border ui_td_02\"></td></tr>";
			boxDom += "<tr><td class=\"ui_border ui_td_10\"></td><td class=\"ui_td_11\"><table class=\"ui_dialog_main\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>";
			boxDom += "<tr><td><div class=\"ui_title_wrap\"><div class=\"ui_title\"><div class=\"ui_title_text\"><span class=\"ui_title_icon\"></span>" + o.title + "</div><div class=\"ui_btn_wrap\"><span class=\"ui_btn_close\">\u5173\u95ED</span><span class=\"ui_btn_restore\">\u8FD8\u539F</span><span class=\"ui_btn_max\">\u6700\u5927\u5316</span><span class=\"ui_btn_min\">\u6700\u5C0F\u5316</span></div></div></div></td></tr>";
			boxDom += "<tr><td><div class=\"ui_content\" id=\"" + o.boxID + "_content\"></div></td></tr>";
			boxDom += "<tr><td><div class=\"ui_button_wrap\"><div class=\"ui_resize\"></div></div></td></tr></tbody></table>";
			boxDom += "</td><td class=\"ui_border ui_td_12\"></td></tr>";
			boxDom += "<tr><td class=\"ui_border ui_td_20\"></td><td class=\"ui_border ui_td_21\"></td><td class=\"ui_border ui_td_22\"></td></tr></tbody></table>";
			boxDom += "<iframe src=\"about:blank\" class=\"ui_iframe\" style=\"position:absolute;left:0;top:0; filter:alpha(opacity=0);opacity:0; scrolling=no;border:none;z-index:10714;\"></iframe>";
			boxDom += "</div><div class=\"ui_move_temp\" id=\"" + o.boxID + "_move_temp\"></div><div class=\"ui_overlay\"><iframe src=\"about:blank\" style=\"width:100%;height:" + $(document).height() + "px;filter:alpha(opacity=50);opacity:0.5;scrolling=no;border:none;z-index:870611;\"></iframe></div></div>";
			$(boxDom).appendTo("body");
			Util.Dialog.box = $("#" + o.boxID);
			Util.Dialog.box.css("zIndex", Util.Dialog.data.zindex += 1).addClass("ui_dialog_restore " + o.className).parent().addClass("ui_dialog_theme_" + o.theme);
			if(o.type == "tips") o.showtitle = false;
			if(o.showtitle != true) {
				$(".ui_title_wrap", Util.Dialog.box).remove();
			};
			if(o.minBtn) {
				Util.Dialog.box.find(".ui_btn_min").css("visibility", "visible");
			}
			if(o.maxBtn) {
				Util.Dialog.box.find(".ui_btn_max").css("visibility", "visible");
			}
			if(o.showbg) {
				Util.Dialog.box.parent().find(".ui_overlay").css("visibility", "visible");
			};
			if(!o.showborder) {
				Util.Dialog.box.find(".ui_border").css({
					width: "0px",
					height: "0px",
					fontSize: "0",
					lineHeight: "0",
					visibility: "hidden",
					overflow: "hidden"
				});
				Util.Dialog.box.find(".ui_resize").css({
					right: "5px",
					bottom: "5px"
				});
				if(o.type == "dialog") Util.Dialog.box.find(".ui_dialog_main").addClass("ui_box_shadow");
			};
			Util.Dialog.setPosition(o);
		},
		loadContent: function(o) {
			var $contentID = $(".ui_content", Util.Dialog.box),
				winarr = Util.Dialog.data.winarr;
			var tipsDom = "<em class=\"ui_arrow arrow-" + o.arrow + "\" style=\"z-index:1;\"></em><span class=\"ui_arrow arrow-" + o.arrow + "-in\" style=\"z-index:2;\"></span><i class=\"ui_tips_close\">x</i>";
			Util.Dialog.data.contentType = $contentType = o.content.substring(0, o.content.indexOf(":"));
			$content = o.type == "tips" ? "<div class='ui_tips_content'><i class=\"ui_tips_content_ico\"></i>" + o.content.substring(o.content.indexOf(":") + 1, o.content.length) + "</div>" + tipsDom : o.content.substring(o.content.indexOf(":") + 1, o.content.length);
			Util.Dialog.data.contentTypeID = $content;
			$.ajaxSetup({
				global: false
			});
			var _width = o.width, _height =  o.height;
			$contentID.css({
				width: _width,
				height: _height
			});
			var dragBox;
			if(o.drag) dragBox = true;
			var drag = function() {
					winarr.push([o.boxID, Util.getID(o.boxID).style.zIndex, $contentID.width(), $contentID.height()]);
					if(!dragBox) return;
					var safe = Util.safeRange(o.boxID);
					var tempBox = safe.width > 400 || safe.height > 300 ? ".ui_move_temp" : "";
					Util.loadJS("XY_Drag.js", function() {
						Util.drag({
							obj: o.boxID,
							handle: ".ui_title_text",
							lock: o.lock,
							fixed: o.fixed,
							temp: tempBox
						});
					});
				};
			switch($contentType) {
			case "text":
				$contentID.html($content);
				Util.Dialog.setPosition(o);
				drag();
				if(o.ofns != "" && $.isFunction(o.ofns)) o.ofns(this);
				break;
			case "id":
				$("#" + $content).children().appendTo($contentID);
				Util.Dialog.setPosition(o);
				drag();
				if(o.ofns != "" && $.isFunction(o.ofns)) o.ofns(this);
				break;
			case "img":
				$.ajax({
					beforeSend: function() {
						$contentID.addClass("ui_loading").html("<img src='" + Util.config.JSfile + "loading.gif' class='ui_box_loading' alt='\u52A0\u8F7D\u4E2D...' />");
						Util.Dialog.setPosition(o);
					},
					error: function() {
						$contentID.removeClass("ui_loading").html("<p class='ui_box_error'><span class='ui_box_callback_error'></span>\u52A0\u8F7D\u6570\u636E\u51FA\u9519！</p>");
						Util.Dialog.setPosition(o);
					},
					success: function(html) {
						Util.loadJS("XY_Img.js", function() {
							Util.Img.ready($content, function() {
								$contentID.addClass("ui_hark_imgBug").removeClass("ui_loading").html("<img src=" + $content + " alt='' />");
								Util.Dialog.setPosition(o);
								drag();
							});
						});
						if(o.ofns != "" && $.isFunction(o.ofns)) o.ofns(this);
					}
				});
				break;
			case "swf":
				$.ajax({
					beforeSend: function() {
						$contentID.addClass("ui_loading").html("<img src='" + Util.config.JSfile + "loading.gif' class='ui_box_loading' alt='\u52A0\u8F7D\u4E2D...' />");
						Util.Dialog.setPosition(o);
					},
					error: function() {
						$contentID.removeClass("ui_loading").html("<p class='ui_box_error'><span class='ui_box_callback_error'></span>\u52A0\u8F7D\u6570\u636E\u51FA\u9519！</p>");
						Util.Dialog.setPosition(o);
					},
					success: function(html) {
						Util.loadJS("XY_Swf.js", function() {
							$contentID.removeClass("ui_loading").html("<div id='" + o.boxID + "swf'><h1>Alternative content</h1><p><a href=\"http://www.adobe.com/go/getflashplayer\"><img src=\"http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif\" alt=\"Get Adobe Flash player\" /></a></p></div><script type=\"text/javascript\">swfobject.embedSWF('" + $content + "', '" + o.boxID + "swf', '" + o.width + "', '" + o.height + "', '9.0.0', 'expressInstall.swf');</script>");
							$("#" + o.boxID + "swf").css({
								position: "absolute",
								left: "0",
								top: "0",
								textAlign: "center"
							});
							Util.Dialog.setPosition(o);
							drag();
						});
						if(o.ofns != "" && $.isFunction(o.ofns)) o.ofns(this);
					}
				});
				break;
			case "url":
				var contentDate = $content.split("?");
				$.ajax({
					beforeSend: function() {
						$contentID.addClass("ui_loading").html("<img src='" + Util.config.JSfile + "loading.gif' class='ui_box_loading' alt='\u52A0\u8F7D\u4E2D...' />");
						Util.Dialog.setPosition(o);
					},
					type: contentDate[0],
					url: contentDate[1],
					data: contentDate[2],
					error: function() {
						$contentID.removeClass("ui_loading").html("<p class='ui_box_error'><span class='ui_box_callback_error'></span>\u52A0\u8F7D\u6570\u636E\u51FA\u9519！</p>");
						Util.Dialog.setPosition(o);
					},
					success: function(html) {
						$contentID.removeClass("ui_loading").html(html);
						Util.Dialog.setPosition(o);
						drag();
						if(o.ofns != "" && $.isFunction(o.ofns)) o.ofns(this);
					}
				});
				break;
			case "iframe":
				$contentID.css({
					overflowY: "hidden"
				});
				$.ajax({
					beforeSend: function() {
						$contentID.addClass("ui_loading").html("<img src='" + Util.config.JSfile + "loading.gif' class='ui_box_loading' alt='\u52A0\u8F7D\u4E2D...' />")
						Util.Dialog.setPosition(o);
					},
					error: function() {
						$contentID.removeClass("ui_loading").html("<p class='ui_box_error'><span class='ui_box_callback_error'></span>\u52A0\u8F7D\u6570\u636E\u51FA\u9519！</p>");
						Util.Dialog.setPosition(o);
					},
					success: function(html) {
						$contentID.removeClass("ui_loading").html("<iframe src=\"" + $content + "\" style=\"width:100%;height:100%;\" id=\"" + o.boxID + "frame\" scrolling=\"auto\" frameborder=\"0\"></iframe>");
						$("#" + o.boxID + "frame").bind("load", function() {
							var frame = document.getElementById(o.boxID + "frame");
							if(o.width == "" || o.height == "") {
								try {
									frame = frame.contentWindow.document, width = Math.max(frame.body.scrollWidth, frame.documentElement.scrollWidth), height = Math.max(frame.body.scrollHeight, frame.documentElement.scrollHeight);
									Util.Dialog.box.find(".ui_content").css({
										width: width + "px",
										height: height + "px"
									});
								} catch(_) {};
							} else {
								Util.Dialog.box.find(".ui_content").css({
									width: _width + "px",
									height: _height + "px"
								});
							};
							Util.Dialog.setPosition(o);
							drag();
							if(o.ofns != "" && $.isFunction(o.ofns)) o.ofns(this);
						});
					}
				});
			};
		},
		setPosition: function(o) {
			Util.setPosition(o.boxID, {
				follow: o.referID,
				position: o.position,
				fixed: o.fixed
			});
			var safe = Util.safeRange(o.boxID);
			$(".ui_iframe", Util.Dialog.box).css({
				width: safe.width + "px",
				height: safe.height + "px"
			});
			if(o.type == "tips") {
				var t = o.tips,
					mode = o.arrow == "left" || o.arrow == "right" ? "top" : "left";
				var val = t.val || "10";
				var style = t.style || "default";
				var radius = t.radius || "0";
				var auto = t.auto || true;
				Util.Dialog.box.find(".ui_button_wrap").hide().end().find(".ui_dialog_main").css({
					border: "none",
					background: "none"
				}).find(".ui_content").addClass("ui_tips_style_" + style).css({
					borderRadius: radius + "px",
					textAlign: "left"
				}).find(".ui_arrow").css(mode, val + "px").end().find(".ui_tips_close").click(function() {
					Util.Dialog.close(o.boxID, o.cfns);
				});
				var ob = Util.getPosition(o.boxID),
					//rp = Util.getPosition(o.referID),
					s = Util.safeRange(o.referID),
					st = document.body.scrollTop || document.documentElement.scrollTop;
				switch(o.arrow) {
				case "left":
					Util.Dialog.box.css({
						left: ob.x + 8 + "px",
						top: ob.y + "px"
					});
					if(auto = true && p.clientWidth - ob.x < Util.Dialog.box.outerWidth()) {
						Util.Dialog.box.css({
							left: rp.x - Util.Dialog.box.outerWidth() - 8
						}).find("em.ui_arrow").removeClass("arrow-left").addClass("arrow-right").end()
						find("span.ui_arrow").removeClass("arrow-left-in").addClass("arrow-right-in");
					};
					break;
				case "right":
					Util.Dialog.box.css({
						left: ob.x - 10 + "px",
						top: ob.y + "px"
					});
					if(auto = true && ob.x < 0) {
						Util.Dialog.box.css({
							left: rp.x + s.width + 8
						}).find("em.ui_arrow").removeClass("arrow-right").addClass("arrow-left").end()
						find("span.ui_arrow").removeClass("arrow-right-in").addClass("arrow-left-in");
					};
					break;
				case "bottom":
					Util.Dialog.box.css({
						left: ob.x + "px",
						top: ob.y - 8 + "px"
					});
					if(auto = true && ob.y < 0) {
						Util.Dialog.box.css({
							top: rp.y + s.height + 8
						}).find("em.ui_arrow").removeClass("arrow-bottom").addClass("arrow-top").end().find("span.ui_arrow").removeClass("arrow-bottom-in").addClass("arrow-top-in");
					};
					break;
				case "top":
					Util.Dialog.box.css({
						left: ob.x + "px",
						top: ob.y + 8 + "px"
					});
					if(auto = true && p.clientHeight - ob.y + st < Util.Dialog.box.outerHeight()) {
						Util.Dialog.box.css({
							top: rp.y - Util.Dialog.box.outerHeight() - 8
						}).find("em.ui_arrow").removeClass("arrow-top").addClass("arrow-bottom").end().find("span.ui_arrow").removeClass("arrow-top-in").addClass("arrow-bottom-in");
					};
					break;
				};
			};
		},
		yesBtn: function(o) {
			var fn = o.yesBtn[1] ||
			function() {}, text = o.yesBtn[0] || "\u786E\u5B9A";
			var yesBtnDom = "<button class=\"ui_box_btn ui_box_btn_yes\">" + text + "</button>";
			Util.Dialog.box.find(".ui_button_wrap").addClass("ui_button_wrap_bd").append(yesBtnDom);
			if(fn != "" && $.isFunction(fn)) {
				Util.Dialog.box.find(".ui_box_btn_yes").click(function() {
					var f = fn();
					if(f != false) Util.Dialog.close(o.boxID, o.cfns); // 如果回调函数返回false则不关闭对话框
				});
			};
		},
		noBtn: function(o) {
			var fn = o.noBtn[1] ||
			function() {}, text = o.noBtn[0] || "\u53D6\u6D88";
			var noBtnDom = "<button class=\"ui_box_btn ui_box_btn_no\">" + text + "</button>";
			Util.Dialog.box.find(".ui_button_wrap").addClass("ui_button_wrap_bd").append(noBtnDom);
			if(fn != "" && $.isFunction(fn)) {
				Util.Dialog.box.find(".ui_box_btn_no").click(function() {
					var f = fn();
					if(f != false) Util.Dialog.close(o.boxID, o.cfns); // 如果回调函数返回false则不关闭对话框
				});
			};
		},
		min: function(o) {
			var _this = $("#" + o.boxID);
			$(".ui_btn_min", _this).live("click", function() {
				_this.find(".ui_content").css({
					width: "0",
					height: "0",
					display: "none",
					visibility: "hidden"
				}).end().find(".ui_button_wrap").hide();
				var safe = Util.safeRange(o.boxID);
				$(".ui_iframe", _this).css({
					width: safe.width + "px",
					height: safe.height + "px"
				});
				_this.addClass("ui_dialog_min").removeClass("ui_dialog_restore ui_dialog_max");
				if(o.drag) Util.config.drag = true;
				return false;
			});
		},
		max: function(o) {
			var _this = $("#" + o.boxID);
			$(".ui_btn_max", _this).live("click", function() {
				var p = Util.pageSize();
				w = p.clientWidth - (o.showborder ? 10 : 2);
				h = p.clientHeight - (o.showtitle ? 34 : 2) - (o.button ? 36 : 0);
				_this.find(".ui_content").css({
					width: w + "px",
					height: h + "px"
				});
				Util.Dialog.setPosition(o);
				_this.addClass("ui_dialog_max").removeClass("ui_dialog_restore ui_dialog_min");
				if(o.drag) {
					Util.config.drag = false;
					_this.find(".ui_title_text").css("cursor", "default");
				}
				return false;
			});
		},
		restore: function(o) {
			var _this = $("#" + o.boxID);
			var winarr = Util.Dialog.data.winarr;
			$(".ui_btn_restore", _this).live("click", function() {
				for(var i = 0; i < winarr.length; i++) {
					if(o.boxID == winarr[i][0]) {
						_this.find(".ui_content").css({
							width: winarr[i][2] + "px",
							height: winarr[i][3] + "px",
							display: "block",
							visibility: "visible"
						}).end().find(".ui_button_wrap").show();
						Util.Dialog.setPosition(o);
						_this.addClass("ui_dialog_restore").removeClass("ui_dialog_min ui_dialog_max");
					};
				};
				if(o.drag) {
					Util.config.drag = true;
					_this.find(".ui_title_text").css("cursor", "move");
				};
				return false;
			});
		},
		close: function(obj, cfns) {
			if(typeof obj === "string") {
				box = $("#" + obj);
			} else {
				alert("\u8BF7\u6307\u5B9A\u5F39\u51FA\u7A97\u53E3\u7684ID！");
				return;
			};
			if(box.length != 0) {
				if(Util.Dialog.data.contentType == "id") {
					box.find(".ui_content").children().appendTo($("#" + Util.Dialog.data.contentTypeID));
				};
				box.parent().find("iframe").remove();
				Util.clearIframe();
				box.parent().remove();
				$("#XYTipsWindowBg").animate({
					opacity: "0"
				}, 100, function() {
					$(this).remove();
				});
				for(var i = 0; i < Util.Dialog.data.winarr.length; i++) {
					if(obj == Util.Dialog.data.winarr[i][0]) Util.Dialog.data.winarr.remove(Util.Dialog.data.winarr[i]);
				};
				if(cfns != "" && $.isFunction(cfns)) {
					cfns(this);
				};
			};
		}
	});
})(jQuery)