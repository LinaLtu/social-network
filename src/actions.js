import axios from './axios';

export function getFriendshipRequests() {
        console.log("From Actions before axios");
    return axios.get('/get-friends').then(function({ data }) {
        console.log("From Actions", data);
        return {
            type: 'RECEIVE_FRIENDSHIP_REQUESTS',
            users: data.data
        };
    });
}

export function makeFriend(id) {
    return axios.post('/accept-request/' + id).then(function() {
        return {
            type: 'ACCEPT_REQUEST',
            id: id
        };
    });
}

export function endFriendship(id) {
    return axios.post('/delete-friend/' + id).then(function() {
        return {
            type: 'END_FRIENDSHIP',
            id: id
        };
    });

}

export function rejectRequest(id) {
    return axios.post('/reject-request/' + id).then(function() {
        return {
            type: 'REJECT_REQUEST',
            id: id
        };
    });

}

export function onlineUsers(data){
    return {
        type: 'ONLINE_USERS',
        visitors: data
    };
}

export function userJoined(data){
    console.log("From userJoined");
    return {
        type: 'USER_JOINED',
        visitors: data
    };
}

export function userLeft(data){
    console.log("From user", data);
    return {
        type: 'USER_LEFT',
        id: data
    };
}
