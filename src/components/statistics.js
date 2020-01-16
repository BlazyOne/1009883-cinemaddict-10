import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import 'chart.js/dist/Chart.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getCategoryFilmsAmount, getRank} from '../utils/common.js';

const getMoviesByWatchingRange = (movies, dateFrom, dateTo) => movies.filter((movie) => movie.watchingDate >= dateFrom && movie.watchingDate <= dateTo);

const getMoviesByMode = (movies, mode) => {
  const setToZeroTime = (date) => {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
  };

  const now = new Date();
  let dateFrom = new Date();
  switch (mode) {
    case `all-time`:
      return movies.slice().filter((movie) => movie.isWatched);
    case `today`:
      setToZeroTime(dateFrom);
      return getMoviesByWatchingRange(movies, dateFrom, now);
    case `week`:
      dateFrom.setDate(now.getDate() - 6);
      setToZeroTime(dateFrom);
      return getMoviesByWatchingRange(movies, dateFrom, now);
    case `month`:
      dateFrom.setMonth(now.getMonth() - 1);
      if (dateFrom.getMonth === now.getMonth) {
        dateFrom.setDate(1);
      } else {
        dateFrom.setDate(dateFrom.getDate() + 1);
      }
      setToZeroTime(dateFrom);
      return getMoviesByWatchingRange(movies, dateFrom, now);
    case `year`:
      dateFrom.setFullYear(now.getFullYear() - 1);
      dateFrom.setDate(dateFrom.getDate() + 1);
      setToZeroTime(dateFrom);
      return getMoviesByWatchingRange(movies, dateFrom, now);
  }
  return null;
};

const getStatisticsValues = (moviesModel, mode) => {
  const movies = moviesModel.getMoviesAll().slice();
  const moviesByMode = getMoviesByMode(movies, mode);

  const moviesAmount = moviesByMode.length;

  const totalDuration = moviesByMode.reduce((acc, movie) => {
    return acc + movie.runtime;
  }, 0);

  const genresRepeating = moviesByMode.reduce((acc, movie) => {
    return acc.concat(movie.genres);
  }, []);
  const genres = genresRepeating.filter((genre, index) => genresRepeating.findIndex((it) => it === genre) === index);
  genres.sort((genreA, genreB) => {
    const genreAAmount = moviesByMode.filter((movie) => movie.genres.includes(genreA)).length;
    const genreBAmount = moviesByMode.filter((movie) => movie.genres.includes(genreB)).length;
    return genreBAmount - genreAAmount;
  });

  const genresValues = genres.map((genre) => moviesByMode.filter((movie) => movie.genres.includes(genre)).length);

  return {moviesAmount, totalDuration, genres, genresValues};
};

const renderGenresChart = (genresCtx, moviesModel, mode) => {
  const {genres, genresValues} = getStatisticsValues(moviesModel, mode);

  return new Chart(genresCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: genresValues,
        backgroundColor: `#999999`,
        barThickness: 30,
        categoryPercentage: 1.0,
        barPercentage: 1.0
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 12
          },
          color: `#ffffff`,
          align: `left`,
          anchor: `start`
        }
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true
          },
          display: false,
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          ticks: {
            padding: 20,
            fontColor: `#ffffff`
          },
          gridLines: {
            display: false
          }
        }]
      }
    }
  });
};

const createStatisticsTemplate = (moviesModel, mode) => {
  const {moviesAmount, totalDuration, genres} = getStatisticsValues(moviesModel, mode);
  let totalDurationHours = 0;
  let totalDurationMinutes = 0;
  let topGenre = `-`;
  if (moviesAmount > 0) {
    totalDurationHours = Math.floor(totalDuration / 60);
    totalDurationMinutes = totalDuration % 60;
    topGenre = genres[0];
  }
  const rank = getRank(getCategoryFilmsAmount(moviesModel.getMoviesAll(), `isWatched`));

  return `\
    <section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rank}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${mode === `all-time` ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${mode === `today` ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${mode === `week` ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${mode === `month` ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${mode === `year` ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${moviesAmount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDurationHours} <span class="statistic__item-description">h</span> ${totalDurationMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`;
};

class Statistics extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();

    this._moviesModel = moviesModel;

    this._mode = `all-time`;

    this._genresChart = null;

    this._renderCharts();
    this._setModeChangeHandler();
  }

  getTemplate() {
    return createStatisticsTemplate(this._moviesModel, this._mode);
  }

  show() {
    super.show();

    this.rerender(this._mode);
  }

  recoveryListeners() {
    this._setModeChangeHandler();
  }

  setMode(mode) {
    this._mode = mode;
  }

  rerender(mode) {
    this._mode = mode;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const genresCtx = element.querySelector(`.statistic__chart`);

    this._resetCharts();

    this._genresChart = renderGenresChart(genresCtx, this._moviesModel, this._mode);
  }

  _resetCharts() {
    if (this._genresChart) {
      this._genresChart.destroy();
      this._genresChart = null;
    }
  }

  _setModeChangeHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, () => {
      const mode = this.getElement().querySelector(`input[name="statistic-filter"]:checked`).value;
      this.rerender(mode);
    });
  }
}

export default Statistics;
