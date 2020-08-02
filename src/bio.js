import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: "",
            edit: false,
            bio: "",
        };
        this.updateBio = this.updateBio.bind(this);
        this.uploadBio = this.uploadBio.bind(this);
        this.editBio = this.editBio.bind(this);
    }

    updateBio(e) {
        this.setState({
            bio: e.target.value,
        });
    }

    editBio() {
        this.setState({
            edit: true,
        });
    }

    uploadBio() {
        const bio = this.state.bio;
        if (bio == "") {
            this.setState({
                errorMessage:
                    "Please write somthing about yourself before submitting",
            });
            return;
        }

        axios
            .post("/bio", { bio: bio })
            .then(() => {
                this.props.setBio(bio);
                this.setState({
                    edit: false,
                });
            })
            .catch((err) => {
                console.log("Setting the bio didn't work because: ", err);
                this.setState({
                    errorMessage: "Something went wrong",
                });
            });
    }

    renderBioEditor() {
        if (!this.state.edit) {
            if (this.props.bio) {
                return (
                    <div className="flex-column">
                        <h3 className="about-me-bio">About me</h3>
                        <p className="bio-text">{this.props.bio}</p>
                        <button
                            className="friends-buttons"
                            onClick={this.editBio}
                        >
                            Edit
                        </button>
                    </div>
                );
            } else {
                return (
                    <div className="flex-column">
                        <p className="bio-text">
                            Write something about yourself
                        </p>
                        <button
                            className="friends-buttons"
                            onClick={this.editBio}
                        >
                            Add your bio now{" "}
                        </button>
                    </div>
                );
            }
        } else {
            return (
                <div className="flex-column">
                    <textarea onChange={this.updateBio}></textarea>
                    <button
                        className="friends-buttons"
                        onClick={this.uploadBio}
                    >
                        Upload
                    </button>
                    <h3 className="error"> {this.state.errorMessage}</h3>
                </div>
            );
        }
    }

    render() {
        return <div className="flex-column">{this.renderBioEditor()}</div>;
    }
}
