import axios from 'axios';

export function receiveUsers() {
    return axios.get('/users').then(function({ data }) {
        return {
            type: 'RECEIVE_USERS',
            users: data.users
        };
    });
}

export function makeHot(id) {
    return axios.post('/hot/' + id).then(function() {
        return {
            type: 'MAKE_HOT',
            id: id
        };
    });
}

export function makeNot(id) {
    return axios.post('/hot/' + id).then(function() {
        return {
            type: 'MAKE_HOT',
            id: id
        };
    });
}
