import AbstractSmartComponent from './abstract-smart-component.js';
import {getRank} from '../utils/common.js';

const createProfileHeaderTemplate = (watchedAmount) => {
  const rank = getRank(watchedAmount);

  return `\
    <section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};

class ProfileHeader extends AbstractSmartComponent {
  constructor(watchedAmount) {
    super();
    this._watchedAmount = watchedAmount;
  }

  getTemplate() {
    return createProfileHeaderTemplate(this._watchedAmount);
  }

  recoveryListeners() {}

  rerender(watchedAmount) {
    this._watchedAmount = watchedAmount;

    super.rerender();
  }
}

export default ProfileHeader;
