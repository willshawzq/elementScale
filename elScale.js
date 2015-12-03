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
			disL = "", disT = "",
			baseX = 0, baseY = 0;

		var dirs = dir ? (function(str){
				str = str.toUpperCase();
				var arr = str.split("");
				if(arr.length > 1) arr.push(str);
			})(dir) : "R L T B RT RB LT LB C".split(" ");

		//set offset value
		el.dataset.x = 0;
		el.dataset.y = 0;

		var getSide = function(el, ev) {
			var elRect = el.getBoundingClientRect();
			elWidth = elRect.width;
			elHeight = elRect.height;
			disX = ev.clientX;
			disY = ev.clientY;
			disL = elRect.left;
			disT = elRect.top;

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
					el.dataset.x = baseX + (ev.clientX - disX);
				},
				"T": function(el, ev) {
					el.style.height = elHeight + (disY -ev.clientY) + "px";
					el.dataset.y = baseY + (ev.clientY - disY);
				},
				"B": function(el, ev) {
					el.style.height = elHeight + (ev.clientY - disY) + "px";
				},
				"C": function(el, ev) {
					el.dataset.x = baseX + (ev.clientX - disX);
					el.dataset.y = baseY + (ev.clientY - disY);
				}
			};

			var funcList = {};
			
			dirs.forEach(function(val, i) {
				funcList[val] = (function(val) {
					return function(el, ev){
						val.split("").forEach(function(v, k) {
							return baseFunc[v](el, ev);
						});
						el.style.transform = 'translate(' + el.dataset.x + 'px,' + el.dataset.y + 'px)';
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
				usable = side && dirs.indexOf(side) != -1;
				//usable = side && dirs.includes(side) 
				//			&& (side.indexOf("C") == -1);

			if(usable) func[side](el, ev);

			//this is for the IE
			if(el.releaseCapture) el.releaseCapture();
		}
		var mouseUp = function() {
			//In old IE,if i use the removeAttch to remove the binding function,
			//IE just can not drop the function
			document.onmousemove = document.onmouseup = null;
			el.addEventListener("mouseout", elMouseOut, false);
			el.addEventListener("mousemove", elMouseMove, false);
		}
		var elMouseMove = function(ev) {
			ev = ev || window.event;
			var current = getSide(el, ev);
			//includes is a ES7 Syntax
			//el.style.cursor = setHover(dirs.includes(side) ? current : null);
			var pointer = setHover(dirs.indexOf(current) != -1 ? current : '');
			el.style.cursor = pointer;
			document.body.style.cursor = pointer;
		}
		var elMouseOut = function(ev) {
			el.style.cursor = '';
			document.body.style.cursor = '';

			return false;
		}
		el.addEventListener("mousedown", function(ev) {
			ev = ev || window.event;
			side = getSide(this, ev);

			baseX = parseFloat(el.dataset.x);
			baseY = parseFloat(el.dataset.y);
			document.onmousemove = mouseMove;
			document.onmouseup = mouseUp;

			el.removeEventListener("mousemove", elMouseMove, false);
			el.removeEventListener("mouseout", elMouseOut, false);

			return false;
		});
		el.addEventListener("mousemove", elMouseMove, false);
	}
	ZQ.Tools = Tools;
}(window));

