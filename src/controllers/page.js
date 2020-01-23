import MovieController from './movie.js';
import ShowMoreButtonComponent from '../components/show-more-button';
import NoCardsComponent from '../components/no-cards';
import {shuffle} from '../utils/common.js';
import {render, remove} from '../utils/render.js';
import {getCategoryFilmsAmount} from '../utils/common.js';

const MOVIE_EXTRA_COUNT = 2;
const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;

const renderMovies = (container, movies, onDataChange, onViewChange, api) =>
  movies.map((movie) => {
    const movieController = new MovieController(container, onDataChange, onViewChange, api);
    movieController.render(movie);

    return movieController;
  });

class PageController {
  constructor(container, sortingComponent, moviesModel, profileHeaderComponent, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = api;

    this._showedMovieControllers = [];
    this._showedExtraMovieControllers = [];
    this._showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;
    this._sortingComponent = sortingComponent;
    this._noCardsComponent = new NoCardsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._profileHeaderComponent = profileHeaderComponent;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  show() {
    this._container.show();
    this._sortingComponent.show();
  }

  hide() {
    this._container.hide();
    this._sortingComponent.hide();
  }

  render() {
    const filmsListAllElement = this._container.getElement().querySelector(`.films-list`);
    const movies = this._moviesModel.getMovies();

    if (movies.length === 0) {
      render(filmsListAllElement, this._noCardsComponent);
      return;
    }

    this._renderMainMovies(movies.slice(0, this._showingMoviesCount));

    this._renderShowMoreButton(movies);

    this._renderExtraMovies(movies);
  }

  _renderMainMovies(movies) {
    const filmsListAllElement = this._container.getElement().querySelector(`.films-list`);
    const filmsAllContainerElement = filmsListAllElement.querySelector(`.films-list__container`);

    const newMovies = renderMovies(filmsAllContainerElement, movies, this._onDataChange, this._onViewChange, this._api);
    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
    this._showingMoviesCount = this._showedMovieControllers.length;
  }

  _renderExtraMovies() {
    this._showedExtraMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedExtraMovieControllers = [];

    const filmsListExtraElements = this._container.getElement().querySelectorAll(`.films-list--extra`);
    const filmsExtraContainerElements = this._container.getElement().querySelectorAll(`.films-list--extra .films-list__container`);
    const filmsExtraTitleElements = this._container.getElement().querySelectorAll(`.films-list--extra .films-list__title`);
    const movies = this._moviesModel.getMovies();

    let tempMovies = shuffle(movies);
    const topRatedMovies = tempMovies
      .filter((movie) => movie.rating > 0)
      .sort((a, b) => {
        if (a.rating !== b.rating) {
          return b.rating - a.rating;
        }
        return tempMovies.indexOf(a) - tempMovies.indexOf(b);
      })
      .slice(0, MOVIE_EXTRA_COUNT);

    tempMovies = shuffle(movies);
    const mostCommentedMovies = tempMovies
      .filter((movie) => movie.commentIds.length > 0)
      .sort((a, b) => {
        if (a.commentIds.length !== b.commentIds.length) {
          return b.commentIds.length - a.commentIds.length;
        }
        return tempMovies.indexOf(a) - tempMovies.indexOf(b);
      })
      .slice(0, MOVIE_EXTRA_COUNT);

    const renderExtraMoviesPerContainerOfIndex = (extraMovies, sectionElement, index) => {
      if (extraMovies.length === 0) {
        sectionElement.remove();
      } else {
        const newMovies = renderMovies(filmsExtraContainerElements[index], extraMovies, this._onDataChange, this._onViewChange, this._api);
        this._showedExtraMovieControllers = this._showedExtraMovieControllers.concat(newMovies);
      }
    };

    filmsListExtraElements.forEach((element, index) => {
      if (filmsExtraTitleElements[index].textContent === `Top rated`) {
        renderExtraMoviesPerContainerOfIndex(topRatedMovies, element, index);
      } else if (filmsExtraTitleElements[index].textContent === `Most commented`) {
        renderExtraMoviesPerContainerOfIndex(mostCommentedMovies, element, index);
      }
    });
  }

  _removeMainMovies() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
    this._showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;
  }

  _renderShowMoreButton(sortedMovies) {
    remove(this._showMoreButtonComponent);

    if (this._showingMoviesCount >= sortedMovies.length) {
      return;
    }

    const filmsListAllElement = this._container.getElement().querySelector(`.films-list`);

    render(filmsListAllElement, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevMoviesCount = this._showingMoviesCount;
      this._showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

      this._renderMainMovies(sortedMovies.slice(prevMoviesCount, this._showingMoviesCount));

      if (this._showingMoviesCount >= sortedMovies.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _updateMovies(count) {
    this._removeMainMovies();
    const sortedMovies = this._sortMovies(this._sortingComponent._currentSortType);
    this._renderMainMovies(sortedMovies.slice(0, count));
    this._renderShowMoreButton(sortedMovies);
  }

  _onDataChange(movieController, oldData, newData, mode = `moviePut`, commentData = null, deleteButtonElement = null) {
    switch (mode) {
      case `moviePut`:
        if (newData.userRating !== oldData.userRating) {
          movieController.blockUserRatingControls();
        }

        this._api.updateMovie(oldData.id, newData)
          .then((movieModel) => {
            const isSuccess = this._moviesModel.updateMovie(oldData.id, movieModel);

            if (isSuccess) {
              movieController.render(newData);
              this._renderExtraMovies();

              const movies = this._moviesModel.getMoviesAll();
              const watchedMoviesAmount = getCategoryFilmsAmount(movies, `isWatched`);
              this._profileHeaderComponent.rerender(watchedMoviesAmount);
            }
          })
          .catch(() => movieController.unblockUserRatingControls());
        break;
      case `commentDelete`:
        deleteButtonElement.textContent = `Deleting…`;
        this._api.deleteComment(commentData.id)
          .then(() => {
            const isSuccess = this._moviesModel.updateMovie(oldData.id, newData);

            if (isSuccess) {
              this._moviesModel.deleteComment(oldData.id);

              movieController.render(newData);
              this._renderExtraMovies();
            }
          })
          .catch(() => {
            deleteButtonElement.textContent = `Delete`;
          });
        break;
      case `commentAdd`:
        this._api.createComment(oldData.id, commentData)
          .then((movieModel) => {
            const isSuccess = this._moviesModel.updateMovie(oldData.id, movieModel);

            if (isSuccess) {
              movieController.render(movieModel);
              this._renderExtraMovies();
            }
          })
          .catch(() => movieController.shakeCommentInput());
        break;
    }
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
    this._showedExtraMovieControllers.forEach((it) => it.setDefaultView());
  }

  _sortMovies(sortType) {
    let sortedMovies = [];
    const movies = this._moviesModel.getMovies();

    switch (sortType) {
      case `date-down`:
        sortedMovies = movies.slice().sort((a, b) => b.releaseDate - a.releaseDate);
        break;
      case `rating-down`:
        sortedMovies = movies.slice().sort((a, b) => b.rating - a.rating);
        break;
      case `default`:
        sortedMovies = movies.slice();
        break;
    }

    return sortedMovies;
  }

  _onSortTypeChange(sortType) {
    const sortedMovies = this._sortMovies(sortType);

    remove(this._showMoreButtonComponent);

    this._removeMainMovies();

    this._renderMainMovies(sortedMovies.slice(0, this._showingMoviesCount));

    this._renderShowMoreButton(sortedMovies);
  }

  _onFilterChange() {
    this._updateMovies(SHOWING_MOVIES_COUNT_ON_START);
  }
}

export default PageController;
