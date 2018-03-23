import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Welcome from './Welcome';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import reducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as io from 'socket.io-client';

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

const elem = (
    <Provider store={store}>
        <App />
    </Provider>
);

// /welcome -> not logged in
// / -> logged in

//both of these routes serve the same index.html, we determine in an if statement which one to render
// this is how we look at the URL -> location.pathname
// if (lacation.pathname == "/welcome") {render }

if (location.pathname != '/welcome') {
    ReactDOM.render(elem, document.querySelector('main'));
} else {
    ReactDOM.render(<Welcome />, document.querySelector('main'));
}

io.connect();
