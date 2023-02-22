class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = []
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]))
    }
  }

  // Calcolo l'output finale della network
  static feedForward(givenInputs, network) {
    // Calcola il primo livello di output
    let outputs = Level.feedForward(givenInputs, network.levels[0])

    // Calcolo quello di tutti gli altri livelli
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i])
    }

    return outputs
  }

  // muta un network di una percentuale passata
  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        // la mutazione avviene verso un nuovo valore random
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount)
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          )
        }
      }
    })
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount)
    this.outputs = new Array(outputCount)
    this.biases = new Array(outputCount)

    // Collego ogni nodo input con ogni nodo output
    this.weights = []
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount)
    }

    Level.#randomize(this)
  }

  // Imposta un peso randomico ad ogni arco da un nodo input ad un nodo output
  // Il peso indica la qualità della decisione
  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1
    }
  }

  // Algoritmo che calcola l'output di un dato livello
  static feedForward(givenInputs, level) {
    // Prelevo tutti gli input
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i]
    }

    // Scelgo gli output
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0

      // Ciclo gli input e moltiplico il peso dell'arco per il suo valore di input
      // Calcolo la somma totale per capire la qualità dell'output
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i]
      }

      // Se l'attuale ciclo ha restituito un risultato migliore del vecchio bias
      if (sum > level.biases[i]) level.outputs[i] = 1
      else level.outputs[i] = 0
    }

    return level.outputs
  }
}
