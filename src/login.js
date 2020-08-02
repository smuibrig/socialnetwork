import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errorMessage: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleSubmit(event) {
        const data = this.state;
        axios
            .post("/login", data)
            .then((response) => {
                console.log(response);
                location.replace("/");
            })
            .catch((err) => {
                this.setState({
                    errorMessage: err.response.data.message,
                });
                console.log(this.state.errorMessage);
            });

        event.preventDefault();
    }

    render() {
        return (
            <div className="flex-column center">
                <img className="logo" src="/logo.png" />
                <form className="flex-column"  onSubmit={this.handleSubmit}>
                    <input
                        className="login-input"
                        name="email"
                        type="text"
                        placeholder="Email"
                        onChange={this.handleChange}
                    />
                    <input
                        className="login-input"
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={this.handleChange}
                    />

                    <button className="friends-buttons">Submit</button>
                </form>

                <h3 className="error"> {this.state.errorMessage} </h3>

                <div>
                    Not yest registered? <Link to="/">Click here</Link>
                </div>
                <div>
                    Forgot your password? <Link to="/reset">Go here</Link>
                </div>
            </div>
        );
    }
}
