import React from 'react';

export default function User({ user, makeHot }) {
    return (
        <div className="user">
            <img src={user.image} />
            <div className="buttons">
                {!user.hot && <button onClick={() => makeHot(user.id)}>Hot</button>}
                {(user.hot || user.hot == null) && <button onClick={() => makeNot(user.id)}>Not</button>}
            </div>
        </div>
    );
}
