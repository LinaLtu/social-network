import React from 'react';
import ProfilePic from './ProfilePic';
import axios from './axios';
import Logo from './Logo';
import FriendButton from './FriendButton';

export default class OtherUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        axios.get(`/get-user/${this.props.match.params.id}`).then(res => {

            if (res.data.data != 'same') {
                console.log("From componentDidMount");
                const {
                    firstname,
                    lastname,
                    email,
                    id,
                    url,
                    bio
                } = res.data.userInfo;

                let friendshipStatus;
                let recipientId;
                let senderId

                if(res.data.friendshipStatus){
                    console.log(res.data.friendshipStatus);
                friendshipStatus  = res.data.friendshipStatus.status;
                recipientId = res.data.friendshipStatus.recipient_id;
                senderId = res.data.friendshipStatus.sender
                } else {
                    friendshipStatus = 0;
                }

                this.setState(
                    { firstname, lastname, email, id, url, bio, friendshipStatus, recipientId, senderId  },
                    function() {
                        console.log(
                            "Res data", this.state
                        );
                    }
                );
            } else {
                this.props.history.push('/');
            }
        });

        //getOtherInfor/2 --> setState with all user info and friendship status
        //then we pass this.state.friendshipStatus to my button
    }

    render() {
        console.log("Before if", this.props);
        if(typeof this.state.friendshipStatus === "undefined") {
            return (<div>Loading...</div>);
        }
        console.log("From OtherUser render ", this.state);
        return (
            <div className="app-content">

                    <div className="app-logo">
                    </div>
                    {this.state.showUploader && (
                        <ProfilePicUpload
                            changeImageUrl={this.changeImageUrl}
                        />
                    )}


                <div className="profile-content">
                    <div>
                        <ProfilePic
                            firstname={this.state.firstname}
                            lastname={this.state.lastname}
                            email={this.state.email}
                            url={this.state.url}
                            className="profile-pic-big"
                        />
                    </div>
                    <div className="profile-info">
                        <p style={{ fontSize: 22 + 'px', padding: 0 + 'px' }}>
                            Name: {this.state.firstname} {this.state.lastname}
                        </p>
                        <p>Email: {this.state.email}</p>
                        <p>Bio: {this.state.bio}</p>
                        <FriendButton
                            id={this.state.id}
                            friendshipStatus={this.state.friendshipStatus}
                            recipientId={this.state.recipientId}
                            senderId={this.state.senderId}
                            otherId={this.props.match.params.id}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
