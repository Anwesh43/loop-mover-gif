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
        this.mover = new Mover()
        this.renderer = new Renderer()
    }
    create(fileName) {
        this.encoder.createReadStream(require('fs').createReadStream(fileName))
        this.encoder.start()
        this.renderer.render((stopcb) => {
            this.context.fillStyle = '#212121'
            this.context.fillRect(0, 0, size, size)
            context.fillStyle = 'white'
            context.strokeStyle = 'white'
            Loop.draw(context, this.n)
            this.mover.draw(context)
            this.mover.update(stopcb)
            this.encoder.addFrame(this.context)
        })
        this.encoder.end(stopcb)
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
        this.state = new State()
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
        this.state.update((dir) => {
            this.x += this.w + dir
        }, stopcb)
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
class Renderer {
    constructor() {
        this.isRunning = true
    }
    render(updatecb) {
        if(this.isRunning) {
            updatecb(() => {
                this.isRunning = false
            })
        }
    }
}
const createLoopMoverGif = (n, fileName) => {
    const loopMoverGif = new LoopMoverGif(n)
    loopMoverGif.create(fileName)
}
module.exports = createLoopMoverGif
