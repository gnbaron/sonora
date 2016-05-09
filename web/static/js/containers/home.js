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

  _renderGenresBox() {
    return (
      <div className="box">
        <div className="box-header">
          <span className="box-title">Genres</span>
        </div>
        <div className="box-body">
          teste
        </div>
      </div>
    )
  }

  _renderListsBox() {
    return (
      <div className="box">
        <div className="box-header">
          <span className="box-title">Top Lists</span>
        </div>
        <div className="box-body">
          teste
        </div>
      </div>
    )
  }

  _renderTopMusics() {
    return (
      <div className="box">
        <div className="box-header">
          <span className="box-title">Top Musics</span>
        </div>
        <div className="box-body">
          teste
        </div>
      </div>
    )
  }

  _renderNewsBox() {
    return (
      <div className="box">
        <div className="box-header">
          <span className="box-title">News</span>
        </div>
        <div className="box-body">
          teste
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="page">
        <div className="page-content">
          <div className="container is-big">
            <div className="columns">
              <div className="column is-12">
                {this._renderSearchBox()}
              </div>
            </div>
            <div className="columns">
              <div className="column is-half-desktop">
                {this._renderGenresBox()}
              </div>
              <div className="column is-half-desktop">
                {this._renderListsBox()}
              </div>
            </div>
            <div className="columns">
              <div className="column is-half-desktop">
                {this._renderTopMusics()}
              </div>
              <div className="column is-half-desktop">
                {this._renderNewsBox()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
