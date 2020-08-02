import React from "react";

export default function ProfilePic(props) {
    if (props.pic) {
        return (
            <div>
                <img className="profile-pic" onClick={ props.toggleModal } src={props.pic} />
            </div>
        ); 
    } else {
        return (
            <div>
                <img className="profile-pic" onClick={ props.toggleModal } src="/avatar.png" />
            </div>
        );
    }
}

