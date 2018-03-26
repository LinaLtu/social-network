import React from "react";
import axios from "./axios";
import { Link } from 'react-router-dom';

export default class Registration extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            error: false

        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(e) {
        this.setState({
            [ e.target.name ]: e.target.value     ///it's taking name="band" and making it the key
        });
    }


    handleSubmit(e) {
        e.preventDefault();
        console.log("Info", this.state);

        axios.post("/registration",
        {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            password: this.state.password }
        )
                .then((results) => {
                    console.log("Success", results.data);
                    if(results.data.success == false){
                        this.setState({
                            error: true
                        })
                    } else {
                        location.replace("/");
                    }
                });
            }

    render() {
        const  { firstname, lastname, email, password } = this.state;
        return (
                <div className="form">
                    <form className="registration-form">
                        <div className="form-inputs">
                            <input onChange={ this.handleChange } name="firstname" type="text" placeholder = "First Name" className = "form-element" /><br/>
                            <input onChange={ this.handleChange } name="lastname" type="text" placeholder = "Last Name" className = "form-element" /><br/>
                            <input onChange={ this.handleChange } name="email" type="text" placeholder = "Email" className = "form-element" /><br/>
                            <input onChange={ this.handleChange } name="password" type="password" placeholder = "Password" className = "form-element" /><br/>
                            <button onClick={ this.handleSubmit } className = "form-btn">Join the Purple Wave!</button>
                        </div>
                    </form>
                    { this.state.error && <div className="error">Something went wrong</div> }
                    <h4>Already registered?<Link to="/login"> Click here to Log in!</Link></h4>
                </div>

        )
    }
}
