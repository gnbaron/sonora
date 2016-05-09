import React, { Component } from 'react';

const TYPES = {
  danger: ' is-danger ',
  info: ' is-info ',
  success: ' is-success ',
  warning: ' is-warning '
}

export default class Notification extends Component{
  render() {
    let {type, onClose} = this.props;
    return(
      <div className={'notification' + TYPES[type] + 'is-text-centered'} >
        <button className="delete" onClick={onClose}></button>
        {this.props.children}
      </div>
    )
  }
}
