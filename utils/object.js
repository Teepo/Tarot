import { Card } from './../models/card.ts';
import { Deck } from './../models/deck.ts';
import { Player } from './../models/player.ts';
import { Room } from './../models/room.ts';
import { Round } from './../models/round.ts';
import { Turn } from './../models/turn.ts';

/**
 * @param {Object} obj1
 * @param {Object} obj2
 *
 * @return {Object}
 */
export function mergeObjectsWithPrototypes(obj1, obj2) {
    
    const merged  = Object.create(Object.getPrototypeOf(obj1));

    Object.assign(merged, obj1);
    Object.assign(merged, obj2);

    return merged ;
};

const classMap = {
    'Card'   : Card,
    'Deck'   : Deck,
    'Player' : Player,
    'Room'   : Room,
    'Round'  : Round,
    'Turn'   : Turn,
};
export function unserialize(obj) {
    
    // Vérifie si l'objet lui-même est une instance d'une classe à recréer
    if (obj && obj.model && classMap[obj.model]) {
        
        
        // Recrée l'instance de la classe correspondante
        let instance = Object.assign(new classMap[obj.model](obj), obj);
        delete instance.model;

        // Parcourt les propriétés de cette nouvelle instance recréée pour traiter les objets imbriqués
        for (let key in instance) {
            if (instance.hasOwnProperty(key)) {
                let value = instance[key];

                // Vérifie si c'est un objet ou un tableau d'objets à parcourir
                if (typeof value === 'object' && value !== null) {
                    instance[key] = unserialize(value, classMap);
                }
            }
        }

        return instance; // Retourne l'instance recréée
    }
    else if (Array.isArray(obj)) {
       
        // Si c'est un tableau, traite chaque élément individuellement
        return obj.map(item => unserialize(item, classMap));
    }
    else if (typeof obj === 'object' && obj !== null) {
        
        // Si c'est un objet non-instancié, parcourt les propriétés
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let value = obj[key];

                if (typeof value === 'object' && value !== null) {
                    obj[key] = unserialize(value, classMap);
                }
            }
        }
    }

    return obj; // Si ce n'est ni une instance ni un tableau, retourne l'objet tel quel
}