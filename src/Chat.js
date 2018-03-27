import React from 'react';
import axios from './axios';
import { connect } from 'react-redux';
import { emitChatMessage } from './socket';

function mapStateToProps(state) {
    console.log('Inside mapstatetoprops', state);
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

    componentDidMount() {
        //dispatch an action
        //to get all of the previous chat messages
        //this.proprs.dispatch(ChatMessages());
    }

    onKeyDown(e) {
        console.log('This is our key', e.keyCode);

        if (e.keyCode == 13) {
            e.preventDefault();
            let msg = e.target.value;
            console.log('Enter clicked', msg);
            emitChatMessage({
                msg,
                firstName: this.props.firstname,
                lastName: this.props.lastname,
                url: this.props.url,
                id: this.props.id
            });
            e.target.value = '';
        }
    }

    componentDidUpdate() {
        this.chatContainer.scrollTop =
            this.chatContainer.scrollHeight - this.chatContainer.clientHeight;
    }

    render() {
        // if(!this.props.visitors){
        //     return null;
        // } else {
        //     console.log(this.props.visitors);
        // }

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
                        console.log('From the return ', message);
                        return <p>{message.msg}</p>;
                    })}
                </div>

                <textarea
                    className="chat-text-area"
                    onKeyDown={this.onKeyDown}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(Chat);
