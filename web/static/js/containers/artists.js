import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import * as application from '../redux/modules/application';
import * as artists from '../redux/modules/artists';
import Search from '../components/search';
import Table, { Thead, Column } from '../components/table';
import { bindAsyncActionCreator } from '../utils';

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
  artistsList: state.artists.data
});

const mapDispatchToProps = dispatch => ({
  play: bindAsyncActionCreator(application.play, dispatch)
});

@asyncConnect([
  { promise: ({store: {dispatch}}) =>
    Promise.all([
      dispatch(artists.load())
    ])
  }
])
@connect(mapStateToProps, mapDispatchToProps)
export default class Songs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      artistsList: props.artistsList
    };
  }

  componentDidMount() {
    this.props.dispatch(application.setTitle('Artists'));
  }

  onSearch(event){
    let value = event.target.value;
    let { artistsList } = this.props;
    let filtered = artistsList.filter(artist => {
      return artist && artist.name.toUpperCase().includes(value.toUpperCase());
    });
    this.setState({ artistsList: filtered });
  }

  _renderSearchBox() {
    return (
      <div className="box">
        <div className="box-body">
          <Search placeholder="Search artists ..." onChange={::this.onSearch}/>
        </div>
      </div>
    )
  }

  _renderArtistsBox() {
    let { artistsList = [] } = this.state;
    let { play } = this.props;
    let playSong = () => this.props.dispatch(play);
    return (
      <div className="box">
        <div className="box-body">
          <div className="box-header">
            <span className="box-title">Artists</span>
          </div>
          <Table data={artistsList}>
              <Thead name="name">Name</Thead>
              <Thead name="play"></Thead>
              <Column className="table-link table-icon" name="play"
                value={() => (
                  <a onClick={() => playSong()}>
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
              <div className="column is-10 is-offset-1">
                {this._renderArtistsBox()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
