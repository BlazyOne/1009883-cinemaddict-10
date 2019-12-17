import CardComponent from '../components/card.js';
import FilmDetailsComponent from '../components/film-details.js';
import ShowMoreButtonComponent from '../components/show-more-button';
import NoCardsComponent from '../components/no-cards';
import {shuffle} from '../utils/common.js';
import {render, remove} from '../utils/render.js';

const CARD_EXTRA_COUNT = 2;
const SHOWING_CARDS_COUNT_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;

const renderCard = (container, card) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      removeDetails();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const showDetails = () => {
    render(document.body, filmDetailsComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const removeDetails = () => {
    filmDetailsComponent.getElement().remove();
  };

  const cardComponent = new CardComponent(card);

  cardComponent.setPosterClickHandler(showDetails);
  cardComponent.setTitleClickHandler(showDetails);
  cardComponent.setCommentsAmountClickHandler(showDetails);

  const filmDetailsComponent = new FilmDetailsComponent(card);

  filmDetailsComponent.setCloseButtonClickHandler(removeDetails);

  render(container, cardComponent);
};

const renderCards = (container, cards) =>
  cards.forEach((card) =>
    renderCard(container, card)
  );

class PageController {
  constructor(container, sortingComponent) {
    this._container = container;

    this._sortingComponent = sortingComponent;
    this._noCardsComponent = new NoCardsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(cards) {
    const renderExtraCards = () => {
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
          renderCards(filmsExtraContainerElements[index], extraCards);
        }
      };

      filmsListExtraElements.forEach((element, index) => {
        if (filmsExtraTitleElements[index].textContent === `Top rated`) {
          renderExtraCardsPerContainerOfIndex(topRatedCards, element, index);
        } else if (filmsExtraTitleElements[index].textContent === `Most commented`) {
          renderExtraCardsPerContainerOfIndex(mostCommentedCards, element, index);
        }
      });
    };

    const renderShowMoreButton = (sortedCards) => {
      if (showingCardsCount >= sortedCards.length) {
        return;
      }

      render(filmsListAllElement, this._showMoreButtonComponent);

      this._showMoreButtonComponent.setClickHandler(() => {
        const prevCardsCount = showingCardsCount;
        showingCardsCount += SHOWING_CARDS_COUNT_BY_BUTTON;

        renderCards(filmsAllContainerElement, sortedCards.slice(prevCardsCount, showingCardsCount));

        if (showingCardsCount >= sortedCards.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    };

    const sortCards = (sortType) => {
      let sortedCards = [];

      switch (sortType) {
        case `date-down`:
          sortedCards = cards.slice().sort((a, b) => b.releaseDate - a.releaseDate);
          break;
        case `rating-down`:
          sortedCards = cards.slice().sort((a, b) => b.rating - a.rating);
          break;
        case `default`:
          sortedCards = cards.slice();
          break;
      }

      return sortedCards;
    };

    const filmsListAllElement = this._container.getElement().querySelector(`.films-list`);
    const filmsAllContainerElement = filmsListAllElement.querySelector(`.films-list__container`);

    if (cards.length === 0) {
      render(filmsListAllElement, this._noCardsComponent);
      return;
    }

    let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
    renderCards(filmsAllContainerElement, cards.slice(0, showingCardsCount));
    renderShowMoreButton(cards);

    renderExtraCards();

    this._sortingComponent.setSortTypeChangeHandler((sortType) => {
      const sortedCards = sortCards(sortType);

      remove(this._showMoreButtonComponent);
      filmsAllContainerElement.innerHTML = ``;

      showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

      renderCards(filmsAllContainerElement, sortedCards.slice(0, showingCardsCount));

      renderShowMoreButton(sortedCards);
    });
  }
}

export default PageController;
