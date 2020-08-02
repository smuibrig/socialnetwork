import React, { useState, useEffect } from "react";
import axios from "./axios";
import { render } from "react-dom";

export default function FriendButton({ userId }) {
    const [buttonText, setButtonText] = useState([]);
    const LABELS = {
        SEND: "Send friend request",
        ACCEPT: "Accept friend request",
        CANCEL: "Cancel friend request",
        END: "End friendship",
    };

    useEffect(() => {
        (async () => {
            if (!userId) {
                setButtonText("Loading friendship status...");
                return;
            }

            let status;
            try {
                status = await axios.get(`/api/friendship-status/${userId}`);
            } catch (err) {
                if (err.response.status == 404) {
                    setButtonText(LABELS.SEND);
                } else {
                    console.log("error: ", err);
                }
                return;
            }

            console.log("status.data: ", status.data); 
            console.log("status.accepted: ", status.data.accepted);

            if (status.data.accepted) {
                setButtonText(LABELS.END);
            } else {
                if (status.receiver_id == userId) {
                    setButtonText(LABELS.CANCEL);
                } else {
                    setButtonText(LABELS.ACCEPT);
                }
            }
        })();
    }, [userId]);

    async function handleClick() {
        let states = {
            [LABELS.SEND]: {
                path: `/make-friend-request/${userId}`,
                next: LABELS.CANCEL,
            },
            [LABELS.ACCEPT]: {
                path: `/accept-friend-request/${userId}`,
                next: LABELS.END,
            },
            [LABELS.CANCEL]: {
                path: `/end-friendship/${userId}`,
                next: LABELS.SEND,
            },
        };

        states[LABELS.END] = states[LABELS.CANCEL];

        let ok;
        try {
            ok = await axios.post(states[buttonText].path);
        } catch (err) {
            console.log(err);
        }

        if (ok) {
            setButtonText(states[buttonText].next);
        }
    }

    return (
        <div>
            <button className="friends-buttons"  onClick={handleClick}>{buttonText}</button>
        </div>
    );
}
