import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import * as application from '../redux/modules/application';
import * as genres from '../redux/modules/genres';
import * as songs from '../redux/modules/songs';
import * as artists from '../redux/modules/artists';
import * as playlist from '../redux/modules/playlist';
import Search from '../components/search';
import Table, { Thead, Column } from '../components/table';
import { bindAsyncActionCreator } from '../utils';
import rd3 from 'rd3';

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
  genresList: state.genres,
  songsList: state.songs,
  artistsList: state.artists
});

const mapDispatchToProps = dispatch => ({
  addSong: bindAsyncActionCreator(playlist.addSong, dispatch)
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
@connect(mapStateToProps, mapDispatchToProps)
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
      return song.title.toUpperCase().includes(value.toUpperCase()) ||
        (artist && artist.name.toUpperCase().includes(value.toUpperCase())) ||
          (genre && genre.description.toUpperCase().includes(value.toUpperCase()));
    });
    let filteredArtists = artistsList.filter(artist => {
      return artist.name.toUpperCase().includes(value.toUpperCase());
    });
    let filteredGenres = genresList.filter(genre => {
      return genre.description.toUpperCase().includes(value.toUpperCase());
    });
    this.setState({
      songsList: filteredSongs,
      genresList: filteredGenres,
      artistsList: filteredArtists
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

  _addGenre(e, genre) {
    e.stopPropagation();
    let { songsList, addSong } = this.props;
    songsList.filter(song => song.genre_id === genre.id)
      .forEach(song => addSong(song))
  }

  _renderGenresBox() {
    let { genresList } = this.state;
    let renderGenreCard = (genre) => {
      return (
        <div key={genre.id}
          className="column card music-card is-quarter"
          style={{ backgroundColor: getRGB(genre.description) }}
          onClick={e => this._addGenre(e, genre)}>

          <div className="card-content">
            {genre.description} <span className="fa fa-music genre-symbol" />
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

  _addSong(e, data) {
    e.stopPropagation();
    this.props.addSong(data);
  }

  _renderTopSongs() {
    let { songsList } = this.state;
    return (
      <div className="box">
        <div className="box-body">
          <div className="box-header">
            <span className="box-title">Songs</span>
          </div>
          <Table data={songsList.slice(0, 10)} displayHeader={false}>
              <Thead name="title"></Thead>
              <Thead name="add"></Thead>
              <Column className="table-link table-icon" name="add"
                value={(_, item) =>
                  <a onClick={e => this._addSong(e, item)}>
                    <i className="fa fa-plus"></i>
                  </a>
                }
              />
          </Table>
        </div>
      </div>
    )
  }

  _addArtist(e, data) {
    e.stopPropagation();
    let { songsList, addSong } = this.props;
    songsList.filter(song => song.artist_id === data.id)
      .forEach(song => addSong(song))
  }

  _renderArtistsBox() {
    let { artistsList } = this.state;
    return (
      <div className="box">
        <div className="box-body">
          <div className="box-header">
            <span className="box-title">Artists</span>
          </div>
          <Table data={artistsList.slice(0, 10)} displayHeader={false}>
              <Thead name="name"></Thead>
              <Thead name="add"></Thead>
              <Column className="table-link table-icon" name="add"
                value={(_, item) =>
                  <a onClick={e => this._addArtist(e, item)}>
                    <i className="fa fa-plus"></i>
                  </a>
                }
              />
          </Table>
        </div>
      </div>
    )
  }

  _renderBarChart() {
    const BarChart = rd3.BarChart;
    let { songsList, genresList } = this.state;
    let data = genresList.map(genre => {
      let filteredSongs = songsList.filter(song => song.genre_id === genre.id).length;
      return {'x': genre.description, 'y': filteredSongs};
    })
    return (
      <div className="chart">
        <BarChart
          data={[
            {name: 'Songs', values: [...data]}
          ]}
          width={450}
          height={400}
          fill={'#3182bd'}
          title='Songs/Genre'
          yAxisLabel='Songs'
          xAxisLabel='Genre' />
      </div>
    )
  }

  _renderArtistsChart() {
    const PieChart = rd3.PieChart;
    let { songsList, artistsList } = this.state;
    let data = [];
    artistsList.forEach(artist => {
      let filteredSongs = songsList.filter(song => song.artist_id === artist.id).length;
      if(filteredSongs > 0){
        let value = (filteredSongs * 100) / songsList.length;
        data.push({label: artist.name, value: Math.round(value * 100) / 100 });
      }
    })
    return (
      <div className="chart">
        <PieChart
        data={data}
        width={450}
        height={400}
        radius={120}
        innerRadius={20}
        sectorBorderColor="white"
        title="Songs/Artist" />
      </div>
    )
  }

  _renderGenresChart() {
    const PieChart = rd3.PieChart;
    let { songsList, genresList } = this.state;
    let data = [];
    genresList.forEach(genre => {
      let filteredSongs = songsList.filter(song => song.genre_id === genre.id).length;
      if(filteredSongs > 0){
        let value = (filteredSongs * 100) / songsList.length;
        data.push({label: genre.description, value: Math.round(value * 100) / 100 });
      }
    })
    return (
      <div className="chart">
        <PieChart
        data={data}
        width={450}
        height={400}
        radius={120}
        innerRadius={20}
        sectorBorderColor="white"
        title="Songs/Genre" />
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
            <div className="columns">
              <div className="column is-third">
                {this._renderGenresChart()}
              </div>
              <div className="column is-third">
                {this._renderBarChart()}
              </div>
              <div className="column is-third">
                {this._renderArtistsChart()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

let getRGB = (seed) => {
  return '#' + intToRGB(hashCode(seed));
}

let hashCode = (str) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
     hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

let intToRGB = (i) => {
  var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return '00000'.substring(0, 6 - c.length) + c;
}

let filterList = (list, id) => {
  return list.filter(a => a.id == id)[0];
}
