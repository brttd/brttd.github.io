var gridSize,gridPadding,draw_size,cx,cy;var rad=0;var grid=[];var minBrightness=240;function resetGrid(){grid=[];for(x=0;x<w/gridSize;x++){grid.push([]);for(y=0;y<h/gridSize;y++){grid[x].push(Math.random());}}}
resetGrid();function onCanvasSizeChange(){gridSize=w/(w/(Math.min(w,h)/30));draw_size=~~gridSize;gridPadding=gridSize*2;cx=w/2;cy=h/2;ctx.globalAlpha=0.1;resetGrid();}
function draw(){for(var x=gridPadding/2;x<w;x+=gridSize+gridPadding){for(var y=gridPadding/2;y<h;y+=gridSize+gridPadding){var res=Math.sqrt((x-cx)*(x-cx)+(y-cy)*(y-cy));res=Math.abs(res-rad)*0.04;res*=res;var light=min_light+res
ctx.fillStyle='hsl(0,0%,'+light+'%)';ctx.fillRect(~~x,~~y,draw_size,draw_size);}}
rad+=gridSize/3;if(rad>(window.innerWidth+window.innerHeight)/2){rad=0;}
requestAnimationFrame(draw);}
onCanvasSizeChange();requestAnimationFrame(draw);