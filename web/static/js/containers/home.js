import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as application from '../redux/modules/application';
import Search from '../components/search';

@connect(
  state => ({currentUser: state.session.currentUser}),
)
export default class Home extends Component {

  componentDidMount() {
    this.props.dispatch(application.setTitle('Explore'));
  }

  _renderSearchBox() {
    return (
      <div className="box">
        <div className="box-body">
          <Search />
        </div>
      </div>
    )
  }

  render() {
    // let { currentUser } = this.props;
    return (
      <div className="page">
        <div className="page-content">
          <div className="container is-big">
            <div className="columns">
              <div className="column is-12">
                {this._renderSearchBox()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
