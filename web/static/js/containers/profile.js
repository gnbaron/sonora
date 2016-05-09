import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import FormInput from '../components/form/input';
import * as application from '../redux/modules/application';
import * as session from '../redux/modules/session';
import { push } from 'react-router-redux';
import { bindAsyncActionCreator } from '../utils';
import LoadingIndicator from '../components/loading-indicator';

const mapStateToProps = (state) => ({
  user: state.session.currentUser
});

const mapDispatchToProps = dispatch => ({
  update: bindAsyncActionCreator(session.updateProfile, dispatch),
  updateSession: bindAsyncActionCreator(session.currentUser, dispatch),
  redirect: bindAsyncActionCreator(push, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Profile extends Component {

  updateUser(data) {
    let { user, update, updateSession, redirect } = this.props;

    if(!data['password']){
      delete data['password'];
    }
    if(!data['password_confirmation']){
      delete data['password_confirmation'];
    }
    return update(user.id, data)
      .then(updateSession)
      .then(() => redirect('/'));
  }

  render() {
    let { user } = this.props;
    const initialValues = {
      initialValues: {
        name: user.name,
        email: user.email,
        password: '',
        passwordConfirmation: ''
      }
    }
    return (
      <ProfileForm {...initialValues} onSubmit={::this.updateUser} />
    )
  }
}

@reduxForm(
{
  form: 'profile',
  fields: ['name', 'email', 'password', 'password_confirmation'],
  initialValues: {role: 'stylist'}
})
class ProfileForm extends Component {

  componentDidMount() {
    this.props.dispatch(application.setTitle('Perfil do Usuário'));
  }

  render() {
    let { handleSubmit, submitting, fields: { name, email, password, password_confirmation} } = this.props;
    return (
      <div className="page">
        <div className="page-content">
          <div className="container">
            <div className="box">
              <LoadingIndicator loading={submitting}>
                <form onSubmit={handleSubmit}>

                  <div className="columns">
                    <div className="control column is-half-desktop">
                      <FormInput field={name} groupClass="control">
                        <label className="label">Nome</label>
                        <input type="text" className="input" {... name}></input>
                      </FormInput>
                    </div>

                    <div className="control column is-half-desktop">
                      <FormInput field={email} groupClass="control">
                        <label className="label">Email</label>
                        <input type="text" className="input" {... email}></input>
                      </FormInput>
                    </div>
                  </div>

                  <div className="columns">
                    <div className="control column is-half-desktop">
                      <FormInput field={password} groupClass="control">
                        <label className="label">Senha</label>
                        <input type="password" className="input" {... password}></input>
                      </FormInput>
                    </div>

                    <div className="control column is-half-desktop">
                      <FormInput field={password_confirmation} groupClass="control">
                        <label className="label">Confirmar Senha</label>
                        <input type="password" className="input" {... password_confirmation}></input>
                      </FormInput>
                    </div>

                  </div>

                  <div className="control">
                    <button type="submit" className="button is-pulled-right is-primary">Salvar</button>
                    <Link to="/" className="button is-pulled-right">Cancelar</Link>
                  </div>
                </form>
              </LoadingIndicator>
            </div>
          </div>
        </div>
      </div>
    );
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };
}
