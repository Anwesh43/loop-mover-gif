const GifEncoder = require('gifencoder')
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
        this.encoder.setQuality(100)
        this.encoder.setRepeat(0)
        this.encoder.setDelay(50)
        this.mover = new Mover((size)/(2*n), n)
        this.renderer = new Renderer()
    }
    create(fileName) {

        this.encoder.createReadStream().pipe(require('fs').createWriteStream(fileName))
        this.encoder.start()
        this.renderer.render((stopcb) => {
            //console.log("in render")
            this.context.fillStyle = '#212121'
            this.context.fillRect(0, 0, size, size)
            this.context.fillStyle = 'white'
            this.context.strokeStyle = 'white'
            //console.log("here here")
            Loop.draw(this.context, this.n)
            //console.log("come here")
            this.mover.draw(this.context)
            this.mover.update(() => {
                stopcb()
                this.encoder.end()
            })
            this.encoder.addFrame(this.context)
        })

    }
}
class Loop {
    static draw(context, n) {
        context.lineWidth = size/80
        const r = size / (2 * n)
        for(var i = 0; i < n; i++) {
            context.save()
            context.translate(r + 2 * r * i, size/2)
            context.beginPath()
            for(var j = 180; j>= 0; j -= 10) {
                const x = r * Math.cos(j * Math.PI/180), y = r * Math.sin(j * Math.PI/180)
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
        this.state = new State(n)
        console.log(x)
    }
    draw(context) {
        context.fillStyle = 'white'
        context.save()
        context.translate(this.x, size/2)
      //  console.log(this.scale)
        context.rotate(Math.PI * (1 -this.state.scale))
        context.beginPath()
        context.arc(this.w/2 - this.w/10, 0, this.w/10, 0, 2 * Math.PI)
        context.fill()
        context.restore()
    }
    update(stopcb) {
        //console.log("here update")
        this.state.update((dir) => {
            this.x += this.w * dir
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
        this.scale += 0.05 * this.dir
        //console.log(this.scale)
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale
            this.j += this.dir
            updatecb(this.dir)
            console.log(this.j)
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
        //console.log("coming here")
        while(this.isRunning) {
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
