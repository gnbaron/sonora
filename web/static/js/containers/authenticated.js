import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import * as session from '../redux/modules/session';
import * as application from '../redux/modules/application'
import LeftNav from '../containers/left-nav';
import HeaderContainer from '../containers/header';
import { TokenManager } from '../utils';
import FlashNotificationContainer from './flash-notification';
import LoadingIndicator from '../components/loading-indicator';

class AuthenticatedContainer extends Component {
  componentDidMount() {
    this._checkUser();
  }

  componentDidUpdate() {
    this._checkUser();
  }

  _checkUser() {
    const { dispatch, currentUser } = this.props;
    if (TokenManager.get()){
      if(!currentUser){
        dispatch(session.currentUser());
      }
    } else {
      dispatch(push('/signin'));
    }
  }

  toggleMenu() {
    this.props.dispatch(application.toggleLeftNav());
  }

  render() {
    const { currentUser, leftNavOpen } = this.props;

    if (!currentUser){
      return false;
    }

    return (
      <div id="app-container" className={!leftNavOpen ? 'is-full-page' : ''}>
        <LoadingIndicator loading={this.props.isLoading} startAfter={300}>
          <FlashNotificationContainer />
          <HeaderContainer id="header" onMenuClicked={::this.toggleMenu}/>
          <div id="left-nav-overlay"
            className={leftNavOpen ? 'is-visible' : ''}
            onClick={::this.toggleMenu}>
          </div>
          <LeftNav/>
          <section id="page-container">
            {this.props.children}
          </section>
          <footer id="footer" >
            <b>Copyright © 2016 <a href="/" target="_blank">Sonora</a></b>.
            <span className="is-hidden-mobile"> All rights reserved.</span>
          </footer>
        </LoadingIndicator>
      </div>
    );
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    currentUser: PropTypes.object
  };

  getChildContext() {
    return {
      isMobileDevice: this.props.isMobileDevice
    };
  }

  static childContextTypes = {
    isMobileDevice: PropTypes.bool
  };
}

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
  leftNavOpen: state.application.leftNavOpen,
  isLoading: state.application.isLoading,
  isMobileDevice: state.application.enviroment.isMobileDevice
});

export default connect(mapStateToProps)(AuthenticatedContainer);
