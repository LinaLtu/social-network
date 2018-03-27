import React from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';

export default class Nav extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/friends">Friends</Link></li>
                    <li><Link to="/online-users">Online</Link></li>
                    <li><Link to="/chat">Chat</Link></li>
                </ul>

        )
    }
}
