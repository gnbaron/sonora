import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as application from '../redux/modules/application';

@connect(
  state => ({currentUser: state.session.currentUser}),
)
export default class Home extends Component {

  componentDidMount() {
    this.props.dispatch(application.setTitle('Explore'));
  }

  render() {
    let { currentUser } = this.props;
    return (
      <div>Hello {currentUser.name}</div>
    )
  }
}
