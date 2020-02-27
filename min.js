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
function graphics(){var a=250;var t=document.getElementById("matrix-canvas");var i=t.getContext("2d");var e=function(e){t.width=window.innerWidth;t.height=window.innerHeight};e(null);window.addEventListener("resize",e);i.scale(1.2,1.2);var l=function(e,t,r,n){i.fillStyle="#000000";i.fillRect(e,t,r,n)};var o=function(e,t){i.fillStyle="#44ff00";i.globalAlpha=Math.max(.05,Math.min(.5,Math.random()));i.fillRect(e+2,t+4,2,2);i.globalAlpha=1};var f="ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z";var r=function(e){var t=[d(e)];setTimeout(function(){return setInterval(function(){if(s(t)){t.push(d(e))}i.globalAlpha=.005;l(0,0,window.innerWidth,window.innerHeight);i.globalAlpha=1;t=t.filter(function(e){return e.eraseY<=window.innerHeight})},a)},Math.floor(Math.random()*2e3)+1e3)};for(var n=1;n<window.innerWidth;n+=12){if(n+12>window.innerWidth)break;for(var h=0;h<window.innerHeight;h+=12)o(n,h);r(n)}var s=function(e){var t=false;for(var r=0;r<e.length;r++){var n=e[r];if(n.delay<=0){l(n.x,n.letterY,12,12);i.strokeStyle="#44ff00";i.strokeText(f[Math.floor(Math.random()*f.length)],n.x+1,n.letterY);n.letterY+=12;if(n.letters>=n.max&&!n.erasing){n.erasing=true;t=true}else{n.letters+=1}if(n.erasing){l(n.x,n.eraseY,12,12);o(n.x,n.eraseY);n.eraseY+=12}}else{n.delay-=a}}return t};var d=function(e){return{x:e,letters:0,max:Math.floor(Math.random()*8)+2,letterY:10,erasing:false,eraseY:0,delay:Math.floor(Math.random()*8e3)+2e3}}}setTimeout(function(){return graphics()},100);