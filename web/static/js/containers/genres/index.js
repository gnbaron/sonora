import React, { Component } from 'react';
import { Link } from 'react-router';
import { reduxForm, reset } from 'redux-form';
import FormInput from '../../components/form/input';
import { bindAsyncActionCreator} from '../../utils';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import * as genres from '../../redux/modules/genres';
import Table, { Thead, Column } from '../../components/table';
import Modal, { ModalHeader } from '../../components/modal';
import LoadingIndicator from '../../components/loading-indicator';

const mapStateToProps = (state) => ({
  genres: state.genres.data
});

const mapDispatchToProps = (dispatch) => ({
  delete: bindAsyncActionCreator(genres.delete, dispatch),
  save: bindAsyncActionCreator(genres.save, dispatch)
});

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    if (location.pathname === 'genres/new') {
      return null;
    }
    return Promise.all([
      dispatch(genres.load())
    ]);
  }
}])
@connect(mapStateToProps, mapDispatchToProps)
export default class GenresContainer extends Component {

  componentDidMount() {
    if (this.props.location.pathname === '/genres') {
      this.props.setTitle('Genres');
    }
  }

  // _delete(e, project) {
  //   e.stopPropagation();
  //   this.props.delete(project.id)
  //     .catch(error => this.props.showError(parseJSONError(error)));
  // }

  _renderTable(){
    let { genresList } = this.props;
    return (
      <Table ref='genresTable'
        className='genres-table'
        data={ genresList }
        noDataMessage='No data found.'>
          <Thead name="id">Id</Thead>
          <Thead name="description">Description</Thead>

          <Column className="is-link" name="edit"
            value={(_, item) => (
              <Link to={'genres/' + item.id} onClick={e => e.stopPropagation()}>
                <i className="fa fa-pencil"></i>
              </Link>
            )}
          />
          <Column className="is-link" name="delete"
            value={(_, item) =>
              <a onClick={e => this._delete(e, item)}>
                <i className="fa fa-trash"></i>
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
          <div id="project-index" className="page has-menu">
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
                  <p>Genres Register</p>
                </ModalHeader>
                <Form form="genreNew"
                  onSubmitOk={() => this.refs.genreModal.closeModal()}
                />
              </Modal>
            </div>

            <div className="page-content">
              <div className="container">
                <div className="box">
                  {this._renderTable()}
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
{ fields: ['description'] }, null, mapDispatchToProps)
class Form extends Component {

  onSubmit(data) {
    let { save, onSubmitOk } = this.props;
    return save(data).then(onSubmitOk);
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
        <form className="project-form" onSubmit={handleSubmit(::this.onSubmit)}>
          <div className="columns">
            <FormInput field={description} groupClass="control">
              <label className="label">Descrição</label>
              <input type="text" className="input" {... description}></input>
            </FormInput>
          </div>
          <div className="control">
            <button type="submit" className="button is-pulled-right is-primary">Salvar</button>
            <a className="button is-pulled-right" onClick={onClose}>Cancelar</a>
          </div>
        </form>
      </LoadingIndicator>
    )
  }

}
