const getAllMovies = (movies) => movies.slice();

const getWatchlistMovies = (movies) => movies.filter((movie) => movie.isInWatchlist);

const getWatchedMovies = (movies) => movies.filter((movie) => movie.isWatched);

const getFavoriteMovies = (movies) => movies.filter((movie) => movie.isFavorite);

const getMoviesByFilter = (movies, filterType) => {
  switch (filterType) {
    case `All movies`:
      return getAllMovies(movies);
    case `Watchlist`:
      return getWatchlistMovies(movies);
    case `History`:
      return getWatchedMovies(movies);
    case `Favorites`:
      return getFavoriteMovies(movies);
  }

  return movies.slice();
};

export {getMoviesByFilter};
