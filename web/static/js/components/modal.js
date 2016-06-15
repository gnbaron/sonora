import React, { PropTypes, Component } from 'react';
import createPortal from './portal';

export const ModalHeader = (props) => (
  <div className="modal-header">
    {props.children}
  </div>
)

export default class Modal extends Component {

  constructor(props) {
    super(props);
    createPortal(this, 'app-container');
    this.state = {isOpen: props.startOpen ? true : false};
  }

  closeModal() {
    this.setState({isOpen: false});
    if(this.props.onClose){
      this.props.onClose();
    }
  }

  toggleModal() {
    this.setState({isOpen: !this.state.isOpen});
  }

  renderPortal() {
    let isOpen = this.state.isOpen;

    return (
      <div className={'modal' + (isOpen ? ' is-active' : '')}>
        <div className="modal-background" onClick={::this.closeModal}></div>
        <div className="modal-content" onClick={::this.closeModal}>
          <div className="box" onClick={e => e.stopPropagation()}>
            {this.props.children}
            <button className="modal-close" onClick={::this.closeModal}></button>
          </div>
        </div>
      </div>
    )
  }

  static propTypes = {
    onClose: PropTypes.func,
    startOpen: PropTypes.bool
  }

  static contextTypes = {
    store: React.PropTypes.object
  };
}
