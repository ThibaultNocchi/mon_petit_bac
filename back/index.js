const WebSocket = require('ws')

const Actions = require('./actions')

const wss = new WebSocket.Server({ port: 8080 })

let message_parser = function (msg, current_ws) {
    if (!msg.action) {
        current_ws.send(JSON.stringify({ error: 'no_action' }))
        return
    }

    let action = msg.action

    try {

        if (action === 'create') {
            Actions.create(current_ws, msg.data)
        } else if (action === 'connect') {
            Actions.connect(current_ws, msg.data)
        } else if (action === 'register_cat') {
            Actions.register_cat(current_ws, msg.data)
        } else if (action === 'start_game') {
            Actions.start_game(current_ws, msg.data)
        } else {
            throw 'unrecognized_action'
        }

    } catch (error) {
        current_ws.send(JSON.stringify({ error }))
    }

    return
}

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        // console.log('received: %s', message)
        let msg = {}

        try {
            msg = JSON.parse(message)
        } catch (error) {
            ws.send(JSON.stringify({ error: "unexpected_msg" }))
            return
        }

        message_parser(msg, ws)

    })

    // ws.send('connected')
});
