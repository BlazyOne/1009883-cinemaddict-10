import moment from 'moment';
import he from 'he';
import AbstractSmartComponent from './abstract-smart-component.js';
import {getRandomArrayItem, getRuntimeText} from '../utils/common.js';
import {NAMES} from '../mock/card.js';

const EMOJIS = [`smile`, `sleeping`, `puke`, `angry`];

const createGenresMarkup = (genres) =>
  genres
    .map((genre) =>
      `<span class="film-details__genre">${genre}</span>`
    )
    .join(`\n`);

const createUserRatingControlsMarkup = (isUserRatingControlsShowing, currentUserRating, poster) => {
  if (!isUserRatingControlsShowing) {
    return ``;
  }

  const userRatingRadioControlsMarkup = Array.from({length: 9}, (item, index) =>
    `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${index + 1}" id="rating-${index + 1}" ${currentUserRating === index + 1 ? `checked` : ``}>
    <label class="film-details__user-rating-label" for="rating-${index + 1}">${index + 1}</label>`)
    .join(`\n`);

  return `\
    <div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">The Great Flamarion</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              ${userRatingRadioControlsMarkup}

            </div>
          </section>
        </div>
      </section>
    </div>`;
};

const createCommentsMarkup = (comments) =>
  comments
    .map((comment) => {
      const dateString = moment(comment.date).format(`YYYY/MM/DD HH:mm`);
      const emojiSrc = `images/emoji/${comment.emoji}.png`;
      const sanitizedMessage = he.encode(comment.message);
      return `\
        <li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="${emojiSrc}" width="55" height="55" alt="emoji">
          </span>
          <div>
            <p class="film-details__comment-text">${sanitizedMessage}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.name}</span>
              <span class="film-details__comment-day">${dateString}</span>
              <button data-comment-id="${comment.id}" class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`;
    })
    .join(`\n`);

const createEmojisRadioMarkup = (currentEmoji) =>
  EMOJIS.map((emoji) =>
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${currentEmoji === emoji ? `checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`
  )
  .join(`\n`);


const createFilmDetailsTemplate = (card, options = {}) => {
  const {title, titleOriginal, poster, rating, age, director, writers, actors, releaseDate, runtime, country, genres, description, isInWatchlist, isWatched, isFavorite, comments} = card;
  const {isUserRatingControlsShowing, isUserRatingShowing, currentUserRating, currentEmoji} = options;

  const userRatingMarkup = isUserRatingShowing ? `<p class="film-details__user-rating">Your rate ${currentUserRating}</p>` : ``;
  const releaseDateString = moment(releaseDate).format(`DD MMMM YYYY`);
  const genreWord = genres.length > 1 ? `Genres` : `Genre`;
  const watchlistStatus = isInWatchlist ? `checked` : ``;
  const watchedStatus = isWatched ? `checked` : ``;
  const favoriteStatus = isFavorite ? `checked` : ``;
  const commentsAmount = comments.length;
  const currentEmojiMarkup = currentEmoji ? `<img src="images/emoji/${currentEmoji}.png" width="55" height="55" alt="emoji">` : ``;

  const runtimeText = getRuntimeText(runtime);

  const genresMarkup = createGenresMarkup(genres);
  const userRatingControlsMarkup = createUserRatingControlsMarkup(isUserRatingControlsShowing, currentUserRating, poster);
  const commentsMarkup = createCommentsMarkup(comments);
  const emojisRadioMarkup = createEmojisRadioMarkup(currentEmoji);

  return `\
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${age}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${titleOriginal}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                  ${userRatingMarkup}
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDateString}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${runtimeText}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genreWord}</td>
                  <td class="film-details__cell">
                    ${genresMarkup}</td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistStatus}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedStatus}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoriteStatus}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        ${userRatingControlsMarkup}

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsAmount}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsMarkup}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
                ${currentEmojiMarkup}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${emojisRadioMarkup}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`;
};

class FilmDetails extends AbstractSmartComponent {
  constructor(card, currentEmoji = null) {
    super();

    this._card = card;
    this._isUserRatingControlsShowing = card.isWatched;
    this._isUserRatingShowing = !!card.userRating;
    this._currentUserRating = card.userRating;
    this._currentEmoji = currentEmoji;

    this._closeButtonClickHandler = null;
    this._watchlistClickHandler = null;
    this._watchedClickHandler = null;
    this._favoriteClickHandler = null;
    this._commentDeleteClickHandler = null;
    this._commentSubmitHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._card, {
      isUserRatingControlsShowing: this._isUserRatingControlsShowing,
      isUserRatingShowing: this._isUserRatingShowing,
      currentUserRating: this._currentUserRating,
      currentEmoji: this._currentEmoji
    });
  }

  getCurrentUserRating() {
    return this._currentUserRating;
  }

  getCurrentEmoji() {
    return this._currentEmoji;
  }

  setCurrentEmoji(emoji) {
    this._currentEmoji = emoji;
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setWatchlistClickHandler(this._watchlistClickHandler);
    this.setWatchedClickHandler(this._watchedClickHandler);
    this.setFavoriteClickHandler(this._favoriteClickHandler);
    this.setCommentDeleteClickHandler(this._commentDeleteClickHandler);
    this.setCommentSubmitHandler(this._commentSubmitHandler);
    this._subscribeOnEvents();
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);

    this._closeButtonClickHandler = handler;
  }

  setWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, handler);

    this._watchlistClickHandler = handler;
  }

  setWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, handler);

    this._watchedClickHandler = handler;
  }

  setFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, handler);

    this._favoriteClickHandler = handler;
  }

  setCommentDeleteClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.classList.contains(`film-details__comment-delete`)) {
        const commentId = +evt.target.dataset.commentId;
        handler(commentId);
      }
    });

    this._commentDeleteClickHandler = handler;
  }

  setCommentSubmitHandler(handler) {
    const commentInputElement = this.getElement().querySelector(`.film-details__comment-input`);
    commentInputElement.addEventListener(`keydown`, (evt) => {
      const checkedEmoji = this.getElement().querySelector(`[name="comment-emoji"]:checked`);

      if (evt.code === `Enter` && (evt.ctrlKey || evt.metaKey) && commentInputElement.value.length > 0 && checkedEmoji) {
        const message = commentInputElement.value;
        const emoji = checkedEmoji.value;
        const name = getRandomArrayItem(NAMES);
        const id = Math.random();
        const date = new Date();

        const newComment = {id, message, name, emoji, date};

        handler(newComment);
      }
    });

    this._commentSubmitHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const userRatingRadioContolsElement = element.querySelector(`.film-details__user-rating-score`);

    if (userRatingRadioContolsElement) {
      userRatingRadioContolsElement.addEventListener(`change`, () => {
        const checkedUserRatingRadioValueNumber = +element.querySelector(`input[name="score"]:checked`).value;

        if (this._currentUserRating !== checkedUserRatingRadioValueNumber) {
          this._currentUserRating = checkedUserRatingRadioValueNumber;
          this._isUserRatingShowing = true;

          this.rerender();
        }
      });

      element.querySelector(`.film-details__watched-reset`).addEventListener(`click`, () => {
        this._currentUserRating = null;
        this._isUserRatingShowing = false;

        this.rerender();
      });
    }

    element.querySelector(`.film-details__emoji-list`).addEventListener(`change`, () => {
      const checkedEmojiRadioValue = element.querySelector(`input[name="comment-emoji"]:checked`).value;

      if (this._currentEmoji !== checkedEmojiRadioValue) {
        this._currentEmoji = checkedEmojiRadioValue;

        this.rerender();
      }
    });
  }
}

export default FilmDetails;
