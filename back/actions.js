const rs = require('randomstring')

const Loki = require('lokijs')
const db = new Loki()

const games = db.addCollection('games', { unique: 'id' })

const Game = require('./game')

let connections = []

let count_occurences_array = function (array, comparison) {
    let occ = 0
    array.forEach(element => {
        if (comparison === element) {
            ++occ
        }
    })
    return occ
}

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

let broadcast = function (game_id, text) {
    connections[game_id].forEach(element => {
        element.send(text)
    });
}

let broadcast_game = function (game) {
    let to_send = { type: "game", game: game.cleaned }
    connections[game.id].forEach(element => {
        to_send.game.user_id = find_position_connections(element, game.id)
        element.send(JSON.stringify(to_send))
    });
}

let sanitize_word = function (w) {
    return w.trim().toLowerCase()
}

let are_words_same = function (w1, w2) {
    w1 = sanitize_word(w1)
    w2 = sanitize_word(w2)
    return w1 === w2
}

exports.create = function (current_ws, data) {

    if (data === undefined || data.name === undefined || data.name === '') {
        throw 'missing_name'
    }

    let id = rs.generate(7)

    let doc = new Game()
    doc.add_name(data.name)
    doc.id = id

    games.insert(doc)
    connections[id] = [current_ws]
    broadcast_game(doc)
    console.log("[" + doc.id + "]: " + data.name + " created a game")

}

exports.connect = function (current_ws, data) {

    if (data === undefined || data.name === undefined || data.name === '') {
        throw 'missing_name'
    }

    let game = get_game_from_data(data)

    if (game.game_phase !== 0) {
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
    console.log("[" + game.id + "]: " + data.name + " joined")

}

exports.register_cat = function (current_ws, data) {

    if (data === undefined || data.cat === undefined || data.cat === '') {
        throw 'missing_cat'
    }

    let game = get_game_from_data(data)

    if (game.game_phase !== 0) {
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

    if (game.game_phase !== 0) {
        throw 'game_started'
    }

    let connection_pos = find_position_connections(current_ws, game.id)
    if (connection_pos !== 0) {
        throw 'not_game_master'
    }

    if (game.names.length === 0 || game.cats.length === 0) {
        throw 'empty_game'
    }

    module.exports.new_round(current_ws, data)
    console.log("[" + game.id + "]: starts with " + game.cats.length + " categories / " + game.names.length + " users")

}

exports.new_round = function (current_ws, data) {
    let game = get_game_from_data(data)

    if (game.game_phase !== 0 && game.game_phase !== 3) {
        throw 'wrong_game_phase'
    }

    let connection_pos = find_position_connections(current_ws, game.id)
    if (connection_pos !== 0) {
        throw 'not_game_master'
    }

    let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    charset = charset.split('')
    charset = charset.filter((el) => !game.latest_letters.includes(el));
    charset = charset.join('')

    let letter = rs.generate({ length: 1, charset })

    game.game_phase = 1;
    game.current_letter = letter

    game.latest_letters.push(letter)
    if (game.latest_letters.length > 10) {
        game.latest_letters = game.latest_letters.slice(1, 11)
    }

    games.update(game)
    broadcast_game(game)

}

exports.first = function (current_ws, data) {

    let game = get_game_from_data(data)

    if (game.game_phase !== 1) {
        throw 'wrong_game_phase'
    }

    game.game_phase = 2
    game.current_round = []
    for (let i = 0; i < game.names.length; ++i) {
        game.current_round.push(undefined)
    }
    games.update(game)

    broadcast_game(game)
}

exports.gather = function (current_ws, data) {
    let game = get_game_from_data(data)

    if (game.game_phase !== 2) {
        throw 'wrong_game_phase'
    }

    let connection_pos = find_position_connections(current_ws, game.id)
    if (game.current_round[connection_pos] !== undefined) {
        throw 'user_current_round_already_saved'
    }

    if (!data || !data.answers || !Array.isArray(data.answers) || data.answers.length !== game.cats.length) {
        throw 'invalid_answers'
    }

    game.current_round[connection_pos] = []
    data.answers.forEach(element => {
        game.current_round[connection_pos].push({ valid: false, value: element })
    })

    let gather_over = true

    for (let i = 0; i < game.names.length; ++i) {
        if (game.current_round[i] === undefined) {
            gather_over = false
        }
    }

    if (gather_over) {
        game.game_phase = 3
    }

    games.update(game)

    if (gather_over) {
        broadcast_game(game)
    }

}

exports.validate = function (current_ws, data) {

    let game = get_game_from_data(data)

    if (game.game_phase !== 3) {
        throw 'wrong_game_phase'
    }

    let connection_pos = find_position_connections(current_ws, game.id)
    if (connection_pos !== 0) {
        throw 'not_game_master'
    }

    if (data === undefined || data.user_pos === undefined || data.answer_pos === undefined ||
        !Number.isInteger(data.user_pos) || !Number.isInteger(data.answer_pos) ||
        data.user_pos < 0 || data.user_pos >= game.names.length ||
        data.answer_pos < 0 || data.answer_pos >= game.cats.length) {
        throw 'invalid_answer_to_validate'
    }

    let value = game.current_round[data.user_pos][data.answer_pos].value

    for (let i = 0; i < game.names.length; ++i) {
        if (are_words_same(game.current_round[i][data.answer_pos].value, value)) {
            game.current_round[i][data.answer_pos].valid = !game.current_round[i][data.answer_pos].valid
        }
    }


    games.update(game)
    broadcast_game(game)

}

exports.end_round = function (current_ws, data) {

    let game = get_game_from_data(data)

    if (game.game_phase !== 3) {
        throw 'wrong_game_phase'
    }

    let connection_pos = find_position_connections(current_ws, game.id)
    if (connection_pos !== 0) {
        throw 'not_game_master'
    }

    let answers = []
    for (let i = 0; i < game.cats.length; ++i) {
        answers.push([])
    }

    for (let i = 0; i < game.cats.length; ++i) {
        for (let j = 0; j < game.names.length; ++j) {
            if (game.current_round[j][i].valid) {
                answers[i].push(sanitize_word(game.current_round[j][i].value))
            } else {
                answers[i].push(undefined)
            }
        }
    }

    for (let i = 0; i < game.cats.length; ++i) {
        for (let j = 0; j < game.names.length; ++j) {
            if (answers[i][j] !== undefined) {
                game.scores[j]++
                if (count_occurences_array(answers[i], answers[i][j]) === 1) {
                    game.scores[j]++
                }
            }
        }
    }

    games.update(game)
    module.exports.new_round(current_ws, data)

}

exports.message = function (current_ws, data) {

    let game = get_game_from_data(data)
    if (data === undefined || data.message === undefined || data.message === "") {
        throw 'no_msg'
    }

    let msg = data.message.trim()

    if (msg.length > 140) {
        throw 'invalid_msg'
    }

    let ack = { type: "ackMessage" }
    let obj = { type: "message", message: msg, sender: find_position_connections(current_ws, game.id) }
    current_ws.send(JSON.stringify(ack))
    broadcast(game.id, JSON.stringify(obj))

}
