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
                if(user.id == action.id){
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
                if(user.id == action.id){
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
        console.log("Action", action);
        state = Object.assign({}, state, {
            visitors: state.visitors.concat(action.visitors)
        });
    }

//how to remove user from the list?

    if (action.type == 'USER_LEFT') {
        console.log("Action", action);
        //action.id == id of the user who has left
        var newVisitors = state.visitors.filter(function(visitor){
            return visitor.id != action.id
        })
console.log("New visitors2 ", newVisitors);
        state = Object.assign({}, state, {
            visitors: newVisitors
        });
    }
    console.log("State ", state);

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
