const WebSocket = require('ws')
const Actions = require('./actions')

const DEFAULT_PORT = 8081

let argv = require('minimist')(process.argv.slice(2))

if (argv.h !== undefined) {
    console.log('-h: prints help')
    console.log('-p PORT: sets server on PORT')
    return
}

port = DEFAULT_PORT
if (argv.p !== undefined) {
    port = argv.p
}

const wss = new WebSocket.Server({ port })
console.log('Started websockets server on port ' + port)

let message_parser = function (message, current_ws) {

    try {

        let msg = {}

        try {
            msg = JSON.parse(message)
        } catch (error) {
            throw 'unexpected_msg'
        }

        if (!msg.action) {
            throw 'no_action'
        }

        let action = msg.action

        if (action === 'create') {
            Actions.create(current_ws, msg.data)
        } else if (action === 'connect') {
            Actions.connect(current_ws, msg.data)
        } else if (action === 'register_cat') {
            Actions.register_cat(current_ws, msg.data)
        } else if (action === 'start_game') {
            Actions.start_game(current_ws, msg.data)
        } else if (action === 'first') {
            Actions.first(current_ws, msg.data)
        } else if (action === 'gather') {
            Actions.gather(current_ws, msg.data)
        } else if (action === 'validate') {
            Actions.validate(current_ws, msg.data)
        } else if (action === 'end_round') {
            Actions.end_round(current_ws, msg.data)
        } else if (action === 'message') {
            Actions.message(current_ws, msg.data)
        } else {
            throw 'unrecognized_action'
        }

    } catch (error) {
        current_ws.send(JSON.stringify({ type: "error", error }))
        console.error('Error: ' + error)
    }

    return
}

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        message_parser(message, ws)

    })

    ws.on('close', () => {
        Actions.disconnect(ws)
    })

});
