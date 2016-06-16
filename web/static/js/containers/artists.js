import React, { Component } from 'react';
import { reduxForm, reset } from 'redux-form';
import FormInput from '../components/form/input';
import { bindAsyncActionCreator, parseJSONError} from '../utils';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import * as artists from '../redux/modules/artists';
import * as songs from '../redux/modules/artists';
import * as playlist from '../redux/modules/playlist';
import * as application from '../redux/modules/application';
import Table, { Thead, Column } from '../components/table';
import Modal, { ModalHeader } from '../components/modal';
import LoadingIndicator from '../components/loading-indicator';

const mapStateToProps = (state) => ({
  artistsList: state.artists,
  songsList: state.songs
});

const mapDispatchToProps = (dispatch) => ({
  setTitle: bindAsyncActionCreator(application.setTitle, dispatch),
  remove: bindAsyncActionCreator(artists.remove, dispatch),
  save: bindAsyncActionCreator(artists.save, dispatch),
  update: bindAsyncActionCreator(artists.update, dispatch),
  showError: bindAsyncActionCreator(application.showErrorMessage, dispatch),
  addSong: bindAsyncActionCreator(playlist.addSong, dispatch)
});

@asyncConnect([{
  promise: ({store: {dispatch}}) => {
    return Promise.all([
      dispatch(songs.load()),
      dispatch(artists.load())
    ]);
  }
}])
@connect(mapStateToProps, mapDispatchToProps)
export default class ArtistContainer extends Component {

  componentDidMount() {
    this.props.setTitle('Artists');
  }

  _delete(e, data) {
    e.stopPropagation();
    this.props.remove(data.id)
      .catch(error => this.props.showError(parseJSONError(error)));
  }

  _renderDetailRow(rowNum, row) {
    return (
      <ArtistForm
        form={`artistForm/${row.id}`}
        initialValues={row}
        action={this.props.update.bind(null, row.id)}
        onSubmitOk={() => this.refs.artistsTable.toggleDetails(rowNum)}
      />
    )
  }

  _addArtist(e, data) {
    e.stopPropagation();
    let { songsList, addSong } = this.props;
    songsList.filter(song => song.artist_id === data.id)
      .forEach(song => addSong(song))
  }

  _renderTable(){
    let { artistsList } = this.props;
    return (
      <Table ref='artistsTable'
        renderDetailRow={::this._renderDetailRow}
        data={ artistsList }
        noDataMessage='No data found.'>
          <Thead name="id">Id</Thead>
          <Thead name="name">Name</Thead>
          <Thead name="delete"/>
          <Thead name="add"/>

          <Column className="table-link table-icon" name="delete"
            value={(_, item) =>
              <a onClick={e => this._delete(e, item)}>
                <i className="fa fa-trash"></i>
              </a>
            }
          />
          <Column className="table-link table-icon" name="add"
            value={(_, item) =>
              <a onClick={e => ::this._addArtist(e, item)}>
                <i className="fa fa-plus"></i>
              </a>
            }
          />
      </Table>
    )
  }

  _toogleModal() {
    this.props.dispatch(reset('artistNew'));
    this.refs.artistModal.toggleModal();
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
                    <i className="fa fa-microphone"></i>
                  </span>
                  Add Artist
                </a>
              </div>
              <Modal ref="artistModal">
                <ModalHeader>
                  <p>Artist</p>
                </ModalHeader>
                <ArtistForm
                  form="artistNew"
                  action={this.props.save}
                  onSubmitOk={() => this.refs.artistModal.closeModal()}
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

@reduxForm(
  { fields: ['name'] }
)
export class ArtistForm extends Component {

  onSubmit(data) {
    let { action, onSubmitOk } = this.props;
    return action(data).then(onSubmitOk);
  }

  render() {
    let {
      handleSubmit,
      submitting,
      onClose,
      fields: {
        name
      }
    } = this.props;

    return (
      <LoadingIndicator loading={submitting}>
        <form onSubmit={handleSubmit(::this.onSubmit)}>
          <div className="columns">
            <div className="control column is-12">
              <FormInput field={name} groupClass="control">
                <label className="label">Name</label>
                <input type="text" className="input" {... name}></input>
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
