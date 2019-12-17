import {getCategoryFilmsAmount} from '../utils/common.js';

const FILTER_NAMES = [`All movies`, `Watchlist`, `History`, `Favorites`];

const getFilterCount = (cards, filterName) => {
  switch (filterName) {
    case `All movies`:
      return cards.length;
    case `Watchlist`:
      return getCategoryFilmsAmount(cards, `isInWatchlist`);
    case `History`:
      return getCategoryFilmsAmount(cards, `isWatched`);
    case `Favorites`:
      return getCategoryFilmsAmount(cards, `isFavorite`);
  }
  return 0;
};

const generateFilters = (cards) =>
  FILTER_NAMES
    .map((filterName) =>
      ({
        name: filterName,
        count: getFilterCount(cards, filterName)
      }));

export {generateFilters};
