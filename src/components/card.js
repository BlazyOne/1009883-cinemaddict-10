const createCardTemplate = (card) => {
  const {title, poster, rating, releaseDate, runtime, genres, description, isInWatchlist, isWatched, isFavorite, comments} = card;
  const year = releaseDate instanceof Date ? releaseDate.getFullYear() : ``;
  const genre = genres[0];
  const watchlistClass = isInWatchlist ? `film-card__controls-item--active` : ``;
  const watchedClass = isWatched ? `film-card__controls-item--active` : ``;
  const favoriteClass = isFavorite ? `film-card__controls-item--active` : ``;
  const commentsAmount = comments.length;

  return `\
    <article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${commentsAmount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClass}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClass}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClass}">Mark as favorite</button>
      </form>
    </article>`;
};

export {createCardTemplate};
