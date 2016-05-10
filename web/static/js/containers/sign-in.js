import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import * as session from '../redux/modules/session';
import FormInput from '../components/form/input';
import * as application from '../redux/modules/application';
import FlashNotificationContainer from './flash-notification';

class SignIn extends Component {

  componentDidMount() {
    this.props.dispatch(application.setTitle('Sign in'));
  }

  onSubmit({email = '', password = ''}) {
    return this.props.dispatch(session.signIn(email, password));
  }

  render() {
    const {fields: {email, password, error}, handleSubmit} = this.props;
    return (
      <div className="login-container">
        <FlashNotificationContainer />
        <p className='login-title'>
          <span>Sonora</span><i className="fa fa-headphones music-symbol" />
        </p>

        <div className="login-form">
          <form onSubmit={handleSubmit(::this.onSubmit)}>
            <FormInput field={email} groupClass="control has-icon">
              <input className="input is-medium" type="text" placeholder="Email" {...email}/>
              <i className="fa fa-envelope"></i>
            </FormInput>
            <FormInput field={password} groupClass="control has-icon">
              <input className="input is-medium" type="password" placeholder="Password" {...password}/>
              <i className="fa fa-lock"></i>
            </FormInput>

            {
              error.error &&
              <p className="control">
                <span className='help is-text-centered is-medium is-danger'>{error.error}</span>
              </p>
            }

            <p className="control login-button">
              <button className="button is-primary is-medium" type="submit">Login</button>
            </p>
            <div className="control">
              <p className="is-text-centered">
              Não tem cadastro? <Link to='/signup'>Sign Up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    )
  }

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  };

}

export default (reduxForm({
  form: 'signin',
  fields: ['email', 'password', 'error']
})(SignIn));
