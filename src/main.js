import ProfileHeaderComponent from './components/profile-header.js';
import MainSortingComponent from './components/main-sorting';
import FilmsComponent from './components/films.js';
import StatisticsComponent from './components/statistics.js';
import PageController from './controllers/page.js';
import MainMenuController from './controllers/main-menu.js';
import MoviesModel from './models/movies.js';
import API from './api.js';
import {generateCards} from './mock/card.js';
import {render} from './utils/render.js';

const AUTHORIZATION = `Basic DXNlckBwYXNzd29yZAb=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const CARD_MAIN_COUNT = 22;

const cards = generateCards(CARD_MAIN_COUNT);

const api = new API(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();
moviesModel.setMovies(cards);

const siteHeaderElement = document.querySelector(`.header`);
const profileHeaderComponent = new ProfileHeaderComponent(0);
const statisticsComponent = new StatisticsComponent(moviesModel);
const mainSortingComponent = new MainSortingComponent();
const filmsComponent = new FilmsComponent();
const pageController = new PageController(filmsComponent, mainSortingComponent, moviesModel, profileHeaderComponent, api);

const siteMainElement = document.querySelector(`.main`);
const mainMenuController = new MainMenuController(siteMainElement, moviesModel, statisticsComponent, pageController);

render(siteHeaderElement, profileHeaderComponent);
mainMenuController.render();
render(siteMainElement, mainSortingComponent);
render(siteMainElement, filmsComponent);
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

const footerStatisticsParagraphElement = document.querySelector(`.footer__statistics p`);
footerStatisticsParagraphElement.textContent = `0 movies inside`;

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    pageController.render();
    footerStatisticsParagraphElement.textContent = `${movies.length} movies inside`;
  });
