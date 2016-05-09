import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as session from '../redux/modules/session';
import Header from '../components/header';

class HeaderContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {isUserPopoverOpen: false};
  }

  toggleUserPopOver() {
    this.setState({ isUserPopoverOpen: !this.state.isUserPopoverOpen })
  }

  _signOut() {
    this.props.dispatch(session.signOut());
  }

  render() {
    let { title, currentUser, onMenuClicked, id } = this.props;
    return (
      <Header
        id={id}
        currentUser={currentUser}
        onUserSignOut={::this._signOut}
        title={title}
        onMenuClicked={onMenuClicked}
      />
    )
  }

  static propTypes = {
    onMenuClicked: PropTypes.func.isRequired
  };
}

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
  title: state.application.title
});

export default connect(mapStateToProps)(HeaderContainer);
