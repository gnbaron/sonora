import React, { Component } from 'react';
import { reduxForm, reset } from 'redux-form';
import FormInput from '../components/form/input';
import { bindAsyncActionCreator, parseJSONError} from '../utils';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import * as genres from '../redux/modules/genres';
import * as songs from '../redux/modules/artists';
import * as playlist from '../redux/modules/playlist';
import * as application from '../redux/modules/application';
import Table, { Thead, Column } from '../components/table';
import Modal, { ModalHeader } from '../components/modal';
import LoadingIndicator from '../components/loading-indicator';

const mapStateToProps = (state) => ({
  genresList: state.genres,
  songsList: state.songs
});

const mapDispatchToProps = (dispatch) => ({
  setTitle: bindAsyncActionCreator(application.setTitle, dispatch),
  remove: bindAsyncActionCreator(genres.remove, dispatch),
  save: bindAsyncActionCreator(genres.save, dispatch),
  update: bindAsyncActionCreator(genres.update, dispatch),
  showError: bindAsyncActionCreator(application.showErrorMessage, dispatch),
  addSong: bindAsyncActionCreator(playlist.addSong, dispatch)
});

@asyncConnect([{
  promise: ({store: {dispatch}}) => {
    return Promise.all([
      dispatch(genres.load()),
      dispatch(songs.load())
    ]);
  }
}])
@connect(mapStateToProps, mapDispatchToProps)
export default class GenresContainer extends Component {

  componentDidMount() {
    this.props.setTitle('Genres');
  }

  _delete(e, data) {
    e.stopPropagation();
    this.props.remove(data.id)
      .catch(error => this.props.showError(parseJSONError(error)));
  }

  _renderDetailRow(rowNum, row) {
    return (
      <GenreForm
        form={`genreForm/${row.id}`}
        initialValues={row}
        action={this.props.update.bind(null, row.id)}
        onSubmitOk={() => this.refs.genresTable.toggleDetails(rowNum)}
      />
    )
  }

  _addGenre(e, genre) {
    e.stopPropagation();
    let { songsList, addSong } = this.props;
    songsList.filter(song => song.genre_id === genre.id)
      .forEach(song => addSong(song))
  }

  _renderTable(){
    let { genresList } = this.props;
    return (
      <Table ref='genresTable'
        renderDetailRow={::this._renderDetailRow}
        data={ genresList }
        noDataMessage='No data found.'>
          <Thead name="id">Id</Thead>
          <Thead name="description">Description</Thead>
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
              <a onClick={e => ::this._addGenre(e, item)}>
                <i className="fa fa-plus"></i>
              </a>
            }
          />
      </Table>
    )
  }

  _toogleModal() {
    this.props.dispatch(reset('genreNew'));
    this.refs.genreModal.toggleModal();
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
                    <i className="fa fa-book"></i>
                  </span>
                  Add Genre
                </a>
              </div>
              <Modal ref="genreModal">
                <ModalHeader>
                  <p>Genre</p>
                </ModalHeader>
                <GenreForm
                  form="genreNew"
                  action={this.props.save}
                  onClose={() => this.refs.genreModal.closeModal()}
                  onSubmitOk={() => this.refs.genreModal.closeModal()}
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
  { fields: ['description'] }
)
export class GenreForm extends Component {

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
        description
      }
    } = this.props;

    return (
      <LoadingIndicator loading={submitting}>
        <form onSubmit={handleSubmit(::this.onSubmit)}>
          <div className="columns">
            <div className="control column is-12">
              <FormInput field={description} groupClass="control">
                <label className="label">Description</label>
                <input type="text" className="input" {... description}></input>
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
