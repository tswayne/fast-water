const Waterline = require('waterline');
const util = require('util')
const fs = require('fs')
const readdir = util.promisify(fs.readdir)
const waterlineConfig = require('./waterline-config')
const schema = require('./schema')
const deepmerge = require('deepmerge')
const fp = require('fastify-plugin')

module.exports =  fp(async (fastify, opts) => {
  const waterline = new Waterline();
  const initialize = util.promisify(waterline.initialize)

  const result = schema.validate(opts)
  if (result.error) {
    return next(Error(`fast-water config invalid: ${result.error}`))
  }
  const modelDefaults = opts.modelDefaults
  const config =  waterlineConfig(opts)
  const modelDir = opts.modelPath
  const decoratorName = opts.decoratorName ? opts.decoratorName : 'models'

  const files = await readdir(modelDir)
  const modelsNames = files.filter(file => !fs.statSync(`${modelDir}/${file}`).isDirectory())
  modelsNames.forEach(modelName => {
    const model = require(`${modelDir}/${modelName}`)
    const decoratedModel = deepmerge(modelDefaults, model)

    const wm = Waterline.Collection.extend(decoratedModel)
    waterline.registerModel(wm)
  })

  const ontology = await initialize(config)
  return fastify.decorate(decoratorName, ontology.collections)
})
