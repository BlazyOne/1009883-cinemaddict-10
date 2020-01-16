const getRandomBoolean = () => Math.random() >= 0.5;

const getRandomIntegerNumber = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

const getRandomArrayItem = (array) => array[getRandomIntegerNumber(0, array.length - 1)];

// Fisher-Yates shuffle
const shuffle = (data) => {
  let dataCopy = data.slice();
  for (let i = dataCopy.length - 1; i > 0; i--) {
    let j = getRandomIntegerNumber(0, i);

    [dataCopy[i], dataCopy[j]] = [dataCopy[j], dataCopy[i]];
  }
  return dataCopy;
};

const getCategoryFilmsAmount = (cards, category) =>
  cards.reduce((accumulator, card) => {
    if (card[category]) {
      return accumulator + 1;
    }
    return accumulator;
  }, 0);

const castTimeFormat = (value) => value < 10 ? `0${value}` : String(value);

const getRank = (watchedAmount) => {
  let rank = ``;
  if (watchedAmount >= 1 && watchedAmount <= 10) {
    rank = `Novice`;
  } else if (watchedAmount >= 11 && watchedAmount <= 20) {
    rank = `Fan`;
  } else if (watchedAmount >= 21) {
    rank = `Movie Buff`;
  }

  return rank;
};

const getRuntimeText = (runtime) => {
  const runtimeHours = Math.floor(runtime / 60);
  const runtimeMinutes = runtime % 60;
  const runtimeText = runtimeHours ? `${runtimeHours}h ${runtimeMinutes}m` : `${runtimeMinutes}m`;

  return runtimeText;
};

export {getRandomBoolean, getRandomIntegerNumber, getRandomArrayItem, shuffle, getCategoryFilmsAmount, castTimeFormat, getRank, getRuntimeText};
