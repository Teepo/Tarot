import { Alert } from './alert.js';

export const wsErrorHandler = data => {

    const { error } = data;

    if (!!error) {
        Alert.add({ str : error.message, type : 'error'});
    }

    return !!error;
}