import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as application from '../redux/modules/application';
import Notification from '../components/notification';

class FlashNotificationContainer extends Component{

  constructor(props){
    super(props);
    this.timeout = {};
  }

  _removeMessage(id) {
    this.props.dispatch(application.cleanMessage(id));
    this.timeout[id] = undefined;
  }

  render() {
    let {messages} = this.props

    if(messages.length === 0){
      return null;
    }

    let notifications = messages.map((msg, idx) => {
      this.timeout[msg.id] = this.timeout[msg.id] || setTimeout(() => this._removeMessage(msg.id), 5000);
      let onClose = () => {
        clearTimeout(this.timeout[msg.id]);
        this._removeMessage(msg.id);
      }

      let paragraphs = [].concat(msg.msg).map( (text, id) => {
        return (
          <p key={id}>{text}</p>
        )
      });

      return (
        <Notification key={idx} type={msg.type} onClose={onClose}>
          {paragraphs}
        </Notification>
      )
    })

    return (
      <div className='notification-container'>
        {notifications}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  messages: state.application.messages
});

export default connect(mapStateToProps)(FlashNotificationContainer);
