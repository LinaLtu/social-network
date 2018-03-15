import React from "react";
import { Link } from 'react-router-dom';
import axios from "./axios";

export default class Login extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            email: '',
            password: '',
            error: false

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

     handleSubmit(e) {
          e.preventDefault();
          axios.post("/login",
                  {
                      email: this.state.email,
                      password: this.state.password
                  })
                  .then((results) => {
                      console.log("Success", results.data);
                      if(results.data.success == false){
                          this.setState({ error: true })
            } else {
                location.replace("/");
            }
           });
       }

       handleChange(e) {
           this.setState({
               [ e.target.name ]: e.target.value
           });
       }


    render() {
        return (
            <div className="login">
                <form className="login-form">
                    <div clasName="form-inputs">
                        <input onChange={ this.handleChange } name="email" type="text" placeholder = "Email" className = "form-element" /><br/>
                        <input onChange={ this.handleChange } name="password" type="password" placeholder = "Password" className = "form-element" /><br/>
                        <button onClick={ this.handleSubmit } className = "form-btn">Log In</button>
                    </div>
                </form>
                { this.state.error && <div className="error">Something went wrong</div> }
                <h4>Not registered? <Link to="/">Click here to Register</Link></h4>
          </div>
        )
}

}

        // { this.state.error && <div className="error">Something went wrong</div> }

    // constructor(props){
    //     super(props)
    //
    //     this.state = {
    //         firstname: '',
    //         lastname: '',
    //         email: '',
    //         password: '',
    //         error: false
    //
    //     }
    //
    //     this.handleChange = this.handleChange.bind(this);
    //     this.handleSubmit = this.handleSubmit.bind(this);
    //
    // }
//
//     handleChange(e) {
//         this.setState({
//             [ e.target.name ]: e.target.value     ///it's taking name="band" and making it the key
//         });
//     }
//
//
//     handleSubmit(e) {
//         e.preventDefault();
//         console.log("Info", this.state);
//
        // axios.post("/registration",
        // {
        //     firstname: this.state.firstname,
        //     lastname: this.state.lastname,
        //     email: this.state.email,
        //     password: this.state.password }
        // )
        //         .then((results) => {
        //             console.log("Success", results.data);
        //             if(results.data.success == false){
        //                 this.setState({
        //                     error: true
        //                 })
        //             } else {
        //                 location.replace("/");
        //             }
        //         });
        //     }
//
//     render() {
//         const  { firstname, lastname, email, password } = this.state;
//         return (
//                 <div className="form">
//                     <form className="registration-form">
//                         <input onChange={ this.handleChange } name="firstname" type="text" placeholder = "First Name" className = "form-element" /><br/>
//                         <input onChange={ this.handleChange } name="lastname" type="text" placeholder = "Last Name" className = "form-element" /><br/>
//                         <input onChange={ this.handleChange } name="email" type="text" placeholder = "Email" className = "form-element" /><br/>
//                         <input onChange={ this.handleChange } name="password" type="password" placeholder = "Password" className = "form-element" /><br/>
//                         <button onClick={ this.handleSubmit } className = "form-btn">Let's Dance!</button>
//                     </form>
//                     { this.state.error && <div className="error">Something went wrong</div> }
//                     <h4>Already registered?<Link to="/login">Click here to Log in!</Link></h4>
//                 </div>
//
//         )
//     }
// }
