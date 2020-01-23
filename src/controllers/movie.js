import CardComponent from '../components/card.js';
import FilmDetailsComponent from '../components/film-details.js';
import {render, replace, remove} from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;

    this._isPopupShowing = false;

    this._cardComponent = null;
    this._filmDetailsComponent = null;
    this._movie = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(movie) {
    this._movie = movie;

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
      newMovie.userRating = 0;

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
      newMovie.userRating = 0;

      this._onDataChange(this, movie, newMovie);
    });

    this._filmDetailsComponent.setFavoriteClickHandler(() => {
      const newMovie = movie.cloneMovie();
      newMovie.isFavorite = !newMovie.isFavorite;

      this._onDataChange(this, movie, newMovie);
    });

    this._filmDetailsComponent.setCloseButtonClickHandler(() => this._removeDetails());

    this._filmDetailsComponent.setUserRatingChangeHandler((ratingValue) => {
      const newMovie = movie.cloneMovie();
      newMovie.userRating = ratingValue;

      this._onDataChange(this, movie, newMovie);
    });

    this._filmDetailsComponent.setCommentDeleteClickHandler((commentId, deleteButtonElement) => {
      const commentIndex = movie.comments.findIndex((it) => it.id === commentId);
      const commentIdsIndex = movie.commentIds.findIndex((it) => it === commentId);

      let newData = movie;
      newData.comments[commentIndex] = null;
      newData.commentIds[commentIdsIndex] = null;
      const commentData = {id: commentId};
      this._onDataChange(this, movie, newData, `commentDelete`, commentData, deleteButtonElement);
    });

    this._filmDetailsComponent.setCommentSubmitHandler((newComment) => {
      this._filmDetailsComponent.setCurrentEmoji(null);
      this._onDataChange(this, movie, null, `commentAdd`, newComment);
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

  shakeCommentInput() {
    const commentInputElement = this._filmDetailsComponent.getElement().querySelector(`.film-details__comment-input`);
    commentInputElement.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      commentInputElement.style.animation = ``;
      commentInputElement.disabled = false;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _showDetails() {
    this._onViewChange();

    render(document.body, this._filmDetailsComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._isPopupShowing = true;

    if (!this._movie.commentsLoaded) {
      this._api.getComments(this._movie.id)
        .then((comments) => {
          this._movie.comments = comments;
          this._movie.commentsLoaded = true;
          this._filmDetailsComponent.rerender();
        });
    }
  }

  _removeDetails() {
    this._filmDetailsComponent.getElement().remove();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._isPopupShowing = false;
  }

  blockUserRatingControls() {
    const userRatingControlElements = this._filmDetailsComponent.getElement().querySelectorAll(`input[name="score"], .film-details__watched-reset`);

    userRatingControlElements.forEach((element) => {
      element.disabled = true;
    });
  }

  unblockUserRatingControls() {
    const userRatingControlElements = this._filmDetailsComponent.getElement().querySelector(`input[name="score"], .film-details__watched-reset`);

    userRatingControlElements.forEach((element) => {
      element.disabled = false;
    });
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removeDetails();
    }
  }
}

export default MovieController;
