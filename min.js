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
function graphics(){var a=250;var t=document.getElementById("matrix-canvas");var i=document.getElementById("matrix-canvas").getContext("2d");window.addEventListener("resize",e);function e(e){t.width=window.innerWidth;t.height=window.innerHeight}e();i.scale(1.2,1.2);var l="ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z";for(var n=1;n<window.innerWidth;n+=12){if(n+12>window.innerWidth){break}for(var r=0;r<window.innerHeight;r+=12){s(n,r)}o(n)}function o(e){var t=[h(e)];setTimeout(function(){setInterval(function(){if(f(t)){t.push(h(e))}i.globalAlpha=.005;d(0,0,window.innerWidth,window.innerHeight);i.globalAlpha=1;t=t.filter(function(e){return e.eraseY<=window.innerHeight})},a)},Math.floor(Math.random()*2e3)+1e3)}function f(e){var t=false;for(var n=0;n<e.length;n++){var r=e[n];if(r.delay<=0){d(r.x,r.letterY,12,12);i.strokeStyle="#44ff00";i.strokeText(l[Math.floor(Math.random()*l.length)],r.x+1,r.letterY);r.letterY+=12;if(r.letters>=r.max&&!r.erasing){r.erasing=true;t=true}else{r.letters+=1}if(r.erasing){d(r.x,r.eraseY,12,12);s(r.x,r.eraseY);r.eraseY+=12}}else{r.delay-=a}}return t}function h(e){return{x:e,letters:0,max:Math.floor(Math.random()*8)+2,letterY:10,erasing:false,eraseY:0,delay:Math.floor(Math.random()*8e3)+2e3}}function d(e,t,n,r){i.fillStyle="#000000";i.fillRect(e,t,n,r)}function s(e,t){i.fillStyle="#44ff00";i.globalAlpha=Math.max(.05,Math.min(.5,Math.random()));i.fillRect(e+2,t+4,2,2);i.globalAlpha=1}}setTimeout(function(){graphics()},100);