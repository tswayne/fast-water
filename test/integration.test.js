const { suite, test, beforeEach } = require('mocha')
const { assert } = require('chai')

const sinon = require('sinon')
const optsFixture = require('./support/opts')
const fastWater = require('../lib/fast-water')

const sandbox = sinon.createSandbox()
suite('fastWater', function() {

  let next, fastify
  beforeEach(function() {
    sandbox.restore()
    next = sinon.spy()
    fastify = { decorate: sinon.spy() }
  })

  test('happy path - setup waterline and decorate fastify', async function() {
    const options = Object.assign({}, optsFixture, {
      modelDefaults: {
        datastore: 'default',
        primaryKey: 'id',
        attributes: {
          id: { type: 'number', autoMigrations: { autoIncrement: true } },
        }
      }
    })
    
    await fastWater(fastify, options, next)
    sinon.assert.calledOnce(fastify.decorate)
  })

})