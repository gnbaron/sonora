import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Dropdown, { DropdownHeader, DropdownBody, DropdownToggle } from './dropdown';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {isUserPopoverOpen: false};
  }

  toggleUserPopOver() {
    this.setState({ isUserPopoverOpen: !this.state.isUserPopoverOpen })
  }

  render() {
    let { title, onUserSignOut, id, currentUser } = this.props;

    return (
      <header id={id} className="header">
        <div className="header-left">
          <div className="header-item burger-button">
            <a href="javascript: void(0)" className="burger button-link" onClick={this.props.onMenuClicked}>
              <i className="fa fa-bars"></i>
            </a>
          </div>
          <div className="header-item page-title">
            <div className="title is-5">{title}</div>
          </div>
        </div>

        <div className="header-right user">
          <div className="header-item">
            <Dropdown ref="dropdownUser" arrow>
              <DropdownToggle className="user-link">
                <i className="fa fa-user"></i>
              </DropdownToggle>
              <DropdownHeader>{currentUser.name}</DropdownHeader>
              <DropdownBody>
                <ul>
                  <li>
                    <Link to="/profile" onClick={() => this.refs.dropdownUser.close()}><i className="fa fa-cog"></i> Edit Profile</Link>
                  </li>
                  <li>
                    <Link to="/signin" onClick={onUserSignOut}><i className="fa fa-sign-out"></i> Logout</Link>
                  </li>
                </ul>
              </DropdownBody>
            </Dropdown>
          </div>
        </div>
      </header>
    )
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    onMenuClicked: PropTypes.func.isRequired,
    onUserSignOut: PropTypes.func,
    currentUser: PropTypes.object
  };

}

export default Header;
