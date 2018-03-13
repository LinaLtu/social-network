import React from 'react';


//A functional component: (does not have a state):
export default function Singer(props) {
    console.log("My singer", props)
    return (
        <div className="singer">
            <h2>Name: {props.name}</h2>
            <h3>Band: {props.band}</h3>
        </div>
    )
}
