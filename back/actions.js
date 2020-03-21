const rs = require('randomstring')

const Loki = require('lokijs')
const db = new Loki()

const games = db.addCollection('games', { unique: 'id' })

const Game = require('./game')

let connections = []

let find_position_connections = function (ws, game_id) {
    return connections[game_id].findIndex(el => el === ws)
}

let get_game_from_data = function (data) {
    if (data === undefined || data.game_id === undefined) {
        throw 'missing_game_id'
    }
    let res = games.findOne({ id: data.game_id })
    if (res === null) {
        throw 'wrong_game_id'
    }
    return new Game(res)
}

let broadcast_game = function (game) {
    connections[game.id].forEach(element => {
        element.send(game.to_string)
    });
}

exports.create = function (current_ws, data) {

    if (data === undefined || data.name === undefined || data.name === '') {
        throw 'missing_name'
    }

    // let id = rs.generate(7)
    let id = "test"

    let doc = new Game()
    doc.add_name(data.name)
    doc.id = id

    games.insert(doc)
    connections[id] = [current_ws]
    broadcast_game(doc)

}

exports.connect = function (current_ws, data) {

    if (data === undefined || data.name === undefined || data.name === '') {
        throw 'missing_name'
    }

    let game = get_game_from_data(data)

    if (game.started) {
        throw 'game_started'
    }

    if (find_position_connections(current_ws, game.id) !== -1) {
        throw 'already_connected'
    }

    if (game.add_name(data.name) === undefined) {
        throw 'name_taken'
    }
    connections[game.id].push(current_ws)

    games.update(game)
    broadcast_game(game)

}

exports.register_cat = function (current_ws, data) {

    if (data === undefined || data.cat === undefined || data.cat === '') {
        throw 'missing_cat'
    }

    let game = get_game_from_data(data)

    if (game.started) {
        throw 'game_started'
    }

    let connection_pos = find_position_connections(current_ws, game.id)
    if (connection_pos !== 0) {
        throw 'not_game_master'
    }

    if (game.add_cat(data.cat) === undefined) {
        throw 'cat_taken'
    }

    games.update(game)
    broadcast_game(game)

}

exports.start_game = function (current_ws, data) {
    let game = get_game_from_data(data)

    if (game.started) {
        throw 'game_started'
    }

    let connection_pos = find_position_connections(current_ws, game.id)
    if (connection_pos !== 0) {
        throw 'not_game_master'
    }

    if (game.names.length === 0 || game.cats.length === 0) {
        throw 'empty_game'
    }

    game.started = true;
    games.update(game)
    broadcast_game(game)

}
