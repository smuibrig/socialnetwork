import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            code: "",
            password: "",
            errorMessage: "",
            display: 0,
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitEmail = this.submitEmail.bind(this);
        this.submitCode = this.submitCode.bind(this);
        this.getCurrentDisplay = this.getCurrentDisplay.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submitEmail(e) {
        e.preventDefault();
        const { email } = this.state;
        axios
            .post("/reset/start", { email })
            .then(() => {
                this.setState({
                    display: 1,
                });
            })
            .catch((err) => {
                this.setState({
                    errorMessage: err.response.data.message,
                });
            });
    }

    submitCode(e) {
        e.preventDefault();
        const { password, code, email } = this.state;
        console.log({ password, code, email });
        axios
            .post("/reset/verify", { password, code, email })
            .then(() => {
                this.setState({
                    display: 2,
                });
            })
            .catch((err) => {
                this.setState({
                    errorMessage: err.response.data.message,
                });
            });
    }

    getCurrentDisplay(display) {
        if (display === 0) {
            return (
                <div className="flex-column">
                    <h3>Reset Password</h3>
                    <p>
                        Please enter the email address with which you registered
                    </p>
                    <h3 className="error"> {this.state.errorMessage} </h3>
                    <form onSubmit={this.submitCode}></form>
                    <form className="flex-column" onSubmit={this.submitEmail}>
                        <input
                            className="login-input"
                            name="email"
                            type="text"
                            placeholder="Email"
                            onChange={this.handleChange}
                        />
                        <button>Submit</button>
                    </form>
                    <p>
                        Wrong place? <Link to="/login">Go back</Link>
                    </p>
                </div>
            );
        } else if (display === 1) {
            return (
                <div className="flex-column">
                    <h3>Reset Password</h3>
                    <p>Please enter the code you received and a new password</p>
                    <h3 className="error"> {this.state.errorMessage}</h3>
                    <form className="flex-column" onSubmit={this.submitCode}>
                        <input
                            className="login-input"
                            name="code"
                            type="text"
                            placeholder="Code"
                            onChange={this.handleChange}
                        />
                        <input
                            className="login-input"
                            name="password"
                            type="password"
                            placeholder="New password"
                            onChange={this.handleChange}
                        />
                        <button>Submit</button>
                    </form>
                </div>
            );
        } else {
            return (
                <div className="flex-column">
                    <h3>Reset Password</h3>
                    <h2>Success!</h2>
                    <p>
                        You can login with your new password <Link to="/login"> here</Link>
                    </p>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="flex-column center">
                {this.getCurrentDisplay(this.state.display)}
            </div>
        );
    }
}
