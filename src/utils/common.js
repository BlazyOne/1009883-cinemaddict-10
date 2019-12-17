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

export {getRandomBoolean, getRandomIntegerNumber, getRandomArrayItem, shuffle, getCategoryFilmsAmount, castTimeFormat};
