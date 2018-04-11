import React from 'react';
import axios from './axios';
import { connect } from 'react-redux';
import { emitChatMessage } from './socket';
import { Link } from 'react-router-dom';

function mapStateToProps(state) {
    return {
        chatMessages: state.chatMessages || []
    };
}

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: this.props.firstname,
            lastName: this.props.lastname,
            url: this.props.url,
            id: this.props.id
        };

        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            let msg = e.target.value;

            emitChatMessage({
                msg,
                firstName: this.props.firstname,
                lastName: this.props.lastname,
                url: this.props.url,
                id: this.props.id,
                time: new Date()
            });
            e.target.value = '';
        }
    }

    componentDidUpdate() {
        this.chatContainer.scrollTop =
            this.chatContainer.scrollHeight - this.chatContainer.clientHeight;
    }

    render() {
        return (
            <div className="chat-area">
                <h1 className="h1-chart">Let's Chat!</h1>
                <div
                    id="chat-messages-container"
                    ref={elem => {
                        this.chatContainer = elem;
                    }}
                >
                    {this.props.chatMessages.map(message => {
                        return (
                            <div className="chat-item">
                                <Link to={`/user/${message.id}`}>
                                    <div className="chat-img">
                                        <img
                                            src={message.url}
                                            alt={`${message.firstName} ${
                                                message.lastName
                                            }`}
                                        />
                                    </div>
                                </Link>
                                <div className="msg-sender-info">
                                    <p>
                                        {message.firstName} {message.lastName}{' '}
                                        said at {message.time}:
                                        <p>{message.msg} </p>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <textarea
                    className="chat-text-area"
                    onKeyDown={this.onKeyDown}
                    placeholder="Leave a message..."
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(Chat);
