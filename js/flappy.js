function newElement(tagName, className) {
    const element = document.createElement(tagName)
    element.className = className
    return element
}

function Barrier(reverse =false) {
    this.element = newElement('div', 'barrier')

    const border = newElement('div', 'border')
    const body = newElement('div', 'body')
    this.element.appendChild(reverse ? body : border)
    this.element.appendChild(reverse ? border : body)

    this.setHeigth = height => body.style.height = `${height}px`
}

// const b = new Barrier()
// b.setHeigth(200)
// document.querySelector('[flappy]').appendChild(b.element)

function Barriers(height, gap, x) {
    this.element = newElement('div', 'barriers')

    this.superior = new Barrier(true)
    this.inferior = new Barrier()

    this.element.appendChild(this.superior.element)
    this.element.appendChild(this.inferior.element)

    this.randomGap = () => {
        const superiorHeight = Math.random() * (height - gap)
        const inferiorHeight = height - gap - superiorHeight
        this.superior.setHeigth(superiorHeight)
        this.inferior.setHeigth(inferiorHeight)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.randomGap()
    this.setX(x)
}

// const b = new Barriers(700, 200, 400)
// document.querySelector('[flappy]').appendChild(b.element)

function MoveBarriers(height, width, gap, space, notifyPoint) {
    this.pairs = [
        new Barriers(height, gap, width), 
        new Barriers(height, gap, width + space),
        new Barriers(height, gap, width + space * 2), 
        new Barriers(height, gap, width + space * 3)
    ]

    const displacement = 3
    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - displacement)

            if (pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + space * this.pairs.length)
                pair.randomGap()
            }

            const middle = width / 2
            const crossedTheMiddle = pair.getX() + displacement >= middle
                && pair.getX() < middle
            crossedTheMiddle && notifyPoint()
        })
    }
}

const barriers = new MoveBarriers(700, 1200, 200, 400)
const gameArea = document.querySelector('[flappy]')
barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))
setInterval(() => {
    barriers.animate()
}, 20);