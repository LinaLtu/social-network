import React from "react";

export default function ProfilePic(props) {
    return (
        <div className="profile-pic">
            <img
                src={props.url}
                alt={`${props.firstname} ${props.lastname}`}
                onClick={props.toggleUploader}
            />
            {/*<button onclick={props.toggleUploader}> ToggleUploader </button>*/}
        </div>
    );
}
