import React, { Component, PropTypes } from 'react';

export default class LoadingIndicator extends Component {
  constructor(props) {
    super(props);
    this.timeout = null;
    this.state = {shouldRenderOverlay: false}
  }

  _refresh(nextProps) {
    if (nextProps.loading && !this.timeout) {
      let startAfter = nextProps.startAfter || this.props.startAfter;
      if (startAfter) {
        this.timeout = setTimeout(() => {
          if (this.props.loading) {
            this.setState({shouldRenderOverlay: true});
          }
        }, startAfter);
      } else {
        this.setState({shouldRenderOverlay: true});
      }
    } else if (!nextProps.loading) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.setState({shouldRenderOverlay: false});
    }
  }

  componentDidMount() {
    this._refresh(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this._refresh(nextProps);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  render() {
    let visible = this.state.shouldRenderOverlay ? ' visible' : '';
    let { placement } = this.props;
    return (
      <div className={'loading-indicator' + visible}>
        <div className={'overlay' + visible + ' ' + placement}>
          <i className="fa fa-refresh fa-spin"></i>
        </div>
        {this.props.children}
      </div>
    )
  }

  static propTypes = {
    placement: PropTypes.string
  }

  static defaultProps = {
    placement: 'center'
  }
}
