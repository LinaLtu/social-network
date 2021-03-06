import React from 'react';
import axios from './axios';
import {
    getFriendshipRequests,
    makeFriend,
    endFriendship,
    rejectRequest
} from './actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

function mapStateToProps(state) {
    return {
        potentialFriends:
            state.users && state.users.filter(users => users.status == 1),

        acceptedFriends:
            state.users && state.users.filter(users => users.status == 2)
    };
}

class Friends extends React.Component {
    componentDidMount() {
        this.props.dispatch(getFriendshipRequests());
    }
    render() {
        if (!this.props.potentialFriends) {
            return null;
        }

        return (
            <div>
                <h1 className="friends-h1">
                    People who would like to be friends with you
                </h1>
                <div className="friends-container">
                    {this.props.potentialFriends.map(potentialFriend => {
                        return (
                            <div
                                key={potentialFriend.id}
                                className="friends-item"
                            >
                                <Link to={`/user/${potentialFriend.id}`}>
                                    <div className="friend-img">
                                        <img
                                            src={`https://s3.amazonaws.com/bodyjamnetwork/${
                                                potentialFriend.url
                                            }`}
                                        />
                                    </div>
                                </Link>
                                <div className="friend-info">
                                    {potentialFriend.firstname} <br />
                                    {potentialFriend.lastname}
                                </div>
                                <button
                                    className="friend-btn"
                                    onClick={() =>
                                        this.props.dispatch(
                                            makeFriend(potentialFriend.id)
                                        )
                                    }
                                >
                                    Accept Friend Request
                                </button>
                                <button
                                    className="friend-btn"
                                    onClick={() =>
                                        this.props.dispatch(
                                            rejectRequest(potentialFriend.id)
                                        )
                                    }
                                >
                                    Reject Request
                                </button>
                            </div>
                        );
                    })}
                </div>
                <h1 className="friends-h1">Your friends</h1>
                <div className="friends-container">
                    {this.props.acceptedFriends.map(acceptedFriend => {
                        return (
                            <div
                                key={acceptedFriend.id}
                                className="friends-item"
                            >
                                <Link to={`/user/${acceptedFriend.id}`}>
                                    <div className="friend-img">
                                        <img
                                            src={`https://s3.amazonaws.com/bodyjamnetwork/${
                                                acceptedFriend.url
                                            }`}
                                        />
                                    </div>
                                </Link>
                                <div className="friend-info">
                                    {acceptedFriend.firstname} <br />
                                    {acceptedFriend.lastname}
                                </div>
                                <button
                                    className="friend-btn"
                                    onClick={() =>
                                        this.props.dispatch(
                                            endFriendship(acceptedFriend.id)
                                        )
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Friends);
