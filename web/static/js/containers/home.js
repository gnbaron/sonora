import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as application from '../redux/modules/application';
import Search from '../components/search';
import Table, { Thead, Column } from '../components/table';

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

          <div className="columns">
            <div className="column is-half-desktop">
              <div className="card music-card is-half-desktop">
                <div className="card-content">
                  Rock <span className="fa fa-music genre-symbol" />
                </div>
              </div>
            </div>
            <div className="column is-half-desktop">
              <div className="card music-card is-half-desktop">
                <div className="card-content">
                  Jazz <span className="fa fa-music genre-symbol" />
                </div>
              </div>
            </div>
          </div>

          <div className="columns">
            <div className="column is-half-desktop">
              <div className="card music-card is-half-desktop">
                <div className="card-content">
                  Classical <span className="fa fa-music genre-symbol" />
                </div>
              </div>
            </div>
            <div className="column is-half-desktop">
              <div className="card music-card is-half-desktop">
                <div className="card-content">
                  Country <span className="fa fa-music genre-symbol" />
                </div>
              </div>
            </div>
          </div>

          <div className="columns">
            <div className="column is-half-desktop">
              <div className="card music-card is-half-desktop">
                <div className="card-content">
                  Reggae <span className="fa fa-music genre-symbol" />
                </div>
              </div>
            </div>
            <div className="column is-half-desktop">
              <div className="card music-card is-half-desktop">
                <div className="card-content">
                  House <span className="fa fa-music genre-symbol" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }

  _renderListsBox() {
    let lists = [
      {description: 'Old School Heavy Metal'},
      {description: 'Classical Essentials'},
      {description: 'Best of 2015'},
      {description: 'Melhores Nacionais'},
      {description: 'Rock Classics 70\'s 80\'s '},
      {description: 'emusic 2016'},
      {description: 'Reggae Music'},
      {description: 'Lounge Music'}
    ]
    return (
      <div className="box">
        <div className="box-body">
          <div className="box-header">
            <span className="box-title">Top Lists</span>
          </div>
          <Table data={lists} displayHeader={false}>
              <Thead name="description"></Thead>
              <Thead name="play"></Thead>
              <Column className="table-link table-icon" name="play"
                value={() => (
                  <a onClick={() => {}}>
                    <i className="fa fa-play"></i>
                  </a>
                )}
              />
          </Table>
        </div>
      </div>
    )
  }

  _renderTopMusics() {
    let lists = [
      {description: 'Master of Puppets'},
      {description: 'Rainbow in the Dark'},
      {description: 'Aces High'},
      {description: 'Bark at the Moon'},
      {description: 'Fortunate Son'},
      {description: 'Symphony of Destruction'},
      {description: 'Rock you like a Hurricane'},
      {description: 'United'}
    ]
    return (
      <div className="box">
        <div className="box-body">
          <div className="box-header">
            <span className="box-title">Top Musics</span>
          </div>
          <Table data={lists} displayHeader={false}>
              <Thead name="description"></Thead>
              <Thead name="play"></Thead>
              <Column className="table-link table-icon" name="play"
                value={() => (
                  <a onClick={() => {}}>
                    <i className="fa fa-play"></i>
                  </a>
                )}
              />
          </Table>
        </div>
      </div>
    )
  }

  _renderArtistsBox() {
    let lists = [
      {description: 'Metallica'},
      {description: 'Pearl Jam'},
      {description: 'Legião Urbana'},
      {description: 'ACDC'},
      {description: 'Dire Straits'},
      {description: 'Iron Maiden'},
      {description: 'Dio'},
      {description: 'Led Zeppelin'}
    ]
    return (
      <div className="box">
        <div className="box-body">
          <div className="box-header">
            <span className="box-title">Top Artists</span>
          </div>
          <Table data={lists} displayHeader={false}>
              <Thead name="description"></Thead>
              <Thead name="play"></Thead>
              <Column className="table-link table-icon" name="play"
                value={() => (
                  <a onClick={() => {}}>
                    <i className="fa fa-play"></i>
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
                {this._renderArtistsBox()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
