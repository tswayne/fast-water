const path = require('path')

module.exports = {
  adapter: {},
  adapterType: 'mysql',
  database: {
    name: 'myDb',
    user: 'user',
    password: 'password',
    host: 'localhost'
  },
  decoratorName: 'models',
  modelPath: path.join(__dirname, './models'),
  modelDefaults: {
    datastore: 'default',
    primaryKey: 'id',
    attributes: {
      id: { type: 'number', autoMigrations: { autoIncrement: true } },
    }
  }
}