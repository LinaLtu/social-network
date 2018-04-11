import React from 'react';
import Registration from './Registration';
import Logo from './Logo';
import Login from './Login';
import { HashRouter, Route } from 'react-router-dom';

export default class Welcome extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        //
    }

    render() {
        return (
            <div className="content">
                <h1 className="welcome-h1">Welcome to the Purple Wave</h1>
                <Logo />

                <HashRouter>
                    <div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                    </div>
                </HashRouter>
            </div>
        );
    }
}
