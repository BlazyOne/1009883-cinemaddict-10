import CardComponent from '../components/card.js';
import FilmDetailsComponent from '../components/film-details.js';
import MovieModel from '../models/movie.js';
import {render, replace, remove} from '../utils/render.js';

class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._isPopupShowing = false;

    this._cardComponent = null;
    this._filmDetailsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(movie) {
    const oldCardComponent = this._cardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._cardComponent = new CardComponent(movie);
    this._filmDetailsComponent = new FilmDetailsComponent(movie, oldFilmDetailsComponent ? oldFilmDetailsComponent.getCurrentEmoji() : null);

    this._cardComponent.setPosterClickHandler(() => this._showDetails());
    this._cardComponent.setTitleClickHandler(() => this._showDetails());
    this._cardComponent.setCommentsAmountClickHandler(() => this._showDetails());

    this._cardComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();

      const newMovie = movie.cloneMovie();
      newMovie.isInWatchlist = !newMovie.isInWatchlist;

      this._onDataChange(this, movie, newMovie);
    });

    this._cardComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();

      const newMovie = movie.cloneMovie();
      newMovie.isWatched = !newMovie.isWatched;

      this._onDataChange(this, movie, newMovie);
    });

    this._cardComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();

      const newMovie = movie.cloneMovie();
      newMovie.isFavorite = !newMovie.isFavorite;

      this._onDataChange(this, movie, newMovie);
    });

    this._filmDetailsComponent.setWatchlistClickHandler(() => {
      const newMovie = movie.cloneMovie();
      newMovie.isInWatchlist = !newMovie.isInWatchlist;

      this._onDataChange(this, movie, newMovie);
    });

    this._filmDetailsComponent.setWatchedClickHandler(() => {
      const newMovie = movie.cloneMovie();
      newMovie.isWatched = !newMovie.isWatched;

      this._onDataChange(this, movie, newMovie);
    });

    this._filmDetailsComponent.setFavoriteClickHandler(() => {
      const newMovie = movie.cloneMovie();
      newMovie.isFavorite = !newMovie.isFavorite;

      this._onDataChange(this, movie, newMovie);
    });

    this._filmDetailsComponent.setCloseButtonClickHandler(() => this._removeDetails());

    this._filmDetailsComponent.setCommentDeleteClickHandler((commentId) => {
      const commentIndex = movie.comments.findIndex((it) => it.id === commentId);
      let newData = movie;
      newData.comments[commentIndex] = null;
      this._onDataChange(this, movie, newData);
    });

    this._filmDetailsComponent.setCommentSubmitHandler((newComment) => {
      let newData = movie;
      newData.comments.push(newComment);
      this._filmDetailsComponent.setCurrentEmoji(null);
      this._onDataChange(this, movie, newData);
    });

    if (oldCardComponent && oldFilmDetailsComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._cardComponent);
    }
  }

  setDefaultView() {
    if (this._isPopupShowing === true) {
      this._removeDetails();
    }
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _showDetails() {
    this._onViewChange();

    render(document.body, this._filmDetailsComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._isPopupShowing = true;
  }

  _removeDetails() {
    this._filmDetailsComponent.getElement().remove();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._isPopupShowing = false;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removeDetails();
    }
  }
}

export default MovieController;
