const fp = require('fastify-plugin')
const crypto = require('crypto')

async function verifySignature (fastify, { token }) {
  const badRequestError = new Error('Bad signature')

  fastify.addHook('preHandler', (req, reply, next) => {
    if (!isValidSignature(token, req)) {
      reply.status(400)
      return next(badRequestError)
    }
    next()
  })

  // Expose createSignature for testing...
  fastify.decorate('createSignature', createSignature)
}

function isValidSignature (token, req) {
  const providedSignature = req.headers['x-imbox-signature']
  const signature = createSignature(token, req.body)
  return providedSignature === signature
}

function createSignature (token, body) {
  return `sha1=${crypto
    .createHmac('sha1', token)
    .update(JSON.stringify(body))
    .digest('hex')}`
}

module.exports = fp(verifySignature)
