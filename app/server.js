const Fastify = require('fastify')

module.exports = async function server ({ port, logger = false, db, token }) {
  const fastify = Fastify({ logger })
  fastify.decorateRequest('db', db)
  fastify.register(require('./plugins/verify_signature'), { token })
  fastify.register(require('./routes/root'))

  await fastify.listen(port)
  return fastify
}
