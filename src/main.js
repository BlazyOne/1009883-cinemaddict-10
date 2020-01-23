import ProfileHeaderComponent from './components/profile-header.js';
import MainSortingComponent from './components/main-sorting.js';
import LoadingComponent from './components/loading.js';
import FilmsComponent from './components/films.js';
import StatisticsComponent from './components/statistics.js';
import PageController from './controllers/page.js';
import MainMenuController from './controllers/main-menu.js';
import MoviesModel from './models/movies.js';
import API from './api.js';
import {render, remove} from './utils/render.js';
import {getCategoryFilmsAmount} from './utils/common.js';

const AUTHORIZATION = `Basic DXNlckBwYXNzd29yZAa=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();

const siteHeaderElement = document.querySelector(`.header`);
const profileHeaderComponent = new ProfileHeaderComponent(0);
const statisticsComponent = new StatisticsComponent(moviesModel);
const mainSortingComponent = new MainSortingComponent();
const loadingComponent = new LoadingComponent();
const filmsComponent = new FilmsComponent();
const pageController = new PageController(filmsComponent, mainSortingComponent, moviesModel, profileHeaderComponent, api);

const siteMainElement = document.querySelector(`.main`);
const mainMenuController = new MainMenuController(siteMainElement, moviesModel, statisticsComponent, pageController);

render(siteHeaderElement, profileHeaderComponent);
mainMenuController.render();
render(siteMainElement, mainSortingComponent);
render(siteMainElement, loadingComponent);
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

const footerStatisticsParagraphElement = document.querySelector(`.footer__statistics p`);
footerStatisticsParagraphElement.textContent = `0 movies inside`;

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);

    remove(loadingComponent);
    render(siteMainElement, filmsComponent);
    pageController.render();

    footerStatisticsParagraphElement.textContent = `${movies.length} movies inside`;
    const watchedMoviesAmount = getCategoryFilmsAmount(movies, `isWatched`);
    profileHeaderComponent.rerender(watchedMoviesAmount);
  });
