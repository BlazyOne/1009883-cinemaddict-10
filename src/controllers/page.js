import MovieController from './movie.js';
import ShowMoreButtonComponent from '../components/show-more-button';
import NoCardsComponent from '../components/no-cards';
import {shuffle} from '../utils/common.js';
import {render, remove} from '../utils/render.js';

const CARD_EXTRA_COUNT = 2;
const SHOWING_CARDS_COUNT_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;

const renderCards = (container, cards, onDataChange, onViewChange) =>
  cards.map((card) => {
    const movieController = new MovieController(container, onDataChange, onViewChange);
    movieController.render(card);

    return movieController;
  });

class PageController {
  constructor(container, sortingComponent) {
    this._container = container;

    this._cards = [];
    this._showedMovieControllers = [];
    this._showedExtraMovieControllers = [];
    this._showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
    this._sortingComponent = sortingComponent;
    this._noCardsComponent = new NoCardsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(cards) {
    this._cards = cards;

    const filmsListAllElement = this._container.getElement().querySelector(`.films-list`);
    const filmsAllContainerElement = filmsListAllElement.querySelector(`.films-list__container`);

    if (cards.length === 0) {
      render(filmsListAllElement, this._noCardsComponent);
      return;
    }

    let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
    const newCards = renderCards(filmsAllContainerElement, cards.slice(0, showingCardsCount), this._onDataChange, this._onViewChange);
    this._showedMovieControllers = newCards;

    this._renderShowMoreButton(cards);

    this._renderExtraCards(cards);
  }

  _renderExtraCards(cards) {
    const filmsListExtraElements = this._container.getElement().querySelectorAll(`.films-list--extra`);
    const filmsExtraContainerElements = this._container.getElement().querySelectorAll(`.films-list--extra .films-list__container`);
    const filmsExtraTitleElements = this._container.getElement().querySelectorAll(`.films-list--extra .films-list__title`);

    let tempCards = shuffle(cards);
    const topRatedCards = tempCards
      .filter((card) => card.rating > 0)
      .sort((a, b) => {
        if (a.rating !== b.rating) {
          return b.rating - a.rating;
        }
        return tempCards.indexOf(a) - tempCards.indexOf(b);
      })
      .slice(0, CARD_EXTRA_COUNT);

    tempCards = shuffle(cards);
    const mostCommentedCards = tempCards
      .filter((card) => card.comments.length > 0)
      .sort((a, b) => {
        if (a.comments.length !== b.comments.length) {
          return b.comments.length - a.comments.length;
        }
        return tempCards.indexOf(a) - tempCards.indexOf(b);
      })
      .slice(0, CARD_EXTRA_COUNT);

    const renderExtraCardsPerContainerOfIndex = (extraCards, sectionElement, index) => {
      if (extraCards.length === 0) {
        sectionElement.remove();
      } else {
        const newCards = renderCards(filmsExtraContainerElements[index], extraCards, this._onDataChange, this._onViewChange);
        this._showedExtraMovieControllers = this._showedExtraMovieControllers.concat(newCards);
      }
    };

    filmsListExtraElements.forEach((element, index) => {
      if (filmsExtraTitleElements[index].textContent === `Top rated`) {
        renderExtraCardsPerContainerOfIndex(topRatedCards, element, index);
      } else if (filmsExtraTitleElements[index].textContent === `Most commented`) {
        renderExtraCardsPerContainerOfIndex(mostCommentedCards, element, index);
      }
    });
  }

  _renderShowMoreButton(sortedCards) {
    if (this._showingCardsCount >= this._cards.length) {
      return;
    }

    const filmsListAllElement = this._container.getElement().querySelector(`.films-list`);
    const filmsAllContainerElement = filmsListAllElement.querySelector(`.films-list__container`);

    render(filmsListAllElement, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevCardsCount = this._showingCardsCount;
      this._showingCardsCount += SHOWING_CARDS_COUNT_BY_BUTTON;

      const newCards = renderCards(filmsAllContainerElement, sortedCards.slice(prevCardsCount, this._showingCardsCount), this._onDataChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newCards);

      if (this._showingCardsCount >= sortedCards.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    movieController.render(this._cards[index]);
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
    this._showedExtraMovieControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const sortCards = () => {
      let sortedCards = [];

      switch (sortType) {
        case `date-down`:
          sortedCards = this._cards.slice().sort((a, b) => b.releaseDate - a.releaseDate);
          break;
        case `rating-down`:
          sortedCards = this._cards.slice().sort((a, b) => b.rating - a.rating);
          break;
        case `default`:
          sortedCards = this._cards.slice();
          break;
      }

      return sortedCards;
    };

    const sortedCards = sortCards(sortType);

    const filmsListAllElement = this._container.getElement().querySelector(`.films-list`);
    const filmsAllContainerElement = filmsListAllElement.querySelector(`.films-list__container`);

    remove(this._showMoreButtonComponent);
    filmsAllContainerElement.innerHTML = ``;

    this._showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

    const newCards = renderCards(filmsAllContainerElement, sortedCards.slice(0, this._showingCardsCount), this._onDataChange, this._onViewChange);
    this._showedMovieControllers = newCards;

    this._renderShowMoreButton(sortedCards);
  }
}

export default PageController;
