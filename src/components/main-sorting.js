import AbstractComponent from './abstract-component.js';

const createMainSortingTemplate = () =>
  `<ul class="sort">
    <li><a href="#" data-sort-type="default" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="date-down" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="rating-down" class="sort__button">Sort by rating</a></li>
  </ul>`;

class MainSorting extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = `default`;
  }

  getTemplate() {
    return createMainSortingTemplate();
  }

  getCurrentSortButton() {
    return this.getElement().querySelector(`[data-sort-type="${this._currentSortType}"]`);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this.getCurrentSortButton().classList.remove(`sort__button--active`);
      this._currentSortType = sortType;
      this.getCurrentSortButton().classList.add(`sort__button--active`);

      handler(this._currentSortType);
    });
  }
}

export default MainSorting;
