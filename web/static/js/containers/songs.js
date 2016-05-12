import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import * as application from '../redux/modules/application';
import * as genres from '../redux/modules/genres';
import * as songs from '../redux/modules/songs';
import * as artists from '../redux/modules/artists';
import Search from '../components/search';
import Table, { Thead, Column } from '../components/table';

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
export default class Songs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      genresList: props.genresList,
      artistsList: props.artistsList,
      songsList: props.songsList
    };
  }

  componentDidMount() {
    this.props.dispatch(application.setTitle('Songs'));
  }

  onSearch(event){
    let value = event.target.value;
    let { songsList, artistsList } = this.props;
    let filtered = songsList.filter(song => {
      let artist = filterList(artistsList, song.artist_id);
      return song.title.includes(value) || (artist && artist.name.includes(value));
    });
    this.setState({ songsList: filtered });
  }

  _renderSearchBox() {
    return (
      <div className="box">
        <div className="box-body">
          <Search placeholder="Search songs ..." onChange={::this.onSearch}/>
        </div>
      </div>
    )
  }

  _renderSongsBox() {
    let { songsList = [], artistsList = [], genresList = [] } = this.state;
    return (
      <div className="box">
        <div className="box-body">
          <div className="box-header">
            <span className="box-title">Songs</span>
          </div>
          <Table data={songsList}>
              <Thead name="title">Title</Thead>
              <Thead name="artist_id">Artist</Thead>
              <Thead name="genre_id">Genre</Thead>
              <Thead name="play"></Thead>
              <Thead name="plus"></Thead>
              <Column name="artist_id" value={artist_id => {
                if (artist_id) {
                  return filterList(artistsList, artist_id).name;
                }
                return '';
              }} />
              <Column name="genre_id" value={genre_id => {
                if (genre_id) {
                  return filterList(genresList, genre_id).title;
                }
                return '';
              }} />
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
              <div className="column is-10 is-offset-1">
                {this._renderSongsBox()}
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
