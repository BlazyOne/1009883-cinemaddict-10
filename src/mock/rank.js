import {getCategoryFilmsAmount} from '../utils/common.js';

const getWatchedAmount = (cards) => getCategoryFilmsAmount(cards, `isWatched`);

export {getWatchedAmount};
