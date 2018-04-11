import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        axios
            .post('/login', {
                email: this.state.email,
                password: this.state.password
            })
            .then(results => {
                console.log('Success', results.data);
                if (results.data.success == false) {
                    this.setState({ error: true });
                } else {
                    location.replace('/');
                }
            });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div className="login">
                <form className="login-form">
                    <div className="form-inputs">
                        <input
                            onChange={this.handleChange}
                            name="email"
                            type="text"
                            placeholder="Email"
                            className="form-element"
                        />
                        <br />
                        <input
                            onChange={this.handleChange}
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="form-element"
                        />
                        <br />
                        <button
                            onClick={this.handleSubmit}
                            className="form-btn"
                        >
                            Log In
                        </button>
                    </div>
                </form>
                {this.state.error && (
                    <div className="error">Something went wrong</div>
                )}
                <h4>
                    Not registered? <Link to="/">Click here to Register</Link>
                </h4>
            </div>
        );
    }
}
