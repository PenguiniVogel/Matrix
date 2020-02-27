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
var graphics=function(){var interval=250;var canvas=document.getElementById("matrix-canvas");var graphics=canvas.getContext("2d");var resize=function(e){canvas.width=window.innerWidth;canvas.height=window.innerHeight};resize(null);window.addEventListener("resize",resize);graphics.scale(1.2,1.2);var paintRect=function(x,y,width,height){graphics.fillStyle="#000000";graphics.fillRect(x,y,width,height)};var paintDot=function(x,y){graphics.fillStyle="#44ff00";graphics.globalAlpha=Math.max(.05,Math.min(.5,Math.random()));graphics.fillRect(x+2,y+4,2,2);graphics.globalAlpha=1};var chars="ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z";var createItem=function(x){return{x:x,letters:0,max:Math.floor(Math.random()*8)+2,letterY:10,erasing:false,eraseY:0,delay:Math.floor(Math.random()*8e3)+2e3}};var create=function(x){var column=[createItem(x)];setTimeout(function(){return setInterval(function(){if(update(column)){column.push(createItem(x))}graphics.globalAlpha=.005;paintRect(0,0,window.innerWidth,window.innerHeight);graphics.globalAlpha=1;column=column.filter(function(item){return item.eraseY<=window.innerHeight})},interval)},Math.floor(Math.random()*2e3)+1e3)};for(var x=1;x<window.innerWidth;x+=12){if(x+12>window.innerWidth)break;for(var y=0;y<window.innerHeight;y+=12)paintDot(x,y);create(x)}var update=function(column){var needsNew=false;for(var i=0;i<column.length;i++){var item=column[i];if(item.delay<=0){paintRect(item.x,item.letterY,12,12);graphics.strokeStyle="#44ff00";graphics.strokeText(chars[Math.floor(Math.random()*chars.length)],item.x+1,item.letterY);item.letterY+=12;if(item.letters>=item.max&&!item.erasing){item.erasing=true;needsNew=true}else{item.letters+=1}if(item.erasing){paintRect(item.x,item.eraseY,12,12);paintDot(item.x,item.eraseY);item.eraseY+=12}}else{item.delay-=interval}}return needsNew}};setTimeout(graphics,100);