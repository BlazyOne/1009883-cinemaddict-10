import AbstractComponent from './abstract-component.js';

const createNoCardsTemplate = () =>
  `<h2 class="films-list__title">There are no movies in our database</h2>`;

class NoCards extends AbstractComponent {
  getTemplate() {
    return createNoCardsTemplate();
  }
}

export default NoCards;
