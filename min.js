var Utility;(function(t){var e=function(){function t(t,e,i,o){if(o===void 0){o=255}this.r=t;this.g=e;this.b=i;this.a=o}t.prototype.fromRGBA=function(t,e,i,o){this.r=Math.max(0,Math.min(255,t));this.g=Math.max(0,Math.min(255,e));this.b=Math.max(0,Math.min(255,i));this.a=Math.max(0,Math.min(255,o));return this};t.prototype.toRGBA=function(t){if(t===void 0){t=this.a}return"rgba("+this.r+", "+this.g+", "+this.b+", "+t+")"};t.prototype.fromRGB=function(t,e,i){return this.fromRGBA(t,e,i,255)};t.prototype.toRGB=function(){return"rgb("+this.r+", "+this.g+", "+this.b+")"};t.prototype.fromHex=function(t){if(!t.match(/^#(:?[0-9a-fA-F]{2}){1,3}$/g))return this;t=t.substr(1);for(var e=0;e<t.length;e+=2){var i=parseInt(t.substr(e,2),16);switch(e){case 0:{this.r=i;break}case 2:{this.g=i;break}case 4:{this.b=i;break}default:break}}return this};t.prototype.toHex=function(){return"#"+((this.r<16?"0":"")+this.r.toString(16))+((this.g<16?"0":"")+this.g.toString(16))+((this.b<16?"0":"")+this.b.toString(16))};return t}();t.Color=e;var i=function(){function r(t,e){this.name=t;this.value=e;this.expires=new Date;this.expires.setTime(this.expires.getTime()+7*24*60*60*1e3)}r.getCookie=function(t){var e=document.cookie.indexOf(t+"=");if(e===-1)return null;var i=document.cookie.substr(e);if(i.indexOf("; ")!==-1)i=i.substring(0,i.indexOf("; "));var o=i.split("=");return new r(o[0],o[1])};r.prototype.setExpirationDate=function(t){this.expires=t;return this};r.prototype.getName=function(){return this.name};r.prototype.getValue=function(){return this.value};r.prototype.setValue=function(t){this.value=t;return this};r.prototype.add=function(){document.cookie=this.name+"="+this.value+"; expires="+this.expires.toUTCString()+"; path=/"};r.prototype.remove=function(){var t=new Date;t.setTime(t.getTime()-24*60*60*1e3);document.cookie=this.name+"=; expires="+t.toUTCString()+"; path=/"};return r}();t.Cookie=i})(Utility||(Utility={}));var Color=Utility.Color;var Cookie=Utility.Cookie;var options={textColor:new Color(68,255,0),gradient:false};(function(){var t=Cookie.getCookie("text_color");if(t)options.textColor.fromHex(t.getValue());else{t=new Cookie("text_color","#44ff00");t.add()}var e=Cookie.getCookie("gradient");if(e)options.gradient=e.getValue()==="true";else{e=new Cookie("gradient","off");e.add()}var i=document.querySelector('#options input[type="color"]');i.value=options.textColor.toHex();i.addEventListener("input",function(t){var e=t.target.value;new Cookie("text_color",e).add();options.textColor.fromHex(e)});var o=document.querySelector('#options input[type="checkbox"]');o.checked=options.gradient;o.addEventListener("input",function(t){var e=t.target.checked;new Cookie("gradient",""+e).add();options.gradient=e});window.addEventListener("keyup",function(t){if(t.key&&t.key.toLowerCase()==="o"){var e=document.querySelector("#options");if(e.style["display"]==="")e.style["display"]="none";else e.style["display"]=""}})})();var graphics=function(){var r=250;var e=document.getElementById("matrix-canvas");var n=e.getContext("2d");var t=function(t){e.width=window.innerWidth;e.height=window.innerHeight};t(null);window.addEventListener("resize",t);n.scale(1.2,1.2);var a=function(t,e,i,o,r){if(r===void 0){r="#000000"}n.fillStyle=r;n.fillRect(t,e,i,o)};var s=function(t,e,i){var o=Math.max(.05,Math.min(.5,Math.random()));if(options.gradient&&i)n.fillStyle="hsla("+i.hsv+", 100%, 50%, "+o+")";else n.fillStyle=options.textColor.toRGBA(o);n.fillRect(t+5,e+4,2,2)};var h=[];var i=function(t){for(var e=0;e<t.length;e++){h.push({offsetX:Math.floor(6-n.measureText(t[e]).width/2),char:t[e]})}};i("ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z");var l=function(){return{letters:0,max:Math.floor(Math.random()*8)+6,letterY:10,erasing:false,eraseY:0,delay:Math.floor(Math.random()*8e3)+2e3}};var o=function(t){var e={x:t,hsv:0,items:[l()]};setTimeout(function(){return setInterval(function(){c(e);if(options.gradient){e.hsv+=1;if(e.hsv>=360)e.hsv=0}},r)},Math.floor(Math.random()*2e3)+1e3)};for(var u=1;u<window.innerWidth;u+=12){if(u+12>window.innerWidth)break;for(var f=0;f<window.innerHeight;f+=12)s(u,f);o(u)}var c=function(i){var o=false;i.items.forEach(function(t){if(t.delay<=0){a(i.x,t.letterY,12,12);if(options.gradient)n.strokeStyle="hsl("+i.hsv+", 100%, 50%)";else n.strokeStyle=options.textColor.toRGB();var e=h[Math.floor(Math.random()*h.length)];n.strokeText(e.char,i.x+e.offsetX,t.letterY);t.letterY+=12;if(t.letters>=t.max&&!t.erasing){t.erasing=true;o=true}else{t.letters+=1}if(t.erasing){a(i.x,t.eraseY,12,12);s(i.x,t.eraseY,i);t.eraseY+=12}}else{t.delay-=r}});if(o)i.items.push(l());i.items=i.items.filter(function(t){return t.eraseY<window.innerHeight});a(i.x,0,12,window.innerHeight,"rgba(0, 0, 0, 0.1)")}};setTimeout(graphics,100);