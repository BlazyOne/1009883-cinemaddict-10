import {getCategoryFilmsAmount} from '../utils';

const createMainMenuTemplate = (cards) => {
  const watchlistAmount = getCategoryFilmsAmount(cards, `isInWatchlist`);
  const watchedAmount = getCategoryFilmsAmount(cards, `isWatched`);
  const favoriteAmount = getCategoryFilmsAmount(cards, `isFavorite`);

  return `\
    <nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistAmount}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${watchedAmount}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoriteAmount}</span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`;
};

export {createMainMenuTemplate};
