window.ZQ = {
	version: "1.0.0",
	copyRight: "copyright © WillShaw"
}
;(function(window) {
	"use strict";
	var Tools = ZQ.Tools || {};
	Tools.elScale = function(el, callback, dir, senArea) {
		var side = "", senArea = senArea || 15,
			elWidth = "", elHeight = "",
			disX = "", disY = "",
			disL = "", disT = "";
		var dirs = dir ? (function(str){
				str = str.toUpperCase();
				var arr = str.split("");
				if(arr.length > 1) arr.push(str);
			})(dir) : "R L T B RT RB LT LB C".split(" ");

		var getSide = function(el, ev) {
			elWidth = el.offsetWidth;
			elHeight = el.offsetHeight;
			disX = ev.clientX;
			disY = ev.clientY;
			disL = el.offsetLeft;
			disT = el.offsetTop;

			var iR = disL + elWidth - senArea,
				iL = disL + senArea,
				iT = disT + senArea,
				iB = disT + elHeight - senArea,
				sides = [];

			if(iR < disX)  {
				sides.push("R");
			}else if(disX < iL) {
				sides.push("L");
			}
			if(disY < iT) {
				sides.push("T");
			}else if(disY > iB) {
				sides.push("B");
			}
			if( sides.length == 0 && 
				(iL < disX < iR) && (iT < disY < iB) ) {
				sides.push("C");
			}
			return sides.join("");
		}
		var funcList = function(el, ev) {
			var baseFunc = {
				"R": function(el, ev) {
					el.style.width = elWidth + (ev.clientX - disX) + "px";
				},
				"L": function(el, ev) {
					el.style.width = elWidth + (disX - ev.clientX) + "px";
					el.style.left = (ev.clientX - disX) + "px";
				},
				"T": function(el, ev) {
					el.style.height = elHeight + (disY -ev.clientY) + "px";
					el.style.top = disT + (ev.clientY - disY) + "px";
				},
				"B": function(el, ev) {
					el.style.height = elHeight + (ev.clientY - disY) + "px";
				}
			};

			var funcList = {};
			
			dirs.forEach(function(val, i) {
				funcList[val] = (function(val) {
					return function(el, ev){
						val.split("").forEach(function(v, k) {
							return baseFunc[v](el, ev);
						});	
					}
				})(val);		
			});
			return funcList;
		}
		var setHover = function(side) {
			if(!side) return;

			var	sides = "R L T B RB LT RT LB C".split(" "),
				pointers = "w-resize n-resize nw-resize ne-resize move".split(" ");
			var index = Math.floor(sides.indexOf(side) / 2);
			if(pointers[index]) {
				return pointers[index];
			}
		}
		var mouseMove = function(ev) {
			var ev = ev || window.event,
				func = funcList(),
				usable = side && dirs.indexOf(side) != -1
							&& (side.indexOf("C") == -1)
				//usable = side && dirs.includes(side) 
				//			&& (side.indexOf("C") == -1);

			if(usable) func[side](el, ev);

			if(el.releaseCapture) el.releaseCapture();//this is for the IE
		}
		var mouseUp = function() {
			el.style.cursor = "default";

			//In old IE,if i use the removeAttch to remove the binding function,
			//IE just can not drop the function
			document.onmousemove = document.onmouseup = null;
		}
		el.addEventListener("mousedown", function(ev) {
			ev = ev || window.event;

			side = getSide(this, ev);

			document.onmousemove = mouseMove;
			document.onmouseup = mouseUp;

			return false;
		});
		/*el.addEventListener("mouseenter", function(ev) {
			ev = ev || window.event;
			ev.stopPropagation();
			console.log("enter");
			var current = getSide(el, ev);
			//includes is a ES7 Syntax
			//el.style.cursor = setHover(dirs.includes(side) ? current : null);
			el.style.cursor = setHover(dirs.indexOf(current) != -1 ? current : null);
		});*/
		el.addEventListener("mousemove", function(ev) {
			ev = ev || window.event;
			var current = getSide(el, ev);
			//includes is a ES7 Syntax
			//el.style.cursor = setHover(dirs.includes(side) ? current : null);
			el.style.cursor = setHover(dirs.indexOf(current) != -1 ? current : null);
		});
	}
	ZQ.Tools = Tools;

	ZQ.init = function() {

	}
}(window));

