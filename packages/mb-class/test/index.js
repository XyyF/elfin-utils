import {Class} from '../src/index.js'

var Pet = Class({
	constructor: function(name) {
		this._name = name
	},
	speak: function() {
		console.log(this._name + ' says...')
	}
})

var pet = new Pet('Garfield')
pet.speak()