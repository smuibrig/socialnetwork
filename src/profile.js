import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bio";

export default function Profile(props) {
    console.log("Props in profile", props); 
    return (
        <div className="flex-column">
            <h2>{props.firstName} {props.lastName}</h2>
            <ProfilePic pic={props.pic} toggleModal={props.toggleModal}/>
            <BioEditor bio={props.bio} setBio={props.setBio}/>
        </div>
    );
}


