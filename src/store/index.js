import { createStore } from 'vuex'

import GameStore  from './game';
import RoundStore from './round';
import TurnStore  from './turn';

export const store = createStore();

export const gameStore = new GameStore({ store });
