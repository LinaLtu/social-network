export default function(state = {}, action) {
    if (action.type == 'RECEIVE_FRIENDSHIP_REQUESTS') {
        state = Object.assign({}, state, {
            users: action.users
        });
    }

    if (action.type == 'ACCEPT_REQUEST') {
        state = Object.assign({}, state, {
            users: state.users.map(function(user) {
                if (user.id == action.id) {
                    ////what should I look at here?
                    return {
                        ...user,
                        status: 2
                    };
                } else {
                    return user;
                }
            })
        });
    }

    if (action.type == 'END_FRIENDSHIP') {
        state = Object.assign({}, state, {
            users: state.users.map(function(user) {
                if (user.id == action.id) {
                    return {
                        ...user,
                        status: 0
                    };
                } else {
                    return user;
                }
            })
        });
    }

    if (action.type == 'REJECT_REQUEST') {
        state = Object.assign({}, state, {
            users: state.users.map(function(user) {
                if (user.id == action.id) {
                    return {
                        ...user,
                        status: 3
                    };
                } else {
                    return user;
                }
            })
        });
    }

    if (action.type == 'ONLINE_USERS') {
        state = Object.assign({}, state, {
            visitors: action.visitors
        });
    }

    if (action.type == 'USER_JOINED') {
        state = Object.assign({}, state, {
            visitors: state.visitors.concat(action.visitors)
        });
    }

    if (action.type == 'USER_LEFT') {
        var newVisitors = state.visitors.filter(function(visitor) {
            return visitor.id != action.id;
        });

        state = Object.assign({}, state, {
            visitors: newVisitors
        });
    }

    if (action.type == 'CHAT_MESSAGE') {
        state = Object.assign({}, state, {
            chatMessages: [...state.chatMessages, action.message]
        });
    }

    if (action.type === 'CHAT_MESSAGES') {
        state = Object.assign({}, state, {
            chatMessages: action.messages
        });
    }

    return state;
}
