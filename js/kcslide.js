/*!
  jQuery KcSlide plugin 0.1
  @name jquery.kcslide.js
  @author Kevin Chan(chj@8cuo.net or @chenshazi on Weibo.com)
  @version 0.1
  @date 1/6/2013
  @category jQuery plugin
  @copyright (c) 2010-2013 KevinChan (www.8cuo.net)
*/
(function($){
	$.fn.kcSlide = function(options){
		var opt =$.extend({},$.fn.kcSlide.defaults,options);
		return this.each(function(){
			var $this = $(this),
			$scrollBox = $this.children(opt.scrollBoxType),
			$itemLen = $scrollBox.children().length,
			$boxHeight = $this.height(),
			$itemIndex = 0,
			$scrollWidth = null,
			$arrNavBtn = [];
			
			/* 判断是否全屏 并设置slide区域的宽度 */
			if((opt.scrollWidth == "100%") || (opt.scrollWidth == "auto")){
				$(window).bind("resize load",function(){
					var _winWidth = $(window).width();
					$scrollBox.parent().css("width",_winWidth);
					if(opt.direction =='linerSlide'){
						$scrollBox.css({"width":_winWidth*$itemLen,"left":-(_winWidth*$itemIndex)});
					}else{
						$scrollBox.css("width",_winWidth);
					}
					$scrollBox.children(opt.childItem).css("width",_winWidth);
					//$this.css("width",_winWidth);
				});
			}else{
				if(opt.direction =='linerSlide'){
					$scrollBox.css({"width":opt.scrollWidth*$itemLen,"left":-(opt.scrollWidth*$itemIndex)});	
				}else{
					$scrollBox.css("width",opt.scrollWidth);
				}
				$this.css("width",opt.scrollWidth);
				$scrollBox.children(opt.childItem).css("width",opt.scrollWidth);
			} 
			/* End 判断是否全屏 并设置slide区域的宽度 */			
			/* 如果为渐隐模式 则隐藏其他项 */	
			if(opt.direction =='fade'){
				$scrollBox.children().filter(":not(':first')").hide();
			}			
			/* End 如果为渐隐模式 则隐藏其他项 */
			/* 创建数字导航 */
			if(opt.navBtnStyle != "hidden"){
				$arrNavBtn.push('<div class="navBtn">');
				$scrollBox.children(opt.childItem).each(function(i){
					switch(opt.navBtnStyle){
						case 'number':
							$arrNavBtn.push("<span>"+(i+1)+"</span>");
							break;
						case 'noNumber':
							$arrNavBtn.push("<span></span>");
							break;
					}
				});
				$arrNavBtn.push("</div>");		
				$this.append($arrNavBtn.join(''));
			}
			/* End 创建数字导航 */
			
			if(opt.btnToggle != 'hide' && $itemLen>1){
				$this.prepend("<a href='#' class='prev'></a>").append("<a href='#' class='next'></a>");
			}
			
			var $btn = $this.children(".navBtn"),
				$prev = $this.find(".prev"),
				$next = $this.find(".next");
			if(opt.btnToggle != 'show'){
				$prev.hide();
				$next.hide();
			}
			
			/* 数字导航点击操作 */
			$btn.children('span').eq(0).addClass(opt.currentClass);
			$btn.children('span').each(function(){
				$(this).click(function(){
					if(!$scrollBox.is(":animated")){
						var index = $(this).index();
						$itemIndex != index && slideTo(index);
						$itemIndex = index;
					}
				});	
			});	
			/* End 数字导航点击操作 */
			
			var autoscroll;
			$this.hover(function(){
				if(opt.autoScroll){
					 clearInterval(autoscroll);
				}
				if(opt.btnToggle == "toggle"){arowBtnShow()};
			},function(){
				if(opt.autoScroll){
					autoscroll = setInterval(function(){
						$itemIndex += 1;
						if($itemIndex == $itemLen){$itemIndex =0}
						slideTo($itemIndex);
						
					},opt.timer);		
				}
				if(opt.btnToggle == "toggle"){arowBtnHide()};
			}).trigger("mouseleave");
			
			$prev.click(function(){
				if(!$scrollBox.is(":animated")){
					$itemIndex -=1;
					if($itemIndex == -1){$itemIndex = $itemLen-1};	
					slideTo($itemIndex);
				}
				return false;
			}).hover(function(){
				$(this).fadeTo(300,0.6);	
			},function(){
				$(this).fadeTo(300,0.8);	
			});
			$next.click(function(){
				if(!$scrollBox.is(":animated") && !$scrollBox.next("ul").is(":animated") && !$scrollBox.children().is(":animated")){
					$itemIndex +=1;
					$itemIndex == $itemLen && ($itemIndex =0);	
					slideTo($itemIndex);
				}
				return false;
			}).hover(function(){
				$(this).fadeTo(300,0.6);
			},function(){
				$(this).fadeTo(300,0.8);
			});			
			
			
			
			/* 定义数字导航点击方法 */
		    function slideTo(i){
				opt.scrollWidth == "100%" || opt.scrollWidth == "auto" ? $scrollWidth = $(window).width() : $scrollWidth = opt.scrollWidth;	
				if(opt.direction=='fade'){
					$scrollBox.children(opt.childItem).eq(i).fadeIn(opt.fadeTime).siblings().hide();	
				}else{
					slideItem({"left":-($scrollWidth*i)});
				}
			
				
				$btn.children().eq(i).addClass(opt.currentClass).siblings().removeClass(opt.currentClass);
			}			
			/* End 定义数字导航点击方法 */
			/* slide 效果 */	
			function slideItem(action){
				  $scrollBox.animate(action,opt.focusTime);	  
			}					
			/* End slide 效果 */	
			
			function arowBtnHide(){$prev.fadeOut();$next.fadeOut();}			
			function arowBtnShow(){$prev.fadeIn();$next.fadeIn();}
		});
	}

	$.fn.kcSlide.defaults = {
		scrollBoxType : "ul",
		childItem:"li",
		currentClass:"current",
		timer : 3000,  //间隔时间
		scrollWidth : "100%",  //图片宽度，任意数值，设置为100%或者auto时，占满全屏
		autoScroll : true,   //是否自动滚动
		direction: 'linerSlide', //此参数提供fade(淡入淡出),linerSlide(左右滑动)
		btnToggle : "toggle",  //设置为toggle时鼠标放到滑动图上显示，离开影藏。设置show时一直显示，设置hide时隐藏
		navBtnStyle : "number",  //参数有四个分别是number(数字),noNumber(非数字，任意图形),hidden(影藏)
		focusTime : {duration: 1300, easing: "easeInOutQuart"},  //左右焦点图时间，支持缓动公式，如果直接设置数值，那么就没有缓动效果
		fadeTime : 1000  //该参数使用淡入淡出动画生效，控制淡入速度
	}
})(jQuery)


jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});