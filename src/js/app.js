/* @flow */

import { asyncMap } from './utils';

import { Player } from './player';
import { Game   } from './game';
import { Round  } from './round';
import { Turn   } from './turn';

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

// On distribute les cartes
game.giveCardsToPlayers();

// Ask to each player their game type

const askCalledKing = async (round) => {

	const player = round.getAttackerPlayers()[0];

	const card = await player.askCalledKing();

	round.setCalledKing(card);
};

const askGameType = async (round) => {

	while (!round.gameTypeIsChoosen()) {

		await asyncMap(round.getPlayersQueue(), async player => {

			let type = await player.askGameType(round);

			if (type) {
				round.setGameType(parseInt(type));
				round.addAttackerPlayer(player);
			}
		});
	}
};

const gameLoop = async () => {

	let round;

	// Ca fait peur hein !? =D
	while (true) {

		round = new Round;

		round.setGame(game);

		round.setPlayers(game.getPlayers());

		round.setPlayerWhoGiveCards((() => {

			if (!(game.getCurrentRound() instanceof Round)) {
				return player1;
			}

			return game.getCurrentRound().getNextPlayerToGiver();
		})());

		round.buildPlayersQueue();

		await askGameType(round);

		await askCalledKing(round);

		// Un joueur a pris, on commence la partie
		game.addRound(round);

		game.displayBoard();

		await roundLoop(round);
	}
};

const roundLoop = async (round) => {

	while (!round.isFinished()) {

		let turn = new Turn;
		turn.setRound(round);
		turn.setPlayers(round.getPlayers());

		turn.buildPlayersQueue();

		round.addTurn(turn);

		await askPlayersCard(round);
	}

	// Fin de la partie
	round.determineTheWinner();

	// On compte les points
	round.setPoints();

	console.log('Fin du round', round);
};

const askPlayersCard = async (round) => {

	const turn = round.getCurrentTurn();

	await asyncMap(turn.getPlayersQueue(), async player => {

		await player.askCard(turn);

		game.displayBoard();
	});

	// Fin du tour
	turn.determineTheWinner();

	// Les gagnants prennent les Card
	turn.pickUpCards();

	// On reset les current card des Player
	turn.resetPlayersCurrentCard();

	// On refresh la vue
	game.displayBoard();

	console.log('Fin du Turn', turn);
};

(async () => {
	await gameLoop();
})();
