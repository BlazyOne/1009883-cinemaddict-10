import MainMenuComponent from '../components/main-menu.js';
import {render, replace} from '../utils/render.js';
import {getMoviesByFilter} from '../utils/filter';

const FILTER_NAMES = [`All movies`, `Watchlist`, `History`, `Favorites`];

class MainMenuController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = `All movies`;
    this._mainMenuComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

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

  _onDataChange() {
    this.render();
  }
}

export default MainMenuController;
