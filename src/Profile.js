import React from 'react';
import ProfilePic from './ProfilePic';
import axios from './axios';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddBio: false,
            newBio: this.props.bio
        };

        this.toggleBio = this.toggleBio.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    toggleBio() {
        this.setState({ showAddBio: !this.state.showAddBio });
    }

    handleChange(e) {
        this.setState({ newBio: e.target.value });
    }

    render() {
        return (
            <div className="profile-content">
                <div>
                    <ProfilePic
                        firstname={this.props.firstname}
                        lastname={this.props.lastname}
                        email={this.props.email}
                        url={this.props.url}
                    />
                </div>
                <div className="profile-info">
                    <p style={{ fontSize: 22 + 'px', padding: 0 + 'px' }}>
                        Name: {this.props.firstname} {this.props.lastname}
                    </p>
                    <p>Email: {this.props.email}</p>
                    {this.props.bio && (
                        <p>
                            Bio: {this.props.bio}
                            <button
                                className="bio-btn"
                                onClick={this.toggleBio}
                            >
                                Edit your Bio
                            </button>
                        </p>
                    )}

                    {!this.props.bio && (
                        <button className="bio-btn" onClick={this.toggleBio}>
                            Add your Bio
                        </button>
                    )}

                    <br />
                    <br />
                    {this.state.showAddBio && (
                        <div className="textarea">
                            <textarea
                                rows="5"
                                cols="60"
                                name="bio"
                                defaultValue={this.props.bio}
                                onChange={this.handleChange}
                            />
                            <br />
                            <button
                                className="send-btn"
                                onClick={() => {
                                    this.props.setBio(this.state.newBio);
                                    this.setState({ showAddBio: false });
                                }}
                            >
                                Send
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
