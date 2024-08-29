import { cardList    } from './config/cardList';
import { gameTypeList } from './config/gameTypeList';
import { pointToReachByBout } from './config/pointsToReachByBout';
import { ratioByGameType    } from './config/ratioByGameType';

import { Player } from './player';
import { Card } from './card';
import { Deck } from './deck';

import type { Turn } from './turn';

import { store } from './store';

export class Round {

    attackerPlayers : Array<Player>;
    defenderPlayers : Array<Player>;

    attackerStackCards : Array<Card>;
    defenderStackCards : Array<Card>;

    attackerPoints : number;
    defenderPoints : number;

    playersQueue: Array<Player>;

    playerWhoGiveCards : Player | null;

    calledKing : Card | null;

    gameType!: number | null;

    turns : Array<Turn>;

    deck : Deck;

    chiens : Array<Card>;

    constructor() {

        this.attackerPlayers = [];
        this.defenderPlayers = [];

        this.attackerStackCards = [];
        this.defenderStackCards = [];

        this.attackerPoints = 0;
        this.defenderPoints = 0;

        this.playersQueue = [];

        this.playerWhoGiveCards = null;

        this.calledKing = null;

        this.turns = [];

        this.deck = new Deck;

        this.chiens = [];
    }

    /**
     * @description Ajoute de manière aléatoire une carte dans le chien.
     *              Dans une limite de 3 cartes.
     */
    addCardInChien() {

        if (this.chiens.length >= 3) {
            return;
        }

        // @TODO
        // Techniquement, avec ce fonctionnement on peut se retrouver
        // à la fin de la distribution avec un chien avec un nombre
        // insuffisant de carte.

        // On ajoute une probabilité de ne pas rajouter une carte
        if (Math.floor(Math.random() * Math.floor(26)) > 13) {
            return;
        }

        this.chiens.push(this.deck.getOneCard());
    }

    getChiens() : Array<Card> {
        return this.chiens;
    }

    giveCardsToPlayers() {

        this.deck.shuffle();

        // On distribue les cartes
        let playerIndex = 0;

        let cards = [];
        while (cards = this.deck.getThreeCard()) {

            if (playerIndex >= 5) {
                playerIndex = 0;
            }

            if (!(cards instanceof Array)) {
                return;
            }
            
            const player = store.state.players[playerIndex];

            // On dit que ces Card appartient à ce joueur
            cards.map(card => {
                card.setPlayerId(player.id);
            });

            player.addCards(cards);

            // On met eventuellement une carte dans le chien
            this.addCardInChien();

            playerIndex++;
        }
    }

    addTurn(turn : Turn) {
        this.turns.push(turn);
    }

    getTurns() : Array<Turn> {
        return this.turns;
    }

    /**
     * @description Retourne le dernier élément de getTurns(), donc le courant.
     *
     */
    getCurrentTurn() : Turn {
        return this.getTurns().slice(-1)[0];
    }

    /**
     * @description Retourne l'avant dernier élément de getTurns(), donc le précédent.
     *
     */
    getPreviousTurn() : Turn {
        return this.getTurns().slice(-2)[0];
    }

    getNextPlayerToGiver() : Player | null {

        const giver = this.getPlayerWhoGiveCards();

        if (!(giver instanceof Player)) {
            return null;
        }

        const index = this.getNextPlayerIndexToGiver(giver) + 1;

        return store.state.players[index];
    }

    getNextPlayerIndexToGiver(giver : Player | null): number {

        let indexAnchor = 0;

        store.state.players.map((player, index) => {
            indexAnchor = Object.is(player, giver) ? index : indexAnchor;
        });

        return indexAnchor;
    }

    buildPlayersQueue() {

        const firstPlayerToBegin = this.getNextPlayerToGiver();

        this.addPlayerInQueue(firstPlayerToBegin);

        const playersWithoutTheBeginner = store.state.players.filter(player => {
            return !Object.is(player, firstPlayerToBegin);
        });

        let indexAnchor = this.getNextPlayerIndexToGiver(firstPlayerToBegin);

        // 1. Tant qu'on a pas vidé la liste des joueurs restants
        //    on va construite la queue.
        while (playersWithoutTheBeginner.length) {

            // 1.1 Le joueur qui commence est en milieu de liste,
            //     on se positionne dans le tableau et on boucle.
            if (indexAnchor > 0) {

                for (let i = 0; i <= playersWithoutTheBeginner.length; i++) {

                    let a = playersWithoutTheBeginner.splice(indexAnchor, 1)[0];

                    // Don't ask too ...
                    if (typeof a === "undefined") {
                        continue;
                    }

                    this.addPlayerInQueue(a);
                }

                indexAnchor = 0;
            }
            else {

                // 1.2 On est ( ou revenu ) au début du tableau.
                //     On balance le reste.
                this.addPlayerInQueue(playersWithoutTheBeginner.splice(0, 1)[0]);
            }
        }
    }

    isFinished() : Boolean {
        return this.getTurns().length >= 15;
    }

    /**
     * @description En fonction du gameType déjà choisis, retourne la liste des choix restants.
     *
     */
    getAvailablesGameType() : Object {

        const gameType = this.gameType;

        // Aucun type choisi, on retourne la liste complète direct.
        if (gameType === undefined
            || gameType === null) {
            return gameTypeList;
        }

        return Object.keys(gameTypeList).filter(type => {
            return parseInt(type) > gameType;
        }).reduce((obj, key) => {
            obj[key] = gameTypeList[key];
            return obj;
        }, {});
    }

    /**
     * @description Le type de partie choisi ( petite, garde, garde-sans, garde-contre )
     *
     */
    getGameType() : number {
        return this.gameType ?? 0;
    }

    isPetite() : Boolean {
        return this.getGameType() === 0;
    }

    isGarde() : Boolean {
        return this.getGameType() === 1;
    }

    isGardeSans() : Boolean {
        return this.getGameType() === 2;
    }

    isGardeContre() : Boolean {
        return this.getGameType() === 3;
    }

    /**
     * @description Le type de partie choisi ( petite, garde, garde-sans, garde-contre )
     *
     */
    setGameType(type : number) {

        const isRegularType = !!Object.keys(gameTypeList).find(a => {
            return parseInt(a) === type;
        });

        // Type de jeu non présent dans la configuration
        if (!isRegularType) {
            throw new Error('[ROUND] setGameType() > type must be an integer');
        }

        this.gameType = type;
    }

    setCalledKing(card : Card) {

        const isRegularCard = Object.keys(cardList).find(a => {
            return parseInt(a) === card.index;
        });

        // Carte non présente dans la configuration
        if (!isRegularCard) {
            throw new Error('[ROUND] setCalledKing() > Invalid card');
        }

        if (!card.isKing()) {
            throw new Error('[ROUND] setCalledKing() > Invalid card, this is not a king');
        }

        this.calledKing = card;
    }

    getCalledKing() : Card | null {
        return this.calledKing;
    }

    /**
     * @description En fonction du roi appellé, retourne le second attaquant ( s'il y en a réellement un ).
     *
     */
    findPartnerByCards() : Player | Boolean {

        const partner = store.state.players.find(player => {
            return player.getCards().find(card => {

                let calledKing = this.getCalledKing();

                if (!(calledKing instanceof Card)) {
                    return false;
                }

                return card.getIndex() === calledKing.getIndex();
            });
        });

        if (!(partner instanceof Player)) {
            return false;
        }

        // Si la partner trouvé est soi même, on ne retourne rien.
        if (this.getAttackerPlayers().includes(partner)) {
            return false;
        }

        return partner;
    }

    getPlayerWhoGiveCards() : Player | null {
        return this.playerWhoGiveCards;
    }

    setPlayerWhoGiveCards(player : Player)  {
        this.playerWhoGiveCards = player;
    }

    setAttackerPoints(points : number) {
        this.attackerPoints = points;
    }

    getAttackerPoints() : number {
        return this.attackerPoints;
    }

    setDefenderPoints(points : number) {
        this.defenderPoints = points;
    }

    getPlayersQueue() : Array<Player> {
        return this.playersQueue;
    }

    addPlayerInQueue(player : Player | null) {

        if (!(player instanceof Player)) {
            return;
        }

        this.playersQueue.push(player);
    }

    setPoints() {

        this.getAttackerStackCards().map((card: Card) => {
            this.attackerPoints += card.getPoints();
        });

        this.getDefenderStackCards().map((card: Card) => {
            this.defenderPoints += card.getPoints();
        });

        console.log('ROUND > setPoints() > attackerPoints', this.attackerPoints);
        console.log('ROUND > setPoints() > defenderPoints', this.defenderPoints);
    }

    getAttackerStackCards() : Array<Card> {
        return this.attackerStackCards;
    }

    getDefenderStackCards() : Array<Card> {
        return this.defenderStackCards;
    }

    addAttackerStackCards(cards : Array<Card>) {

        cards.map(card => {
            this.attackerStackCards.push(card);
        });
    }

    addDefenderStackCards(cards : Array<Card>) {

        cards.map(card => {
            this.defenderStackCards.push(card);
        });
    }

    getAttackerPlayers() : Array<Player> {
        return this.attackerPlayers;
    }

    getDefenderPlayers() : Array<Player> {
        return this.defenderPlayers;
    }

    addAttackerPlayer(player : Player | Boolean = false) {

        // L'attaquant est seul ! Bonne chance minot !
        if (!(player instanceof Player)) {
            return;
        }

        this.attackerPlayers.push(player);
    }

    resetAttackerPlayers() {
        this.attackerPlayers = [];
    }

    addDefenderPlayer(player : Player) {
        this.defenderPlayers.push(player);
    }

    setDefenderPlayers(players : Array<Player>) {
        this.defenderPlayers = players;
    }

    /**
     * @description En fonction des attaquants, retourne les défenseurs
     *
     */
    findDefenderPlayers() : Array<Player> {

        return store.state.players.filter((player: Player) => {
            return this.getAttackerPlayers().filter((aplayer: Player) => {
                return Object.is(player, aplayer);
            }).length <= 0;
        });
    }

    gameTypeIsChoosen() : Boolean {
        return typeof this.gameType !== 'undefined';
    }

    countBoutInCards(cards : Array<Card>) : number {

        return cards.filter(card => {
            return card.isBout();
        }).length;
    }

    /**
     * @TODO Gérer le cas ou un Player est tout seul
     *
     */
    determineTheWinner() {

        // On compte les points
        this.setPoints();

        const gameType = this.getGameType();

        console.log('ROUND > determineTheWinner() > gameType', gameType);

        const multiplicator = ratioByGameType[gameType];

        const pointToReach = pointToReachByBout[this.countBoutInCards(this.getAttackerStackCards())];

        console.log('ROUND > determineTheWinner() > pointToReach', pointToReach);

        const diffPoints = this.getAttackerPoints() - pointToReach;

        console.log('ROUND > determineTheWinner() > diffPoints', diffPoints);

        const points = Math.abs(25 + (diffPoints >= 0 ? diffPoints : -diffPoints));

        let pointsForAttacker = points * multiplicator;
        let pointsForDefender = -points * multiplicator;

        const isWinForAttackers = this.getAttackerPoints() >= pointToReach;

        if (!isWinForAttackers) {
            pointsForAttacker = -pointsForAttacker;
            pointsForDefender = pointsForDefender;
        }

        console.log('ROUND > determineTheWinner() > pointsForAttacker', pointsForAttacker);
        console.log('ROUND > determineTheWinner() > pointsForDefender', pointsForDefender);

        this.getAttackerPlayers().map(player => {
            player.addScore(pointsForAttacker);
        });

        this.getDefenderPlayers().map(player => {
            player.addScore(pointsForDefender);
        });

        // x2 pour le preneur
        this.getAttackerPlayers()[0].increaseLastScore(pointsForAttacker);
    }

    checkIfThereArePetitSec() : Boolean {

        return !!store.state.players.find((player: Player) => {
            return player.hasPetitSec();
        });
    }

    emptyPlayersCards() {

        store.state.players.map((player: Player) => {
            player.setCards([]);
        });
    }

    isFirstTurn() : Boolean {
        return this.getTurns().length === 1;
    }

    isLastTurn() : Boolean {
        return this.getTurns().length === 15;
    }

    getLastTurn() : Turn {
        return this.getTurns().slice(-1)[0];
    }

    havePetitAuBout() : Boolean {

        const lastTurn = this.getLastTurn();

        if (!this.isLastTurn()) {
            console.log('petit au bout > this is not the last turn');
            return false;
        }

        if (!lastTurn.havePetitInCards()) {
            console.log('petit au bout > no petit in last turn played');
            return false;
        }

        return this.getAttackerPlayers().includes(lastTurn.getWinner());
    }

    haveAttackerPlayersPlayedExcuseOnLastTurn(): Boolean {

        const lastTurn = this.getLastTurn();

        if (!this.isLastTurn()) {
            console.log('excuse > this is not the last turn');
            return false;
        }

        if (!lastTurn.haveExcuseInCards()) {
            console.log('excuse > no excuse in last turn played');
            return false;
        }

        return false;
    }
}
