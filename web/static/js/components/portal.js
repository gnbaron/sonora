import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createPortal(context, portal) {
  let mixin = {
    componentWillUnmount: function componentWillUnmount() {
      this._unrenderLayer();
      this._removeFromDOM();
    },

    componentDidUpdate: function componentDidUpdate() {
      this._renderPortal();
    },

    componentDidMount: function componentDidMount() {
      let rootContainer = document.body;
      if (portal) {
        rootContainer = document.getElementById(portal);
      }
      this._target = document.createElement('div');
      rootContainer.appendChild(this._target);
      this._removeFromDOM = () => rootContainer.removeChild(this._target);
      this._renderPortal();
    },

    _renderPortal: function _renderPortal() {
      let portalComponent = (
        <Provider store={this.context.store}>
          {this.renderPortal()}
        </Provider>
      )
      ReactDOM.render(portalComponent, this._target);
    },

    _unrenderLayer: function _unrenderLayer() {
      ReactDOM.unmountComponentAtNode(this._target);
    }
  }
  if (context.props.deactivatePortal) {
    context.render = () => context.renderPortal()
  } else {
    Object.keys(mixin).forEach(fn => {
      context[fn] = mixin[fn].bind(context);
      context.render = (() => null);
    });
  }
}
