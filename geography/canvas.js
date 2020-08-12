const fps = 10
const lineW = 100
const lineH = 50
const gridSquareSize = 1
const snakeLen = 5


var canvas
var ctx

window.onload = e => {
    canvas = document.getElementById('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx = canvas.getContext('2d')

    build()
}

const debounce = (func, wait) => {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const resizePostBounce = debounce(() => {
    console.log("debounced");
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    build()
}, 500)

window.addEventListener('resize', resizePostBounce);

const update = () => {
    for (var y = 0; y < lines.length; y++) {
        for (var x = 0; x < lines[0].length; x++) {
            if (lines[y][x] == snakeLen) {
                choices = []
                if (y - 1 >= 0 && lines[y - 1][x] == 0)
                    choices.push([y - 1, x])
                if (y + 1 < lines.length && lines[y + 1][x] == 0)
                    choices.push([y + 1, x])
                if (x + 1 < lines[0].length && lines[y][x + 1] == 0)
                    choices.push([y, x + 1])
                if (x - 1 >= 0 && lines[y][x - 1] == 0)
                    choices.push([y, x - 1])

                if (choices.length > 0) {
                    next = choices[~~(Math.random() * choices.length)]
                    lines[next[0]][next[1]] = snakeLen + 1
                } else {
                    lines[y][x] == 0
                }
            }
        }
    }
    for (var y = 0; y < lines.length; y++) {
        for (var x = 0; x < lines[0].length; x++) {
            if (lines[y][x] > 1) {
                lines[y][x]--
            }
        }
    }
}

const render = () => {
    var hCan = canvas.height
    var wCan = canvas.width
    var yLen = lines.length
    var xLen = lines[0].length

    ctx.fillStyle = "#FFFFFF"
    ctx.clearRect(0, 0, wCan, hCan)
    // ctx.fillRect(0, 0, wCan, hCan)

    for (var y = 0; y < yLen; y++) {
        for (var x = 0; x < xLen; x++) {
            // document.write(lines[y][x] + " ")
            // if (lines[y][x] == 5) {
            //     ctx.fillStyle = "#FF00FF"
            // } else if (lines[y][x] == 4) {
            //     ctx.fillStyle = "#00FFFF"
            // } else if (lines[y][x] == 3) {
            //     ctx.fillStyle = "#0000FF"
            // } else if (lines[y][x] == 2) {
            //     ctx.fillStyle = "#00FF00"
            // } else {
            //     ctx.fillStyle = "#000000"
            // }
            if (lines[y][x] > 0) {
                ctx.fillStyle = "#00FF00"
            } else {
                ctx.fillStyle = "#000000"
            }


            var xPos = Math.round(x * ((wCan + Math.floor(wCan / xLen) - gridSquareSize) / (xLen)))
            var yPos = Math.round(y * ((hCan + Math.floor(hCan / yLen) - gridSquareSize) / (yLen)))

            ctx.fillRect(xPos, yPos, gridSquareSize, gridSquareSize)

            if (lines[y][x] > 0 && lines[y + 1] && lines[y + 1][x] > 0 && ((lines[y + 1][x] == lines[y][x] - 1) || (lines[y + 1][x] == lines[y][x] + 1))) {
                ctx.fillRect(xPos, yPos, gridSquareSize, Math.ceil(hCan / yLen))
            }
            if (lines[y][x] > 0 && lines[y][x + 1] > 0 && ((lines[y][x + 1] == lines[y][x] - 1) || (lines[y][x + 1] == lines[y][x] + 1))) {
                ctx.fillRect(xPos, yPos, Math.ceil(wCan / xLen), gridSquareSize)
            }
        }
    }
    update()

    //Loops Animation
    loopTimeout = window.setTimeout(() => {
        window.requestAnimationFrame(render);
    }, (1000 / (fps)));
}

const rand = (min, max) => {
    return ~~(Math.random() * (max - min) + min);
}

const build = () => {
    lines = new Array(lineH)

    for (var y = 0; y < lineH; y++) {
        lines[y] = new Array(lineW)
    }
    for (var y = 0; y < lineH; y++) {
        for (var x = 0; x < lineW; x++) {
            lines[y][x] = 0
        }
    }

    for (var i = 0; i < 20; i++) {
        lines[rand(0, lineH)][rand(0, lineW)] = snakeLen
    }
    render()
}