import axios from 'axios';

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
