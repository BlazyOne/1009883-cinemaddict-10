import ProfileHeaderComponent from './components/profile-header.js';
import MainSortingComponent from './components/main-sorting';
import FilmsComponent from './components/films.js';
import PageController from './controllers/page.js';
import MainMenuController from './controllers/main-menu.js';
import MoviesModel from './models/movies.js';
import {generateCards} from './mock/card.js';
import {getWatchedAmount} from './mock/rank.js';
import {render} from './utils/render.js';

const CARD_MAIN_COUNT = 22;

const cards = generateCards(CARD_MAIN_COUNT);
const watchedAmount = getWatchedAmount(cards);

const moviesModel = new MoviesModel();
moviesModel.setMovies(cards);

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new ProfileHeaderComponent(watchedAmount));

const siteMainElement = document.querySelector(`.main`);
const mainMenuController = new MainMenuController(siteMainElement, moviesModel);
mainMenuController.render();

const mainSortingComponent = new MainSortingComponent();
render(siteMainElement, mainSortingComponent);

const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent);

const pageController = new PageController(filmsComponent, mainSortingComponent, moviesModel);

pageController.render();

const footerStatisticsParagraphElement = document.querySelector(`.footer__statistics p`);
footerStatisticsParagraphElement.textContent = `${cards.length} movies inside`;
