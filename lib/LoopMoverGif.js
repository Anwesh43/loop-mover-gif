const GifEncoder = require('gif-encoder')
const Canvas = require('canvas')
const size = 500
class LoopMoreGif {
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
