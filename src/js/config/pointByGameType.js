export const ratioByGameType = {
    0 : 1,  // Petite
    1 : 2, // Garde
    2 : 4, // Garde sans
    3 : 6  // Garde contre
};

export const pointByGameType = {
    0 : 25,                      // Petite
    1 : 25 * ratioByGameType[1], // Garde
    2 : 25 * ratioByGameType[2], // Garde sans
    3 : 25 * ratioByGameType[3]  // Garde contre
};
