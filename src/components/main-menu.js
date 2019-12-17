import AbstractComponent from './abstract-component.js';

const createFilterMarkup = (filter) => {
  const {name, count} = filter;
  const hrefName = name === `All movies` ? `all` : name.toLowerCase();
  const countString = name === `All movies` ? `` : ` <span class="main-navigation__item-count">${count}</span>`;
  const activeClass = name === `All movies` ? `main-navigation__item--active` : ``;

  return `<a href="#${hrefName}" class="main-navigation__item ${activeClass}">${name}${countString}</a>`;
};

const createMainMenuTemplate = (filters) => {
  const filtersMarkup = filters
    .map((filter) => createFilterMarkup(filter))
    .join(`\n`);

  return `\
    <nav class="main-navigation">
      ${filtersMarkup}
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`;
};

class MainMenu extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createMainMenuTemplate(this._filters);
  }
}

export default MainMenu;
