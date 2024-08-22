import { cardList    } from './config/cardList';
import { gameTypeList } from './config/gameTypeList';
import { pointByCard  } from './config/pointsByCard';
import { pointToReachByBout } from './config/pointsToReachByBout';
import { ratioByGameType    } from './config/ratioByGameType';

import { Player } from './player';
import { Card } from './card';
import { Deck } from './deck';

import type { Game } from './game';
import type { Turn } from './turn';

export class Round {

    game : Game | null = null;

    players         : Array<Player>;
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

        this.players         = [];
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
            
            const player = this.players[playerIndex];

            // On dit que ces Card appartient à ce joueur
            cards.map(card => {
                card.setPlayer(player);
            });

            player.addCards(cards);

            // On met eventuellement une carte dans le chien
            this.addCardInChien();

            playerIndex++;
        }
    }

    getGame() : Game | null {
        return this.game;
    }

    setGame(game : Game) {
        this.game = game;
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
        return this.getTurns().slice(-2, -1)[0];
    }

    getNextPlayerToGiver() : Player | null {

        const giver = this.getPlayerWhoGiveCards();

        if (!(giver instanceof Player)) {
            return null;
        }

        const index = this.getNextPlayerIndexToGiver(giver) + 1;

        return this.getPlayers()[index];
    }

    getNextPlayerIndexToGiver(giver : Player | null): number {

        let indexAnchor = 0;

        this.getPlayers().map((player, index) => {
            indexAnchor = Object.is(player, giver) ? index : indexAnchor;
        });

        return indexAnchor;
    }

    buildPlayersQueue() : void {

        const firstPlayerToBegin = this.getNextPlayerToGiver();

        this.addPlayerInQueue(firstPlayerToBegin);

        const playersWithoutTheBeginner = this.getPlayers().filter(player => {
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
    getGameType() : number | null {
        return this.gameType;
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
    setGameType(type : number) : void {

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

        const index = parseInt(card.index);

        const isRegularCard = Object.keys(cardList).find(a => {
            return parseInt(a) === index;
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

        const partner = this.getPlayers().find(player => {
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

    getPlayers() : Array<Player> {
        return this.players;
    }

    getPlayerWhoGiveCards() : Player | null {
        return this.playerWhoGiveCards;
    }

    setPlayers(players : Array<Player>) {
        this.players = players;
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

        this.getAttackerStackCards().map(card => {
            this.attackerPoints += pointByCard[card.getValue()];
        });

        this.getDefenderStackCards().map(card => {
            this.defenderPoints += pointByCard[card.getValue()];
        });
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

        return this.getPlayers().filter(player => {
            return this.getAttackerPlayers().filter(aplayer => {
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

        const pointToReach = pointToReachByBout[this.countBoutInCards(this.getAttackerStackCards())];

        const bonusPoint = this.getAttackerPoints() - pointToReach;

        let points;
        if (this.getAttackerPoints() >= pointToReach) {

            points = Math.abs((25 + bonusPoint) * ratioByGameType[this.getGameType()]);

            this.getAttackerPlayers().map(player => {
                player.addScore(points);
            });

            this.getDefenderPlayers().map(player => {
                player.addScore(-points);
            });

            // x2 pour le preneur
            this.getAttackerPlayers()[0].increaseLastScore(points);
        }
        else {

            points = Math.abs(bonusPoint * ratioByGameType[this.getGameType()]);

            this.getAttackerPlayers().map(player => {
                player.addScore(-points);
            });

            this.getDefenderPlayers().map(player => {
                player.addScore(points);
            });

            // x2 pour le preneur
            this.getAttackerPlayers()[0].increaseLastScore(-points);
        }
    }

    checkIfThereArePetitSec() : Boolean {

        return !!this.getPlayers().find(player => {
            return player.hasPetitSec();
        });
    }

    emptyPlayersCards() {

        this.getPlayers().map(player => {
            player.setCards([]);
        });
    }
}
