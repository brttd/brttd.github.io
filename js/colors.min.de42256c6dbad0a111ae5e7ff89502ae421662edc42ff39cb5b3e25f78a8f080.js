var _colorArr=document.querySelectorAll('a, .highlight')
var _themeColor=document.getElementById('theme-color')
var hue=0
function update(){_themeColor.content='hsl('+hue+',80%,50%)'
for(var _i=0;_i<_colorArr.length;_i++){_colorArr[_i].style.color='hsl('+hue+',80%,50%)'}
hue=(hue+1)%360
setTimeout(update,1500)}
update()