class Movie {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`film_info`][`title`];
    this.titleOriginal = data[`film_info`][`alternative_title`];
    this.poster = data[`film_info`][`poster`];
    this.rating = data[`film_info`][`total_rating`];
    this.userRating = data[`user_details`][`personal_rating`];
    this.age = data[`film_info`][`age_rating`];
    this.director = data[`film_info`][`director`];
    this.writers = data[`film_info`][`writers`];
    this.actors = data[`film_info`][`actors`];
    this.releaseDate = new Date(data[`film_info`][`release`][`date`]);
    this.runtime = data[`film_info`][`runtime`];
    this.country = data[`film_info`][`release`][`release_country`];
    this.genres = data[`film_info`][`genre`];
    this.description = data[`film_info`][`description`];
    this.isInWatchlist = data[`user_details`][`watchlist`];
    this.isWatched = data[`user_details`][`already_watched`];
    this.isFavorite = data[`user_details`][`favorite`];
    this.watchingDate = new Date(data[`user_details`][`watching_date`]);

    this.comments = [];
    this.commentIds = data[`comments`];
  }

  movieToServerNotation() {
    return {
      'id': this.id,
      'comments': this.commentIds,
      'film_info': {
        'title': this.title,
        'alternative_title': this.titleOriginal,
        'total_rating': this.rating,
        'poster': this.poster,
        'age_rating': this.age,
        'director': this.director,
        'writers': this.writers,
        'actors': this.actors,
        'release': {
          'date': this.releaseDate.getTime(),
          'release_country': this.country,
        },
        'runtime': this.runtime,
        'genre': this.genres,
        'description': this.description
      },
      'user_details': {
        'personal_rating': this.userRating,
        'watchlist': this.isInWatchlist,
        'already_watched': this.isWatched,
        'watching_date': this.watchingDate.toISOString(),
        'favorite': this.isFavorite
      }
    };
  }

  static parseMovie(movieData) {
    return new Movie(movieData);
  }

  static parseMovies(moviesData) {
    return moviesData.map(Movie.parseMovie);
  }

  cloneMovie() {
    const clonedMovie = new Movie(this.movieToServerNotation());
    clonedMovie.comments = this.comments;

    return clonedMovie;
  }

  static parseComment(commentData) {
    return {
      'id': commentData[`id`],
      'name': commentData[`author`],
      'date': new Date(commentData[`date`]),
      'message': commentData[`comment`],
      'emoji': commentData[`emotion`]
    };
  }

  static parseComments(commentsData) {
    return commentsData.map(Movie.parseComment());
  }

  static toLocalComment(comment) {
    return {
      'comment': comment[`message`],
      'date': comment[`date`].toISOString(),
      'emotion': comment[`emotion`]
    };
  }
}

export default Movie;
