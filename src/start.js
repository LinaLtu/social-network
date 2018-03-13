import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Welcome from "./Welcome";

// /welcome -> not logged in
// / -> logged in

//both of these routes serve the same index.html, we determine in an if statement which one to render
// this is how we look at the URL -> location.pathname
// if (lacation.pathname == "/welcome") {render }

if( location.pathname != "/welcome" ) {
    ReactDOM.render(<App />, document.querySelector("main"))
} else {
    ReactDOM.render(<Welcome />, document.querySelector("main"));
}




// function HelloWorld() {
//     return (
//             <div>Hello, World!</div>
//         )
// }
