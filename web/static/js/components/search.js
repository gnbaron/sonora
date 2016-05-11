import React, { Component } from 'react';

export default class Search extends Component {
  render() {
    let { placeholder = 'Search songs, artists, users, playlists...' } = this.props
    return (
      <div className="search-bar columns">
        <div className="column is-11">
          <input
            className="search-field"
            placeholder={placeholder}
            type="text"
            maxLength="100"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            ref="input" />
        </div>
        <div className="column is-1">
          <span className="search-input is-fullwidth fa fa-search center"/>
        </div>
      </div>
    )
  }
}
