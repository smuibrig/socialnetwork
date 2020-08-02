import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => {
        if (state) {
            return state.chatMessages;
        }
        return [];
    });

    useEffect(() => {
        // console.log('chat hooks component has mounted');
        const clientHeight = elemRef.current.clientHeight;
        const scrollHeight = elemRef.current.scrollHeight;
        elemRef.current.scrollTop = scrollHeight - clientHeight;
    }, [chatMessages]);

    const keyCheck = (e) => {
        console.log(e.target.value);
        if (e.key === "Enter") {
            e.preventDefault(); // this will prevent going to the next line
            socket.emit("My amazing chat message", e.target.value);
            e.target.value = ""; // clears input field after we click enter
        }
    };

    return (
        <div className="chat-component">
            <h2>Welcome to the chat</h2>
            <div className="chat-messages-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((user, index) => (
                        <div className="chat" key={index}>
                            <div className="message-name-date">
                                <img className="chat-pics" src={user.url} />
                                <p className="message">{user.message}</p>
                            </div>
                            <div className="name-date">
                                <Link to={`/user/${user.id}`}>
                                    
                                        {user.first} {user.last}
                                    
                                </Link>
                                {user.created_at}
                            </div>
                        </div>
                    ))}
            </div>
            <textarea
                className="chat-textarea"
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}

