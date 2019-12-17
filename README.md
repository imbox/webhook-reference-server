# webhook-reference-server
A reference implementation of a webserver which can be used to receive and save
webhooks from ImBox.

## Description
This repository should only be used as a **reference** and is by **no means
complete** and **is not production ready**.

Future versions of ImBox webhooks may break this code. The suggested database
tables are just to be considered a starting point and your usage may differ from
this implementation. Furthermore, future versions may require you to add more
database tables or change existing ones.

ImBox will strive to update this repository to reflect the current webhook
api:s, but ImBox leaves no guarantees that it will not break in the future or
differ from the current version of the api.

## Test
The tests will setup a MySQL database and the webserver so that the tests will
be as authentic as possible. This will is done using Docker.

If [docker](https://docs.docker.com/) or
[docker-compose](https://docs.docker.com/compose/install/) is not installed on
you computer, install it/them first. 

Before you can run the tests, you have to install the npm packages with:
```bash
$ npm install
```

Then run the tests with:
```bash
$ npm test
```

By default the test will start MySQL in a docker instance and wait 60 seconds
while the database tables are initialized. If your computer doesn't manage to
initialize MySQL in seconds, that time can be increased in `test/setup.sh`. The
database tables are defined in `test/mysql/tables.sql`

If you want to run the tests several times without restarting the MySQL docker
instance every time, you can do so by first running:
```bash
$ npm run test:setup
```

And then for every time you want to run the tests:
```bash
$ npm run test:run
```

When you are finished, you can stop and remove the docker instance with
```bash
$ npm run test:teardown
```

## Events
These are the events that you may subscribe to as of today.

### agentMessage
```json
{
    "event": {
      "agent": {
        "email": "<agent.email>"
      },
      "channel": "V1234",
      "type": "agentMessage",
      "text": "Hej",
      "timestamp": "<message timestamp>"
    },
    "eventTime": "<webhook execute timestamp>"
  }
}
```

### agentMessage with file (sendFile)
```json
{
    "event": {
      "agent": {
        "email": "<agent.email>"
      },
      "channel": "V1234",
      "type": "agentMessage",
      "attachments": [{ "url": "https://cdn.imbox.io/file.jpg" }],
      "timestamp": "<message timestamp>"
    },
    "eventTime": "<webhook execute timestamp>"
  }
}
```

### visitorMessage
```json
{
    "event": {
      "visitor": {
        "id": "<visitorUuid>"
      },
      "channel": "V1234",
      "type": "visitorMessage",
      "text": "Hej",
      "timestamp": "<message timestamp>"
    },
    "eventTime": "<webhook execute timestamp>"
  }
}
```

### visitorMessage with file (sendFile)
```json
{
    "event": {
      "visitor": {
        "id": "<visitorUuid>"
      },
      "channel": "V1234",
      "type": "visitorMessage",
      "attachments": [{ "url": "https://cdn.imbox.io/file.jpg" }],
      "timestamp": "<message timestamp>"
    },
    "eventTime": "<webhook execute timestamp>"
  }
}
```

