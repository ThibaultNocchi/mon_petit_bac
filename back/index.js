const WebSocket = require('ws')
const fs = require('fs');
const https = require('https');
const Actions = require('./actions')

const DEFAULT_PORT = 8081

let argv = require('minimist')(process.argv.slice(2))

if (argv.h !== undefined) {
    console.log('-h - prints help')
    console.log('-p PORT - sets server on PORT')
    console.log('--cert /path/to/cert.pem - specify path to a cert, needs to be with a key')
    console.log('--key /path/to/key.pem - specify path to a key, needs to be with a cert')
    return
}

let params = { port: DEFAULT_PORT }

if (argv.p !== undefined) {
    params.port = argv.p
}


if (argv.cert !== undefined && argv.key !== undefined) {
    const server = https.createServer({
        cert: fs.readFileSync(argv.cert),
        key: fs.readFileSync(argv.key)
    });
    params['server'] = server
}


const wss = new WebSocket.Server(params)
console.log('Started websockets server on port ' + params.port)

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
