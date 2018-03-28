import React from 'react';
import axios from './axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

function mapStateToProps(state) {
    return {
        visitors: state.visitors || []
    };
}

class OnlineUsers extends React.Component {
    constructor() {
        super();
    }

    render() {
        if (!this.props.visitors) {
            return null;
        } else {
            console.log(this.props.visitors);
        }
        return (
            <div>
                <h1 className="friends-h1">Online Users</h1>
                <div className="friends-container">
                    {this.props.visitors.map(visitor => {
                        return (
                            <div key={visitor.id} className="friends-item">
                                <Link to={`/user/${visitor.id}`}>
                                    <div className="friend-img">
                                        <img
                                            src={`https://s3.amazonaws.com/bodyjamnetwork/${
                                                visitor.url
                                            }`}
                                        />
                                    </div>
                                </Link>
                                <div className="friend-info">
                                    {visitor.firstname} <br />
                                    {visitor.lastname}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(OnlineUsers);
