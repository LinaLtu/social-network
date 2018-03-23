export default function(state = {}, action) {
    if (action.type == 'RECEIVE_FRIENDSHIP_REQUESTS') {
        state = Object.assign({}, state, {
            users: action.users
        });
        //console.log("State from action", state.users[0].firstname);
    }


    if (action.type == 'ACCEPT_REQUEST') {
        state = Object.assign({}, state, {
            users: state.users.map(function(user) {
                if(user.id == action.id){  ////what should I look at here?
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
                if(user.id == action.id){  ////what should I look at here?
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
        return state;
}

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
