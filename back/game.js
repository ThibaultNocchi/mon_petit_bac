module.exports = class game {

    _id = ""
    started = false
    names = []
    cats = []

    constructor(options = { _id: "test", started: false, names: [], cats: [] }) {
        Object.assign(this, options)
    }

    add_name(name) {
        if (this.names.find(el => el === name) != undefined) {
            return undefined
        }
        this.names.push(name)
        return name
    }

}
