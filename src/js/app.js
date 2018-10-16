import { asyncMap } from './utils';

import { Player } from './player';
import { Game   } from './game';
import { Round  } from './round';
import { Turn   } from './turn';
import { Card   } from './card';

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

const gameLoop = async () => {

	while (!round.isFinished()) {

		round.addTurn(new Turn);

		await askPlayersCard();
	}
};

const askPlayersCard = async () => {

	const turn = round.getCurrentTurn();

	turn.setRound(round);
	turn.setPlayers(round.getPlayers());
	turn.buildPlayersQueue();

	await asyncMap(turn.getPlayersQueue(), async player => {

		await player.askCard(turn);

		game.displayBoard();
	});

	// Fin du tour
	turn.determineTheWinner();
};

(async () => {

	// await gameTypeLoop();

	round.setPlayers(game.getPlayers());

	round.setPlayerWhoGiveCards(player2);

	round.setGameType(1);
	round.addAttackerPlayer(player2);

	round.setCalledKing(new Card(64)); // Roi de Coeur

	round.addAttackerPlayer(round.findPartnerByCards());

	round.setDefenderPlayers(round.findDefenderPlayers());

	// Un joueur a pris, on commence la partie
	game.addRound(round);

	// on cache la modal
	// document.querySelector('.modal').remove();

	game.displayBoard();

	await gameLoop();
})();
