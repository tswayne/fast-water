const waterlineCore = require('waterline-standalone-core')
const fp = require('fastify-plugin')

module.exports =  fp(async (fastify, opts, next) => {
  const decoratorName = opts.decoratorName ? opts.decoratorName : 'models'

  try {
    const models = await waterlineCore(opts)
    return fastify.decorate(decoratorName, models)
  } catch (e) {
    return next(e)
  }
})
