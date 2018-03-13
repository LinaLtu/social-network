import React from "react";
import Registration from "./Registration";
import Logo from "./Logo";

export default class Welcome extends React.Component {
    constructor() {
        super()
    }

    componentDidMount(){
        //
        }

        render() {
            return (
                <div>
                    <div className = "content">
                        <h1 className="welcome-h1">Welcome to Berlin's Body Jammers' Community</h1>
                        <Logo />
                        <Registration />
                    </div>
                    <h4>Already registered? <a href="#">Log in</a></h4>
                </div>
            );
        }
}
