import React, { Component, PropTypes } from 'react';
import popperJS from 'popper.js';
import classNames from 'classnames';

export default class Popper extends Component {
  constructor(props) {
    super(props);
    this.state = {isVisible: false};
    this.update = this.update.bind(this);
  }

  update() {
    this.popper && this.popper.update();
    this.raf = this.raf || window.requestAnimationFrame(this.update);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.placement !== this.props.placement) {
      this.popper._options.placement = this.props.placement;
      this.update();
    }
  }

  componentDidMount() {
    this.popper = new popperJS(this.refs.content, this.refs.popper, {
      placement: this.props.placement || 'bottom',
      modifiersIgnored: ['applyStyle'],
      arrowElement: this.refs.arrow
    })
    this.popper.onUpdate(data => {
      this.setState({data});
    })
    this.update();
  }

  componentWillUnmount() {
    this.popper && this.popper.destroy();
    this.raf && window.cancelAnimationFrame(this.raf);
  }

  getPopperStyle(data) {
    if (!data) { return {}; }
    const left = Math.round(data.offsets.popper.left);
    const top = Math.round(data.offsets.popper.top);
    const transform = `translate3d(${left}px, ${top}px, 0)`;
    return {
      position: data.offsets.popper.position,
      transform,
      WebkitTransform: transform,
      top: 0,
      left: 0
    };
  }

  close() {
    if (this.state.isVisible) {
      this.setState({isVisible: false});
    }
  }

  show() {
    if (!this.state.isVisible) {
      this.setState({isVisible: true});
    }
  }

  toggle() {
    this.setState({isVisible: !this.state.isVisible});
  }

  render() {
    const { children, arrow } = this.props;
    //Give the chance to control whenever the component is visible using props
    const visible = this.props.isVisible === undefined ? this.state.isVisible : this.props.isVisible;
    return (
      <div ref='container' className={'popper-wrapper ' + (this.props.className || '')}>
        <div ref='content' className='popper-content'>
          {children[0]}
        </div>
        <div
          ref='popper'
          data-placement={this.state.data && this.state.data.placement}
          className={classNames('popper', {visible}, {'has-arrow': this.props.arrow})}
          style={this.getPopperStyle(this.state.data)}>
            {children[1]}
            {arrow ? <div ref='arrow' className='arrow' /> : null}
        </div>
      </div>
    );
  }

  static propTypes: {
    placement: PropTypes.string
  }
}
