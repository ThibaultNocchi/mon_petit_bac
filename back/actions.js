const Datastore = require('nedb')
const db = new Datastore()

const game = require('./game')

let connections = []

let find_position_connections = function (ws, game_id) {
    return connections[game_id].findIndex(el => el === ws)
}

let get_game_id_from_data = function (current_ws, data) {
    if (data === undefined || data.game_id === undefined) {
        throw 'missing_game_id'
    }
    return data.game_id
}

let broadcast_game = function (game) {
    connections[game._id].forEach(element => {
        element.send(JSON.stringify(game))
    });
}

exports.create = function (current_ws, data) {

    if (data === undefined || data.name === undefined || data.name === '') {
        throw 'missing_name'
    }

    let doc = new game()
    doc.add_name(data.name)

    db.insert(doc, (err, new_doc) => {
        if (!err) {
            connections[new_doc._id] = [current_ws]
            broadcast_game(new_doc)
        } else {
            throw 'unexpected'
        }
    });

}

exports.connect = function (current_ws, data) {

    if (data === undefined || data.name === undefined || data.name === '') {
        throw 'missing_name'
    }

    let game_id = get_game_id_from_data(current_ws, data)
    db.findOne({ _id: game_id }, function (err, doc) {

        if (!doc) {
            throw 'wrong_game_id'
        }

        let parsed_doc = new game(doc)
        if (parsed_doc.started) {
            throw 'game_started'
        }

        if (find_position_connections(current_ws, parsed_doc._id) !== -1) {
            throw 'already_connected'
        }

        if (parsed_doc.add_name(data.name) === undefined) {
            throw 'name_taken'
        }
        connections[parsed_doc._id].push(current_ws)

        db.update({ _id: game_id }, { $set: { names: parsed_doc.names } }, { returnUpdatedDocs: true }, (err, numAffected, affectedDocuments, upsert) => {
            let parsed_update = new game(affectedDocuments)
            broadcast_game(parsed_update)
        });

    });

}

exports.register_cat = function (current_ws, data) {

    if (data === undefined || data.cat === undefined) {
        throw 'missing_cat'
    }

    let game_id = get_game_id_from_data(current_ws, data)
    let cat = data.cat
    db.findOne({ _id: game_id }, function (err, doc) {

        if (!doc) {
            throw 'wrong_game_id'
        }

        let parsed_doc = new game(doc)
        if (parsed_doc.started) {
            throw 'game_started'
        }

        let connection_pos = find_position_connections(current_ws, parsed_doc._id)
        if (connection_pos !== 0) {
            throw 'not_game_master'
        }

        if (cat === '' || parsed_doc.cats.find(el => el === cat) !== undefined) {
            throw 'invalid_cat'
        }

        db.update({ _id: game_id }, { $push: { cats: cat } }, { returnUpdatedDocs: true }, (err, numAffected, affectedDocuments, upsert) => {
            let parsed_update = new game(affectedDocuments)
            broadcast_game(parsed_update)
        });

    })

}

exports.start_game = function (current_ws, data) {
    let game_id = get_game_id_from_data(current_ws, data)
    db.findOne({ _id: game_id }, function (err, doc) {

        if (!doc) {
            throw 'wrong_game_id'
        }

        let parsed_doc = new game(doc)
        if (parsed_doc.started) {
            throw 'game_started'
        }

        let connection_pos = find_position_connections(current_ws, parsed_doc._id)
        if (connection_pos !== 0) {
            throw 'not_game_master'
        }

        if (parsed_doc.names.length === 0 || parsed_doc.cats.length === 0) {
            throw 'empty_game'
        }

        db.update({ _id: game_id }, { $set: { started: true } }, { returnUpdatedDocs: true }, (err, numAffected, affectedDocuments, upsert) => {
            let parsed_update = new game(affectedDocuments)
            broadcast_game(parsed_update)
        });

    })
}
