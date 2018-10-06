import { asyncMap } from './utils';

import { Player } from './player';
import { Game   } from './game';
import { Round  } from './round';

// Setup player

const player1 = new Player;
const player2 = new Player;
const player3 = new Player;
const player4 = new Player;
const player5 = new Player;

player1.name = 'A';
player2.name = 'B';
player3.name = 'C';
player4.name = 'D';
player5.name = 'E';

// Setup game workflow

const game = new Game;

game.setPlayers([
	player1,
	player2,
	player3,
	player4,
	player5
]);

// -------- GAME START -------- //

const round = new Round;

// On distribute les cartes
game.giveCardsToPlayers();

// Ask to each player their game type

const askGameType = async () => {

	await asyncMap(game.getPlayers(), async player => {

		let type = await player.askGameType(round);

		if (type) {
			round.setGameType(parseInt(type));
			round.addAttackerPlayer(player);
		}
	});
};

const gameTypeLoop = async () => {

	while (!round.gameTypeIsChoosen()) {
		await askGameType();
	}
};

(async () => {

	await gameTypeLoop();

	// Un joueur a pris, on commence la partie
	game.addRound(round);

	// on cache la modal
	document.querySelector('.modal').remove();
})();
