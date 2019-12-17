import ProfileHeaderComponent from './components/profile-header.js';
import MainMenuComponent from './components/main-menu.js';
import MainSortingComponent from './components/main-sorting';
import FilmsComponent from './components/films.js';
import PageController from './controllers/page.js';
import {generateCards} from './mock/card.js';
import {generateFilters} from './mock/filter.js';
import {getWatchedAmount} from './mock/rank.js';
import {render} from './utils/render.js';

const CARD_MAIN_COUNT = 22;

const cards = generateCards(CARD_MAIN_COUNT);
const filters = generateFilters(cards);
const watchedAmount = getWatchedAmount(cards);

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new ProfileHeaderComponent(watchedAmount));

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, new MainMenuComponent(filters));

const mainSortingComponent = new MainSortingComponent();
render(siteMainElement, mainSortingComponent);

const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent);

const pageController = new PageController(filmsComponent, mainSortingComponent);

pageController.render(cards);

const footerStatisticsParagraphElement = document.querySelector(`.footer__statistics p`);
footerStatisticsParagraphElement.textContent = `${cards.length} movies inside`;
