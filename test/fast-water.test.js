const { suite, test, beforeEach } = require('mocha')
const { assert } = require('chai')

const sinon = require('sinon')
const optsFixture = require('./support/opts')
const Waterline = require('../lib/waterline-facade')
const fastWater = require('../lib/fast-water')

const sandbox = sinon.createSandbox()
suite('fastWater', function() {

  let next, fastify
  beforeEach(function() {
    sandbox.restore()
    next = sinon.spy()
    fastify = { decorate: sinon.spy() }
  })

  test('extends waterline collection with models located in configured directory ', async function() {
    const registerStub = sandbox.stub(Waterline.prototype, 'registerModel')
    await  fastWater(fastify, optsFixture, next)
    sinon.assert.calledTwice(registerStub)
  })

  test('applies configured model defaults to waterline collection', async function() {
    const defaults = {
      datastore: 'default',
      fetchRecordsOnCreate: true,
      primaryKey: 'id',
      attributes: {
        id: { type: 'number', autoMigrations: { autoIncrement: true } },
      }
    }

    sandbox.stub(Waterline.prototype, 'registerModel')
    const extendStub = sandbox.stub(Waterline.prototype, 'extend')
    await fastWater(fastify, Object.assign({}, optsFixture, { modelDefaults: defaults }), next)
    const registeredModel = extendStub.args[0][0]

    assert.equal(registeredModel.datastore, 'default')
    assert.equal(registeredModel.fetchRecordsOnCreate, true)
    assert.equal(registeredModel.primaryKey, 'id')
    assert.deepEqual(registeredModel.attributes.id, defaults.attributes.id)
  })

  test('initializes waterline with generated config', async function() {
    sandbox.stub(Waterline.prototype, 'registerModel')
    const initializeStub = sandbox.stub(Waterline.prototype, 'initialize').resolves({})
    await fastWater(fastify, optsFixture, next)

    sinon.assert.calledWith(initializeStub, {
      adapters: { mysql: {  } },
      datastores: {
        default: {
          adapter: "mysql",
          database: "myDb",
          host: "localhost",
          password: "password",
          port: 3306,
          user: "user"
        }
      }
    })
  })

  test('decorates fastify with configured decorator name', async function() {
    sandbox.stub(Waterline.prototype, 'registerModel')
    await fastWater(fastify, optsFixture, next)
    sinon.assert.calledWithMatch(fastify.decorate, 'models')
  })

  test('returns next with configuration error on invalid config', async function() {
    await fastWater(fastify, {}, next)
    sinon.assert.calledWithMatch(next, Error)
  })
})