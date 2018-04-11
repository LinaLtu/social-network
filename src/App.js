import React from 'react';
import Welcome from './Welcome';
import Logo from './Logo';
import Nav from './Nav';
import Chat from './Chat';
import ProfilePic from './ProfilePic';
import ProfilePicUpload from './ProfilePicUpload';
import OtherUser from './OtherUser';
import axios from './axios';
import Profile from './Profile';
import Friends from './Friends';
import OnlineUsers from './OnlineUsers';
import { BrowserRouter, Link, Route } from 'react-router-dom';

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            id: '',
            firstname: '',
            lastname: '',
            email: '',
            url: '/placeholder-img.jpg',
            bio: '',
            showUploader: false
        };

        this.toggleUploader = this.toggleUploader.bind(this);
        this.changeImageUrl = this.changeImageUrl.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        axios.get('/user').then(res => {
            const { firstname, lastname, email, id, url, bio } = res.data.data;
            this.setState(
                { id, firstname, lastname, email, bio },
                function() {}
            );

            if (url) {
                this.setState({ url: url });
            }
        });
    }

    toggleUploader() {
        this.setState({ showUploader: !this.state.showUploader });
    }

    setBio(newBio) {
        axios.put(`/user/${this.state.id}`, { bio: newBio }).then(res => {
            this.setState({ bio: newBio });
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app-content">
                    <div className="app-header">
                        <div className="app-logo">
                            <Logo />
                        </div>
                        <div className="app-nav">
                            <Nav />
                        </div>
                        <div className="app-profile-pic">
                            {this.state.showUploader && (
                                <ProfilePicUpload
                                    changeImageUrl={this.changeImageUrl}
                                />
                            )}

                            <ProfilePic
                                toggleUploader={this.toggleUploader}
                                firstname={this.state.firstname}
                                lastname={this.state.lastname}
                                email={this.state.email}
                                url={this.state.url}
                                className="profile-pic-small"
                            />
                        </div>
                    </div>
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    firstname={this.state.firstname}
                                    lastname={this.state.lastname}
                                    email={this.state.email}
                                    url={this.state.url}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                    toggleUploader={this.toggleUploader}
                                />
                            )}
                        />
                        <Route exact path="/user/:id" component={OtherUser} />
                        <Route exact path="/friends" component={Friends} />
                        <Route
                            exact
                            path="/online-users"
                            component={OnlineUsers}
                        />
                        <Route
                            exact
                            path="/chat"
                            render={() => (
                                <Chat
                                    firstname={this.state.firstname}
                                    lastname={this.state.lastname}
                                    url={this.state.url}
                                    id={this.state.id}
                                />
                            )}
                        />
                    </div>
                </div>
            </BrowserRouter>
        );
    }

    changeImageUrl(url) {
        this.setState({
            url: url
        });
    }
}
