import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as application from '../redux/modules/application';
import Search from '../components/search';
import Table, { Thead, Column } from '../components/table';

@connect(
  state => ({currentUser: state.session.currentUser}),
)
export default class Songs extends Component {

  componentDidMount() {
    this.props.dispatch(application.setTitle('Songs'));
  }

  _renderSearchBox() {
    return (
      <div className="box">
        <div className="box-body">
          <Search placeholder="Search songs ..."/>
        </div>
      </div>
    )
  }

  _renderSongsBox() {
    let lists = [
      {name: 'Master of Puppets'},
      {name: 'Rainbow in the Dark'},
      {name: 'Aces High'},
      {name: 'Bark at the Moon'},
      {name: 'Fortunate Son'},
      {name: 'Symphony of Destruction'},
      {name: 'Rock you like a Hurricane'},
      {name: 'United'}
    ]
    return (
      <div className="box">
        <div className="box-body">
          <Table data={lists}>
              <Thead name="name">Name</Thead>
              <Thead name="artist">Artist</Thead>
              <Thead name="album">Album</Thead>
              <Thead name="play"></Thead>
              <Thead name="plus"></Thead>
              <Column className="table-link table-icon" name="play"
                value={() => (
                  <a onClick={() => {}}>
                    <i className="fa fa-play"></i>
                  </a>
                )}
              />
              <Column className="table-link table-icon" name="plus"
                value={() => (
                  <a onClick={() => {}}>
                    <i className="fa fa-plus"></i>
                  </a>
                )}
              />
          </Table>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="page">
        <div className="page-content">
          <div className="app-container is-big">
            <div className="columns">
              <div className="column is-12">
                {this._renderSearchBox()}
              </div>
            </div>
            <div className="columns">
              <div className="column is-8 is-offset-2">
                {this._renderSongsBox()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
