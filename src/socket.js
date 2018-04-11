import * as io from 'socket.io-client';
import { createStore, applyMiddleware } from 'redux';
import { onlineUsers, userJoined, userLeft, chat, chats } from './actions';
import reducer from './reducers';
import reduxPromise from 'redux-promise';
import { store } from './start';

let socket;

export function initSocket() {
    if (!socket) {
        socket = io.connect();
        socket.on('onlineUsers', visitors => {
            store.dispatch(onlineUsers(visitors));
        });

        socket.on('userJoined', visitor => {
            store.dispatch(userJoined(visitor));
        });

        socket.on('userLeft', id => {
            store.dispatch(userLeft(id));
        });

        socket.on('chat', msg => {
            store.dispatch(chat(msg));
        }); //action

        socket.on('chats', msg => {
            store.dispatch(chats(msg));
        });
    }

    return socket;
}

export function emitChatMessage(message) {
    socket.emit('chatMessage', message);
}
