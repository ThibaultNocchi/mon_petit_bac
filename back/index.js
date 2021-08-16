const WebSocket = require('ws')
const fs = require('fs');
const https = require('https');
const Actions = require('./actions')

const DEFAULT_PORT = 8081
const DEFAULT_HOST = '0.0.0.0'

let argv = require('minimist')(process.argv.slice(2))

if (argv.h !== undefined) {
    console.log('-h - prints help')
    console.log('-p PORT - sets server on PORT')
    console.log('--host HOST - binds server on HOST')
    console.log('--cert /path/to/cert.pem - specify path to a cert, needs to be with a key')
    console.log('--key /path/to/key.pem - specify path to a key, needs to be with a cert')
    return
}

let params = { port: DEFAULT_PORT, host: DEFAULT_HOST }

if (argv.p !== undefined) {
    params.port = argv.p
}

if (argv.host !== undefined) {
    params.host = argv.host
}


if (argv.cert !== undefined && argv.key !== undefined) {
    const server = https.createServer({
        cert: fs.readFileSync(argv.cert),
        key: fs.readFileSync(argv.key)
    });
    params['server'] = server
}


const wss = new WebSocket.Server(params)
console.log('Started websockets server on ' + params.host + ' and port ' + params.port)

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
        Actions[action](current_ws, msg.data)

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
