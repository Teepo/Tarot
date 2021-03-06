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

			// Si le joueur ne passe pas, on ajoute le joueur à la liste des attaquants
			if (type) {
				round.setGameType(parseInt(type));
				round.resetAttackerPlayers();
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

		// On distribute les cartes
		round.giveCardsToPlayers();

		// On refresh la vue
		game.displayBoard();

		await askGameType(round);
		await askCalledKing(round);

		// Petite ou garde
		if (round.getGameType() <= 1) {

			const { cards, chiens } = await (async () => {
				return await round.getAttackerPlayers()[0].askChien(round);
			})();

			// On mets les cartes selectionnés dans le chien
			round.addAttackerStackCards(chiens);

			// On met à jour notre deck
			round.getAttackerPlayers()[0].setCards(cards);
		}
		// Garde sans
		else if (round.getGameType() === 2) {

			// On mets le chien direct dans notre stack de carte
			round.addAttackerStackCards(round.getChiens());

		}
		// Garde contre
		else if (round.getGameType() === 3) {

			// On mets le chien direct dans la stack de carte des defenseurs
			round.addDefenderStackCards(round.getChiens());
		}

		round.addAttackerPlayer(round.findPartnerByCards());
		round.setDefenderPlayers(round.findDefenderPlayers());

		// Un joueur a pris, on commence la partie
		game.addRound(round);

		game.displayBoard();

		await roundLoop(round);
	}
};

const displayScoreBoard = async (round) => {
	await round.getGame().displayScoreBoard();
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

	// On compte les points
	round.setPoints();

	// Fin de la partie
	round.determineTheWinner();

	console.log('Fin du round', round);

	await displayScoreBoard(round);
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
