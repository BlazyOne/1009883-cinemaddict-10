import AbstractComponent from './abstract-component.js';

const createShowMoreButtonTemplate = () =>
  `<button class="films-list__show-more">Show more</button>`;

class ShowMoreButton extends AbstractComponent {
  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}

export default ShowMoreButton;
