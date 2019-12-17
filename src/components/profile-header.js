import AbstractComponent from './abstract-component.js';

const createProfileHeaderTemplate = (watchedAmount) => {

  let rank = ``;
  if (watchedAmount >= 1 && watchedAmount <= 10) {
    rank = `Novice`;
  } else if (watchedAmount >= 11 && watchedAmount <= 20) {
    rank = `Fan`;
  } else if (watchedAmount >= 21) {
    rank = `Movie Buff`;
  }

  return `\
    <section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};

class ProfileHeader extends AbstractComponent {
  constructor(watchedAmount) {
    super();
    this._watchedAmount = watchedAmount;
  }

  getTemplate() {
    return createProfileHeaderTemplate(this._watchedAmount);
  }
}

export default ProfileHeader;
