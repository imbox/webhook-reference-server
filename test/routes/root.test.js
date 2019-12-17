/* eslint-env mocha */
const Knex = require('knex')
const expect = require('expect')
const Server = require('../../app/server')

describe('routes root', function () {
  const token = 'test-token'
  const knex = Knex({
    client: 'mysql2',
    connection: {
      host: 'localhost',
      charset: 'utf8mb4',
      user: 'root',
      password: 'password',
      database: 'imbox',
      timezone: 'Z'
    }
  })
  let server

  beforeEach(async function () {
    server = await Server({
      // logger: true,
      db: knex,
      token
    })
  })

  afterEach(async function () {
    await knex('chat_messages').delete()
    await server.close()
  })

  after(async function () {
    knex.destroy()
  })

  it('visitorMessage', async function () {
    const body = {
      event: {
        visitor: {
          id: '1abc'
        },
        channel: 'V1',
        type: 'visitorMessage',
        text: 'Tack snälla! :slight_smile:',
        timestamp: '2019-06-10T08:02:42.000Z'
      },
      eventTime: '2019-06-10T08:02:43.000Z'
    }
    const res = await server
      .inject()
      .post('/')
      .headers({ 'x-imbox-signature': server.createSignature(token, body) })
      .body(body)

    expect(res.statusCode).toEqual(204)
    expect(res.body).toEqual('')
    expect(await getMessages(knex)).toEqual([
      {
        agent_email: null,
        attachments: null,
        channel: body.event.channel,
        text: body.event.text,
        timestamp: new Date(body.event.timestamp),
        type: 'visitorMessage'
      }
    ])
  })

  it('agentMessage', async function () {
    const body = {
      event: {
        agent: {
          email: 'agent@email.com'
        },
        channel: 'V1',
        type: 'agentMessage',
        text: 'Hej hej',
        timestamp: '2019-06-10T08:02:42.000Z'
      },
      eventTime: '2019-06-10T08:02:43.000Z'
    }
    const res = await server
      .inject()
      .post('/')
      .headers({ 'x-imbox-signature': server.createSignature(token, body) })
      .body(body)

    expect(res.statusCode).toEqual(204)
    expect(res.body).toEqual('')
    expect(await getMessages(knex)).toEqual([
      {
        agent_email: 'agent@email.com',
        attachments: null,
        channel: body.event.channel,
        text: body.event.text,
        timestamp: new Date(body.event.timestamp),
        type: 'agentMessage'
      }
    ])
  })

  it('invalid token', async function () {
    const body = {}
    const res = await server
      .inject()
      .post('/')
      .headers({
        'x-imbox-signature': server.createSignature('invalid-token', body)
      })
      .body(body)
    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual(
      JSON.stringify({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Bad signature'
      })
    )
  })
})

async function getMessages (knex) {
  return knex('chat_messages').select([
    'type',
    'channel',
    'agent_email',
    'text',
    'attachments',
    'timestamp'
  ])
}
