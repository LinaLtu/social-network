import React from 'react';

export default function ProfilePic(props) {
    return (
        <div>
            <img
                src={props.url}
                alt={`${props.firstname} ${props.lastname}`}
                onClick={props.toggleUploader}
                className="img-circle"
            />
        </div>
    );
}
