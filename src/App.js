import React from "react";
import Welcome from "./Welcome";
import Logo from "./Logo";

export default class App extends React.Component {
    constructor() {
        super()
    }

    componentDidMount(){
        //
        }

        render() {
            return (
                <div>
                    <Logo />
                </div>
            );
        }
}
