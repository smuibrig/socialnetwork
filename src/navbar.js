import React from "react";
import { Link } from "react-router-dom";


export default function Navbar(props) {
    function setNavbar() {
        if (window.location.pathname == "/chat") {
            return (
                <div className="header">
                    <img className="logo" src="/logo.png" />
                    <Link to="/">Your profile</Link>
                    <Link to="/users">Find friends</Link>
                    <Link to="/friends">Your friends</Link>
                    <Link to="/logout">Logout</Link>
                    {props.pic && <img className="thumbnail" src={props.pic} />}
                    {!props.pic && (
                        <img className="thumbnail" src="/avatar.png" />
                    )}
                </div>
            );
        } else if (window.location.pathname == "/") {
            return (
                <div className="header">
                    <img className="logo" src="/logo.png" />
                    <Link to="/chat">Chat with your friends</Link>
                    <Link to="/users">Find people</Link>
                    <Link to="/friends">Your friends</Link>
                    <Link to="/logout">Logout</Link>
                    {props.pic && <img className="thumbnail" src={props.pic} />}
                    {!props.pic && (
                        <img className="thumbnail" src="/avatar.png" />
                    )}
                </div>
            );
        } else if (window.location.pathname == "/users") {
            return (
                <div className="header">
                    <img className="logo" src="/logo.png" />
                    <Link to="/">Your profile</Link>
                    <Link to="/chat">Chat with your friends</Link>
                    <Link to="/friends">Your friends</Link>
                    <Link to="/logout">Logout</Link>
                    {props.pic && <img className="thumbnail" src={props.pic} />}
                    {!props.pic && (
                        <img className="thumbnail" src="/avatar.png" />
                    )}
                </div>
            );
        } else if (window.location.pathname.startsWith("/user/")) {
            return (
                <div className="header">
                    <img className="logo" src="/logo.png" />
                    <Link to="/">Your profile</Link>
                    <Link to="/chat">Chat with your friends</Link>
                    <Link to="/users">Find people</Link>
                    <Link to="/friends">Your friends</Link>
                    <Link to="/logout">Logout</Link>
                    {props.pic && <img className="thumbnail" src={props.pic} />}
                    {!props.pic && (
                        <img className="thumbnail" src="/avatar.png" />
                    )}
                    
                </div>
            );
        } else if (window.location.pathname == "/friends") {
            return (
                <div className="header">
                    <img className="logo" src="/logo.png" />
                    <Link to="/">Your profile</Link>
                    <Link to="/chat">Chat with your friends</Link>
                    <Link to="/users">Find people</Link>
                    <Link to="/logout">Logout</Link>
                    {props.pic && <img className="thumbnail" src={props.pic} />}
                    {!props.pic && (
                        <img className="thumbnail" src="/avatar.png" />
                    )}
                   
                </div>
            );
        }
    }

    return <div>{setNavbar()}</div>;
}
