export const noUndefinedValue = value => {
    if (value) return true
    return 'You must enter a value.'
};

export const noNegativeValue = value => {
    if (value > 0) return true
    return 'You must enter a positive value.'
};