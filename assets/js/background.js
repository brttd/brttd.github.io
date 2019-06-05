var splash = document.querySelector('main')
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var min_light = 90
var max_light = 100

var grey = 'hsl(0, 0%, ' + min_light + '%)'

var w, h, max_w, max_h

var retain_on_resize = false
var temp_image_data = false

if (splash.offsetWidth > splash.offsetHeight) {
    //widescreen layout backgrounds
    //background_scripts.concat({{backgrounds/backgrounds_landscape.json}});
    background_scripts.concat(['cube'])
}

function updateCanvasSize() {
    if (retain_on_resize) {
        temp_image_data = ctx.getImageData(0, 0, w, h)
    }
    if (splash.offsetWidth > max_w) {
        w = canvas.width = splash.offsetWidth
    }
    if (splash.offsetHeight > max_h) {
        h = canvas.height = splash.offsetHeight
    }
    if (w > max_w || h > max_h) {
        max_w = w
        max_h = h

        if (retain_on_resize) {
            ctx.putImageData(temp_image_data, 0, 0)
            temp_image_data = false
        }
        if (typeof onCanvasSizeChange == 'function') {
            onCanvasSizeChange()
        }
    }
    canvas.style.left = ~~((splash.offsetWidth - w) / 2) + 'px'
    canvas.style.top = ~~((splash.offsetHeight - h) / 2) + 'px'
}
window.onload = function() {
    max_w = w = canvas.width = splash.offsetWidth
    max_h = h = canvas.height = splash.offsetHeight

    window.addEventListener('resize', updateCanvasSize)

    var script = document.createElement('script')
    script.src =
        background_scripts[
            Math.round(Math.random() * (background_scripts.length - 1))
        ]
    if (
        background_scripts.indexOf(
            location.search
                .split('=')
                .pop()
                .split('?')
                .pop()
        ) != -1
    ) {
        script.src =
            'backgrounds/' +
            location.search
                .split('=')
                .pop()
                .split('?')
                .pop() +
            '.js'
    }
    script.onload = function() {
        //only display the background once the script has started running
        canvas.style.opacity = '1'
    }
    document.body.appendChild(script)
}
