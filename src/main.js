import {createProfileHeaderTemplate} from './components/profile-header.js';
import {createMainMenuTemplate} from './components/main-menu.js';
import {createMainSortingTemplate} from './components/main-sorting';
import {createFilmsTemplate} from './components/films.js';
import {createCardTemplate} from './components/card.js';
import {createFilmDetailsTemplate} from './components/film-details.js';
import {createShowMoreButtonTemplate} from './components/show-more-button';
import {generateCards} from './mock/card.js';
import {shuffle} from './utils.js';

const CARD_MAIN_COUNT = 22;
const CARD_EXTRA_COUNT = 2;
const SHOWING_CARDS_COUNT_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const cards = generateCards(CARD_MAIN_COUNT);

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, createProfileHeaderTemplate(cards));

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createMainMenuTemplate(cards));
render(siteMainElement, createMainSortingTemplate());
render(siteMainElement, createFilmsTemplate());

const filmsListAllElement = siteMainElement.querySelector(`.films-list`);
const filmsAllContainerElement = filmsListAllElement.querySelector(`.films-list__container`);
const filmsListExtraElements = siteMainElement.querySelectorAll(`.films-list--extra`);
const filmsExtraContainerElements = siteMainElement.querySelectorAll(`.films-list--extra .films-list__container`);
const filmsExtraTitleElements = siteMainElement.querySelectorAll(`.films-list--extra .films-list__title`);

let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
cards.slice(0, showingCardsCount).forEach((card) => render(filmsAllContainerElement, createCardTemplate(card)));

render(filmsListAllElement, createShowMoreButtonTemplate());

const showMoreButtonElement = filmsListAllElement.querySelector(`.films-list__show-more`);
showMoreButtonElement.addEventListener(`click`, () => {
  const prevCardsCount = showingCardsCount;
  showingCardsCount += SHOWING_CARDS_COUNT_BY_BUTTON;

  cards.slice(prevCardsCount, showingCardsCount)
    .forEach((card) => render(filmsAllContainerElement, createCardTemplate(card)));

  if (showingCardsCount >= cards.length) {
    showMoreButtonElement.remove();
  }
});

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
    extraCards.forEach((card) => render(filmsExtraContainerElements[index], createCardTemplate(card)));
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

render(document.body, createFilmDetailsTemplate(cards[0]));

const filmDetailsElement = document.querySelector(`.film-details`);
const filmDetailsCloseElement = filmDetailsElement.querySelector(`.film-details__close-btn`);

filmDetailsCloseElement.addEventListener(`click`, () => {
  filmDetailsElement.remove();
});
