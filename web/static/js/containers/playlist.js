import React, { Component } from 'react';
import { bindAsyncActionCreator} from '../utils';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import * as songs from '../redux/modules/songs';
import * as artists from '../redux/modules/artists';
import * as genres from '../redux/modules/genres';
import * as application from '../redux/modules/application';
import * as playlist from '../redux/modules/playlist';
import Table, { Thead, Column } from '../components/table';

const mapStateToProps = (state) => ({
  songsList: state.songs,
  artistsList: state.artists,
  genresList: state.genres,
  playlistSongs: state.playlist
});

const mapDispatchToProps = (dispatch) => ({
  setTitle: bindAsyncActionCreator(application.setTitle, dispatch),
  removeSong: bindAsyncActionCreator(playlist.removeSong, dispatch)
});

@asyncConnect([{
  promise: ({store: {dispatch}}) => {
    return Promise.all([
      dispatch(songs.load()),
      dispatch(artists.load()),
      dispatch(genres.load())
    ]);
  }
}])
@connect(mapStateToProps, mapDispatchToProps)
export default class PlaylistContainer extends Component {

  componentDidMount() {
    this.props.setTitle('Playlist');
  }

  _delete(e, data) {
    e.stopPropagation();
    this.props.removeSong(data);
  }

  _renderTable(){
    let { playlistSongs, artistsList, genresList } = this.props;
    return (
      <Table ref='songsTable'
        data={ playlistSongs }
        noDataMessage='No data found.'>
          <Thead name="title">Title</Thead>
          <Thead name="artist_id">Artist</Thead>
          <Thead name="genre_id">Genre</Thead>
          <Thead name="delete"/>

          <Column name="artist_id" value={artist_id => {
            if (artist_id) {
              return filterList(artistsList, artist_id).name;
            }
            return '';
          }} />
          <Column name="genre_id" value={genre_id => {
            if (genre_id) {
              return filterList(genresList, genre_id).description;
            }
            return '';
          }} />

          <Column className="table-link table-icon" name="delete"
            value={(_, item) =>
              <a onClick={e => this._delete(e, item)}>
                <i className="fa fa-trash"></i>
              </a>
            }
          />
      </Table>
    )
  }

  render() {

    return (
      <div>
        {this.props.children ||
          <div className="page has-menu">
            <div className="page-content">
              <div className="container">
                <div className="box">
                  {::this._renderTable()}
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

let filterList = (list, id) => {
  return list.filter(a => a.id == id)[0];
}
