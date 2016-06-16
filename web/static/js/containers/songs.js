import React, { Component } from 'react';
import { reduxForm, reset } from 'redux-form';
import FormInput from '../components/form/input';
import { bindAsyncActionCreator, parseJSONError} from '../utils';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import * as songs from '../redux/modules/songs';
import * as artists from '../redux/modules/artists';
import * as genres from '../redux/modules/genres';
import * as application from '../redux/modules/application';
import * as playlist from '../redux/modules/playlist';
import Table, { Thead, Column } from '../components/table';
import Modal, { ModalHeader } from '../components/modal';
import LoadingIndicator from '../components/loading-indicator';
import Select from '../components/select';

const mapStateToProps = (state) => ({
  songsList: state.songs,
  artistsList: state.artists,
  genresList: state.genres
});

const mapDispatchToProps = (dispatch) => ({
  setTitle: bindAsyncActionCreator(application.setTitle, dispatch),
  remove: bindAsyncActionCreator(songs.remove, dispatch),
  save: bindAsyncActionCreator(songs.save, dispatch),
  update: bindAsyncActionCreator(songs.update, dispatch),
  showError: bindAsyncActionCreator(application.showErrorMessage, dispatch),
  addSong: bindAsyncActionCreator(playlist.addSong, dispatch),
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
export default class SongContainer extends Component {

  componentDidMount() {
    this.props.setTitle('Songs');
  }

  _delete(e, data) {
    e.stopPropagation();
    this.props.remove(data.id)
      .catch(error => this.props.showError(parseJSONError(error)));
  }

  _addPlaylist(e, data) {
    e.stopPropagation();
    this.props.addSong(data);
  }

  _renderDetailRow(rowNum, row) {
    return (
      <SongForm
        form={`songForm/${row.id}`}
        initialValues={row}
        action={this.props.update.bind(null, row.id)}
        onSubmitOk={() => this.refs.songsTable.toggleDetails(rowNum)}
      />
    )
  }

  _renderTable(){
    let { songsList, artistsList, genresList } = this.props;
    return (
      <Table ref='songsTable'
        renderDetailRow={::this._renderDetailRow}
        data={ songsList }
        noDataMessage='No data found.'>
          <Thead name="title">Title</Thead>
          <Thead name="artist_id">Artist</Thead>
          <Thead name="genre_id">Genre</Thead>
          <Thead name="delete"/>
          <Thead name="add"/>

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
          <Column className="table-link table-icon" name="add"
            value={(_, item) =>
              <a onClick={e => this._addPlaylist(e, item)}>
                <i className="fa fa-plus"></i>
              </a>
            }
          />
      </Table>
    )
  }

  _toogleModal() {
    this.props.dispatch(reset('songNew'));
    this.refs.songModal.toggleModal();
  }

  render() {

    return (
      <div>
        {this.props.children ||
          <div className="page has-menu">
            <div className="page-menu">
              <div className="container">
                <a onClick={::this._toogleModal} className="button is-secondary">
                  <span className="icon">
                    <i className="fa fa-music"></i>
                  </span>
                  Add Song
                </a>
              </div>
              <Modal ref="songModal">
                <ModalHeader>
                  <p>song</p>
                </ModalHeader>
                <SongForm
                  form="songNew"
                  action={this.props.save}
                  onClose={() => this.refs.songModal.closeModal()}
                  onSubmitOk={() => this.refs.songModal.closeModal()}
                />
              </Modal>
            </div>

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

@reduxForm(
  { fields: ['title', 'artist_id', 'genre_id', 'url'] }
)
@connect(mapStateToProps, mapDispatchToProps)
export class SongForm extends Component {

  onSubmit(data) {
    let { action, onSubmitOk } = this.props;
    return action(data).then(onSubmitOk);
  }

  renderArtistOptions() {
    let { artistsList, fields: { artist_id } } = this.props;

    let handleChange = (option) => {
      artist_id.onChange(option);
    }

    return (
      <Select
        {...artist_id}
        valueKey='id'
        descriptionKey={item => item.name}
        isLoading={false}
        data={artistsList}
        onChange={handleChange}
      />
    )
  }

  renderGenreOptions() {
    let { genresList, fields: { genre_id } } = this.props;

    let handleChange = (option) => {
      genre_id.onChange(option);
    }

    return (
      <Select
        {...genre_id}
        valueKey='id'
        descriptionKey={item => item.description}
        isLoading={false}
        data={genresList}
        onChange={handleChange}
      />
    )
  }

  render() {
    let {
      handleSubmit,
      submitting,
      onClose,
      fields: {
        title,
        artist_id,
        genre_id,
        url
      }
    } = this.props;

    return (
      <LoadingIndicator loading={submitting}>
        <form onSubmit={handleSubmit(::this.onSubmit)}>
          <div className="columns">
            <div className="control column is-12">
              <FormInput field={title} groupClass="control">
                <label className="label">Title</label>
                <input type="text" className="input" {... title}></input>
              </FormInput>
            </div>
          </div>
          <div className="columns">
            <div className="control column is-6">
              <FormInput field={artist_id} label="Artist" groupClass="control column">
                { this.renderArtistOptions() }
              </FormInput>
            </div>
            <div className="control column is-6">
              <FormInput field={genre_id} label="Genre" groupClass="control column">
                { this.renderGenreOptions() }
              </FormInput>
            </div>
          </div>
          <div className="columns">
            <div className="control column is-12">
              <FormInput field={url} groupClass="control">
                <label className="label">URL</label>
                <input type="text" className="input" {... url}></input>
              </FormInput>
            </div>
          </div>
          <div className="control">
            <button type="submit" className="button is-pulled-right is-primary">Save</button>
            <a className="button is-pulled-right" onClick={onClose}>Cancel</a>
          </div>
        </form>
      </LoadingIndicator>
    )
  }

}
