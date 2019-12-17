module.exports = async (fastify, opts) => {
  fastify.post('/', async (req, reply) => {
    const { db, body } = req
    const { event } = body
    const handler = eventHandlers[event.type]
    if (!handler) {
      req.log.warn(`unrecognized message type: ${event.type}`)
      return reply.code(400)
    }

    await handler(db, event)
    reply.code(204)
  })
}

const eventHandlers = {
  agentMessage,
  visitorMessage
}

async function agentMessage (db, event) {
  if (event.attachments && event.attachments.length > 0) {
    // OBS!!! In production, you have to save the images somewhere, e.g. in file
    // storage or in a database.
  }

  await db('chat_messages').insert({
    channel: event.channel,
    type: 'agentMessage',
    agent_email: event.agent.email,
    text: event.text,
    attachments: event.attachments && JSON.stringify(event.attachments),
    timestamp: new Date(event.timestamp)
  })
}

async function visitorMessage (db, event) {
  if (event.attachments && event.attachments.length > 0) {
    // OBS!!! In production, you have to save the images somewhere, e.g. in file
    // storage or in a database.
  }

  await db('chat_messages').insert({
    channel: event.channel,
    type: 'visitorMessage',
    agent_email: null,
    text: event.text,
    attachments: event.attachments && JSON.stringify(event.attachments),
    timestamp: new Date(event.timestamp)
  })
}
