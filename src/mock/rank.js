import {getCategoryFilmsAmount} from '../utils.js';

const getWatchedAmount = (cards) => getCategoryFilmsAmount(cards, `isWatched`);

export {getWatchedAmount};
