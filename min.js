/**
 MIT License

 Copyright (c) 2020 Felix Vogel

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
var graphics=function(){var r=250;var t=document.getElementById("matrix-canvas");var a=t.getContext("2d");var e=function(e){t.width=window.innerWidth;t.height=window.innerHeight};e(null);window.addEventListener("resize",e);a.scale(1.2,1.2);var n=function(e,t,r,n){a.fillStyle="#000000";a.fillRect(e,t,r,n)};var i=function(e,t){a.fillStyle="#44ff00";a.globalAlpha=Math.max(.05,Math.min(.5,Math.random()));a.fillRect(e+2,t+4,2,2);a.globalAlpha=1};var l="ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z";var o=function(e){return{x:e,letters:0,max:Math.floor(Math.random()*8)+2,letterY:10,erasing:false,eraseY:0,delay:Math.floor(Math.random()*8e3)+2e3}};var f=function(e){var t=[o(e)];setTimeout(function(){return setInterval(function(){if(d(t)){t.push(o(e))}a.globalAlpha=.005;n(0,0,window.innerWidth,window.innerHeight);a.globalAlpha=1;t=t.filter(function(e){return e.eraseY<=window.innerHeight})},r)},Math.floor(Math.random()*2e3)+1e3)};for(var h=1;h<window.innerWidth;h+=12){if(h+12>window.innerWidth)break;for(var s=0;s<window.innerHeight;s+=12)i(h,s);f(h)}var d=function(e){var t=false;e.forEach(function(e){if(e.delay<=0){n(e.x,e.letterY,12,12);a.strokeStyle="#44ff00";a.strokeText(l[Math.floor(Math.random()*l.length)],e.x+1,e.letterY);e.letterY+=12;if(e.letters>=e.max&&!e.erasing){e.erasing=true;t=true}else{e.letters+=1}if(e.erasing){n(e.x,e.eraseY,12,12);i(e.x,e.eraseY);e.eraseY+=12}}else{e.delay-=r}});return t}};setTimeout(graphics,100);