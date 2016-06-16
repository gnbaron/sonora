import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import * as application from '../redux/modules/application';

const mapDispatchToProps = dispatch => ({
  closeLeftNav: bindActionCreators(application.closeLeftNav, dispatch)
});
@connect(state => ({
  isMobileScreen: state.application.enviroment.isMobileScreen
}), mapDispatchToProps)
class MenuLink extends Component {

  _handleClick() {
    if (this.props.isMobileScreen()) {
      this.props.closeLeftNav();
    } else {
      this.props.onMenuChange();
    }
  }

  render() {
    return (
      <li>
        <Link to={this.props.to} activeClassName='active' onClick={::this._handleClick}>
          <i className={this.props.iconClass}></i>
          {this.props.children}
        </Link>
      </li>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.session.currentUser,
  leftNavOpen: state.application.leftNavOpen
});
@connect(mapStateToProps)
class LeftNav extends Component {

  render() {
    let isVisible = this.props.leftNavOpen ? ' is-visible' : '';
    return (
      <section id="left-nav" className={isVisible}>
        <div className="app-title">
          <Link to='/'>
            <small>Sonora</small><i className="fa fa-headphones music-symbol" />
          </Link>
        </div>
        <div className="app-version">
          <small>v 0.0.1</small>
        </div>
        <ul className="lef-nav-menu">
          <li className="menu-header">Play</li>
          <MenuLink to="/explore" iconClass="fa fa-home" onMenuChange={::this.forceUpdate}>
            <span>Explore</span>
          </MenuLink>
          <MenuLink to="/playlist" iconClass="fa fa-play" onMenuChange={::this.forceUpdate}>
            <span>Playlist</span>
          </MenuLink>
          <li className="menu-header">Library</li>
          <MenuLink to="/songs" iconClass="fa fa-music" onMenuChange={::this.forceUpdate}>
            <span>Songs</span>
          </MenuLink>
          <MenuLink to="/artists" iconClass="fa fa-microphone" onMenuChange={::this.forceUpdate}>
            <span>Artists</span>
          </MenuLink>
          <MenuLink to="/genres" iconClass="fa fa-book" onMenuChange={::this.forceUpdate}>
            <span>Genres</span>
          </MenuLink>
          <MenuLink to="/profile" iconClass="fa fa-user" onMenuChange={::this.forceUpdate}>
            <span>Profile</span>
          </MenuLink>
        </ul>
      </section>
    );
  }
}

export default LeftNav;
