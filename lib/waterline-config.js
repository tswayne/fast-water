
module.exports = (options) => {
  const adapters = {}
  adapters[options.adapterType] = options.adapter
  return {
    adapters,
    datastores: {
      default: {
        adapter: options.adapterType,
        database: options.database.name,
        user: options.database.user,
        password: options.database.password,
        host: options.database.host,
        port: options.database.port || 3306
      }
    },
  };
}