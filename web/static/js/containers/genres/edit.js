import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import LoadingIndicator from '../../components/loading-indicator';
import FormInput from '../../components/form/input';
import { bindAsyncActionCreator } from '../../utils';

import * as genres from '../../redux/modules/genres';

const mapDispatchToProps = (dispatch) => ({
  save: bindAsyncActionCreator(genres.save, dispatch)
});

@reduxForm(
{
  fields: [
    'description'
  ]
}, null, mapDispatchToProps)
export default class Form extends Component {

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
        <form className="project-form" onSubmit={handleSubmit}>
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
