export default function(state = {}, action) {
    if (action.type == 'RECEIVE_FRIENDSHIP_REQUESTS') {
        state = Object.assign({}, state, {
            users: action.users
        });
    }
    return state;

    // if (action.type == 'RECEIVE_FRIENDSHIP_REQUESTS') {
    //     return {
    //         ...state,
    //         users: state.users.map(function(user) {
    //             if (user.id == action.id) {
    //                 return {
    //                     ...user,
    //                     hot: action.type == 'MAKE_HOT' //it will be true if type is MAKE_HOT, otherwise it will be false
    //                 };
    //             } else {
    //                 return user;
    //             }
    //         })
    //     };
    // }
}
