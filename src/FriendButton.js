import React from 'react';
import axios from './axios';

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            text: 'This is a button'

        };

        this.handleClick = this.handleClick.bind(this);

    }

    handleClick(){
        console.log("The friends button has been clicked", this.props.friendshipStatus)
        if(!this.props.friendshipStatus){
        axios.post(`/send-request/${this.props.id}`).then(res => {
        }).catch((err) => console.log(err));
    } else if ( this.props.friendshipStatus == 1){
            this.setState( {text: "Cancel Friend Request"} )
    } else if ( this.props.friendshipStatus == 2){
            this.setState( {text: "Delete From Friends' List"} )
    }
    else if ( this.props.friendshipStatus == 3 || this.props.friendshipStatus == 4 || this.props.friendshipStatus == 5){
                this.setState( {text: "Send Friendship Request Again"} )
    }
    }

    render() {
        return (<button onClick={this.handleClick}>{this.state.text}</button>);
    }
}
