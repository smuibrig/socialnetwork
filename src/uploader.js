import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: "",
            file: null,
        };
        this.fileChange = this.fileChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    fileChange(e) {
        let f = e.target.files[0];
        this.setState({
            file: f,
        });
    }

    componentDidMount() {
        console.log("props of the uploader: ", this.props);
        console.log(this.state.file);
    }

    handleUpload(e) {
        e.preventDefault();

        if (!this.state.file) {
            this.setState({
                errorMessage: "Please chose a valid image format",
            });
            return;
        }
        let formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/profilepic", formData)
            .then((response) => {
                console.log(response.data.url);
                this.props.setPic(response.data.url);
            })
            .catch((err) => {
                this.setState({
                    errorMessage: err.response.data.message,
                });
            });
    }

    render() {
        return (
            <div className="flex-column">
                <div className="modal">
                    <span id="x-modal" onClick={this.props.closeModal}>
                        X
                    </span>
                    <h3>Upload a new profile picture here</h3>
                    <div className="flex-column">
                        <input
                            className="friends-buttons"
                            type="file"
                            onChange={this.fileChange}
                        />
                        <button
                            className="friends-buttons"
                            onClick={this.handleUpload}
                        >
                            Upload
                        </button>
                    </div>
                    <h3 className="error"> {this.state.errorMessage}</h3>
                </div>
            </div>
        );
    }
}
