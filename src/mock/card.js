import {getRandomBoolean, getRandomIntegerNumber, getRandomArrayItem, shuffle} from '../utils/common.js';

const WRITERS_ACTORS_AMOUNT = 3;
const MIN_YEAR = 1925;
const MAX_YEAR = 2020;
const MAX_GENRES = 3;
const MAX_COMMENTS = 5;

const TITLES = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
  `The Great Flamarion`,
  `Made for Each Other`,
  `The Lord of the Rings`,
  `The Hobbit`,
  `Mortal Kombat`,
  `Die Hard`,
  `The Matrix`,
  `The Fast and the Furious`,
  `The Terminator`,
  `Back to the Future`,
  `Jurassic Park`
];

const POSTER_URLS = [
  `./images/posters/made-for-each-other.png`,
  `./images/posters/popeye-meets-sinbad.png`,
  `./images/posters/sagebrush-trail.jpg`,
  `./images/posters/santa-claus-conquers-the-martians.jpg`,
  `./images/posters/the-dance-of-life.jpg`,
  `./images/posters/the-great-flamarion.jpg`,
  `./images/posters/the-man-with-the-golden-arm.jpg`
];

const NAMES = [
  `Anthony Mann`,
  `Anne Wigton`,
  `Heinz Herald`,
  `Richard Weil`,
  `Erich von Stroheim`,
  `Mary Beth Hughes`,
  `Dan Duryea`
];

const COUNTRIES = [
  `USA`,
  `Russia`,
  `UK`,
  `France`,
  `Germany`,
  `Japan`,
  `China`
];

const GENRES = [
  `Musical`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Action`
];

const DESCRIPTION_SAMPLE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;

const COMMENTS = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
  `Very nice movie`
];

const COMMENT_EMOJIS = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

const getRandomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generateComment = () => {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 7);
  return {
    id: Math.random(),
    name: getRandomArrayItem(NAMES),
    date: getRandomDate(minDate, new Date()),
    message: getRandomArrayItem(COMMENTS),
    emoji: getRandomArrayItem(COMMENT_EMOJIS)
  };
};

const generateCard = () => {
  const isWatched = getRandomBoolean();
  const minWatchingDate = new Date();
  minWatchingDate.setFullYear(minWatchingDate.getFullYear() - 1);
  return {
    id: Math.random(),
    title: getRandomArrayItem(TITLES),
    titleOriginal: getRandomArrayItem(TITLES),
    poster: getRandomArrayItem(POSTER_URLS),
    rating: getRandomIntegerNumber(0, 90) / 10,
    userRating: isWatched && getRandomBoolean() ? getRandomIntegerNumber(1, 9) : null,
    age: getRandomIntegerNumber(6, 18),
    director: getRandomArrayItem(NAMES),
    writers: shuffle(NAMES).slice(0, WRITERS_ACTORS_AMOUNT).join(`, `),
    actors: shuffle(NAMES).slice(0, WRITERS_ACTORS_AMOUNT).join(`, `),
    releaseDate: getRandomDate(new Date(MIN_YEAR, 0, 1), new Date(MAX_YEAR, 0, 1)),
    runtime: getRandomIntegerNumber(1, 240),
    country: getRandomArrayItem(COUNTRIES),
    genres: shuffle(GENRES).slice(0, getRandomIntegerNumber(1, MAX_GENRES)),
    description: shuffle(DESCRIPTION_SAMPLE.split(`. `)).slice(0, getRandomIntegerNumber(1, 3)).join(`. `) + `.`,
    isInWatchlist: getRandomBoolean(),
    isWatched,
    isFavorite: getRandomBoolean(),
    comments: Array.from({length: getRandomIntegerNumber(0, MAX_COMMENTS)}, generateComment),
    watchingDate: isWatched ? getRandomDate(minWatchingDate, new Date()) : null
  };
};

const generateCards = (count) =>
  Array.from({length: count}, generateCard);

export {generateCards, NAMES};
