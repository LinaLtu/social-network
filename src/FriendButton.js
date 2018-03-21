import React from 'react';
import axios from './axios';

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            text: 'Send a Friend Request'

        };

        this.handleClick = this.handleClick.bind(this);

    }

    componentDidMount() {
        if(!this.props.friendshipStatus || this.props.friendshipStatus == 0){
            this.setState( {text: "Send Friend Request"} )
        } else if ( this.props.friendshipStatus == 1){
            if (this.props.otherId == this.props.recipientId){
                this.setState( {text: "Cancel Friend Request"} )
            } else {
                this.setState( {text: "Accept Friend Request"} )
            }
        } else if ( this.props.friendshipStatus == 2){
                this.setState( {text: "Delete From Friends' List"} )
        }
        else if ( this.props.friendshipStatus == 3 || this.props.friendshipStatus == 4 || this.props.friendshipStatus == 5){
                    this.setState( {text: "Send Friendship Request Again"} )
        }
    }

    handleClick(){
            if(!this.props.friendshipStatus || this.props.friendshipStatus == 0){
                axios.post(`/send-request/${this.props.id}`).then(res => {
                }).catch((err) => console.log(err));
            } else if ( this.props.friendshipStatus == 1){

                console.log("We are in handleClick and friendship status is 1 and I can accept the friend request");
                //I have to accept request here
                if(this.props.otherId == this.props.recipientId) {
                    axios.post(`/cancel-request/${this.props.id}`).then(res => {
                        console.log("cancel from axios", res);
                    }).catch((err) => console.log(err));

                } else {
                    axios.post(`/accept-request/${this.props.id}`).then(res => {
                        console.log("RES from axios", res);
                    }).catch((err) => console.log(err));
                }

                this.setState( {text: "Cancel Friend Request"} )
            } else if ( this.props.friendshipStatus == 2){

                axios.post(`/delete-friend/${this.props.id}`).then(res => {
                }).catch((err) => console.log(err));

                this.setState( {text: "Delete From Friends' List"} )

            }
            else if ( this.props.friendshipStatus == 3 || this.props.friendshipStatus == 4 || this.props.friendshipStatus == 5){
                axios.post(`/send-request/${this.props.id}`).then(res => {
                    console.log("RES from axios", res);
                }).catch((err) => console.log(err));

                this.setState( {text: "Cancel Friend Request"} )
            }
    }

    render() {

        return (<button className="send-btn" onClick={this.handleClick}>{this.state.text}</button>);
    }
}
