const Waterline = require('waterline');

class WaterlineFacade {
  constructor() {
    this.waterline = new Waterline()
  }

  initialize(config) {
    return new Promise((resolve, reject) => {
      this.waterline.initialize(config, function(err, ontology) {
        if (err) {
          return reject(err)
        }
        return resolve(ontology)
      })
    })
  }

  registerModel(model) {
    return this.waterline.registerModel(model)
  }

  extend(model) {
    return Waterline.Collection.extend(model)
  }
}

module.exports = WaterlineFacade