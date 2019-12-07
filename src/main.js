import ProfileHeaderComponent from './components/profile-header.js';
import MainMenuComponent from './components/main-menu.js';
import MainSortingComponent from './components/main-sorting';
import FilmsComponent from './components/films.js';
import CardComponent from './components/card.js';
import FilmDetailsComponent from './components/film-details.js';
import ShowMoreButtonComponent from './components/show-more-button';
import NoCardsComponent from './components/no-cards';
import {generateCards} from './mock/card.js';
import {generateFilters} from './mock/filter.js';
import {getWatchedAmount} from './mock/rank.js';
import {shuffle, render} from './utils.js';

const CARD_MAIN_COUNT = 22;
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
    if (document.querySelector(`.film-details`)) {
      document.querySelector(`.film-details`).remove();
    }
    render(document.body, filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const removeDetails = () => {
    filmDetailsComponent.getElement().remove();
  };

  const cardComponent = new CardComponent(card);
  const cardPosterElement = cardComponent.getElement().querySelector(`.film-card__poster`);
  const cardTitleElement = cardComponent.getElement().querySelector(`.film-card__title`);
  const cardCommentsAmountElement = cardComponent.getElement().querySelector(`.film-card__comments`);

  cardPosterElement.addEventListener(`click`, showDetails);
  cardTitleElement.addEventListener(`click`, showDetails);
  cardCommentsAmountElement.addEventListener(`click`, showDetails);

  const filmDetailsComponent = new FilmDetailsComponent(card);
  const filmDetailsCloseElement = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);

  filmDetailsCloseElement.addEventListener(`click`, removeDetails);

  render(container, cardComponent.getElement());
};

const cards = generateCards(CARD_MAIN_COUNT);
const filters = generateFilters(cards);
const watchedAmount = getWatchedAmount(cards);

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new ProfileHeaderComponent(watchedAmount).getElement());

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, new MainMenuComponent(filters).getElement());
render(siteMainElement, new MainSortingComponent().getElement());
render(siteMainElement, new FilmsComponent().getElement());

const filmsListAllElement = siteMainElement.querySelector(`.films-list`);
const filmsAllContainerElement = filmsListAllElement.querySelector(`.films-list__container`);
const filmsListExtraElements = siteMainElement.querySelectorAll(`.films-list--extra`);
const filmsExtraContainerElements = siteMainElement.querySelectorAll(`.films-list--extra .films-list__container`);
const filmsExtraTitleElements = siteMainElement.querySelectorAll(`.films-list--extra .films-list__title`);

if (cards.length === 0) {
  render(filmsListAllElement, new NoCardsComponent().getElement());
}

let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
cards.slice(0, showingCardsCount).forEach((card) => renderCard(filmsAllContainerElement, card));

const showMoreButtonComponent = new ShowMoreButtonComponent();
if (cards.length > 0) {
  render(filmsListAllElement, showMoreButtonComponent.getElement());

  showMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevCardsCount = showingCardsCount;
    showingCardsCount += SHOWING_CARDS_COUNT_BY_BUTTON;

    cards.slice(prevCardsCount, showingCardsCount)
      .forEach((card) => renderCard(filmsAllContainerElement, card));

    if (showingCardsCount >= cards.length) {
      showMoreButtonComponent.getElement().remove();
    }
  });
}

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

const renderExtraCards = (extraCards, sectionElement, index) => {
  if (extraCards.length === 0) {
    sectionElement.remove();
  } else {
    extraCards.forEach((card) => renderCard(filmsExtraContainerElements[index], card));
  }
};

filmsListExtraElements.forEach((element, index) => {
  if (filmsExtraTitleElements[index].textContent === `Top rated`) {
    renderExtraCards(topRatedCards, element, index);
  } else if (filmsExtraTitleElements[index].textContent === `Most commented`) {
    renderExtraCards(mostCommentedCards, element, index);
  }
});

const footerStatisticsParagraphElement = document.querySelector(`.footer__statistics p`);
footerStatisticsParagraphElement.textContent = `${cards.length} movies inside`;
