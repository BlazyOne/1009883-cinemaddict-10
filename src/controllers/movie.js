import CardComponent from '../components/card.js';
import FilmDetailsComponent from '../components/film-details.js';
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

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._cardComponent = new CardComponent(card);
    this._filmDetailsComponent = new FilmDetailsComponent(card, oldFilmDetailsComponent ? oldFilmDetailsComponent.getCurrentEmoji() : null);

    this._cardComponent.setPosterClickHandler(() => this._showDetails());
    this._cardComponent.setTitleClickHandler(() => this._showDetails());
    this._cardComponent.setCommentsAmountClickHandler(() => this._showDetails());

    this._cardComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        isInWatchlist: !card.isInWatchlist,
        userRating: this._filmDetailsComponent.getCurrentUserRating()
      }));
    });

    this._cardComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        isWatched: !card.isWatched,
        userRating: null
      }));
    });

    this._cardComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
        userRating: this._filmDetailsComponent.getCurrentUserRating()
      }));
    });

    this._filmDetailsComponent.setWatchlistClickHandler(() =>
      this._onDataChange(this, card, Object.assign({}, card, {
        isInWatchlist: !card.isInWatchlist,
        userRating: this._filmDetailsComponent.getCurrentUserRating()
      }))
    );

    this._filmDetailsComponent.setWatchedClickHandler(() =>
      this._onDataChange(this, card, Object.assign({}, card, {
        isWatched: !card.isWatched,
        userRating: null
      }))
    );

    this._filmDetailsComponent.setFavoriteClickHandler(() =>
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
        userRating: this._filmDetailsComponent.getCurrentUserRating()
      }))
    );

    this._filmDetailsComponent.setCloseButtonClickHandler(() => this._removeDetails());

    this._filmDetailsComponent.setCommentDeleteClickHandler((commentId) => {
      const commentIndex = card.comments.findIndex((it) => it.id === commentId);
      let newData = card;
      newData.comments[commentIndex] = null;
      this._onDataChange(this, card, newData);
    });

    this._filmDetailsComponent.setCommentSubmitHandler((newComment) => {
      let newData = card;
      newData.comments.push(newComment);
      this._filmDetailsComponent.setCurrentEmoji(null);
      this._onDataChange(this, card, newData);
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
