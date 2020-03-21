module.exports = class Game {

    id = ""
    started = false
    names = []
    cats = []

    constructor(options = { id: "test", started: false, names: [], cats: [] }) {
        Object.assign(this, options)
    }

    get to_string() {
        let res = { id: this.id, started: this.started, names: this.names, cats: this.cats }
        return JSON.stringify(res)
    }

    add_name(name) {
        if (this.names.find(el => el === name) != undefined) {
            return undefined
        }
        this.names.push(name)
        return name
    }

    add_cat(cat) {
        if (this.cats.find(el => el === cat) != undefined) {
            return undefined
        }
        this.cats.push(cat)
        return cat
    }

}
