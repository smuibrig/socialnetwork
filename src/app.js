import React from "react";
import axios from "./axios";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import Chat from "./chat";
import Navbar from "./navbar";
import Logout from "./logout";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            userData: {},
            uploaderIsVisible: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.setPic = this.setPic.bind(this);
        this.setBio = this.setBio.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        axios
            .get("/user.json")
            .then((response) => {
                this.setState({
                    userData: response.data,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    toggleModal() {
        console.log(
            "Test if clicking on the p-tag actually triggers toggleModal"
        );
        this.setState({
            uploaderIsVisible: true,
        });
    }

    closeModal() {
        this.setState({
            uploaderIsVisible: false,
        });
        console.log("Close modal clickhandler works");
    }

    setPic(newProfilePic) {
        this.setState({
            userData: {
                ...this.state.userData,
                url: newProfilePic,
            },
            uploaderIsVisible: false,
        });
    }

    setBio(newBio) {
        this.setState({
            userData: {
                ...this.state.userData,
                bio: newBio,
            },
            uploaderIsVisible: false,
        });
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <Route
                        path="/"
                        render={() => <Navbar pic={this.state.userData.url} />}
                    />

                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                firstName={this.state.userData.first}
                                lastName={this.state.userData.last}
                                pic={this.state.userData.url}
                                bio={this.state.userData.bio}
                                toggleModal={this.toggleModal}
                                setBio={this.setBio}
                            />
                        )}
                    />
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                userId={this.state.userData.id}
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route path="/friends" render={() => <Friends />} />
                    <Route path="/users" render={() => <FindPeople />} />
                    <Route path="/chat" render={() => <Chat />} />
                    <Route path="/logout" render={() => <Logout />} />
                </BrowserRouter>
                {this.state.uploaderIsVisible && (
                    <Uploader
                        closeModal={this.closeModal}
                        setPic={this.setPic}
                    />
                )}
            </div>
        );
    }
}
