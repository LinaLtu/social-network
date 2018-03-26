import React from 'react';
import Welcome from './Welcome';
import Logo from './Logo';
import Nav from './Nav';
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
            this.setState({ id, firstname, lastname, email, bio }, function() {
                console.log('New state', this.state);
            });

            if (url) {
                this.setState({ url: url });
            }
        });
    }

    toggleUploader() {
        this.setState({ showUploader: !this.state.showUploader });
    }
    //showUploader is a boolean
    //Uploader is our modal <ProfilePicUploader />. When an image gets clicked on, toggleUploader runs - pass toggleUploader as a prop to ProfilePic

    // Inside of the ProfilePic:
    // ProfilePic(props){
    //     return (
    //         <div>
    //             <img>
    //             <button onclick={props.toggleUploader}>ToggleUploader </button>
    //         </div>
    //     )
    // }
    setBio(newBio) {
        console.log('Send button clicked', newBio);
        axios.put(`/user/${this.state.id}`, { bio: newBio }).then(res => {
            console.log('Res from setBio ', res.config.data);
            this.setState({ bio: newBio });
            // this.props.res.data.bio;
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
                        <Route exact path="/online-users" component={OnlineUsers} />

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

    // handleChange(e) {
    //     this.setState({
    //         [ e.target.name ]: e.target.files[0]
    //     },() => {console.log("New state", this.state)})
    // }
}

//will also have <Profile Pic /> (pass as props to our profile pic component)
// <ProfilePicUpload />
//setState -> to put info via props
//set default in the constructor
//formData.append to attach images that came from a form
