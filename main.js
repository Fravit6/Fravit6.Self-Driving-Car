const carCanvas = document.getElementById('carCanvas')
carCanvas.width = 200
const networkCanvas = document.getElementById('networkCanvas')
networkCanvas.width = 300

const carCtx = carCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'KEYS')
const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI')

const cars = generateCars(1000)
let bestCar = cars[0]

// Se avevo già effettuato una run
if (localStorage.getItem('bestBrain')) {
  for (let i = 0; i < cars.length; i++) {
    // sostituisco la rete con quella el campione precedente
    cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'))
    // Tutte tranne la prima saranno leggermente diverse
    if (i !== 0) NeuralNetwork.mutate(cars[i].brain, 0.1)
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, 'DUMMY', 2),
]

animate()

// Salvo il campione
function save() {
  localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain))
}

function discard() {
  localStorage.removeItem('bestBrain')
}

function generateCars(N) {
  const cars = []
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'))
  }

  return cars
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, [])
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic)
  }

  // Tengo d'occhio la macchina che arriva più in fondo
  bestCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)))

  car.update(road.borders, traffic)

  carCanvas.height = window.innerHeight
  networkCanvas.height = window.innerHeight

  carCtx.save()
  // sposto la camera fissando l'inquadratura alla car
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)

  road.draw(carCtx)
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, 'red')
  }

  carCtx.globalAlpha = 0.2
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, 'blue')
  }
  carCtx.globalAlpha = 1

  // La prima auto è l'unica con i sensori e che dobbiamo seguire
  bestCar.draw(carCtx, 'blue', true)

  carCtx.restore()

  networkCtx.lineDashOffset = -time / 50
  Visualizer.drawNetwork(networkCtx, bestCar.brain)

  requestAnimationFrame(animate)
}
