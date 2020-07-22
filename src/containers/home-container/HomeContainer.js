import React from "react";
import ReactModal from "react-modal";

import HomePage from "../../pageComponents/HomePage";

import { MOVIE_BASE_URL } from "../../utils/constants";

export default class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      movies: [],
      showMovieDetailsModal: false,
      isMovieDataLoaded: false,
      movieData: null,
    };
  }

  async componentDidMount() {
    try {
      const movieTrendingUrl = `${MOVIE_BASE_URL}/trending/movie/day?page=1`;
      const responsePromise = await fetch(movieTrendingUrl, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      const response = await responsePromise.json();

      this.setState({
        isLoaded: true,
        movies: response.results,
      });
    } catch (e) {
      this.setState({
        error: e,
        isLoaded: true,
      });
    }
  }

  getMovieData = async (movie) => {
    try {
      const movieTrendingUrl = `${MOVIE_BASE_URL}/movie/${movie.id}`;
      const responsePromise = await fetch(movieTrendingUrl, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      const response = await responsePromise.json();

      this.setState({
        isMovieDataLoaded: true,
        movieData: response,
      });
    } catch (e) {
      this.setState({
        error: e,
        isMovieDataLoaded: true,
      });
    }
  }

  handleOpenMovieModal = (movie) => {
    this.getMovieData(movie);
    console.log({movie});
    console.log(this.state.movieData);
    
    this.setState({ showMovieDetailsModal: true });
  };

  handleCloseMovieModal = () => {
    this.setState({ showMovieDetailsModal: false });
  };

  render() {
    console.log(this.state.movieData);
    const { error, isLoaded, movies, isMovieDataLoaded, movieData } = this.state;
    const hasMovies = movies && movies.length > 0;
    return (
      <>
        {error && <div>Error: {error.message}</div>}
        {!isLoaded && <div>Loading...</div>}
        {isLoaded && !error && hasMovies && (
          <>
            <HomePage movies={movies} onCardClick={this.handleOpenMovieModal} />
            <ReactModal
              isOpen={this.state.showMovieDetailsModal}
              // gets called for closing the modal via esc / other keys
              onRequestClose={this.handleCloseMovieModal}
            >
              <button onClick={this.handleCloseMovieModal}>X</button>
              {!isMovieDataLoaded && <div>Loading...</div>}
              {isMovieDataLoaded && !error && movieData && (
                <div>
                  <img src={`http://image.tmdb.org/t/p/w500/${movieData.poster_path}`} alt={`Poster for the movie ${movieData.title}`} />
                  <h2>{movieData.title}</h2>
                  <p>{movieData.release_date.slice(0,4)}</p>
                  <p>{movieData.vote_average}</p>
                  <p>{movieData.overview}</p>
                  {/* <p>{movieData.genres[1]}</p> */}
                </div>
              )}
            </ReactModal>
          </>
        )}
      </>
    );
  }
}

// poster, release date, length, description, genre, title, rating, IMDb link

{/* 
<div>
  <img src={`http://image.tmdb.org/t/p/w500/${movieData.poster_path}`} alt={`Poster for the movie ${movieData.title}`} />
  <h2>{movieData.title}</h2>
  <p>{movieData.release_date.slice(0, 4)}</p>
  <p>{movieData.vote_average}</p>
  <p></p> */}