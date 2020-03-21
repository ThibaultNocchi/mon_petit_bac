module.exports = class Game {

    id = ""
    started = false
    names = []
    scores = []
    cats = []

    constructor(options = { id: "test", started: false, names: [], scores: [], cats: [] }) {
        Object.assign(this, options)
    }

    get cleaned() {
        let res = { id: this.id, started: this.started, names: this.names, scores: this.scores, cats: this.cats }
        return res
    }

    get to_string() {
        return JSON.stringify(this.cleaned)
    }

    add_name(name) {
        if (this.names.find(el => el === name) != undefined) {
            return undefined
        }
        this.names.push(name)
        this.scores.push(0)
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
