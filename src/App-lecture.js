import React from "react";
import Singer from "./Singer"
import axios from 'axios'
import NewSingerForm from "./NewSingerForm"

export default class App extends React.Component {
    constructor() {
        super()

        this.state = {
            singers: []    //default value when it initially loads, later will do an axios request to populare the array
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(name, band) {
        // e.preventDefault();
        console.log(name, band);
        const copy = this.state.singers.slice();  //slice without arguments creats a copy
        copy.push({name, band})
        this.setState( {singers: copy })  //when we set a state, it rerenders ad runs through the life circle again
        //you need to do axios.post request to update the DB


        //do an axios post to submit this data to our DB
    }

   //whenever we use this, we need to bind it

    componentDidMount(){
        axios.get('/singers')
            .then(res => {
                //React has a special method for setting state
                console.log("New state", res.data);
                this.setState({ singers: res.data }, () => {
                    console.log("New state", res.data);
                })
            }
    )}


//a method, this is not a functional component
    renderSingers() {
        if(!this.state.singers.length === 0) {    //accessing state => checks it the singers array is empty/ This will never happen because an empty array is truthy
            return (
                <div>
                    Loading singers..
                </div>
            )
        }


        console.log("Current state", this.state);

        return this.state.singers.map(singer => {

            return (
                <Singer
                    key = { singer.name }
                    name = { singer.name }
                    band = { singer.band }
                />
            )    //this is how we pass a prop to a component
        })
    }

    // we render a method on a class this.method

    render() {
        return (
            <div>
                <h1>My singers</h1>
                <NewSingerForm
                    handleSubmit={ this.handleSbmit }
                    />
                { this.renderSingers() }
            </div>
        );
    }
}
