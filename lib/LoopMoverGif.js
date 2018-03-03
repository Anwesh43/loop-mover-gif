const GifEncoder = require('gif-encoder')
const Canvas = require('canvas')
const size = 500
class LoopMoverGif {
    constructor(n) {
        this.n = n
        this.canvas = new Canvas()
        this.canvas.width = size
        this.canvas.height = size
        this.context = this.canvas.getContext('2d')
        this.encoder = new GifEncoder(size, size)
        this.encoder.setDelay(50)
        this.encoder.setQuality(100)
        this.encoder.setRepeat(0)
    }
}
class Loop {
    static draw(context, n) {
        const r = size / (2 * n)
        for(var i = 0; i < n; i++) {
            context.save()
            context.translate(r + 2 * r * i, size/2 + r)
            context.beginPath()
            for(var i = 180; i >= 0; i -= 10) {
                const x = r * Math.cos(i * Math.PI/180), y = r * Math.sin(i * Math.PI/180)
                if(i == 180) {
                    context.moveTo(x, y)
                }
                else {
                    context.lineTo(x, y)
                }
            }
            context.stroke()
            context.restore()
        }
    }
}
class Mover {
    constructor(x, n) {
        this.x = x
        this.w = size / n
    }
    draw(context) {
        context.save()
        context.translate(this.x, size/2)
        context.rotate(Math.PI)
        context.beginPath()
        context.arc(this.w/2, 0, this.w/25, 0, 2 * Math.PI)
        context.fill()
        context.restore()
    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }
}
class State {
    constructor(n) {
        this.scale = 0
        this.j = 0
        this.n = n
        this.dir = 1
        this.prevScale = 0
    }
    update(updatecb, stopcb) {
        this.scale += 0.1 * this.dir
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale
            this.j += this.dir
            updatecb(this.dir)
            if(this.j == this.n || this.j == -1) {
                this.prevScale = this.scale + this.dir
                this.dir *= -1
                this.j += this.dir
                if(this.dir == 1) {
                    this.dir = 0
                    stopcb()
                }
            }
        }
    }
}
