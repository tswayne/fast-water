const Waterline = require('./waterline-facade');
const fs = require('fs')
const readdir = require('util').promisify(fs.readdir)
const waterlineConfig = require('./waterline-config')
const schema = require('./schema')
const deepmerge = require('deepmerge')
const fp = require('fastify-plugin')

module.exports =  fp(async (fastify, opts, next) => {
  const waterline = new Waterline();

  const result = schema.validate(opts)
  if (result.error) {
    return next(Error(`fast-water config invalid: ${result.error}`))
  }
  const modelDefaults = opts.modelDefaults ? opts.modelDefaults : {}
  const config =  waterlineConfig(opts)
  const modelDir = opts.modelPath
  const decoratorName = opts.decoratorName ? opts.decoratorName : 'models'

  const files = await readdir(modelDir)
  const modelsNames = files.filter(file => !fs.statSync(`${modelDir}/${file}`).isDirectory())
  modelsNames.forEach(modelName => {
    const model = require(`${modelDir}/${modelName}`)
    const decoratedModel = deepmerge(modelDefaults, model)

    const wm = waterline.extend(decoratedModel)
    waterline.registerModel(wm)
  })

  const ontology = await waterline.initialize(config)
  return fastify.decorate(decoratorName, ontology.collections)
})
