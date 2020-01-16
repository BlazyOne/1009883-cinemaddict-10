import MainMenuComponent from '../components/main-menu.js';
import {render, replace} from '../utils/render.js';
import {getMoviesByFilter} from '../utils/filter.js';

const FILTER_NAMES = [`All movies`, `Watchlist`, `History`, `Favorites`];

class MainMenuController {
  constructor(container, moviesModel, statisticsComponent, pageController) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._statisticsComponent = statisticsComponent;
    this._pageController = pageController;

    this._activeFilterType = `All movies`;
    this._mainMenuComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onMenuChange = this._onMenuChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allMovies = this._moviesModel.getMoviesAll();
    const filters = FILTER_NAMES.map((filterType) => ({
      name: filterType,
      count: getMoviesByFilter(allMovies, filterType).length,
      active: filterType === this._activeFilterType
    }));
    const oldComponent = this._mainMenuComponent;

    this._mainMenuComponent = new MainMenuComponent(filters);
    this._mainMenuComponent.setFilterChangeHandler(this._onFilterChange);
    this._mainMenuComponent.setMenuChangeHandler(this._onMenuChange);

    if (oldComponent) {
      replace(this._mainMenuComponent, oldComponent);
    } else {
      render(container, this._mainMenuComponent);
    }
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onMenuChange(menuType) {
    switch (menuType) {
      case `filter`:
        this._statisticsComponent.hide();
        this._statisticsComponent.setMode(`all-time`);
        this._pageController.show();
        break;
      case `statistics`:
        this._pageController.hide();
        this._statisticsComponent.show();
        break;
    }
  }

  _onDataChange() {
    this.render();
  }
}

export default MainMenuController;
