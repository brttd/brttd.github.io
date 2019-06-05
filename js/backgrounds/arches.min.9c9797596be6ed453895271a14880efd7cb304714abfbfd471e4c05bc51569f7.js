retain_on_resize=true;var pixels;var lines=[];var curve=.7;var maxCurveDif=0.5;var lineSegmentLength=3;var lineMinWidth=10;var lineMaxWidth=20;var color=grey;function onCanvasSizeChange(){lineSegmentLength=Math.max(1.75,Math.round((w+h)/1000));lineMinWidth=Math.max(3,Math.round((w+h)/300));lineMaxWidth=Math.max(5,Math.round((w+h)/150));ctx.strokeStyle=color;}
function rotate(vec,angle){angle=angle*Math.PI/180.0;return[(vec[0]*Math.cos(angle))-(vec[1]*Math.sin(angle)),(vec[0]*Math.sin(angle))+(vec[1]*Math.cos(angle))];}
function onScreen(pos){return(pos[0]>0&&pos[1]>0&&pos[0]<w&&pos[1]<h);}
function line(pos,dir,parentWidth){this.pos=pos?[pos[0],pos[1]]:[~~(Math.random()*w),~~(Math.random()*h)];if(dir){this.dir=[dir[0],dir[1]];this.pos[0]+=dir[0]*(parentWidth/2.2);this.pos[1]+=dir[1]*(parentWidth/2.2);}else{this.dir=rotate([1,0],Math.random()*360);}
this.angle=Math.random()<0.5?(curve+(Math.random()*maxCurveDif*2)-maxCurveDif):(-curve+(Math.random()*maxCurveDif*2)-maxCurveDif);this.width=lineMinWidth+Math.random()*(lineMaxWidth-lineMinWidth);}
line.prototype.age=0;line.prototype.lastSpawn=-20;line.prototype.kill=false;line.prototype.updateAndDraw=function(){this.dir=rotate(this.dir,this.angle);if(pixels.data[((w*~~(this.pos[1]+this.dir[1]*(lineSegmentLength+1)))+~~(this.pos[0]+this.dir[0]*(lineSegmentLength+1)))*4+3]>0){this.kill=true;}
ctx.lineWidth=this.width;ctx.beginPath();ctx.moveTo(this.pos[0],this.pos[1]);ctx.lineTo(this.pos[0]+this.dir[0]*lineSegmentLength,this.pos[1]+this.dir[1]*lineSegmentLength);ctx.stroke();this.pos[0]+=this.dir[0]*(lineSegmentLength-0.5);this.pos[1]+=this.dir[1]*(lineSegmentLength-0.5);this.age++;this.lastSpawn++;}
line.prototype.spawn=function(){lines.push(new line(this.pos,rotate(this.dir,(this.angle<0)?90:-90),this.width));this.lastSpawn=0;}
var counter=0;function updateAndDraw(){if(counter%4==0){pixels=ctx.getImageData(0,0,w,h);if(lines.length==0){updateAndDraw=function(){};}}
for(var i=lines.length-1;i>=0;i--){lines[i].updateAndDraw(pixels);if(Math.random()>=0.8&&lines[i].lastSpawn>=70&&onScreen(lines[i].pos)){lines[i].spawn();}
if(lines[i].kill||lines[i].age*lines[i].angle>=360){lines.splice(i,1);}}
counter++;requestAnimationFrame(updateAndDraw);}
onCanvasSizeChange();if(w>h){lines.push(new line([w/4,h/2]));lines.push(new line([w/2+w/4,h/2]));}else if(h>w){lines.push(new line([w/2,h/4]));lines.push(new line([w/2,h/4+h/2]));}else{lines.push(new line([w/2,h/2]));}
requestAnimationFrame(updateAndDraw);