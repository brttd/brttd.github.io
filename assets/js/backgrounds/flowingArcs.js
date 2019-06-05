var gridSize = 1
var halfGridSize = gridSize / 2
var lineWidth = 1

var gW = Math.ceil(w / gridSize)
var gH = Math.ceil(h / gridSize)

var PI = Math.PI

var lines = []

ctx.lineWidth = lineWidth
ctx.strokeStyle = grey

function onCanvasSizeChange() {
    gridSize = Math.min(w / 6, h / 6)
    gridSize = Math.max(100, gridSize)

    halfGridSize = gridSize / 2

    lineWidth = gridSize / 13

    gW = Math.ceil(w / gridSize)
    gH = Math.ceil(h / gridSize)

    ctx.lineWidth = lineWidth
    ctx.strokeStyle = grey
}

function rad(deg) {
    return (deg * Math.PI) / 180.0
}
function rotate(vec, count) {
    if (count > 90) {
        return rotate([vec[1], -vec[0]], count - 90)
    } else {
        return [vec[1], -vec[0]]
    }
}
function add(a, b) {
    return [a[0] + b[0], a[1] + b[1]]
}

function drawArc(pos, ends, perc) {
    switch (ends) {
        case 'tr':
            ctx.arc(
                pos[0] * gridSize + gridSize,
                pos[1] * gridSize,
                halfGridSize,
                0.5 * PI,
                (1 - perc) * PI
            )
            break
        case 'tl':
            ctx.arc(
                pos[0] * gridSize,
                pos[1] * gridSize,
                halfGridSize,
                perc * PI,
                0.5 * PI
            )
            break
        case 'rt':
            ctx.arc(
                pos[0] * gridSize + gridSize,
                pos[1] * gridSize,
                halfGridSize,
                (perc + 0.5) * PI,
                1 * PI
            )
            break
        case 'rb':
            ctx.arc(
                pos[0] * gridSize + gridSize,
                pos[1] * gridSize + gridSize,
                halfGridSize,
                1 * PI,
                (1.5 - perc) * PI
            )
            break
        case 'br':
            ctx.arc(
                pos[0] * gridSize + gridSize,
                pos[1] * gridSize + gridSize,
                halfGridSize,
                (perc + 1) * PI,
                1.5 * PI
            )
            break
        case 'bl':
            ctx.arc(
                pos[0] * gridSize,
                pos[1] * gridSize + gridSize,
                halfGridSize,
                1.5 * PI,
                -perc * PI
            )
            break
        case 'lt':
            ctx.arc(
                pos[0] * gridSize,
                pos[1] * gridSize,
                halfGridSize,
                0 * PI,
                (0.5 - perc) * PI
            )
            break
        case 'lb':
            ctx.arc(
                pos[0] * gridSize,
                pos[1] * gridSize + gridSize,
                halfGridSize,
                (perc + 1.5) * PI,
                0
            )
            break
    }
}
function drawArc2(pos, ends, perc) {
    switch (ends) {
        case 'tr':
            ctx.arc(
                pos[0] * gridSize + gridSize,
                pos[1] * gridSize,
                halfGridSize,
                (1 - perc) * PI,
                1 * PI
            )
            break
        case 'tl':
            ctx.arc(
                pos[0] * gridSize,
                pos[1] * gridSize,
                halfGridSize,
                0 * PI,
                perc * PI
            )
            break
        case 'rt':
            ctx.arc(
                pos[0] * gridSize + gridSize,
                pos[1] * gridSize,
                halfGridSize,
                0.5 * PI,
                (0.5 + perc) * PI
            )
            break
        case 'rb':
            ctx.arc(
                pos[0] * gridSize + gridSize,
                pos[1] * gridSize + gridSize,
                halfGridSize,
                (1.5 - perc) * PI,
                1.5 * PI
            )
            break
        case 'br':
            ctx.arc(
                pos[0] * gridSize + gridSize,
                pos[1] * gridSize + gridSize,
                halfGridSize,
                1 * PI,
                (1 + perc) * PI
            )
            break
        case 'bl':
            ctx.arc(
                pos[0] * gridSize,
                pos[1] * gridSize + gridSize,
                halfGridSize,
                -perc * PI,
                0
            )
            break
        case 'lt':
            ctx.arc(
                pos[0] * gridSize,
                pos[1] * gridSize,
                halfGridSize,
                (0.5 - perc) * PI,
                0.5 * PI
            )
            break
        case 'lb':
            ctx.arc(
                pos[0] * gridSize,
                pos[1] * gridSize + gridSize,
                halfGridSize,
                -0.5 * PI,
                (perc - 0.5) * PI
            )
            break
    }
}

function line() {
    this.perc = 0

    this.square1 = [0, 0, '']
    var start = ['t', 'r', 'b', 'l']
    this.square2 = [~~(Math.random() * gW), ~~(Math.random() * gH), 'lb']

    this.updateSections()
}
line.prototype.updateAndDraw = function() {
    ctx.beginPath()
    drawArc(this.square1, this.square1[2], this.perc)
    ctx.stroke()

    ctx.beginPath()
    drawArc2(this.square2, this.square2[2], this.perc)
    ctx.stroke()

    this.perc += 0.01

    if (this.perc >= 0.5) {
        this.updateSections()
        //this.perc = 0;
    }
}
line.prototype.updateSections = function() {
    this.square1 = this.square2

    var rand = Math.random()

    switch (this.square1[2][1]) {
        case 't':
            if (rand > 0.5) {
                this.square2 = [this.square1[0], this.square1[1] - 1, 'br']
            } else {
                this.square2 = [this.square1[0], this.square1[1] - 1, 'bl']
            }
            break
        case 'r':
            if (rand > 0.5) {
                this.square2 = [this.square1[0] + 1, this.square1[1], 'lt']
            } else {
                this.square2 = [this.square1[0] + 1, this.square1[1], 'lb']
            }
            break
        case 'b':
            if (rand > 0.5) {
                this.square2 = [this.square1[0], this.square1[1] + 1, 'tr']
            } else {
                this.square2 = [this.square1[0], this.square1[1] + 1, 'tl']
            }
            break
        case 'l':
            if (rand > 0.5) {
                this.square2 = [this.square1[0] - 1, this.square1[1], 'rt']
            } else {
                this.square2 = [this.square1[0] - 1, this.square1[1], 'rb']
            }
            break
    }

    this.square2[0] = ((this.square2[0] % gW) + gW) % gW
    this.square2[1] = ((this.square2[1] % gH) + gH) % gH

    this.perc = 0
}

function updateAndDraw() {
    ctx.clearRect(0, 0, w, h)
    for (var i = 0; i < lines.length; i++) {
        lines[i].updateAndDraw()
    }

    if (lines.length * 10 < gW * gH) {
        if (Math.random() > 0.9) {
            lines.push(new line())
        }
    }

    requestAnimationFrame(updateAndDraw)
}

onCanvasSizeChange()

updateAndDraw()
