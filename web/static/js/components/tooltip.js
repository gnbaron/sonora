import React, { Component, PropTypes } from 'react';
import Popper from './popper';

export default class Tooltip extends Component{
  constructor(props) {
    super(props);
  }

  toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.refs.popper.toggle();
  }

  show() {
    this.refs.popper.show();
  }

  hide() {
    this.refs.popper.close();
  }

  _getEvents() {
    if (!this.context.isMobileDevice) {
      return {
        onMouseEnter: ::this.show,
        onMouseLeave: ::this.hide
      }
    } else {
      return {
        onClick: ::this.toggle
      }
    }
  }

  _getPlacement() {
    if (this.props.placement) {
      return this.props.placement;
    }

    if (!this.context.isMobileDevice) {
      return 'right-start';
    } else {
      return 'bottom';
    }
  }

  render() {

    return (
      <Popper ref="popper" className={this.props.className || ''} placement={this._getPlacement()}>
        <a {...this._getEvents()}>
          {this.props.children[0]}
        </a>
        {this.props.children[1]}
      </Popper>
    )
  }

  static contextTypes = {
    isMobileDevice: PropTypes.bool
  }
}
