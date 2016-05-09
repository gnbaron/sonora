import React, {Component, PropTypes} from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import * as registration from '../redux/modules/registration';
import FormInput from '../components/form/input';
import * as application from '../redux/modules/application';
import FlashNotificationContainer from './flash-notification';

class SignUp extends Component {
  componentDidMount() {
    this.props.dispatch(application.setTitle('Sign Up'));
  }

  onSubmit(data){
    return this.props.dispatch(registration.signUp(data));
  }

  render() {
    const { fields: { name, email, password, password_confirmation }, handleSubmit } = this.props;
    return (
      <div className="login-container">
        <FlashNotificationContainer />
        <p className='login-title'>
          <span>Sonora</span><i className="fa fa-headphones music-symbol" />
        </p>

        <div className="login-form">
          <form onSubmit={handleSubmit(::this.onSubmit)}>
            <FormInput field={name} groupClass="control has-icon">
              <input type="text" className="input is-medium" placeholder="Usuário" {...name}/>
              <i className="fa fa-user"></i>
            </FormInput>
            <FormInput field={email} groupClass="control has-icon">
              <input type="text" className="input is-medium" placeholder="Email" {...email}/>
              <i className="fa fa-envelope"></i>
            </FormInput>
            <FormInput field={password} groupClass="control has-icon">
              <input className="input is-medium" type="password" placeholder="Senha" {...password}/>
              <i className="fa fa-lock"></i>
            </FormInput>
            <FormInput field={password_confirmation} groupClass="control has-icon">
              <input className="input is-medium" type="password" placeholder="Confirmar senha" {...password_confirmation}/>
              <i className="fa fa-check"></i>
            </FormInput>
            <p className="control login-button">
              <button className="button is-primary is-medium" type="submit">Sign up</button>
            </p>
            <div className="control">
              <p className="is-text-centered">
                Já tem cadastro? <Link to='/signin'>Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  };
}

export default (reduxForm({
  form: 'signup',
  fields: ['name', 'email', 'password', 'password_confirmation']
})(SignUp));
