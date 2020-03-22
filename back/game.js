module.exports = class Game {

    id = ""
    /**
     * Number representing the game phase
     * 0 : game creation and login
     * 1 : main game phase (answering)
     * 2 : first person finished, gathering all answers
     * 3 : game master validating answers
     */
    game_phase = 0
    names = []
    scores = []
    cats = []
    current_round = []
    current_letter = ''

    constructor(options = { id: "test", game_phase: 0, names: [], scores: [], cats: [], current_round: [], current_letter: '' }) {
        Object.assign(this, options)
    }

    get cleaned() {
        let res = { id: this.id, game_phase: this.game_phase, names: this.names, scores: this.scores, cats: this.cats, current_round: this.current_round, current_letter: this.current_letter }
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
