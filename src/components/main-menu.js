import AbstractComponent from './abstract-component.js';

const createFilterMarkup = (filter) => {
  const {name, count, active} = filter;
  const hrefName = name === `All movies` ? `all` : name.toLowerCase();
  const countString = name === `All movies` ? `` : ` <span class="main-navigation__item-count">${count}</span>`;
  const activeClass = active ? `main-navigation__item--active` : ``;

  return `<a href="#${hrefName}" data-filter-type="${name}" data-menu-type="filter" class="main-navigation__item ${activeClass}">${name}${countString}</a>`;
};

const createMainMenuTemplate = (filters) => {
  const filtersMarkup = filters
    .map((filter) => createFilterMarkup(filter))
    .join(`\n`);

  return `\
    <nav class="main-navigation">
      ${filtersMarkup}
      <a href="#stats" data-menu-type="statistics" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`;
};

class MainMenu extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;

    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this.getElement().querySelectorAll(`a`).forEach((element) => element.classList.remove(`main-navigation__item--active`));
      evt.target.classList.add(`main-navigation__item--active`);
    });
  }

  getTemplate() {
    return createMainMenuTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const filterName = evt.target.dataset.filterType;
      if (filterName) {
        handler(filterName);
      }
    });
  }

  setMenuChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const menuType = evt.target.dataset.menuType;
      if (menuType) {
        handler(menuType);
      }
    });
  }
}

export default MainMenu;
