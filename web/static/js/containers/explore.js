import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import * as application from '../redux/modules/application';
import * as genres from '../redux/modules/genres';
import * as songs from '../redux/modules/songs';
import * as artists from '../redux/modules/artists';
import Search from '../components/search';
import Table, { Thead, Column } from '../components/table';
import { shuffle } from '../utils/arrays';

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
  genresList: state.genres.data,
  songsList: state.songs.data,
  artistsList: state.artists.data
});

@asyncConnect([
  { promise: ({store: {dispatch}}) =>
    Promise.all([
      dispatch(genres.load()),
      dispatch(songs.load()),
      dispatch(artists.load())
    ])
  }
])
@connect(mapStateToProps)
export default class Explore extends Component {

  constructor(props) {
    super(props);
    this.state = {
      genresList: props.genresList,
      artistsList: props.artistsList,
      songsList: props.songsList
    };
  }

  componentDidMount() {
    this.props.dispatch(application.setTitle('Explore'));
  }

  onSearch(event){
    let value = event.target.value;
    let { songsList, artistsList, genresList } = this.props;

    let filteredSongs = songsList.filter(song => {
      let artist = filterList(artistsList, song.artist_id);
      let genre = filterList(genresList, song.genre_id);
      return song.title.includes(value) ||
        (artist && artist.name.includes(value)) ||
          (genre && genre.title.includes(value));
    });
    let filteredArtists = artistsList.filter(artist => {
      return artist.name.includes(value);
    });
    let filteredGenres = genresList.filter(genre => {
      return genre.title.includes(value);
    });
    this.setState({
      songsList: filteredSongs,
      genresList: filteredGenres,
      filteredArtists: filteredArtists
    });
  }

  _renderSearchBox() {
    return (
      <div className="box">
        <div className="box-body">
          <Search onChange={::this.onSearch}/>
        </div>
      </div>
    )
  }

  _renderGenresBox() {
    let { genresList } = this.state;
    let renderGenreCard = (genre) => {
      return (
        <div key={genre.id} className="column card music-card is-quarter" style={{ backgroundColor: genre.color }}>
          <div className="card-content">
            {genre.title} <span className="fa fa-music genre-symbol" />
          </div>
        </div>
      )
    }
    return (
      <div className="box">
        <div className="box-header">
          <span className="box-title">Genres</span>
        </div>
        <div className="box-body">
          <div className="columns is-multiline">
            {genresList.map(renderGenreCard)}
          </div>
        </div>
      </div>
    )
  }

  _renderTopSongs() {
    let { songsList } = this.state;
    return (
      <div className="box">
        <div className="box-body">
          <div className="box-header">
            <span className="box-title">Top Songs</span>
          </div>
          <Table data={shuffle(songsList.slice(0, 10))} displayHeader={false}>
              <Thead name="title"></Thead>
              <Thead name="play"></Thead>
              <Thead name="plus"></Thead>
              <Column className="table-link table-icon" name="play"
                value={() => (
                  <a onClick={() => {}}>
                    <i className="fa fa-play"></i>
                  </a>
                )}
              />
              <Column className="table-link table-icon" name="plus"
                value={() => (
                  <a onClick={() => {}}>
                    <i className="fa fa-plus"></i>
                  </a>
                )}
              />
          </Table>
        </div>
      </div>
    )
  }

  _renderArtistsBox() {
    let { artistsList } = this.state;
    return (
      <div className="box">
        <div className="box-body">
          <div className="box-header">
            <span className="box-title">Top Artists</span>
          </div>
          <Table data={shuffle(artistsList.slice(0, 10))} displayHeader={false}>
              <Thead name="name"></Thead>
              <Thead name="plus"></Thead>
              <Column className="table-link table-icon" name="plus"
                value={() => (
                  <a onClick={() => {}}>
                    <i className="fa fa-plus"></i>
                  </a>
                )}
              />
          </Table>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="page">
        <div className="page-content">
          <div className="app-container is-big">
            <div className="columns">
              <div className="column is-12">
                {this._renderSearchBox()}
              </div>
            </div>
            <div className="columns">
              <div className="column is-12">
                {this._renderGenresBox()}
              </div>
            </div>
            <div className="columns">
              <div className="column is-half">
                {this._renderTopSongs()}
              </div>
              <div className="column is-half">
                {this._renderArtistsBox()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

let filterList = (list, id) => {
  return list.filter(a => a.id == id)[0];
}
