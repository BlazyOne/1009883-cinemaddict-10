import {createProfileHeaderTemplate} from './components/profile-header.js';
import {createMainMenuTemplate} from './components/main-menu.js';
import {createMainSortingTemplate} from './components/main-sorting';
import {createFilmsTemplate} from './components/films.js';
import {createCardTemplate} from './components/card.js';
import {createFilmDetailsTemplate} from './components/film-details.js';
import {createShowMoreButtonTemplate} from './components/show-more-button';

const CARD_MAIN_COUNT = 5;
const CARD_EXTRA_COUNT = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, createProfileHeaderTemplate());

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createMainMenuTemplate());
render(siteMainElement, createMainSortingTemplate());
render(siteMainElement, createFilmsTemplate());

const filmsListAllElement = siteMainElement.querySelector(`.films-list`);
const filmsAllContainerElement = filmsListAllElement.querySelector(`.films-list__container`);
const filmsExtraContainerElements = siteMainElement.querySelectorAll(`.films-list--extra .films-list__container`);
for (let i = 0; i < CARD_MAIN_COUNT; i++) {
  render(filmsAllContainerElement, createCardTemplate());
}
render(filmsListAllElement, createShowMoreButtonTemplate());
filmsExtraContainerElements.forEach((element) => {
  for (let i = 0; i < CARD_EXTRA_COUNT; i++) {
    render(element, createCardTemplate());
  }
});

// render(document.body, createFilmDetailsTemplate());
