import MovieModel from './models/movie.js';

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(MovieModel.parseMovies);
  }

  getComments(movieId) {
    return this._load({url: `comments/${movieId}`})
      .then((response) => response.json())
      .then(MovieModel.parseComments);
  }

  updateMovie(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: `PUT`,
      body: JSON.stringify(data.movieToServerNotation()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(MovieModel.parseMovie);
  }

  createComment(movieId, comment) {
    return this._load({
      url: `comments/${movieId}`,
      method: `POST`,
      body: JSON.stringify(MovieModel.toLocalComment(comment)),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then((response) => {
        const movie = MovieModel.parseMovie(response.movie);
        movie.setComments(MovieModel.parseComments(response.comments));
        return movie;
      });
  }

  deleteComment(id) {
    return this._load({url: `comments/${id}`, method: `DELETE`});
  }

  _load({url, method = `GET`, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}

export default API;
