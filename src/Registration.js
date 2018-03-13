import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor(){
        super()

        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',

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
                .then(function(results) {
                    console.log("Success", results.data);
    ///change url to slash
                location.replace("/");
                });
            }

    render() {
        const  { firstname, lastname, email, password } = this.state;
        return (

                <form className="registration-form">
                    <input onChange={ this.handleChange } name="firstname" type="text" placeholder = "First Name" className = "form-element" /><br/>
                    <input onChange={ this.handleChange } name="lastname" type="text" placeholder = "Last Name" className = "form-element" /><br/>
                    <input onChange={ this.handleChange } name="email" type="text" placeholder = "Email" className = "form-element" /><br/>
                    <input onChange={ this.handleChange } name="password" type="password" placeholder = "Password" className = "form-element" /><br/>
                    <button onClick={ this.handleSubmit } className = "form-btn">Let's Dance!</button>
                </form>

        )
    }
}
