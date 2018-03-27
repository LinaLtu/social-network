import * as io from 'socket.io-client';
import { createStore, applyMiddleware } from 'redux';
import { onlineUsers, userJoined, userLeft, chat, chats } from './actions';
import reducer from './reducers';
import reduxPromise from 'redux-promise';
import { store } from './start';

let socket;

//we don't want a connection if the user is not logged in

export function initSocket() {
    console.log('Store ', store);
    if (!socket) {
        socket = io.connect();
        socket.on('onlineUsers', visitors => {
            console.log('Visitors ', visitors);
            store.dispatch(onlineUsers(visitors));
            //it just shows a list of users, it is not really "real time"
        });

        socket.on('userJoined', visitor => {
            //store.dispatch
            console.log('Visitors from user joined ', visitor);
            store.dispatch(userJoined(visitor));
        });

        socket.on('userLeft', id => {
            console.log('User who left');
            store.dispatch(userLeft(id));
        });

        socket.on('chat', msg => {
            store.dispatch(chat(msg));
        }); //action

        socket.on('chats', msg => {
            console.log('Our msg ', msg);
            store.dispatch(chats(msg));
        }); //action for 1 message
    }

    return socket;
}

export function emitChatMessage(message) {
    // console.log('From emit ', message);
    socket.emit('chatMessage', message);
}
