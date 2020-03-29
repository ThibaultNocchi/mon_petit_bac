module.exports = class Game {

    /**
     * 'game_phase' values:
     * 0 : game creation and login
     * 1 : main game phase (answering)
     * 2 : first person finished, gathering all answers
     * 3 : game master validating answers
     */

    constructor(options = { id: "test", game_phase: 0, names: [], scores: [], cats: [], current_round: [], current_letter: '', latest_letters: [] }) {
        Object.assign(this, options)
    }

    get cleaned() {
        let res = { id: this.id, game_phase: this.game_phase, names: this.names, scores: this.scores, cats: this.cats, current_letter: this.current_letter }
        if (this.game_phase > 2) {
            res.current_round = this.current_round
        }
        return res
    }

    get to_string() {
        return JSON.stringify(this.cleaned)
    }

    get playing_positions() {
        let res = []
        for (let i = 0; i < this.names.length; ++i) {
            if (this.names[i].playing) {
                res.push(i)
            }
        }
        return res
    }

    add_name(name, playing = true) {
        if (this.names.find(el => el.name === name) != undefined) {
            return undefined
        }
        this.names.push({ name, playing })
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
