export default function(state = {}, action) {
    if (action.type == 'RECEIVE_USERS') {
        state = Object.assign({}, state, {
            users: action.users
        });
    }
    return state;


    if (action.type == 'MAKE_HOT' || action.type == 'MAKE_NOT'){
        return {
            ...state,
            users: state.users.map(function(user) {
                if (user.id == action.id) {
                    return {
                        ...user,
                        hot: (action.type == 'MAKE_HOT') //it will be true if type is MAKE_HOT, otherwise it will be false
                    };
                } else {
                    return user;
                }
            })
        }
    }
}
