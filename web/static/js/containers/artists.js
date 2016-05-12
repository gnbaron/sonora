import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import * as application from '../redux/modules/application';
import * as artists from '../redux/modules/artists';
import Search from '../components/search';
import Table, { Thead, Column } from '../components/table';

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
  artistsList: state.artists.data
});

@asyncConnect([
  { promise: ({store: {dispatch}}) =>
    Promise.all([
      dispatch(artists.load())
    ])
  }
])
@connect(mapStateToProps)
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
      return artist && artist.name.includes(value);
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
    return (
      <div className="box">
        <div className="box-body">
          <div className="box-header">
            <span className="box-title">Artists</span>
          </div>
          <Table data={artistsList}>
              <Thead name="name">Name</Thead>
              <Thead name="plus"></Thead>
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
