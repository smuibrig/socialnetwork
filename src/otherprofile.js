import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios
            .get(`/user/${id}.json`)
            .then((response) => {
                console.log("response.data", response.data);
                if (response.data.idsMatch) {
                    return;
                }
                this.setState({
                    userData: response.data,
                });
            })
            .catch((err) => {
                console.log(
                    "Error thrown when getting OtherProfileData: ",
                    err
                );
            });
    }

    componentDidUpdate() {
        if (this.props.userId == this.state.userData.id) {
            this.props.history.push("/");
        }
    }

    renderImage() {
        if (this.state.userData.url) {
            return (
                <img src={this.state.userData.url} className="profile-pic" />
            );
        } else {
            return <img src="/avatar.png" className="profile-pic" />;
        }
    }

    renderBio() {
        if (this.state.userData.bio) {
            return (
                <div className="flex-column">
                    <h3 className="about-me-bio">About me</h3>
                    <p className="bio-text">{this.state.userData.bio}</p>
                </div>
            );
        } else {
            return (
                <div className="flex-column">
                    <h3>The user has not provided a bio yet</h3>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="flex-column">
                <h3>
                    {this.state.userData.first} {this.state.userData.last}
                </h3>
                {this.renderImage()}
                {this.renderBio()}
                <FriendButton userId={this.state.userData.id} />
            </div>
        );
    }
}
