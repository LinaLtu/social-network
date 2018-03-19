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
            if (res.data.userInfo != 'same') {
                const {
                    firstname,
                    lastname,
                    email,
                    id,
                    url,
                    bio
                } = res.data.userInfo;
                const friendshipStatus  = res.data.friendshipStatus.status;
                this.setState(
                    { firstname, lastname, email, id, url, bio, friendshipStatus },
                    function() {
                        console.log(
                            "Res data", friendshipStatus
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
        return (
            <div className="app-content">
                <div className="app-header">
                    <div className="app-logo">
                        <Logo />
                    </div>
                    {this.state.showUploader && (
                        <ProfilePicUpload
                            changeImageUrl={this.changeImageUrl}
                        />
                    )}
                </div>

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
                        />
                    </div>
                </div>
            </div>
        );
    }
}
