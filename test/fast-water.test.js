const { suite, test, beforeEach } = require('mocha')
const { assert } = require('chai')

const sinon = require('sinon')
const optsFixture = require('./support/opts')
const Waterline = require('waterline-standalone-core')
const fastWater = require('../lib/fast-water')

const sandbox = sinon.createSandbox()
suite('fastWater', function() {

  let next, fastify
  beforeEach(function() {
    sandbox.restore()
    next = sinon.spy()
    fastify = { decorate: sinon.spy() }
  })

  test('decorates fastify with configured decorator name', async function() {
    await fastWater(fastify, optsFixture, next)
    sinon.assert.calledWithMatch(fastify.decorate, 'models')
  })

  test('returns next with configuration error on invalid config', async function() {
    await fastWater(fastify, {}, next)
    sinon.assert.calledWithMatch(next, Error)
  })
})