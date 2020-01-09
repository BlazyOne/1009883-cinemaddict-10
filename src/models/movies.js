import {getMoviesByFilter} from '../utils/filter.js';

class Movies {
  constructor() {
    this._movies = [];
    this._activeFilterType = `All movies`;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getMovies() {
    return getMoviesByFilter(this._movies, this._activeFilterType);
  }

  getMoviesAll() {
    return this._movies.slice();
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateMovies(id, movie) {
    const index = this._movies.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(0, index), movie, this._movies.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  deleteComment(movieId) {
    const movieIndex = this._movies.findIndex((it) => it.id === movieId);
    const commentIndex = this._movies[movieIndex].comments.findIndex((it) => it === null);

    if (movieIndex === -1 || commentIndex === -1) {
      return false;
    }

    this._movies[movieIndex].comments = [].concat(this._movies[movieIndex].comments.slice(0, commentIndex), this._movies[movieIndex].comments.slice(commentIndex + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}

export default Movies;
