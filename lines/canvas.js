const fps = 40
const gridSquareSize = 1
const initSnakeCount = 100
const snakeLen = 15
const spacingCoefficient = 200

let lineW;
let lineH;


let snakeTimeout;
let loopTimeout;

var canvas
var ctx

window.onload = e => {
    canvas = document.getElementById('canvas')
    canvas.width = window.innerWidth*2
    canvas.height = window.innerHeight*2
    ctx = canvas.getContext('2d')

    // ctx.transform(1, 1, 1, 1, 1, 1);
    // ctx.rotate(5 * Math.PI / 180);

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
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    build()
}, 500)

window.addEventListener('resize', resizePostBounce);

const checkPos = (y, x) => {
    if (y >= 0 && x >= 0 && y < lineH && x < lineW)
        return lines[y][x];
    else
        return false;
}

const update = () => {
    for (var y = 0; y < lineH; y++) {
        for (var x = 0; x < lineW; x++) {
            if (lines[y][x] == snakeLen) {
                choices = []
                // if (checkPos(y - 1, x) === 0 && (checkPos(y - 2, x) == 0))
                    // choices.push([y - 1, x])
                // if (checkPos(y + 1, x) === 0 && (checkPos(y + 2, x) == 0))
                    // choices.push([y + 1, x])
                if (checkPos(y, x + 1) === 0 && (checkPos(y, x + 2) == 0)) {
                    choices.push([y, x + 1])
                }
                if (checkPos(y, x - 1) === 0 && (checkPos(y, x - 2) == 0 )) {
                    choices.push([y, x - 1])
                }

                if (choices.length > 0) {
                    next = choices[~~(Math.random() * choices.length)]
                    lines[next[0]][next[1]] = snakeLen + 1
                } else {
                    lines[y][x] = 0
                }
            }
        }
    }
    for (var y = 0; y < lines.length; y++) {
        for (var x = 0; x < lines[0].length; x++) {
            if (lines[y][x] == 1) {
                lines[y][x] = 0

            }
            else if (lines[y][x] > 0) {
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

    ctx.fillStyle = "#05041a"
    ctx.clearRect(0, 0, wCan, hCan)
    ctx.fillRect(0, 0, wCan, hCan)

    for (var y = 0; y < yLen; y++) {
        for (var x = 0; x < xLen; x++) {
            if (lines[y][x] > 0) {
                let col = 10 * lines[y][x];
                ctx.fillStyle = "rgb(" + col + "," + col + "," + 3 * col + ")"
            } else {
                ctx.fillStyle = "#000000"
            }

            var xPos = Math.round(x * ((wCan + Math.floor(wCan / xLen) - gridSquareSize) / (xLen)))
            var yPos = Math.round(y * ((hCan + Math.floor(hCan / yLen) - gridSquareSize) / (yLen)))

            ctx.fillRect(xPos, yPos, gridSquareSize, gridSquareSize)

            // if (lines[y][x] > 0 && lines[y + 1] && lines[y + 1][x] > 0 && ((lines[y + 1][x] == lines[y][x] - 1) || (lines[y + 1][x] == lines[y][x] + 1))) {
            //     // ctx.fillRect(xPos, yPos, gridSquareSize, Math.ceil(hCan / yLen))
            // }
            if (lines[y][x] > 0 && lines[y][x + 1] > 0) {
                if(lines[y][x+1] == snakeLen && lines[y][x+4] == snakeLen) {
                    // ctx.fillStyle = "#09072e"
                    // ctx.fillRect(xPos, yPos, Math.ceil(wCan / xLen), gridSquareSize)
                } else {
                    ctx.fillRect(xPos, yPos, Math.ceil(wCan / xLen), gridSquareSize)
                }
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

const recursiveSnake = () => {
    createSnake()
    snakeTimeout = setTimeout(recursiveSnake, (1000 / (fps)))
}

const createSnake = () => {
    let randVar = rand(1, 3)
    if (randVar == 1)
        lines[rand(0, lineH)][0] = snakeLen
    else
        lines[rand(0, lineH)][lineW - 1] = snakeLen
}

const build = () => {
    clearTimeout(loopTimeout)
    clearTimeout(snakeTimeout)

    lineW = ~~((window.innerHeight / window.innerHeight) * spacingCoefficient)
    lineH = ~~((window.innerHeight / window.innerWidth) * spacingCoefficient)

    lines = new Array(lineH)
    for (var y = 0; y < lineH; y++) {
        lines[y] = new Array(lineW)
    }
    for (var y = 0; y < lineH; y++) {
        for (var x = 0; x < lineW; x++) {
            lines[y][x] = 0
        }
    }

    recursiveSnake()
    render()
}