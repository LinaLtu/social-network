import React from "react";
import Registration from "./Registration";
import Logo from "./Logo";
import Login from "./Login";
import { HashRouter, Route } from 'react-router-dom';


//we assigne a componant to a path. The component will be loaded exactly in that place
//if there was no "exact", both routs would be rendered because technically both are at '/'

export default class Welcome extends React.Component {
    constructor() {
        super()
    }

    componentDidMount(){
        //
        }

        render() {
            return (

                    <div className = "content">
                        <h1 className="welcome-h1">Welcome to the Purple Wave</h1>
                        <Logo />

                    <HashRouter>
                        <div>
                            <Route exact path="/" component= {Registration} />
                            <Route path="/login" component= {Login} />
                        </div>
                    </HashRouter>
                    </div>

            );
        }
}
